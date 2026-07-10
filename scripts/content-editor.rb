#!/usr/bin/env ruby
# frozen_string_literal: true

require "date"
require "digest"
require "fileutils"
require "json"
require "open3"
require "securerandom"
require "set"
require "socket"
require "tempfile"
require "time"
require "timeout"
require "tmpdir"
require "uri"
require "webrick"
require "yaml"

ROOT = File.expand_path(ENV.fetch("CONTENT_EDITOR_ROOT", ".."), __dir__)
ROOT_REAL = File.realpath(ROOT)
PORT = Integer(ENV.fetch("PORT", "4567"))
PREVIEW_BASE_URL = ENV.fetch("PREVIEW_URL", "http://127.0.0.1:4001")
STATIC_ROOT = File.expand_path(ENV.fetch("CONTENT_EDITOR_STATIC_ROOT", File.join(ROOT, "content-editor")))
SCHEMA_FILE = File.expand_path(ENV.fetch("CONTENT_EDITOR_SCHEMA", File.join(STATIC_ROOT, "schema.yml")))
STATE_ROOT = File.join(ROOT, ".content-editor")
MAX_JSON_BYTES = 2 * 1024 * 1024
MAX_UPLOAD_BYTES = 10 * 1024 * 1024
CSRF_TOKEN = SecureRandom.hex(32)

SINGLETON_FILES = {
  "site-settings" => File.join(ROOT, "_data", "site_settings.yml"),
  "homepage" => File.join(ROOT, "_data", "homepage.yml"),
  "about" => File.join(ROOT, "_data", "about.yml")
}.freeze

COLLECTION_DIRS = {
  "projects" => File.join(ROOT, "_projects"),
  "ai-products" => File.join(ROOT, "_ai_products"),
  "ai-gallery" => File.join(ROOT, "_ai_gallery")
}.freeze

ARCHIVE_FILE = File.join(ROOT, "_data", "worksarchive.yml")
BLOG_DIR = File.join(ROOT, "_posts")

MEDIA_ROOTS = {
  "site-settings" => File.join(ROOT, "img", "portfolio", "homepage"),
  "homepage" => File.join(ROOT, "img", "portfolio", "homepage"),
  "projects" => File.join(ROOT, "img", "portfolio", "real-works"),
  "ai-products" => File.join(ROOT, "img", "ai-products"),
  "ai-gallery" => File.join(ROOT, "img", "ai-gallery"),
  "archive" => File.join(ROOT, "img", "portfolio", "real-works", "archive"),
  "about" => File.join(ROOT, "img", "portfolio", "about"),
  "blog" => File.join(ROOT, "img", "posts")
}.freeze

WRITE_FILES = (SINGLETON_FILES.values + [ARCHIVE_FILE]).map { |path| File.expand_path(path) }.freeze

WRITE_ROOTS = (
  COLLECTION_DIRS.values +
  [BLOG_DIR] +
  MEDIA_ROOTS.values
).map { |path| File.expand_path(path) }.uniq.freeze

BLOCKED_PATH_PARTS = [
  ".git", ".env", "_site", "node_modules", ".jekyll-cache", ".bundle", "vendor"
].freeze

def safe_yaml_load(text)
  YAML.safe_load(text.to_s, permitted_classes: [Date, Time], aliases: true) || {}
rescue ArgumentError
  YAML.safe_load(text.to_s, [Date, Time], [], true) || {}
rescue Psych::SyntaxError => error
  raise "YAML parse error: #{error.message}"
end

SCHEMA = safe_yaml_load(File.read(SCHEMA_FILE)).freeze
TYPE_SCHEMAS = (SCHEMA["types"] || {}).freeze

def repo_relative(path)
  File.expand_path(path).delete_prefix("#{ROOT}/")
end

def file_hash(path)
  File.file?(path) ? Digest::SHA256.file(path).hexdigest : nil
end

def run_command(*args, env: {})
  Dir.chdir(ROOT) { Open3.capture3(env, *args) }
end

def git_dirty_paths
  stdout, = run_command("git", "status", "--porcelain=v1", "-z")
  entries = stdout.split("\0")
  entries.each_with_index.each_with_object(Set.new) do |(entry, index), set|
    next if entry.nil? || entry.empty?
    next if index.positive? && entries[index - 1].to_s.start_with?("R", "C")

    status = entry[0, 2]
    set << entry[3..].to_s
    set << entries[index + 1].to_s if status.start_with?("R", "C") && entries[index + 1]
  end
rescue StandardError
  Set.new
end

def editable_files
  paths = WRITE_FILES.select { |path| File.file?(path) }
  WRITE_ROOTS.each do |root|
    next unless File.exist?(root)

    if File.file?(root)
      paths << root
    else
      Dir.glob(File.join(root, "**", "*"), File::FNM_DOTMATCH).each do |path|
        paths << path if File.file?(path)
      end
    end
  end
  paths.uniq
end

START_DIRTY = git_dirty_paths.freeze
START_HASHES = editable_files.each_with_object({}) { |path, memo| memo[repo_relative(path)] = file_hash(path) }.freeze
SESSION_CHANGED = Set.new
SESSION_LAST_HASH = {}
PUBLISH_TOKENS = {}
PENDING_UPLOADS = {}

