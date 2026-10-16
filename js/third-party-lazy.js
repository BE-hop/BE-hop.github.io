/* Optional embeds must never compete with the first screen. */
(() => {
  let ads;
  const activate = node => {
    if (node.hasAttribute('data-third-party-src')) {
      node.src = node.getAttribute('data-third-party-src');
      node.removeAttribute('data-third-party-src');
    }
    if (node.hasAttribute('data-lazy-ad')) {
      node.removeAttribute('data-lazy-ad');
      if (!ads) {
        ads = new Promise((resolve, reject) => {
          const script = document.createElement('script');
          script.async = true;
          script.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js';
          script.onload = resolve;
          script.onerror = reject;
          document.head.append(script);
        });
      }
      ads.then(() => (window.adsbygoogle = window.adsbygoogle || []).push({})).catch(() => {});
    }
  };
  if (!('IntersectionObserver' in window)) return;
  const observer = new IntersectionObserver(entries => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      observer.unobserve(entry.target);
      activate(entry.target);
    }
  }, { rootMargin: '100px' });
  const observe = () => document.querySelectorAll('[data-third-party-src], [data-lazy-ad]').forEach(node => observer.observe(node));
  if (document.readyState === 'complete') observe();
  else window.addEventListener('load', observe, { once: true });
})();
