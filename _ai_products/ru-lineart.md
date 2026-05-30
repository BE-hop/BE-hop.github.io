---
title_zh: "RU-LineArt 线稿转 Rhino"
title_en: "RU-LineArt"
subtitle_zh: "面向 Rhino 设计师的线稿转可编辑曲线工具"
subtitle_en: "A line-art to editable Rhino curve tool for design workflows"
category: "Design Tools"
category_zh: "设计工具"
category_en: "Design Tools"
image: "img/ai-products/ru-lineart-output.png"
cover: "img/ai-products/ru-lineart-output.png"
summary_zh: "将平面单线草图自动转换为 Rhino 可编辑的开放 NURBS 曲线，保留交叉拓扑并支持手绘稳线。"
summary_en: "Convert planar single-line sketches into editable open NURBS curves in Rhino with crossing topology preservation and optional hand-drawn stabilization."
status_zh: "实验中 / 可下载测试"
status_en: "Experimental / downloadable prototype"
tags:
  - Rhino
  - Python
  - Image Processing
  - NURBS
  - Workflow Automation
chips:
  - zh: "Sketch to Rhino"
    en: "Sketch to Rhino"
  - zh: "NURBS 输出"
    en: "NURBS Export"
  - zh: "交叉保拓扑"
    en: "Topology Preserving"
order: 0
cta_url: "https://github.com/BE-hop/RU-LineArt"
cta_zh: "查看 GitHub 项目"
cta_en: "View on GitHub"
version_json_url: "/behop-ai-product/products/ru-lineart/version.json"
download_url: "https://pan.baidu.com/s/1OhS-jhTj-7js1M2jRU-ocA?pwd=hoop"
download_label: "BEhop-LineArt_updating"
download_code: "hoop"
download_tip_zh: "点击按钮即可下载最新安装包。"
download_tip_en: "Click the button to download the latest package."
problem_zh: >-
  设计师在前期方案中经常通过手绘、截图、线稿表达空间想法，但这些图像难以直接进入 Rhino 建模流程。
  RU-LineArt 尝试把“图像线条”转换为“可编辑曲线”，减少从草图到建模之间的重复描线工作。
problem_en: >-
  Designers often use hand sketches, screenshots, and line drawings to express early spatial ideas, but these images are difficult to bring directly into Rhino modeling.
  RU-LineArt explores how image-based lines can become editable curves, reducing repetitive tracing between sketching and modeling.
target_users:
  - zh: "景观设计学生"
    en: "Landscape design students"
  - zh: "建筑 / 景观设计师"
    en: "Architecture and landscape designers"
  - zh: "Rhino 使用者"
    en: "Rhino users"
  - zh: "需要将草图、线稿、概念图转为可编辑曲线的人"
    en: "People who need to convert sketches, line art, or concept images into editable curves"
workflow:
  - zh: "图像预处理"
    en: "Image preprocessing"
  - zh: "骨架提取"
    en: "Skeletonization"
  - zh: "线段提取"
    en: "Segment extraction"
  - zh: "曲线拟合"
    en: "Curve fitting"
  - zh: "Rhino .3dm 导出"
    en: "Rhino .3dm export"
features:
  - zh: "Polyline export：输出可编辑折线，用于快速进入建模或二次整理。"
    en: "Polyline export: outputs editable polylines for quick modeling or cleanup."
  - zh: "NURBS curve export：将线稿拟合为 Rhino 中可编辑的开放 NURBS 曲线。"
    en: "NURBS curve export: fits line art into editable open NURBS curves in Rhino."
  - zh: "Mixed line + curve export：根据线条特征混合输出直线与曲线。"
    en: "Mixed line + curve export: combines line and curve output based on stroke characteristics."
  - zh: "保留交叉拓扑，并提供调试图层辅助检查结果。"
    en: "Preserves crossing topology and provides debug layers for result inspection."
tech_stack:
  - Python
  - Image processing
  - Skeletonization
  - Curve fitting
  - Rhino .3dm export
  - Design workflow automation
