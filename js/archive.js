/* Archive filtering, adapted from the original jekyll-TeXt-theme behavior.
   The static list stays visible even when this enhancement cannot run. */
(() => {
  const archive = document.querySelector('[data-archive-lang]')
  if (!archive) return
  const language = archive.dataset.archiveLang
  const result = archive.querySelector('.js-result')
  const buttons = [...archive.querySelectorAll('.js-tags a[data-encode]')]
  const sections = [...result.querySelectorAll('section')]
  const status = archive.querySelector('[data-archive-status]')
  const decode = value => {
    try { return decodeURIComponent(value.replace(/\+/g, ' ')) }
    catch (error) { return value }
  }
  const known = new Set(buttons.map(button => decode(button.dataset.encode)))
  const render = () => {
    const requested = new URLSearchParams(location.search).get('tag') || ''
    const tag = known.has(requested) ? requested : ''
    let count = 0
    sections.forEach(section => {
      let visible = 0
      section.querySelectorAll('.item').forEach(item => {
        const matches = !tag || item.dataset.tags.split(',').map(decode).includes(tag)
        item.hidden = !matches
        if (matches) visible++
      })
      section.hidden = visible === 0
      count += visible
    })
    buttons.forEach(button => {
      const selected = decode(button.dataset.encode) === tag
      button.classList.toggle('focus', selected)
      if (selected) button.setAttribute('aria-current', 'true')
      else button.removeAttribute('aria-current')
    })
    const fallback = requested && !tag
    status.textContent = language === 'zh'
      ? `${fallback ? '未找到该标签，显示全部文章。' : ''}共 ${count} 篇文章`
      : `${fallback ? 'Unknown tag; showing all posts. ' : ''}${count} posts`
  }
  buttons.forEach(button => button.addEventListener('click', event => {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
    event.preventDefault()
    const url = new URL(location.href)
    const tag = decode(button.dataset.encode)
    if (tag) url.searchParams.set('tag', tag)
    else url.searchParams.delete('tag')
    if (url.href !== location.href) history.pushState(null, '', url)
    render()
  }))
  window.addEventListener('popstate', render)
  document.querySelectorAll('[data-lang]').forEach(button => button.addEventListener('click', () => {
    const next = button.dataset.lang
    if (next === language) return
    const url = new URL(next === 'en' ? archive.dataset.archiveEnUrl : archive.dataset.archiveZhUrl, location.origin)
    url.search = location.search
    url.searchParams.delete('lang')
    location.assign(url)
  }))
  render()
})()
