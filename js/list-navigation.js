/* Filters are ordinary links so each category includes every paginated record. */
(() => {
  const current = document.body.dataset.listFilter;
  const links = [...document.querySelectorAll('[data-static-filter]')];
  const sync = () => {
    const lang = document.documentElement.lang.startsWith('zh') ? 'zh' : 'en';
    links.forEach(link => {
      const active = link.dataset.staticFilter === current;
      link.classList.toggle('is-active', active);
      if (active) link.setAttribute('aria-current', 'page');
      else link.removeAttribute('aria-current');
    });
    const selected = links.find(link => link.dataset.staticFilter === current);
    const status = document.querySelector('#project-filter-status, #ai-filter-status');
    if (!selected || !status) return;
    const count = document.querySelectorAll('[data-project], #ai-product-results > a').length;
    const label = selected.getAttribute('data-' + lang) || current;
    status.textContent = lang === 'zh' ? `本页显示 ${count} 项 · ${label}` : `${count} items on this page · ${label}`;
  };
  sync();
  document.addEventListener('portfolio:languagechange', sync);
  document.querySelectorAll('[data-lang]').forEach(button => button.addEventListener('click', sync));
})();
