# 保存并实施：BE-hop 本地内容编辑器计划

## Summary

先将本次方案保存为可追溯计划文件，再按计划实现本地可视化内容编辑器。编辑器覆盖 **主页、AI Tools、Works、Archive**；不覆盖 **Blog、AI Digest、About**。

计划文件保存位置：

- `docs/plans/2026-07-08-local-content-editor-homepage-ai-works-archive.md`

计划索引保存位置：

- `docs/plans/index.md`

## Key Changes

- 新增计划归档：
  - 创建 `docs/plans/`。
  - 将完整方案写入 dated plan 文件。
  - 在 `docs/plans/index.md` 记录日期、标题、状态、关联页面、实施结果链接，保证后续可追溯。

- 新增本地内容编辑器：
  - `scripts/content-editor.rb`：本地 Ruby/WEBrick 服务。
  - `content-editor/index.html`、`content-editor/editor.js`、`content-editor/editor.css`：浏览器编辑界面。
  - 运行：`ruby scripts/content-editor.rb`
  - 打开：`http://127.0.0.1:4567/`
  - 预览：`PORT=4001 ./scripts/local-preview.sh`

- 编辑范围：
  - Homepage：Hero、首页 AI Tools 区、首页 Works 区、Contact / Footer 展示文字与首页主图。
  - AI Tools：读取并编辑 `_ai_products/*.md`。
  - Works：读取并编辑 `_projects/*.md`。
  - Archive：读取并编辑 `_data/worksarchive.yml`。
  - Blog、AI Digest、About 不进入编辑器。

- 首页内容结构化：
  - 新增 `_data/homepage.yml` 存放可维护首页文字、按钮、图片。
  - 改造 `index.html` 从 `_data/homepage.yml` 读取上述可编辑内容。
  - 保留 Blog、AI Digest、About 当前模板逻辑。

- 图片替换：
  - Works 图片复制到 `img/portfolio/real-works/<project-id>/`。
  - Archive 图片复制到 `img/portfolio/real-works/archive/`。
  - AI Tools 图片复制到 `img/ai-products/<tool-id>/`。
  - Homepage 图片复制到 `img/portfolio/homepage/`。
  - 自动更新对应 Markdown / YAML 路径。
  - 禁止写入仓库外路径、`.git`、`.env`、`_site`、`node_modules`。

- 文档与规则：
  - 更新 `docs/site-content-map.md`，加入编辑器使用方式、字段说明、图片替换方法。
  - 更新 `AGENTS.md`，写入长期协作规则：
    - 默认中文沟通。
    - 内容 schema 改动必须同步编辑器和说明文档。
    - 每次工作结束主动汇报可复用流程/记忆候选。
    - 写入 Codex 记忆前必须获得用户明确许可。

## Test Plan

- 运行语法检查：
  - `ruby -c scripts/content-editor.rb`

- 运行构建：
  - `./scripts/local-preview.sh build`

- 启动预览：
  - `PORT=4001 ./scripts/local-preview.sh`
  - `ruby scripts/content-editor.rb`

- 检查页面：
  - `http://127.0.0.1:4001/`
  - `http://127.0.0.1:4001/behop-ai-product/`
  - `http://127.0.0.1:4001/works/`
  - `http://127.0.0.1:4001/works/archive/`
  - `http://127.0.0.1:4567/`

- 验收标准：
  - 计划文件和索引存在，路径清晰。
  - 编辑器能读取 Homepage、AI Tools、Works、Archive。
  - 修改文字后保存，Jekyll 预览能显示变化。
  - 替换图片后路径正确，无坏链。
  - Blog、AI Digest、About 不出现在编辑器可编辑列表中。
  - 构建成功。

## Assumptions

- 编辑器只用于本地维护，不部署到 GitHub Pages。
- 首页可编辑内容只覆盖入口展示与联系/页脚文本，不覆盖 Blog、AI Digest、About。
- 设计、模板和代码结构仍由 agent 维护；你通过编辑器维护文字、图片、排序和公开状态。
- Codex 长期记忆文件暂不直接写入，除非你明确要求写入。

## Implementation Log

- Status: implemented
- Created: 2026-07-08
- Implemented: 2026-07-08
- Implementation owner: Codex
- Related files:
  - `_data/homepage.yml`
  - `scripts/content-editor.rb`
  - `content-editor/`
  - `docs/site-content-map.md`
  - `AGENTS.md`
- Verification:
  - `ruby -c scripts/content-editor.rb`
  - `./scripts/local-preview.sh build`
  - `GET /api/content/homepage`
  - `GET /api/content/projects`
  - `GET /api/content/ai-products`
  - `GET /api/content/archive`
  - same-content `POST /api/content/homepage/homepage`

## Follow-up Fix - 2026-07-08

- Issue: image replacement could stay on "正在上传并替换图片..." because WEBrick multipart uploads are `WEBrick::HTTPUtils::FormData` under the local Ruby runtime, not a Hash with `:tempfile`.
- Fix: `scripts/content-editor.rb` now reads upload bytes from FormData-compatible objects and returns clearer JSON status.
- UX update: `content-editor/editor.js` now has request timeouts, image validation, clear upload errors, disabled upload buttons during transfer, and restored button state after success/failure.
- Maintainability update: the editor now defaults to a simple page-section mode, with sections mapped to actual page locations. Advanced YAML field editing remains available for troubleshooting.
