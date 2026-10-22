/* Build static reading pages from curated data and bot-managed snapshots. No API calls. */
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';
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
}).sort((a,b) => new Date(b.date) - new Date(a.date));
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
  html = html.replace(/<title>[^<]*<\/title>/, `<title>${escape(pick(topic.title))} | BEhooop</title>`);
  html = html.replace(/<link[^>]*rel="canonical"[^>]*>/g,'');
  fs.writeFileSync(path.join(dir,'index.html'),html);
}
// A static directory is also usable when JavaScript is unavailable.
function cards(items) {
  return items.map(topic => `<article class="forum-static-card"><a href="${topicUrl(topic.slug)}"><h2>${escape(pick(topic.title))}</h2></a><p>${escape(pick(topic.excerpt))}</p><small>${escape(topic.date?.slice(0,10))}</small></article>`).join('');
}
let index = fs.readFileSync(entry,'utf8');
index = index.replace(/<script\b[^>]*src="[^"]*\/js\/forum-data\.js[^\"]*"[^>]*><\/script>/, '<script src="/js/forum-summaries.js"></script>');
index = index.replace(/(<div[^>]*data-forum-list[^>]*>)<\/div>/, `$1${cards(topics.slice(0,6))}</div>`);
if(topics.length>6)index=index.replace('</main>', '<noscript><a href="/forum/page/2/">More topics / 更多主题 →</a></noscript></main>');
fs.writeFileSync(entry,index);
for(let page=2;page<=Math.ceil(topics.length/6);page++) {
  const dir=path.join(site,'forum/page',String(page));fs.mkdirSync(dir,{recursive:true});
  let html=index.replace(/<noscript>[\s\S]*?<\/noscript>/g,'').replace(/(<div[^>]*data-forum-list[^>]*>)[\s\S]*?(?=<\/div>)/, `$1${cards(topics.slice((page-1)*6,page*6))}`);
  html=html.replace('</main>', `<nav aria-label="Topic pages"><a href="${page===2?'/forum/':`/forum/page/${page-1}/`}">← Previous</a>${page*6<topics.length?` <a href="/forum/page/${page+1}/">Next →</a>`:''}</nav></main>`);
  fs.writeFileSync(path.join(dir,'index.html'),html);
}
// Legacy query links still work via the existing client. With JS off show the directory.
let legacy=template.replace(/<script\b[^>]*src="[^"]*\/js\/forum-data\.js[^\"]*"[^>]*><\/script>/, '<script src="/js/forum-summaries.js"></script>');
legacy=legacy.replace(/(<script\b[^>]*src="[^\"]*\/js\/forum-topic\.js)/, '<script src="/js/forum-renderer.js"></script>$1');
legacy=legacy.replace('data-topic-content></div>',`data-topic-content>${cards(topics.slice(0,6))}</div>`);
fs.writeFileSync(path.join(site,'forum/topic/index.html'),legacy);
console.log(`Prepared ${topics.length} static forum topics; list payload contains summaries only.`);
