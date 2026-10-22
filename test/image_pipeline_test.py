import os
import unittest,tempfile,subprocess,hashlib,json
from pathlib import Path
from PIL import Image, ImageDraw
SCRIPT=Path(__file__).resolve().parents[1]/'scripts/optimize-images.py'
class Images(unittest.TestCase):
 def test_repeated_runs_preserve_originals_and_new_edits(self):
  with tempfile.TemporaryDirectory() as d:
   base=Path(d);root=base/'site';(root/'img').mkdir(parents=True);(root/'assets').mkdir();backup=base/'private';p=root/'img/example.png'
   Image.new('RGB',(2400,1800),'red').save(p);original=p.read_bytes()
   def run():subprocess.run(['python3',str(SCRIPT),'--root',str(root),'--backup',str(backup)],check=True,stdout=subprocess.DEVNULL,env={**os.environ,'BEHOP_ASSET_CACHE':str(root/'.asset-cache')})
   run();optimized=p.read_bytes();run();self.assertEqual(p.read_bytes(),optimized);self.assertEqual((backup/'img/example.png').read_bytes(),original)
   Image.new('RGB',(2400,1800),'blue').save(p);new=p.read_bytes();run();self.assertEqual(Image.open(p).convert('RGB').getpixel((0,0)),(0,0,255))
   manifest=json.loads((backup/'manifest.json').read_text());self.assertEqual((backup/manifest[0]['original_path']).read_bytes(),new);self.assertEqual((backup/'img/example.png').read_bytes(),original)
 def test_build_preserves_master_and_generates_readable_responsive_variants(self):
  with tempfile.TemporaryDirectory() as d:
   root=Path(d);(root/'img').mkdir();(root/'css').mkdir();(root/'js').mkdir()
   source=root/'img/portfolio-page-test.png'
   im=Image.new('RGB',(3000,1500),'white');draw=ImageDraw.Draw(im)
   for x in range(100,2900,50):draw.line((x,100,x,1400),fill='black',width=3)
   im.save(source);before=source.read_bytes()
   (root/'css/test.css').write_text('body{background:url("/img/portfolio-page-test.png")}')
   (root/'css/portfolio-books.css').write_text('.cover{background:url("/img/portfolio-page-test.png")}')
   (root/'index.html').write_text('<head></head><body><img src="/img/portfolio-page-test.png" fetchpriority="high"><span data-book-spread data-src="/img/portfolio-page-test.png"></span></body>')
   (root/'sw.js').write_text('const VERSION="__BUILD_VERSION__";')
   subprocess.run(['python3',str(SCRIPT.with_name('prepare-site.py')),'--site',str(root)],check=True,stdout=subprocess.DEVNULL,env={**os.environ,'BEHOP_ASSET_CACHE':str(root/'.asset-cache')})
   self.assertEqual(source.read_bytes(),before)
   html=(root/'index.html').read_text();self.assertIn('data-media-role="content"',html);self.assertIn('data-srcset=',html);self.assertIn('-2560.webp',html)
   with Image.open(next((root/'media/optimized').glob('*-2560.webp'))) as variant:self.assertEqual(variant.size,(2560,1280))
   css=(root/'css/test.css').read_text();self.assertIn('image-set(',css);self.assertNotIn('-2560.webp',css)
   covers=(root/'css/portfolio-books.css').read_text();self.assertIn('-480.webp") 2.000x',covers);self.assertNotIn('-2560.webp',covers)
 def test_inline_background_and_previous_asset_retention(self):
  import shutil,re
  with tempfile.TemporaryDirectory() as d:
   base=Path(d);root=base/'site';cache=base/'cache'
   def build(color):
    if root.exists():shutil.rmtree(root)
    (root/'img').mkdir(parents=True);(root/'css').mkdir();(root/'js').mkdir()
    Image.new('RGB',(2400,1200),'green').save(root/'img/header.jpg')
    (root/'css/example.css').write_text('body{color:'+color+'}')
    (root/'index.html').write_text('<head><link rel="stylesheet" href="/css/example.css"></head><body><header style="background-image: url(\'/img/header.jpg\')"></header></body>')
    (root/'sw.js').write_text('const VERSION="__BUILD_VERSION__";')
    subprocess.run(['python3',str(SCRIPT.with_name('prepare-site.py')),'--site',str(root)],check=True,stdout=subprocess.DEVNULL,env={**os.environ,'BEHOP_ASSET_CACHE':str(cache)})
    output=(root/'index.html').read_text()
    self.assertIn('background-image: image-set(',output)
    self.assertNotIn('url(\'/img/header.jpg\')',output)
    return re.search(r'/assets/bundles/[a-f0-9]+.css',output)[0]
   first=build('green');variant=next((cache/'media/optimized').glob('*-1280.webp'));modified=variant.stat().st_mtime_ns
   second=build('blue')
   self.assertNotEqual(first,second);self.assertTrue((root/first.lstrip('/')).is_file())
   self.assertEqual(variant.stat().st_mtime_ns,modified)
   third=build('blue');self.assertEqual(second,third)
   self.assertTrue((root/first.lstrip('/')).is_file())
   for color in ['red','orange','purple','black']:build(color)
   history=json.loads((cache/'releases.json').read_text())
   self.assertGreaterEqual(len(history),6)
   self.assertTrue((root/first.lstrip('/')).is_file())
   for entry in history:
    if first in entry['files']:entry['created_at']=1
   (cache/'releases.json').write_text(json.dumps(history))
   build('gray')
   self.assertFalse((root/first.lstrip('/')).is_file())
if __name__=='__main__':unittest.main()
