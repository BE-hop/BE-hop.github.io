# LIFE Project Entry

本项目属于 LIFE 的 `express` 分类。进入项目时先阅读 `../../AGENTS.md`、`../AGENTS.md`、`../../README.md`、`../README.md` 和本项目 README，再遵循下方网站专属规则。禁止无任务边界的递归扫描；LIFE 根级安全与保留用户改动规则不可被覆盖。

# AGENTS.md

This repository is a personal Jekyll/GitHub Pages site for BEhop Experience. Follow these instructions when working here as Codex or another AI coding agent.

## Instruction Order And Defaults

1. Follow the nearest applicable `AGENTS.md`; this root file is the canonical project policy.
2. Read `.codex/memory.md` before substantive work, then open only the linked memory files relevant to the task.
3. For career-facing content, also follow `docs/career-content-strategy-memory.md` and its dated evidence rules.
4. Communicate with the site owner in Chinese. Keep code, file names, schema keys, and public professional content English-first unless a Chinese mirror is required.
5. Preserve unrelated working-tree changes. Never stage, publish, or rewrite files outside the task scope.

The public site defaults to English, remembers the visitor's language choice locally, and retains complete Chinese mirrors where the page supports both languages.

## Project Overview

- Site type: Jekyll 3.x static site, deployed through GitHub Pages.
- Owner communication is Chinese; public professional content is English-first with Chinese mirrors.
- Main focus: personal blog, AI/design knowledge base, portfolio projects, AI product pages, gallery pages, and a small forum experience.
- Production URL: `https://www.behop.cn` (the GitHub default domain redirects to the custom domain)
- Core config: `_config.yml`

Important content areas:

- `_posts/`: blog posts. Bilingual posts use matching Chinese and English files.
- `_layouts/` and `_includes/`: Liquid templates and shared page fragments.
- `_projects/`: portfolio/project collection.
- `_ai_products/`: AI product collection.
- `_ai_gallery/`: AI gallery collection.
- `forum/`, `js/forum*.js`, `assets/data/forum-*.json`: forum pages, client behavior, and approved data snapshots.
- `less/`, `css/`, `js/`: legacy frontend assets.
- `scripts/`: local preview and forum data maintenance scripts.
- `pwa/manifest.json` and `sw.js`: PWA configuration and service worker.

## Run Commands

Prefer the repository preview script over direct Jekyll commands:

```bash
./scripts/local-preview.sh
```

Useful variants:

```bash
PORT=4001 ./scripts/local-preview.sh
./scripts/local-preview.sh build
./scripts/local-preview.sh static
```

NPM scripts:

```bash
npm run start
npm run dev
npm run forum:metrics
npm run forum:sync-comments
npm run forum:sync-topics
```

Notes:

- `./scripts/local-preview.sh` installs missing gems into `/tmp/behop-bundle` by default and avoids common system Ruby permission/gem-path issues.
- Do not prefer `bundle exec jekyll serve` directly unless there is a specific reason; the README documents known `commonmarker` and system Ruby problems.
- Static preview must serve `_site/`, not the repository root. Serving the root with `python3 -m http.server` exposes unrendered Liquid/front matter.
- If port `4000` is occupied, use `PORT=4001 ./scripts/local-preview.sh`.

## Validation

For most site/content/template changes, run:

```bash
./scripts/local-preview.sh build
```

For visual or navigation changes, also run a local preview and check the affected pages:

```bash
./scripts/local-preview.sh
```

Common URLs to inspect:

- `http://127.0.0.1:4000/`
- `http://127.0.0.1:4000/blog/`
- `http://127.0.0.1:4000/blog/en/`
- `http://127.0.0.1:4000/works/`
- `http://127.0.0.1:4000/forum/`
- `http://127.0.0.1:4000/behop-ai-product/`

For forum metrics after approved data changes:

```bash
npm run forum:metrics
```

Before handing off a substantive change, prefer the consolidated quality gate:

```bash
npm run check
```

### Homepage Interaction System

