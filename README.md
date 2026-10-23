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

全站导航提供“联系我 / Contact”弹窗。微信号与二维码路径维护于`_data/site_settings.yml`的`contact`，邮箱复用顶层`email`；二维码原图位于`img/contact/wechat.jpg`，首次打开弹窗才加载。桌面入口位于中英切换右侧的导航最右端，移动端保留于菜单内。入口采用低饱和深蓝灰色块与右箭头，适配深浅导航并与中英切换及其他导航文字使用统一字体和行高、垂直居中；英文模式语言入口显示Chinese / EN，中文模式显示中文 / EN，顶层导航组间距统一20px。交互规范见视觉文档。