def json_safe(value)
  case value
  when Date
    value.strftime("%Y-%m-%d")
  when Time
    value.iso8601
  when Hash
    value.each_with_object({}) { |(key, item), memo| memo[key.to_s] = json_safe(item) }
  when Array
    value.map { |item| json_safe(item) }
  else
    value
  end
end

def json_response(response, status, payload)
  response.status = status
  response["Content-Type"] = "application/json; charset=utf-8"
  response["Cache-Control"] = "no-store"
  response.body = JSON.pretty_generate(json_safe(payload))
end

def read_json_body(request)
  length = request.body.to_s.bytesize
  raise "Request body is too large" if length > MAX_JSON_BYTES

  parsed = JSON.parse(request.body.to_s)
  raise "JSON body must be an object" unless parsed.is_a?(Hash)

  parsed
rescue JSON::ParserError
  raise "Invalid JSON body"
end

def yaml_without_header(data)
  YAML.dump(json_safe(data)).sub(/\A---\s*\n/, "")
end

def read_yaml_file(path, fallback)
  return fallback unless File.exist?(path)

  data = safe_yaml_load(File.read(path))
  data.nil? ? fallback : json_safe(data)
end

def read_front_matter(path)
  text = File.read(path)
  match = text.match(/\A---\s*\n(.*?)\n---\s*\n?/m)
  return [{}, text] unless match

  [json_safe(safe_yaml_load(match[1])), text[match[0].length..].to_s]
end

def assert_allowed_write_path!(path)
  expanded = File.expand_path(path)
  parts = expanded.delete_prefix("#{ROOT}/").split(File::SEPARATOR)
  raise "Blocked path" if parts.any? { |part| BLOCKED_PATH_PARTS.include?(part) }

  allowed = WRITE_FILES.include?(expanded) || WRITE_ROOTS.any? do |root|
    expanded == root || expanded.start_with?("#{root}#{File::SEPARATOR}")
  end
  raise "Path is outside editable content roots" unless allowed

  ancestor = expanded
  ancestor = File.dirname(ancestor) until File.exist?(ancestor)
  real_ancestor = File.realpath(ancestor)
  unless real_ancestor == ROOT_REAL || real_ancestor.start_with?("#{ROOT_REAL}#{File::SEPARATOR}")
    raise "Path resolves outside the repository"
  end

  expanded
end

def assert_state_path!(path)
  expanded = File.expand_path(path)
  state = File.expand_path(STATE_ROOT)
  raise "Path is outside editor state" unless expanded == state || expanded.start_with?("#{state}#{File::SEPARATOR}")

  ancestor = expanded
  ancestor = File.dirname(ancestor) until File.exist?(ancestor)
  real_ancestor = File.realpath(ancestor)
  unless real_ancestor == ROOT_REAL || real_ancestor.start_with?("#{ROOT_REAL}#{File::SEPARATOR}")
    raise "Editor state resolves outside the repository"
  end

  expanded
end

def ensure_session_writable!(path)
  expanded = assert_allowed_write_path!(path)
  relative = repo_relative(expanded)
  raise "File was already modified before the editor started: #{relative}" if START_DIRTY.include?(relative)

  unless SESSION_CHANGED.include?(relative)
    expected = START_HASHES[relative]
    current = file_hash(expanded)
    raise "File changed outside the editor after startup: #{relative}" unless current == expected
  end
  expanded
end

def mark_session_change(path)
  relative = repo_relative(path)
  SESSION_CHANGED << relative
  SESSION_LAST_HASH[relative] = file_hash(path)
end

def snapshot_file(path, type, id)
  return unless File.file?(path)

  token = "#{Time.now.utc.strftime('%Y%m%dt%H%M%S%6N')}-#{SecureRandom.hex(3)}"
  dir = assert_state_path!(File.join(STATE_ROOT, "history", token))
  FileUtils.mkdir_p(dir)
  relative = repo_relative(path)
  snapshot = File.join(dir, "content")
  FileUtils.cp(path, snapshot)
  File.write(
    File.join(dir, "meta.json"),
    JSON.pretty_generate(
      "token" => token,
      "type" => type,
      "id" => id,
      "original" => relative,
      "created_at" => Time.now.utc.iso8601
    )
  )
end

def atomic_write(path, bytes, type:, id:)
  expanded = ensure_session_writable!(path)
  snapshot_file(expanded, type, id)
  FileUtils.mkdir_p(File.dirname(expanded))
  temp = Tempfile.new([".content-editor", ".tmp"], File.dirname(expanded))
  begin
    temp.binmode
    temp.write(bytes)
    temp.flush
    temp.fsync
    temp.close
    File.rename(temp.path, expanded)
  ensure
    temp.close! if temp
  end
  mark_session_change(expanded)
  expanded
end

def atomic_state_write(path, bytes)
  expanded = assert_state_path!(path)
  FileUtils.mkdir_p(File.dirname(expanded))
  temp = Tempfile.new([".content-editor", ".tmp"], File.dirname(expanded))
  begin
    temp.binmode
    temp.write(bytes)
    temp.flush
    temp.fsync
    temp.close
    File.rename(temp.path, expanded)
  ensure
    temp.close! if temp
  end
  expanded