- The homepage keeps its Jekyll-first architecture: `index.html` supplies semantic interaction hooks, `css/portfolio.css` owns visual states, and `js/portfolio.js` owns progressive enhancement.
- Do not add a frontend framework or animation library for homepage effects without an explicit architecture decision.
- Homepage motion must respect `prefers-reduced-motion`; preserve keyboard focus, bilingual text switching, and accessible filter state whenever interaction behavior changes.
- Verify the Hero at a narrow mobile viewport as well as desktop: all four actions must remain visible without horizontal clipping.

### Visual Version Branches

- `master` is the production source and is the only branch watched by the GitHub Pages workflow.
- `archive/visual-v1` is the read-only pre-redesign snapshot; never force-push or continue feature work on it.
- `codex/visual-v2` is the maintained V2 visual branch. Validate it before merging or fast-forwarding it to `master`.
- A historical archive branch cannot be merged forward to undo newer commits. Restore selected visual files from the archive onto a fresh branch based on current `master`, then validate and merge that restoration commit.
- Fetch `origin/master` immediately before publishing because the forum synchronization workflow can advance it independently. Never force-push production or overwrite approved forum snapshots.

### 全站作品展示视觉系统

- 首页、Works、AI Tools 及两类详情模板共用 `css/showcase-system.css` 与 `js/showcase-system.js`；原有 `portfolio.css`、`portfolio.js`、`behop-ai.css` 和 `behop-ai.js` 继续负责页面专属行为。
- 共享导航品牌 `BEhooop` 的 Depth Text 结构位于 `_includes/nav.html`，视觉位于 `css/site-nav.css`，全站指针增强与语言同步位于 `js/site-nav.js`。保持正面文字可访问，不复制可朗读 DOM 文本；深度副本只能由伪元素生成。
- 正文字体与导航统一使用 Manrope；Works 标题使用 Playfair Display；AI 标题使用 Space Grotesk。仅加载实际使用的 `400/500/600/700` 子集，Works 字体只保留 `500/600`。
- `theme-works` 使用暖白编辑背景和原站森林绿主色；`theme-ai` 使用深石墨与单一冰青强调色。两类页面保持各自清楚的主题边界，不在单一页面并置多个高饱和强调色。
- ReactBits 仅作为表达原则参考：Masked Heading 对应首页首次标题揭示，Scroll Reveal 对应章节标题，Grid Scan 对应 AI 背景，Magic Bento 与 Spotlight Card 对应 AI 工具卡，Glare Hover 对应 Works 卡片，Scroll Stack 对应 `featured: true` 项目。不得引入 React 运行时或 Electric Border。
- 首页 Masked Heading 除首次揭示外，还使用字形内的白色—冰青流动纹理；动画必须直接作用于保留 `data-zh` / `data-en` 的 `.hero-title-line`，不得用图片文字替代，以保证语言切换和可访问性。
- AI 工具继续通过现有集合字段和 `order` / `featured` 自动决定 Bento 权重；Works 页最多优先展示前三个 `featured: true` 项目，其余项目进入标准网格。不新增内容 schema。
- 所有聚光、扫光、扫描、揭示和堆叠效果必须保留触屏、键盘及 `prefers-reduced-motion` 静态降级；移动端 Scroll Stack 必须恢复普通纵向流。
- Scroll Reveal 不能依赖大型内容区的固定可见比例阈值；完整展板等超长图组只要进入观察范围即必须显示，避免图片区保持隐藏。
- 首页 Hero 使用内联 SVG 的外框、多层矩形深度框、内框和四组对应边纵深线形成连续 Grid Scan 隧道，并由 CSS 提供 `#06b6d4` 扫描框与局部光源；不得改回多个独立 CSS 平面相互旋转，也不得引入 React、WebGL 或持续高强度动画。指针监听必须绑定整个 Hero，经过标题和 CTA 时不得中断。`hero.background_image` 仅作为低透明度空间深度层，原 `img/portfolio/hero-landscape.jpg` 保留为 Works Hero。
- 首页深色 AI Tools 与暖白 Works 之间必须使用深石墨、深绿、雾灰绿到暖白的连续过渡，并让低透明绿色网格延续进 Works；避免直接黑白切割或只插入一条短渐变带。
- 桌面左侧章节导航必须根据当前 `data-nav-tone` 切换深浅对比并同步 `aria-current`。全端使用原生滚动，不再注册阻塞滚轮事件或自动章节吸附；章节导航仍可点击跳转。

