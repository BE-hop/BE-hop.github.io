import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { writeSnapshot } from '../scripts/write-snapshot.mjs';
test('unchanged approved data preserves timestamps and bytes; real changes write a snapshot',async()=>{
 const dir=await fs.mkdtemp(path.join(os.tmpdir(),'behop-snapshot-'));
 try {
  const file=path.join(dir,'snapshot.json');
  assert.equal(await writeSnapshot(file,{updatedAt:'old',topics:{a:{views:2,updatedAt:'old'}}}),true);
  const before=await fs.readFile(file,'utf8');
  assert.equal(await writeSnapshot(file,{topics:{a:{updatedAt:'new',views:2}},updatedAt:'new'}),false);
  assert.equal(await fs.readFile(file,'utf8'),before);
  assert.equal(await writeSnapshot(file,{updatedAt:'new',topics:{a:{views:3,updatedAt:'new'}}}),true);
 } finally {await fs.rm(dir,{recursive:true,force:true});}
});
