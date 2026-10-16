#!/usr/bin/env python3
"""Back up source media without lossy rewriting; prepare-site.py creates web variants."""
from pathlib import Path
from PIL import Image, ImageOps
import argparse, hashlib, json, shutil
parser=argparse.ArgumentParser();parser.add_argument('--backup',required=True);parser.add_argument('--root');args=parser.parse_args()
root=Path(args.root).resolve() if args.root else Path(__file__).resolve().parent.parent;backup=Path(args.backup).resolve()
if backup==root or root in backup.parents:raise SystemExit('Backup must be outside repository')
backup.mkdir(parents=True,exist_ok=True);manifest=[]
previous={x['path']:x for x in json.loads((backup/'manifest.json').read_text())} if (backup/'manifest.json').exists() else {}
for parent in ['img','assets']:
 for p in sorted((root/parent).rglob('*')):
  if not p.is_file() or p.suffix.lower() not in ['.png','.jpg','.jpeg','.webp','.gif','.svg']:continue
  rel=p.relative_to(root);old=previous.get(str(rel));current_hash=hashlib.sha256(p.read_bytes()).hexdigest()
  original_rel=old.get('original_path',str(rel)) if old else str(rel)
  if old and current_hash not in [old['sha256'],old['original_sha256']]:original_rel='revisions/'+current_hash+'/'+str(rel)
  dest=backup/original_rel;dest.parent.mkdir(parents=True,exist_ok=True)
  if not dest.exists():shutil.copy2(p,dest)
  raw=dest.read_bytes();entry={'path':str(rel),'original_path':original_rel,'original_sha256':hashlib.sha256(raw).hexdigest(),'original_bytes':len(raw)}
  # Source media is the quality master. Web variants are generated at build time.
  entry.update(bytes=p.stat().st_size,sha256=hashlib.sha256(p.read_bytes()).hexdigest());manifest.append(entry)
(backup/'manifest.json').write_text(json.dumps(manifest,ensure_ascii=False,indent=2))
a=sum(x['original_bytes'] for x in manifest);b=sum(x['bytes'] for x in manifest)
print(json.dumps({'files':len(manifest),'before':a,'after':b,'reduction':round(1-b/a,3),'backup':str(backup)}))
