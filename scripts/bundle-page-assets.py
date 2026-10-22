"""All public pages share a small base and ordered page-specific assets."""
import hashlib
import re

COMMON_CSS = {'/css/site-nav.css', '/css/local-fonts.css', '/css/image-loading.css', '/css/media-viewer.css'}
COMMON_JS = {'/js/site-nav.js', '/js/image-loading.js', '/js/media-controls.js'}


def bundle_page(site, path, text):
    destination = site / 'assets/bundles'
    destination.mkdir(parents=True, exist_ok=True)

    def bundle(pattern, extension, common):
        nonlocal text
        groups = {'base': [], 'page': []}
        originals = []
        seen = set()
        for match in re.finditer(pattern, text, re.I):
            tag, url = match[0], match[1]
            route = url.split('?')[0]
            if extension == 'js' and (route in ('/js/sw-registration.js', '/js/language-init.js') or re.search(r'\b(?:async|type\s*=)', tag)):
                continue
            if extension == 'css' and re.search(r'\bmedia\s*=', tag):
                continue
            source = site / route.lstrip('/')
            if not source.is_file():
                continue
            originals.append(tag)
            if route not in seen:
                groups['base' if route in common else 'page'].append(source.read_text())
                seen.add(route)
        if not originals:
            return
        tags = []
        for parts in groups.values():
            if not parts:
                continue
            content = ('\n;\n' if extension == 'js' else '\n').join(parts)
            filename = hashlib.sha256(content.encode()).hexdigest()[:16] + '.' + extension
            (destination / filename).write_text(content)
            tags.append(f'<link rel="stylesheet" href="/assets/bundles/{filename}">' if extension == 'css' else f'<script defer src="/assets/bundles/{filename}"></script>')
        for index, original in enumerate(originals):
            text = text.replace(original, ''.join(tags) if index == 0 else '', 1)

    bundle(r'<link\b[^>]*rel="stylesheet"[^>]*href="(/[^" ]+)"[^>]*>', 'css', COMMON_CSS)
    bundle(r'<script\b[^>]*src="(/[^" ]+)"[^>]*>\s*</script>', 'js', COMMON_JS)
    return text
