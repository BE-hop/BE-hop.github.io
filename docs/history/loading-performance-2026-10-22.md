# 历史证据：非现行规范

2026-10-23整理前的原文。当前规范以根文档地图为准；本文中的缓存、动效与质量参数不再作为实施指令。

# 加载性能与 CDN 运维

## 实现与边界

2026-10-22：保留Jekyll静态输出与独立CSS/JS；关键入口、分类和分页合并主资源。博客正文、目录与按需搜索使用原生增强，论坛在构建时输出可读正文。图片源文件不改写，博客内联背景和详情封面均按网页显示需要使用衍生图。

受控导航立即显示完整缓存，后台检查更新并提示用户；显式刷新优先网络。未缓存页面和关键CSS/JS无固定8秒主动中止，收到响应头即交付响应流，完整正文成功后才写入缓存；已经交付的流不替换为另一页，断流提示手动重试。论坛辅助JSON保留独立的有限等待。首次访问仍受实际网络与浏览器行为约束，移除人为中止不等于消除网络延迟。

下方2026-10-16配置记录保留历史证据；实际已应用配置以文中“已应用”记录为准，不能将旧待办当成当前状态。2026-10-22未变更Cloudflare、DNS或SSL后台。

## 后台配置清单（须读取实际设置后应用）

正式入口：`https://www.behop.cn`。仓库配置、canonical、sitemap 与 robots 对齐此域名；修改仓库不能开启后台 HTTPS 或创建 CDN 缓存规则。

1. 确认 www DNS 指向 GitHub Pages，核查裸域 DNS 与跳转；DNS 查询不可从本机代理 fake-IP 推断真实解析。
2. 确认 GitHub Pages 自定义域名证书有效，Cloudflare 回源验证成功，再设置 Full (strict) 与 GitHub Enforce HTTPS。随后开启边缘 HTTP→HTTPS 和裸域→www 的单次正式跳转，保留路径与查询串。禁止以 Flexible 修复循环。
3. Cloudflare 规则按优先级配置：`/sw.js`、`/release.json`、`/assets/data/forum-*` 绕过边缘缓存；不得让后续规则覆盖该排除。
4. 正式域名公开 HTML（尾斜杠或 `.html`，GET/HEAD，无 Authorization）的 Edge TTL 为 300 秒，Browser TTL 尊重源站。使用响应头规则将此类 HTML 的 `Cache-Control` 设为 `public, max-age=0, must-revalidate`；边缘 TTL 必须显式覆盖，否则该头会阻止边缘缓存。
5. `/assets/bundles/` 和 `/media/optimized/` 的内容哈希文件可用一年 Edge/Browser TTL；旧文件必须保留足够更新窗口。带 `?v=<hash>` 的 CSS/JS 先维持默认缓存，若单独加长期规则必须保持完整查询串进入 cache key。sw/release/论坛快照不得命中长期规则。
6. 每次 Actions 部署成功后，用 Cloudflare Custom Purge 清理本次改动 HTML 的绝对 URL（列表页、双语文章、受影响详情及 sitemap/robots），不清理内容哈希资源。尚未配置自动清理时 HTML 最长允许 5 分钟边缘陈旧，不能声称发布立即生效。自动化须使用限定 zone 的 Cache Purge token，经单独配置后再接入 CI；不要把 token 写入仓库。
7. 验证 HTTP、HTTPS、裸域、GitHub 默认入口的完整跳转链；同一 HTML 第二次请求检查 `CF-Cache-Status`、`Age`，sw/release 检查未缓存。

2026-10-16 实际核查：GitHub CLI 未登录，但浏览器已登录。GitHub Pages 设置页显示正式链接仍为 HTTP，Enforce HTTPS 为禁用状态，提示域名未正确配置为支持 HTTPS，DNS 检查进行中。Cloudflare 后台停在登录页，无法核查其 DNS/SSL/缓存规则。上述后台修改及发布清理未执行，不能用仓库改动冒充后台已配置。

## 可复用验证

