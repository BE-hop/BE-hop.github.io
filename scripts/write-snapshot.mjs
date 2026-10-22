/* Timestamp-only syncs must not create commits, releases, or new cache buckets. */
import fs from 'node:fs/promises';
function stable(value) {
  if (Array.isArray(value)) return value.map(stable);
  if (value && typeof value === 'object') return Object.fromEntries(Object.keys(value).sort().filter(key => key !== 'updatedAt').map(key => [key,stable(value[key])]));
  return value;
}
export async function writeSnapshot(file, value) {
  try {
    const previous = JSON.parse(await fs.readFile(file,'utf8'));
    if (JSON.stringify(stable(previous)) === JSON.stringify(stable(value))) return false;
  } catch (error) { if (error.code !== 'ENOENT' && !(error instanceof SyntaxError)) throw error; }
  await fs.writeFile(file, JSON.stringify(value,null,2)+'\n','utf8');
  return true;
}
