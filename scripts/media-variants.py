"""Role-based web derivatives. The content and image masters are read-only."""
import hashlib
import html
import re
import shutil
from html.parser import HTMLParser
from urllib.parse import unquote, urlsplit
from PIL import Image, ImageOps

WIDTHS = (320, 480, 640, 768, 1280, 1920, 2560)
POLICY = 'webp-v3-role-preview-72-reading-80-board-84-detail-90'


def build_variants(site, cache):
    variants = {}
    source_bytes = 0
    for parent in ('img', 'assets'):
        for path in sorted((site / parent).rglob('*')):
            if not path.is_file() or path.suffix.lower() not in ('.jpg', '.jpeg', '.png', '.webp'):
                continue
            with Image.open(path) as original:
                if getattr(original, 'n_frames', 1) > 1:
                    continue
                image = ImageOps.exif_transpose(original).convert('RGBA' if 'A' in original.getbands() or 'transparency' in original.info else 'RGB')
                detailed = 'portfolio-page-' in path.name or path.suffix.lower() == '.png'
                digest = hashlib.sha256(path.read_bytes() + f'{POLICY}-{detailed}-{WIDTHS}'.encode()).hexdigest()[:14]
                items = []
                for width in sorted({min(image.width, width) for width in WIDTHS}):
                    target = site / 'media/optimized' / f'{digest}-{width}.webp'
                    saved = cache / 'media/optimized' / target.name
                    target.parent.mkdir(parents=True, exist_ok=True)
                    if saved.is_file():
                        shutil.copy2(saved, target)
                    else:
                        quality = 72 if width <= 640 else (84 if detailed else 80) if width <= 1280 else 90
                        output = image.copy()
                        output.thumbnail((width, 10000))
                        output.save(target, quality=quality, method=5)
                        saved.parent.mkdir(parents=True, exist_ok=True)
                        shutil.copy2(target, saved)
                    items.append((width, '/' + target.relative_to(site).as_posix()))
                variants['/' + path.relative_to(site).as_posix()] = {
                    'items': items, 'width': image.width, 'height': image.height,
                    'bytes': path.stat().st_size,
                }
                source_bytes += path.stat().st_size
    return variants, source_bytes


def attr(tag, name):
    match = re.search(r'(?<![\w-])' + re.escape(name) + r'=[\"\']([^\"\']*)[\"\']', tag)
    return html.unescape(match[1]) if match else None


def put(tag, name, value):
    value = html.escape(str(value), quote=True)
    pattern = r'(?<![\w-])' + re.escape(name) + r'=[\"\'][^\"\']*[\"\']'
    if re.search(pattern, tag):
        return re.sub(pattern, lambda match: f'{name}="{value}"', tag, count=1)
    return tag[:-1].rstrip('/ ') + f' {name}="{value}">'


def resolve(value, base, site, variants):
    if not value or value.startswith(('http:', 'https:', 'data:', '//', '#')):
        return None
    path = unquote(urlsplit(value).path)
    target = site / path.lstrip('/') if path.startswith('/') else (base.parent / path).resolve()
    try:
        return variants.get('/' + target.relative_to(site).as_posix())
    except ValueError:
        return None


def limited(variant, maximum):
    items = [item for item in variant['items'] if item[0] <= maximum]
    return items or [variant['items'][0]]


class ImageLinks(HTMLParser):
    """Record existing interactive ancestors without guessing from text offsets."""
    def __init__(self, text):
        super().__init__(convert_charrefs=False)
        self.interactive = 0
        self.linked = []
        self.feed(text)

    def handle_starttag(self, tag, attrs):
        if tag in ('a', 'button'):
            self.interactive += 1
        if tag == 'img':
            self.linked.append(bool(self.interactive))

    def handle_startendtag(self, tag, attrs):
        if tag == 'img':
            self.linked.append(bool(self.interactive))

    def handle_endtag(self, tag):
        if tag in ('a', 'button'):
            self.interactive = max(0, self.interactive - 1)


