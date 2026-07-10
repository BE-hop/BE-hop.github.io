#!/usr/bin/env ruby
# frozen_string_literal: true

require "date"
require "fileutils"
require "json"
require "securerandom"
require "time"
require "webrick"
require "yaml"

ROOT = File.expand_path("..", __dir__)
PORT = Integer(ENV.fetch("PORT", "4567"))
PREVIEW_BASE_URL = ENV.fetch("PREVIEW_URL", "http://127.0.0.1:4001")

STATIC_ROOT = File.join(ROOT, "content-editor")
HOMEPAGE_FILE = File.join(ROOT, "_data", "homepage.yml")
ARCHIVE_FILE = File.join(ROOT, "_data", "worksarchive.yml")

TYPE_LABELS = {
  "homepage" => "Homepage",
  "projects" => "Works",
  "ai-products" => "AI Tools",
  "archive" => "Archive"
}.freeze

WRITE_ROOTS = [
  File.join(ROOT, "_data"),
  File.join(ROOT, "_projects"),
  File.join(ROOT, "_ai_products"),
  File.join(ROOT, "img", "portfolio", "homepage"),
  File.join(ROOT, "img", "portfolio", "real-works"),
  File.join(ROOT, "img", "ai-products")
].map { |path| File.expand_path(path) }.freeze

BLOCKED_PATH_PARTS = [".git", ".env", "_site", "node_modules", ".jekyll-cache", ".bundle", "vendor"].freeze

def json_response(response, status, payload)
  response.status = status
  response["Content-Type"] = "application/json; charset=utf-8"
  response.body = JSON.pretty_generate(payload)
end

def read_json_body(request)
  JSON.parse(request.body.to_s)
rescue JSON::ParserError
  {}
end

def safe_yaml_load(text)
  YAML.safe_load(
    text.to_s,
    permitted_classes: [Date, Time],
    aliases: true
  ) || {}
rescue ArgumentError
  YAML.safe_load(text.to_s, [Date, Time], [], true) || {}
rescue Psych::SyntaxError => error
  raise "YAML parse error: #{error.message}"
end

def yaml_without_header(data)
  YAML.dump(data).sub(/\A---\s*\n/, "")
end

def read_yaml_file(path, fallback)
  return fallback unless File.exist?(path)

  data = safe_yaml_load(File.read(path))
  data.nil? ? fallback : data
end

def write_yaml_file(path, data)
  assert_allowed_write_path!(path)
  FileUtils.mkdir_p(File.dirname(path))
  File.write(path, yaml_without_header(data))
end

def read_front_matter(path)
  text = File.read(path)
  match = text.match(/\A---\s*\n(.*?)\n---\s*\n?/m)
  return [{}, text] unless match

  data = safe_yaml_load(match[1])
  body = text[match[0].length..] || ""
  [data || {}, body]
end

def write_front_matter(path, data, body)
  assert_allowed_write_path!(path)
  File.write(path, "---\n#{yaml_without_header(data)}---\n#{body}")
end

def assert_allowed_write_path!(path)
  expanded = File.expand_path(path)
  relative_parts = expanded.delete_prefix("#{ROOT}/").split(File::SEPARATOR)
  if relative_parts.any? { |part| BLOCKED_PATH_PARTS.include?(part) }
    raise "Blocked path: #{expanded}"
  end

  allowed = WRITE_ROOTS.any? do |root|
    expanded == root || expanded.start_with?("#{root}#{File::SEPARATOR}")
  end
  raise "Path is outside editable content roots: #{expanded}" unless allowed

  true
end

def slug_from_path(path)
  File.basename(path, File.extname(path))
end

def collection_file(type, id)
  slug = sanitize_slug(id)
  case type
  when "projects"
    File.join(ROOT, "_projects", "#{slug}.md")
  when "ai-products"
    File.join(ROOT, "_ai_products", "#{slug}.md")
  else
    nil
  end
end

def sanitize_slug(value)
  value.to_s.downcase.gsub(/[^a-z0-9_-]/, "-").gsub(/-+/, "-").gsub(/\A-|-+\z/, "")
end

def sanitize_filename(value)
  base = File.basename(value.to_s)
  ext = File.extname(base).downcase
  name = File.basename(base, ext).downcase.gsub(/[^a-z0-9_-]/, "-").gsub(/-+/, "-").gsub(/\A-|-+\z/, "")
  name = "image" if name.empty?
  ext = ".jpg" if ext.empty?
  "#{name}#{ext}"
end

