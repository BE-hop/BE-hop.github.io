#!/usr/bin/env python3
"""Fail deployment of the retirement worker until live HTML allows HTTP caching."""
import argparse
import concurrent.futures
import re
import subprocess
import sys

ROUTES = ('/', '/works/', '/works/portfolio/', '/behop-ai-product/', '/blog/', '/forum/')


def check(base, route):
    result = subprocess.run(['curl', '--fail', '--location', '--silent', '--show-error', '--head', '--connect-timeout', '8', '--max-time', '25', base.rstrip('/') + route], capture_output=True, text=True)
    blocks = re.split(r'\r?\n\r?\n', result.stdout.strip())
    headers = blocks[-1].lower()
    control = re.search(r'^cache-control:\s*(.+)$', headers, re.M)
    allowed = control and not re.search(r'\b(?:no-store|private)\b', control[1]) and re.search(r'\b(?:max-age=\d+|no-cache|must-revalidate)\b', control[1])
    if result.returncode or not allowed:
        return f'{route}: HTTP caching is not ready ({control[1].strip() if control else "unavailable"})'
    return None


if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('--base-url', default='https://www.behop.cn')
    args = parser.parse_args()
    with concurrent.futures.ThreadPoolExecutor(max_workers=3) as pool:
        failures = [error for error in pool.map(lambda route: check(args.base_url, route), ROUTES) if error]
    for error in failures:
        print(error, file=sys.stderr)
    if failures:
        sys.exit('Retirement deployment blocked: configure and verify HTML browser caching first.')
    print('Live HTML allows ordinary browser caching; worker retirement may deploy.')
