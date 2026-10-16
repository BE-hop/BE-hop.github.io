/* One-time recovery: do not wait for blocking styles or the footer to update a stalled worker. */
(() => {
  const key = 'behop-navigation-repair-20261016-v1';
  try {
    if (!('serviceWorker' in navigator) || ['localhost','127.0.0.1','::1'].includes(location.hostname) || localStorage.getItem(key)) return;
    const controlled = !!navigator.serviceWorker.controller;
    let requested = false;
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      if (!requested) return;
      localStorage.setItem(key, 'done');
      // Recover only an unfinished document, never a form or an already readable page.
      if (controlled && document.readyState === 'loading' && !document.querySelector('input,textarea,[contenteditable]')) location.reload();
    });
    navigator.serviceWorker.register('/sw.js', { updateViaCache: 'none' }).then(registration => {
      const activate = () => {
        if (!registration.waiting) return;
        requested = true;
        registration.waiting.postMessage({ type: 'ACTIVATE_RELEASE' });
      };
      activate();
      registration.addEventListener('updatefound', () => {
        registration.installing?.addEventListener('statechange', activate);
      });
      if (!controlled) navigator.serviceWorker.ready.then(() => localStorage.setItem(key, 'done'));
      registration.update().catch(() => {});
    }).catch(() => {});
  } catch { /* Storage or workers unavailable: keep normal navigation. */ }
})();
