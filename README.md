# LIFE Project Entry

本项目属于 LIFE 的 `express` 分类。智能体先阅读同级 `AGENTS.md` 与本文件，再按任务使用下方文档地图。

# BEhop Experience

个人博客与知识库，基于 [Jekyll](https://jekyllrb.com/) 自行定制，由 [liu.ruyuan](https://github.com/BE-hop) 维护。站点内容聚焦于 AI、设计、景观以及日常创作，托管在 GitHub Pages：<https://be-hop.github.io>。

## 快速开始

1. 安装 Ruby 及 Bundler：
   ```bash
   gem install bundler
   ```
2. 使用仓库内置脚本启动本地预览（推荐）：
   ```bash
   ./scripts/local-preview.sh
   ```
   启动成功后访问：
   - <http://127.0.0.1:4000/>
   - <http://127.0.0.1:4000/blog/>
   - <http://127.0.0.1:4000/forum/>
3. 如果端口 `4000` 被占用，可切换端口：
   ```bash
   PORT=4001 ./scripts/local-preview.sh
   ```
4. 如只需要构建静态文件到 `_site/`：
   ```bash
   ./scripts/local-preview.sh build
   ```
   然后可用静态模式预览：
   ```bash
   ./scripts/local-preview.sh static
   ```
5. 前端资源若需重新编译，可在安装 Node.js 后执行：
   ```bash
   npm install
   npm run dev
   ```

## 所见即所得内容编辑器

先在一个终端启动 Jekyll 预览，再在另一个终端启动本地编辑器：

```bash
PORT=4001 ./scripts/local-preview.sh
npm run editor
```

打开 <http://127.0.0.1:4567/> 后，实际网页就是主要编辑界面：

- “编辑”模式下将鼠标移到文字或图片上，点击即可原位修改或替换；复制图片后可直接粘贴。
- 原位编辑兼容中文输入法：拼音候选词确认前不会触发保存或重绘；输入过程只更新草稿，离开当前文字后才同步页面其他同字段位置，因此编辑焦点不会被替换。
- “预览”模式恢复真实链接、导航、滚动和动效。
- 中文 / EN 开关决定当前编辑的语言字段；修改中文不会自动改写英文，需要切到 EN 单独编辑。Markdown 正文在专用弹层中修改。
- 排序、可见性、标签、数组和其他页面属性位于右侧可收起设置面板。
- 所有改动先保留为草稿，点击“保存全部”后才整体校验并写入内容文件；“检查并发布”仍是独立的二次确认流程。

编辑桥接只存在于本地 development 预览，GitHub Pages 的 production 构建不会包含桥接脚本或编辑标记。

## 本地预览命令说明

- `./scripts/local-preview.sh`：自动检查并安装缺失 gem，然后运行 `jekyll serve`。
- `./scripts/local-preview.sh build`：仅构建，不启动服务。
- `./scripts/local-preview.sh static`：直接预览 `_site/`（不依赖 Bundler/Jekyll）。
- 该脚本默认把 gem 安装到 `/tmp/behop-bundle`，避免系统 Ruby 环境下 `sudo bundle install` 的权限问题。
- 请不要直接运行 `bundle exec jekyll serve`，否则可能回到系统 gem 路径并触发 `Could not find commonmarker...`。
- 若提示端口占用，可先执行：
  ```bash
  lsof -nP -iTCP:4000 -sTCP:LISTEN
  ```
  然后停止对应进程，或改用其他端口（例如 `PORT=4001`）。

## 预览常见报错

- 报错 `Could not find commonmarker-0.23.12`：请改用 `./scripts/local-preview.sh`，不要直接执行 `bundle exec jekyll serve`。
- 输出 `Ignoring ... because its extensions are not built` 后失败：清理后重装再试：
  ```bash
  rm -rf /tmp/behop-bundle /tmp/bundle-home
  ./scripts/local-preview.sh
  ```
- 报错 `Could not reach host index.rubygems.org`：先配置 RubyGems 镜像，再重试：
  ```bash
  bundle config set --local mirror.https://rubygems.org https://gems.ruby-china.com
  ./scripts/local-preview.sh
  ```
  若要恢复默认源：
  ```bash
  bundle config unset --local mirror.https://rubygems.org
  ```
- 页面“没有正常渲染”时先检查服务类型：
  ```bash
  curl -sS http://127.0.0.1:4000/ | head -n 3
  ```
  正常应以 `<!DOCTYPE html>` 开头；若看到 `---` 或 `{{ site.baseurl }}`，说明你打开的是未经过 Jekyll 渲染的源文件服务。
- 如果你之前在仓库根目录跑过 `python3 -m http.server`，浏览器可能缓存了未渲染页面：
  - 先执行一次强制刷新（macOS: `Cmd + Shift + R`）。
  - 仍异常时，在浏览器开发者工具里清理 `127.0.0.1:4000` 的 Service Worker 和站点缓存后再刷新。
- 若 HTML 正常但样式错乱，请检查 Tailwind CDN 是否可访问：
  ```bash
  curl -I https://cdn.tailwindcss.com
  ```
  若该请求失败，首页会缺少大量样式（因为 `index.html` 使用了 Tailwind CDN）。
- 只有当终端出现 `Server address: http://127.0.0.1:4000/`（或脚本打印 `Starting Jekyll preview...` 后持续运行）时，页面才可正常访问。

## 静态预览（可选）

如你想只看 `_site` 构建结果，推荐直接使用：

```bash
./scripts/local-preview.sh build
./scripts/local-preview.sh static
```

如果你手动使用 `python3 -m http.server`，请确保服务目录是 `_site/`，否则会显示源文件内容而非 Jekyll 渲染结果。

## 自定义内容

- 站点基础配置位于 [`_config.yml`](./_config.yml)，包含标题、描述、头像、导航、评论与统计开关等。
- 页面结构使用 Liquid 模板，核心位于 [`_layouts/`](./_layouts) 与 [`_includes/`](./_includes)。
- 文章与页面使用 Markdown 撰写，存放在 [`_posts/`](./_posts) 与根目录中的 HTML 文件中。
- PWA 设置位于 [`pwa/manifest.json`](./pwa/manifest.json) 与 [`sw.js`](./sw.js)。

### 双语博客内容

中英文博客以 `_posts/YYYY-MM-DD-slug.md` 与 `_posts/YYYY-MM-DD-slug-en.md` 成对维护，具体发布检查见 [`README_AI_BLOG_PUBLISH.md`](./README_AI_BLOG_PUBLISH.md)。设计实践类文章应保留真实过程证据，并明确区分已投入工作的流程、试验性方法和后续计划；过程图片统一放在 `img/posts/<slug>/`，发布前转换为适合网页加载的尺寸与格式。多图过程证据按输入、过程、输出成组展示：普通图片使用对齐容器，横向长图可跨栏并按原比例放大；需要统一画面时使用 `object-fit: contain`，移动端统一单列显示。

## 作品展示视觉系统

首页、AI Tools、Works 列表页及两类详情页继续使用 Jekyll、原生 CSS 与 JavaScript。共享设计变量和动效组件位于 [`css/showcase-system.css`](./css/showcase-system.css) 与 [`js/showcase-system.js`](./js/showcase-system.js)；页面原有样式和双语、筛选逻辑保持分层维护。

- Manrope 用于导航和正文，Playfair Display 用于 Works 标题，Space Grotesk 用于 AI 标题。
- 全站共享导航品牌使用克制的 Depth Text：正面文字保持真实 DOM，彩色深度层由 CSS 伪元素生成，桌面指针只提供小幅倾斜；语言变化由 `js/site-nav.js` 自动同步深度文字。
- `theme-works` 使用暖白编辑背景与原站森林绿主色；`theme-ai` 使用深石墨主题与冰青强调，两类内容在统一中性色基础上保留明确辨识度。
- 首页 Hero 使用首次 Masked Heading，并通过内联 SVG 的外框、多层矩形深度框、内框和四组纵深线建立接近 ReactBits Grid Scan 的连续隧道；CSS 使用 `#06b6d4` 扫描框和局部光源，指针在整个 Hero 内连续跟随。章节标题使用 Scroll Reveal；AI 区域使用 Grid Scan、Bento 和指针 Spotlight；Works 卡片使用绿色 Glare，`featured: true` 项目在桌面形成 Scroll Stack。
- 首页主标题的每一行使用字形内白色—冰青流动纹理模拟 Masked Heading 的动态媒体效果；中英文继续由原 `data-zh` / `data-en` 文本控制，减少动态模式下保留静态纹理。
- Scroll Reveal 对超长展板图组以进入观察范围为触发条件，不能因固定可见比例阈值而隐藏内容；减少动态模式仍直接显示。
- 首页 AI Tools 到 Works 使用深石墨、深绿、雾灰绿和暖白的长距离连续过渡，并在 Works 顶部保留逐渐消失的绿色网格，避免黑白主题直接切换。
- 桌面左侧章节导航会随深浅板块切换对比色并标记当前章节；在 Hero 或长章节边界继续滚动时，页面会快速对齐下一/上一章节，章节内部仍保持普通滚动。移动端、触屏和减少动态模式不启用滚轮接管。
- `_data/homepage.yml` 的 `hero.background_image` 继续作为可维护的 Hero 深度底图，当前为 `img/portfolio/system/behop-hero-ai-workbench-v2.webp`，但仅以极低透明度辅助网格层。原植物景观图 `img/portfolio/hero-landscape.jpg` 保留为 Works Hero。
- 新增 AI 工具仍创建 `_ai_products/*.md`，新增案例仍创建 `_projects/*.md`。模板继续读取既有 `cover`、`order`、`featured`、`status_zh/en` 等字段，不需要复制页面结构或增加编辑器字段。
- PDF 作品集整页导入 Works 时，图片统一使用 `portfolio-page-*.jpg` 命名并在详情页跨栏完整显示；若整页已包含原有单张效果图，应从项目图组中移除重复引用，源媒体文件仍保留。
- 手工提供的 JPG 展板同样使用 `portfolio-page-*.jpg`：横版和竖版都按原始比例单列呈现，避免裁切成卡片。
- Rhino、Grasshopper 等技术过程截图也可按 `portfolio-page-*` 纳入项目；双语说明需将其定位为方案或深化的工作过程，而非最终效果图。
- 跨项目完整作品集总览位于 `works/portfolio/`，以规划、景观、空间与建筑三本双语阅读器组织；首屏将克制标题与三本书合并在森林绿 Hero 中。封面统一使用硬壳、书脊、纸页前口、白色图面内框和轻微反光，同时以规划暖陶棕、景观苔绿、空间与建筑蓝灰建立方向区分。桌面放大镜使用小尺度双层金属框、玻璃高光、连接铆钉和带纹理短手柄，移动端隐藏；中英文标题使用明确两行节点，避免孤字或孤词。阅读器固定为 2:1 跨页，图面不裁切、不重新配对；窄图面用 `-wide.jpg` 独立衍生图左右补纯白画布，原图保留。
- 首页保留 AI Tools、Works、Contact 与 Scroll 四个入口；移动端按钮必须完整换行，不得产生横向裁切。
- 交互是渐进增强：键盘和触屏保持可用，筛选同步 `aria-pressed` 与实时状态；`prefers-reduced-motion` 下关闭揭示、扫描、聚光、扫光和堆叠动画。

视觉改动后运行：

```bash
npm run check
PORT=4001 ./scripts/local-preview.sh
```

浏览器至少检查首页、`/behop-ai-product/`、`/works/` 和两类详情页，并覆盖桌面、768px 与 390px 视口。确认无横向溢出、Hero 裁切正确、Featured 排序正常，且控制台无错误。

## 发布

当前 GitHub Pages 工作流只监听 `master`，因此 `master` 始终代表线上正在展示的版本。视觉版本使用以下分支约定：

- `archive/visual-v1`：新版发布前的原版视觉快照，只用于查阅和恢复，不继续日常开发。
- `codex/visual-v2`：新版视觉的独立开发分支，可以继续深化；确认稳定后再合并到 `master` 发布。
- `master`：唯一线上发布入口。推送后触发 `.github/workflows/jekyll.yml`，同一 GitHub Pages 域名同一时间只展示这个分支构建出的版本。

恢复旧视觉时，不要把较旧的归档分支直接合并到 `master`，因为它是 `master` 的历史祖先，Git 不会自动生成“回退”改动。应从最新 `master` 建立恢复分支，再用 `git restore --source archive/visual-v1 -- <visual-files>` 取回所需视觉文件，完成检查后提交并合并。这样可以保留后续新增的内容和论坛数据。若要同时公开访问两套网站，需要另外配置独立 Pages 仓库、域名或预览部署，而不是只建立两个普通分支。

如果使用自定义域名，请在仓库设置中配置并同步修改 DNS 记录。

## AI 开发合规约束（必须遵守）

以下规则用于约束 AI 在本仓库中的改动，避免网站变成普通接单网站，同时允许它服务留学申请、招聘评估和潜在个人客户了解设计能力：

1. `Works / 项目案例` 页面定位必须是：展示真实设计项目、概念研究、计算化设计实验，以及相关的过程、角色、工具和复盘。
2. 网站可以合理展示真实项目、服务能力、技能矩阵和联系方式，但不应强化报价、促销、批量获客或强销售转化。
3. 避免新增明显营销型模块或文案，例如：
   - 价格套餐、限时优惠、强接单话术
   - 夸大承诺或无法验证的商业宣传
   - 与个人作品集、申请、招聘评估无关的服务销售漏斗
4. 若需要新增页面内容，优先使用以下方向：
   - 项目背景、设计问题、策略、角色和结果
   - AI 工具开发流程、工具链与参数配置
   - 作品前后对比、图纸、效果图和落地反馈
   - 结果评估、限制、下一步计划和复盘
5. 当需求与本约束冲突时，应优先保持网站专业、克制、可验证，并在提交说明中明确处理方式。

## 许可证

代码遵循 [Apache License 2.0](./LICENSE)。欢迎基于该仓库创作并注明来源。
