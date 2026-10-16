#!/usr/bin/env python3
"""Report public URL transfer timings; does not alter proxy or DNS settings."""
import argparse
import concurrent.futures
import json
import subprocess

parser = argparse.ArgumentParser()
parser.add_argument('--base-url', default='https://www.behop.cn')
parser.add_argument('--samples', type=int, default=5)
parser.add_argument('--network-label', required=True)
args = parser.parse_args()
if not 1 <= args.samples <= 20:
    parser.error('--samples must be between 1 and 20')
paths = ['/', '/works/', '/works/portfolio/', '/behop-ai-product/', '/blog/', '/forum/']
format_string = '%{json}'
def probe(item):
    path, sample = item
    result = subprocess.run(['curl', '--compressed', '-L', '-sS', '--connect-timeout', '8', '--max-time', '20', '-o', '/dev/null', '-w', format_string, args.base_url.rstrip('/') + path], capture_output=True, text=True)
    try:
        data = json.loads(result.stdout)
    except ValueError:
        data = {}
    fields = ['http_code', 'url_effective', 'num_redirects', 'time_namelookup', 'time_connect', 'time_appconnect', 'time_starttransfer', 'time_total', 'size_download', 'http_version']
    return {'path': path, 'sample': sample, 'exit_code': result.returncode, **{key: data.get(key) for key in fields}}
with concurrent.futures.ThreadPoolExecutor(max_workers=3) as executor:
    records = list(executor.map(probe, [(path, n + 1) for path in paths for n in range(args.samples)]))
print(json.dumps({'network_label': args.network_label, 'note': 'Transfer timings only; these are not FCP/LCP measurements or verified geographic attribution.', 'records': records}, indent=2))
