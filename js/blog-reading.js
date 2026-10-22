/* Blog reading does not depend on jQuery, Bootstrap, or a search-library download. */
(() => {
  window.generateCatalog = selector => {
    const list = document.querySelector(selector);
    if (!list) return;
    list.replaceChildren();
    const content = document.querySelector('.post-container.active') || document.querySelector('.post-container');
    content?.querySelectorAll('h1,h2,h3,h4,h5,h6').forEach((heading,index) => {
      if (!heading.id) heading.id = `section-${index+1}`;
      const item = document.createElement('li');
      item.className = heading.tagName.toLowerCase() + '_nav';
      const link = document.createElement('a');
      link.href = '#' + heading.id;
      link.textContent = heading.textContent;
      item.append(link);list.append(item);
    });
  };
  window.generateCatalog('.catalog-body');
  document.querySelector('.catalog-toggle')?.addEventListener('click', event => {
    event.preventDefault();
    const catalog = document.querySelector('.side-catalog');
    catalog?.classList.toggle('fold');
    event.currentTarget.setAttribute('aria-expanded', String(!catalog?.classList.contains('fold')));
  });
  document.querySelectorAll('.post-container table').forEach(table => {
    if (table.parentElement.classList.contains('table-responsive')) return;
    const wrap = document.createElement('div');wrap.className = 'table-responsive';
    table.before(wrap);wrap.append(table);table.classList.add('table');
  });
  document.querySelectorAll('.post-container iframe[src*="youtube.com"], .post-container iframe[src*="vimeo.com"]').forEach(frame => {
    if (frame.parentElement.classList.contains('embed-responsive')) return;
    const wrap = document.createElement('div');wrap.className = 'embed-responsive embed-responsive-16by9';
    frame.before(wrap);wrap.append(frame);frame.classList.add('embed-responsive-item');
  });
  const overlay = document.querySelector('.search-page');
  const input = document.querySelector('#search-input');
  const results = document.querySelector('#search-results');
  let records;
  let sequence = 0;
  const close = () => {overlay?.classList.remove('search-active');overlay?.setAttribute('aria-hidden','true');document.body.classList.remove('no-scroll');document.querySelector('.blog-search-open')?.focus();};
  document.querySelectorAll('.search-icon').forEach(link => {link.hidden = false;link.addEventListener('click',event => {
    event.preventDefault();overlay?.classList.add('search-active');overlay?.setAttribute('aria-hidden','false');document.body.classList.add('no-scroll');input?.focus();
  });});
  input?.closest('form')?.addEventListener('submit',event=>event.preventDefault());
  document.querySelector('.search-icon-close')?.addEventListener('click', close);
  document.addEventListener('keydown',event => {
    if (!overlay?.classList.contains('search-active')) return;
    if (event.key === 'Escape') close();
    if (event.key === 'Tab') {
      const controls = [...overlay.querySelectorAll('button, input, a[href]')];
      const first = controls[0], last = controls.at(-1);
      if (event.shiftKey && document.activeElement === first) {event.preventDefault();last?.focus();}
      else if (!event.shiftKey && document.activeElement === last) {event.preventDefault();first?.focus();}
    }
  });
  input?.addEventListener('input',async () => {
    const current = ++sequence;
    const query = input.value.trim().toLocaleLowerCase();
    if (!results) return;
    results.replaceChildren();
    if (!query) return;
    try {
      if (!records) records = fetch('/search.json').then(response => {
        if (!response.ok) throw Error('Search unavailable');return response.json();
      }).catch(error => {records = null;throw error;});
      const data = await records;
      if(current !== sequence)return;
      data.filter(item => [item.title,item.subtitle,item.content,item.tags].join(' ').toLocaleLowerCase().includes(query)).slice(0,50).forEach(item => {
        const article = document.createElement('div');article.className = 'post-preview item';
        const link = document.createElement('a');link.href = item.url;
        const title = document.createElement('h2');title.className = 'post-title';
        const decode = document.createElement('textarea');decode.innerHTML = item.title || '';title.textContent = decode.value;
        link.append(title);article.append(link);results.append(article);
      });
      if(!results.children.length)results.textContent = 'No results / 没有匹配结果';
    } catch {if(current === sequence)results.textContent = 'Search could not load. Type again to retry. / 搜索暂不可用，请重新输入以重试。';}
  });
})();