If a narrowly scoped change does not require every check, run the relevant subset and state exactly what was skipped. A successful Jekyll build alone is not sufficient for editor, schema, generated-CSS, or publishing changes.

Forum sync scripts require secrets and should not be run casually:

- `FORUM_COMMENT_SUBMIT_URL`
- `FORUM_TOPIC_SUBMIT_URL`
- `SUPABASE_SERVICE_ROLE_KEY`

Never commit or print service role keys.

## Code Style

- Match the existing style in the file being edited.
- Jekyll templates use Liquid includes/layouts; keep shared layout changes inside `_layouts/` or `_includes/` when behavior is reused.
- Markdown posts and collection items should keep readable YAML front matter and concise section structure.
- JavaScript in `scripts/*.mjs` uses ESM imports, `const`/`let`, async functions, and two-space indentation.
- Existing browser JavaScript is plain JS; avoid introducing a build framework.
- CSS is a mix of hand-written CSS and generated legacy assets. Keep changes scoped and avoid broad rewrites.
- LESS sources live in `less/`; generated CSS lives in `css/`. Be careful before editing generated/minified files by hand.
- Prefer ASCII punctuation in file names, slugs, YAML keys, commands, and code.

## Content Rules

Preserve the site's professional, portfolio-oriented identity.

- The `Works / 项目案例` area should present real design projects, concept studies, computational design experiments, roles, tools, process, and reflections.
- It is acceptable to show skills, project experience, service capabilities, and contact paths.
- Avoid turning the site into a hard-selling service funnel.
- Do not add pricing packages, limited-time offers, exaggerated guarantees, or aggressive conversion copy.
- Favor verifiable project context: background, design problem, strategy, role, tools, output, constraints, feedback, and next steps.

## Local Content Editor And Maintainability

The site owner prefers agent-managed design/code changes and owner-friendly content maintenance. Preserve the local editing workflow:

