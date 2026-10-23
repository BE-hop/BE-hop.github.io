# 本地内容编辑器

## 0. 推荐方式：所见即所得本地编辑器

如果你只是修改文字、替换图片、调整项目说明、更新归档说明，优先使用本地编辑器，不需要直接改代码。

先启动网站预览：

```bash
PORT=4001 ./scripts/local-preview.sh
```

再启动内容编辑器：

```bash
npm run editor
```

打开：

```text
http://127.0.0.1:4567/
```

编辑器打开后默认直接显示实际网站页面：

- 顶部切换“编辑 / 预览”。编辑模式用于选择和修改元素；预览模式用于真实浏览网站。
- 将鼠标移到文字或图片上会出现高亮轮廓；点击文字可原位输入，点击图片可选择文件或粘贴剪贴板图片。
- 中文 / EN 决定当前修改哪一个语言字段；同一内容在首页、列表和详情页仍写回唯一内容源。
- Blog 与详情页 Markdown 正文通过弹层编辑，不把渲染 HTML 逆向转换为 Markdown。
- 非视觉属性、数组增删和排序位于右侧“设置”；旧式字段编辑作为更多设置保留。
- 修改先进入跨页面草稿，点击“保存全部”后统一校验并整体写入。任一内容失败时，本次批量保存不会留下部分写入。

编辑器覆盖：

- Site Settings：品牌、联系邮箱、默认语言、导航文字和社交链接，读取 `_data/site_settings.yml`。
- Homepage：主页 Hero、AI Tools、Works、Contact / Footer，读取 `_data/homepage.yml`。
- Works：读取 `_projects/*.md`。
- AI Tools：读取 `_ai_products/*.md`。
- AI Gallery：读取 `_ai_gallery/*.md`。
- Archive：读取 `_data/worksarchive.yml`。
- About：读取 `_data/about.yml`。
- Bilingual Blog：成对读取和写入 `_posts/YYYY-MM-DD-slug.md` 与 `-en.md`。

AI Digest 仍使用原有审核数据和同步脚本，不进入内容编辑器。

图片替换方式：

1. 在编辑器里选择内容项。
2. 在“结构化”模式里找到对应页面位置，例如“主页首屏 Hero”“项目详情图片”“Archive 归档卡片”。
3. 点击“替换图片”。
4. 选择本地图片后，编辑器会校验真实文件类型并暂存到被 Git 忽略的草稿目录；图片路径先进入当前草稿。
5. 点击“保存全部”后，图片才原子移动到对应网站图片目录并更新内容文件，等待 Jekyll 预览刷新。

编辑器仍保留内容列表、新建、复制、软删除、历史恢复和发布能力，但这些操作收纳在顶部按钮与左右抽屉中，日常文字和图片修改不需要进入字段表单。

编辑器支持搜索、新建隐藏草稿、复制、软删除、历史恢复、中英文 Blog 章节数量校验，以及预览语言切换。

图片替换卡住时的排查：

- 确认 `ruby scripts/content-editor.rb` 仍在运行。
- 图片必须是浏览器识别的图片类型，建议小于 10MB。
- 如果替换后预览没变，先运行 `./scripts/local-preview.sh build` 或等待 Jekyll 预览刷新。
- 上传后的图片会被复制到网站目录，不会引用你电脑原始文件路径。
- 浏览器不允许主动读取剪贴板时，先复制图片，选中网站中的目标图片，再直接按 `Command + V`。

编辑器只允许写入这些位置：

```text
_data/homepage.yml
_data/site_settings.yml
_data/about.yml
_data/worksarchive.yml
_projects/
_ai_products/
_ai_gallery/
_posts/
img/portfolio/homepage/
img/portfolio/real-works/
img/portfolio/about/
img/ai-products/
img/ai-gallery/
img/posts/
```

历史和回收站保存在被 Git 忽略的 `.content-editor/`，不会进入网站或提交。

### 发布到 GitHub Pages

“检查并发布”只处理本次编辑器会话创建、修改或删除的内容文件：

1. 检查启动前是否已有同路径改动。
2. 检查远端 `master` 是否领先或分叉。
3. 验证生成 CSS、编辑器测试、Jekyll 构建、链接、图片和双语文章。
4. 展示精确文件列表并要求二次确认。
5. 仅暂存列表中的文件，提交并推送 `origin/master`。

编辑器不会自动 pull、rebase、强制推送或暂存整个工作区。不要把 `scripts/content-editor.rb` 或 `content-editor/` 部署成线上后台。


## 网页衍生图片

源内容字段和图片根目录保持原样。构建给图片增加用途、响应式预览与高清查看链接，保留data-original-src供编辑器绑定；替换草稿时仍清除旧srcset。图片和缓存政策统一见[性能规范](../docs/loading-performance.md)。

## 紧凑首页的精选引用

在首页设置中编辑“精选实践”：最多六项，每项为 `{"type":"tool","slug":"paperflow"}` 或 `{"type":"project","slug":"shilih-lake"}`。顺序即首页顺序；服务端拒绝重复、非法和缺失文件引用。标题、图片与摘要仍在对应工具或项目中修改。工具分类、双语分类名称和当前状态现已提供独立字段。双语、数组与批量保存继续复用原控件和整体回滚机制。
