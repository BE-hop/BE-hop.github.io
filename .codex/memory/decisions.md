# 项目决策索引

最后核对：2026-10-23。证据：本次用户执行的流畅化计划及对应源码；失效条件：用户改变访问优先级或交付架构。

- 网站以大陆手机和普通网络的展示速度优先；保留风格并简化动效，高清通过主动查看加载。当前参数统一见docs/loading-performance.md。
- 清晰母版、既有内容集合和本地编辑器写入边界保留；数据映射见docs/site-content-map.md。
- 自动离线退役依赖先修HTTP缓存，不用删除worker地址或强制重载迁移。上线状态必须读取实际响应头，源码不能证明后台配置。
- 专业内容仍英文优先并保留中文镜像；策略来源见docs/career-content-strategy-memory.md。
- master部署和归档视觉分支边界见根AGENTS；历史决策全文见docs/history/decisions-before-fluency.md。旧1秒/8秒缓存竞争、默认高清、自动下移与复杂翻页决策已被本次计划替代。
