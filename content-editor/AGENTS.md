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

网页源图作为清晰母版保留；`scripts/optimize-images.py --backup <仓库外目录>` 仅备份原图及SHA256清单，不再有损改写源图。`scripts/jekyll-with-assets.rb` 显式注册 Jekyll post_write 钩子并统一运行 `scripts/prepare-site.py`，在构建目录生成按内容哈希命名的480/768/1280/1920/2560px WebP（不放大源图，照片质量82、展板及PNG质量90）与响应式引用，源内容字段不变；编辑器预览、上传后的构建及发布使用同一路径，不向编辑器扩大可写范围。Python需安装 `requirements-site.txt`。原图备份不得进入仓库或站点。

构建产物 `release.json` 与页面meta记录版本和提交；`sw.js`使用发布版本隔离缓存，在线页面优先网络、断网回退已访问页面，静态资源按版本缓存，图片缓存最多60MB/100项。旧main-*缓存一次迁移，新版本由用户点击提示切换；页尾支持检查更新和仅清理本站缓存。语言设置保留，未访问的图片不承诺离线可用。本地默认不注册SW，`?offline-test=1`仅供离线验收。

正式发布统一走Actions构建、审计与部署；论坛快照同步完成后触发同一工作流。站点时区固定Asia/Shanghai，已发布博客路径使用显式permalink，旧路径保留跳转。隐藏条目仅从列表隐藏，不视为访问控制。

响应式图片保留 `data-original-src` 用于本地编辑器绑定源字段；替换图片草稿时清除旧 `srcset`，避免浏览器继续显示旧缩略图。

### 图片清晰度与慢网修复（2026-10-17）

母版不重复压缩，构建参数与源内容共同参与图片指纹；修改质量、尺寸后必须生成新URL。全宽首屏使用100vw，展板按正文宽度、卡片按实际布局选图；CSS背景使用高质量image-set而非统一480px。阅读器清晰图异步增强，翻页使用八段轻量动画且不等待下载。HTML/CSS/JS收到响应头即交付，8秒只限制响应头等待；完整正文成功后才入缓存。图片容量索引每个worker初始化一次后增量维护，保留60MB/100项限制及用户主动升级规则。

### 加载可靠性与有界列表（2026-10-22）

本条覆盖此前“导航网络优先、1秒缓存竞争、关键CSS/JS等待8秒”的规则：已访问页面立即返回完整缓存，后台检查内容变化并提供手动更新；显式刷新等待网络，失败才回退缓存。未访问页面与关键CSS/JS不再使用固定8秒主动中止；慢请求继续，真实失败才降级。HTML完整下载成功后才缓存，中断不写入；论坛辅助数据可独立超时。仍保留用户主动升级、语言偏好和图片60MiB/100项上限。

`js/image-loading.js`提供接近视口图片的慢加载提示、真实失败提示和手动重试，不能取消仍在进行的下载；作品集阅读器由自身脚本管理状态，取消20秒整图中止，清晰图接近视口才增强，翻页不等下载。博客内联背景同样经过构建衍生图管线；源图与编辑器字段不变。


分页、论坛静态页及`.asset-cache/`都是构建产物，不可作为编辑器写入目标；原内容schema不变。替图仍清除旧srcset并保留源字段映射，发布预检通过同一Jekyll包装器生成所有产物。

异步语言恢复不得覆写contenteditable、当前焦点或带`data-behop-editor-key`的草稿节点；编辑器的IME与失焦同步规则优先。
