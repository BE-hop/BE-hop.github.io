# BEhop Experience 使用手册

> 帮助你在几分钟内掌控整站配置、内容与构建流程。

## 1. 环境准备

- 安装 Ruby 及 Bundler：`gem install bundler`
- 本地预览（推荐）：`./scripts/local-preview.sh`
- 仅构建静态文件：`./scripts/local-preview.sh build`
- 预览已构建静态站点：`./scripts/local-preview.sh static`
- 如需编译 Less/压缩 JS：`npm install` 后运行 `npm run dev`
- 预览地址（启动成功后）：`http://127.0.0.1:4000/`

## 2. 站点基础设置

所有全局配置集中在 [`_config.yml`](../_config.yml)：

| 配置项 | 作用 |
| --- | --- |
| `title` / `SEOTitle` | 页头与搜索引擎显示的标题 |
| `description` / `keyword` | 站点描述与关键词，用于 SEO |
| `url` / `baseurl` | 网站部署地址，通常保持默认即可 |
| `sidebar-*` | 侧边栏简介、头像、标签云等 |
| `service-worker` | 打开/关闭 PWA 与离线提示 |
| `disqus_username`、`ga_track_id` 等 | 第三方服务账号，留空即关闭 |

修改完 `sidebar-avatar` 后请同步更新 [`sw.js`](../sw.js) 的预缓存清单，确保离线模式能加载你的头像。

## 3. 页面与文章

- 常规页面位于仓库根目录（如 `about.html`、`archive.html`），使用 `_layouts/page.html` 模板。
- 文章遵循 `YYYY-MM-DD-title.md` 命名，放置在 [`_posts/`](../_posts)。Front Matter 示例：
  ```yaml
  ---
  layout: post
  title: "欢迎来到 BEhop"
  subtitle: "设计与 AI 的记录"
  date: 2024-01-01
  author: liu.ruyuan
  tags: [设计, AI]
  ---
  正文内容支持 Markdown 与 Liquid。
  ```
- 归档页、搜索索引等会自动读取所有文章，不需要手动更新。

## 4. 导航与组件

- 全局头部、页脚位于 [`_includes/`](../_includes)。
- 修改社交链接请编辑 `_includes/sns-links.html` 或在 `_config.yml` 中填入账号。
- 关于页面内容分别存放在 `_includes/about/zh.md` 与 `_includes/about/en.md`，可根据需要增删段落。

## 5. PWA 与 Service Worker

- Manifest 信息位于 [`pwa/manifest.json`](../pwa/manifest.json)，可替换应用名称、描述与图标。
- [`sw.js`](../sw.js) 负责缓存策略，`HOSTNAME_WHITELIST` 中列出允许缓存的域名。如果添加自定义 API 域名，请在此加入白名单。
- `js/sw-registration.js` 提供更新提示，若不需要 snackbar，可直接移除相关逻辑。

## 6. 构建与部署检查表

1. `npm run dev` 重新生成压缩 CSS/JS（如更新了 Less 或脚本）。
2. `./scripts/local-preview.sh build` 确认编译无报错。
3. 检查站点在本地是否能正常加载字体、图片与 Service Worker。
4. 推送至 GitHub 后，GitHub Pages 会自动部署。

## 7. 常见问题

- **自定义域名**：在仓库设置添加域名并配置 DNS。若无自定义域名无需创建 `CNAME` 文件。
- **关闭评论或统计**：保持 `_config.yml` 中对应字段为空即可。
- **替换主题色**：在 `less/` 中修改变量后重新运行 `npm run dev`。

祝使用愉快！
