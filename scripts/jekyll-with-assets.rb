require "jekyll"
# Apply the same asset/release pipeline in local preview, editor publishing, and CI.
Jekyll::Hooks.register :site, :post_write do |site|
  script = File.join(site.source, "scripts", "prepare-site.py")
  if File.file?(script)
    ok = system("python3", script, "--site", site.dest)
    raise "Responsive media/release preparation failed" unless ok
  end
end

load Gem.bin_path("jekyll", "jekyll")
