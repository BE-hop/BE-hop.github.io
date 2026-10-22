/* Keep the detailed viewer off the initial request path. Links work without JS. */
(() => {
  let viewer;
  document.addEventListener('click', async event => {
    const link = event.target.closest?.('a[data-media-view]');
    if (!link || event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    if (document.querySelector('[contenteditable="true"]') || window.self !== window.top) return;
    event.preventDefault();
    try {
      viewer ||= import('/js/media-viewer.js');
      (await viewer).openMedia(link);
    } catch {
      viewer = null;
      window.location.assign(link.href);
    }
  });
})();
