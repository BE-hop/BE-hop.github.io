# 历史证据：非现行规范

2026-10-23整理前的原文。当前规范以根文档地图为准；本文中的缓存、动效与质量参数不再作为实施指令。

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

## 2026-08-06 - Homepage wheel snapping is boundary-aware (superseded 2026-10-17)

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

## 2026-10-16 - 首屏交付与缓存分离

- 决策：首页、Works、作品集、AI Tools、论坛在构建时合并独立主 CSS 与有序 defer JS；头部 async `sw-registration.js` 独立注册 worker 并处理加载中断。正文默认可见，不依赖动效初始化。
- 受控导航流立即交付，完整读完后才入缓存；已交付的流无法替换成旧 HTML，中断提供手动重试。1秒缓存回退适用于等待网络响应头，显式刷新不参与旧缓存竞速；冷 CSS/JS 和论坛数据只对等待响应头设8秒上限，正文不主动截断。
- 证据：`npm run check`、`test/site_runtime_test.mjs`、`test/asset_version_test.py` 与 Chrome 本地故障预览（主交互包503时正文和四个入口仍存在）。
- 失效条件：导航/发布架构、缓存策略或响应流机制改变时重新核验；本地通过不证明公网 CDN 或地区访问达标。

## 2026-10-16 - CDN缓存与证书修复边界

- 决策：Cloudflare公开HTML按源站TTL缓存，当前10分钟；浏览器重新验证；更新文件、论坛快照、API及微信回调绕过。哈希目录一年缓存并对>=400设No store。
- 证据：后台三条Active规则、HTTP→HTTPS 301、首页CF-Cache-Status HIT、缺失哈希资源404/BYPASS。免费UI自定义TTL最低2小时，不使用其缓存HTML。
- 约束：www/wechat*有现存Worker；DNS-only会绕过CDN防护并影响回调，证书修复需单独授权与维护窗口。未切换DNS，未开启Full(strict)。
- 失效条件：计划等级、源站头、路由、域名或Worker改变时重查；HIT不证明访问端完整下载或多地区性能达标。

## 2026-10-17 - 清晰母版与非阻塞阅读

- 决策：源图只备份不有损改写；构建按照片82/展板90生成最多2560px WebP，质量与尺寸政策参与指纹。阅读器按画布与DPR加载清晰图，翻页不等待增强图；首页恢复原生滚动。
- 证据：校验188项原始备份；线上阅读器768px图显示1056px；当前链路首页HTML曾耗时16.62秒，与旧8秒正文中断规则冲突。回归测试验证慢于响应头期限的正文仍完整交付。
- 失效条件：替换图片管线、阅读器或缓存体系时重验；网络链路耗时不代表所有地区。