input_output_zh: "输入为手绘草图、线稿图像或概念线图；输出为可在 Rhino 中编辑的 Polyline、NURBS curve 或 Mixed line + curve `.3dm` 文件。"
input_output_en: "Input can be a hand sketch, line-art image, or conceptual line drawing. Output is an editable Rhino `.3dm` file with polyline, NURBS curve, or mixed line + curve results."
demo_zh: "当前版本重点验证从单线图像到 Rhino 可编辑曲线的基础流程，适合用于前期草图整理、方案线稿重建和工作流实验。"
demo_en: "The current version focuses on validating the basic pipeline from single-line imagery to editable Rhino curves, suitable for early sketch cleanup, concept line reconstruction, and workflow experiments."
before_image: "/img/ai-products/ru-lineart-input.jpg"
after_image: "/img/ai-products/ru-lineart-output.png"
before_label_zh: "输入：手绘 / 线稿图像"
before_label_en: "Input: sketch or line-art image"
after_label_zh: "输出：Rhino 可编辑曲线结果"
after_label_en: "Output: editable Rhino curve result"
github_url: "https://github.com/BE-hop/RU-LineArt"
version_history:
  - version: "v0.1"
    date: "2026-02-15"
    zh: "建立从线稿图像到 Rhino 曲线导出的基础流程。"
    en: "Established the initial pipeline from line-art image input to Rhino curve export."
  - version: "v0.2"
    date: "2026-02-16"
    zh: "优化手绘线条稳定处理与交叉拓扑保持。"
    en: "Improved hand-drawn stroke stabilization and crossing topology preservation."
  - version: "v0.3"
    date: "2026-02-26"
    zh: "补充 Polyline、NURBS curve 与 Mixed line + curve 输出模式。"
    en: "Added polyline, NURBS curve, and mixed line + curve export modes."
limitations:
  - zh: "当前更适合线条清晰、背景简单的输入图像；复杂材质、阴影或低对比图像仍需预处理。"
    en: "Current results are more reliable on clear line drawings with simple backgrounds; complex textures, shadows, or low-contrast images still require preprocessing."
  - zh: "输出曲线仍可能需要设计师在 Rhino 中进行局部清理、合并或重构。"
    en: "Output curves may still need local cleanup, joining, or reconstruction inside Rhino."
  - zh: "该工具目前是工作流实验和原型，不应被理解为完整商业产品。"
    en: "The tool is currently a workflow experiment and prototype, not a finished commercial product."
next_steps:
  - zh: "继续提升复杂线稿的分段稳定性和曲线拟合质量。"
    en: "Improve segmentation stability and curve fitting quality for more complex line drawings."
  - zh: "探索与 Rhino / Grasshopper 的更直接交互方式。"
    en: "Explore more direct interaction with Rhino and Grasshopper."
  - zh: "补充更多真实设计草图案例，用于验证工具在景观设计流程中的适用边界。"
    en: "Add more real design sketch cases to test the tool's boundaries in landscape design workflows."
---
### 中文介绍
RU-LineArt 专注于把平面线稿图片转换为 Rhino 可编辑的 `.3dm` 开放 NURBS 曲线，帮助你从草图表达更快进入建模阶段。
仓库地址：[https://github.com/BE-hop/RU-LineArt](https://github.com/BE-hop/RU-LineArt)
下载包（百度网盘）：[{{ page.download_label }}]({{ page.download_url }})  
提取码：`{{ page.download_code }}`

### 前后对比 / Before & After
<div style="display:grid; grid-template-columns:repeat(auto-fit,minmax(280px,1fr)); gap:16px; margin:12px 0 4px;">
  <figure style="margin:0;">
    <figcaption style="margin:0 0 8px;">输入图（Input）</figcaption>
    <div style="height:320px; display:flex; align-items:center; justify-content:center; background:#101218; border-radius:8px; overflow:hidden;">
      <img src="/img/ai-products/ru-lineart-input.jpg" alt="RU-LineArt 输入图" style="max-width:100%; max-height:100%; object-fit:contain;" />
    </div>
  </figure>
  <figure style="margin:0;">
    <figcaption style="margin:0 0 8px;">输出图（Output）</figcaption>
    <div style="height:320px; display:flex; align-items:center; justify-content:center; background:#101218; border-radius:8px; overflow:hidden;">
      <img src="/img/ai-products/ru-lineart-output.png" alt="RU-LineArt 输出图" style="max-width:100%; max-height:100%; object-fit:contain;" />
    </div>
  </figure>
</div>

### 产品亮点
支持交叉结构拓扑保持、多曲线输出与可选手绘稳线流程，在保证可编辑性的同时提升曲线流畅度。通过调试图层与报告输出，可快速完成参数迭代与质量检查。

### English
RU-LineArt converts planar sketch line images into editable open NURBS curves in Rhino (`.3dm`), reducing manual rebuild work between sketching and modeling.
Repository: [https://github.com/BE-hop/RU-LineArt](https://github.com/BE-hop/RU-LineArt)
Download package (Baidu Netdisk): [{{ page.download_label }}]({{ page.download_url }})  
Access code: `{{ page.download_code }}`

### Highlights
It supports topology-preserving crossing extraction, single or multi-curve export, and optional anti-jitter stabilization before fitting. Debug artifacts and reports make tuning and QA straightforward.