end

def write_yaml_file(path, data, type:, id:)
  atomic_write(path, yaml_without_header(data), type: type, id: id)
end

def write_front_matter(path, data, body, type:, id:)
  atomic_write(path, "---\n#{yaml_without_header(data)}---\n#{body}", type: type, id: id)
end

def sanitize_id(value)
  value.to_s.downcase.gsub(/[^a-z0-9_-]/, "-").gsub(/-+/, "-").gsub(/\A-|-+\z/, "")
end

def sanitize_filename(value)
  base = File.basename(value.to_s)
  name = File.basename(base, File.extname(base)).downcase
  clean = name.gsub(/[^a-z0-9_-]/, "-").gsub(/-+/, "-").gsub(/\A-|-+\z/, "")
  clean.empty? ? "image" : clean
end

def deep_merge(base, override)
  return json_safe(override) unless base.is_a?(Hash) && override.is_a?(Hash)

  base.each_with_object({}) { |(key, value), memo| memo[key] = json_safe(value) }.tap do |result|
    override.each do |key, value|
      result[key] = result.key?(key) ? deep_merge(result[key], value) : json_safe(value)
    end
  end
end

def value_at(data, path)
  path.to_s.split(".").reduce(data) do |cursor, key|
    break nil unless cursor.is_a?(Hash)

    cursor[key]
  end
end

def blank_value?(value)
  value.nil? || (value.respond_to?(:empty?) && value.empty?) || (value.is_a?(String) && value.strip.empty?)
end

def schema_fields(schema)
  Array(schema["sections"]).flat_map { |section| Array(section["fields"]) }
end

def validate_field_value!(field, value)
  return if value.nil? || value == ""

  path = field["path"]
  type = field["type"].to_s
  case type
  when "array"
    raise "Invalid array field: #{path}" unless value.is_a?(Array)
  when "object"
    raise "Invalid object field: #{path}" unless value.is_a?(Hash)
  when "boolean"
    raise "Invalid boolean field: #{path}" unless value == true || value == false
  when "number"
    finite = !value.respond_to?(:finite?) || value.finite?
    raise "Invalid number field: #{path}" unless value.is_a?(Numeric) && finite
  when "select"
    raise "Invalid option for #{path}" unless Array(field["options"]).include?(value)
  when "email"
    raise "Invalid email field: #{path}" unless value.to_s.match?(/\A[^\s@]+@[^\s@]+\.[^\s@]+\z/)
  when "date"
    Date.parse(value.to_s)
  when "image"
    clean = value.to_s
    raise "Invalid image path: #{path}" unless clean.start_with?("/img/") && !clean.split("/").include?("..")
  end
rescue ArgumentError
  raise "Invalid date field: #{path}"
end

def validate_content!(type, data)
  schema = TYPE_SCHEMAS[type]
  raise "Unknown content type: #{type}" unless schema
  raise "Content data must be an object" unless data.is_a?(Hash)

  unless data["visibility"] == "hidden"
    missing = Array(schema["required"]).select { |path| blank_value?(value_at(data, path)) }
    raise "Missing required fields: #{missing.join(', ')}" unless missing.empty?
  end
  schema_fields(schema).each { |field| validate_field_value!(field, value_at(data, field["path"])) }

  true
end

def preview_path(type, id, data = {})
  case type
  when "site-settings", "homepage"
    "/"
  when "about"
    "/about/"
  when "projects"
    "/projects/#{sanitize_id(id)}/"
  when "ai-products"
    "/behop-ai-product/products/#{sanitize_id(id)}/"
  when "ai-gallery"
    "/behop-ai-product/gallery/#{sanitize_id(id)}/"
  when "archive"
    data["project_url"].to_s.empty? ? "/works/archive/" : data["project_url"]
  when "blog"
    match = id.to_s.match(/\A(\d{4})-(\d{2})-(\d{2})-(.+)\z/)
    match ? "/#{match[1]}/#{match[2]}/#{match[3]}/#{match[4]}-en/" : "/blog/en/"
  else
    "/"
  end
end

def record_summary(type, id, data)
  {
    "id" => id,
    "type" => type,
    "title_zh" => data["title_zh"] || data.dig("zh", "title") || data["title"] || id,
    "title_en" => data["title_en"] || data.dig("en", "title") || data["title"] || id,
    "summary_zh" => data["summary_zh"] || data["subtitle_zh"],
    "summary_en" => data["summary_en"] || data["subtitle_en"],
    "visibility" => data["visibility"],
    "status" => data["status"] || data["status_zh"],
    "year" => data["year"],
    "image" => data["cover"] || data["image"] || data["thumbnail"] || data["background_image"],
    "preview_url" => preview_path(type, id, data)
  }
end

def collection_file(type, id)
  dir = COLLECTION_DIRS[type]
  raise "Unknown collection type" unless dir

  File.join(dir, "#{sanitize_id(id)}.md")
end

def blog_file(id, lang)
  suffix = lang == "en" ? "-en" : ""
  File.join(BLOG_DIR, "#{sanitize_id(id)}#{suffix}.md")
