import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import vm from 'node:vm';
import {execFileSync} from 'node:child_process';
test('forum growth generates complete static bodies, bounded lists, summaries, and scoped comments',async()=>{
 const root=await fs.mkdtemp(path.join(os.tmpdir(),'behop-forum-'));
 try {
  for(const dir of ['forum/topic','assets/data','js'])await fs.mkdir(path.join(root,dir),{recursive:true});
  const topics=Array.from({length:20},(_,i)=>({slug:`synthetic-${i}`,title:{en:`Synthetic ${i}`,zh:`合成 ${i}`},excerpt:{en:'Summary'},date:'2026-10-22',author:{name:'Author'},content:[{type:'p',en:`Body ${i}`,zh:`正文 ${i}`}]}));
  await fs.writeFile(path.join(root,'assets/data/forum-topics-approved.json'),JSON.stringify({topics}));
  await fs.writeFile(path.join(root,'assets/data/forum-comments-approved.json'),JSON.stringify({comments:[{topicSlug:'synthetic-0',content:'Only this topic'}]}));
  await fs.writeFile(path.join(root,'forum/index.html'),'<head></head><body><main><div data-forum-list></div></main><script src="/js/forum-data.js"></script></body>');
  await fs.writeFile(path.join(root,'forum/topic/index.html'),'<head><title>Topic</title></head><body><h1 data-topic-title></h1><span data-topic-author-initials></span><span data-topic-author></span><div class="forum-article space-y-6" data-topic-content></div><script src="/js/forum-data.js"></script><script src="/js/forum-topic.js"></script></body>');
  execFileSync('node',['scripts/prepare-forum.mjs',root]);
  const page=await fs.readFile(path.join(root,'forum/topic/synthetic-0/index.html'),'utf8');
  assert.match(page,/Body 0/);assert.match(page,/正文 0/);assert.match(page,/<span data-topic-author>Author<\/span>/);
  assert.match(page,/<span data-topic-author-initials><\/span>/);
  const window={};vm.runInNewContext(await fs.readFile(path.join(root,'js/forum-summaries.js'),'utf8'),{window});
  assert.equal(window.FORUM_TOPICS.length,25);assert.ok(window.FORUM_TOPICS.every(topic=>!topic.content));
  assert.equal((await fs.readFile(path.join(root,'forum/index.html'),'utf8')).match(/class="forum-static-card"/g).length,6);
  assert.equal((await fs.readFile(path.join(root,'forum/page/2/index.html'),'utf8')).match(/class="forum-static-card"/g).length,6);
  assert.equal((await fs.readFile(path.join(root,'forum/page/5/index.html'),'utf8')).match(/class="forum-static-card"/g).length,1);
  assert.equal(JSON.parse(await fs.readFile(path.join(root,'assets/data/forum-comments/synthetic-1.json'))).comments.length,0);
  assert.equal(JSON.parse(await fs.readFile(path.join(root,'assets/data/forum-comments/synthetic-0.json'))).comments.length,1);
 } finally {await fs.rm(root,{recursive:true,force:true});}
});
