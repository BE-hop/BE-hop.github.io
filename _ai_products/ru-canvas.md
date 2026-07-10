---
title_zh: "RU-Canvas 设计过程画布"
title_en: "RU-Canvas"
subtitle_zh: "把 SketchUp 模型组、参考图、备注与图版导出绑定起来的插件 MVP"
subtitle_en: "A SketchUp plugin MVP that binds model groups, references, notes, and board export"
category: "Workflow Prototype"
category_zh: "工作流原型"
category_en: "Workflow Prototype"
visibility: public
image: "/img/ai-products/concepts/ru-canvas-concept.jpg"
cover: "/img/ai-products/concepts/ru-canvas-concept.jpg"
summary_zh: "RU-Canvas / BEhop Design Canvas 尝试把设计过程资料绑定到 SketchUp Group，让参考图、备注、排序、锁定和导出图版成为模型工作的一部分。"
summary_en: "RU-Canvas / BEhop Design Canvas explores binding process material to SketchUp Groups, making references, notes, ordering, locking, and board export part of model-based work."
status_zh: "概念 MVP"
status_en: "Concept MVP"
tags:
  - SketchUp
  - Ruby Extension
  - Design Canvas
  - Reference Management
  - Board Export
chips:
  - zh: "Concept visual"
    en: "Concept visual"
  - zh: "SketchUp 插件"
    en: "SketchUp Plugin"
  - zh: "过程资产"
    en: "Process Assets"
order: 3
problem_zh: "设计过程中大量参考图、草图、备注和模型组之间经常脱节。RU-Canvas 的目标是让每个设计 Group 都带着自己的参考画布和输出图版，减少过程资料丢失。"
problem_en: "References, sketches, notes, and model groups often become disconnected during design work. RU-Canvas aims to let each design Group carry its own reference canvas and exportable board."
workflow:
  - zh: "选择对象并创建 Design Group"
    en: "Select objects and create Design Group"
  - zh: "拖入或粘贴参考图"
    en: "Drop or paste reference images"
  - zh: "为图片添加备注并排序"
    en: "Add notes and reorder images"
  - zh: "锁定 Canvas 保存过程状态"
    en: "Lock Canvas and save process state"
  - zh: "导出模型顶视图 + 参考图 + 备注图版"
    en: "Export board with top view, references, and notes"
features:
  - zh: "Group 绑定：通过 Attribute Dictionary 记录 group_id、canvas_id 和锁定状态。"
    en: "Group binding through Attribute Dictionary for group_id, canvas_id, and lock state."
  - zh: "外部 manifest：把 Canvas 数据写入 JSON，便于后续追踪和扩展。"
    en: "External manifest JSON for tracking and future expansion."
  - zh: "图版导出：导出模型顶视图、参考图列表和备注。"
    en: "Board export combining model top view, reference list, and notes."
tech_stack:
  - SketchUp Ruby
  - HtmlDialog
  - JavaScript
  - Canvas export
  - JSON manifest
input_output_zh: "输入为 SketchUp 选中对象、参考图和备注；输出为绑定后的设计 Group 数据、manifest 记录和 PNG/HTML 图版。"
input_output_en: "Input is selected SketchUp objects, reference images, and notes. Output is bound design group data, manifest records, and PNG/HTML boards."
demo_zh: "封面和流程图为概念示意图，用于解释插件体验，不代表最终正式界面。"
demo_en: "The cover and workflow diagram are concept visuals explaining the plugin experience, not final production UI."
before_image: "/img/ai-products/concepts/ru-canvas-flow.jpg"
after_image: "/img/ai-products/concepts/ru-canvas-concept.jpg"
before_label_zh: "工作流：Group、Canvas、整理、导出、复用"
before_label_en: "Workflow: group, canvas, organize, export, reuse"
after_label_zh: "概念界面图：SketchUp 设计过程画布"
after_label_en: "Concept UI: SketchUp design canvas"
limitations:
  - zh: "MVP 第一版主要支持 SketchUp Group，子组 Canvas 和 PPTX 输出仍是后续方向。"
    en: "The MVP mainly supports SketchUp Groups; subgroup canvases and PPTX export are future directions."
  - zh: "大图通过 HtmlDialog 传输时仍需增加压缩与尺寸限制。"
    en: "Large images through HtmlDialog still need compression and size limits."
next_steps:
  - zh: "增加图片压缩、Group 重命名同步、模板选择和 RBZ 打包脚本。"
    en: "Add image compression, group rename sync, template choices, and RBZ packaging."
---

### 中文介绍

RU-Canvas 展示的是“设计过程资产化”的方向：把参考图、备注和模型组绑定，让设计推敲不只停留在脑子里和零散文件夹里。

### English

RU-Canvas points toward process assetization: binding references, notes, and model groups so design thinking does not stay only in memory or scattered folders.
