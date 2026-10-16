import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import fs from 'node:fs';
const code = fs.readFileSync(new URL('../sw.js', import.meta.url), 'utf8');
function runtime() {
  const stores = new Map();const handlers = {};let offline = false;let networkBody = 'fresh';let skip = 0;
  const key = request => typeof request === 'string' ? new URL(request, 'https://example.test').href : request.url;
  const caches = {
    async keys() { return [...stores.keys()]; },
    async delete(name) { return stores.delete(name); },
    async open(name) {
      if (!stores.has(name)) stores.set(name, new Map());const values = stores.get(name);
      return { async match(r) { return values.get(key(r))?.clone(); }, async put(r,v) { values.set(key(r),v.clone()); }, async delete(r) { return values.delete(key(r)); }, async keys() { return [...values.keys()].map(u=>new Request(u)); }, async addAll(urls) { for(const u of urls) values.set(key(u),new Response('shell')); } };
    },
    async match(r) { for(const values of stores.values()) if(values.has(key(r))) return values.get(key(r)).clone(); }
  };
  const self = { location: { origin:'https://example.test' }, clients:{async claim(){}}, async skipWaiting(){skip++;}, addEventListener(type,fn){handlers[type]=fn;} };
  vm.runInNewContext(code,{self,caches,Request,Response,URL,Promise,fetch:async()=>{if(offline)throw new Error('offline');return new Response(networkBody);}});
  async function dispatch(request) {const pending=[];let response;handlers.fetch({request,waitUntil(p){pending.push(p);},respondWith(p){response=p;}});const result=await response;await Promise.all(pending);return result;}
  return {caches,handlers,dispatch,setOffline:v=>offline=v,setBody:v=>networkBody=v,get skip(){return skip;}};
}
test('online navigation replaces old HTML and offline navigation returns visited content',async()=>{
 const r=runtime();const request=new Request('https://example.test/works/');Object.defineProperty(request,'mode',{value:'navigate'});
 const cache=await r.caches.open('behop-shell-__BUILD_VERSION__');await cache.put(request,new Response('old'));
 assert.equal(await (await r.dispatch(request)).text(),'fresh');r.setOffline(true);assert.equal(await (await r.dispatch(request)).text(),'fresh');
 const missing=new Request('https://example.test/unvisited/');Object.defineProperty(missing,'mode',{value:'navigate'});await cache.put('/offline.html',new Response('offline fallback'));assert.equal(await (await r.dispatch(missing)).text(),'offline fallback');
});
test('static resources reuse version-specific cache',async()=>{
 const r=runtime();const request=new Request('https://example.test/css/site.css?v=one');await r.dispatch(request);r.setBody('changed');assert.equal(await (await r.dispatch(request)).text(),'fresh');assert.equal(await (await r.dispatch(new Request('https://example.test/css/site.css?v=two'))).text(),'changed');
});
test('legacy activation removes only owned caches and waits for successful install',async()=>{
 const r=runtime();await r.caches.open('main-precache-then-runtime');await r.caches.open('another-app');let pending;r.handlers.install({waitUntil(p){pending=p;}});await pending;assert.equal(r.skip,0);r.handlers.message({data:{type:'ACTIVATE_RELEASE'},waitUntil(p){pending=p;}});await pending;assert.equal(r.skip,1);r.handlers.activate({waitUntil(p){pending=p;}});await pending;assert.deepEqual((await r.caches.keys()).sort(),['another-app','behop-shell-__BUILD_VERSION__']);
});
test('missing offline image gets explicit failure rather than an HTML page',async()=>{
 const r=runtime();r.setOffline(true);const res=await r.dispatch(new Request('https://example.test/img/missing.webp'));assert.equal(res.status,503);assert.equal(await res.text(),'');
});
test('failed release install does not activate or delete existing offline content',async()=>{
 const r=runtime();await r.caches.open('main-precache-then-runtime');const open=r.caches.open.bind(r.caches);r.caches.open=async name=>{const cache=await open(name);if(name.startsWith('behop-shell-'))cache.addAll=async()=>{throw Error('network failed');};return cache;};let pending;r.handlers.install({waitUntil(p){pending=p;}});await assert.rejects(pending,/network failed/);assert.equal(r.skip,0);assert.ok((await r.caches.keys()).includes('main-precache-then-runtime'));
});