def transform_html(text, path, site, variants):
    links = iter(ImageLinks(text).linked)

    def image(match):
        tag = match[0]
        linked = next(links, False)
        if attr(tag, 'width') == '0':
            return ''  # Legacy social-share pixels must not become visible masters.
        source = attr(tag, 'src')
        variant = resolve(source, path, site, variants)
        if not variant:
            return tag
        role = attr(tag, 'data-media-role') or 'content'
        maximum = {'card': 640, 'thumbnail': 480, 'hero': 768, 'reader': 768}.get(role, 1280)
        items = limited(variant, maximum)
        tag = put(put(tag, 'data-original-src', source), 'data-media-role', role)
        tag = put(tag, 'src', items[-1][1])
        tag = put(tag, 'srcset', ', '.join(f'{url} {width}w' for width, url in items))
        tag = put(tag, 'sizes', attr(tag, 'sizes') or '(max-width: 760px) calc(100vw - 32px), (max-width: 1100px) 90vw, 900px')
        if not attr(tag, 'width'):
            tag = put(tag, 'width', variant['width'])
        if not attr(tag, 'height'):
            tag = put(tag, 'height', variant['height'])
        if attr(tag, 'fetchpriority') != 'high' and not attr(tag, 'loading'):
            tag = put(tag, 'loading', 'lazy')
        tag = put(tag, 'decoding', 'async')
        if attr(tag, 'loading') == 'lazy' and role in ('card', 'thumbnail', 'content'):
            fallback = tag
            tag = put(put(tag, 'data-lazy-src', items[-1][1]), 'data-lazy-srcset', attr(tag, 'srcset'))
            tag = re.sub(r'(?<![\w-])srcset="[^"]*"', '', tag)
            tag = put(tag, 'src', 'data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=')
            tag += '<noscript>' + fallback + '</noscript>'
        if role == 'content' and not linked and attr(tag, 'alt'):
            full = variant['items'][-1][1]
            return f'<a class="media-detail-link" data-media-view href="{full}" data-media-original="{html.escape(source, quote=True)}" data-media-size="{variant["width"]} × {variant["height"]} · {variant["bytes"] / 1048576:.1f} MB">{tag}</a>'
        return tag

    text = re.sub(r'<img\b[^>]*>', image, text, flags=re.I)

    def spread(match):
        tag = match[0]
        source = attr(tag, 'data-src')
        variant = resolve(source, path, site, variants)
        if not variant:
            return tag
        reading = limited(variant, 1280)
        small = limited(variant, 768)[-1][1]
        tag = put(put(tag, 'data-src', reading[-1][1]), 'data-src-small', small)
        tag = put(put(tag, 'data-full-src', variant['items'][-1][1]), 'data-original-src', source)
        return put(tag, 'data-srcset', ', '.join(f'{url} {width}w' for width, url in reading))

    text = re.sub(r'<span\b[^>]*data-book-spread[^>]*>', spread, text)
    # Inline backgrounds also cap density; mobile never requests a 2560px background.
    def background(match):
        def url(value):
            variant = resolve(value[2], path, site, variants)
            if not variant:
                return value[0]
            items = limited(variant, 1280)
            small = limited(variant, 768)[-1][1]
            return f"image-set(url('{small}') 1x, url('{items[-1][1]}') 2x)"
        return re.sub(r'url\(([\"\']?)([^)\"\']+)\1\)', url, match[0])
    return re.sub(r'<[^>]+\sstyle="[^"]*"[^>]*>', background, text)


def transform_css(text, path, site, variants):
    def replace(match):
        variant = resolve(match[2], path, site, variants)
        if variant:
            cap = 480 if path.name == 'portfolio-books.css' else 1280
            base = 240 if cap == 480 else 768
            items = [item for item in limited(variant, cap) if item[0] >= min(base, variant['width'])]
            return 'image-set(' + ', '.join(f'url("{url}") {width / min(base, variant["width"]):.3f}x' for width, url in items) + ')'
        if match[2].startswith(('data:', 'http:', 'https:', '//', '#')):
            return match[0]
        raw = urlsplit(match[2]).path
        font = site / raw.lstrip('/') if raw.startswith('/') else (path.parent / raw).resolve()
        if font.is_file() and font.suffix in ('.woff2', '.woff', '.ttf'):
            return 'url("/' + font.relative_to(site).as_posix() + '?v=' + hashlib.sha256(font.read_bytes()).hexdigest()[:12] + '")'
        return match[0]
    return re.sub(r'url\(([\"\']?)([^)\"\']+)\1\)', replace, text)
