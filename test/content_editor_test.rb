# frozen_string_literal: true

require "fileutils"
require "minitest/autorun"
require "open3"
require "stringio"
require "tmpdir"

REPO_ROOT = File.expand_path("..", __dir__)
TEST_ROOT = Dir.mktmpdir("behop-editor-test-")
REMOTE_ROOT = Dir.mktmpdir("behop-editor-remote-")

def run_test_command(*args, chdir: TEST_ROOT)
  stdout, stderr, status = Open3.capture3(*args, chdir: chdir)
  raise "#{args.join(' ')} failed: #{stderr}\n#{stdout}" unless status.success?

  stdout
end

%w[
  _data _projects _ai_products _ai_gallery _posts
  img/portfolio/homepage img/portfolio/real-works img/portfolio/about
  img/ai-products img/ai-gallery img/posts
].each { |dir| FileUtils.mkdir_p(File.join(TEST_ROOT, dir)) }

File.write(File.join(TEST_ROOT, "_data", "site_settings.yml"), "brand_zh: BEhop\nbrand_en: BEhop\nemail: test@example.com\ndefault_language: en\n")
File.write(File.join(TEST_ROOT, "_data", "homepage.yml"), "hero:\n  background_image: /img/portfolio/homepage/hero.jpg\n  title_lines_zh: [BEhop]\n  title_lines_en: [BEhop]\n")
File.write(File.join(TEST_ROOT, "_data", "about.yml"), "title_zh: 关于\ntitle_en: About\nsubtitle_zh: 设计师\nsubtitle_en: Designer\nbackground_image: /img/portfolio/about/cover.jpg\n")
File.write(File.join(TEST_ROOT, "_data", "worksarchive.yml"), "[]\n")
File.write(File.join(TEST_ROOT, "img", "portfolio", "homepage", "hero.jpg"), "\xFF\xD8\xFF".b)
File.write(File.join(TEST_ROOT, "img", "portfolio", "about", "cover.jpg"), "\xFF\xD8\xFF".b)
File.write(
  File.join(TEST_ROOT, "_projects", "original.md"),
  "---\nlayout: project\ntitle_zh: 原项目\ntitle_en: Original\nsummary_zh: 摘要\nsummary_en: Summary\ncategory: professional\ncover: /img/portfolio/homepage/hero.jpg\norder: 1\n---\nOriginal body\n"
)

run_test_command("git", "init")
run_test_command("git", "checkout", "-b", "master")
run_test_command("git", "config", "user.name", "BEhop Test")
run_test_command("git", "config", "user.email", "test@example.com")
run_test_command("git", "add", ".")
run_test_command("git", "commit", "-m", "test baseline")
run_test_command("git", "init", "--bare", REMOTE_ROOT, chdir: File.dirname(REMOTE_ROOT))
run_test_command("git", "remote", "add", "origin", REMOTE_ROOT)
run_test_command("git", "push", "-u", "origin", "master")

ENV["CONTENT_EDITOR_ROOT"] = TEST_ROOT
ENV["CONTENT_EDITOR_STATIC_ROOT"] = File.join(REPO_ROOT, "content-editor")
ENV["CONTENT_EDITOR_SCHEMA"] = File.join(REPO_ROOT, "content-editor", "schema.yml")
ENV["CONTENT_EDITOR_ALLOW_NO_ORIGIN"] = "1"
ENV["CONTENT_EDITOR_SKIP_PREFLIGHT_COMMANDS"] = "1"

require_relative "../scripts/content-editor"

Minitest.after_run do
  FileUtils.rm_rf(TEST_ROOT)
  FileUtils.rm_rf(REMOTE_ROOT)
end

