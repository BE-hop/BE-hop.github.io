# Stable Project Memory

Last verified: 2026-07-10
Evidence: repository structure, `_config.yml`, local build, and browser audit.
Invalidation: replatforming away from Jekyll/GitHub Pages or changing the content collections.

- BEhop Experience is a Jekyll 3.x site deployed from `master` through GitHub Actions to GitHub Pages.
- Public professional content is English-first with Chinese mirrors; owner-facing Agent communication is Chinese.
- Core collections are Works, AI Tools, and AI Gallery. Homepage, site settings, About, and Archive use `_data` files; Blog uses paired Markdown posts.
- Career-facing content should demonstrate real roles, constraints, design judgment, evaluation logic, tools, process, and reflection.
- The local content editor is a loopback-only maintenance tool. It is excluded from Jekyll output and writes only explicit content/media roots.
- AI Digest keeps its existing approved-data and secret-backed synchronization workflow outside the content editor.
