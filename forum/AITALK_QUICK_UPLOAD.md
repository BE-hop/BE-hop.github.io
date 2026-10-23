# AI 情报人工维护流程

1. 在 js/forum-data.js 的站主条目中新增或更新一条，slug 保持稳定，并准备完整中英文标题、摘要与正文。
2. 明确 contentType：理论研究 research、实践 practice、产业 industry、历史观察 observation。date 为站内发布时刻；eventDate 为可选事件日期。
3. 外部研究填写 sources 的真实出处和 designRelevance；不把个人观点包装成论文或已验证新闻。AI 对话来源须标明原始对话。
4. 已有双语博客是完整正文唯一来源时，情报只写摘要及对应语言全文链接。
5. 运行 npm run check、npm run browser:test，在本地预览核对类型／主题／年份、分页、双语和评论。
6. 审阅明确变更列表后按根 README 的正式发布流程操作；不要全量暂存，不运行带 secret 的同步命令。

审核快照由机器人维护，新增站主文章不通过访客发帖 API。更多说明见 MODERATION.md。
