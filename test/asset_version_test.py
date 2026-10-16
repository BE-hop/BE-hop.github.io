import unittest,tempfile,subprocess,re,importlib.util
from pathlib import Path
SCRIPT=Path(__file__).resolve().parents[1]/'scripts/prepare-site.py'
class AssetVersions(unittest.TestCase):
 def test_content_only_changes_do_not_invalidate_unchanged_assets(self):
  with tempfile.TemporaryDirectory() as d:
   root=Path(d);(root/'css').mkdir();(root/'js').mkdir();(root/'css/example.css').write_text('body{color:green}')
   (root/'js/sw-registration.js').write_text('window.ready=true;');(root/'sw.js').write_text('const VERSION="__BUILD_VERSION__";')
   def build(text):
    (root/'index.html').write_text('<head><link rel="stylesheet" href="/css/example.css"></head><body>'+text+'<script src="/js/sw-registration.js"></script></body>')
    (root/'sw.js').write_text('const VERSION="__BUILD_VERSION__";')
    subprocess.run(['python3',str(SCRIPT),'--site',str(root)],check=True,stdout=subprocess.DEVNULL)
    output=(root/'index.html').read_text();return re.search(r'href="([^"]+)"',output)[1],re.search(r'name="behop-release" content="([^"]+)"',output)[1]
   first=build('old forum');second=build('updated forum')
   self.assertEqual(first[0],second[0]);self.assertNotEqual(first[1],second[1])
   (root/'css/example.css').write_text('body{color:blue}');third=build('updated forum');self.assertNotEqual(second[0],third[0])
 def test_critical_pages_keep_small_html_with_ordered_external_bundles(self):
  spec=importlib.util.spec_from_file_location('bundle',SCRIPT.with_name('bundle-page-assets.py'));mod=importlib.util.module_from_spec(spec);spec.loader.exec_module(mod)
  with tempfile.TemporaryDirectory() as d:
   root=Path(d);(root/'js').mkdir();(root/'css').mkdir();(root/'works').mkdir()
   (root/'js/a.js').write_text('window.first=1');(root/'js/b.js').write_text('window.second=2')
   (root/'css/a.css').write_text('body{color:green}')
   html='<head><link rel="stylesheet" href="/css/a.css"></head><body><script src="/js/a.js"></script><script src="/js/b.js"></script><script defer src="/js/sw-registration.js?v=123"></script></body>'
   output=mod.bundle_page(root,root/'works/index.html',html)
   self.assertNotIn('window.first',output);self.assertIn('defer src="/js/sw-registration.js',output)
   scripts=list((root/'assets/bundles').glob('*.js'));self.assertEqual(len(scripts),1)
   code=scripts[0].read_text();self.assertLess(code.index('window.first'),code.index('window.second'));self.assertIn('\n;\n',code)
if __name__=='__main__':unittest.main()
