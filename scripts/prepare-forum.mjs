/* Build static reading pages from curated data and bot-managed snapshots. No API calls. */
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';
import {digestTypes,normalizeDigest,digestMatches,digestRoute} from './digest-content.mjs';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const site = path.resolve(process.argv[2] || '_site');
const entry = path.join(site, 'forum/index.html');
if (!fs.existsSync(entry)) process.exit(0);
const escape = text => String(text ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
// The renderer only needs these DOM operations. Rich HTML comes from curated source;
// approved messages are converted to text blocks by the existing sync normalizer.
class Element {
  constructor(tag) { this.tag = tag; this.children = []; this.className = ''; this.raw = ''; }
  append(...nodes) { this.children.push(...nodes); }
  appendChild(node) { this.append(node); return node; }
  set textContent(text) { this.children = []; this.raw = escape(text); }
  set innerHTML(html) { this.children = []; this.raw = html; }
  get innerHTML() { return this.raw + this.children.map(node => node.outerHTML).join(''); }
  get outerHTML() { return `<${this.tag}${this.className ? ` class="${escape(this.className)}"` : ''}>${this.innerHTML}${this.tag === 'hr' ? '' : `</${this.tag}>`}`; }
  get lastElementChild() { return this.children.at(-1); }
  get childElementCount() { return this.children.length; }
  get classList() { return { contains: name => this.className.split(/\s+/).includes(name) }; }
}
const context = { window: {}, document: { createElement: tag => new Element(tag) } };
vm.createContext(context);
vm.runInContext(fs.readFileSync(path.join(root, 'js/forum-data.js'), 'utf8'), context);
vm.runInContext(fs.readFileSync(path.join(root, 'js/forum-renderer.js'), 'utf8'), context);
const globals = context.window;
const approved = JSON.parse(fs.readFileSync(path.join(site, 'assets/data/forum-topics-approved.json'), 'utf8')).topics || [];
const comments = JSON.parse(fs.readFileSync(path.join(site, 'assets/data/forum-comments-approved.json'), 'utf8')).comments || [];
const commentsDir = path.join(site,'assets/data/forum-comments');fs.mkdirSync(commentsDir,{recursive:true});
const seen = new Set();
const topics = [...approved, ...globals.FORUM_TOPICS].filter(topic => {
  if (!/^[a-z0-9][a-z0-9-]*$/.test(topic.slug) || seen.has(topic.slug)) return false;
  seen.add(topic.slug); return true;
}).map(normalizeDigest).sort((a,b) => new Date(b.date) - new Date(a.date));
const pick = (value, lang = 'en') => typeof value === 'object' ? value?.[lang] || value?.en || value?.zh || '' : value || '';
const summary = ({content, ...topic}) => ({...topic, url: `/forum/topic/${topic.slug}/`});
const summaries = topics.map(summary);
const globalsCode = Object.entries(globals).filter(([name]) => name !== 'FORUM_TOPICS' && name !== 'FORUM_RENDER_TOPIC').map(([name,value]) => `window.${name}=${JSON.stringify(value)};`).join('\n');
const script = () => `<script src="/js/forum-summaries.js"></script><script src="/js/forum-current.js"></script>`;
fs.writeFileSync(path.join(site, 'js/forum-summaries.js'), `window.FORUM_TOPICS=${JSON.stringify(summaries)};\n${globalsCode}`);
// Current topic is a separate static resource; list pages do not request any full body.
const template = fs.readFileSync(path.join(site,'forum/topic/index.html'), 'utf8');
function body(topic, lang) {
  const container = new Element('div');
  const layout = topic.detailLayout || (topic.tags || []).map(tag => globals.FORUM_DETAIL_LAYOUT_BY_TAG[tag]).find(Boolean) || 'article';
  globals.FORUM_RENDER_TOPIC(container, topic, lang, layout);
  return container;
}
function replaceData(html, attr, value) {
  return html.replace(new RegExp(`(<[\\w-]+\\b[^>]*\\b${attr}(?![\\w-])(?:="[^"]*")?[^>]*>)[\\s\\S]*?(</[\\w-]+>)`), (_,open,close) => open + escape(value) + close);
}
const topicUrl = slug => `/forum/topic/${slug}/`;
for (const topic of topics) {
  fs.writeFileSync(path.join(commentsDir,topic.slug+'.json'),JSON.stringify({comments:comments.filter(comment=>comment.topicSlug===topic.slug)}));
  const dir = path.join(site, 'forum/topic', topic.slug); fs.mkdirSync(dir, {recursive:true});
  const code = `window.FORUM_TOPICS=window.FORUM_TOPICS.map(t=>t.slug===${JSON.stringify(topic.slug)}?${JSON.stringify(topic)}:t);`;
  fs.writeFileSync(path.join(dir,'topic.js'),code);
  let html = template.replace(/<body\b/, `<body data-topic-slug="${topic.slug}"`);
  html = html.replace(/<script\b[^>]*src="[^"]*\/js\/forum-data\.js[^\"]*"[^>]*><\/script>/, script().replace('/js/forum-current.js', `${topicUrl(topic.slug)}topic.js`));
  html = html.replace(/(<script\b[^>]*src="[^\"]*\/js\/forum-topic\.js)/, '<script src="/js/forum-renderer.js"></script>$1');
  html = html.replace(/<div class="forum-article space-y-6" data-topic-content><\/div>/, `<div class="${body(topic,'en').className}" data-topic-content data-rendered-topic="${topic.slug}:en">${body(topic,'en').innerHTML}</div><noscript><details><summary>中文全文</summary>${body(topic,'zh').outerHTML}</details></noscript>`);
  for (const [attr,value] of [['data-topic-title',pick(topic.title)],['data-topic-excerpt',pick(topic.excerpt)],['data-topic-author',topic.author?.name],['data-topic-date',topic.date?.slice(0,10)]]) html = replaceData(html,attr,value);
  const label = digestTypes[topic.contentType];
  const bilingual = (tag,value) => `<${tag} data-zh="${escape(pick(value,'zh'))}" data-en="${escape(pick(value,'en'))}">${escape(pick(value))}</${tag}>`;
  const externalDate = /^\d{4}-\d{2}-\d{2}$/.test(topic.eventDate || '') ? `<p>${bilingual('span',{zh:'事件／发表日期',en:'Event / publication date'})}: ${escape(topic.eventDate)}</p>` : '';
  const relevance = topic.designRelevance ? bilingual('p',topic.designRelevance) : '';
  const sourceLinks = topic.sources.map(source=>`<a href="${escape(source.url)}" rel="noopener noreferrer">${bilingual('span',source.name)}</a>`).join(' · ');
  html = html.replace('<div class="digest-detail-metadata" data-digest-metadata></div>', `<div class="digest-detail-metadata" data-digest-metadata>${bilingual('strong',label)}<p>${bilingual('span',{zh:'站内发布',en:'Published on this site'})}: ${escape(topic.date?.slice(0,10))}</p>${externalDate}${relevance}${sourceLinks?`<p>${bilingual('span',{zh:'来源',en:'Sources'})}: ${sourceLinks}</p>`:''}</div>`);
  html = html.replace(/<title>[^<]*<\/title>/, `<title>${escape(pick(topic.title))} | BEhooop</title>`);
  html = html.replace(/<link[^>]*rel="canonical"[^>]*>/g,'');
  fs.writeFileSync(path.join(dir,'index.html'),html);
}
// A bounded, bilingual static directory. Filters work without client rendering.
const bilingual = (tag,value) => `<${tag} data-zh="${escape(pick(value,'zh'))}" data-en="${escape(pick(value,'en'))}">${escape(pick(value))}</${tag}>`;
function cards(items) {
  return items.map(topic => `<article class="forum-static-card"><div class="digest-row-meta"><time>${escape(topic.date?.slice(0,10))}</time>${bilingual('strong',digestTypes[topic.contentType])}</div><div><a href="${topicUrl(topic.slug)}">${bilingual('h2',topic.title)}</a>${bilingual('p',topic.excerpt)}</div></article>`).join('');
}
let index = fs.readFileSync(entry,'utf8');
index = index.replace(/<script\b[^>]*src="[^"]*\/js\/forum-data\.js[^\"]*"[^>]*><\/script>/, '<script src="/js/forum-summaries.js"></script>');
const allThemes = ['ai','landscape','news','design-cognition','design-rules','aitalk'];
const years = [...new Set(topics.map(topic=>topic.date?.slice(0,4)).filter(year=>/^\d{4}$/.test(year)))].sort().reverse();
const themeLabels = {...globals.FORUM_CATEGORY_LABELS,...globals.FORUM_TAG_LABELS,all:{en:'All topics',zh:'全部主题'}};
const stateLink = (state,group,value,label) => `<a${group==='type'?' class="filter-button"':''} href="${digestRoute({...state,[group]:value})}"${state[group]===value?' aria-current="page"':''}>${bilingual('span',label)}</a>`;
for (const type of Object.keys(digestTypes)) for (const theme of ['all',...allThemes]) for (const year of ['all',...years]) {
  const state={type,theme,year};
  const matching=topics.filter(topic=>digestMatches(topic,state));
  const pageCount=Math.max(1,Math.ceil(matching.length/6));
  for(let page=1;page<=pageCount;page++) {
    const route=digestRoute(state,page);
    let html=index.replace('<body ',`<body data-digest-type="${type}" data-digest-theme="${theme}" data-digest-year="${year}" `);
    html=html.replace(/(<div[^>]*data-forum-list[^>]*>)<\/div>/,`$1${matching.length?cards(matching.slice((page-1)*6,page*6)):'<p data-zh="此筛选下暂无条目。可切换类型、主题或年份，浏览已有记录。" data-en="No entries for these filters yet. Try another type, topic, or year.">No entries for these filters yet. Try another type, topic, or year.</p>'}</div>`);
    html=html.replace(/(<nav[^>]*data-digest-types[^>]*>)<\/nav>/,`$1${Object.entries(digestTypes).map(([value,label])=>stateLink(state,'type',value,label)).join('')}</nav>`);
    html=html.replace(/(<nav[^>]*data-digest-themes[^>]*>)<\/nav>/,`$1${['all',...allThemes].map(value=>stateLink(state,'theme',value,themeLabels[value]||{en:value,zh:value})).join('')}</nav>`);
    html=html.replace(/(<nav[^>]*data-digest-years[^>]*>)<\/nav>/,`$1${['all',...years].map(value=>stateLink(state,'year',value,value==='all'?{en:'All years',zh:'全部年份'}:{en:value,zh:value})).join('')}</nav>`);
    html=html.replace(/(<p[^>]*data-digest-status[^>]*>)<\/p>/,`$1${bilingual('span',{en:`${matching.length} entries · Page ${page} of ${pageCount}`,zh:`${matching.length} 条记录 · 第 ${page} / ${pageCount} 页`})}</p>`);
    html=html.replace(/(<nav[^>]*data-digest-pagination[^>]*>)<\/nav>/,`$1${page>1?`<a href="${digestRoute(state,page-1)}">← Previous / 上一页</a>`:''}${page<pageCount?`<a href="${digestRoute(state,page+1)}">Next / 下一页 →</a>`:''}</nav>`);
    // Each generated filter page owns its canonical URL.
    html=html.replace(/<link[^>]*rel="canonical"[^>]*>/g,'');
    const dir=path.join(site,route);fs.mkdirSync(dir,{recursive:true});fs.writeFileSync(path.join(dir,'index.html'),html);
  }
}
// Homepage uses the same records, rendered at build time, without a full-body request.
const homeFile=path.join(site,'index.html');
if(fs.existsSync(homeFile)) {
 const rows=topics.filter(topic=>digestMatches(topic)).slice(0,3).map(topic=>`<a class="reading-row" href="${topicUrl(topic.slug)}"><time>${escape(topic.date?.slice(0,10))}</time>${bilingual('h3',topic.title)}${bilingual('p',topic.excerpt)}<span aria-hidden="true">↗</span></a>`).join('');
 fs.writeFileSync(homeFile,fs.readFileSync(homeFile,'utf8').replace(/(<div[^>]*data-home-digest[^>]*>)\s*<\/div>/,`$1${rows}</div>`));
}
// Legacy query links still work via the existing client. With JS off show the directory.
let legacy=template.replace(/<script\b[^>]*src="[^"]*\/js\/forum-data\.js[^\"]*"[^>]*><\/script>/, '<script src="/js/forum-summaries.js"></script>');
legacy=legacy.replace(/(<script\b[^>]*src="[^\"]*\/js\/forum-topic\.js)/, '<script src="/js/forum-renderer.js"></script>$1');
legacy=legacy.replace('data-topic-content></div>',`data-topic-content>${cards(topics.slice(0,6))}</div>`);
fs.writeFileSync(path.join(site,'forum/topic/index.html'),legacy);
console.log(`Prepared ${topics.length} static forum topics; list payload contains summaries only.`);
