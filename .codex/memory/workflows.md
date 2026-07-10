# Verified Workflows

Last verified: 2026-07-10
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

## Deployment

- `origin/master` triggers the GitHub Pages workflow.
- The forum bot may advance `master` by updating the three approved forum JSON snapshots.
- Fetch and compare before pushing; never force-push over forum synchronization commits.
