# 本地内容编辑器智能体规则

继承根AGENTS。本文件适用于content-editor与Ruby编辑服务。

## 产品契约

- 服务仅绑定127.0.0.1，保持本地维护工具定位。
- 实际Jekyll页面是默认编辑面；源码路径和schema路径留在内部，界面显示可理解的标签。
- 支持全站设置、首页、Works、AI Tools、AI Gallery、Archive、About和双语Blog；AI Digest仍走原审核链。
- UI、服务端验证、文档和测试使用一致schema。高级JSON/Markdown视图须安全序列化回YAML/正文。
- 编辑桥仅在development中加载；生产输出不包含桥引用或编辑绑定属性。
- IME组合输入在compositionend前只更新本地草稿，失焦后才同步同字段其他位置，保留焦点与光标。

## 写入和发布

- 每个变更请求验证Host、Origin、CSRF、方法、类型、大小、字段及规范化路径。
- 上传仅允许经字节签名验证的JPEG、PNG、WebP、GIF，不信任文件名或浏览器MIME。
- 使用原子写入和本地历史；软删除进入被忽略的编辑器状态目录。
- 多记录保存先整体验证，失败时恢复全部内容、已最终写入的图片与会话跟踪。
- 剪贴板图片与上传复用同一验证、草稿、路径和最终写入流程。
- Git与构建命令使用参数数组，不拼接用户输入。
- 发布仅允许干净启动、当前会话变化且位于allowlist的文件；拒绝远端分叉及越界路径。
- 发布展示精确文件列表并二次确认；不自动pull/rebase、全量暂存或force-push。

## 验证与路由

- 服务端、schema、上传、历史或发布改动运行npm run editor:test。
- 模板数据流、schema变化运行构建与站点审计，同步docs/site-content-map.md。
- 图片、缓存和发布版本以[性能规范](../docs/loading-performance.md)为唯一现行来源。
- 模板图片用途属性不是内容schema；保留data-original-src，替换草稿清除旧srcset，草稿不得被延迟预览覆盖。
- 异步语言恢复不得覆盖contenteditable、当前焦点或编辑草稿节点。
- 操作流程见本目录README。
