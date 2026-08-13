# Content Editor Agent Rules

These rules apply to `content-editor/` and the local Ruby editor service.

## Product Contract

- The editor is local-only, bound to `127.0.0.1`, and must never become a deployed admin panel.
- Daily editing uses structured sections; the advanced JSON/Markdown view is serialized back to safe YAML front matter and Markdown files.
- The supported content types are Site Settings, Homepage, Works, AI Tools, AI Gallery, Archive, About, and bilingual Blog pairs.
- UI, server validation, documentation, and tests must use the same schema contract.
- The rendered Jekyll page is the default editor surface. Keep source paths and schema paths internal; expose human-readable labels only.
- The preview bridge is local-development-only and served by this editor service. Production HTML must contain neither the bridge reference nor editor binding attributes.
- Native Chinese, Japanese, Korean, and other IME composition must remain local to the focused editable element until `compositionend`; input events update only the editor draft, while shared-page synchronization occurs on blur so the focused node and its caret are never rewritten.

## Security Contract

- Validate Host, Origin, CSRF token, method, content type, request size, schema fields, and canonical paths on every mutating request.
- Accept only JPEG, PNG, WebP, and GIF uploads after validating byte signatures; never trust file names or browser MIME types.
- Use atomic writes and local history snapshots. Soft-delete content into the ignored editor state directory.
- Invoke Git and build commands with argument arrays. Never interpolate user-controlled values into a shell command.
- Publishing may stage only clean-at-start files changed in the current editor session. Refuse remote divergence and any out-of-scope path.
- Batch saves must prevalidate every record, snapshot affected content, and restore all touched files and session tracking if any write fails.
- Clipboard images use the same byte-signature, size, draft, canonical-path, and finalization checks as file-picker uploads.

## Required Validation

- Run `npm run editor:test` after server, schema, upload, history, or publishing changes.
- Run `npm run build && npm run site:audit` after changing editor-managed schemas or template data flow.
- Update `docs/site-content-map.md` whenever fields, writable roots, image paths, or content types change.
