/* Retirement worker: no page interception, precache, forced reload, or cache deletion.
 * Keep this URL available for dormant visitors running any previous worker.
 * Deployment is gated on ordinary HTTP caching being verified first.
 */
self.addEventListener('activate', event => {
  event.waitUntil(self.registration.unregister());
});
// Legacy pages already offer a manual update button. Only that action may activate now.
self.addEventListener('message', event => {
  if (event.data?.type === 'ACTIVATE_RELEASE') event.waitUntil(self.skipWaiting());
});
