import unittest,tempfile,subprocess,hashlib,json
from pathlib import Path
from PIL import Image
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
if __name__=='__main__':unittest.main()
