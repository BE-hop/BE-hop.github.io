import { readFileSync, existsSync, readdirSync } from 'node:fs';
import path from 'node:path';
const site = process.env.SITE_ROOT || '_site';
const release = JSON.parse(readFileSync(path.join(site,'release.json')));
if (!/^[a-f0-9]{16}$/.test(release.version)) throw Error('Missing release version');
const walk = dir => readdirSync(dir,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(path.join(dir,e.name)):[path.join(dir,e.name)]);
for (const file of walk(site).filter(f=>f.endsWith('.html'))) {
 const text=readFileSync(file,'utf8');
 if (!text.includes(`name="behop-release" content="${release.version}"`)) throw Error(`Missing version: ${file}`);
 if (!/src="\/js\/sw-registration\.js\?v=[a-f0-9]{16}"/.test(text)) throw Error(`Missing upgrade control: ${file}`);
 if (/href="https:\/\/fonts.googleapis.com/.test(text)) throw Error(`External fonts: ${file}`);
}
for(const suffix of ['', '-en']) for(const day of ['15','16']) if(!existsSync(path.join(site,`2026/10/${day}/when-ai-gains-a-body${suffix}/index.html`))) throw Error('Missing article or redirect');
// This migrated essay has one record per language; aliases must never become posts again.
const search = JSON.parse(readFileSync(path.join(site, 'search.json'), 'utf8'));
const countLink = (text, url) => [...text.matchAll(/href=["']([^"']+)["']/g)].filter(match => match[1] === url).length;
for (const suffix of ['', '-en']) {
 const current = `/2026/10/16/when-ai-gains-a-body${suffix}/`;
 const old = `/2026/09/03/when-ai-gets-a-body-maslow${suffix}/`;
 const titles = suffix ? ['When AI Gets a Body', 'When AI Gains a Body'] : ['当 AI 获得身体'];
 if (search.filter(post => titles.includes(post.title)).length !== 1) throw Error('Duplicate AI body essay title');
 if (search.filter(post => post.url === current).length !== 1 || search.some(post => post.url === old)) throw Error('Duplicate AI body essay in search');
 for (const alias of [old, `/2026/10/15/when-ai-gains-a-body${suffix}/`]) {
  const html = readFileSync(path.join(site, alias, 'index.html'), 'utf8');
  if (!html.includes(`content="0;url=${current}"`) || !html.includes(`rel="canonical" href="https://www.behop.cn${current}"`) || countLink(html,current) !== 1) throw Error(`Invalid article redirect: ${alias}`);
 }
 const base = suffix ? 'blog/en' : 'blog';
 const lists = walk(path.join(site,base)).filter(file => file.endsWith('index.html') && /^(?:index\.html|page[/\\]\d+[/\\]index\.html)$/.test(path.relative(path.join(site,base),file)));
 const listCount = lists.reduce((total,file) => total + countLink(readFileSync(file,'utf8'),current),0);
 if (listCount !== 1) throw Error(`Expected one AI body essay in ${base}, found ${listCount}`);
 const archive = readFileSync(path.join(site,suffix ? 'archive/en/index.html' : 'archive/index.html'),'utf8');
 if (countLink(archive,current) !== 1 || archive.includes(old)) throw Error('Duplicate essay in archive/tag list');
 for (const file of [...lists,path.join(site,'index.html'),path.join(site,'feed.xml')]) if (readFileSync(file,'utf8').includes(old)) throw Error(`Retired essay remains in ${file}`);
}
console.log('Release versions, shared update controls, fonts, and article redirects verified.');
