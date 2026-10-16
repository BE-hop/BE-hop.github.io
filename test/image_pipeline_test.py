import unittest,tempfile,subprocess,hashlib,json
from pathlib import Path
from PIL import Image, ImageDraw
SCRIPT=Path(__file__).resolve().parents[1]/'scripts/optimize-images.py'
class Images(unittest.TestCase):
 def test_repeated_runs_preserve_originals_and_new_edits(self):
  with tempfile.TemporaryDirectory() as d:
   base=Path(d);root=base/'site';(root/'img').mkdir(parents=True);(root/'assets').mkdir();backup=base/'private';p=root/'img/example.png'
   Image.new('RGB',(2400,1800),'red').save(p);original=p.read_bytes()
   def run():subprocess.run(['python3',str(SCRIPT),'--root',str(root),'--backup',str(backup)],check=True,stdout=subprocess.DEVNULL)
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
   subprocess.run(['python3',str(SCRIPT.with_name('prepare-site.py')),'--site',str(root)],check=True,stdout=subprocess.DEVNULL)
   self.assertEqual(source.read_bytes(),before)
   html=(root/'index.html').read_text();self.assertIn('sizes="100vw"',html);self.assertIn('data-srcset=',html);self.assertIn('-2560.webp',html)
   with Image.open(next((root/'media/optimized').glob('*-2560.webp'))) as variant:self.assertEqual(variant.size,(2560,1280))
   css=(root/'css/test.css').read_text();self.assertIn('image-set(',css);self.assertNotIn('-480.webp',css)
   covers=(root/'css/portfolio-books.css').read_text();self.assertIn('-768.webp") 2.000x',covers);self.assertNotIn('-2560.webp',covers)
if __name__=='__main__':unittest.main()
