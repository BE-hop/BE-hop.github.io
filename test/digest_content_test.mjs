import test from 'node:test';
import assert from 'node:assert/strict';
import {normalizeDigest,digestMatches,digestRoute} from '../scripts/digest-content.mjs';
test('legacy viewpoints stay observations and historic messages stay out of the main news index',()=>{
 const view=normalizeDigest({slug:'view',date:'2026-01-01'});
 const message=normalizeDigest({slug:'message',category:'message',contentType:'research'});
 assert.equal(view.contentType,'observation');assert.equal(message.contentType,'message');
 assert.equal(digestMatches(view),true);assert.equal(digestMatches(message),false);
 assert.equal(digestMatches(message,{type:'message'}),true);
});
test('filters intersect type, topic and site publication year without using event date',()=>{
 const topic=normalizeDigest({slug:'paper',contentType:'research',category:'ai',tags:['design-rules'],date:'2026-10-24',eventDate:'2025-10-01'});
 assert.equal(digestMatches(topic,{type:'research',theme:'design-rules',year:'2026'}),true);
 assert.equal(digestMatches(topic,{type:'practice'}),false);
 assert.equal(digestMatches(topic,{year:'2025'}),false);
 assert.equal(digestRoute({type:'research',theme:'design-rules',year:'2026'},2),'/forum/type/research/theme/design-rules/year/2026/page/2/');
});
test('source normalization rejects executable and malformed links without inventing attribution',()=>{
 const topic=normalizeDigest({sources:[{url:'javascript:alert(1)'},{url:'https://example.com/"x'},{name:{zh:'论文',en:'Paper'},url:'https://example.com/paper'}]});
 assert.equal(topic.sources.length,1);assert.equal(topic.sources[0].url,'https://example.com/paper');
 assert.deepEqual(normalizeDigest({}).sources,[]);
});
