import importlib.util
import hashlib
import json
import tempfile
import unittest
from pathlib import Path
SCRIPT = Path(__file__).resolve().parents[1] / 'scripts/restore-published-assets.py'
spec = importlib.util.spec_from_file_location('restore', SCRIPT)
restore = importlib.util.module_from_spec(spec)
spec.loader.exec_module(restore)

class PublishedAssets(unittest.TestCase):
 def test_public_manifest_recovery_and_hash_validation(self):
  with tempfile.TemporaryDirectory() as directory:
   restore.CACHE = Path(directory)
   data = b'body{color:green}'
   asset = '/assets/bundles/' + hashlib.sha256(data).hexdigest()[:16] + '.css'
   def fetch(route):
    if route == '/release.json': return json.dumps({'version':'a'*16}).encode()
    if route == '/asset-manifest.json': return json.dumps({'version':'a'*16,'files':[asset,'/../../private']}).encode()
    if route == asset: return data
    raise AssertionError(route)
   restore.fetch = fetch
   restore.restore()
   target = restore.CACHE / asset.lstrip('/')
   self.assertEqual(target.read_bytes(),data)
   self.assertEqual(json.loads((restore.CACHE/'releases.json').read_text())[0]['files'],[asset])
   before = target.stat().st_mtime_ns
   restore.restore()
   self.assertEqual(before,target.stat().st_mtime_ns)

if __name__ == '__main__': unittest.main()