class ContentEditorTest < Minitest::Test
  i_suck_and_my_tests_are_order_dependent!

  def test_10_schema_covers_all_owner_content_types
    expected = %w[site-settings homepage projects ai-products ai-gallery archive about blog]
    assert_equal expected.sort, TYPE_SCHEMAS.keys.sort
  end

  def test_20_write_path_is_restricted
    assert_raises(RuntimeError) { assert_allowed_write_path!(File.join(TEST_ROOT, ".git", "config")) }
    assert_raises(RuntimeError) { assert_allowed_write_path!(File.join(TEST_ROOT, "README.md")) }
    assert assert_allowed_write_path!(File.join(TEST_ROOT, "_projects", "safe.md"))
  end

  def test_25_dirty_startup_file_is_blocked
    dirty = File.join(TEST_ROOT, "_projects", "startup-conflict.md")
    File.write(dirty, "---\ntitle: conflict\n---\n")
    env = {
      "CONTENT_EDITOR_ROOT" => TEST_ROOT,
      "CONTENT_EDITOR_STATIC_ROOT" => File.join(REPO_ROOT, "content-editor"),
      "CONTENT_EDITOR_SCHEMA" => File.join(REPO_ROOT, "content-editor", "schema.yml")
    }
    code = <<~RUBY
      require #{File.join(REPO_ROOT, "scripts", "content-editor.rb").inspect}
      begin
        ensure_session_writable!(#{dirty.inspect})
      rescue => error
        puts error.message
      end
    RUBY
    stdout, stderr, status = Open3.capture3(env, "ruby", "-e", code)
    assert status.success?, stderr
    assert_includes stdout, "already modified before the editor started"
  ensure
    FileUtils.rm_f(dirty)
  end

  def test_30_create_save_and_history
    created = create_content("projects", "id" => "sample-project")
    assert_equal "hidden", created.dig("data", "visibility")

    data = created["data"].merge(
      "visibility" => "public",
      "title_zh" => "测试项目",
      "title_en" => "Test Project",
      "summary_zh" => "中文摘要",
      "summary_en" => "English summary",
      "category" => "professional",
      "cover" => "/img/portfolio/homepage/hero.jpg",
      "order" => 2
    )
    saved = save_content("projects", "sample-project", "data" => data, "body" => "Project body\n")
    assert_equal "Test Project", saved.dig("data", "title_en")
    refute_empty history_records("projects", "sample-project")
  end

  def test_40_blog_pair_creation_and_cross_links
    created = create_content("blog", "id" => "paired-post")
    id = created["id"]
    assert_match(/^\d{4}-\d{2}-\d{2}-paired-post$/, id)
    assert_includes File.read(blog_file(id, "zh")), "English version"
    assert_includes File.read(blog_file(id, "en")), "中文版"

    created["body"] = {
      "zh" => "## 中文章节\n\n正文\n",
      "en" => "## English Section\n\nBody\n"
    }
    saved = save_content("blog", id, created)
    assert_equal 1, saved.dig("body", "zh").lines.count { |line| line.start_with?("## ") }
    assert_equal 1, saved.dig("body", "en").lines.count { |line| line.start_with?("## ") }
  end

  def test_50_image_signature_and_draft_upload
    assert_equal ".jpg", image_extension("\xFF\xD8\xFFmore".b)
    assert_equal ".png", image_extension("\x89PNG\r\n\x1A\nmore".b)
    assert_nil image_extension("not an image")

    upload = StringIO.new("\x89PNG\r\n\x1A\npayload".b)
    request = Struct.new(:query).new("file" => upload, "field" => "cover")
    result = upload_image("projects", "sample-project", request)
    assert result["path"].start_with?("/img/portfolio/real-works/sample-project/")
    target = File.join(TEST_ROOT, result["path"].delete_prefix("/"))
    refute File.exist?(target)
    assert File.file?(draft_upload(result["draft_token"])["source"])

    content = load_content("projects", "sample-project")
    content["data"]["cover"] = result["path"]
    save_content("projects", "sample-project", content)
    assert File.file?(target)
    assert_empty PENDING_UPLOADS
  end

  def test_55_schema_field_types_are_enforced
    content = load_content("projects", "sample-project")
    content["data"]["order"] = "not-a-number"
    error = assert_raises(RuntimeError) { save_content("projects", "sample-project", content) }
    assert_includes error.message, "Invalid number field"
  end

  def test_60_security_headers_are_enforced
    request_class = Struct.new(:headers) do
      def [](key)
        headers[key]
      end
    end
    bad_host = request_class.new("host" => "example.com", "x-csrf-token" => CSRF_TOKEN, "content-type" => "application/json")
    assert_raises(RuntimeError) { validate_mutation_request!(bad_host, "application/json") }

    bad_token = request_class.new("host" => "127.0.0.1:4567", "x-csrf-token" => "bad", "content-type" => "application/json")
    assert_raises(RuntimeError) { validate_mutation_request!(bad_token, "application/json") }

    bad_type = request_class.new("host" => "127.0.0.1:4567", "x-csrf-token" => CSRF_TOKEN, "content-type" => "application/jsonp")
    assert_raises(RuntimeError) { validate_mutation_request!(bad_type, "application/json") }
  end

  def test_70_soft_delete_tracks_a_real_git_deletion
    result = delete_content("projects", "original")
    assert result["ok"]
    refute File.exist?(File.join(TEST_ROOT, "_projects", "original.md"))
    assert_includes SESSION_CHANGED, "_projects/original.md"
  end

  def test_80_remote_ahead_blocks_publish
    original_remote = run_test_command("git", "--git-dir", REMOTE_ROOT, "rev-parse", "refs/heads/master").strip
    clone = Dir.mktmpdir("behop-editor-ahead-")
    run_test_command("git", "clone", "--branch", "master", REMOTE_ROOT, clone, chdir: File.dirname(clone))
    run_test_command("git", "config", "user.name", "Remote Test", chdir: clone)
    run_test_command("git", "config", "user.email", "remote@example.com", chdir: clone)
    File.write(File.join(clone, "remote-change.txt"), "remote\n")
    run_test_command("git", "add", "remote-change.txt", chdir: clone)
    run_test_command("git", "commit", "-m", "remote change", chdir: clone)
    run_test_command("git", "push", "origin", "master", chdir: clone)
    error = assert_raises(RuntimeError) { publish_preflight }
    assert_includes error.message, "diverged"
  ensure
    if original_remote
      run_test_command("git", "--git-dir", REMOTE_ROOT, "update-ref", "refs/heads/master", original_remote)
      run_test_command("git", "fetch", "origin", "+master:refs/remotes/origin/master")
    end
    FileUtils.rm_rf(clone) if clone
  end

  def test_85_build_failure_blocks_publish
    fake_bin = File.join(TEST_ROOT, "fake-bin")
    scripts = File.join(TEST_ROOT, "scripts")
    FileUtils.mkdir_p([fake_bin, scripts])
    File.write(File.join(fake_bin, "npm"), "#!/bin/sh\nexit 0\n")
    File.write(File.join(scripts, "local-preview.sh"), "#!/bin/sh\nexit 9\n")
    FileUtils.chmod(0o755, [File.join(fake_bin, "npm"), File.join(scripts, "local-preview.sh")])
    old_path = ENV["PATH"]
    ENV["PATH"] = "#{fake_bin}:#{old_path}"
    ENV["CONTENT_EDITOR_SKIP_PREFLIGHT_COMMANDS"] = "0"
    before = PUBLISH_TOKENS.length
    assert_raises(RuntimeError) { publish_preflight }
    assert_equal before, PUBLISH_TOKENS.length
  ensure
    ENV["PATH"] = old_path if old_path
    ENV["CONTENT_EDITOR_SKIP_PREFLIGHT_COMMANDS"] = "1"
  end

  def test_90_publish_uses_only_session_paths_and_pushes_to_temp_remote
    preflight = publish_preflight
    assert_equal SESSION_CHANGED.to_a.sort, preflight["paths"]
    result = publish_confirm(preflight["token"], "content(site): editor integration test")
    assert result["ok"]
    assert_empty SESSION_CHANGED
    remote_subject = run_test_command("git", "--git-dir", REMOTE_ROOT, "log", "-1", "--format=%s", "refs/heads/master")
    assert_equal "content(site): editor integration test", remote_subject.strip
  end
end
