/* Shared release/update controls. Never clear language preferences or unrelated caches. */
(() => {
  if (!('serviceWorker' in navigator)) return;
  const local = ['localhost', '127.0.0.1', '::1'].includes(location.hostname);
  const enableWorker = !local || new URLSearchParams(location.search).get('offline-test') === '1';
  // Start independently of deferred application scripts and DOM completion.
  const registrationTask = enableWorker
    ? navigator.serviceWorker.register('/sw.js', { updateViaCache: 'none' }).catch(() => null)
    : Promise.resolve(null);
  let stalled = false;
  const showRetry = () => {
    if (document.querySelector('[data-loading-retry]') || !document.body) return;
    const banner = document.createElement('aside');
    banner.dataset.loadingRetry = '';
    banner.setAttribute('role', 'status');
    // Inline recovery styling remains usable if the main stylesheet failed.
    banner.style.cssText = 'position:fixed;bottom:16px;left:16px;right:16px;z-index:2147483647;padding:12px;background:#fff;color:#172d25;border:1px solid #527765;font:14px system-ui;box-shadow:0 2px 12px #0003';
    const message = document.createElement('span');
    message.textContent = 'Loading is slow. You can keep reading or retry. / 加载较慢，可继续阅读或重试。 ';
    const retry = document.createElement('button');
    retry.type = 'button';
    retry.textContent = 'Retry / 重试';
    retry.onclick = () => location.reload();
    const dismiss = document.createElement('button');
    dismiss.type = 'button';
    dismiss.textContent = 'Dismiss / 关闭';
    dismiss.onclick = () => banner.remove();
    banner.append(message, retry, dismiss);
    document.body.append(banner);
  };
  const timer = setTimeout(() => {
    if (document.readyState !== 'complete') { stalled = true; showRetry(); }
  }, 9000);
  document.addEventListener('readystatechange', () => {
    if (stalled) showRetry();
    if (document.readyState === 'complete') {
      clearTimeout(timer);
      document.querySelector('[data-loading-retry]')?.remove();
    }
  });
  navigator.serviceWorker.addEventListener('message', event => {
    if (event.data?.type === 'NAVIGATION_INTERRUPTED') { stalled = true; showRetry(); }
  });
  const start = () => {
    const release = document.querySelector('meta[name="behop-release"]')?.content || '';
    const commit = document.querySelector('meta[name="behop-commit"]')?.content || '';
    let registration;
    let available = false;
    let reloadRequested = false;
    let checkedAt = 0;
    const zh = () => document.documentElement.lang.startsWith('zh');
    const panel = document.createElement('details');
    panel.className = 'site-release-controls';
    panel.innerHTML = `<summary>${zh() ? '网站版本与更新' : 'Site version & updates'}</summary><small></small><p role="status"></p><button type="button" data-check>Check updates / 检查更新</button> <button type="button" data-refresh hidden>Refresh / 刷新查看</button> <button type="button" data-repair>Repair site cache / 修复本站缓存</button>`;
    document.body.append(panel);
    panel.querySelector('small').textContent = `Version ${release.slice(0, 8)} · ${commit.slice(0, 8)}`;
    const status = text => { panel.querySelector('[role="status"]').textContent = text; };
    const offer = () => {
      available = true;
      panel.open = true;
      status(zh() ? '发现新版本，刷新后查看。' : 'A new version is ready. Refresh when convenient.');
      panel.querySelector('[data-refresh]').hidden = false;
    };
    async function check(manual = false) {
      if (!manual && Date.now() - checkedAt < 15 * 60 * 1000) return;
      checkedAt = Date.now();
      try {
        await registration?.update();
        const response = await fetch('/release.json', { cache: 'no-store' });
        if (!response.ok) throw new Error('Unavailable');
        const current = await response.json();
        if (current.version !== release || registration?.waiting) offer();
        else if (manual) status(zh() ? '已是最新版本。' : 'This is the latest version.');
      } catch { if (manual) status(zh() ? '暂时无法检查更新；已缓存页面仍可离线浏览。' : 'Cannot check now. Cached pages remain available offline.'); }
    }
    panel.querySelector('[data-check]').onclick = () => check(true);
    panel.querySelector('[data-refresh]').onclick = async () => {
      if (document.querySelector('form input:not([value=""]):focus, [contenteditable="true"]:focus')) return;
      reloadRequested = true;
      if (registration?.waiting) registration.waiting.postMessage({ type: 'ACTIVATE_RELEASE' });
      else location.reload();
    };
    panel.querySelector('[data-repair]').onclick = async () => {
      if (!confirm(zh() ? '清除本站离线缓存并重新加载？语言选择会保留。' : 'Clear this site’s offline cache and reload? Language preferences are preserved.')) return;
      const names = await caches.keys();
      await Promise.all(names.filter(name => name.startsWith('behop-') || ['main-precache-then-runtime', 'precache-v1', 'runtime', 'main-precache-v1', 'main-runtime'].includes(name)).map(name => caches.delete(name)));
      await registration?.unregister();
      const target = new URL(location.href);target.searchParams.set('cache-repair', Date.now());location.replace(target);
    };
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      if (reloadRequested) { reloadRequested = false; location.reload(); }
    });
    if (!enableWorker) return;
    registrationTask.then(async value => {
      if (!value) throw new Error('Registration unavailable');
      registration = value;
      if (value.waiting) offer();
      value.addEventListener('updatefound', () => {
        const installing = value.installing;
        installing?.addEventListener('statechange', () => {
          if (installing.state === 'installed' && navigator.serviceWorker.controller) offer();
        });
      });
      await check();
      const ready = await navigator.serviceWorker.ready;
      const warm = () => ready.active?.postMessage({ type: 'WARM_URLS', urls: [location.href] });
      if ('requestIdleCallback' in window) requestIdleCallback(warm, { timeout: 5000 }); else setTimeout(warm, 3000);
    }).catch(() => status('Offline support is unavailable / 离线支持暂不可用'));
    window.addEventListener('online', () => check(true));
    window.addEventListener('focus', () => check());
    // Images fetched before registration remain readable as alt text when unavailable offline.
    document.addEventListener('error', event => {
      if (event.target instanceof HTMLImageElement && !navigator.onLine) event.target.title = zh() ? '此图片尚未离线缓存' : 'This image has not been cached for offline use';
    }, true);
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start, { once: true });
  else start();
})();