end

def list_records(type)
  if SINGLETON_FILES.key?(type)
    data = read_yaml_file(SINGLETON_FILES[type], {})
    return [record_summary(type, type, data)]
  end

  if COLLECTION_DIRS.key?(type)
    return Dir.glob(File.join(COLLECTION_DIRS[type], "*.md")).sort.map do |path|
      data, = read_front_matter(path)
      record_summary(type, File.basename(path, ".md"), data)
    end
  end

  if type == "archive"
    return read_yaml_file(ARCHIVE_FILE, []).map { |data| record_summary(type, data["id"].to_s, data) }
  end

  if type == "blog"
    return Dir.glob(File.join(BLOG_DIR, "*.md")).sort.reverse.reject { |path| path.end_with?("-en.md") }.map do |path|
      id = File.basename(path, ".md")
      zh, = read_front_matter(path)
      en_path = blog_file(id, "en")
      en = File.exist?(en_path) ? read_front_matter(en_path).first : {}
      record_summary(type, id, "zh" => zh, "en" => en)
    end
  end

  raise "Unknown content type: #{type}"
end

def load_content(type, id)
  if SINGLETON_FILES.key?(type)
    return { "id" => type, "type" => type, "data" => read_yaml_file(SINGLETON_FILES[type], {}) }
  end

  if COLLECTION_DIRS.key?(type)
    path = collection_file(type, id)
    raise "Content not found" unless File.file?(path)

    data, body = read_front_matter(path)
    return { "id" => sanitize_id(id), "type" => type, "data" => data, "body" => body }
  end

  if type == "archive"
    data = read_yaml_file(ARCHIVE_FILE, []).find { |item| item["id"].to_s == id.to_s }
    raise "Archive item not found" unless data

    return { "id" => id, "type" => type, "data" => data }
  end

  if type == "blog"
    zh_path = blog_file(id, "zh")
    en_path = blog_file(id, "en")
    raise "Blog pair not found" unless File.file?(zh_path)

    zh, zh_body = read_front_matter(zh_path)
    en, en_body = File.file?(en_path) ? read_front_matter(en_path) : [{}, ""]
    shared = {
      "layout" => zh["layout"] || en["layout"] || "post",
      "date" => zh["date"] || en["date"],
      "author" => zh["author"] || en["author"] || "liu.ruyuan",
      "tags" => zh["tags"] || en["tags"] || []
    }
    return {
      "id" => sanitize_id(id),
      "type" => type,
      "data" => {
        "shared" => shared,
        "zh" => zh.reject { |key, _| %w[layout date author tags].include?(key) },
        "en" => en.reject { |key, _| %w[layout date author tags].include?(key) }
      },
      "body" => { "zh" => zh_body, "en" => en_body }
    }
  end

  raise "Unknown content type: #{type}"
end

def blog_front_matter(data, lang)
  shared = data["shared"] || {}
  localized = data[lang] || {}
  {
    "layout" => shared["layout"] || "post",
    "title" => localized["title"],
    "subtitle" => localized["subtitle"],
    "date" => shared["date"],
    "author" => shared["author"] || "liu.ruyuan",
    "lang" => lang,
    "tags" => shared["tags"] || []
  }.merge(localized.reject { |key, _| %w[title subtitle lang].include?(key) })
end

def ensure_blog_cross_link(body, id, lang)
  match = id.match(/\A(\d{4})-(\d{2})-(\d{2})-(.+)\z/)
  return body unless match

  if lang == "zh"
    link = "[English version](/#{match[1]}/#{match[2]}/#{match[3]}/#{match[4]}-en/)"
  else
    link = "[中文版](/#{match[1]}/#{match[2]}/#{match[3]}/#{match[4]}/)"
  end
  return body if body.include?(link)

  "#{link}\n\n#{body}".strip + "\n"
end

def save_content(type, id, payload)
  data = json_safe(payload["data"] || {})
  validate_content!(type, data)
  pending = pending_uploads_referenced_by(type, id, payload)
  finalize_pending_uploads!(pending, type, id)

  result = if SINGLETON_FILES.key?(type)
    write_yaml_file(SINGLETON_FILES[type], data, type: type, id: type)
    load_content(type, type)
  elsif COLLECTION_DIRS.key?(type)
    path = collection_file(type, id)
    raise "Content not found" unless File.file?(path)

    _, original_body = read_front_matter(path)
    body = payload.key?("body") ? payload["body"].to_s : original_body
    write_front_matter(path, data, body, type: type, id: id)
    load_content(type, id)
  elsif type == "archive"
    records = read_yaml_file(ARCHIVE_FILE, [])
    index = records.index { |item| item["id"].to_s == id.to_s }
    raise "Archive item not found" unless index

    data["id"] = id
    records[index] = data
    write_yaml_file(ARCHIVE_FILE, records, type: type, id: id)
    load_content(type, id)
  elsif type == "blog"
    body = payload["body"].is_a?(Hash) ? payload["body"] : {}
    %w[zh en].each do |lang|
      write_front_matter(
        blog_file(id, lang),
        blog_front_matter(data, lang),
        ensure_blog_cross_link(body[lang].to_s, id, lang),
        type: type,
        id: id
      )
    end
    load_content(type, id)
  else
    raise "Unknown content type: #{type}"
  end

  discard_pending_uploads(type, id)
  result
