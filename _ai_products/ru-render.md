---
title_zh: RU-Render Rhino AI 渲染
title_en: RU-Render
subtitle_zh: Rhino + 本地 API + AI 图像渲染的单路径原型
subtitle_en: A single-path Rhino + local API + AI image rendering prototype
category: Rendering Workflow
category_zh: 渲染工作流
category_en: Rendering Workflow
visibility: public
image: "/img/ai-products/ru-render/cover.jpg"
cover: "/img/ai-products/ru-render/cover-20260708-185937-wecomsave_6d5af19bd1a21709b94707978b9127cd-png.png"
summary_zh: RU-Render 将 Rhino 视口、桌面端、本地 FastAPI 与 AI 图像生成连接起来，验证从设计模型到渲染输出的一键式工作流。
summary_en: RU-Render connects Rhino viewport capture, a desktop app, a local FastAPI
  service, and AI image generation to test a one-click workflow from design model
  to rendered output.
status_zh: 真实原型
status_en: Real Prototype
tags:
- Rhino
- FastAPI
- Desktop UI
- Qwen Image
- Workflow Automation
chips:
- zh: Rhino 插件
  en: Rhino Plugin
- zh: 本地 API
  en: Local API
- zh: 渲染历史
  en: Render History
order: 1
problem_zh: 设计师在 Rhino 中完成体块或空间推敲后，常需要把视口截图、提示词、渲染工具和结果保存串联起来。这个过程容易分散在多个软件和文件夹中。
problem_en: After modeling or spatial exploration in Rhino, designers often need to
  connect viewport capture, prompts, rendering tools, and result storage across multiple
  tools and folders.
target_users:
- zh: Rhino 设计师
  en: Rhino designers
- zh: 需要快速从模型进入 AI 渲染的人
  en: Designers who need fast model-to-AI rendering
- zh: 希望沉淀渲染历史和 prompt 的工作流使用者
  en: Workflow users who want render history and prompt records
workflow:
- zh: Rhino 捕捉视口
  en: Capture Rhino viewport
- zh: 桌面端启动本地 API
  en: Start local API from desktop app
- zh: 输入 API Key、图片与提示词
  en: Input API key, image, and prompt
- zh: 异步任务生成渲染图
  en: Generate render through async task
- zh: 保存图片、prompt 与历史记录
  en: Save image, prompt, and history
features:
- zh: 本地 FastAPI 渲染端点：提供 POST /render 与任务轮询。
  en: Local FastAPI render endpoint with POST /render and task polling.
- zh: 桌面端一键启动：自动启动本地服务，并同步 Rhino 插件。
  en: 'Desktop one-click flow: starts local service and syncs Rhino plugin payload.'
- zh: Rhino 插件脚手架：支持 RURender 与 RURenderConfig 命令。
  en: Rhino plugin scaffold with RURender and RURenderConfig commands.
- zh: 历史输出结构：按日期、项目和 task_id 保存图片与元数据。
  en: History output structure organized by date, project, and task id.
tech_stack:
- Python
- FastAPI
- RhinoCommon
- C#
- Desktop packaging
- Qwen image API
input_output_zh: 输入为 Rhino 视口图像或本地图片、API Key 与 prompt；输出为 AI 渲染图以及可追踪的历史记录。
input_output_en: Input is a Rhino viewport image or local image, API key, and prompt.
  Output is an AI-rendered image with trackable history records.
demo_zh: 以下图像来自 RU-Render 历史输出中的真实可用结果，已排除 1x1 占位图、灰底测试图和 CI 文本图。
demo_en: The images below are real usable outputs from RU-Render history, excluding
  1x1 placeholders, grey test images, and CI text images.
before_image: "/img/ai-products/ru-render/before_image-20260708-190350-wecomsave_286e35b1d2e855a6ad7a974f3a06afec-png.png"
after_image: "/img/ai-products/ru-render/after_image-20260708-190913-output1.png"
before_label_zh: 输入 / 过程：模型或测试视图
before_label_en: 'Input / process: model or test view'
after_label_zh: 输出：AI 渲染结果（from_Geogle_model)
after_label_en: 'Output: AI architectural rendering result'
result_gallery:
- image: "/img/ai-products/ru-render/result-1.jpg"
  caption_zh: 建筑渲染测试结果 01
  caption_en: Architectural render test output 01
- image: "/img/ai-products/ru-render/result-2.jpg"
  caption_zh: 建筑渲染测试结果 02
  caption_en: Architectural render test output 02
- image: "/img/ai-products/ru-render/result-3.jpg"
  caption_zh: 模型/物体渲染工作流测试
  caption_en: Model/object render workflow test
limitations:
- zh: 当前仍是内部原型，重点验证单路径工作流和本地调用链。
  en: It is still an internal prototype focused on validating the single-path workflow
    and local call chain.
- zh: 输出质量依赖输入图像、prompt 和外部模型能力。
  en: Output quality depends on input image, prompt, and external model capability.
next_steps:
- zh: 继续完善 Rhino 插件稳定性、打包流程和真实设计场景的评测样例。
  en: Improve Rhino plugin stability, packaging, and evaluation cases from real design
    scenarios.
---
### 中文介绍

RU-Render 是把设计软件、AI 图像模型和本地工具链连接起来的一次原型实践。重点不是单张渲染图，而是把“模型输入、prompt、任务状态、输出文件、历史记录”组织成可复用工作流。

### English

RU-Render is a prototype practice that connects design software, AI image models, and a local workflow toolchain. The focus is not only one rendered image, but the reusable workflow around model input, prompt, task status, output files, and history records.
