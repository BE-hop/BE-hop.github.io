# Verified Workflows

Last verified: 2026-09-03
Invalidation: package scripts, Ruby environment, deployment branch, or editor ports change.

## Local preview

```bash
./scripts/local-preview.sh
PORT=4001 ./scripts/local-preview.sh
./scripts/local-preview.sh build
```

## Content editor

```bash
npm run editor
```

The editor opens on `127.0.0.1:4567` and targets the Jekyll preview on `127.0.0.1:4001` by default.

## Quality gate

```bash
npm run check
```

This checks generated CSS, editor behavior, Jekyll output, content/schema consistency, and local links/assets.

## Cross-surface thinking article

- Publish the complete argument as aligned Chinese and English posts under `_posts/`; these are the canonical editions.
- Keep the article image set under `img/posts/<slug>/` and use web-sized PNG/WebP assets.
- Add a condensed bilingual topic to `js/forum-data.js` and link it to both full posts. Do not hand-edit the bot-managed approved forum JSON snapshots.
- Verify that long forum titles remain fully visible below the fixed navigation at 390px; the topic Hero may need to expand vertically on mobile.
- Distill only durable author positioning into `_data/about.yml` and `_includes/about/{zh,en}.md`; do not copy the full article into About.
- Run `npm run check`, inspect the rendered blog, forum topic, and About pages at desktop and mobile widths, then fetch `origin` immediately before a scoped commit and push.

## Works PDF portfolio pages

- Render the selected PDF pages to web images and place them under the relevant `img/portfolio/real-works/<project>/` directory.
- Name complete landscape boards `portfolio-page-*.jpg`; the project layout recognizes this convention and displays them full-width with their original aspect ratio.
- Compare each board with the existing project gallery. Remove YAML references to standalone images already contained in the new board, while preserving the source media files.
- Verify with `npm run check`, then inspect both project pages at desktop and 390px mobile widths for full-page rendering, zero duplicate references, and zero horizontal overflow.

## Deployment

- `origin/master` triggers the GitHub Pages workflow.
- `archive/visual-v1` preserves the pre-V2 visual snapshot and is not a deployment source.
- `codex/visual-v2` carries the maintained V2 design; publish only by bringing a validated V2 commit onto `master`.
- The forum bot may advance `master` by updating the three approved forum JSON snapshots.
- Fetch and compare before pushing; never force-push over forum synchronization commits.
- To restore V1 without discarding later content or forum data, branch from current `master`, restore only the intended visual paths from `archive/visual-v1`, validate, and commit the restoration. Do not expect merging the older archive branch to revert descendants.
