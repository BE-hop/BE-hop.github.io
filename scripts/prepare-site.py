#!/usr/bin/env python3
"""Build-only responsive images and release versioning. No source/editor fields change."""
import argparse, hashlib, json, re, subprocess, importlib.util
from pathlib import Path
from urllib.parse import unquote, urlsplit
from PIL import Image, ImageOps
spec=importlib.util.spec_from_file_location("page_assets",Path(__file__).with_name("bundle-page-assets.py"));page_assets=importlib.util.module_from_spec(spec);spec.loader.exec_module(page_assets)
parser=argparse.ArgumentParser();parser.add_argument('--site',default='_site');args=parser.parse_args()
root=Path(__file__).resolve().parent.parent;site=Path(args.site).resolve();media=site/'media/optimized';media.mkdir(parents=True,exist_ok=True)
variants={};before=after=0
for parent in ['img','assets']:
 for p in sorted((site/parent).rglob('*')):
  if not p.is_file() or p.suffix.lower() not in ['.jpg','.jpeg','.png','.webp']:continue
  with Image.open(p) as original:
   if getattr(original,'n_frames',1)>1:continue
   im=ImageOps.exif_transpose(original).convert('RGBA' if 'A' in original.getbands() or 'transparency' in original.info else 'RGB')
   key='/'+p.relative_to(site).as_posix()
   detailed='portfolio-page-' in p.name or p.suffix.lower()=='.png'
   quality=90 if detailed else 82
   # Conversion policy belongs in the cache key as well as the source bytes.
   digest=hashlib.sha256(p.read_bytes()+f'webp-v2-q{quality}-480,768,1280,1920,2560'.encode()).hexdigest()[:14];items=[]
   for width in sorted(set([min(im.width,w) for w in [480,768,1280,1920,2560]])):
    dest=media/f'{digest}-{width}.webp'
    if not dest.exists():
     out=im.copy();out.thumbnail((width,10000));out.save(dest,quality=quality,method=5)
    items.append((width,'/'+dest.relative_to(site).as_posix()))
   variants[key]={'items':items,'default':next((u for w,u in items if w>=1280),items[-1][1]),'thumb':next((u for w,u in items if w>=480),items[-1][1]),'cover':items[-1][1],'width':im.width,'height':im.height,'full':items[-1][1]}
   before+=p.stat().st_size

def resolve(value,base):
 if not value or value.startswith(('http:','https:','data:','//','#')):return None
 path=unquote(urlsplit(value).path)
 target=(site/path.lstrip('/')) if path.startswith('/') else (base.parent/path).resolve()
 try:return variants.get('/'+target.relative_to(site).as_posix())
 except ValueError:return None

def attr(tag,name):
 m=re.search(r'(?<![\w-])'+re.escape(name)+r'=[\"\']([^\"\']*)[\"\']',tag);return m.group(1) if m else None

def put(tag,name,value):
 pattern=r'(?<![\w-])'+re.escape(name)+r'=[\"\'][^\"\']*[\"\']'
 if re.search(pattern,tag):return re.sub(pattern,lambda m:f'{name}="{value}"',tag,count=1)
 return tag[:-1].rstrip('/ ')+f' {name}="{value}">'

for p in site.rglob('*.html'):
 text=p.read_text()
 def image(m):
  tag=m.group();src=attr(tag,'src');v=resolve(src,p)
  if not v:return tag
  tag=put(tag,'data-original-src',src);tag=put(tag,'src',v['default']);tag=put(tag,'srcset',', '.join(f'{u} {w}w' for w,u in v['items']))
  sizes='(max-width: 760px) calc(100vw - 32px), (max-width: 1100px) 90vw, 900px'
  context=text[max(0,m.start()-900):m.start()]
  if 'portfolio-entry__previews' in context:sizes='(max-width: 760px) 120px, 240px'
  elif attr(tag,'fetchpriority')=='high' or 'data-hero-media' in tag:sizes='100vw'
  elif p.relative_to(site).as_posix() in ['index.html','works/index.html','behop-ai-product/index.html']:sizes='(max-width: 760px) calc(100vw - 32px), (max-width: 1100px) 90vw, 760px'
  elif 'portfolio-page-' in (src or ''):sizes='(max-width: 760px) calc(100vw - 32px), (max-width: 1400px) 90vw, 1280px'
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
  tag=put(put(put(tag,'data-src',v['default']),'data-src-small',small),'data-full-src',v['full'])
  tag=put(tag,'data-srcset',', '.join(f'{u} {w}w' for w,u in v['items']))
  return tag
 text=re.sub(r'<span\b[^>]*data-book-spread[^>]*>',spread,text)
 # Lightweight social image: never download a 3MB hidden photo.
 text=re.sub(r'<img\b[^>]*width="0"[^>]*>', '', text)
 p.write_text(text)