def homepage_record
  data = read_yaml_file(HOMEPAGE_FILE, {})
  {
    "id" => "homepage",
    "type" => "homepage",
    "title_zh" => "主页内容",
    "title_en" => "Homepage Content",
    "summary_zh" => data.dig("hero", "description_zh"),
    "summary_en" => data.dig("hero", "description_en"),
    "image" => data.dig("hero", "background_image"),
    "preview_url" => "/"
  }
end

def collection_records(type)
  dir = type == "projects" ? "_projects" : "_ai_products"
  Dir.glob(File.join(ROOT, dir, "*.md")).sort.map do |path|
    data, = read_front_matter(path)
    id = slug_from_path(path)
    {
      "id" => id,
      "type" => type,
      "title_zh" => data["title_zh"] || data["title"] || id,
      "title_en" => data["title_en"] || data["title"] || id,
      "summary_zh" => data["summary_zh"] || data["subtitle_zh"],
      "summary_en" => data["summary_en"] || data["subtitle_en"],
      "visibility" => data["visibility"],
      "status" => data["status"] || data["status_zh"],
      "image" => data["cover"] || data["image"],
      "preview_url" => preview_path(type, id, data)
    }
  end
end

def archive_records
  records = read_yaml_file(ARCHIVE_FILE, [])
  records.map do |item|
    id = item["id"].to_s
    item.merge(
      "id" => id,
      "type" => "archive",
      "image" => item["thumbnail"],
      "preview_url" => item["project_url"].to_s.empty? ? "/works/archive/" : item["project_url"]
    )
  end
end

def list_records(type)
  case type
  when "homepage"
    [homepage_record]
  when "projects", "ai-products"
    collection_records(type)
  when "archive"
    archive_records
  else
    []
  end
end

def load_content(type, id)
  case type
  when "homepage"
    { "id" => "homepage", "type" => type, "data" => read_yaml_file(HOMEPAGE_FILE, {}) }
  when "projects", "ai-products"
    path = collection_file(type, id)
    raise "Content file not found: #{id}" unless path && File.exist?(path)

    data, body = read_front_matter(path)
    { "id" => sanitize_slug(id), "type" => type, "data" => data, "body" => body }
  when "archive"
    records = read_yaml_file(ARCHIVE_FILE, [])
    item = records.find { |record| record["id"].to_s == id.to_s }
    raise "Archive item not found: #{id}" unless item

    { "id" => id, "type" => type, "data" => item }
  else
    raise "Unknown content type: #{type}"
  end
end

def save_content(type, id, payload)
  data = payload["data"] || {}
  case type
  when "homepage"
    write_yaml_file(HOMEPAGE_FILE, data)
    load_content(type, "homepage")
  when "projects", "ai-products"
    path = collection_file(type, id)
    raise "Content file not found: #{id}" unless path && File.exist?(path)

    _, original_body = read_front_matter(path)
    write_front_matter(path, data, payload.key?("body") ? payload["body"].to_s : original_body)
    load_content(type, id)
  when "archive"
    records = read_yaml_file(ARCHIVE_FILE, [])
    index = records.index { |record| record["id"].to_s == id.to_s }
    raise "Archive item not found: #{id}" unless index

    data["id"] = id
    records[index] = data
    write_yaml_file(ARCHIVE_FILE, records)
    load_content(type, id)
  else
    raise "Unknown content type: #{type}"
  end
end

def preview_path(type, id, data = {})
  case type
  when "homepage"
    "/"
  when "projects"
    "/projects/#{sanitize_slug(id)}/"
  when "ai-products"
    "/behop-ai-product/products/#{sanitize_slug(id)}/"
  when "archive"
    data["project_url"].to_s.empty? ? "/works/archive/" : data["project_url"]
  else
    "/"
  end
end

def preview_url(type, id)
  content = load_content(type, id)
  "#{PREVIEW_BASE_URL}#{preview_path(type, id, content["data"])}"
end

def set_nested_value(data, field_path, value)
  keys = field_path.to_s.split(".")
  raise "Missing field path" if keys.empty?

  cursor = data
  keys[0...-1].each do |key|
    if key.match?(/\A\d+\z/)
      cursor = cursor.fetch(key.to_i)
    else
      cursor[key] ||= {}
      cursor = cursor[key]
    end
  end

  last = keys[-1]
  if last.match?(/\A\d+\z/)
    cursor[last.to_i] = value
  else
    cursor[last] = value
  end
end

def image_target_dir(type, id)
  case type
  when "homepage"
    File.join(ROOT, "img", "portfolio", "homepage")
  when "projects"
    File.join(ROOT, "img", "portfolio", "real-works", sanitize_slug(id))
  when "ai-products"
    File.join(ROOT, "img", "ai-products", sanitize_slug(id))
  when "archive"
    File.join(ROOT, "img", "portfolio", "real-works", "archive")
  else
    raise "Unknown content type: #{type}"
  end