- The local content editor is started with `ruby scripts/content-editor.rb` and opens at `http://127.0.0.1:4567/`.
- The editor is visual-first: the rendered Jekyll page is the primary editing surface. In Edit mode, text is edited in place, images can be selected or pasted from the clipboard, and Markdown opens in a focused dialog. Preview mode must restore normal site navigation and interactions.
- The local preview bridge is loaded only when `jekyll.environment != production`, served from the editor at `127.0.0.1:4567`, and must never appear in a production build.
- Visual edits remain drafts until the owner selects Save All. Multi-record saves must validate first and roll back all content and finalized images if any record fails.
- The editor is local-only and must not be positioned as an online admin panel or deployed backend.
- The editor covers Site Settings, Homepage, Works, AI Tools, AI Gallery, Archive, About, and bilingual Blog pairs.
- The editor intentionally does not cover AI Digest moderation or approved-data synchronization.
- Homepage owner-editable text and images live in `_data/homepage.yml`.
- Global owner-editable settings live in `_data/site_settings.yml`; About content lives in `_data/about.yml`.
- Works content lives in `_projects/*.md`.
- Works 中由 PDF 导出的完整作品集页面统一命名为 `portfolio-page-*.jpg`；`_layouts/project.html` 会将这类图面按完整比例跨栏展示。加入整页图面时，应移除图组中已被该页面包含的重复单图引用，但不擅自删除源媒体。
- 手工提供的 JPG 展板也沿用 `portfolio-page-*.jpg` 约定；横版和竖版均按原始比例单列展示，不裁切成卡片缩略图。
- Rhino、Grasshopper 等技术过程截图可作为 `portfolio-page-*` 图面加入项目；说明应明确其为方案/深化工作证据，并避免将软件界面误表述为最终设计成果。
- 作品集总览位于 `works/portfolio/`，以规划、景观、空间与建筑三本双语阅读器组织；首屏将克制标题与三本书合并在森林绿 Hero 中。三本封面使用统一硬壳结构与可见书脊、纸页前口、白色图面内框，同时以规划暖陶棕、景观苔绿、空间与建筑蓝灰区分方向；主标题中英文使用明确两行节点，避免孤字或孤词。桌面放大镜保持小尺度并使用双层金属框、玻璃高光、连接铆钉和短手柄，移动端隐藏。阅读器固定 2:1 跨页，图面不裁切、不重新配对；窄于 2:1 的图面使用独立 `-wide.jpg` 衍生图，原图完整居中并左右补纯白画布，源文件保留。
- AI Tools content lives in `_ai_products/*.md`.
- AI Gallery content lives in `_ai_gallery/*.md`; bilingual Blog content lives in paired `_posts/*.md` files.
- Archive content lives in `_data/worksarchive.yml`.
- Owner-replaceable images should stay under the explicit editor media roots documented in `docs/site-content-map.md`.
- If an agent changes the content schema, front matter fields, image fields, or page data flow for these areas, update `scripts/content-editor.rb`, `content-editor/`, and `docs/site-content-map.md` in the same work.
- Keep editor writes restricted to explicit content and image paths. Never allow it to write secrets, `.env`, `.git`, `_site`, `node_modules`, caches, or files outside the repository.
- After each substantive site/content workflow, proactively report reusable process or memory candidates to the site owner.
- Do not write Codex long-term memory updates unless the site owner explicitly grants permission for that memory write.

The site owner has granted ongoing permission to maintain repository-local project memory under `.codex/` after substantive work. This does not grant permission to write Codex global memory. Repository memory must record durable facts, decisions, or verified workflows only; do not append transient task logs.

Editor publishing rules:

- The editor may publish only files changed during its current session and only inside its explicit content/media allowlist.
- Files already dirty when the editor starts are baseline conflicts and must never be staged automatically.
- Publishing must run build and audit checks, show the exact file list, require a second confirmation, and refuse remote divergence.
- Never auto-pull, auto-rebase, force-push, or stage the entire working tree from the editor.
- Keep `content-editor/`, `.content-editor/`, `.codex/`, internal docs, tests, and career evidence out of the generated site.

Blog publishing rules are documented in `README_AI_BLOG_PUBLISH.md`. For bilingual posts:

- Create two files in `_posts/`.
- Use `YYYY-MM-DD-<slug>.md` for Chinese and `YYYY-MM-DD-<slug>-en.md` for English.
- Keep date/topic/section order aligned.
- Include `layout`, `title`, `subtitle`, `date`, `author: liu.ruyuan`, `lang`, and `tags`.
- Add cross-links near the top of each article.
- For AI-assisted design practice reviews, distinguish verified work already used in projects from experimental or planned Agent capabilities. Organize evidence around inputs, transformations, outputs, evaluation criteria, and known limits rather than presenting generated images as self-validating results.
- The Q1 2026 AI design review uses `_includes/ai-q1-evidence.html` for its English evidence groups; keep its group order, numeric assets, responsive `contain` presentation, and aligned Chinese article presentation when revising the post.

For one essay published across multiple site surfaces:

- Treat the paired bilingual `_posts/` files as the canonical full article and keep their structure aligned.
- Store article-specific media under `img/posts/<slug>/` with stable, web-sized filenames.
- Use a static topic in `js/forum-data.js` as a concise discussion entry, and link it to both canonical blog editions instead of duplicating every figure and paragraph.
- Keep long bilingual forum titles fully visible below the fixed navigation; validate the expandable mobile topic Hero at 390px.
- Keep About copy in `_data/about.yml` and `_includes/about/*.md` limited to durable professional positioning distilled from the article.
- Do not manually edit `assets/data/forum-topics-approved.json`; approved forum snapshots remain bot-managed generated data.

