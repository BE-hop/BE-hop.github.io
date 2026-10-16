"""Keep critical navigation pages usable when separate asset transfers stall."""
import base64,re
from pathlib import Path

def embedded_image(site,url):
 p=site/url.lstrip('/')
 return 'data:image/webp;base64,'+base64.b64encode(p.read_bytes()).decode()

def prepare_critical_page(site,path,text):
 relative=path.relative_to(site).as_posix()
 if relative not in ['works/index.html','works/portfolio/index.html'] and not relative.startswith('forum/'):return text
 def style(m):
  url=m.group(1).split('?')[0];p=site/url.lstrip('/')
  if not p.is_file():return m.group()
  css=p.read_text()
  if relative=='works/portfolio/index.html':
   css=re.sub(r'url\("(/media/optimized/[^" ]+)"\)',lambda x:'url("'+embedded_image(site,x[1])+'")',css)
  return '<style data-critical-source="'+url+'">'+css.replace('</style','<\\/style')+'</style>'
 text=re.sub(r'<link\b[^>]*rel="stylesheet"[^>]*href="(/[^" ]+)"[^>]*>',style,text)
 # Ordered, parser-position scripts keep their existing execution order.
 def script(m):
  if re.search(r'\b(?:defer|async|type)\b',m[0]) and '/js/sw-registration.js' not in m[1]:return m[0]
  p=site/m[1].split('?')[0].lstrip('/')
  if not p.is_file():return m[0]
  return '<script data-critical-source="'+m[1].split('?')[0]+'">'+p.read_text().replace('</script','<\\/script')+'</script>'
 return re.sub(r'<script\b[^>]*src="(/[^" ]+)"[^>]*>\s*</script>',script,text)
