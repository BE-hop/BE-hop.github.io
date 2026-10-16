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

### 轻量图片、离线缓存与发布版本

网页源图通过 `scripts/optimize-images.py --backup <仓库外目录>` 压缩并保留原图及SHA256清单。`scripts/jekyll-with-assets.rb` 显式注册 Jekyll post_write 钩子并统一运行 `scripts/prepare-site.py`，在构建目录生成按内容哈希命名的480/768/1280px（展板放大保留最大2400px） WebP与响应式引用，源内容字段不变；编辑器预览、上传后的构建及发布使用同一路径，不向编辑器扩大可写范围。Python需安装 `requirements-site.txt`。原图备份不得进入仓库或站点。

构建产物 `release.json` 与页面meta记录版本和提交；`sw.js`使用发布版本隔离缓存，在线页面优先网络、断网回退已访问页面，静态资源按版本缓存，图片缓存最多60MB/100项。旧main-*缓存一次迁移，新版本由用户点击提示切换；页尾支持检查更新和仅清理本站缓存。语言设置保留，未访问的图片不承诺离线可用。本地默认不注册SW，`?offline-test=1`仅供离线验收。

正式发布统一走Actions构建、审计与部署；论坛快照同步完成后触发同一工作流。站点时区固定Asia/Shanghai，已发布博客路径使用显式permalink，旧路径保留跳转。隐藏条目仅从列表隐藏，不视为访问控制。