## Career Trend Sources And Strategy Memory

Before changing homepage positioning, `Works / 项目案例`, AI product pages, gallery content, blog strategy, or professional/career-facing copy, read:

- `docs/career-content-strategy-memory.md`
- The latest `career-trend-file/*/index.md`
- The relevant dated `career-trend-file/*/analysis.md` files when a change depends on career-trend evidence

When the site owner uploads new job posts, career screenshots, PDFs, Word documents, PPT decks, Markdown files, images, or similar source files for analysis:

- Create a dated batch under `career-trend-file/YYYY-MM-DD/`.
- Store raw files under `career-trend-file/YYYY-MM-DD/sources/`.
- Keep raw source files local-only; `career-trend-file/**/sources/` is ignored by Git.
- Create or update `career-trend-file/YYYY-MM-DD/index.md` with file names, types, hashes, source notes, analysis status, and analysis references.
- Compare new file hashes against prior indexes and do not re-analyze files already marked `analyzed` unless explicitly requested.
- Analyze only newly uploaded or previously unanalysed files.
- Write batch findings to `career-trend-file/YYYY-MM-DD/analysis.md` and clearly state which sources support the conclusions.
- Sync durable website-positioning conclusions into `docs/career-content-strategy-memory.md`.
- Keep public website content English-first unless a Chinese mirror is specifically requested.

Communicate plans, tradeoffs, and implementation summaries with the site owner in Chinese by default.

## Git And File Hygiene

- This repo may contain generated output (`_site/`) and historical assets. Do not delete broad directories unless explicitly asked.
- `.gitignore` ignores broad patterns such as `*.lock` and `*.sh`, but tracked files like `Gemfile.lock`, `package-lock.json`, and `scripts/local-preview.sh` are important. Do not remove or regenerate them casually.
- Avoid changing unrelated files.
- Do not commit secrets, local caches, `.bundle/`, `vendor/`, `node_modules/`, `.jekyll-cache/`, or service credentials.
- Service worker/browser cache can make local preview look stale. If rendered HTML is correct but the browser looks wrong, hard-refresh and clear the `127.0.0.1:4000` service worker/site data.

## Troubleshooting

- If a page starts with `---` or contains raw `{{ site.baseurl }}`, it is being served without Jekyll. Use `./scripts/local-preview.sh`.
- If build fails with missing `commonmarker`, use the local preview script rather than direct Bundler commands.
- If native Ruby gem extensions are broken, try:

```bash
rm -rf /tmp/behop-bundle /tmp/bundle-home
./scripts/local-preview.sh
```

- If RubyGems is unreachable, configure a mirror temporarily:

```bash
bundle config set --local mirror.https://rubygems.org https://gems.ruby-china.com
./scripts/local-preview.sh
```

Then remove it when no longer needed:

```bash
bundle config unset --local mirror.https://rubygems.org
```

### 外部图文长文导入博客

外部内容包以作者正文及其插图位置为准，转为同日期的中英文文章，配图复制到 `img/posts/<slug>/` 并压缩为网页格式。概念图保留“定性模型、非统计结果”的图注，生成式封面和插画明确其性质；英文版复用中文原图时须在图注说明，并以英文正文解释图意。文章样式限定在自身容器，图片按原比例呈现、可打开原图，宽表格支持横向滚动。发布前核对双语结构、配图顺序、索引与互链，隔离无关工作区改动。

### 作品集入口与标题维护

Works 页的 `.portfolio-entry` 使用三册首图的低透明度预览和明确的双语查看按钮；整个卡片保持单一链接、键盘焦点与触屏可用。入口样式在 `css/portfolio.css`，内页编辑式双行标题在 `css/portfolio-books.css`；标题与引导文案继续通过原双语属性切换。移动端将按钮与预览放在文案下方，减少动态模式关闭悬停过渡。

### 项目案例 Hero 与进入引导

