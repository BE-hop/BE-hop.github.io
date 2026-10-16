#!/usr/bin/env python3
"""Compress source media once, keeping immutable originals outside Git."""
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
  if p.suffix.lower() not in ['.svg','.gif']:
   with Image.open(dest) as original:
    if getattr(original,'n_frames',1)==1:
     im=ImageOps.exif_transpose(original);board='portfolio-page-' in p.name or im.width>3000
     im.thumbnail((2400 if board else 1280,2400 if board else 1280))
     temp=p.with_name(p.stem+'.compressed'+p.suffix)
     if p.suffix.lower() in ['.jpg','.jpeg']:im.convert('RGB').save(temp,quality=55 if board else 52,optimize=True,progressive=True)
     elif p.suffix.lower()=='.png':im.quantize(colors=96,method=Image.Quantize.FASTOCTREE).save(temp,optimize=True)
     else:im.save(temp,quality=55,method=6)
     # Never expand an already efficient source.
     if temp.stat().st_size<len(raw):temp.replace(p)
     else:temp.unlink();shutil.copy2(dest,p)
  entry.update(bytes=p.stat().st_size,sha256=hashlib.sha256(p.read_bytes()).hexdigest());manifest.append(entry)
(backup/'manifest.json').write_text(json.dumps(manifest,ensure_ascii=False,indent=2))
a=sum(x['original_bytes'] for x in manifest);b=sum(x['bytes'] for x in manifest)
print(json.dumps({'files':len(manifest),'before':a,'after':b,'reduction':round(1-b/a,3),'backup':str(backup)}))
