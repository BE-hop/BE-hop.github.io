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

## 发布

将代码推送到 `main`（或 `master`）分支即可触发 GitHub Pages 自动部署。如果使用自定义域名，请在仓库设置中配置并同步修改 DNS 记录。

## AI 开发合规约束（必须遵守）

以下规则用于约束 AI 在本仓库中的改动，避免与雇佣单位业务产生冲突：

1. `项目作品 / Portfolio` 页面定位必须是：展示使用 AI 产品/工具完成的作品成果、实验过程与方法总结。
2. 禁止在 `项目作品 / Portfolio` 相关页面新增或强化任何“设计服务承接”导向内容。
3. 禁止出现服务营销型模块或文案，包括但不限于：
   - `设计服务` 栏目
   - `私人庭院设计 / 商业景观规划 / 屋顶花园设计 / 生态修复设计` 等服务条目
   - 明示或暗示接单、报价、咨询转化的 CTA（与个人联系方式无关的服务转化文案）
4. 若需要新增页面内容，优先使用以下方向：
   - AI 生成流程说明
   - 工具链与参数配置
   - 作品前后对比
   - 结果评估与复盘
5. 当需求与本约束冲突时，以本约束为最高优先级，并在提交说明中明确“按合规约束处理”。

## 许可证

代码遵循 [Apache License 2.0](./LICENSE)。欢迎基于该仓库创作并注明来源。
