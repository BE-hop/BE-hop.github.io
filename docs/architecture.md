# 工程架构

## 交付链

内容集合与_data → Jekyll静态页面/分类分页 → 论坛静态正文 → 图片与资源管线 → 质量检查 → Actions部署。
所有页面保留静态正文，浏览器JS只增强语言、导航、阅读器与按需查看。

## 源码和生成物

| 模块 | 源码职责 | 生成物 |
| --- | --- | --- |
| 内容 | 集合Markdown、_data、img母版 | Jekyll正文、分页 |
| 模板 | _layouts、_includes、各HTML入口 | 同路径公开页面 |
| 浏览器 | css、js；viewer只点击后加载 | 基础包与页面包，各最多两份 |
| 分页 | scripts/paginate-content.rb | 每页最多12项，论坛6项 |
| 论坛 | prepare-forum.mjs、forum-renderer.js | 静态正文、摘要与当前主题评论数据 |
| 图片 | media-variants.py | 封面、阅读、高清衍生图 |
| 集成 | jekyll-with-assets.rb、prepare-site.py | release、资源清单及版本引用 |
| 编辑器 | scripts/content-editor.rb、content-editor | 本地草稿与允许内容写入 |

scripts保持扁平目录，通过职责索引定位；Python/Ruby相对导入和脚本入口不随意搬家。
_site、.asset-cache、node_modules和test-results是生成物或依赖；不提交、不作为内容维护入口。
archive是公开内容区域，工程历史放docs/history，二者不能混用。

## 命令与验证

npm run dev只启动可靠预览；legacy:watch专门维护hux-blog LESS/JS；css:build专门生成Tailwind。
npm run check覆盖功能与静态预算，browser:test覆盖真实浏览器交互与固定实验条件性能。
浏览器测试使用loopback服务和独立临时浏览器上下文，不提交表单、不改个人内容。

## 数据契约

模板用data-media-role与sizes声明展示用途；普通内容默认阅读图，既有链接不嵌套。
构建保留data-original-src并添加高清入口，不改YAML字段、不扩大编辑器allowlist。
新viewer模块只经点击动态导入，导入地址按内容哈希版本化。
当前及兼容资源进入asset-manifest，供后续构建恢复；转换参数参与图片指纹。
缓存、保留窗口与发布门禁统一见[性能规范](loading-performance.md)。
