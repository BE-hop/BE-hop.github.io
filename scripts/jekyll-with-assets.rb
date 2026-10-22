require "jekyll"
require_relative "paginate-content"
# Apply the same asset/release pipeline in local preview, editor publishing, and CI.
Jekyll::Hooks.register :site, :post_write do |site|
  forum_script = File.join(site.source, "scripts", "prepare-forum.mjs")
  if File.file?(forum_script)
    raise "Static forum preparation failed" unless system("node", forum_script, site.dest)
  end
  script = File.join(site.source, "scripts", "prepare-site.py")
  if File.file?(script)
    ok = system("python3", script, "--site", site.dest)
    raise "Responsive media/release preparation failed" unless ok
  end
end

load Gem.bin_path("jekyll", "jekyll")
