#!/usr/bin/env python3
"""Loopback-only static preview with the proposed HTTP cache headers."""
import argparse
import gzip
import hashlib
import io
import json
from urllib.parse import urlsplit, parse_qs
from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler
from pathlib import Path


class Preview(SimpleHTTPRequestHandler):
    site = Path(__file__).resolve().parents[1] / '_site'
    test_fixtures = False
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(self.site), **kwargs)

    def do_GET(self):
        url = urlsplit(self.path)
        version = parse_qs(url.query).get('legacy', [''])[0]
        if self.test_fixtures and url.path == '/sw.js' and version in ('n1','n2','n3'):
            # Synthetic previous-release fixtures stay outside the public build.
            script = """self.addEventListener('install', e=>{e.waitUntil((async()=>{const c=await caches.open('behop-shell-VERSION');await c.put('/legacy-proof/',new Response('<h1>Previous release</h1><script src=\"/assets/bundles/0000000000000000.js\"></script>',{headers:{'Content-Type':'text/html'}}));await c.put('/assets/bundles/0000000000000000.js',new Response('window.previousAssetLoaded=true',{headers:{'Content-Type':'application/javascript'}}));await self.skipWaiting();})());});self.addEventListener('activate',e=>e.waitUntil(self.clients.claim()));self.addEventListener('fetch',e=>e.respondWith(caches.match(e.request).then(c=>c||fetch(e.request))));""".replace('VERSION', version)
            data = script.encode()
            self.send_response(200)
            self.send_header('Content-Type','application/javascript')
            self.send_header('Content-Length',str(len(data)))
            self.end_headers()
            self.wfile.write(data)
            return
        try:
            super().do_GET()
        except (BrokenPipeError, ConnectionResetError):
            pass  # Navigation away may cancel a response normally.

    def send_head(self):
        path = Path(self.translate_path(self.path))
        if path.is_dir():
            path = path / 'index.html'
        if path.is_file() and path.suffix in ('.html', '.css', '.js', '.json', '.svg', '.xml', '.txt') and 'gzip' in self.headers.get('Accept-Encoding', ''):
            data = gzip.compress(path.read_bytes())
            etag = '"' + hashlib.sha256(data).hexdigest()[:16] + '"'
            if self.headers.get('If-None-Match') == etag:
                self.send_response(304)
                self.send_header('ETag', etag)
                self.end_headers()
                return None
            self.send_response(200)
            self.send_header('Content-Type', self.guess_type(str(path)))
            self.send_header('Content-Length', str(len(data)))
            self.send_header('Content-Encoding', 'gzip')
            self.send_header('Vary', 'Accept-Encoding')
            self.send_header('ETag', etag)
            self.end_headers()
            return io.BytesIO(data)
        return super().send_head()

    def end_headers(self):
        route = self.path.split('?')[0]
        if route.startswith(('/media/optimized/', '/assets/bundles/')):
            policy = 'public, max-age=31536000, immutable'
        elif route in ('/sw.js', '/release.json', '/asset-manifest.json'):
            policy = 'no-store'
        else:
            policy = 'public, max-age=60, must-revalidate'
        self.send_header('Cache-Control', policy)
        super().end_headers()

    def log_message(self, *args):
        pass


if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('--port', type=int, default=4001)
    parser.add_argument('--site', default=str(Preview.site))
    parser.add_argument('--test-fixtures', action='store_true')
    args = parser.parse_args()
    Preview.site = Path(args.site).resolve()
    Preview.test_fixtures = args.test_fixtures
    ThreadingHTTPServer(('127.0.0.1', args.port), Preview).serve_forever()
