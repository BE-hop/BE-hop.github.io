/* Immediate navigation; only an explicit detail/loupe action requests high resolution. */
(() => {
  const root = document.querySelector('.portfolio-books');
  if (!root) return;
  const names = {planning:['Planning','规划'], landscape:['Landscape','景观'], spatial:['Spatial + Architecture','空间与建筑']};
  const spreads = {planning:[], landscape:[], spatial:[]};
  root.querySelectorAll('[data-book-spread]').forEach(node => {
    spreads[node.dataset.book]?.push({small:node.dataset.srcSmall || node.dataset.src, reading:node.dataset.srcset || '', full:node.dataset.fullSrc || node.dataset.src, original:node.dataset.originalSrc, en:node.dataset.altEn, zh:node.dataset.altZh});
  });
  const reader = root.querySelector('#portfolio-reader');
  const canvas = root.querySelector('[data-reader-canvas]');
  const image = root.querySelector('[data-reader-current]');
  const previous = root.querySelector('[data-reader-prev]');
  const next = root.querySelector('[data-reader-next]');
  const fallback = root.querySelector('[data-reader-fallback]');
  const fullLink = root.querySelector('[data-reader-full]');
  const loupe = root.querySelector('[data-reader-loupe]');
  const lens = root.querySelector('[data-reader-loupe-lens]');
  const toggle = root.querySelector('[data-reader-loupe-toggle]');
  const finePointer = matchMedia('(hover: hover) and (pointer: fine)');
  const state = {book:'planning', pages:{planning:0, landscape:0, spatial:0}, detail:false};
  let visible = !('IntersectionObserver' in window);
  let sequence = 0;
  let slowTimer;
  let prefetchTimer;
  const downloads = new Map();
  const language = () => {
    try { return localStorage.getItem('portfolioLang') || document.documentElement.lang; }
    catch { return document.documentElement.lang; }
  };
  const t = (en, zh) => language().startsWith('zh') ? zh : en;
  const current = () => spreads[state.book][state.pages[state.book]];
  // Keep a small decoded-preview working set; no speculative detail requests.
  function download(src) {
    if (downloads.has(src)) return downloads.get(src);
    const task = new Promise(resolve => {
      const candidate = new Image();
      candidate.onload = () => resolve(candidate);
      candidate.onerror = () => { downloads.delete(src); resolve(null); };
      candidate.src = src;
    });
    downloads.set(src, task);
    if (downloads.size > 4) downloads.delete(downloads.keys().next().value);
    return task;
  }
  function readingSource(spread) {
    const width = canvas.clientWidth * Math.min(window.devicePixelRatio || 1, 1.5);
    const candidates = spread.reading.split(',').map(entry => entry.trim().split(/\s+/)).filter(entry => entry.length === 2 && parseInt(entry[1],10) >= 768 && parseInt(entry[1],10) <= 1280);
    return (candidates.find(entry => parseInt(entry[1],10) >= width) || candidates.at(-1) || [spread.small])[0];
  }
  function showImage() {
    const spread = current();
    if (!spread || !visible) return;
    const request = ++sequence;
    clearTimeout(slowTimer);
    fallback.hidden = true;
    image.removeAttribute('srcset');
    // A new page must never display the previous board while waiting for the network.
    image.src = spread.small;
    image.alt = t(spread.en, spread.zh);
    fullLink.href = spread.full;
    fullLink.dataset.mediaOriginal = spread.original || spread.full;
    fullLink.dataset.mediaPreview = spread.small;
    fullLink.dataset.mediaCaption = image.alt;
    fullLink.textContent = t('View high resolution', '查看高清图');
    const source = state.detail ? spread.full : readingSource(spread);
    slowTimer = setTimeout(() => {
      if (request !== sequence) return;
      fallback.hidden = false;
      fallback.textContent = t('Image is loading. You can keep turning pages.', '图面正在加载，可继续翻页。');
    }, 12000);
    download(source).then(loaded => {
      if (request !== sequence) return;
      clearTimeout(slowTimer);
      if (loaded) { image.src = source; fallback.hidden = true; updateLoupe(); }
      else {
        fallback.hidden = false;
        fallback.textContent = t('Image could not load. ', '图面暂未加载成功。');
        const retry = document.createElement('button');
        retry.textContent = t('Retry', '重试');
        retry.onclick = () => { downloads.delete(source); showImage(); };
        fallback.append(retry);
      }
    });
    clearTimeout(prefetchTimer);
    const connection = navigator.connection;
    if (!connection?.saveData && !/(^|-)2g$/.test(connection?.effectiveType || '')) {
      const book = state.book;
      const page = state.pages[book] + 1;
      prefetchTimer = setTimeout(() => {
        if (book === state.book && spreads[book][page]) download(spreads[book][page].small);
      }, 600);
    }
  }
  function updateLoupe(x = .78, y = .7) {
    const enabled = state.detail && finePointer.matches;
    loupe.setAttribute('aria-hidden', String(!enabled));
    toggle.hidden = !finePointer.matches;
    toggle.setAttribute('aria-pressed', String(enabled));
    if (!enabled) { lens.style.backgroundImage = 'none'; return; }
    const rect = canvas.getBoundingClientRect();
    const stageRect = root.querySelector('[data-reader-stage]').getBoundingClientRect();
    loupe.style.setProperty('--loupe-left', `${rect.left - stageRect.left + x * rect.width}px`);
    loupe.style.setProperty('--loupe-top', `${rect.top - stageRect.top + y * rect.height}px`);
    lens.style.backgroundImage = `url("${image.src}")`;
    lens.style.backgroundSize = `${rect.width * 2.3}px ${rect.height * 2.3}px`;
    lens.style.backgroundPosition = `${lens.clientWidth / 2 - x * rect.width * 2.3}px ${lens.clientHeight / 2 - y * rect.height * 2.3}px`;
  }
  function render(load = true) {
    const page = state.pages[state.book];
    const count = spreads[state.book].length;
    root.querySelector('[data-reader-title]').textContent = t(...names[state.book]);
    root.querySelector('[data-reader-kicker]').textContent = `${Object.keys(names).indexOf(state.book)+1} / ${t(...names[state.book])}`;
    root.querySelector('[data-reader-counter]').textContent = `${String(page+1).padStart(2,'0')} / ${String(count).padStart(2,'0')}`;
    root.querySelector('[data-reader-status]').textContent = t(`Spread ${page+1} of ${count}`, `图面 ${page+1} / ${count}`);
    previous.disabled = page === 0;
    next.disabled = page === count - 1;
    root.querySelectorAll('[data-book-select]').forEach(button => {
      const selected = button.dataset.bookSelect === state.book;
      button.classList.toggle('is-selected', selected);
      button.setAttribute('aria-selected', String(selected));
    });
    updateLoupe();
    if (load) showImage();
  }
  function step(direction) {
    const target = state.pages[state.book] + direction;
    if (target < 0 || target >= spreads[state.book].length) return;
    state.pages[state.book] = target;
    state.detail = false;
    render();
  }
  function selectBook(book, focus = false) {
    if (!spreads[book]?.length) return;
    state.book = book;
    state.detail = false;
    visible = true;
    render();
    if (focus) { reader.scrollIntoView({block:'start', behavior:'auto'}); reader.focus({preventScroll:true}); }
  }
  previous.onclick = () => step(-1);
  next.onclick = () => step(1);
  root.querySelectorAll('[data-book-select]').forEach(button => button.addEventListener('click', () => selectBook(button.dataset.bookSelect, true)));
  document.querySelectorAll('[data-book-jump]').forEach(link => link.addEventListener('click', () => selectBook(link.dataset.bookJump)));
  reader.addEventListener('keydown', event => {
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') { event.preventDefault(); step(event.key === 'ArrowLeft' ? -1 : 1); }
  });
  let pointer;
  canvas.addEventListener('pointerdown', event => {
    if (event.button !== 0) return;
    pointer = {id:event.pointerId, x:event.clientX, y:event.clientY};
    canvas.setPointerCapture(event.pointerId);
  });
  canvas.addEventListener('pointerup', event => {
    if (!pointer || pointer.id !== event.pointerId) return;
    const dx = event.clientX - pointer.x;
    const dy = event.clientY - pointer.y;
    pointer = null;
    if (Math.abs(dy) > Math.max(12, Math.abs(dx))) return;
    const rect = canvas.getBoundingClientRect();
    if (Math.abs(dx) > 30) step(dx < 0 ? 1 : -1);
    else if (Math.abs(dx) < 8) step(event.clientX > rect.left + rect.width/2 ? 1 : -1);
  });
  canvas.addEventListener('pointercancel', () => { pointer = null; });
  canvas.addEventListener('dragstart', event => event.preventDefault());
  toggle.onclick = () => { state.detail = !state.detail; showImage(); updateLoupe(); };
  let loupePointer;
  loupe.addEventListener('pointerdown', event => { loupePointer = event.pointerId; loupe.setPointerCapture(event.pointerId); });
  loupe.addEventListener('pointermove', event => {
    if (loupePointer !== event.pointerId) return;
    const rect = canvas.getBoundingClientRect();
    updateLoupe(Math.max(0,Math.min(1,(event.clientX-rect.left)/rect.width)),Math.max(0,Math.min(1,(event.clientY-rect.top)/rect.height)));
  });
  loupe.addEventListener('pointerup', () => { loupePointer = null; });
  loupe.addEventListener('pointercancel', () => { loupePointer = null; });
  finePointer.addEventListener('change', updateLoupe);
  function applyLanguage() {
    root.querySelectorAll('[data-portfolio-en][data-portfolio-zh]').forEach(node => { node.textContent = t(node.dataset.portfolioEn,node.dataset.portfolioZh); });
    Object.keys(names).forEach(book => {
      root.querySelectorAll(`[data-book-title="${book}"]`).forEach(node => { node.textContent = t(...names[book]); });
      root.querySelectorAll(`[data-book-count="${book}"]`).forEach(node => { node.textContent = t(`${spreads[book].length} spreads`,`${spreads[book].length} 张图面`); });
    });
    render();
  }
  document.querySelectorAll('[data-lang]').forEach(button => button.addEventListener('click', () => {
    const lang = button.dataset.lang === 'zh' ? 'zh' : 'en';
    try { ['portfolioLang','blogLang','behopAiLang'].forEach(key => localStorage.setItem(key,lang)); } catch { /* This visit still works. */ }
    document.documentElement.lang = lang;
    applyLanguage();
  }));
  window.addEventListener('storage', applyLanguage);
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      if (!entries.some(entry => entry.isIntersecting)) return;
      visible = true;
      observer.disconnect();
      showImage();
    }, {rootMargin:'100px'});
    observer.observe(reader);
  }
  const initialBook = new URLSearchParams(location.search).get('book');
  if (spreads[initialBook]?.length) selectBook(initialBook);
  applyLanguage();
})();