rescue StandardError
  rollback_finalized_uploads!(pending || [])
  raise
end

def create_content(type, payload)
  schema = TYPE_SCHEMAS[type]
  raise "Unknown content type" unless schema
  raise "Singleton content cannot be created" if schema["singleton"]

  raw_id = payload["id"].to_s
  raise "Missing content id" if raw_id.strip.empty?
  id = sanitize_id(raw_id)
  id = "#{Date.today.strftime('%Y-%m-%d')}-#{id}" if type == "blog" && id !~ /\A\d{4}-\d{2}-\d{2}-/
  defaults = json_safe(schema["defaults"] || {})
  data = deep_merge(defaults, payload["data"] || {})

  if COLLECTION_DIRS.key?(type)
    path = collection_file(type, id)
    raise "Content already exists" if File.exist?(path)
    write_front_matter(path, data, payload["body"].to_s, type: type, id: id)
  elsif type == "archive"
    records = read_yaml_file(ARCHIVE_FILE, [])
    raise "Content already exists" if records.any? { |item| item["id"].to_s == id }
    data["id"] = id
    records << data
    write_yaml_file(ARCHIVE_FILE, records, type: type, id: id)
  elsif type == "blog"
    data["shared"]["date"] ||= Date.today.strftime("%Y-%m-%d 09:00:00 +0800")
    body = payload["body"].is_a?(Hash) ? payload["body"] : { "zh" => "", "en" => "" }
    %w[zh en].each do |lang|
      path = blog_file(id, lang)
      raise "Content already exists" if File.exist?(path)
      write_front_matter(path, blog_front_matter(data, lang), ensure_blog_cross_link(body[lang].to_s, id, lang), type: type, id: id)
    end
  else
    raise "Creation is not supported for this type"
  end

  load_content(type, id)
end

def move_to_trash(path, type, id)
  expanded = ensure_session_writable!(path)
  raise "Content not found" unless File.file?(expanded)

  snapshot_file(expanded, type, id)
  trash_dir = assert_state_path!(File.join(STATE_ROOT, "trash", Time.now.utc.strftime("%Y%m%dT%H%M%S"), type, id))
  FileUtils.mkdir_p(trash_dir)
  FileUtils.mv(expanded, File.join(trash_dir, File.basename(expanded)))
  mark_session_change(expanded)
end

def delete_content(type, id)
  raise "Singleton content cannot be deleted" if SINGLETON_FILES.key?(type)

  if COLLECTION_DIRS.key?(type)
    move_to_trash(collection_file(type, id), type, id)
  elsif type == "archive"
    records = read_yaml_file(ARCHIVE_FILE, [])
    item = records.find { |record| record["id"].to_s == id.to_s }
    raise "Archive item not found" unless item
    trash_dir = assert_state_path!(File.join(STATE_ROOT, "trash", Time.now.utc.strftime("%Y%m%dT%H%M%S"), type, id))
    FileUtils.mkdir_p(trash_dir)
    File.write(File.join(trash_dir, "record.json"), JSON.pretty_generate(item))
    records.reject! { |record| record["id"].to_s == id.to_s }
    write_yaml_file(ARCHIVE_FILE, records, type: type, id: id)
  elsif type == "blog"
    %w[zh en].each do |lang|
      path = blog_file(id, lang)
      move_to_trash(path, type, id) if File.file?(path)
    end
  else
    raise "Deletion is not supported for this type"
  end
  { "ok" => true, "id" => id, "type" => type }
end

def history_records(type, id)
  Dir.glob(File.join(STATE_ROOT, "history", "*", "meta.json")).sort.reverse.each_with_object([]) do |path, records|
    meta = JSON.parse(File.read(path)) rescue nil
    records << meta if meta && meta["type"] == type && meta["id"].to_s == id.to_s
  end
end

def restore_history(type, id, token)
  dir = assert_state_path!(File.join(STATE_ROOT, "history", sanitize_id(token)))
  meta_path = File.join(dir, "meta.json")
  snapshot = File.join(dir, "content")
  raise "History entry not found" unless File.file?(meta_path) && File.file?(snapshot)

  meta = JSON.parse(File.read(meta_path))
  raise "History entry does not match this content" unless meta["type"] == type && meta["id"].to_s == id.to_s

  original = File.join(ROOT, meta["original"])
  atomic_write(original, File.binread(snapshot), type: type, id: id)
  load_content(type, id)
end

def uploaded_file_param(request)
  request.query["file"]
end

def upload_filename(upload)
  return upload.filename.to_s if upload.respond_to?(:filename)
  return (upload[:filename] || upload["filename"]).to_s if upload.is_a?(Hash)

  "image"
end

def upload_bytes(upload)
  if upload.respond_to?(:read)
    upload.rewind if upload.respond_to?(:rewind)
    upload.read
  elsif upload.respond_to?(:tempfile)
    File.binread(upload.tempfile.path)
  elsif upload.is_a?(Hash) && (upload[:tempfile] || upload["tempfile"])
    File.binread((upload[:tempfile] || upload["tempfile"]).path)
  else
    upload.to_s
  end
