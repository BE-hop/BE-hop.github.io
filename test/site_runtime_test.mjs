import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import fs from 'node:fs';

// A dormant N-3 visitor must discover this same worker URL without losing caches
// or being reloaded halfway through reading. Ordinary requests stay browser-owned.
test('retirement worker waits naturally and never intercepts or clears site data', async () => {
 const handlers = {};let unregistered = 0;let activated = 0;
 const self = {registration:{async unregister(){unregistered++;}},async skipWaiting(){activated++;},addEventListener(type,handler){handlers[type]=handler;}};
 vm.runInNewContext(fs.readFileSync(new URL('../sw.js',import.meta.url),'utf8'),{self});
 assert.equal(handlers.fetch,undefined);
 assert.equal(handlers.install,undefined);
 assert.equal(activated,0);
 let pending;
 handlers.activate({waitUntil(p){pending=p;}});await pending;
 assert.equal(unregistered,1);
 handlers.message({data:{type:'UNRELATED'},waitUntil(){throw Error('unexpected activation');}});
 assert.equal(activated,0);
 handlers.message({data:{type:'ACTIVATE_RELEASE'},waitUntil(p){pending=p;}});await pending;
 assert.equal(activated,1);
});

test('retirement script waits until load and only unregisters this site worker', async () => {
 const listeners={};let ours=0;let unrelated=0;let reads=0;
 const registration=(url,fn)=>({active:{scriptURL:url},unregister:fn});
 const navigator={serviceWorker:{async getRegistrations(){reads++;return [registration('https://example.test/sw.js',async()=>ours++),registration('https://example.test/other/sw.js',async()=>unrelated++),registration('https://other.test/sw.js',async()=>unrelated++)];}}};
 vm.runInNewContext(fs.readFileSync(new URL('../js/sw-registration.js',import.meta.url),'utf8'),{
  navigator,location:{origin:'https://example.test'},document:{readyState:'loading'},URL,
  window:{addEventListener(type,fn){listeners[type]=fn;},requestIdleCallback(fn){fn();}},
 });
 assert.equal(reads,0);
 listeners.load();await new Promise(resolve=>setImmediate(resolve));
 assert.equal(reads,1);assert.equal(ours,1);assert.equal(unrelated,0);
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
