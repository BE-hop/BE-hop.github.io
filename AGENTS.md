# AGENTS.md

This repository is a personal Jekyll/GitHub Pages site for BEhop Experience. Follow these instructions when working here as Codex or another AI coding agent.

## Project Overview

- Site type: Jekyll 3.x static site, deployed through GitHub Pages.
- Primary language/content: Chinese first, with selected English mirrors.
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
- The editor is local-only and must not be positioned as an online admin panel or deployed backend.
- The editor covers Homepage, AI Tools, Works, and Archive.
- The editor intentionally does not cover Blog, AI Digest, or About unless the site owner asks for a future expansion.
- Homepage owner-editable text and images live in `_data/homepage.yml`.
- Works content lives in `_projects/*.md`.
- AI Tools content lives in `_ai_products/*.md`.
- Archive content lives in `_data/worksarchive.yml`.
- Owner-replaceable images should stay under `img/portfolio/homepage/`, `img/portfolio/real-works/`, or `img/ai-products/`.
- If an agent changes the content schema, front matter fields, image fields, or page data flow for these areas, update `scripts/content-editor.rb`, `content-editor/`, and `docs/site-content-map.md` in the same work.
- Keep editor writes restricted to explicit content and image paths. Never allow it to write secrets, `.env`, `.git`, `_site`, `node_modules`, caches, or files outside the repository.
- After each substantive site/content workflow, proactively report reusable process or memory candidates to the site owner.
- Do not write Codex long-term memory updates unless the site owner explicitly grants permission for that memory write.

Blog publishing rules are documented in `README_AI_BLOG_PUBLISH.md`. For bilingual posts:

- Create two files in `_posts/`.
- Use `YYYY-MM-DD-<slug>.md` for Chinese and `YYYY-MM-DD-<slug>-en.md` for English.
- Keep date/topic/section order aligned.
- Include `layout`, `title`, `subtitle`, `date`, `author: liu.ruyuan`, `lang`, and `tags`.
- Add cross-links near the top of each article.

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