end

def uploaded_file_param(request)
  request.query["file"]
end

def upload_filename(upload)
  if upload.respond_to?(:filename)
    upload.filename.to_s
  elsif upload.is_a?(Hash)
    (upload[:filename] || upload["filename"]).to_s
  else
    "image.jpg"
  end
end

def upload_bytes(upload)
  if upload.respond_to?(:read)
    upload.rewind if upload.respond_to?(:rewind)
    upload.read
  elsif upload.respond_to?(:tempfile)
    File.binread(upload.tempfile.path)
  elsif upload.is_a?(Hash) && upload[:tempfile]
    File.binread(upload[:tempfile].path)
  elsif upload.is_a?(Hash) && upload["tempfile"]
    File.binread(upload["tempfile"].path)
  elsif upload.respond_to?(:to_s)
    upload.to_s
  else
    nil
  end
end

def upload_image(type, id, request)
  field = request.query["field"].to_s
  upload = uploaded_file_param(request)
  raise "Missing upload file" unless upload

  bytes = upload_bytes(upload)
  raise "Upload file is empty or unsupported" if bytes.nil? || bytes.bytesize.zero?

  target_dir = image_target_dir(type, id)
  assert_allowed_write_path!(target_dir)
  FileUtils.mkdir_p(target_dir)

  source_name = upload_filename(upload)
  timestamp = Time.now.strftime("%Y%m%d-%H%M%S")
  safe_name = sanitize_filename("#{field.gsub(".", "-")}-#{timestamp}-#{source_name}")
  target_path = File.join(target_dir, safe_name)
  assert_allowed_write_path!(target_path)
  File.binwrite(target_path, bytes)

  relative = target_path.delete_prefix(ROOT)
  content = load_content(type, id)
  set_nested_value(content["data"], field, relative)
  save_content(type, id, content)

  { "ok" => true, "path" => relative, "bytes" => bytes.bytesize, "content" => load_content(type, id) }
end

class ContentEditorServlet < WEBrick::HTTPServlet::AbstractServlet
  def do_GET(request, response)
    route(request, response)
  end

  def do_POST(request, response)
    route(request, response)
  end

  private

  def route(request, response)
    path = request.path

    if path == "/"
      serve_static(response, File.join(STATIC_ROOT, "index.html"), "text/html; charset=utf-8")
      return
    end

    if path.start_with?("/assets/")
      local = File.expand_path(File.join(STATIC_ROOT, path.delete_prefix("/assets/")))
      unless local.start_with?(STATIC_ROOT) && File.file?(local)
        json_response(response, 404, { error: "Asset not found" })
        return
      end
      serve_static(response, local, content_type(local))
      return
    end

    case path
    when %r{\A/api/content/([^/]+)\z}
      type = Regexp.last_match(1)
      json_response(response, 200, { type: type, label: TYPE_LABELS[type], records: list_records(type) })
    when %r{\A/api/content/([^/]+)/([^/]+)\z}
      type = Regexp.last_match(1)
      id = Regexp.last_match(2)
      if request.request_method == "GET"
        json_response(response, 200, load_content(type, id))
      else
        json_response(response, 200, save_content(type, id, read_json_body(request)))
      end
    when %r{\A/api/image/([^/]+)/([^/]+)\z}
      raise "Use POST for image upload" unless request.request_method == "POST"

      type = Regexp.last_match(1)
      id = Regexp.last_match(2)
      json_response(response, 200, upload_image(type, id, request))
    when %r{\A/api/preview-url/([^/]+)/([^/]+)\z}
      type = Regexp.last_match(1)
      id = Regexp.last_match(2)
      json_response(response, 200, { url: preview_url(type, id) })
    else
      json_response(response, 404, { error: "Not found" })
    end
  rescue StandardError => error
    warn "#{error.class}: #{error.message}"
    json_response(response, 500, { error: error.message })
  end

  def serve_static(response, path, type)
    response.status = 200
    response["Content-Type"] = type
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

server = WEBrick::HTTPServer.new(
  Port: PORT,
  BindAddress: "127.0.0.1",
  DocumentRoot: STATIC_ROOT,
  AccessLog: [],
  Logger: WEBrick::Log.new($stderr, WEBrick::Log::INFO)
)

server.mount("/", ContentEditorServlet)
trap("INT") { server.shutdown }
trap("TERM") { server.shutdown }

puts "BE-hop content editor: http://127.0.0.1:#{PORT}/"
puts "Preview target: #{PREVIEW_BASE_URL}"
server.start
