/* Complete cached pages open immediately; refresh and release upgrades remain explicit. */
const VERSION = '__BUILD_VERSION__';
const SHELL = `behop-shell-${VERSION}`;
const MEDIA = `behop-media-${VERSION}`;
const LEGACY = ['main-precache-then-runtime', 'precache-v1', 'runtime', 'main-precache-v1', 'main-runtime'];
const MAX_MEDIA_BYTES = 60 * 1024 * 1024;
let mediaQueue = Promise.resolve();
let mediaIndex;
// Recover sizes once per worker lifetime, then update only the changed entry.
async function getMediaIndex() {
  if (mediaIndex) return mediaIndex;
  mediaIndex = new Map();
  const names = (await caches.keys()).filter(name => name.startsWith('behop-media-') && name !== MEDIA).concat(MEDIA);
  for (const name of names) {
    const bucket = await caches.open(name);
    for (const key of await bucket.keys()) {
      const response = await bucket.match(key);
      const size = Number(response.headers.get('content-length')) || (await response.blob()).size;
      mediaIndex.set(name + key.url, { bucket, key, size });
    }
  }
  return mediaIndex;
}
const isLocal = url => url.origin === self.location.origin;
const isMedia = request => request.destination === 'image' || /\.(webp|png|jpe?g|gif)$/i.test(new URL(request.url).pathname);
async function cachedResponse(request) {
  try {
    const bucket = await caches.open(SHELL);
    return (await bucket.match(request)) || (await caches.match(request));
  } catch { return undefined; } // Storage restrictions must not block a working network.
}
async function store(request, response) {
  if (!response || !response.ok || response.type === 'opaque') return response;
  const media = isMedia(request);
  const copy = response.clone();
  if (media) {
    // Stream each body into storage independently; one slow image must not queue all others.
    const cache = await caches.open(MEDIA);
    const size = Number(copy.headers.get('content-length')) || (await copy.clone().blob()).size;
    if (size > MAX_MEDIA_BYTES) return response;
    await cache.put(request, copy);
    // Serialize only index updates and eviction, after the body is complete.
    mediaQueue = mediaQueue.catch(() => {}).then(async () => {
      const index = await getMediaIndex();
      const id = MEDIA + request.url;
      index.delete(id);
      index.set(id, { bucket: cache, key: request, size });
      let bytes = [...index.values()].reduce((sum, entry) => sum + entry.size, 0);
      for (const [entryId, entry] of index) {
        if (bytes <= MAX_MEDIA_BYTES && index.size <= 100) break;
        await entry.bucket.delete(entry.key);
        bytes -= entry.size;
        index.delete(entryId);
      }
    });
    await mediaQueue;
  } else {
    const cache = await caches.open(SHELL);
    await cache.put(request, copy);
    // Bound previously visited pages/resources as well.
    const keys = await cache.keys();
    const removable = keys.filter(key => !['/offline.html', '/release.json'].includes(new URL(key.url).pathname));
    for (const key of removable.slice(0, Math.max(0, keys.length - 120))) await cache.delete(key);
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
    // A slow connection is not an offline signal. Do not abort viable navigation.
    let deliveredFresh = false;
    const fresh = fetch(request);
    const currentCache = cachedResponse(request);
    const completed = fresh.then(async response => {
      const body = await response.clone().text();
      if (!response.ok) return;
      const cached = await currentCache;
      await store(request, response).catch(() => {});
      if (cached && request.cache !== 'reload' && body !== await cached.clone().text()) {
        const client = await self.clients.get?.(event.resultingClientId || event.clientId);
        client?.postMessage({ type: 'PAGE_UPDATED' });
      }
    });
    event.waitUntil(completed.catch(async () => {
      if (!deliveredFresh) return; // A failed background refresh must not interrupt cached reading.
      const client = await self.clients.get?.(event.resultingClientId || event.clientId);
      client?.postMessage({ type: 'NAVIGATION_INTERRUPTED' });
    }));
    event.respondWith((async () => {
      const cached = await currentCache;
      if (cached && request.cache !== 'reload') return cached;
      try { const response = await fresh; deliveredFresh = true; return response; }
      catch {
        if (cached) {
          const client = await self.clients.get?.(event.resultingClientId || event.clientId);
          client?.postMessage({ type: 'CACHED_FALLBACK' });
          return cached;
        }
        return (await cachedResponse('/offline.html')) || new Response('Connection failed. Please retry.', { status: 503 });
      }
    })());
    return;
  }
  const liveData = url.pathname.startsWith('/assets/data/forum-');
  const bounded = liveData;
  let finishCache;
  const cacheWork = new Promise(resolve => { finishCache = resolve; });
  event.waitUntil(cacheWork);
  event.respondWith((async () => {
    let timer;
    try {
      const cached = await cachedResponse(request);
      if (!liveData && cached) { finishCache(); return cached; }
      const controller = new AbortController();
      if (bounded) timer = setTimeout(() => controller.abort(), 8000);
      const response = await fetch(request, { ...(liveData ? { cache: 'no-cache' } : {}), signal: controller.signal });
      // Headers have arrived. Slow bodies must remain readable, not be aborted.
      clearTimeout(timer);
      finishCache(response.ok ? store(request, response).catch(() => {}) : undefined);
      return response;
    } catch {
      finishCache();
      return (await cachedResponse(request)) || new Response('', { status: 503, statusText: 'Not available offline' });
    } finally {
      clearTimeout(timer);
    }
  })());
});
