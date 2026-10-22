import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import fs from 'node:fs';
const code = fs.readFileSync(new URL('../sw.js', import.meta.url), 'utf8');
function runtime() {
  const stores = new Map();const handlers = {};const messages=[];let offline = false;let networkBody = 'fresh';let skip = 0;let stalled = false;let bodyStalled = false;let slowBody = false;let headerDelay = 0;
  const key = request => typeof request === 'string' ? new URL(request, 'https://example.test').href : request.url;
  const caches = {
    async keys() { return [...stores.keys()]; },
    async delete(name) { return stores.delete(name); },
    async open(name) {
      if (!stores.has(name)) stores.set(name, new Map());const values = stores.get(name);
      return { async match(r) { return values.get(key(r))?.clone(); }, async put(r,v) { await v.clone().arrayBuffer(); values.set(key(r),v.clone()); }, async delete(r) { return values.delete(key(r)); }, async keys() { return [...values.keys()].map(u=>new Request(u)); }, async addAll(urls) { for(const u of urls) values.set(key(u),new Response('shell')); } };
    },
    async match(r) { for(const values of stores.values()) if(values.has(key(r))) return values.get(key(r)).clone(); }
  };
  const self = { location: { origin:'https://example.test' }, clients:{async claim(){},async get(){return {postMessage(message){messages.push(message);}}}}, async skipWaiting(){skip++;}, addEventListener(type,fn){handlers[type]=fn;} };
  vm.runInNewContext(code,{self,caches,Request,Response,URL,Promise,AbortController,setTimeout:(fn,ms)=>setTimeout(fn,ms/100),clearTimeout,fetch:async(_request,options={})=>{if(offline)throw new Error('offline');if(headerDelay)await new Promise((resolve,reject)=>{setTimeout(resolve,headerDelay);options.signal?.addEventListener('abort',()=>reject(Error('timeout')));});if(stalled)return new Promise((_,reject)=>options.signal.addEventListener('abort',()=>reject(Error('timeout'))));if(bodyStalled)return new Response(new ReadableStream({start(c){setTimeout(()=>c.error(Error('body interrupted')),120);}}));if(slowBody)return new Response(new ReadableStream({start(c){options.signal?.addEventListener('abort',()=>c.error(Error('body aborted')));setTimeout(()=>{c.enqueue(new TextEncoder().encode('slow complete'));c.close();},120);}}));return new Response(networkBody);}});
  async function dispatch(request, settle = true) {const pending=[];let response;handlers.fetch({request,waitUntil(p){pending.push(p);},respondWith(p){response=p;}});const result=await response;if (settle) await Promise.all(pending);return result;}
  return {messages,caches,handlers,dispatch,setHeaderDelay:v=>headerDelay=v,setOffline:v=>offline=v,setBody:v=>networkBody=v,setStalled:v=>stalled=v,setBodyStalled:v=>bodyStalled=v,setSlowBody:v=>slowBody=v,get skip(){return skip;}};
}
test('cached navigation opens immediately, refreshes in background, and stays readable offline',async()=>{
 const r=runtime();const request=new Request('https://example.test/works/');Object.defineProperty(request,'mode',{value:'navigate'});
 const cache=await r.caches.open('behop-shell-__BUILD_VERSION__');await cache.put(request,new Response('old'));
 assert.equal(await (await r.dispatch(request)).text(),'old');r.setOffline(true);assert.equal(await (await r.dispatch(request)).text(),'fresh');
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

test('stalled online headers fall back to visited HTML within the grace period',async()=>{
 const r=runtime();const req=new Request('https://example.test/works/');Object.defineProperty(req,'mode',{value:'navigate'});
 const cache=await r.caches.open('behop-shell-__BUILD_VERSION__');await cache.put(req,new Response('usable cached page'));r.setStalled(true);
 assert.equal(await (await r.dispatch(req,false)).text(),'usable cached page');
});
test('streamed HTML is returned before its body completes; failed bodies never enter cache',async()=>{
 const r=runtime();const req=new Request('https://example.test/forum/');Object.defineProperty(req,'mode',{value:'navigate'});
 const cache=await r.caches.open('behop-shell-__BUILD_VERSION__');r.setBodyStalled(true);
 const response=await r.dispatch(req,false);
 assert.equal(response.status,200);
 await assert.rejects(response.text(),/body interrupted/);
 assert.equal(await cache.match(req),undefined);
});
test('slow CSS headers continue; interrupted JS bodies are streamed but never cached',async()=>{
 const r=runtime();r.setHeaderDelay(120);
 assert.equal((await r.dispatch(new Request('https://example.test/css/site.css'))).status,200);
 const broken=runtime();broken.setBodyStalled(true);
 const req=new Request('https://example.test/js/app.js?v=broken');
 const response=await broken.dispatch(req,false);
 assert.equal(response.status,200);
 await assert.rejects(response.text(),/body interrupted/);
 await new Promise(resolve=>setTimeout(resolve,20));
 assert.equal(await broken.caches.match(req),undefined);
});
test('HTML and JS bodies taking longer than the header deadline finish successfully',async()=>{
 for (const navigate of [false,true]) {
  const r=runtime();r.setSlowBody(true);
  const req=new Request('https://example.test/'+(navigate?'works/':'js/slow.js'));
  if(navigate)Object.defineProperty(req,'mode',{value:'navigate'});
  const response=await r.dispatch(req);
  assert.equal(await response.text(),'slow complete');
  assert.equal(await (await r.caches.match(req)).text(),'slow complete');
 }
});

test('one-time navigation recovery never reloads readable pages or forms', async () => {
 const bootstrap=fs.readFileSync(new URL('../js/navigation-repair.js',import.meta.url),'utf8');
 for(const [readyState,form,expected] of [['loading',false,1],['complete',false,0],['loading',true,0]]) {
  const values=new Map();const listeners={};let reloads=0;let registrations=0;
  const registration={waiting:{postMessage(){}},addEventListener(){},async update(){}};
  const context={navigator:{serviceWorker:{controller:{},async register(){registrations++;return registration;},addEventListener(type,fn){listeners[type]=fn;}}},location:{hostname:'example.test',reload(){reloads++;}},document:{readyState,querySelector(){return form?{}:null;}},localStorage:{getItem:k=>values.get(k),setItem:(k,v)=>values.set(k,v)}};
  vm.runInNewContext(bootstrap,context);await new Promise(resolve=>setImmediate(resolve));listeners.controllerchange();assert.equal(reloads,expected);
  vm.runInNewContext(bootstrap,context);assert.equal(registrations,1);
 }
});

test('slow navigation prefers the current cache over an older release',async()=>{
 const r=runtime();const req=new Request('https://example.test/works/');Object.defineProperty(req,'mode',{value:'navigate'});
 await (await r.caches.open('behop-shell-old')).put(req,new Response('obsolete'));
 await (await r.caches.open('behop-shell-__BUILD_VERSION__')).put(req,new Response('current'));
 r.setStalled(true);assert.equal(await (await r.dispatch(req,false)).text(),'current');
});
test('explicit reload retrieves fresh HTML instead of winning the old-cache race',async()=>{
 const r=runtime();const req=new Request('https://example.test/works/',{cache:'reload'});Object.defineProperty(req,'mode',{value:'navigate'});
 await (await r.caches.open('behop-shell-__BUILD_VERSION__')).put(req,new Response('cached'));
 assert.equal(await (await r.dispatch(req)).text(),'fresh');
});

test('head runtime registers independently before the body or application is ready',async()=>{
 const source=fs.readFileSync(new URL('../js/sw-registration.js',import.meta.url),'utf8');
 const listeners={};let registrations=0;
 vm.runInNewContext(source,{
  navigator:{serviceWorker:{register(){registrations++;return Promise.resolve(null);},addEventListener(){}}},
  location:{hostname:'example.test',search:''},URLSearchParams,Promise,
  document:{readyState:'loading',body:null,addEventListener(type,fn){listeners[type]=fn;}},
  setTimeout(){return 1;},clearTimeout(){}
 });
 assert.equal(registrations,1);
 assert.equal(typeof listeners.DOMContentLoaded,'function');
});

test('media cache remains bounded while preserving unrelated caches',async()=>{
 const r=runtime();const other=await r.caches.open('another-app');await other.put('/keep',new Response('private'));
 for(let i=0;i<102;i++)await r.dispatch(new Request(`https://example.test/media/${i}.webp`));
 const media=await r.caches.open('behop-media-__BUILD_VERSION__');assert.equal((await media.keys()).length,100);
 assert.equal(await media.match('/media/0.webp'),undefined);
 assert.equal(await (await other.match('/keep')).text(),'private');
});

test('uncached 10/15/30-second-equivalent header delays do not become offline pages',async()=>{
 // The runtime scales the old 8000ms deadline to 80ms; these delays model 10/15/30s.
 for (const delay of [100,150,300]) {
  const r=runtime();r.setHeaderDelay(delay);
  const req=new Request('https://example.test/slow-new-page/');Object.defineProperty(req,'mode',{value:'navigate'});
  assert.equal(await (await r.dispatch(req)).text(),'fresh');
 }
});

test('cache storage failure does not prevent healthy HTML or CSS network delivery',async()=>{
 for (const navigate of [false,true]) {
  const r=runtime();r.caches.open=async()=>{throw Error('storage disabled');};r.caches.match=async()=>{throw Error('storage disabled');};
  const req=new Request('https://example.test/'+(navigate?'works/':'css/site.css'));
  if(navigate)Object.defineProperty(req,'mode',{value:'navigate'});
  assert.equal(await (await r.dispatch(req)).text(),'fresh');
 }
});
test('shell eviction retains the offline entry while bounding ordinary resources',async()=>{
 const r=runtime();const cache=await r.caches.open('behop-shell-__BUILD_VERSION__');
 await cache.put('/offline.html',new Response('offline fallback'));
 for(let i=0;i<122;i++)await r.dispatch(new Request(`https://example.test/js/${i}.js`));
 assert.equal((await cache.keys()).length,120);
 assert.equal(await (await cache.match('/offline.html')).text(),'offline fallback');
});

test('a slow image body does not block caching another completed image',async()=>{
 const r=runtime();r.setSlowBody(true);
 const first=await r.dispatch(new Request('https://example.test/media/slow.webp'),false);
 r.setSlowBody(false);
 const winner=await Promise.race([
  r.dispatch(new Request('https://example.test/media/fast.webp')).then(()=> 'fast'),
  first.text().then(()=> 'slow'),
 ]);
 assert.equal(winner,'fast');
});

test('only an interrupted delivered stream triggers recovery, not a failed cached-page refresh',async()=>{
 const req=new Request('https://example.test/works/');Object.defineProperty(req,'mode',{value:'navigate'});
 const cached=runtime();await (await cached.caches.open('behop-shell-__BUILD_VERSION__')).put(req,new Response('readable'));
 cached.setBodyStalled(true);assert.equal(await (await cached.dispatch(req)).text(),'readable');
 assert.ok(!cached.messages.some(message=>message.type==='NAVIGATION_INTERRUPTED'));
 const fresh=runtime();fresh.setBodyStalled(true);const response=await fresh.dispatch(req,false);
 await assert.rejects(response.text(),/body interrupted/);
 await new Promise(resolve=>setImmediate(resolve));
 assert.ok(fresh.messages.some(message=>message.type==='NAVIGATION_INTERRUPTED'));
});

test('auxiliary forum JSON has a finite body wait without blocking static reading',async()=>{
 const source=fs.readFileSync(new URL('../js/forum-client.js',import.meta.url),'utf8');
 const window={BEHOP_FORUM_CONFIG:{requestTimeoutMs:8000}};
 vm.runInNewContext(source,{window,document:{body:{dataset:{}}},AbortController,URL,
  setTimeout:(fn,ms)=>setTimeout(fn,ms/1000),clearTimeout,
  fetch:async(_url,{signal})=>({ok:true,json:()=>new Promise((_,reject)=>signal.addEventListener('abort',()=>reject(Error('stalled body'))))})});
 const client=window.FORUM_CLIENT;
 const comments=await client.fetchApprovedComments('synthetic');
 assert.equal(comments.length,0);
 const metrics=await client.fetchApprovedMetrics();
 assert.equal(metrics.site.pageViews,0);
});