Works Hero 使用左侧双行标题、右侧设计说明及底部翻阅链接，保留原景观底图。页面专属样式与脚本为 `css/works-intro.css`、`js/works-intro.js`。正常从页顶进入后停留 1.5 秒，再以 1.9 秒缓动下移至 Hero 尾部与完整作品集入口同时可见的位置；入口置于分类筛选之前。滚轮、触屏、指针或键盘操作立即取消自动引导；历史返回、锚点访问、编辑器 iframe、减少动态模式不自动下移。底部链接始终保留原生锚点回退。

作品集总览位于 `works/portfolio/`，以规划、景观、空间与建筑三册阅读器展示；页序由页面数组维护，封面同步首图，保留旧源媒体。阅读器保持完整图面、翻页、键盘导航与移动端降级；正文配图及首屏均不新增框架。

CI 使用 Ruby 3.1；调用同时接收位置哈希与关键字参数的方法时，测试必须用显式 `{ ... }` 包住位置哈希，避免本地旧 Ruby 与 CI 的参数解析差异。

### 轻量图片、离线缓存与发布版本

网页源图作为清晰母版保留；`scripts/optimize-images.py --backup <仓库外目录>` 仅备份原图及SHA256清单，不再有损改写源图。`scripts/jekyll-with-assets.rb` 显式注册 Jekyll post_write 钩子并统一运行 `scripts/prepare-site.py`，在构建目录生成按内容哈希命名的480/768/1280/1920/2560px WebP（不放大源图，照片质量82、展板及PNG质量90）与响应式引用，源内容字段不变；编辑器预览、上传后的构建及发布使用同一路径，不向编辑器扩大可写范围。Python需安装 `requirements-site.txt`。原图备份不得进入仓库或站点。

构建产物 `release.json` 与页面meta记录版本和提交；`sw.js`使用发布版本隔离缓存，在线页面尝试新内容、慢网1秒回退已访问页面，静态资源按文件内容版本缓存，图片缓存最多60MB/100项。旧main-*缓存一次迁移，新版本由用户点击提示切换；页尾支持检查更新和仅清理本站缓存。语言设置保留，未访问的图片不承诺离线可用。本地默认不注册SW，`?offline-test=1`仅供离线验收。

正式发布统一走Actions构建、审计与部署；论坛快照同步完成后触发同一工作流。站点时区固定Asia/Shanghai，已发布博客路径使用显式permalink，旧路径保留跳转。隐藏条目仅从列表隐藏，不视为访问控制。

响应式图片保留 `data-original-src` 用于本地编辑器绑定源字段；替换图片草稿时清除旧 `srcset`，避免浏览器继续显示旧缩略图。

### 关键入口在资源请求失败时的降级

按2026-10-16凌晨的Jekyll结构保留轻量HTML、独立CSS/JS与原有双语作品数据；不在整页内联CSS、JS或Base64展板。CSS/JS查询版本按文件内容哈希生成，论坛同步不再让未变化资源全部失效。受控导航优先尝试网络；1秒内尚未收到响应头且有缓存时显示缓存。收到响应头即交付响应流，正文失败时提供手动重试；8秒仅限制等待响应头，不主动截断慢速正文；完整正文下载成功后才写入缓存，不能仅依据200响应头。图片保留响应式尺寸和失败提示及重试；首次离线预热仅请求当前HTML。

关键页面的独立样式与有序同步脚本由 `scripts/bundle-page-assets.py` 各合并为一个内容哈希文件，以减少并发冷请求，应用代码不回填HTML。`js/navigation-repair.js` 是一次性头部恢复引导：旧worker等待时可激活修复，只有文档仍未完成且无表单时才重载一次；已阅读页面、表单及后续正常升级保持手动切换。不得因论坛快照变化重置静态资源版本。

作品集使用768px轻量预览，并按实际画布宽度与屏幕像素密度加载最高2560px清晰图；预览、清晰图及失败重试均不得锁住翻页。只预取下一页轻量图；大图入口始终可用，过时下载不得覆盖新页。

