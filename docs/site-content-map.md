# 网站内容维护说明

这份文件用于说明 BEhop Experience 网站中不同页面、文字和图片对应的修改位置。后续如果只是替换图片、补充项目说明或新增工具，一般不需要改模板代码。

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
5. 点击“保存到本地”后，图片才原子移动到对应网站图片目录并更新内容文件，等待 Jekyll 预览刷新。

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

## 1. 首页内容在哪里改

首页文件是：

```text
index.html
```

首页主要读取这些内容：

- Hero、首页 AI Tools 标题区、首页 Works 标题区、Contact / Footer：读取 `_data/homepage.yml`
- AI Tools 区域：读取 `_ai_products/*.md`
- Featured Works 区域：读取 `_projects/*.md`
- Archive 链接：指向 `works/archive/index.html`
- 最新博客：读取 `_posts/`

如果要修改首页作品卡片的文字，优先修改对应的 `_projects/*.md`，不要直接改首页卡片文案。

如果要修改首页 AI 工具卡片的文字，优先修改对应的 `_ai_products/*.md`。

如果要修改首页 Hero 主标题、说明、按钮文字、首页主图、Contact 展示文字或 Footer 描述，修改：

```text
_data/homepage.yml
```

常用字段：

```yaml
hero:
  background_image: "/img/portfolio/hero-landscape.jpg"
  badge_zh:
  badge_en:
  title_lines_zh:
  title_lines_en:
  description_zh:
  description_en:

ai_tools:
  title_zh:
  title_en:
  subtitle_zh:
  subtitle_en:

works:
  title_zh:
  title_en:
  subtitle_zh:
  subtitle_en:

contact:
  description_zh:
  description_en:
  email:

footer:
  description_zh:
  description_en:
```

## 2. Works 精选项目怎么改

精选项目文件在：

```text
_projects/
```

每个 `.md` 文件对应一个项目详情页，例如：

```text
_projects/shilih-lake.md
_projects/didi-campus.md
_projects/graduation-design.md
```

常用字段：

```yaml
title_zh: "中文标题"
title_en: "English Title"
subtitle_zh: "中文副标题"
subtitle_en: "English subtitle"
category: "professional | academic | landscape | interior | computational | ai-workflow"
category_label_zh: "真实工作项目"
category_label_en: "Professional Work"
status_zh: "旗舰案例"
status_en: "Flagship Case"
year: "2025-2026"
location_zh: "地点"
location_en: "Location"
role_zh: "我的角色"
role_en: "My role"
tools:
  - Rhino
  - Grasshopper
summary_zh: "列表卡片和详情页概览会用到的中文摘要"
summary_en: "English summary"
cover: "/img/portfolio/real-works/xxx/cover.jpg"
image: "/img/portfolio/real-works/xxx/cover.jpg"
order: 1
featured: true
```

详情页图组：

```yaml
drawings:
  - image: "/img/portfolio/real-works/project/process.jpg"
    caption_zh: "中文说明"
    caption_en: "English caption"
renderings:
  - image: "/img/portfolio/real-works/project/render.jpg"
    caption_zh: "中文说明"
    caption_en: "English caption"
```

从 PDF 导出的完整作品集页面放在对应项目媒体目录，并使用 `portfolio-page-*.jpg` 命名。详情模板会让这类页面跨栏、按原比例完整显示。导入前应核对已有图组；如果整页已经包含某张单图，就从 YAML 图组中移除该单图引用，避免同一画面重复展示，但无需删除源媒体文件。

排序规则：

- `order` 越小越靠前。
- 首页和 Works 页面都会按 `order` 排序。
- `category: professional` 的项目会在首页 Works 区顶部显示为重点工作案例。

项目详情页模板在：

```text
_layouts/project.html
```

只有当你要改详情页整体结构时才需要改它。

## 3. AI Tools 怎么改

AI 工具文件在：

```text
_ai_products/
```

当前公开工具包括：

```text
_ai_products/ru-lineart.md
_ai_products/ru-render.md
_ai_products/spi-render.md
_ai_products/ru-canvas.md
```

可见性字段：

