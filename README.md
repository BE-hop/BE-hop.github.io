# BEhop Experience

个人博客与知识库，基于 [Jekyll](https://jekyllrb.com/) 自行定制，由 [liu.ruyuan](https://github.com/BE-hop) 维护。站点内容聚焦于 AI、设计、景观以及日常创作，托管在 GitHub Pages：<https://be-hop.github.io>。

## 快速开始

1. 安装 Ruby 及 Bundler：
   ```bash
   gem install bundler
   ```
2. 安装依赖并启动本地预览：
   ```bash
   bundle install
   bundle exec jekyll serve
   ```
   站点默认运行于 <http://localhost:4000>。
3. 前端资源若需重新编译，可在安装 Node.js 后执行：
   ```bash
   npm install
   npm run dev
   ```

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
