/* Versioned offline cache. Old releases never mask successful online navigation. */
const VERSION = '__BUILD_VERSION__';
const SHELL = `behop-shell-${VERSION}`;
const MEDIA = `behop-media-${VERSION}`;
const LEGACY = ['main-precache-then-runtime', 'precache-v1', 'runtime', 'main-precache-v1', 'main-runtime'];
const MAX_MEDIA_BYTES = 60 * 1024 * 1024;
let mediaQueue = Promise.resolve();
const isLocal = url => url.origin === self.location.origin;
const isMedia = request => request.destination === 'image' || /\.(webp|png|jpe?g|gif)$/i.test(new URL(request.url).pathname);
async function store(request, response) {
  if (!response || !response.ok || response.type === 'opaque') return response;
  const media = isMedia(request);
  const copy = response.clone();
  if (media) {
    // Serialize eviction so simultaneous image loads cannot race the byte limit.
    mediaQueue = mediaQueue.catch(() => {}).then(async () => {
      const cache = await caches.open(MEDIA);
      await cache.delete(request);
      await cache.put(request, copy);
      const names = (await caches.keys()).filter(name => name.startsWith('behop-media-') && name !== MEDIA).concat(MEDIA);
      const entries = [];
      for (const name of names) {
        const bucket = await caches.open(name);
        for (const key of await bucket.keys()) entries.push({ bucket, key });
      }
      let bytes = 0;
      for (let i = entries.length - 1; i >= 0; i--) {
        const { bucket, key } = entries[i];
        const value = await bucket.match(key);
        bytes += Number(value.headers.get('content-length')) || (await value.blob()).size;
        if (bytes > MAX_MEDIA_BYTES || entries.length - i > 100) await bucket.delete(key);
      }
    });
    await mediaQueue;
  } else {
    const cache = await caches.open(SHELL);
    await cache.put(request, copy);
    // Bound previously visited pages/resources as well.
    const keys = await cache.keys();
    for (const key of keys.slice(0, Math.max(0, keys.length - 120))) await cache.delete(key);
  }
  return response;
}
self.addEventListener('install', event => {
  event.waitUntil((async () => {
    const cache = await caches.open(SHELL);
    await cache.addAll(['/offline.html', '/release.json']);
    // A failed install leaves the old worker intact. Upgrades wait for explicit consent.
  })());
});
self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    const names = await caches.keys();
    const previous = [...new Set(names.filter(name => name.startsWith('behop-shell-')).map(name => name.slice('behop-shell-'.length)).filter(v => v !== VERSION))].pop();
    const keep = [SHELL, MEDIA, `behop-shell-${previous}`, `behop-media-${previous}`];
    await Promise.all(names.filter(name => LEGACY.includes(name) || (name.startsWith('behop-') && !keep.includes(name))).map(name => caches.delete(name)));
    await self.clients.claim();
  })());
});
self.addEventListener('message', event => {
  if (event.data?.type === 'ACTIVATE_RELEASE') event.waitUntil(self.skipWaiting());
  if (event.data?.type === 'WARM_URLS') {
    const urls = [...new Set(event.data.urls || [])].filter(raw => {
      try { const u = new URL(raw, self.location.origin); return isLocal(u) && !u.pathname.startsWith('/api/') && !u.pathname.includes('content-editor'); } catch { return false; }
    }).slice(0, 40);
    event.waitUntil((async () => {
      for (const url of urls) {
        const req = new Request(url);
        if (await caches.match(req)) continue;
        try { await store(req, await fetch(req)); } catch { /* Offline; keep available resources. */ }
      }
    })());
  }
});
self.addEventListener('fetch', event => {
  const request = event.request;
  const url = new URL(request.url);
  if (request.method !== 'GET' || !isLocal(url) || url.pathname === '/sw.js' || url.pathname === '/release.json' || url.pathname.startsWith('/api/')) return;
  if (request.mode === 'navigate') {
    // Deliver headers/body immediately; only complete documents enter the cache.
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);
    const fresh = fetch(request, { signal: controller.signal });
    const completed = fresh.then(async response => {
      await response.clone().arrayBuffer();
      if (response.ok) await store(request, response);
    });
    event.waitUntil(completed.catch(async () => {
      const client = await self.clients.get?.(event.resultingClientId || event.clientId);
      client?.postMessage({ type: 'NAVIGATION_INTERRUPTED' });
    }).finally(() => clearTimeout(timeout)));
    event.respondWith((async () => {
      const currentCache = await caches.open(SHELL);
      const cached = (await currentCache.match(request)) || (await caches.match(request));
      if (cached && request.cache !== 'reload') {
        let timer;
        const grace = new Promise(resolve => { timer = setTimeout(() => resolve(cached), 1000); });
        const response = await Promise.race([fresh.catch(() => cached), grace]);
        clearTimeout(timer);
        return response;
      }
      try { return await fresh; }
      catch { return cached || (await caches.match('/offline.html')) || new Response('Connection timed out. Please retry.', { status: 503 }); }
    })());
    return;
  }
  const liveData = url.pathname.startsWith('/assets/data/forum-');
  const bounded = /\.(css|js)$/i.test(url.pathname) || liveData;
  let finishCache;
  const cacheWork = new Promise(resolve => { finishCache = resolve; });
  // Extend lifetime synchronously, even if cache lookup or fetch takes time.
  event.waitUntil(cacheWork);
  event.respondWith((async () => {
    let timer;
    try {
      const bucket = await caches.open(SHELL);
      const cached = (await bucket.match(request)) || (await caches.match(request));
      if (!liveData && cached) return cached;
      const controller = new AbortController();
      if (bounded) timer = setTimeout(() => controller.abort(), 8000);
      const response = await fetch(request, { ...(liveData ? { cache: 'no-cache' } : {}), signal: controller.signal });
      // A hung CSS/JS body is just as blocking as hung response headers.
      if (bounded) await response.clone().arrayBuffer();
      if (response.ok) {
        finishCache(store(request, response).catch(() => {}));
      }
      return response;
    } catch {
      return (await caches.match(request)) || new Response('', { status: 503, statusText: 'Not available offline' });
    } finally {
      clearTimeout(timer);
      finishCache();
    }
  })());
});