end

def image_extension(bytes)
  data = bytes.to_s.b
  return ".jpg" if data.byteslice(0, 3) == "\xFF\xD8\xFF".b
  return ".png" if data.byteslice(0, 8) == "\x89PNG\r\n\x1A\n".b
  return ".gif" if %w[GIF87a GIF89a].include?(data.byteslice(0, 6))
  return ".webp" if data.byteslice(0, 4) == "RIFF" && data.byteslice(8, 4) == "WEBP"

  nil
end

def media_dir(type, id)
  root = MEDIA_ROOTS[type]
  raise "Unknown media type" unless root
  return root if %w[homepage site-settings about archive].include?(type)

  suffix = type == "blog" ? id.sub(/\A\d{4}-\d{2}-\d{2}-/, "") : sanitize_id(id)
  File.join(root, sanitize_id(suffix))
end

def upload_image(type, id, request)
  raise "Unknown content type" unless TYPE_SCHEMAS.key?(type)
  upload = uploaded_file_param(request)
  raise "Missing upload file" unless upload
  bytes = upload_bytes(upload)
  raise "Upload file is empty" if bytes.nil? || bytes.bytesize.zero?
  raise "Image exceeds 10MB" if bytes.bytesize > MAX_UPLOAD_BYTES
  extension = image_extension(bytes)
  raise "Only JPEG, PNG, WebP, and GIF images are allowed" unless extension

  field = request.query["field"].to_s
  stem = sanitize_filename("#{field}-#{upload_filename(upload)}")
  target = File.join(media_dir(type, id), "#{stem}-#{Time.now.strftime('%Y%m%d-%H%M%S')}-#{SecureRandom.hex(2)}#{extension}")
  assert_allowed_write_path!(target)
  token = SecureRandom.hex(24)
  draft = assert_state_path!(File.join(STATE_ROOT, "drafts", "#{token}#{extension}"))
  atomic_state_write(draft, bytes)
  public_path = "/#{repo_relative(target)}"
  PENDING_UPLOADS[token] = {
    "token" => token,
    "type" => type,
    "id" => sanitize_id(id),
    "source" => draft,
    "target" => target,
    "public_path" => public_path
  }
  {
    "ok" => true,
    "path" => public_path,
    "preview_url" => "/api/draft-media/#{token}",
    "draft_token" => token,
    "bytes" => bytes.bytesize
  }
end

def pending_uploads_referenced_by(type, id, payload)
  serialized = JSON.generate(json_safe("data" => payload["data"], "body" => payload["body"]))
  PENDING_UPLOADS.values.select do |record|
    record["type"] == type && record["id"] == sanitize_id(id) && serialized.include?(record["public_path"])
  end
end

def finalize_pending_uploads!(records, type, id)
  records.each do |record|
    raise "Draft image is missing" unless File.file?(record["source"])
    raise "Draft image target mismatch" unless record["type"] == type && record["id"] == sanitize_id(id)

    atomic_write(record["target"], File.binread(record["source"]), type: type, id: id)
    record["finalized"] = true
  end
end

def rollback_finalized_uploads!(records)
  records.reverse_each do |record|
    next unless record["finalized"]

    FileUtils.rm_f(record["target"])
    relative = repo_relative(record["target"])
    SESSION_CHANGED.delete(relative)
    SESSION_LAST_HASH.delete(relative)
    record.delete("finalized")
  end
end

def discard_pending_uploads(type, id)
  PENDING_UPLOADS.delete_if do |_token, record|
    next false unless record["type"] == type && record["id"] == sanitize_id(id)

    FileUtils.rm_f(record["source"])
    true
  end
end

def draft_upload(token)
  record = PENDING_UPLOADS[token.to_s]
  raise "Draft image not found" unless record && File.file?(record["source"])

  record
end

def referenced_media?(web_path)
  source_paths = SINGLETON_FILES.values + [ARCHIVE_FILE]
  COLLECTION_DIRS.values.each { |dir| source_paths.concat(Dir.glob(File.join(dir, "*.md"))) }
  source_paths.concat(Dir.glob(File.join(BLOG_DIR, "*.md")))
  source_paths.any? { |path| File.file?(path) && File.read(path).include?(web_path) }
end

def delete_media(type, id, web_path)
  raise "Invalid media path" unless web_path.to_s.start_with?("/img/")
  pending = PENDING_UPLOADS.find do |_token, record|
    record["type"] == type && record["id"] == sanitize_id(id) && record["public_path"] == web_path
  end
  if pending
    token, record = pending
    FileUtils.rm_f(record["source"])
    PENDING_UPLOADS.delete(token)
    return { "ok" => true, "path" => web_path, "draft" => true }
  end

  raise "Image is still referenced by content" if referenced_media?(web_path)
  path = File.join(ROOT, web_path.delete_prefix("/"))
  move_to_trash(path, type, id)
  { "ok" => true, "path" => web_path }
end

def preview_health
  uri = URI(PREVIEW_BASE_URL)
  Timeout.timeout(0.3) do
    socket = TCPSocket.new(uri.host, uri.port)
    socket.close
    true
  end
