import unittest,tempfile,subprocess,re
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
if __name__=='__main__':unittest.main()
