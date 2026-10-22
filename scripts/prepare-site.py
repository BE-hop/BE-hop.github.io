#!/usr/bin/env python3
"""Build-only responsive images and release versioning. No source/editor fields change."""
import argparse, hashlib, json, re, subprocess, importlib.util, os, shutil, html
from pathlib import Path
from urllib.parse import unquote, urlsplit
from PIL import Image, ImageOps
spec=importlib.util.spec_from_file_location("page_assets",Path(__file__).with_name("bundle-page-assets.py"));page_assets=importlib.util.module_from_spec(spec);spec.loader.exec_module(page_assets)
parser=argparse.ArgumentParser();parser.add_argument('--site',default='_site');args=parser.parse_args()
root=Path(__file__).resolve().parent.parent;site=Path(args.site).resolve();media=site/'media/optimized';media.mkdir(parents=True,exist_ok=True)
cache=Path(os.environ.get('BEHOP_ASSET_CACHE', str(root/'.asset-cache'))).resolve();cache.mkdir(parents=True,exist_ok=True)
media_spec=importlib.util.spec_from_file_location("site_media",Path(__file__).with_name("media-variants.py"))
site_media=importlib.util.module_from_spec(media_spec);media_spec.loader.exec_module(site_media)
variants,before=site_media.build_variants(site,cache)
for p in site.rglob('*.html'):
 text=site_media.transform_html(p.read_text(),p,site,variants)
 text=re.sub(r'<iframe\b[^>]*>',lambda m:site_media.put(m.group(),'loading','lazy'),text,flags=re.I)
 text=re.sub(r'<img\b[^>]*width="0"[^>]*>', '', text)
 if 'data-en=' in text or 'data-i18n-en=' in text:
  text=re.sub(r'<html lang="[^"]+"', '<html lang="en"', text, count=1)
  def english(m):
   value=site_media.attr(m[1], 'data-en') or site_media.attr(m[1], 'data-i18n-en')
   return m[1]+html.escape(value)+m[3] if value else m[0]
  text=re.sub(r'(<[\w-]+\b[^>]*(?:data-en|data-i18n-en)="[^"]*"[^>]*>)([^<]*)(</[\w-]+>)',english,text)
  if (site/'js/language-init.js').is_file():text=text.replace('</head>','<script async src="/js/language-init.js"></script></head>')
 if (site/'js/image-loading.js').is_file():
  text=text.replace('</head>','<link rel="stylesheet" href="/css/image-loading.css"></head>')
  text=text.replace('</body>','<script defer src="/js/image-loading.js"></script></body>')
 if (site/'js/media-controls.js').is_file():
  text=text.replace('</head>','<link rel="stylesheet" href="/css/media-viewer.css"></head>')
  text=text.replace('</body>','<script defer src="/js/media-controls.js"></script></body>')
 p.write_text(text)
for p in site.rglob('*.css'):
 p.write_text(site_media.transform_css(p.read_text(),p,site,variants))
viewer=site/'js/media-viewer.js'
controls=site/'js/media-controls.js'
if viewer.is_file() and controls.is_file():
 digest=hashlib.sha256(viewer.read_bytes()).hexdigest()[:16]
 target=site/'assets/bundles'/f'{digest}.js'
 target.parent.mkdir(parents=True,exist_ok=True)
 target.write_bytes(viewer.read_bytes())
 controls.write_text(controls.read_text().replace('/js/media-viewer.js', '/assets/bundles/'+target.name))


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
 runtime=f'<script async src="/js/sw-registration.js?v={version}"></script>'
 text=text.replace('<head>', '<head>'+runtime, 1)
 # Stable release query makes old and new assets distinct in browser and SW caches.
 text=re.sub(r'((?:src|href)=[\"\'])(/[^\"\'?#]+\.(?:css|js))(?:\?[^\"\']*)?([\"\'])',lambda m:m[1]+m[2]+'?v='+hashlib.sha256((site/m[2].lstrip('/')).read_bytes()).hexdigest()[:16]+m[3] if (site/m[2].lstrip('/')).is_file() else m[0],text)
 text=page_assets.bundle_page(site,p,text)
 p.write_text(text)
(site/'sw.js').write_text((site/'sw.js').read_text().replace('__BUILD_VERSION__',version))
release={'version':version,'commit':commit,'image_count':len(variants)}
(site/'release.json').write_text(json.dumps(release))
(site/'image-optimization.json').write_text(json.dumps({'images':len(variants),'source_bytes':before,'responsive_bytes':sum(p.stat().st_size for p in media.glob('*'))}))
print('Prepared release',version,'images',len(variants),'responsive MB',round(sum(p.stat().st_size for p in media.glob('*'))/1048576,2))

# Preserve at least four releases and every release from the last 30 days.
# Existing manifests without timestamps are retained conservatively on first migration.
import time
manifest=cache/'releases.json'
try:history=json.loads(manifest.read_text())
except (OSError,ValueError):history=[]
now=int(time.time())
history=[{**entry,'created_at':entry.get('created_at',now)} for entry in history]
current=sorted('/'+p.relative_to(site).as_posix() for folder in ['media/optimized','assets/bundles'] for p in (site/folder).glob('*') if p.is_file())
for relative in current:
 source=site/relative.lstrip('/');target=cache/relative.lstrip('/')
 target.parent.mkdir(parents=True,exist_ok=True)
 if not target.exists():shutil.copy2(source,target)
old=[entry for entry in history if entry['version']!=version]
retained=[entry for index,entry in enumerate(old) if index<3 or entry.get('created_at',now)>=now-30*86400]
created=next((entry['created_at'] for entry in history if entry['version']==version),now)
entries=[{'version':version,'created_at':created,'files':current}]+retained
for entry in retained:
 for relative in entry.get('files',[]):
  if not re.fullmatch(r'/(?:media/optimized/[a-f0-9]{14}-\d+\.webp|assets/bundles/[a-f0-9]{16}\.(?:css|js))',relative):continue
  source=cache/relative.lstrip('/');target=site/relative.lstrip('/')
  if source.is_file() and not target.exists():
   target.parent.mkdir(parents=True,exist_ok=True);shutil.copy2(source,target)
manifest.write_text(json.dumps(entries))
# Public recovery includes compatibility assets, not only the newest page's assets.
keep={relative for entry in entries for relative in entry['files']}
(site/'asset-manifest.json').write_text(json.dumps({'version':version,'files':current,'releases':entries}))
for folder in ['media/optimized','assets/bundles']:
 for p in (cache/folder).glob('*'):
  if '/'+p.relative_to(cache).as_posix() not in keep:p.unlink()
