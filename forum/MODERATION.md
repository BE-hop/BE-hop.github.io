# 设计 AI 情报维护与评论审核

## 栏目边界

AI 情报记录设计行业 AI 的理论研究、实践进展、产业动态与历史观察。访客只能在已有文章下评论；本站不再提供独立发帖、社区排行、会员或占位新闻入口。旧 /forum/ 与 /forum/topic/<slug>/ 地址保留，历史留言可在单独分类回看。

## 内容维护

站主条目维护于 js/forum-data.js。每条有 slug、双语 title/excerpt、date、category/tags 和 content。date 是站内发布日期，不冒充事件发生时间。可选 contentType 为 research、practice、industry、observation；外部资料记录 sources 数组（name 与 http/https url），可补 eventDate 和双语 designRelevance。来源缺失时不生成虚假出处。与博客重复的长文仅保留摘要、全文链接和讨论入口。

类型、主题、年份筛选、每页最多六项及完整双语详情由构建生成；默认列表不混入历史留言。新增内容后运行 npm run check 与 npm run browser:test。截图、生成图与流程示意须标明性质。

## 评论链路

1. 每篇评论提交继续使用 js/forum-config.js 的现有公开端点配置和 forum-client.js 的字段映射。
2. 发送 status 强制为 pending，page 保留原详情网址；审核通过才展示。
3. 管理者在已有后台审核；机器人同步 approved 快照，不能手工改写 assets/data/forum-*-approved.json。
4. 构建按 topicSlug 生成单篇评论 JSON；正文阅读不等待评论请求。

本轮不修改远端数据库、权限、凭证或审核工作流。公开网页只能使用已有 publishable key，service role key 仅留后台。Supabase 的 grants 与 RLS 是独立访问控制层；界面去掉发帖不等于撤销后台写入权限。

评论验证必须拦截请求，使用合成输入检查 pending、成功、失败、断网及重复点击，不提交真实评论。旧 forum_topics 数据、approved 快照与本地旧草稿继续保留；统计快照不再作为界面排行依据。
