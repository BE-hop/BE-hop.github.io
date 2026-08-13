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
- Production URL: `https://be-hop.github.io`
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
- 首页 Hero 使用内联 SVG 的外框、多层矩形深度框、内框和四组对应边纵深线形成连续 Grid Scan 隧道，并由 CSS 提供 `#06b6d4` 扫描框与局部光源；不得改回多个独立 CSS 平面相互旋转，也不得引入 React、WebGL 或持续高强度动画。指针监听必须绑定整个 Hero，经过标题和 CTA 时不得中断。`hero.background_image` 仅作为低透明度空间深度层，原 `img/portfolio/hero-landscape.jpg` 保留为 Works Hero。
- 首页深色 AI Tools 与暖白 Works 之间必须使用深石墨、深绿、雾灰绿到暖白的连续过渡，并让低透明绿色网格延续进 Works；避免直接黑白切割或只插入一条短渐变带。
- 桌面左侧章节导航必须根据当前 `data-nav-tone` 切换深浅对比并同步 `aria-current`。精确指针桌面端可在 Hero 和长章节边界使用滚轮吸附到下一/上一 `data-home-section`；长章节内部、移动端、触屏和 `prefers-reduced-motion` 必须保留原生滚动。

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
