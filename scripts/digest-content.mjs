/* Shared build-time taxonomy; legacy records never become fabricated news. */
export const digestTypes = {
  all:{en:'All observations',zh:'全部观察'},
  research:{en:'Theory & research',zh:'理论研究'},
  practice:{en:'Practice',zh:'实践进展'},
  industry:{en:'Industry',zh:'产业动态'},
  observation:{en:'Historical observations',zh:'历史观察'},
  message:{en:'Legacy messages',zh:'历史留言'},
};
export function normalizeDigest(topic) {
  const contentType = topic.category === 'message' || topic.tags?.includes('message') ? 'message' : (Object.hasOwn(digestTypes,topic.contentType) && topic.contentType !== 'all' ? topic.contentType : 'observation');
  const sources = (Array.isArray(topic.sources) ? topic.sources : []).filter(source => source && /^https?:\/\//i.test(source.url) && !/[<>"\s]/.test(source.url)).map(source=>({name:source.name || source.url,url:source.url}));
  return {...topic,contentType,sources};
}
export function digestMatches(topic,{type='all',theme='all',year='all'}={}) {
  return (type==='all' ? topic.contentType!=='message' : topic.contentType===type)
    && (theme==='all' || topic.category===theme || topic.tags?.includes(theme))
    && (year==='all' || String(topic.date || '').slice(0,4)===year);
}
export function digestRoute({type='all',theme='all',year='all'}={},page=1) {
  return '/forum/' + (type!=='all'?`type/${type}/`:'') + (theme!=='all'?`theme/${theme}/`:'') + (year!=='all'?`year/${year}/`:'') + (page>1?`page/${page}/`:'');
}
