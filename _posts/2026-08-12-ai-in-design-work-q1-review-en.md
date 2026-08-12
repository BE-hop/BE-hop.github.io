---
layout: post
title: "Q1 2026 Review: How I Use AI in Design Work"
subtitle: "Visual imagery, design narratives, and the path from reusable experience to workflows"
date: 2026-08-12
author: liu.ruyuan
lang: en
tags: [AI, design workflow, AIGC, landscape design, Agent]
---

> 中文版本: `/2026/08/12/ai-in-design-work-q1-review/`

<style>
.ai-review-lead{margin:1.5rem 0 2.5rem;padding:1.25rem 1.4rem;border-left:4px solid #0f766e;background:#f3f7f5;border-radius:0 12px 12px 0}.ai-review-lead p{margin:.35rem 0}.ai-evidence{margin:1.5rem 0 2.6rem;padding:18px;background:#f5f6f4;border:1px solid #e1e5e1;border-radius:16px}.ai-evidence__title{margin:0 0 14px;font-size:15px;line-height:1.6;font-weight:600;color:#38534a}.ai-evidence__grid{display:grid;grid-template-columns:repeat(var(--cols,2),minmax(0,1fr));gap:12px;align-items:stretch}.ai-evidence figure{display:flex;flex-direction:column;min-width:0;margin:0;background:#fff;border:1px solid #dde2de;border-radius:11px;overflow:hidden}.ai-evidence__image{display:flex;align-items:center;justify-content:center;height:260px;padding:8px;background:#e9ece9}.ai-evidence img{display:block;width:100%;height:100%;margin:0!important;object-fit:contain}.ai-evidence figcaption{flex:1;margin:0;padding:10px 12px;font-size:13px;line-height:1.55;color:#53625c;background:#fff}.ai-evidence--flow .ai-evidence__grid{grid-template-columns:1fr}.ai-evidence--flow .ai-evidence__image,.ai-evidence figure.ai-evidence__wide .ai-evidence__image{height:auto;min-height:0;padding:0;background:#111}.ai-evidence--flow img,.ai-evidence figure.ai-evidence__wide img{height:auto;max-height:none;object-fit:initial}.ai-evidence figure.ai-evidence__wide{grid-column:1/-1}.ai-step{display:inline-block;margin-right:6px;color:#0f766e;font-weight:700}.ai-flow{margin:1.25rem 0 2rem;padding:14px 16px;border:1px solid #d9e4df;border-radius:12px;background:#fbfcfb;font-family:Menlo,Monaco,Consolas,monospace;font-size:14px;line-height:1.8;color:#27453b}.post-container h2{margin-top:3.2rem}.post-container h3{margin-top:2.3rem}.post-container h4{margin-top:1.8rem}@media(max-width:767px){.ai-evidence{margin-left:-5px;margin-right:-5px;padding:10px}.ai-evidence__grid{grid-template-columns:1fr}.ai-evidence__image{height:auto;min-height:0;max-height:420px;padding:8px}.ai-evidence img{height:auto;max-height:400px}.ai-evidence--flow .ai-evidence__image,.ai-evidence figure.ai-evidence__wide .ai-evidence__image{max-height:none;padding:0}.ai-evidence--flow img,.ai-evidence figure.ai-evidence__wide img{max-height:none}.ai-evidence figcaption{font-size:12px}.ai-flow{font-size:12px;overflow-wrap:anywhere}}
</style>

<div class="ai-review-lead">
  <p><strong>In a design context, the two foundational uses of AI are visual imagery and design narrative.</strong></p>
  <p><strong>Experience becomes reusable through workflows:</strong> AI knowledge and narrative building, reference generation and search, design drawing, modeling and development, and integrated communication.</p>
  <p><strong>Logical planning remains the capability to develop:</strong> an Agent that can judge and combine different work units.</p>
</div>

This article records how I used AI in practice during the first quarter of 2026. The focus is not the number of images AI can generate, but the roles it can already play in a design process, how it works with D5, Photoshop, models, and parametric tools, and where its current limits remain.

## 1. Visual Work

### 1. Renderings

#### 1.1 Combining D5 Render with AI

D5 controls space, materials, camera, and base lighting. AI continues with atmosphere, seasonal character, planting layers, and detail. The model and renderer establish a controllable spatial base before AI expands the range of visual exploration.

{% include ai-q1-evidence.html title="Group 1 | Combining D5 and AI" cols="2" ids="01,02" labels="Overall aerial view||Waterfront scene" %}

#### 1.2 From Render to AI Refinement

This workflow begins with a direct D5 output. The source image fixes the main composition and spatial relationships; AI develops atmosphere, realism, and local detail. The clearer the input, the more AI behaves like a post-production collaborator.

{% include ai-q1-evidence.html title="Group 2 | One direct D5 output and two AI refinement options" cols="3" ids="03,04,05" labels="Direct D5 output||AI option A||AI option B" %}

{% include ai-q1-evidence.html title="Group 3 | The same workflow on a sunken courtyard" cols="3" ids="06,07,08" labels="Direct D5 output||AI option A||AI option B" %}

The following four groups use the same logic: the base render fixes the design relationships, the middle image records the AI process, and the final image provides a visual direction for review.

{% include ai-q1-evidence.html title="Group 4 | Waterfront scene" cols="3" ids="09,10,11" labels="Input||Process||Output" %}

{% include ai-q1-evidence.html title="Group 5 | Aerial park view" cols="3" ids="12,13,14" labels="Input||Process||Output" %}

{% include ai-q1-evidence.html title="Group 6 | Road landscape" cols="3" ids="15,16,17" labels="Input||Process||Output" layout="flow" %}

{% include ai-q1-evidence.html title="Group 7 | Local park scene" cols="3" ids="18,19,20" labels="Input||Process||Output" layout="flow" %}

##### 1.2.1 Photoshop Post-Production for AI Images

A generated image is not a final deliverable. Local logic, human proportions, materials, and visual focus still need selection and repair. Photoshop is used to combine useful parts from multiple AI results and make the final image serve the original design.

{% include ai-q1-evidence.html title="Group 8 | Compositing multiple AI images" cols="3" ids="21,22,23" labels="Base||Composite process||Result" layout="flow" %}

{% include ai-q1-evidence.html title="Group 9 | Typical AI post-production: D5 for speed, AI for atmosphere, depth, and detail" cols="3" ids="24,25,26,27,28" labels="Step 1||Step 2||Step 3||Step 4||Result" wide_ids="26" %}

##### 1.2.2 Lighting Design

AI can test night-scene directions quickly, but lighting is not a filter. The designer still needs to verify where light comes from, what it illuminates, how it affects movement and pause, and whether it corresponds to actual fixtures.

{% include ai-q1-evidence.html title="Group 10 | Lighting design" cols="3" ids="29,30,31" labels="Input||Process||Output" layout="flow" %}

#### 1.3 Generating AI Visualizations Directly from a Model

This group moves directly from a model into AI without a D5 base render. It produces a scene direction faster, but uncertainty increases significantly: structure, scale, materials, and planting relationships may all be rewritten. This method is better for concept exploration than for treating the generated image as a design fact.

{% include ai-q1-evidence.html title="Group 11 | Model directly to AI: faster, but less certain" cols="2" ids="32,33,34,35" labels="Model 1||Model 2||AI result 1||AI result 2" %}

#### 1.4 The Boundary of AI Detail Refinement

AI refinement is not reversible. It can improve local texture while quietly changing facades, planting scale, or circulation. Input, local optimization, and final result therefore need to be compared side by side to distinguish visual improvement from design drift.

{% include ai-q1-evidence.html title="Group 12 | The boundary of detail refinement" cols="3" ids="36,37,38" labels="Process||Result 1||Result 2" wide_ids="36" %}

### 2. Textures and Functional Images as Workflow Material

AI also produces people, planting assets, visual references, and interim communication material. In this example, Photoshop changes the image structure and adds a running track; AI then improves visual integration, generates a person, and helps merge that asset into the source image.

{% include ai-q1-evidence.html title="Group 13 | Photoshop changes structure; AI generates and integrates material" cols="3" ids="39,40,41" labels="Generated asset||Structural edit||Integrated result" wide_ids="40,41" %}

AI can also work with parametric tools to make model-stage ideas more legible. Parametric geometry retains its design logic, while AI helps communicate form, material, and construction intent.

{% include ai-q1-evidence.html title="Group 14 | AI and parametric design in model-stage communication" cols="2" ids="42,43" labels="Process||Expression" wide_ids="42" %}

## 2. Narrative

### 1. Design Story Logic

Visuals show what a project looks like. A design story must also explain why it takes this form, what problem it addresses, and how spaces, nodes, and strategies relate. AI can connect context, problem, strategy, spatial response, and result while exposing gaps in the logic.

### 2. Design Interpretation

Models, drawings, and fragmented notes can be organized into clearer language, but AI cannot replace design judgment. It organizes expression; the designer verifies whether the reasoning is valid, whether the text matches the drawings, and which claims are supported.

### 3. Information Equity

Design information should not work only for people fluent in professional terminology. AI can reframe the same content for clients, collaborators, or the public. The goal is not to remove professional depth, but to lower the barrier to understanding.

## 3. Logical Planning

### 1. Work-Unit Skills That Reproduce Deliverable Results

I am organizing repeated operations into independent work units. A reusable Skill needs defined inputs, execution steps, quality criteria, failure conditions, and deliverable outputs. A render-refinement Skill must record not only its model and prompts, but also which spatial relationships cannot change and when the result should be rejected.

### 2. Intelligent Selection and Combination of Skills

The next step is not accumulating isolated tools. The system should judge which Skills to call, how to sequence them, and where to stop for designer confirmation. A design Agent needs task decomposition, tool selection, result evaluation, and failure recovery, while objectives, standards, and final decisions remain with the designer.

## 4. Workflow Plugin Optimization

Workflow plugins retain common parameters, reference images, and operational logic. They move generation from an isolated chat toward a reproducible design tool and allow the input, process, and evaluation to be reviewed together.

{% include ai-q1-evidence.html title="Group 15 | Retaining parameters, references, and task structure" cols="2" ids="44,45" labels="Configuration||Reuse" %}

<div class="ai-flow">AI knowledge and narrative building → reference generation and search → design drawing → modeling and development → integrated communication</div>

## Conclusion

This quarter, my attention shifted from what AI can generate to how it can enter a design process. Visual imagery and design narrative are the two foundational capabilities today. Their longer-term value comes from turning experience into stable, reviewable, and reusable workflows, then gradually developing an Agent capable of logical planning.

AI can broaden exploration, shorten feedback cycles, and make design easier to understand. It does not automatically guarantee spatial logic, professional accuracy, or design quality. The designer remains responsible for judging, verifying, and organizing the result.