# CSS backgrounds retain enough pixels for full-width and high-density displays.
for p in site.rglob('*.css'):
 text=p.read_text()
 def css(m):
  v=resolve(m.group(2),p)
  if v:return 'image-set('+', '.join(f'url("{u}") {w / min(v["width"], 1280):.3f}x' for w,u in v['items'] if w>=min(v['width'],1280))+')'
  if m.group(2).startswith(('data:','http:','https:','//','#')):return m.group()
  raw=urlsplit(m.group(2)).path
  font=(site/raw.lstrip('/')) if raw.startswith('/') else (p.parent/raw).resolve()
  if font.is_file() and font.suffix in ['.woff2','.woff','.ttf']:
   return 'url("/'+font.relative_to(site).as_posix()+'?v='+hashlib.sha256(font.read_bytes()).hexdigest()[:12]+'")'
  return m.group()
 text=re.sub(r'url\(([\"\']?)([^)\"\']+)\1\)',css,text);p.write_text(text)

commit=subprocess.check_output(['git','rev-parse','HEAD'],cwd=root,text=True).strip()
hash_input=commit.encode()
for p in sorted(site.rglob('*')):
 if p.is_file() and p.suffix in ['.css','.js','.html']:hash_input+=hashlib.sha256(p.read_bytes()).digest()
version=hashlib.sha256(hash_input).hexdigest()[:16]
site_url=re.search(r'^url:\s*"([^"]+)"', (root/'_config.yml').read_text(), re.M)[1].rstrip('/')
for p in site.rglob('*.html'):
 text=p.read_text();text=re.sub(r'<script\b[^>]*src=[\"\'][^\"\']*sw-registration\.js[^\"\']*[\"\'][^>]*>\s*</script>','',text)
 if not re.search(r'<link\b[^>]*rel=[\"\']canonical',text) and not re.search(r'http-equiv=[\"\']refresh',text,re.I):
  route='/'+p.relative_to(site).as_posix()
  if route.endswith('/index.html'):route=route[:-10]
  text=text.replace('</head>',f'<link rel="canonical" href="{site_url}{route}"></head>')
 text=text.replace('</head>',f'<meta name="behop-release" content="{version}"><meta name="behop-commit" content="{commit}"></head>')
 text=text.replace('</head>',f'<script async src="/js/sw-registration.js?v={version}"></script></head>')
 # Stable release query makes old and new assets distinct in browser and SW caches.
 text=re.sub(r'((?:src|href)=[\"\'])(/[^\"\'?#]+\.(?:css|js))(?:\?[^\"\']*)?([\"\'])',lambda m:m[1]+m[2]+'?v='+hashlib.sha256((site/m[2].lstrip('/')).read_bytes()).hexdigest()[:16]+m[3] if (site/m[2].lstrip('/')).is_file() else m[0],text)
 text=page_assets.bundle_page(site,p,text)
 p.write_text(text)
(site/'sw.js').write_text((site/'sw.js').read_text().replace('__BUILD_VERSION__',version))
release={'version':version,'commit':commit,'image_count':len(variants)}
(site/'release.json').write_text(json.dumps(release))
(site/'image-optimization.json').write_text(json.dumps({'images':len(variants),'source_bytes':before,'responsive_bytes':sum(p.stat().st_size for p in media.glob('*'))}))
print('Prepared release',version,'images',len(variants),'responsive MB',round(sum(p.stat().st_size for p in media.glob('*'))/1048576,2))
