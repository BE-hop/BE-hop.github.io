# Codex Project Memory: BE-hop.github.io

## What This Repo Is

Personal Jekyll/GitHub Pages site for BEhop Experience: blog, knowledge base, portfolio projects, AI product pages, AI gallery, PWA support, and a small forum. Main production site is `https://be-hop.github.io`.

## Key Structure

- `_config.yml`: site config, collections, defaults, plugins, metadata.
- `_posts/`: blog posts. Bilingual posts are paired as Chinese + `-en`.
- `_layouts/`, `_includes/`: Liquid templates and shared fragments.
- `_projects/`: project/portfolio collection.
- `_ai_products/`: AI product collection.
- `_ai_gallery/`: AI gallery collection.
- `forum/`, `js/forum*.js`, `assets/data/forum-*.json`: forum UI and approved data.
- `scripts/local-preview.sh`: preferred preview/build entrypoint.
- `scripts/forum-*.mjs`: forum data sync/metrics scripts.
- `README_AI_BLOG_PUBLISH.md`: deterministic rules for AI-created blog posts.

## Preferred Commands

Use the repo script first:

```bash
./scripts/local-preview.sh
./scripts/local-preview.sh build
./scripts/local-preview.sh static
PORT=4001 ./scripts/local-preview.sh
```

Other commands:

```bash
npm run forum:metrics
npm run forum:sync-comments
npm run forum:sync-topics
npm run dev
```

Avoid direct `bundle exec jekyll serve` by default because this repo's README documents system Ruby/gem-path issues. The preview script installs gems under `/tmp/behop-bundle` and handles macOS Ruby header quirks.

## Validation Expectations

- For most edits: run `./scripts/local-preview.sh build`.
- For visual/navigation/PWA changes: run `./scripts/local-preview.sh` and inspect affected pages.
- For forum approved-data changes: run `npm run forum:metrics`.
- Static preview should serve `_site/`; never use root-level `python3 -m http.server` to judge rendered Jekyll output.

## Style And Editing

- Match existing file style.
- Keep Jekyll/Liquid changes in `_layouts/` and `_includes/` when shared.
- Keep browser JS plain; do not introduce a framework.
- `scripts/*.mjs` use ESM, async functions, and two-space indentation.
- Keep YAML front matter clean and slug/file names ASCII-friendly.
- Be cautious with generated/minified CSS and legacy LESS/Grunt outputs.

## Content Guardrails

The site should remain a professional portfolio/blog, not a hard-selling agency site.

- Works/project pages should emphasize real projects, concept research, tools, process, role, results, constraints, and reflection.
- Avoid pricing tables, limited-time offers, aggressive sales copy, inflated promises, or generic marketing funnels.
- For blog posts, follow `README_AI_BLOG_PUBLISH.md`; bilingual posts need paired zh/en files with aligned structure and cross-links.

## Forum And Secrets

Forum sync scripts query Supabase and require:

- `FORUM_COMMENT_SUBMIT_URL`
- `FORUM_TOPIC_SUBMIT_URL`
- `SUPABASE_SERVICE_ROLE_KEY`

Do not run those scripts without the right environment. Never expose or commit service role keys.

## Local Preview Gotchas

- Raw `---` or `{{ site.baseurl }}` in browser means the source files were served without Jekyll.
- Browser/service-worker cache can make local pages stale; hard-refresh or clear site data for `127.0.0.1:4000`.
- If gems break, try `rm -rf /tmp/behop-bundle /tmp/bundle-home` then rerun `./scripts/local-preview.sh`.
- `.gitignore` has broad `*.lock` and `*.sh` patterns, but tracked lockfiles and `scripts/local-preview.sh` are intentional. Do not delete them casually.
