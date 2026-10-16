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
console.log('Release versions, shared update controls, fonts, and article redirects verified.');
