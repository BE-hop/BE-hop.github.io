/* One-time legacy retirement. New visits use the browser's ordinary HTTP cache. */
(() => {
  if (!('serviceWorker' in navigator)) return;
  const retire = async () => {
    try {
      const registrations = await navigator.serviceWorker.getRegistrations();
      for (const registration of registrations) {
        const worker = registration.active || registration.waiting || registration.installing;
        if (!worker || new URL(worker.scriptURL).origin !== location.origin || new URL(worker.scriptURL).pathname !== '/sw.js') continue;
        // Let existing controlled tabs finish naturally. Preserve caches and language storage.
        await registration.unregister();
      }
    } catch { /* Storage restrictions must not affect reading. */ }
  };
  const schedule = () => {
    if ('requestIdleCallback' in window) window.requestIdleCallback(retire, {timeout:5000});
    else setTimeout(retire, 1500);
  };
  if (document.readyState === 'complete') schedule();
  else window.addEventListener('load', schedule, {once:true});
})();
