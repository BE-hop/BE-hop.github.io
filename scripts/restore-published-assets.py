#!/usr/bin/env python3
"""Recover public hashed assets for the release that visitors may still have cached."""
import concurrent.futures
import hashlib
import json
import os
import re
import subprocess
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
CACHE = Path(os.environ.get('BEHOP_ASSET_CACHE', str(ROOT / '.asset-cache')))
BASE = 'https://www.behop.cn'
ALLOWED = re.compile(r'^/(?:assets/bundles/[a-f0-9]{16}\.(?:css|js)|media/optimized/[a-f0-9]{14}-\d+\.webp)$')


def fetch(route):
    # Use the same system certificate/proxy path as the repository's curl probes.
    result = subprocess.run([
        'curl', '--fail', '--compressed', '--location', '--silent', '--show-error',
        '--connect-timeout', '8', '--max-time', '25', '--max-filesize', str(20 * 1024 * 1024),
        '--proto', '=https', '--proto-redir', '=https', BASE + route,
    ], capture_output=True, check=True)
    if len(result.stdout) > 20 * 1024 * 1024:
        raise ValueError('Asset exceeds recovery limit')
    return result.stdout


def restore():
    CACHE.mkdir(parents=True, exist_ok=True)
    release = json.loads(fetch('/release.json'))['version']
    if not re.fullmatch('[a-f0-9]{16}', release):
        raise ValueError('Invalid public release')
    try:
        manifest = json.loads(fetch('/asset-manifest.json'))
        if manifest['version'] != release:
            raise ValueError('Public manifest is not yet consistent')
        files = manifest['files']
    except Exception:
        # First migration predates manifests. Current original media are unchanged;
        # recover the old critical bundles directly from the six public entry pages.
        files = set()
        for route in ['/', '/works/', '/works/portfolio/', '/behop-ai-product/', '/blog/', '/forum/']:
            text = fetch(route).decode('utf-8')
            files.update(re.findall(r'/assets/bundles/[a-f0-9]{16}\.(?:css|js)', text))
    files = sorted({route for route in files if isinstance(route, str) and ALLOWED.fullmatch(route)})[:10000]

    def recover(route):
        target = CACHE / route.lstrip('/')
        if target.is_file():
            return route
        data = fetch(route)
        if route.startswith('/assets/bundles/') and hashlib.sha256(data).hexdigest()[:16] != target.stem:
            raise ValueError('Bundle hash mismatch')
        target.parent.mkdir(parents=True, exist_ok=True)
        target.write_bytes(data)
        return route

    # Keep the old cache history if recovery or the release consistency check fails.
    with concurrent.futures.ThreadPoolExecutor(max_workers=4) as pool:
        recovered = list(pool.map(recover, files))
    if json.loads(fetch('/release.json'))['version'] != release:
        raise ValueError('Public release changed during recovery')
    history_path = CACHE / 'releases.json'
    history = json.loads(history_path.read_text()) if history_path.is_file() else []
    existing = next((entry for entry in history if entry['version'] == release), {})
    previous = {'version': release, 'files': sorted(set(recovered + existing.get('files', [])))}
    history_path.write_text(json.dumps([previous] + [entry for entry in history if entry['version'] != release][:1]))
    print(f'Recovered public release {release}: {len(recovered)} hashed assets available.')


if __name__ == '__main__':
    try:
        restore()
    except Exception as error:
        # This is a compatibility aid, not a new network dependency for content builds.
        print(f'Public asset recovery unavailable ({type(error).__name__}); retaining the existing build cache.')
