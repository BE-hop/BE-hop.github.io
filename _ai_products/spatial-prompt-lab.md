---
title_zh: "SPL 空间表达风格字典"
title_en: "SPL · Spatial Prompt Lab"
subtitle_zh: "面向室内、建筑与景观设计的离线表达字典"
subtitle_en: "An offline visual expression dictionary for interior, architecture, and landscape design"
category: "Design Tools"
category_zh: "设计工具"
category_en: "Design Tools"
visibility: public
image: "/img/ai-products/spatial-prompt-lab/interior-list.jpg"
cover: "/img/ai-products/spatial-prompt-lab/interior-list.jpg"
summary_zh: "浏览 104 种表达候选与 227 个专业配方，比较例图并复制中英文提示词，为自己的空间设计寻找合适的视觉表达。"
summary_en: "Explore 104 expression candidates and 227 discipline-specific recipes, compare examples, and copy Chinese or English prompts for your own spatial designs."
status_zh: "离线 v1 / 生成示例待确认"
status_en: "Offline v1 / generated examples awaiting review"
tags:
  - Spatial Design
  - Prompt Library
  - Offline HTML
  - Visual Expression
chips:
  - zh: "104 种表达候选"
    en: "104 expression candidates"
  - zh: "227 个专业配方"
    en: "227 discipline recipes"
  - zh: "中英文提示词"
    en: "Chinese / English prompts"
order: 4
download_url: "https://pan.baidu.com/s/11tiBshj1vVxmcvOwMxtp0Q?pwd=hoop"
download_label: "SPL-Spatial-Prompt-Lab"
download_code: "hoop"
download_tip_zh: "前往百度网盘下载，完整下载后打开 Spatial-Prompt-Lab-v1.html，无需安装。离线单文件约 197 MiB；图像生成需另用外部工具。"
download_tip_en: "Download via Baidu Netdisk, then open Spatial-Prompt-Lab-v1.html without installation. The offline file is about 197 MiB; image generation requires a separate tool."
problem_zh: "空间设计表达不只是切换天气和色温。SPL 将线条、色面、媒介纹理、空间深度和信息组织整理成可浏览的表达字典，帮助设计师先选表达，再调整参数，并理解输入条件与适用边界。"
problem_en: "Spatial representation involves more than changing weather or color temperature. SPL organizes linework, color, media texture, spatial depth, and information structure into a browsable dictionary, helping designers choose an expression before tuning parameters and understand its input requirements."
target_users:
  - zh: "室内、建筑与景观设计师及学生"
    en: "Interior, architecture, and landscape designers and students"
  - zh: "希望用自己的设计图探索 AI 辅助表达的创作者"
    en: "Creators exploring AI-assisted representation with their own design images"
workflow:
  - zh: "选择室内、建筑或景观"
    en: "Choose a design discipline"
  - zh: "搜索、筛选并比较表达"
    en: "Search, filter, and compare"
  - zh: "查看例图及输入条件"
    en: "Inspect examples and requirements"
  - zh: "复制中文或英文完整词"
    en: "Copy a Chinese or English prompt"
  - zh: "在外部工具生成并检查结果"
    en: "Generate externally and evaluate"
features:
  - zh: "11 个浏览家族，涵盖摄影、手绘、绘画、版画、拼贴、模型抽象及专业分析等表达方向。"
    en: "11 browsing families covering photography, drawing, painting, printmaking, collage, model abstraction, and analytical representation."
  - zh: "104 种表达候选按专业适配：室内 74、建筑 81、景观 72，共 227 个配方，各有中英文版本。"
    en: "104 expression candidates adapted into 74 interior, 81 architecture, and 72 landscape recipes: 227 recipes, each in Chinese and English."
  - zh: "中英文名称、视觉特征及来源别名搜索；按输入、类型与状态筛选，最多同时比较 3 个条目。"
    en: "Search names, visual features, and source aliases; filter by input, type, and status, and compare up to three entries."
  - zh: "查看实际生成图、对应输入案例及实际使用词。227 张示例完成一轮生成，当前全部为已试验待确认。"
    en: "Inspect generated images, their reference inputs, and the actual prompts used. All 227 examples have completed one generation round and await review."
  - zh: "页面、提示词和预览图内嵌在单个 HTML 中，下载后可离线浏览；外部来源链接需要网络。"
    en: "The page, prompts, and previews are embedded in one HTML file for offline browsing; external source links require internet access."
  - zh: "默认保留原设计；涉及形体、材料或布局改造的内容作为可选段使用。"
    en: "Prompts preserve the existing design by default; changes to form, materials, or layout are kept in optional sections."
tech_stack:
  - HTML / CSS / JavaScript
  - Structured JSON
  - Python build tools
  - Embedded image previews
input_output_zh: "在字典中选择表达，复制完整提示词，再与自己的参考图一起交给外部图像工具。SPL 本身不调用图像模型；字典输出是提示词与表达参考，生成结果需人工检查。"
input_output_en: "Choose an expression, copy its full prompt, and use it with your reference image in a separate image tool. SPL does not call an image model; it provides prompts and visual references, with generated results requiring human evaluation."
demo_zh: "以下为真实中文界面截图，分别展示条目详情和完整提示词复制入口。示例由对应专业案例图生成，均待确认；截图用于说明操作，不证明设计忠实度或跨模型稳定性。"
demo_en: "Actual Chinese-language UI screenshots below show entry details and the full-prompt copy controls. Examples were generated from discipline-specific reference images and await review. These screenshots explain the interface, not design fidelity or cross-model reliability."
before_image: "/img/ai-products/spatial-prompt-lab/interior-detail.jpg"
after_image: "/img/ai-products/spatial-prompt-lab/interior-copy.jpg"
before_label_zh: "真实界面：表达详情与生成示例"
before_label_en: "Actual UI: expression details and generated example"
after_label_zh: "真实界面：完整提示词与复制入口"
after_label_en: "Actual UI: full prompt and copy controls"
limitations:
  - zh: "104 是表达候选数，227 是按专业适配的配方数，不代表 227 种不同风格。当前全部生成记录为待确认，不能视为已验证效果。"
    en: "104 counts expression candidates; 227 counts discipline-specific recipes, not distinct styles. All current generation records await review and do not establish validated effects."
  - zh: "专业分析需要相应图纸、结构、路径或生态资料。单张透视图无法证明隐藏空间、构造或性能事实。"
    en: "Analytical representations require relevant drawings, structural, circulation, or ecological information. A single perspective image cannot establish hidden geometry, construction, or performance facts."
  - zh: "图像工具与模型会影响结果；应检查构件、材料、空间关系及设计是否被误改，不保证换图或换模型后结果一致。"
    en: "Results depend on the image tool and model. Check elements, materials, spatial relationships, and unintended design changes; consistency across inputs or models is not guaranteed."
  - zh: "离线 HTML 约 197 MiB，需完整下载；首次打开可能较慢。网盘访问可能需要登录，外部来源链接不支持离线。"
    en: "The offline HTML is about 197 MiB and must download fully; initial opening may take time. Netdisk access may require login, and external sources are unavailable offline."
next_steps:
  - zh: "逐项审核视觉差异、设计忠实度与表达机制，修订相似或失真的配方。"
    en: "Review visual distinctions, design fidelity, and expression mechanisms, then revise overlapping or distorted recipes."
  - zh: "使用更多输入图检查迁移能力，继续补充本土表达与类型覆盖。"
    en: "Test transfer to more reference images and expand local expressions and typological coverage."
---
