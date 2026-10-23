# BEhop Experience

个人设计作品、AI工具和双语写作网站，基于Jekyll与原生CSS/JavaScript。
正式入口：[www.behop.cn](https://www.behop.cn)。项目属于LIFE的express分类。

## 环境与启动

需要Node.js 20+、Python 3.12、Ruby/Bundler。首次安装：

```bash
npm ci
python3 -m pip install -r requirements-site.txt
```

```bash
npm run dev                                  # Jekyll预览，默认4000
PORT=4001 ./scripts/local-preview.sh          # 指定端口
npm run editor                               # 本地编辑器4567
npm run build                                # 生产构建到_site
./scripts/local-preview.sh static            # 查看现有构建
```

预览脚本自动检查Ruby依赖，默认装到/tmp/behop-bundle。不要在仓库根目录直接启动静态服务器。
本地编辑器的操作、草稿和发布边界见[编辑器说明](content-editor/README.md)。

## 日常维护

| 内容 | 唯一源 |
| --- | --- |
| 首页、全站设置、About、归档 | `_data/` |
| 项目、工具、图库 | `_projects/`、`_ai_products/`、`_ai_gallery/` |
| 中英文文章 | `_posts/`同日期配对文件 |
| 清晰母版 | `img/`内指定媒体根 |
| 页面结构与样式 | `_layouts/`、`_includes/`、`css/`、`js/` |

文章更新沿用已有中英文配对记录，不另建重复文章；迁移网址时从_posts移除旧记录，旧URL只保留静态跳转、canonical和可点击链接。现《当 AI 获得身体》统一使用2026-10-16版本，2026-09-03与2026-10-15入口保留兼容跳转。

普通浏览加载封面或阅读图；点击图片或“查看高清”才进入高清观察。源图保留，不反复有损压缩。
新增内容保持现有集合字段；模板按图片用途声明实际布局宽度，详见性能规范。

```bash
npm run check                 # 运行时、图片、编辑器、构建、审计、资源预算
npm run browser:test          # 本地浏览器功能与五次冷访问性能检查
npm run css:build             # 更新Tailwind（检查发现过期时）
npm run legacy:watch          # 仅在维护旧hux-blog LESS/JS时使用
```

本地浏览器测试使用已安装Chrome；CI使用Playwright Chromium。报告位于不提交的test-results/。

## 文档地图

| 主题 | 文档 |
| --- | --- |
| 智能体规则与任务路由 | [AGENTS.md](AGENTS.md) |
| 构建链路、源码与生成物 | [架构](docs/architecture.md) |
| 图片层级、缓存迁移、预算与CDN | [性能规范](docs/loading-performance.md) |
| 字体、主题、布局及交互 | [视觉规范](docs/visual-system.md) |
| 内容字段、媒体位置和可写根 | [内容地图](docs/site-content-map.md) |
| 本地所见即所得维护 | [编辑器说明](content-editor/README.md) |
| 双语文章发布 | [博客发布](README_AI_BLOG_PUBLISH.md) |
| 专业定位和来源证据 | [职业内容策略](docs/career-content-strategy-memory.md) |
| 历史事故与验收 | [历史索引](docs/history/README.md) |

## 发布

master是唯一正式源，Actions固定ubuntu-24.04/Ruby 3.1。
发布前完成检查、浏览器验收并获取最新origin/master，保护论坛机器人提交。
**worker退役版发布前必须先确认线上HTML允许正常HTTP缓存**；Actions会阻止仍带no-store的发布。2026-10-23已修复公开HTML的Browser bypass，实际短TTL为600秒；持续以[性能规范](docs/loading-performance.md)中的HTTP预检为准。
本地构建不能证明CDN配置或大陆实际网络已达标。DNS、证书、付费或迁移按具体方案确认后执行。

常见问题：端口占用时改PORT；缺commonmarker时使用预览脚本；出现原始Liquid时检查是否误把仓库根当静态站点。
详细排查与回退见性能规范。代码遵循[Apache License 2.0](LICENSE)。

本轮实施结果和前后对照见[流畅化验收](docs/fluency-validation.md)。

## 联系入口维护

全站导航提供“联系我 / Contact”弹窗。微信号与二维码路径维护于`_data/site_settings.yml`的`contact`，邮箱复用顶层`email`；二维码原图位于`img/contact/wechat.jpg`，首次打开弹窗才加载。桌面入口位于中英切换右侧的导航最右端，移动端保留于菜单内。入口采用低饱和深蓝灰色块与右箭头，适配深浅导航并与中英切换及其他导航文字使用统一字体和行高、垂直居中；中英文模式语言入口均固定显示中文 / EN，顶层导航组间距统一20px。交互规范见视觉文档。

联系入口提供扫码与邮件两个页签，邮件沿用FormSubmit；切换与关闭弹窗保留本次页面中的未发送草稿，刷新页面不保存。共享导航统一宽度，博客与展示页对齐；AI工具、项目案例和AI情报保留图片Hero。工具Hero两张卡片统一暗色底板，RU-Render目录预览使用白色封面底板和留白。邮件验证使用拦截请求，不发送真实邮件。

## 紧凑展示与内容组织

首页依次呈现 Hero、六项精选实践、博客与设计 AI 情报，以及简短关于和联系入口。桌面以 Hero 后约两屏为目标；手机自然展开。大屏通过流式容器和增加目录列数利用空间，阅读段落保持独立行宽。

工具目录目前包括五个原有设计工具，以及 Paperflow、语境英语、RUecord-money、Life-Button 四个本地工具案例。新增截图来自隔离演示与合成数据；流程示意明确标注，不代表实际界面。工具状态、使用边界和下载入口分别维护。

首页精选维护于 `_data/homepage.yml` 的 `selected_practice`：每项包含 `type: tool/project` 与对应集合文件的 `slug`，最多六项；正文和封面仍来自集合。Works 三册入口通过 `/works/portfolio/?book=planning|landscape|spatial#portfolio-reader` 直接选册。

AI 情报改为设计行业研究、实践与产业观察；类型／主题／年份筛选和分页均为静态页面。旧 `/forum/`、详情和查询入口保持兼容；只保留文章评论。维护与审核见 [情报维护说明](forum/MODERATION.md)。本次验收与预览证据见 [重构验收](docs/editorial-validation.md)。

五个主栏目共用适中Hero高度（`--landing-hero-height`，桌面约420px），首页保持整屏，语言切换保持同一底部分界；中英文共用相同的版式逻辑，中文单独优化字体和短标题。博客列表通过`landing-hero: true`启用共享几何，不影响文章正文页。情报页导航首屏透明，与全站一致。

中文首屏采用独立的短标题和统一中文无衬线字体，对齐、列结构与控件跟随英文；英文文案和字体继续保留。

本轮双语首屏、首页例外和跨页分界的验证见[Hero布局验收](docs/hero-balance-validation.md)。

手机菜单采用固定明暗对比的独立面板，可滚动访问底部联系入口；关于页移除顶部精选标签。博客归档在`archive.html`与`archive/en/index.html`保留入口，内容共用`_includes/archive-list.html`，`js/archive.js`渐进增强标签筛选；脚本不可用时文章仍可阅读。

## 重大更新与版本保留

2026-10-24重大更新说明见[更新记录](docs/major-update-20261024.md)。更新前版本保留于`archive/pre-major-update-20261024`，本次版本标记为`major-update-20261024`；以后可在最新master上按文件选择性复用旧版本，不重置正式分支。