```bash
npm run check
python3 scripts/performance-probe.py --network-label current-route --samples 5
python3 scripts/performance-probe.py --base-url http://127.0.0.1:4001 --network-label local --samples 5
PORT=4001 ./scripts/local-preview.sh static
```

每种网络独立运行，明确标记大陆直连、代理、海外实际节点；脚本不关闭代理、不改变系统网络，标签不代表已验证地理位置。检查完整下载、重定向、TLS、首字节和失败率，不能仅看 HTTP 200。开发者工具另测禁用缓存冷访问、回访、FCP/LCP/CLS、Long Tasks 和请求瀑布；有限实验数据不等于访客 p75。目标 LCP ≤2.5 秒、CLS ≤0.1；已缓存页面直接交付，实际可读时间仍需浏览器测量。

浏览器覆盖 390/768px 与桌面：四个 Hero 按钮、双语、筛选、阅读器翻页、表单和编辑器。故障覆盖脚本挂起、正文中断、图片失败、离线、跨版本缓存与显式刷新。HTTP 缓存与 Service Worker 均须区分；首次进入没有浏览器离线缓存。

资料：[GitHub HTTPS](https://docs.github.com/en/pages/getting-started-with-github-pages/securing-your-github-pages-site-with-https)、[Cloudflare 缓存](https://developers.cloudflare.com/cache/get-started/)。

## 2026-10-16 验收记录

- `npm run check` 全部通过：12 项运行时用例、图片与版本管线测试、生成 CSS 校验、16 项编辑器用例（64 assertions）、生产构建、站点审计与 release 检查；审计 0 警告。
- Chrome 本地：首页、Works、作品集、AI Tools、博客、论坛及两类详情页可打开；首页双语切换可用，390px 四个 Hero 按钮完整显示，390/768px 无横向溢出，检查时无控制台错误。作品集从第1跨页实际翻到第2跨页，768px轻量图已解码；模拟主交互包等待12秒后503，标题、正文和四个入口仍存在。表单提交、完整编辑器 UI 和 LCP/CLS 定量验收仍须单列补测，不能以自动化检查替代。
- 六个 HTML 入口各 5 次：本地 30/30 完整成功，下载中位数约 0.001 秒；当前线上链路 16/30 完整成功，14 次 curl 超时，成功样本中位数约 4.313 秒。部分失败已有 200 响应头，证明仅检查状态码会漏报。线上尚未部署本次改动，本地对照不能当作优化提速倍率。
- 当前链路存在代理因素，尚无独立大陆直连与海外节点；这些数字不代表地区统计或真实访客 p75。域名/CDN 后台配置和线上性能目标仍未验收。

## Cloudflare 已应用配置（2026-10-16）

浏览器核查确认：根域和 www 的 CNAME 均指向 be-hop.github.io，开启代理；现有 www/wechat* Worker 必须保留。边缘 Universal SSL 有效，当前回源模式 Full，Always Use HTTPS 原关闭，现已启用并实测 HTTP 301 到同路径 HTTPS。

已启用三条互不重叠的缓存规则：

| 规则 | 实际范围与行为 |
| --- | --- |
| Public HTML - short edge cache | www 域名、GET/HEAD、无查询串与 Authorization；仅列出的公开列表页及 works/projects/AI/forum/2026 静态页面路径。Eligible for cache；Edge 尊重源站缓存头，无头绕过；Browser bypass。源站当前 max-age=600，即10分钟。 |
| Bypass updates, data and webhook | 两域名下 sw.js、release.json、assets/data/forum-*、wechat*、api/* 绕过缓存。 |
| Content-hash assets - one year | www 下 assets/bundles/、media/optimized/，GET/HEAD，Edge/Browser 一年；HTTP >=400 设置 No store，防止失败文件被长期存储。保留默认完整查询串cache key。 |

免费计划 UI 的自定义 Edge TTL 最低2小时，因此未硬设300秒，也未把HTML改成2小时。上述源站10分钟策略替代前文5分钟目标；发布后应清理受影响HTML，否则最长仍有10分钟边缘陈旧。若要精确5分钟，须另行验证可在缓存查找前设置CDN源响应头的方案，不能声称当前已实现。

实测首页已由MISS进入HIT，响应的Cache-Control包含no-store（Browser bypass），并不代表没有边缘缓存。sw/论坛快照仍为DYNAMIC；构造不存在的哈希资源路径返回404和BYPASS。即使命中HIT，当前客户端到LAX边缘的正文下载仍有停滞。六次协议小样本中，两次HTTP/2 gzip分别约2.99/12.78秒完整成功，两次HTTP/2 identity正文超时，两次HTTP/1.1 TLS超时；样本不足以断言协议或压缩是根因，不据此禁用某协议。

指定GitHub Pages源IP且保留www/根域SNI时，证书域名校验失败；GitHub HTTPS开关不可用的问题尚未修复。未切换DNS-only，也未开启Full(strict)。DNS-only会暂时绕过Cloudflare缓存及防护，可能中断wechat Worker，且在GitHub证书签发前出现HTTPS错误；恢复受DNS缓存影响。已向用户说明，需要另行明确授权和维护时段，未获授权前不操作。前端代码仍保留本地，未发布。

## Cloudflare 页面数据解读（2026-10-16 读取）

账户分析 Last 7 days：23.24k请求、947.14MB带宽、652访问量；加密请求28.91%、缓存请求2.22%、缓存带宽15.09%、4xx率54.25%、5xx率0.08%。这些是滚动窗口历史数据，变化箭头不是本次优化效果；请求和访问量不能等同真人数。当前域名列表仅一个域名，仍区分账户与域名口径。

域名 Requests Last 24 hours：约5.97k请求；2xx约2.44k、3xx215、4xx约3.31k、5xx2；具体404约3.25k，522两次。404下钻的路径排行主要探测.npmrc、.env、db.php、phpinfo.php等；匿名主来源及Curl客户端各约2.96k次，支持自动扫描解释。排行使用20%抽样并由后台估算，不能当全量精确日志；不保存具体IP，不按国家判断真实访客身份。

4xx高比例和低总缓存率均被大量无效路径请求影响，不意味着一半正常访客遇错，也不能据此证明扫描拖慢站点。低5xx率同样不证明正文完整下载或LCP达标。后续重点应是有效页面/资源命中、实际下载完成率与真实浏览器LCP/CLS；独立地区验收仍未完成。

## 2026-10-17 修复与复核

发现低清原因：源图有损压缩后再次以42/52质量编码WebP；CSS背景固定最小图；阅读器固定768px撑到1056px。原图备份188项SHA256校验通过，恢复187项被压缩图片。源图作为母版，网页尺寸仅在构建生成；派生URL包含转换策略指纹。

此次规则覆盖旧文中的8秒正文上限、480px背景和固定768px阅读规则：8秒仅等响应头，收到头后HTML/CSS/JS立即流式交付，完整下载后才存储。阅读器按画布/DPR选择清晰图，失败不阻塞翻页。照片质量82，展板及PNG质量90；480/768/1280/1920/2560px不超过源宽。恢复原生滚动；图片缓存容量索引初始化一次后增量更新。

本机当前链路六类HTML各两次均完成，但首页0.71/16.62秒、AI Tools1.47/16.49秒、论坛6.37/11.11秒，说明正文传输波动仍存在；这些不是LCP或跨地区验收。Cloudflare代理、SSL模式及微信Worker保持原配置，证书维护仍须单独授权。

### 本轮验证

- `npm run check`通过：14项运行时测试、2项图片测试、2项资源版本测试、16项编辑器测试/64断言；生产构建和站点审计0警告。
- Chrome：390px下首页四个Hero入口完整，首页、Works、阅读器、AI Tools、两类详情、博客、论坛无横向溢出；768px下四个关键入口页无溢出。桌面阅读器当前图从768px升级到源图允许的1774px；规划翻到第2页，切换景观册正常。模拟>=1280px图片503，保留预览并显示重试，仍能翻页。
- 同一当前机器链路六类HTML各5次：30/30完整下载，中位时间依次为首页1.25秒、Works0.98秒、作品集1.55秒、AI Tools0.90秒、博客1.27秒、论坛1.17秒。该组是发布前传输复测，不能归因于尚未发布的代码，也不替代首次绘制/LCP指标。
- 未代验：大陆直连与海外独立节点、LCP/CLS定量、表单真实提交及完整编辑器视觉操作。未改变相关表单和编辑器字段；此处保留限制，不声称跨地区零等待。

封面缩略图和全宽背景分别选图：`portfolio-books.css`以384px显示基准生成image-set，常见2倍屏选择768px封面，3倍屏至多1280px；全宽背景以1280px为基准，避免把三张小封面都按整屏高清下载。

### 加载可靠性与有界列表（2026-10-22）

本条覆盖此前“导航网络优先、1秒缓存竞争、关键CSS/JS等待8秒”的规则：已访问页面立即返回完整缓存，后台检查内容变化并提供手动更新；显式刷新等待网络，失败才回退缓存。未访问页面与关键CSS/JS不再使用固定8秒主动中止；慢请求继续，真实失败才降级。HTML完整下载成功后才缓存，中断不写入；论坛辅助数据可独立超时。仍保留用户主动升级、语言偏好和图片60MiB/100项上限。

`js/image-loading.js`提供接近视口图片的慢加载提示、真实失败提示和手动重试，不能取消仍在进行的下载；作品集阅读器由自身脚本管理状态，取消20秒整图中止，清晰图接近视口才增强，翻页不等下载。博客内联背景同样经过构建衍生图管线；源图与编辑器字段不变。

`scripts/paginate-content.rb`经统一Jekyll入口生成博客、Works、AI Tools静态分页，每页最多12项；工具与图库共用页容量。分类使用完整静态链接，每个分类独立分页；首页工具和作品各最多6项。新增条目仍维护原集合，不写生成页。`scripts/prepare-forum.mjs`从现有静态主题和审核快照生成论坛正文及6项分页列表，共用`js/forum-renderer.js`；列表只读摘要，详情只加载当前正文和当前主题评论。旧查询式主题链接保留兼容跳转；评论与统计不能阻塞正文。

`.asset-cache/`仅供构建缓存，不进入Git或站点；图片按源图与转换参数复用，当前及上一发布的哈希图片/合并资源保留，缓存缺失时不能承诺恢复上一版。Actions使用缓存恢复并上传当前结果。论坛同步仅计划/手动触发，语义数据无变化时不改写时间戳，不触发完整部署；代码push正常部署。Gemfile与Gemfile.lock固定已验证的github-pages 231依赖。

博客阅读、目录和按需搜索使用`js/blog-reading.js`原生增强，不再依赖jQuery/Bootstrap链。新接口均为构建产物，不扩大编辑器写入权限。实质修改运行`npm run check`并覆盖慢响应、断流、图片失败、旧缓存升级与移动端；本地数据不能代表大陆直连或多地区实测。

验收边界：首访仍依赖实际网络；移除人为中止不等于降低DNS/TLS/源站延迟。正式发布前保留源码差异与本地故障注入证据，发布后按真实链路分别测完整下载、LCP和CLS，Cloudflare配置变更仍需独立评估。上一发布资产保留需要Actions成功恢复上次`.asset-cache/`；首次启用无历史缓存时仅能保留当次资产，旧缓存修复入口仍须可用。

构建会输出`asset-manifest.json`，供下一版恢复当前公开版本的哈希资源。Actions构建前运行`scripts/restore-published-assets.py`：优先复用本地/Actions缓存，缺失时只读取本站公开资源；首次迁移从六个公开入口提取旧合并包。恢复失败保留已有缓存并明确记录，不阻断内容构建，也不能据此声称历史资源已全部恢复。

语言偏好恢复脚本保持async，不得为消除语言切换跳动而新增阻塞解析的外部脚本；独立缓存/恢复runtime先于应用样式与脚本开始加载。流式正文中断才保留重试提示，后台更新或缓存写入失败不得冒充正文中断。
