# Verified Workflows

Last verified: 2026-08-06
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
- `archive/visual-v1` preserves the pre-V2 visual snapshot and is not a deployment source.
- `codex/visual-v2` carries the maintained V2 design; publish only by bringing a validated V2 commit onto `master`.
- The forum bot may advance `master` by updating the three approved forum JSON snapshots.
- Fetch and compare before pushing; never force-push over forum synchronization commits.
- To restore V1 without discarding later content or forum data, branch from current `master`, restore only the intended visual paths from `archive/visual-v1`, validate, and commit the restoration. Do not expect merging the older archive branch to revert descendants.
