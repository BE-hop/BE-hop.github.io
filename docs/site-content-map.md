# 网站内容维护说明

这份文件用于说明 BEhop Experience 网站中不同页面、文字和图片对应的修改位置。后续如果只是替换图片、补充项目说明或新增工具，一般不需要改模板代码。

编辑操作与发布边界见[本地编辑器说明](../content-editor/README.md)。本文件只维护内容源、字段和媒体映射。

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
_ai_products/spatial-prompt-lab.md
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

## 构建边界

- 内容仍写入上述集合与数据文件；分页、论坛正文、media/optimized和assets/bundles均由构建生成，不直接编辑。
- 模板的data-media-role和sizes是展示属性，不属于内容schema；不扩大编辑器可写根。
- 图片转换保留data-original-src，替换草稿继续移除旧srcset。已包裹的图片链接不得嵌套额外链接。
- 构建、缓存、预算统一见[性能规范](loading-performance.md)，工程职责见[架构](architecture.md)。
- SPL页只提供介绍、真实截图及下载链接；没有版本接口时保留静态下载提示，查询失败不能隐藏下载入口。

## 全站联系弹窗

共享导航读取`_data/site_settings.yml`中的`navigation.contact_zh/contact_en`、`contact.wechat`、`contact.qr_image`与顶层`email`。模板为`_includes/contact.html`，二维码原图为`img/contact/wechat.jpg`，使用独立的`data-contact-src`仅在主动打开后加载，不参与正文图片衍生与编辑器写入范围扩展。

## 文章更新与网址迁移

同一篇文章的更新沿用已有中英文_posts记录。确需迁移时，只保留一对正式正文；旧URL在原路径放置layout:null的静态跳转页，包含meta refresh、指向对应语言正文的canonical和可点击链接，不能保留旧_posts记录参与博客、归档、标签、搜索与RSS。

《当 AI 获得身体》的唯一正文为2026-10-16的when-ai-gains-a-body双语配对。2026-09-03的when-ai-gets-a-body-maslow和2026-10-15的when-ai-gains-a-body双语旧入口均跳转至10月16日对应语言正文。旧稿可由Git历史恢复；原图片素材保留。
