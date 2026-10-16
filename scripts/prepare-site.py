#!/usr/bin/env python3
"""Build-only responsive images and release versioning. No source/editor fields change."""
import argparse, hashlib, json, re, subprocess
from pathlib import Path
from urllib.parse import unquote, urlsplit
from PIL import Image, ImageOps
parser=argparse.ArgumentParser();parser.add_argument('--site',default='_site');args=parser.parse_args()
root=Path(__file__).resolve().parent.parent;site=Path(args.site).resolve();media=site/'media/optimized';media.mkdir(parents=True,exist_ok=True)
variants={};before=after=0
for parent in ['img','assets']:
 for p in sorted((site/parent).rglob('*')):
  if not p.is_file() or p.suffix.lower() not in ['.jpg','.jpeg','.png','.webp']:continue
  with Image.open(p) as original:
   if getattr(original,'n_frames',1)>1:continue
   im=ImageOps.exif_transpose(original).convert('RGBA' if 'A' in original.getbands() or 'transparency' in original.info else 'RGB')
   key='/'+p.relative_to(site).as_posix();digest=hashlib.sha256(p.read_bytes()).hexdigest()[:14];items=[]
   for width in sorted(set([min(im.width,w) for w in [480,768,1280]])):
    dest=media/f'{digest}-{width}.webp'
    if not dest.exists():
     out=im.copy();out.thumbnail((width,10000));out.save(dest,quality=42 if width<=768 else 52,method=5)
    items.append((width,'/'+dest.relative_to(site).as_posix()))
   variants[key]={'items':items,'default':next((u for w,u in items if w>=1280),items[-1][1]),'thumb':next((u for w,u in items if w>=480),items[-1][1]),'cover':items[0][1],'width':im.width,'height':im.height,'full':key}
   before+=p.stat().st_size
   # New editor uploads receive the same publication-size fallback without editing source fields.
   if im.width > 2400 or p.stat().st_size > 1000000:
    fallback=im.copy();fallback.thumbnail((2400,2400))
    temp=p.with_name(p.stem+'.web-fallback'+p.suffix)
    if p.suffix.lower() in ['.jpg','.jpeg']:fallback.convert('RGB').save(temp,quality=55,optimize=True,progressive=True)
    elif p.suffix.lower()=='.png':fallback.quantize(colors=96,method=Image.Quantize.FASTOCTREE).save(temp,optimize=True)
    else:fallback.save(temp,quality=55,method=5)
    if temp.stat().st_size < p.stat().st_size:temp.replace(p)
    else:temp.unlink()

def resolve(value,base):
 if not value or value.startswith(('http:','https:','data:','//','#')):return None
 path=unquote(urlsplit(value).path)
 target=(site/path.lstrip('/')) if path.startswith('/') else (base.parent/path).resolve()
 try:return variants.get('/'+target.relative_to(site).as_posix())
 except ValueError:return None

def attr(tag,name):
 m=re.search(r'\b'+re.escape(name)+r'=[\"\']([^\"\']*)[\"\']',tag);return m.group(1) if m else None

def put(tag,name,value):
 pattern=r'\b'+re.escape(name)+r'=[\"\'][^\"\']*[\"\']'
 if re.search(pattern,tag):return re.sub(pattern,lambda m:f'{name}="{value}"',tag,count=1)
 return tag[:-1].rstrip('/ ')+f' {name}="{value}">'

for p in site.rglob('*.html'):
 text=p.read_text()
 def image(m):
  tag=m.group();src=attr(tag,'src');v=resolve(src,p)
  if not v:return tag
  tag=put(tag,'src',v['default']);tag=put(tag,'srcset',', '.join(f'{u} {w}w' for w,u in v['items']))
  sizes='(max-width: 760px) calc(100vw - 32px), (max-width: 1100px) 90vw, 900px'
  context=text[max(0,m.start()-900):m.start()]
  if 'portfolio-entry__previews' in context:sizes='(max-width: 760px) 120px, 240px'
  elif p.relative_to(site).as_posix() in ['index.html','works/index.html','behop-ai-product/index.html']:sizes='(max-width: 760px) 90vw, 45vw'
  tag=put(tag,'sizes',sizes)
  if not attr(tag,'width'):tag=put(tag,'width',str(v['width']))
  if not attr(tag,'height'):tag=put(tag,'height',str(v['height']))
  if attr(tag,'fetchpriority')!='high' and not attr(tag,'loading'):tag=put(tag,'loading','lazy')
  return put(tag,'decoding','async')
 text=re.sub(r'<img\b[^>]*>',image,text,flags=re.I)
 text=re.sub(r'<iframe\b[^>]*>',lambda m:put(m.group(),'loading','lazy'),text,flags=re.I)
 def spread(m):
  tag=m.group();v=resolve(attr(tag,'data-src'),p)
  if not v:return tag
  small=next((u for w,u in v['items'] if w>=768),v['items'][-1][1])
  return put(put(put(tag,'data-src',v['default']),'data-src-small',small),'data-full-src',v['full'])
 text=re.sub(r'<span\b[^>]*data-book-spread[^>]*>',spread,text)
 # Lightweight social image: never download a 3MB hidden photo.
 text=re.sub(r'<img\b[^>]*width="0"[^>]*>', '', text)
 p.write_text(text)

# CSS covers use small variants; keep source fallbacks for dynamic paths and original links.
for p in site.rglob('*.css'):
 text=p.read_text()
 def css(m):
  v=resolve(m.group(2),p)
  return f'url("{v["cover"]}")' if v else m.group()
 text=re.sub(r'url\(([\"\']?)([^)\"\']+)\1\)',css,text);p.write_text(text)

commit=subprocess.check_output(['git','rev-parse','HEAD'],cwd=root,text=True).strip()
hash_input=commit.encode()
for p in sorted(site.rglob('*')):
 if p.is_file() and p.suffix in ['.css','.js','.html']:hash_input+=hashlib.sha256(p.read_bytes()).digest()
version=hashlib.sha256(hash_input).hexdigest()[:16]
for p in site.rglob('*.html'):
 text=p.read_text();text=re.sub(r'<script\b[^>]*src=[\"\'][^\"\']*sw-registration\.js[^\"\']*[\"\'][^>]*>\s*</script>','',text)
 text=text.replace('</head>',f'<meta name="behop-release" content="{version}"><meta name="behop-commit" content="{commit}"></head>')
 text=text.replace('</body>',f'<script defer src="/js/sw-registration.js?v={version}"></script></body>')
 # Stable release query makes old and new assets distinct in browser and SW caches.
 text=re.sub(r'((?:src|href)=[\"\'])(/[^\"\'?#]+\.(?:css|js))(?:\?[^\"\']*)?([\"\'])',lambda m:m[1]+m[2]+'?v='+version+m[3],text)
 p.write_text(text)
(site/'sw.js').write_text((site/'sw.js').read_text().replace('__BUILD_VERSION__',version))
release={'version':version,'commit':commit,'image_count':len(variants)}
(site/'release.json').write_text(json.dumps(release))
(site/'image-optimization.json').write_text(json.dumps({'images':len(variants),'source_bytes':before,'responsive_bytes':sum(p.stat().st_size for p in media.glob('*'))}))
print('Prepared release',version,'images',len(variants),'responsive MB',round(sum(p.stat().st_size for p in media.glob('*'))/1048576,2))
