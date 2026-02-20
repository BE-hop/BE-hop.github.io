# BEhop Experience 模板说明

这是 liu.ruyuan 的个人博客仓库，整理了所有页面、文章与静态资源。如果你想在此基础上创作自己的内容，可参考以下步骤：

## 初始化环境

1. 安装 Ruby / Bundler：`gem install bundler`
2. 本地预览（推荐）：`./scripts/local-preview.sh`
3. 仅构建静态文件：`./scripts/local-preview.sh build`
4. 预览已构建静态站点：`./scripts/local-preview.sh static`
5. 若需重新编译样式与脚本：`npm install` 后执行 `npm run dev`
6. 预览地址（启动成功后）：`http://127.0.0.1:4000/`

## 必改项

- 修改 [`_config.yml`](../_config.yml) 中的标题、描述、头像和社交账号。
- 根据需要调整 [`pwa/manifest.json`](../pwa/manifest.json) 与 [`sw.js`](../sw.js) 的名称、描述、缓存资源。
- 在 `_includes/about/zh.md` / `_includes/about/en.md` 中撰写你的个人简介。
- 在 [`_posts/`](../_posts) 目录下创建 Markdown 文章。

## 内容结构

- 模板文件位于 `_layouts/` 与 `_includes/`。
- 首页、归档、关于等页面位于仓库根目录。
- 资源文件存放在 `css/`、`js/`、`img/`、`fonts/`、`less/`。

## 部署

- 代码推送到默认分支即可触发 GitHub Pages。
- 如果没有自定义域名，请保持仓库中不包含 `CNAME` 文件。

## 许可证

项目沿用 Apache License 2.0，可自由修改与分发，欢迎在此基础上打造属于你的站点。
