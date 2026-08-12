---
layout: post
title: "2026 年第一季度总结：如何在设计工作中使用 AI"
subtitle: "视觉图像、叙述故事，以及从经验复用到工作流"
date: 2026-08-12
author: liu.ruyuan
lang: zh
tags: [AI, 设计工作流, AIGC, 景观设计, Agent]
---

> English version: `/2026/08/12/ai-in-design-work-q1-review-en/`

<style>
.ai-review-lead{margin:1.5rem 0 2.5rem;padding:1.25rem 1.4rem;border-left:4px solid #0f766e;background:#f3f7f5;border-radius:0 12px 12px 0}.ai-review-lead p{margin:.35rem 0}.ai-evidence{margin:1.5rem 0 2.6rem;padding:18px;background:#f5f6f4;border:1px solid #e1e5e1;border-radius:16px}.ai-evidence__title{margin:0 0 14px;font-size:15px;line-height:1.6;font-weight:600;color:#38534a}.ai-evidence__grid{display:grid;grid-template-columns:repeat(var(--cols,2),minmax(0,1fr));gap:12px;align-items:stretch}.ai-evidence figure{display:flex;flex-direction:column;min-width:0;margin:0;background:#fff;border:1px solid #dde2de;border-radius:11px;overflow:hidden}.ai-evidence__image{display:flex;align-items:center;justify-content:center;height:260px;padding:8px;background:#e9ece9}.ai-evidence img{display:block;width:100%;height:100%;margin:0!important;object-fit:contain}.ai-evidence figcaption{flex:1;margin:0;padding:10px 12px;font-size:13px;line-height:1.55;color:#53625c;background:#fff}.ai-evidence--flow .ai-evidence__grid{grid-template-columns:1fr}.ai-evidence--flow .ai-evidence__image,.ai-evidence figure.ai-evidence__wide .ai-evidence__image{height:auto;min-height:0;padding:0;background:#111}.ai-evidence--flow img,.ai-evidence figure.ai-evidence__wide img{height:auto;max-height:none;object-fit:initial}.ai-evidence figure.ai-evidence__wide{grid-column:1/-1}.ai-step{display:inline-block;margin-right:6px;color:#0f766e;font-weight:700}.ai-flow{margin:1.25rem 0 2rem;padding:14px 16px;border:1px solid #d9e4df;border-radius:12px;background:#fbfcfb;font-family:Menlo,Monaco,Consolas,monospace;font-size:14px;line-height:1.8;color:#27453b}.post-container h2{margin-top:3.2rem}.post-container h3{margin-top:2.3rem}.post-container h4{margin-top:1.8rem}@media(max-width:767px){.ai-evidence{margin-left:-5px;margin-right:-5px;padding:10px}.ai-evidence__grid{grid-template-columns:1fr}.ai-evidence__image{height:auto;min-height:0;max-height:420px;padding:8px}.ai-evidence img{height:auto;max-height:400px}.ai-evidence--flow .ai-evidence__image,.ai-evidence figure.ai-evidence__wide .ai-evidence__image{max-height:none;padding:0}.ai-evidence--flow img,.ai-evidence figure.ai-evidence__wide img{max-height:none}.ai-evidence figcaption{font-size:12px}.ai-flow{font-size:12px;overflow-wrap:anywhere}}
</style>

<div class="ai-review-lead">
  <p><strong>设计语境下，AI 目前最基础的两类功能是：视觉图像与叙述故事。</strong></p>
  <p><strong>经验复用的方向是形成工作流：</strong>从 AI 知识了解与故事线搭建，到意向图生成与寻找、方案绘制、模型制作与深化，最后形成一体化表达。</p>
  <p><strong>待发展与完善的功能是逻辑规划：</strong>让 Agent 根据任务判断并组合不同工作片段。</p>
</div>

这篇文章记录我在 2026 年第一季度的实际使用方式。重点不是展示 AI 能生成多少图片，而是梳理它在设计流程中已经能承担什么、如何与 D5、Photoshop、模型和参数化工具配合，以及它目前的边界在哪里。

## 一、视觉

### 1. 效果图

#### 1.1 D5 效果图与 AI 结合

D5 负责空间、材质、镜头和基础光照，AI 则继续处理氛围、季相、植物层次和细节。两者结合的价值，是先用可控的模型和渲染建立空间基础，再利用 AI 扩大视觉探索范围。

<section class="ai-evidence" style="--cols:2">
  <p class="ai-evidence__title">图组 1｜D5 与 AI 的组合效果</p>
  <div class="ai-evidence__grid">
    <figure><div class="ai-evidence__image"><img src="/img/posts/ai-design-q1-2026/01.webp" alt="D5 与 AI 结合的总体鸟瞰效果" loading="lazy"></div><figcaption><span class="ai-step">01</span>总体鸟瞰：用 D5 建立空间基础，再由 AI 补充场景氛围。</figcaption></figure>
    <figure><div class="ai-evidence__image"><img src="/img/posts/ai-design-q1-2026/02.webp" alt="D5 与 AI 结合的滨水空间效果" loading="lazy"></div><figcaption><span class="ai-step">02</span>滨水空间：在既有构图中继续强化植物和环境层次。</figcaption></figure>
  </div>
</section>

#### 1.2 AI 结合：从效果图到 AI 优化

这一类工作以 D5 直出图为起点。原图已经确定主要构图和空间关系，AI 对氛围、真实感和局部细节进行优化。输入越明确，AI 越像后期协作者；基础图越模糊，结果越容易偏离方案。

<section class="ai-evidence" style="--cols:3">
  <p class="ai-evidence__title">图组 2｜一张 D5 直出图与两种 AI 优化结果</p>
  <div class="ai-evidence__grid">
    <figure><div class="ai-evidence__image"><img src="/img/posts/ai-design-q1-2026/03.webp" alt="D5 直出的庭院基础效果图" loading="lazy"></div><figcaption><span class="ai-step">D5 直出</span>保留原始空间、构图和建筑界面。</figcaption></figure>
    <figure><div class="ai-evidence__image"><img src="/img/posts/ai-design-q1-2026/04.webp" alt="庭院效果图的第一种 AI 优化结果" loading="lazy"></div><figcaption><span class="ai-step">AI 方案 A</span>强化樱花、人物与场景氛围。</figcaption></figure>
    <figure><div class="ai-evidence__image"><img src="/img/posts/ai-design-q1-2026/05.webp" alt="庭院效果图的第二种 AI 优化结果" loading="lazy"></div><figcaption><span class="ai-step">AI 方案 B</span>在同一空间基础上比较另一种细节方向。</figcaption></figure>
  </div>
</section>

<section class="ai-evidence" style="--cols:3">
  <p class="ai-evidence__title">图组 3｜同样的工作方式：一张 D5 直出图与两张 AI 优化图</p>
  <div class="ai-evidence__grid">
    <figure><div class="ai-evidence__image"><img src="/img/posts/ai-design-q1-2026/06.webp" alt="D5 直出的下沉庭院基础效果图" loading="lazy"></div><figcaption><span class="ai-step">D5 直出</span>空间和构筑物关系已经确定。</figcaption></figure>
    <figure><div class="ai-evidence__image"><img src="/img/posts/ai-design-q1-2026/07.webp" alt="下沉庭院的第一种 AI 优化结果" loading="lazy"></div><figcaption><span class="ai-step">AI 方案 A</span>增加植物层次、光影和使用氛围。</figcaption></figure>
    <figure><div class="ai-evidence__image"><img src="/img/posts/ai-design-q1-2026/08.webp" alt="下沉庭院的第二种 AI 优化结果" loading="lazy"></div><figcaption><span class="ai-step">AI 方案 B</span>比较同一设计的另一种真实感表达。</figcaption></figure>
  </div>
</section>

下面四组图进一步展示了相同逻辑：基础效果图先固定设计关系，中间图记录 AI 处理过程，最终图用于比较可交付的视觉方向。

<section class="ai-evidence" style="--cols:3">
  <p class="ai-evidence__title">图组 4｜滨水场景：基础图、AI 过程与优化结果</p>
  <div class="ai-evidence__grid">
    <figure><div class="ai-evidence__image"><img src="/img/posts/ai-design-q1-2026/09.webp" alt="滨水场景基础效果图" loading="lazy"></div><figcaption><span class="ai-step">输入</span>基础效果图。</figcaption></figure>
    <figure><div class="ai-evidence__image"><img src="/img/posts/ai-design-q1-2026/10.webp" alt="滨水场景 AI 优化过程" loading="lazy"></div><figcaption><span class="ai-step">过程</span>参考图与生成方向的组合。</figcaption></figure>
    <figure><div class="ai-evidence__image"><img src="/img/posts/ai-design-q1-2026/11.webp" alt="滨水场景 AI 优化结果" loading="lazy"></div><figcaption><span class="ai-step">输出</span>强化环境层次和场景完整度。</figcaption></figure>
  </div>
</section>

<section class="ai-evidence" style="--cols:3">
  <p class="ai-evidence__title">图组 5｜公园鸟瞰：基础图、AI 过程与优化结果</p>
  <div class="ai-evidence__grid">
    <figure><div class="ai-evidence__image"><img src="/img/posts/ai-design-q1-2026/12.webp" alt="公园鸟瞰基础效果图" loading="lazy"></div><figcaption><span class="ai-step">输入</span>基础鸟瞰效果。</figcaption></figure>
    <figure><div class="ai-evidence__image"><img src="/img/posts/ai-design-q1-2026/13.webp" alt="公园鸟瞰 AI 优化过程" loading="lazy"></div><figcaption><span class="ai-step">过程</span>用参考关系约束优化方向。</figcaption></figure>
    <figure><div class="ai-evidence__image"><img src="/img/posts/ai-design-q1-2026/14.webp" alt="公园鸟瞰 AI 优化结果" loading="lazy"></div><figcaption><span class="ai-step">输出</span>增加季相、植被层次与真实感。</figcaption></figure>
  </div>
</section>

<section class="ai-evidence ai-evidence--flow" style="--cols:3">
  <p class="ai-evidence__title">图组 6｜道路场景：基础图、AI 过程与优化结果</p>
  <div class="ai-evidence__grid">
    <figure><div class="ai-evidence__image"><img src="/img/posts/ai-design-q1-2026/15.webp" alt="道路景观基础效果图" loading="lazy"></div><figcaption><span class="ai-step">输入</span>保留道路、地形与植物边界。</figcaption></figure>
    <figure><div class="ai-evidence__image"><img src="/img/posts/ai-design-q1-2026/16.webp" alt="道路景观 AI 优化过程" loading="lazy"></div><figcaption><span class="ai-step">过程</span>选择画面和生成方向。</figcaption></figure>
    <figure><div class="ai-evidence__image"><img src="/img/posts/ai-design-q1-2026/17.webp" alt="道路景观 AI 优化结果" loading="lazy"></div><figcaption><span class="ai-step">输出</span>在原空间中增加季相和使用氛围。</figcaption></figure>
  </div>
</section>

<section class="ai-evidence ai-evidence--flow" style="--cols:3">
  <p class="ai-evidence__title">图组 7｜公园局部：基础图、AI 过程与优化结果</p>
  <div class="ai-evidence__grid">
    <figure><div class="ai-evidence__image"><img src="/img/posts/ai-design-q1-2026/18.webp" alt="公园局部基础效果图" loading="lazy"></div><figcaption><span class="ai-step">输入</span>基础效果图。</figcaption></figure>
    <figure><div class="ai-evidence__image"><img src="/img/posts/ai-design-q1-2026/19.webp" alt="公园局部 AI 优化过程" loading="lazy"></div><figcaption><span class="ai-step">过程</span>比较局部调整方向。</figcaption></figure>
    <figure><div class="ai-evidence__image"><img src="/img/posts/ai-design-q1-2026/20.webp" alt="公园局部 AI 优化结果" loading="lazy"></div><figcaption><span class="ai-step">输出</span>统一植物、人物和整体场景关系。</figcaption></figure>
  </div>
</section>

##### 1.2.1 AI 图的 Photoshop 后期

AI 生成结果并不等于最终交付。局部逻辑、人物比例、材质关系和画面重点仍需要筛选与修复。Photoshop 在这里不是简单美化，而是重新组织多张 AI 图的有效部分，使结果继续服务原设计。

<section class="ai-evidence ai-evidence--flow" style="--cols:3">
  <p class="ai-evidence__title">图组 8｜将多张 AI 图叠加处理</p>
  <div class="ai-evidence__grid">
    <figure><div class="ai-evidence__image"><img src="/img/posts/ai-design-q1-2026/21.webp" alt="AI 图叠加处理的基础效果" loading="lazy"></div><figcaption><span class="ai-step">基础</span>确定整体构图。</figcaption></figure>
    <figure><div class="ai-evidence__image"><img src="/img/posts/ai-design-q1-2026/22.webp" alt="多张 AI 图的 Photoshop 叠加过程" loading="lazy"></div><figcaption><span class="ai-step">叠加</span>选择并组合不同生成结果的有效区域。</figcaption></figure>
    <figure><div class="ai-evidence__image"><img src="/img/posts/ai-design-q1-2026/23.webp" alt="多张 AI 图叠加后的最终效果" loading="lazy"></div><figcaption><span class="ai-step">结果</span>统一空间重点、层次和整体氛围。</figcaption></figure>
  </div>
</section>

<section class="ai-evidence" style="--cols:3">
  <p class="ai-evidence__title">图组 9｜典型 AI 后期：D5 快速出图，AI 增加氛围、层次和细节</p>
  <div class="ai-evidence__grid">
    <figure><div class="ai-evidence__image"><img src="/img/posts/ai-design-q1-2026/24.webp" alt="D5 场景与 AI 后期过程一" loading="lazy"></div><figcaption><span class="ai-step">步骤 1</span>D5 场景与 AI 参考方向。</figcaption></figure>
    <figure><div class="ai-evidence__image"><img src="/img/posts/ai-design-q1-2026/25.webp" alt="AI 后期的基础场景" loading="lazy"></div><figcaption><span class="ai-step">步骤 2</span>保留主要空间和铺装关系。</figcaption></figure>
    <figure class="ai-evidence__wide"><div class="ai-evidence__image"><img src="/img/posts/ai-design-q1-2026/26.webp" alt="AI 后期调整过程" loading="lazy"></div><figcaption><span class="ai-step">步骤 3</span>局部生成和比较。</figcaption></figure>
    <figure><div class="ai-evidence__image"><img src="/img/posts/ai-design-q1-2026/27.webp" alt="AI 后期细节调整" loading="lazy"></div><figcaption><span class="ai-step">步骤 4</span>筛选并修复可用细节。</figcaption></figure>
    <figure><div class="ai-evidence__image"><img src="/img/posts/ai-design-q1-2026/28.webp" alt="AI 后期最终效果" loading="lazy"></div><figcaption><span class="ai-step">结果</span>形成具有氛围、层次和细节的完整画面。</figcaption></figure>
  </div>
</section>

##### 1.2.2 灯光设计

AI 可以快速测试夜景方向，但灯光不是一层滤镜。仍然要判断光从哪里来、照亮什么、如何影响动线和停留，以及是否与真实设施位置对应。

<section class="ai-evidence ai-evidence--flow" style="--cols:3">
  <p class="ai-evidence__title">图组 10｜灯光设计：基础场景、方向调整与夜景结果</p>
  <div class="ai-evidence__grid">
    <figure><div class="ai-evidence__image"><img src="/img/posts/ai-design-q1-2026/29.webp" alt="灯光设计基础场景" loading="lazy"></div><figcaption><span class="ai-step">输入</span>白天基础场景。</figcaption></figure>
    <figure><div class="ai-evidence__image"><img src="/img/posts/ai-design-q1-2026/30.webp" alt="灯光设计 AI 调整过程" loading="lazy"></div><figcaption><span class="ai-step">过程</span>测试光源位置、层次和重点。</figcaption></figure>
    <figure><div class="ai-evidence__image"><img src="/img/posts/ai-design-q1-2026/31.webp" alt="AI 辅助灯光设计结果" loading="lazy"></div><figcaption><span class="ai-step">输出</span>形成夜间氛围预演。</figcaption></figure>
  </div>
</section>

#### 1.3 从模型到 AI 效果图生成

这一组图没有经过 D5 基础效果，直接由模型进入 AI 后期。它能更快形成场景方向，但不确定性也大幅增加：结构、尺度、材料和植物关系都可能被 AI 主动改写。因此，这种方式更适合概念探索，不适合把生成结果直接当成设计事实。

<section class="ai-evidence" style="--cols:2">
  <p class="ai-evidence__title">图组 11｜模型直接进入 AI：速度提高，但不确定性增加</p>
  <div class="ai-evidence__grid">
    <figure><div class="ai-evidence__image"><img src="/img/posts/ai-design-q1-2026/32.webp" alt="用于 AI 生成的整体设计模型" loading="lazy"></div><figcaption><span class="ai-step">模型 1</span>整体模型视图。</figcaption></figure>
    <figure><div class="ai-evidence__image"><img src="/img/posts/ai-design-q1-2026/33.webp" alt="用于 AI 生成的局部设计模型" loading="lazy"></div><figcaption><span class="ai-step">模型 2</span>局部结构和路径关系。</figcaption></figure>
    <figure><div class="ai-evidence__image"><img src="/img/posts/ai-design-q1-2026/34.webp" alt="模型直接生成的第一种 AI 效果" loading="lazy"></div><figcaption><span class="ai-step">AI 结果 1</span>快速形成场景方向。</figcaption></figure>
    <figure><div class="ai-evidence__image"><img src="/img/posts/ai-design-q1-2026/35.webp" alt="模型直接生成的第二种 AI 效果" loading="lazy"></div><figcaption><span class="ai-step">AI 结果 2</span>同一模型可能产生明显不同的空间表达。</figcaption></figure>
  </div>
</section>

#### 1.4 AI 细节优化的边界

AI 优化不是可逆操作。它可能改善局部质感，也可能在不易察觉的位置改变建筑界面、植物尺度或通行逻辑。因此需要把输入、局部优化和最终结果并列比较，区分视觉改善与设计偏移。

<section class="ai-evidence" style="--cols:3">
  <p class="ai-evidence__title">图组 12｜细节优化边界：候选结果仍需设计者校核</p>
  <div class="ai-evidence__grid">
    <figure class="ai-evidence__wide"><div class="ai-evidence__image"><img src="/img/posts/ai-design-q1-2026/36.webp" alt="AI 细节优化过程界面" loading="lazy"></div><figcaption><span class="ai-step">过程</span>局部区域与参考方向。</figcaption></figure>
    <figure><div class="ai-evidence__image"><img src="/img/posts/ai-design-q1-2026/37.webp" alt="AI 细节优化结果一" loading="lazy"></div><figcaption><span class="ai-step">结果 1</span>局部增强同时可能改变原有信息。</figcaption></figure>
    <figure><div class="ai-evidence__image"><img src="/img/posts/ai-design-q1-2026/38.webp" alt="AI 细节优化结果二" loading="lazy"></div><figcaption><span class="ai-step">结果 2</span>最终仍需回到空间、尺度和设计意图进行校核。</figcaption></figure>
  </div>
</section>

### 2. 贴图、功能性图片：作为素材和流程的一环

AI 不只服务最终效果图，也可以生成流程中的人物、植物、意向参考和阶段性沟通素材。下面一组图综合使用 Photoshop 修改图片结构和内容，增加跑道；再由 AI 增强场景真实感、生成所需人物素材，并将人物融合回原图。

<section class="ai-evidence" style="--cols:3">
  <p class="ai-evidence__title">图组 13｜Photoshop 改结构、AI 做融合并生成素材</p>
  <div class="ai-evidence__grid">
    <figure><div class="ai-evidence__image"><img src="/img/posts/ai-design-q1-2026/39.webp" alt="AI 生成人物素材的过程" loading="lazy"></div><figcaption><span class="ai-step">素材</span>生成满足场景需求的人物。</figcaption></figure>
    <figure class="ai-evidence__wide"><div class="ai-evidence__image"><img src="/img/posts/ai-design-q1-2026/40.webp" alt="增加跑道和人物前的景观图片" loading="lazy"></div><figcaption><span class="ai-step">结构</span>通过 Photoshop 调整图片结构并增加跑道。</figcaption></figure>
    <figure class="ai-evidence__wide"><div class="ai-evidence__image"><img src="/img/posts/ai-design-q1-2026/41.webp" alt="融合 AI 人物素材后的景观图片" loading="lazy"></div><figcaption><span class="ai-step">融合</span>AI 增强真实感，再将人物素材融合进原图。</figcaption></figure>
  </div>
</section>

AI 还可以与参数化工具结合，为模型阶段提供更直观、更有趣的设计表达。参数化模型保留几何逻辑，AI 则帮助非建模人员更快理解形态意图和可能的材质方向。

<section class="ai-evidence" style="--cols:2">
  <p class="ai-evidence__title">图组 14｜AI 与参数化结合的模型阶段表达</p>
  <div class="ai-evidence__grid">
    <figure class="ai-evidence__wide"><div class="ai-evidence__image"><img src="/img/posts/ai-design-q1-2026/42.webp" alt="AI 与参数化结合的过程界面" loading="lazy"></div><figcaption><span class="ai-step">过程</span>将参数化模型和视觉参考放入同一工作链路。</figcaption></figure>
    <figure><div class="ai-evidence__image"><img src="/img/posts/ai-design-q1-2026/43.webp" alt="AI 与参数化结合的模型表达" loading="lazy"></div><figcaption><span class="ai-step">表达</span>在模型阶段快速呈现形态、材质和构造意向。</figcaption></figure>
  </div>
</section>

## 二、叙述

### 1. 设计故事线逻辑

视觉回答“它看起来怎样”，故事线还需要回答：为什么这样设计，它解决了什么问题，不同空间、节点和策略之间是什么关系。AI 可以协助把背景、问题、策略、空间响应和结果串联起来，并帮助发现逻辑断点。

### 2. 设计诠释表达

模型、图纸和零散笔记可以被整理成更清楚的表达，但 AI 不能替代设计判断。它负责组织语言，设计者负责确认理由是否成立、文字是否与图纸一致，以及哪些内容能够被证据支持。

### 3. 信息平权

设计信息不应该只对熟悉专业术语的人有效。AI 可以帮助把同一套内容转换为客户、协作者或公众更容易理解的表达，让不同角色基于相同信息继续讨论。这里的目标不是简化专业性，而是降低理解门槛。

## 三、逻辑规划

### 1. 工作片段 Skill：可稳定复现交付结果的流程

我正在把重复操作整理为独立工作片段。一个可复用 Skill 至少要包含明确输入、执行步骤、质量判断、失败条件和交付输出。例如“效果图到 AI 优化”除了记录模型和提示词，还需要说明哪些空间关系不能改变、如何比较前后结果、什么情况下应该退回原图。

### 2. 智能判断组合 Skill

下一步不是继续堆叠孤立工具，而是让系统根据任务判断：应该调用哪些 Skill、以什么顺序组合、在哪一步停止并交给设计者确认。这是我目前对设计 Agent 的理解：它需要任务拆解、工具选择、结果检查和失败回退，但目标、标准和最终决定仍由设计者掌握。

## 四、工作流插件优化

工作流插件用于保存常用参数、参考图和操作逻辑，把一次性的聊天逐步变成可复现的设计工具。它减少重复设置，也让输入、生成过程和结果判断能够被一起检查。

<section class="ai-evidence" style="--cols:2">
  <p class="ai-evidence__title">图组 15｜工作流插件：保存参数、参考图和任务结构</p>
  <div class="ai-evidence__grid">
    <figure><div class="ai-evidence__image"><img src="/img/posts/ai-design-q1-2026/44.webp" alt="工作流插件的参数和参考图配置" loading="lazy"></div><figcaption><span class="ai-step">配置</span>将参数、参考图和任务要求放在同一界面。</figcaption></figure>
    <figure><div class="ai-evidence__image"><img src="/img/posts/ai-design-q1-2026/45.webp" alt="工作流插件的生成任务配置" loading="lazy"></div><figcaption><span class="ai-step">复用</span>复用同一结构，减少重复设置和沟通成本。</figcaption></figure>
  </div>
</section>

<div class="ai-flow">AI 知识了解与故事线搭建 → 意向图生成与寻找 → 方案绘制 → 模型制作与深化 → 一体化表达</div>

## 小结

这一季度，我对 AI 的关注从“它能生成什么”逐渐转向“它怎样进入设计流程”。视觉图像和叙述故事是当前最基础的两类能力；更长期的价值，是把这些经验整理成稳定、可检查、可复用的工作流，再逐步发展为能够进行逻辑规划的 Agent。

AI 可以扩大探索范围、缩短反馈时间，也可以帮助设计被更多人理解。但它不会自动保证空间逻辑、专业准确性和设计质量。最终仍需要由设计者判断、校核和组织结果。
