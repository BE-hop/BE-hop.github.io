# Durable Decisions

## 2026-07-10 - Local editor and publishing boundary

- Decision: provide a structured local editor with advanced source views and session-scoped publishing.
- Evidence: owner-approved system upgrade plan and existing local Ruby editor.
- Invalidation: owner requests a hosted CMS or changes the deployment model.
- Consequence: pre-existing dirty files are never auto-staged; publishing requires preflight and confirmation.

## 2026-07-10 - English-first public experience

- Decision: first visits render English; Chinese remains a complete switchable mirror and the preference is remembered locally.
- Evidence: owner selection and career positioning memory.
- Invalidation: owner changes target audience or language strategy.

## 2026-07-10 - Locally compiled Tailwind

- Decision: Tailwind 3.4.17 is compiled into a committed static stylesheet; production pages do not use the Tailwind CDN.
- Evidence: browser audit showed the runtime theme configuration was ignored and custom colors/gradients failed.
- Invalidation: migration to another design system or build pipeline.

## 2026-08-05 - Homepage motion remains progressive enhancement

- Decision: homepage interaction uses native CSS and JavaScript, with no framework or animation runtime.
- Evidence: homepage V1 implementation in `index.html`, `css/portfolio.css`, and `js/portfolio.js`; `npm run check` passed.
- Invalidation: an explicit site-wide frontend architecture decision introduces a maintained runtime.
- Consequence: preserve reduced-motion fallback, keyboard-accessible filtering, and the four existing Hero actions in future homepage work.

## 2026-08-06 - Works and AI use one shared showcase system

- Decision: homepage, Works, AI Tools, and both detail layouts share `showcase-system.css` and `showcase-system.js`; Works uses the original forest green over a warm editorial base, while AI uses graphite and ice cyan with distinct typography.
- Evidence: Jekyll build and live browser checks at desktop, 768px, and 390px verified the shared system, filtering, responsive fallbacks, and both detail templates.
- Invalidation: the site adopts a new maintained frontend runtime or the owner explicitly replaces the Works/AI visual direction.
- Consequence: new collection items continue using existing `cover`, `order`, `featured`, and status fields; ReactBits remains an interaction reference only, and all motion must degrade under `prefers-reduced-motion`.

## 2026-08-06 - Homepage Hero is a code-native spatial grid

- Decision: the homepage identity uses an inline SVG rectangular tunnel made from an outer frame, eight nested depth frames, an inner frame, and four groups of edge-matched rays; CSS adds a `#06b6d4` depth-scan frame and a pointer light bound to the whole Hero. `hero.background_image` remains only as a very low-opacity depth layer, while `img/portfolio/hero-landscape.jpg` remains the Works Hero.
- Evidence: the owner rejected intersecting CSS planes and requested the provided ReactBits Grid Scan form; direct browser comparison showed that the reference uses a nested rectangular tunnel. Local browser checks confirmed clean non-crossing lines and continuous pointer updates while the pointer is over headline content.
- Invalidation: the owner explicitly selects another homepage identity system or the site adopts a maintained visual runtime.
- Consequence: preserve the neutral graphite base, one ice-cyan AI accent, whole-Hero pointer tracking, static reduced-motion fallback, and the deep-green bridge into Works; do not reintroduce independently rotated grid planes or make a generated bitmap dominant.

## 2026-08-06 - Homepage wheel snapping is boundary-aware

- Decision: desktop fine-pointer wheel input snaps from the Hero and from the end/top boundary of long homepage sections to the adjacent `data-home-section`; it does not intercept normal scrolling inside long sections. The left chapter rail follows `data-nav-tone` and synchronizes `aria-current` through the same scroll-state calculation.
- Evidence: live browser checks snapped Hero `0 → 800`, preserved native scrolling inside AI Tools, and snapped the AI boundary to Works at `2182`; the rail changed from light-on-dark to dark-on-light at the Works boundary.
- Invalidation: homepage sections become viewport-sized slides, the owner requests fully native scrolling, or the navigation architecture changes.
- Consequence: keep the behavior desktop-only, disable it for touch and `prefers-reduced-motion`, and mark any future nested scroll surface with `data-native-scroll`.

## 2026-08-06 - Brand depth and title media masks remain text-native

- Decision: the shared `BEhooop` brand uses CSS pseudo-element extrusion plus small pointer-driven 3D rotation in `site-nav.css` / `site-nav.js`; homepage Hero lines use animated white-to-ice-cyan backgrounds clipped to real text while retaining the existing first-entry mask reveal.
- Evidence: direct comparison with ReactBits Depth Text and Masked Heading established the face/extrusion and media-inside-glyph patterns. Browser checks confirmed synchronized pseudo content on homepage, Works, and Blog, and active title animation after switching the document to Chinese.
- Invalidation: the global navigation is replaced, the owner selects a static identity, or homepage headings stop using bilingual text attributes.
- Consequence: keep actual readable text in the DOM, generate decorative depth only with pseudo-elements, update the pseudo copy after language mutation, and disable pointer/tide motion under `prefers-reduced-motion`.

## 2026-08-06 - Production and visual versions use separate branches

- Decision: `master` remains the sole GitHub Pages production source, `archive/visual-v1` preserves the pre-redesign snapshot, and `codex/visual-v2` remains the maintained V2 design branch.
- Evidence: `.github/workflows/jekyll.yml` deploys only pushes to `master`; both version branches were created from the latest remote production baseline before V2 was published.
- Invalidation: the Pages workflow changes its source, preview deployments are introduced, or the owner replaces branch-based visual versioning with a runtime theme switch.
- Consequence: publish a validated version by moving its commit onto `master`; restore an archived visual by creating a new commit from current `master`, not by merging an ancestor branch or force-pushing history.
