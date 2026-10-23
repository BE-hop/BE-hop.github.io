/* Compatibility routing only. The current list, filters and pagination are static. */
(() => {
  const params = new URLSearchParams(location.search);
  const topic = params.get('topic');
  const topics = window.FORUM_TOPICS || [];
  if (topic && topics.some(item=>item.slug===topic)) { location.replace('/forum/topic/' + encodeURIComponent(topic) + '/'); return; }
  if (!params.has('category') && !params.has('filter')) return;
  const raw = params.get('filter') || params.get('category') || 'all';
  const validThemes = new Set(['ai','landscape','news','design-cognition','design-rules','aitalk']);
  const target = raw === 'message' ? '/forum/type/message/' : validThemes.has(raw) ? '/forum/theme/' + raw + '/' : '/forum/';
  location.replace(target);
})();
