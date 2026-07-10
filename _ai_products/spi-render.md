---
title_zh: "SPI-Render 本地 GUI"
title_en: "SPI-Render Local GUI"
subtitle_zh: "图像 + prompt + 任务轮询 + 输出预览的本地渲染请求 MVP"
subtitle_en: "A local render-request MVP for image input, prompt editing, task polling, and output preview"
category: "Workflow Prototype"
category_zh: "工作流原型"
category_en: "Workflow Prototype"
visibility: public
image: "/img/ai-products/concepts/spi-render-concept.jpg"
cover: "/img/ai-products/concepts/spi-render-concept.jpg"
summary_zh: "SPI-Render 是一个本地 GUI 工具雏形，用于把图片、prompt、渲染请求、结果轮询、下载预览和日志排错收拢到一个桌面界面中。"
summary_en: "SPI-Render is a local GUI MVP that brings image input, prompt editing, render requests, result polling, download preview, and debugging logs into one desktop interface."
status_zh: "概念 MVP"
status_en: "Concept MVP"
tags:
  - Python
  - Tkinter
  - Render API
  - Task Polling
  - Desktop Utility
chips:
  - zh: "Concept visual"
    en: "Concept visual"
  - zh: "本地 GUI"
    en: "Local GUI"
  - zh: "日志排错"
    en: "Log Debugging"
order: 2
problem_zh: "当渲染能力来自接口调用时，设计师需要处理图片上传、prompt、任务 ID、轮询、下载和错误日志。SPI-Render 的想法是把这些技术步骤包装成设计师可以直接使用的本地窗口。"
problem_en: "When rendering depends on API calls, designers need to manage image upload, prompt, task id, polling, download, and error logs. SPI-Render packages these technical steps into a local window designers can use directly."
workflow:
  - zh: "选择输入图片"
    en: "Choose input image"
  - zh: "填写或修改 prompt"
    en: "Write or edit prompt"
  - zh: "提交渲染任务"
    en: "Submit render task"
  - zh: "轮询任务状态"
    en: "Poll task status"
  - zh: "下载结果并复制日志"
    en: "Download result and copy logs"
features:
  - zh: "本地配置保存：记录常用 prompt、输出目录和轮询参数。"
    en: "Local settings persistence for prompts, output folder, and polling parameters."
  - zh: "完整日志区：把请求流程和异常栈集中到可复制文本。"
    en: "Complete log panel that keeps request flow and exception traces copyable."
  - zh: "输出预览：下载后显示最新输出路径和结果预览。"
    en: "Output preview with latest output path and downloaded result."
tech_stack:
  - Python
  - Tkinter
  - Requests
  - PIL
  - Desktop packaging
input_output_zh: "输入为本地图片、prompt 和运行配置；输出为渲染图片、本地路径和可复制日志。公开页面不展示真实接口、token 或敏感抓包信息。"
input_output_en: "Input is a local image, prompt, and runtime settings. Output is rendered image, local path, and copyable logs. The public page does not expose real endpoints, tokens, or sensitive capture information."
demo_zh: "封面和流程图为概念示意图，用于说明工具体验，不代表真实生产截图。"
demo_en: "The cover and workflow diagram are concept visuals explaining the intended tool experience, not production screenshots."
before_image: "/img/ai-products/concepts/spi-render-flow.jpg"
after_image: "/img/ai-products/concepts/spi-render-concept.jpg"
before_label_zh: "工作流：输入、提交、轮询、预览、排错"
before_label_en: "Workflow: input, submit, poll, preview, debug"
after_label_zh: "概念界面图：本地 GUI 渲染工具"
after_label_en: "Concept UI: local GUI render tool"
limitations:
  - zh: "该页面只展示产品想法和本地 MVP 结构，不公开内部接口信息。"
    en: "This page shows product thinking and local MVP structure without exposing internal endpoint information."
  - zh: "当前更适合作为工作流工具雏形，而不是成熟商业产品。"
    en: "It is better understood as a workflow utility MVP rather than a mature commercial product."
next_steps:
  - zh: "完善错误状态、批量任务、输入图压缩和更安全的配置管理。"
    en: "Improve error states, batch tasks, input compression, and safer configuration handling."
---

### 中文介绍

SPI-Render 记录的是我如何把接口能力转译为本地工具体验：减少设计师面对技术参数、任务状态和调试日志时的割裂感。

### English

SPI-Render records how an API capability can become a local tool experience, reducing the gap between design work, technical task states, and debugging logs.
