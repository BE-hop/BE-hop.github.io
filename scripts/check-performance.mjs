/* Build budgets are deterministic; browser timings are a separate check. */
import {readFileSync,readdirSync,existsSync} from 'node:fs';
import {gzipSync} from 'node:zlib';
import path from 'node:path';
const root=process.env.SITE_ROOT || '_site';
const walk=dir=>readdirSync(dir,{withFileTypes:true}).flatMap(entry=>entry.isDirectory()?walk(path.join(dir,entry.name)):[path.join(dir,entry.name)]);
const failures=[];const rows=[];
for(const file of walk(root).filter(file=>file.endsWith('.html'))) {
 const html=readFileSync(file,'utf8');
 if(/http-equiv="refresh"/i.test(html))continue;
 const css=[...html.matchAll(/<link\b[^>]*rel="stylesheet"[^>]*href="(\/[^"?]+)(?:\?[^" ]*)?"/g)].map(match=>match[1]);
 const scripts=[...html.matchAll(/<script\b[^>]*src="(\/[^"?]+)(?:\?[^" ]*)?"[^>]*>/g)].map(match=>match[1]).filter(url=>!['/js/sw-registration.js','/js/language-init.js'].includes(url));
 const bytes=urls=>[...new Set(urls)].reduce((total,url)=>{const target=path.join(root,url);return total+(existsSync(target)?gzipSync(readFileSync(target)).length:0);},0);
 const row={page:path.relative(root,file),css:bytes(css),js:bytes(scripts),cssRequests:css.length,jsRequests:scripts.length};rows.push(row);
 if(row.css>30*1024 || row.js>40*1024 || css.length>2 || scripts.length>2)failures.push(row);
 for(const tag of html.matchAll(/<img\b[^>]*>/g)) {
  if(/data-media-role="(?:card|thumbnail)"/.test(tag[0]) && /-(?:768|1280|1920|2560)\.webp/.test(tag[0]))failures.push({page:row.page,error:'oversized card candidate'});
  if(/\ssrcset="[^"]*-(?:1920|2560)\.webp/.test(tag[0]))failures.push({page:row.page,error:'automatic detail image candidate'});
 }
 if(/<script[^>]*src="[^" ]*media-viewer/.test(html))failures.push({page:row.page,error:'viewer is not on-demand'});
}
if(failures.length){console.error(JSON.stringify(failures,null,2));process.exit(1);}
console.log(`Performance budgets passed for ${rows.length} pages; max gzip CSS ${Math.max(...rows.map(row=>row.css))} B, JS ${Math.max(...rows.map(row=>row.js))} B.`);