导航缓存查找必须先查当前发布桶，再回退上一发布桶；显式刷新必须尝试完整新HTML，不能再次被1秒旧缓存竞争抢先。网络失败仍保留缓存兜底。

### 首次加载、流式导航与性能排查

正式入口统一为 `https://www.behop.cn`；canonical、sitemap 和 robots 跟随站点配置。首页、Works、作品集、AI Tools 与论坛按页合并主 CSS 和有序 defer JS，缓存注册使用头部独立 async runtime。流式 HTML 必须在完整下载后才入缓存；开始交付的流不可再替换旧页面，中断由独立 runtime 提供手动重试，禁止自动循环重载。8秒冷 CSS/JS 超时不能冒充对首次未受 worker 控制请求的保护。保留默认可见正文、语言偏好、离线容量和用户主动更新规则。博客保留既有内联脚本依赖顺序，非必要广告/外部 iframe 在页面完成后接近视口再加载。

CDN、HTTPS、发布后 HTML 清理与多地区验收按 `docs/loading-performance.md` 执行；仓库构建不能证明 Cloudflare 后台已配置。使用 `python3 scripts/performance-probe.py --network-label <实际链路> --samples 5` 检查完整下载，浏览器另测 LCP/CLS，禁止把代理测试称为大陆直连或海外节点。实质修改后运行 `npm run check`。

### Cloudflare 缓存实际配置与证书维护边界

2026-10-16已在后台启用Always Use HTTPS与三条规则：公开HTML尊重源站TTL（当前10分钟，Browser bypass）、更新文件/论坛数据/Webhook绕过、内容哈希目录一年缓存且>=400不存储。免费UI自定义Edge TTL最低2小时，不得把当前策略误写为已实现5分钟。发布后清理受影响HTML，保持查询串cache key；新增其他年份文章时更新当前HTML规则范围。保留www/wechat* Worker。当前Full(strict)的源站证书前提未满足，DNS-only会影响CDN防护和Webhook，须另行明确授权并安排维护时段，不擅自切换。以 `docs/loading-performance.md` 中已应用配置覆盖此前待配置目标；多地区与浏览器性能指标仍须独立验收。

### 图片清晰度与慢网修复（2026-10-17）

母版不重复压缩，构建参数与源内容共同参与图片指纹；修改质量、尺寸后必须生成新URL。全宽首屏使用100vw，展板按正文宽度、卡片按实际布局选图；CSS背景使用高质量image-set；三册小封面单独以384px为基准，2倍屏选768px、3倍屏至多1280px，避免按整屏大图下载。阅读器清晰图异步增强，翻页使用八段轻量动画且不等待下载。HTML/CSS/JS收到响应头即交付，8秒只限制响应头等待；完整正文成功后才入缓存。图片容量索引每个worker初始化一次后增量维护，保留60MB/100项限制及用户主动升级规则。

### GitHub Pages 构建环境固定（2026-10-20）

`.github/workflows/jekyll.yml` 的构建与部署均固定 `ubuntu-24.04`，保留 Ruby 3.1 和现有依赖。禁止直接改回 `ubuntu-latest`：2026-10-19 起该标签迁移到 Ubuntu 26.04，当前固定的 `ruby/setup-ruby` 无法识别该镜像，导致 Setup Ruby 立即失败。将来升级镜像或Ruby安装Action时，须先验证平台支持及完整构建部署；安装环境失败不能归因于图片或页面代码。

### SPL 空间表达字典发布维护

SPL 工具页由 `_ai_products/spatial-prompt-lab.md` 维护，真实界面截图存于 `img/ai-products/spatial-prompt-lab/`。网页只提供双语介绍和百度网盘下载，不托管完整离线 HTML、编辑器或项目源数据。更新数量与审核状态时以 SPL 当前数据为准，区分表达候选、专业配方和已确认示例。下载区没有版本接口时显示静态可下载提示；有接口时成功查询后更新版本，失败保留静态提示。