rescue StandardError
  false
end

def git_status_payload
  stdout, stderr, status = run_command("git", "status", "--short", "--branch")
  {
    "ok" => status.success?,
    "output" => stdout,
    "error" => status.success? ? nil : stderr,
    "session_changed" => SESSION_CHANGED.to_a.sort,
    "startup_conflicts" => START_DIRTY.to_a.sort
  }
end

def validate_publish_paths!
  raise "No editor changes to publish" if SESSION_CHANGED.empty?

  SESSION_CHANGED.each do |relative|
    raise "Startup conflict cannot be published: #{relative}" if START_DIRTY.include?(relative)
    path = File.join(ROOT, relative)
    assert_allowed_write_path!(path)
    expected = SESSION_LAST_HASH[relative]
    raise "File changed outside the editor: #{relative}" unless file_hash(path) == expected
  end

  staged, = run_command("git", "diff", "--cached", "--name-only")
  raise "The repository already has staged changes" unless staged.strip.empty?
end

def command_or_raise(*args, env: {})
  stdout, stderr, status = run_command(*args, env: env)
  raise(stderr.strip.empty? ? stdout.strip : stderr.strip) unless status.success?

  stdout
end

def publish_preflight
  validate_publish_paths!
  command_or_raise("git", "fetch", "origin", "master")
  counts = command_or_raise("git", "rev-list", "--left-right", "--count", "origin/master...HEAD").split.map(&:to_i)
  raise "Remote or local branch diverged; resolve it outside the editor" unless counts == [0, 0]

  name = command_or_raise("git", "config", "user.name").strip
  email = command_or_raise("git", "config", "user.email").strip
  raise "Git identity is not configured" if name.empty? || email.empty?

  unless ENV["CONTENT_EDITOR_SKIP_PREFLIGHT_COMMANDS"] == "1"
    command_or_raise("npm", "run", "css:check")
    Dir.mktmpdir("behop-publish-build-") do |destination|
      command_or_raise("./scripts/local-preview.sh", "build", env: { "JEKYLL_DESTINATION" => destination })
      command_or_raise("npm", "run", "site:audit", env: { "SITE_ROOT" => destination })
    end
  end

  token = SecureRandom.hex(24)
  PUBLISH_TOKENS[token] = {
    "expires_at" => Time.now.to_i + 300,
    "paths" => SESSION_CHANGED.to_a.sort
  }
  { "ok" => true, "token" => token, "paths" => SESSION_CHANGED.to_a.sort, "expires_in" => 300 }
end

def publish_confirm(token, commit_message)
  record = PUBLISH_TOKENS.delete(token.to_s)
  raise "Publish confirmation expired" unless record && record["expires_at"] >= Time.now.to_i
  validate_publish_paths!
  message = commit_message.to_s.strip
  message = "content(site): update website content" if message.empty?
  raise "Commit message is too long" if message.length > 120

  paths = record["paths"]
  command_or_raise("git", "add", "--", *paths)
  staged = command_or_raise("git", "diff", "--cached", "--name-only").split("\n").reject(&:empty?).sort
  raise "Staged file list does not match the editor session" unless staged == paths.sort

  command_or_raise("git", "commit", "-m", message)
  command_or_raise("git", "push", "origin", "master")
  commit = command_or_raise("git", "rev-parse", "HEAD").strip
  SESSION_CHANGED.clear
  SESSION_LAST_HASH.clear
  {
    "ok" => true,
    "commit" => commit,
    "actions_url" => "https://github.com/BE-hop/BE-hop.github.io/actions"
  }
end

class MethodNotAllowed < StandardError; end

def require_method!(method, *allowed)
  return if allowed.include?(method)

  raise MethodNotAllowed, "Method #{method} is not allowed"
end

def validate_mutation_request!(request, expected_content_type = nil)
  host = request["host"].to_s.split(":").first
  raise "Invalid Host" unless %w[127.0.0.1 localhost].include?(host)

  origin = request["origin"].to_s
  unless origin.empty?
    uri = URI(origin)
    raise "Invalid Origin" unless %w[127.0.0.1 localhost].include?(uri.host) && uri.port == PORT
  end
  raise "Missing Origin" if origin.empty? && ENV["CONTENT_EDITOR_ALLOW_NO_ORIGIN"] != "1"
  raise "Invalid CSRF token" unless request["x-csrf-token"].to_s == CSRF_TOKEN
  if expected_content_type
    actual = request["content-type"].to_s.downcase
    valid = if expected_content_type == "application/json"
      actual.split(";", 2).first.to_s.strip == expected_content_type
    else
      actual.start_with?("#{expected_content_type};")
    end
    raise "Invalid Content-Type" unless valid
  end
end

