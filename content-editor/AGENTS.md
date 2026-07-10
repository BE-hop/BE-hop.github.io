# Content Editor Agent Rules

These rules apply to `content-editor/` and the local Ruby editor service.

## Product Contract

- The editor is local-only, bound to `127.0.0.1`, and must never become a deployed admin panel.
- Daily editing uses structured sections; the advanced JSON/Markdown view is serialized back to safe YAML front matter and Markdown files.
- The supported content types are Site Settings, Homepage, Works, AI Tools, AI Gallery, Archive, About, and bilingual Blog pairs.
- UI, server validation, documentation, and tests must use the same schema contract.

## Security Contract

- Validate Host, Origin, CSRF token, method, content type, request size, schema fields, and canonical paths on every mutating request.
- Accept only JPEG, PNG, WebP, and GIF uploads after validating byte signatures; never trust file names or browser MIME types.
- Use atomic writes and local history snapshots. Soft-delete content into the ignored editor state directory.
- Invoke Git and build commands with argument arrays. Never interpolate user-controlled values into a shell command.
- Publishing may stage only clean-at-start files changed in the current editor session. Refuse remote divergence and any out-of-scope path.

## Required Validation

- Run `npm run editor:test` after server, schema, upload, history, or publishing changes.
- Run `npm run build && npm run site:audit` after changing editor-managed schemas or template data flow.
- Update `docs/site-content-map.md` whenever fields, writable roots, image paths, or content types change.
