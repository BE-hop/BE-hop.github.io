# Static, bounded collection lists. Content records and editor schemas remain canonical.
module BehopPagination
  SIZE = 12
  def self.page_url(base, number)
    number == 1 ? "/#{base}/" : "/#{base}/page/#{number}/"
  end
  def self.generate(site, source, base, records, filter = nil)
    pages = [1, (records.length.to_f / SIZE).ceil].max
    template_content = source.content.dup
    template_data = source.data.dup
    (1..pages).each do |number|
      url = page_url(base, number)
      target = if number == 1 && source.url == url
        source
      else
        page = Jekyll::PageWithoutAFile.new(site, site.source, url.sub(%r{^/}, ''), 'index.html')
        site.pages << page
        page
      end
      target.content = template_content
      target.data = template_data.merge(
        'permalink' => url,
        'list_items' => records.slice((number - 1) * SIZE, SIZE) || [],
        'list_products' => (records.slice((number - 1) * SIZE, SIZE) || []).select { |doc| doc.collection.label == 'ai_products' },
        'list_gallery' => (records.slice((number - 1) * SIZE, SIZE) || []).select { |doc| doc.collection.label == 'ai_gallery' },
        'list_filter' => filter,
        'list_anchor' => base.start_with?('works') ? 'works-results' : (base.start_with?('behop-ai-product') ? 'products' : nil),
        'list_page' => number,
        'list_pages' => pages,
        'list_previous' => number > 1 ? page_url(base, number - 1) : nil,
        'list_next' => number < pages ? page_url(base, number + 1) : nil
      )
    end
  end
end
Jekyll::Hooks.register :site, :post_read do |site|
  # Capture originals before generating pages; no data is written back to source.
  originals = site.pages.dup
  projects = site.collections['projects'].docs.reject { |doc| doc.data['visibility'] == 'hidden' }.sort_by { |doc| doc.data['order'] || 9999 }
  featured = projects.select { |doc| doc.data['featured'] == true }.first(3)
  projects = featured + (projects - featured)
  products = site.collections['ai_products'].docs.reject { |doc| ['hidden', 'concept'].include?(doc.data['visibility']) }.sort_by { |doc| doc.data['order'] || 9999 }
  gallery = site.collections['ai_gallery'].docs.reject { |doc| ['hidden', 'concept'].include?(doc.data['visibility']) }.sort_by { |doc| doc.data['order'] || 9999 }
  [['works', projects, 'all'], ['behop-ai-product', products + gallery, 'All']].each do |base, records, all|
    source = originals.find { |page| page.url == "/#{base}/" }
    next unless source
    BehopPagination.generate(site, source, base, records, all)
    categories = base == 'works' ? %w[professional academic landscape interior] : ['Design Tools', 'Rendering Workflow', 'Workflow Prototype']
    (categories + records.map { |doc| doc.data['category'] }.compact).uniq.each do |category|
      slug = category.downcase.gsub(/[^a-z0-9]+/, '-').gsub(/^-|-$/, '')
      BehopPagination.generate(site, source, "#{base}/category/#{slug}", records.select { |doc| doc.data['category'] == category }, category)
    end
  end
  [['blog', false], ['blog/en', true]].each do |base, english|
    source = originals.find { |page| page.url == "/#{base}/" }
    next unless source
    records = site.posts.docs.reverse.select { |doc| (doc.data['lang'] == 'en') == english }
    BehopPagination.generate(site, source, base, records)
  end
end