```yaml
visibility: public
```

含义：

- `public`：公开显示在 AI Tools 页面。
- `hidden`：保留文件，但不在公开列表显示。
- `concept`：预留状态；如果模板继续过滤 concept，则不会公开显示。当前建议概念 MVP 用 `visibility: public`，并用 `status_zh/status_en` 标注为概念。

常用字段：

```yaml
title_zh:
title_en:
subtitle_zh:
subtitle_en:
category:
category_zh:
category_en:
status_zh: "真实原型 | 概念 MVP"
status_en: "Real Prototype | Concept MVP"
summary_zh:
summary_en:
problem_zh:
problem_en:
workflow:
features:
tech_stack:
before_image:
after_image:
result_gallery:
```

AI 工具详情页模板在：

```text
_layouts/ai-product.html
```

AI Tools 列表页在：

```text
behop-ai-product/index.html
```

## 4. Archive 全部作品归档怎么改

归档页面是：

```text
works/archive/index.html
```

归档数据在：

```text
_data/worksarchive.yml
```

新增归档项时复制这个结构：

```yaml
- id: unique-id
  title_zh: "中文标题"
  title_en: "English Title"
  year: "2026"
  source_group: professional
  type_zh: "最新工作成果"
  type_en: "Latest Professional Work"
  status: archived
  visibility: limited
  source_label_zh: "工作成果"
  source_label_en: "Professional"
  thumbnail: "/img/portfolio/real-works/archive/example.jpg"
  project_url: "/projects/example/"
  summary_zh: "中文说明"
  summary_en: "English summary"
  tags:
    - Landscape
    - Archive
```

字段说明：

- `source_group` 用于筛选，可填 `professional`、`graduate`、`research`。
- `status` 可填 `featured`、`archived`、`draft`。
- `visibility` 可填 `public`、`limited`、`private`。
- `project_url` 有值时，卡片会进入详情页；为空时只是归档记录。
- `thumbnail` 必须指向公开图片，不要指向本地源文件夹。

## 5. 图片放哪里

首页图片：

```text
img/portfolio/homepage/
```

真实作品图片：

```text
img/portfolio/real-works/
```

建议按项目建文件夹：

```text
img/portfolio/real-works/shilih/
img/portfolio/real-works/didi/
img/portfolio/real-works/graduate/
img/portfolio/real-works/archive/
```

AI 工具图片：

```text
img/ai-products/
```

建议按工具建文件夹：

```text
img/ai-products/ru-render/
img/ai-products/concepts/
```

建议尺寸：

- 首页/列表封面：1600px 宽以内，JPG。
- 详情页大图：1800px 宽以内，JPG。
- 流程图：1800 x 900 左右，JPG 或 PNG。
- 单张图片尽量控制在 1MB 左右，避免 GitHub Pages 加载过慢。

替换图片时：

1. 推荐使用本地编辑器点击图片替换，编辑器会复制文件并更新路径。
2. 如果手动替换且保持文件名不变，页面会自动使用新图。
3. 如果手动改文件名，需要同步修改 `_data/homepage.yml`、`_projects/*.md`、`_ai_products/*.md` 或 `_data/worksarchive.yml` 中的路径。

## 6. 本地构建和预览

构建：

```bash
./scripts/local-preview.sh build
```

预览：

```bash
PORT=4001 ./scripts/local-preview.sh
```

本地内容编辑器：

```bash
ruby scripts/content-editor.rb
```

编辑器地址：

```text
http://127.0.0.1:4567/
```

## 7. 重要计划索引

重要实施计划放在：

```text
docs/plans/
```

计划索引：

```text
docs/plans/index.md
```

本轮内容编辑器计划：

```text
docs/plans/2026-07-08-local-content-editor-homepage-ai-works-archive.md
```

常看页面：

```text
http://127.0.0.1:4001/
http://127.0.0.1:4001/works/
http://127.0.0.1:4001/works/archive/
http://127.0.0.1:4001/behop-ai-product/
```

如果页面看起来没有更新，先硬刷新浏览器；如果仍旧没更新，清理 `127.0.0.1:4001` 的 service worker / site data。