class ContentEditorServlet < WEBrick::HTTPServlet::AbstractServlet
  def do_GET(request, response)
    route(request, response)
  end

  def do_POST(request, response)
    route(request, response)
  end

  def do_PUT(request, response)
    route(request, response)
  end

  def do_DELETE(request, response)
    route(request, response)
  end

  private

  def route(request, response)
    path = request.path
    method = request.request_method

    if path == "/"
      require_method!(method, "GET")
      serve_static(response, File.join(STATIC_ROOT, "index.html"), "text/html; charset=utf-8")
      return
    end

    if path.start_with?("/assets/")
      require_method!(method, "GET")
      local = File.expand_path(File.join(STATIC_ROOT, path.delete_prefix("/assets/")))
      unless local.start_with?("#{STATIC_ROOT}/") && File.file?(local)
        json_response(response, 404, "error" => "Asset not found")
        return
      end
      serve_static(response, local, content_type(local))
      return
    end

    if path.match?(%r{\A/api/draft-media/([^/]+)\z})
      require_method!(method, "GET")
      record = draft_upload(path.split("/").last)
      serve_static(response, record["source"], content_type(record["source"]))
      return
    end

    case path
    when "/api/bootstrap"
      require_method!(method, "GET")
      json_response(
        response,
        200,
        "schema" => SCHEMA,
        "csrf_token" => CSRF_TOKEN,
        "preview_url" => PREVIEW_BASE_URL,
        "preview_healthy" => preview_health,
        "git" => git_status_payload
      )
    when %r{\A/api/content/([^/]+)\z}
      type = Regexp.last_match(1)
      if method == "GET"
        json_response(response, 200, "type" => type, "records" => list_records(type))
      elsif method == "POST"
        validate_mutation_request!(request, "application/json")
        json_response(response, 201, create_content(type, read_json_body(request)))
      else
        require_method!(method, "GET", "POST")
      end
    when %r{\A/api/content/([^/]+)/([^/]+)\z}
      type = Regexp.last_match(1)
      id = Regexp.last_match(2)
      if method == "GET"
        json_response(response, 200, load_content(type, id))
      elsif method == "DELETE"
        validate_mutation_request!(request)
        json_response(response, 200, delete_content(type, id))
      elsif method == "PUT"
        validate_mutation_request!(request, "application/json")
        json_response(response, 200, save_content(type, id, read_json_body(request)))
      else
        require_method!(method, "GET", "PUT", "DELETE")
      end
    when %r{\A/api/media/([^/]+)/([^/]+)\z}
      type = Regexp.last_match(1)
      id = Regexp.last_match(2)
      if method == "DELETE"
        validate_mutation_request!(request, "application/json")
        body = read_json_body(request)
        json_response(response, 200, delete_media(type, id, body["path"]))
      elsif method == "POST"
        validate_mutation_request!(request, "multipart/form-data")
        json_response(response, 201, upload_image(type, id, request))
      else
        require_method!(method, "POST", "DELETE")
      end
    when %r{\A/api/history/([^/]+)/([^/]+)/restore\z}
      require_method!(method, "POST")
      validate_mutation_request!(request, "application/json")
      type = Regexp.last_match(1)
      id = Regexp.last_match(2)
      json_response(response, 200, restore_history(type, id, read_json_body(request)["token"]))
    when %r{\A/api/history/([^/]+)/([^/]+)\z}
      require_method!(method, "GET")
      json_response(response, 200, "records" => history_records(Regexp.last_match(1), Regexp.last_match(2)))
    when %r{\A/api/preview-url/([^/]+)/([^/]+)\z}
      require_method!(method, "GET")
      type = Regexp.last_match(1)
      id = Regexp.last_match(2)
      content = load_content(type, id)
      json_response(response, 200, "url" => "#{PREVIEW_BASE_URL}#{preview_path(type, id, content['data'])}")
    when "/api/publish/preflight"
      require_method!(method, "POST")
      validate_mutation_request!(request, "application/json")
      read_json_body(request)
      json_response(response, 200, publish_preflight)
    when "/api/publish/confirm"
      require_method!(method, "POST")
      validate_mutation_request!(request, "application/json")
      body = read_json_body(request)
      json_response(response, 200, publish_confirm(body["token"], body["commit_message"]))
    else
      json_response(response, 404, "error" => "Not found")
    end
  rescue MethodNotAllowed => error
    json_response(response, 405, "error" => error.message)
  rescue StandardError => error
    warn "#{error.class}: #{error.message}"
    json_response(response, 422, "error" => error.message)
  end

  def serve_static(response, path, type)
    response.status = 200
    response["Content-Type"] = type
    response["Cache-Control"] = "no-store"
    response.body = File.binread(path)
  end

  def content_type(path)
    case File.extname(path)
    when ".css"
      "text/css; charset=utf-8"
    when ".js"
      "text/javascript; charset=utf-8"
    when ".html"
      "text/html; charset=utf-8"
    else
      "application/octet-stream"
    end
  end
end

def build_server
  server = WEBrick::HTTPServer.new(
    Port: PORT,
    BindAddress: "127.0.0.1",
    DocumentRoot: STATIC_ROOT,
    AccessLog: [],
    Logger: WEBrick::Log.new($stderr, WEBrick::Log::INFO)
  )
  server.mount("/", ContentEditorServlet)
  server
end

if $PROGRAM_NAME == __FILE__
  server = build_server
  trap("INT") { server.shutdown }
  trap("TERM") { server.shutdown }
  puts "BE-hop content editor: http://127.0.0.1:#{PORT}/"
  puts "Preview target: #{PREVIEW_BASE_URL}"
  server.start
end
