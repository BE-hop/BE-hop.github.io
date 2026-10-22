/* Image failures are local to the image; slow requests may continue. */
(() => {
  const states = new WeakMap();
  const zh = () => document.documentElement.lang.startsWith('zh');
  const managed = image => image instanceof HTMLImageElement && !image.closest('[data-reader-stage]') && image.getAttribute('src') && image.width !== 0;
  function clear(image) {
    const state = states.get(image);
    if (!state) return;
    clearTimeout(state.timer);
    state.notice?.remove();
    states.delete(image);
  }
  function notice(image, failed) {
    const state = states.get(image);
    if (!state || !image.isConnected) return;
    state.notice?.remove();
    const node = document.createElement('span');
    node.className = 'image-load-notice';
    node.setAttribute('role', 'status');
    const message = document.createElement('span');
    message.textContent = failed
      ? (zh() ? '图片暂未加载成功。' : 'Image could not load. ')
      : (zh() ? '图片正在慢速加载，可继续阅读。' : 'Image is loading slowly. You can keep reading. ');
    node.append(message);
    if (failed) {
      const retry = document.createElement('button');
      retry.type = 'button';
      retry.textContent = zh() ? '重试图片' : 'Retry image';
      retry.onclick = event => {
        event.preventDefault();
        event.stopPropagation();
        const src = image.getAttribute('src');
        const srcset = image.getAttribute('srcset');
        clear(image);
        image.removeAttribute('srcset');
        image.removeAttribute('src');
        if (srcset) image.setAttribute('srcset', srcset);
        image.setAttribute('src', src);
        watch(image);
      };
      node.append(retry);
    }
    const anchor = image.closest('a, button');
    (anchor || image).insertAdjacentElement('afterend', node);
    state.notice = node;
  }
  function watch(image) {
    if (!managed(image)) return;
    clear(image);
    if (image.complete && image.naturalWidth) return;
    const state = {};
    states.set(image, state);
    if (image.complete && !image.naturalWidth) { notice(image, true); return; }
    state.timer = setTimeout(() => {
      if (!image.complete) notice(image, false);
    }, 12000);
  }
  document.addEventListener('load', event => {
    if (event.target instanceof HTMLImageElement) clear(event.target);
  }, true);
  document.addEventListener('error', event => {
    if (!managed(event.target)) return;
    clear(event.target);
    states.set(event.target, {});
    notice(event.target, true);
  }, true);
  const observer = 'IntersectionObserver' in window ? new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const image = entry.target;
      if (image.dataset.lazySrc) {
        const src = image.dataset.lazySrc;
        const srcset = image.dataset.lazySrcset;
        delete image.dataset.lazySrc;
        delete image.dataset.lazySrcset;
        if (srcset) image.setAttribute('srcset', srcset);
        image.setAttribute('src', src);
      }
      watch(image);
      observer.unobserve(entry.target);
    });
  }, { rootMargin: '100px' }) : null;
  const add = image => {
    // A user replacement in the local editor supersedes a deferred preview.
    if (image.dataset.lazySrc && !image.getAttribute('src')?.startsWith('data:')) {
      delete image.dataset.lazySrc;
      delete image.dataset.lazySrcset;
    }
    if (observer) observer.observe(image);
    else {
      if (image.dataset.lazySrc) {
        if (image.dataset.lazySrcset) image.srcset = image.dataset.lazySrcset;
        image.src = image.dataset.lazySrc;
        delete image.dataset.lazySrc;
        delete image.dataset.lazySrcset;
      }
      watch(image);
    }
  };
  document.querySelectorAll('img').forEach(add);
  new MutationObserver(records => records.forEach(record => {
    if (record.type === 'attributes') { add(record.target); return; }
    record.addedNodes.forEach(node => {
      if (!(node instanceof Element)) return;
      if (node.matches('img')) add(node);
      node.querySelectorAll('img').forEach(add);
    });
  })).observe(document.body, { subtree: true, childList: true, attributes: true, attributeFilter: ['src', 'srcset'] });
})();
