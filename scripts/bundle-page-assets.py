"""Bundle ordered local assets without putting styles or application code in HTML."""
import hashlib,re

def bundle_page(site,path,text):
 relative=path.relative_to(site).as_posix()
 if relative not in ['index.html','works/index.html','works/portfolio/index.html','behop-ai-product/index.html'] and not relative.startswith(('forum/','works/category/','works/page/','behop-ai-product/')):return text
 dest=site/'assets/bundles';dest.mkdir(parents=True,exist_ok=True)
 def bundle(pattern,kind):
  nonlocal text
  matches=list(re.finditer(pattern,text));parts=[];selected=[]
  for m in matches:
   source=site/m[1].split('?')[0].lstrip('/')
   if source.is_file():parts.append(source.read_text());selected.append(m[0])
  if not selected:return
  content=('\n;\n' if kind=='js' else '\n').join(parts)
  name=hashlib.sha256(content.encode()).hexdigest()[:16]+'.'+kind
  (dest/name).write_text(content)
  tag=f'<link rel="stylesheet" href="/assets/bundles/{name}">' if kind=='css' else f'<script defer src="/assets/bundles/{name}"></script>'
  for index,original in enumerate(selected):text=text.replace(original,tag if index==0 else '',1)
 bundle(r'<link\b[^>]*rel="stylesheet"[^>]*href="(/[^" ]+)"[^>]*>','css')
 bundle(r'<script(?:\s+defer)?\s+src="(/(?!js/(?:sw-registration|language-init)\.js)[^" ]+)"\s*>\s*</script>','js')
 bootstrap=site/'js/navigation-repair.js'
 if bootstrap.is_file():text=text.replace('<head>','<head><script>'+bootstrap.read_text().replace('</script','<\\/script')+'</script>',1)
 return text
