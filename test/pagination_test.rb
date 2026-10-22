# frozen_string_literal: true
ENV['BUNDLE_PATH'] ||= '/tmp/behop-bundle'
ENV['BUNDLE_USER_HOME'] ||= '/tmp/bundle-home'
require 'bundler/setup'
require 'jekyll'
require 'minitest/autorun'
require 'tmpdir'
require 'fileutils'
require_relative '../scripts/paginate-content'

class PaginationTest < Minitest::Test
  def test_growth_keeps_pages_bounded_and_every_record_reachable
    [1, 2, 5].each do |scale|
      Dir.mktmpdir('behop-pagination-') do |root|
        %w[works behop-ai-product blog blog/en _projects _ai_products _ai_gallery _posts].each { |dir| FileUtils.mkdir_p(File.join(root, dir)) }
        %w[works behop-ai-product blog blog/en].each do |base|
          File.write(File.join(root, base, 'index.html'), "---\nlayout: null\npermalink: /#{base}/\n---\n{% for item in page.list_items %}<article>{{ item.url }}</article>{% endfor %}")
        end
        { 'projects' => 7 * scale, 'ai_products' => 13 * scale, 'ai_gallery' => 6 * scale }.each do |collection, count|
          count.times do |index|
            category = collection == 'projects' ? (index.even? ? 'interior' : 'professional') : 'Design Tools'
            File.write(File.join(root, "_#{collection}", "item-#{index}.md"), "---\nlayout: null\norder: #{index}\ncategory: #{category}\nfeatured: #{index < 7}\n---\nSynthetic record")
          end
        end
        (10 * scale).times do |index|
          %w[en zh].each do |lang|
            File.write(File.join(root, '_posts', "2026-01-01-item-#{index}-#{lang}.md"), "---\nlayout: null\nlang: #{lang}\n---\nSynthetic post")
          end
        end
        config = Jekyll.configuration({ 'source' => root, 'destination' => File.join(root, '_site'), 'quiet' => true, 'collections' => { 'projects' => { 'output' => true }, 'ai_products' => { 'output' => true }, 'ai_gallery' => { 'output' => true } } })
        site = Jekyll::Site.new(config)
        site.process
        { 'works' => 7 * scale, 'behop-ai-product' => 19 * scale, 'blog' => 10 * scale, 'blog/en' => 10 * scale }.each do |base, total|
          files = [File.join(root, '_site', base, 'index.html')] + Dir.glob(File.join(root, '_site', base, 'page', '*', 'index.html'))
          records = files.flat_map do |file|
            rows = File.read(file).scan(/<article>(.*?)<\/article>/).flatten
            assert_operator rows.length, :<=, 12
            rows
          end
          assert_equal total, records.length, base
          assert_equal total, records.uniq.length, base
        end
        category = File.read(File.join(root, '_site/works/category/interior/index.html'))
        assert_equal [12, (7 * scale + 1) / 2].min, category.scan('<article>').length
        assert_equal ((7 * scale + 1) / 2 > 12), File.file?(File.join(root, '_site/works/category/interior/page/2/index.html'))
      end
    end
  end
end
