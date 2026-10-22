import importlib.util
import unittest
from pathlib import Path

spec = importlib.util.spec_from_file_location('media', Path(__file__).resolve().parents[1] / 'scripts/media-variants.py')
media = importlib.util.module_from_spec(spec)
spec.loader.exec_module(media)


class MediaRoles(unittest.TestCase):
    def setUp(self):
        self.site = Path('/synthetic/site')
        self.variant = {'items': [(width, f'/media/optimized/aaaaaaaaaaaaaa-{width}.webp') for width in media.WIDTHS], 'width': 3000, 'height': 1500, 'bytes': 1000000}

    def render(self, html):
        return media.transform_html(html, self.site / 'index.html', self.site, {'/img/board.jpg': self.variant})

    def test_list_is_bounded_and_no_js_fallback_preserves_image(self):
        output = self.render('<a href="/project/"><img data-media-role="card" sizes="300px" src="/img/board.jpg" alt="Project"></a>')
        self.assertNotIn('-768.webp', output)
        self.assertIn('data-lazy-srcset=', output)
        self.assertIn('<noscript><img', output)
        self.assertIn('data-original-src="/img/board.jpg"', output)
        self.assertIn('sizes="300px"', output)
        self.assertEqual(output.count('<a '), 1)

    def test_small_author_images_keep_dimensions_and_share_pixels_stay_hidden(self):
        output = self.render('<img src="/img/board.jpg" alt="Avatar" width="60" height="60">')
        self.assertIn('width="60" height="60"', output)
        self.assertEqual(self.render('<img src="/img/board.jpg" width="0" height="0">'), '')

    def test_detail_is_explicit_and_existing_links_are_not_nested(self):
        output = self.render('<img src="/img/board.jpg" alt="Design drawing">')
        self.assertIn('data-media-view href="/media/optimized/aaaaaaaaaaaaaa-2560.webp"', output)
        self.assertNotIn('-1920.webp', output)
        self.assertIn('data-media-original="/img/board.jpg"', output)
        linked = self.render('<a href="/img/board.jpg"><img src="/img/board.jpg" alt="Design drawing"></a>')
        self.assertEqual(linked.count('<a '), 1)
        self.assertNotIn('data-media-view', linked)


if __name__ == '__main__':
    unittest.main()
