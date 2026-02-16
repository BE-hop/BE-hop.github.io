---
layout: post
title: "RU-LineArt 最新修改总结（2026-02-16）🛠️"
subtitle: "新增可选手绘稳线阶段：先降抖再拟合，提升流畅度并守住关键锚点"
date: 2026-02-16
author: liu.ruyuan
lang: zh
tags: [RU-LineArt, Rhino, NURBS, 手绘稳线, 项目迭代]
---

> English version: `/2026/02/16/ru-lineart-latest-update-en/`

这次迭代聚焦一个非常具体的问题：
**手绘线条本身有抖动，但我们希望导入 Rhino 后得到更流畅、又不“跑形”的曲线**。

在实际测试里，我们发现一个关键现象：
同一条识别结果在 Rhino 里做一次 `Rebuild` 后会明显更顺。这说明当前流程缺的不是“更强拟合”，而是**拟合前的稳线（stabilization）**。

## 本次目标 🎯

1. 保留原有 baseline 行为，避免“改了全局默认导致副作用”。
2. 增加一套可选的“手绘稳线”能力，效果接近绘图软件的防抖逻辑。
3. 保住端点和交叉锚点，避免平滑后出现漂移或断线。

## 核心改动 🧩

### 1) 新增稳线阶段（可选）

在拟合前新增 `fit.stabilize` 阶段，核心流程：

1. 按弧长重采样（统一点间距，减弱像素采样不均）。
2. 使用 Savitzky-Golay 做多次平滑（去高频抖动）。
3. 用 `blend` 控制“原轨迹 vs 平滑轨迹”的混合比例。
4. 每次平滑后重新钉住端点与保护锚点（防止平滑拉偏关键位置）。

实现文件：
- `sketch2rhino/src/sketch2rhino/fit/stroke_stabilize.py`

### 2) 主流程接入但默认关闭

`pipeline` 里改为：
`path_extract -> stabilize(可选) -> simplify -> nurbs_fit`

这样做的好处是：
- 平滑优先处理“抖动噪声”，
- 简化和 NURBS 拟合再处理“几何表达”，
- 角色清晰，不会互相打架。

改动文件：
- `sketch2rhino/src/sketch2rhino/pipeline.py`

### 3) 配置体系扩展

新增配置模型：`StabilizeConfig`，包含：
- `enable`
- `method`（当前 `savgol`）
- `window`
- `polyorder`
- `passes`
- `blend`
- `resample_step_px`
- `anchor_snap_radius_px`

改动文件：
- `sketch2rhino/src/sketch2rhino/config.py`
- `sketch2rhino/configs/default.yaml`（新增字段，默认 `enable: false`）

### 4) 新增手绘预设配置

为了开箱即用，新增：
- `sketch2rhino/configs/handdrawn_smooth.yaml`

该预设默认开启稳线，参数更偏“手绘去抖”。

### 5) 补充测试与文档

新增测试覆盖：
- 平滑后 roughness 下降
- 端点不漂移
- 保护锚点可被保住

新增文件：
- `sketch2rhino/tests/test_stabilize.py`

文档已同步：
- `sketch2rhino/README.md`

## 为什么这次方案更稳 ✅

之前直接提高拟合平滑度（如只调 `spline.smoothing`）容易出现两个副作用：

1. 曲线看起来更圆，但和原手绘走势不贴。
2. 交叉或端点位置被拉偏。

本次做法把问题拆开：
- **先降抖（稳定输入）**，
- **再拟合（表达曲线）**。

并通过锚点回钉，保证关键拓扑位置不丢。

## 结果 📊

- 默认配置行为保持不变（兼容旧结果）。
- 开启手绘预设后，曲线主观流畅度明显提升。
- 样例 `sample_crossing` 下，折线点数量从 `[12, 11]` 收敛到 `[11, 7]`，控制点从 `[10, 8]` 收敛到 `[10, 6]`，同时保持关键结构连续。
- 全部测试通过：`10 passed`。

## 使用方式 🚀

### 保持原 baseline（默认）

```bash
.venv/bin/sketch2rhino run \
  --image data/samples/sample.png \
  --out   data/outputs/sample.3dm \
  --config configs/default.yaml \
  --debug data/outputs/debug_sample
```

### 启用手绘稳线预设

```bash
.venv/bin/sketch2rhino run \
  --image data/samples/sample.png \
  --out   data/outputs/sample_smooth.3dm \
  --config configs/handdrawn_smooth.yaml \
  --debug data/outputs/debug_sample_smooth
```

## 调参建议（手绘场景）

- 想更顺：优先增大 `fit.stabilize.window`（如 `13 -> 15`）。
- 想更贴原线：降低 `fit.stabilize.blend`（如 `0.75 -> 0.6`）。
- 局部关键点漂移：提高 `anchor_snap_radius_px` 或检查保护锚点来源。

## 小结 ✍️

这次不是简单“把曲线再抹平一点”，而是把手绘输入的噪声处理前置并结构化：
**稳线先行、拟合随后、锚点兜底**。

最终效果是：在不牺牲拓扑稳定性的前提下，输出曲线更接近真实手绘意图，也更接近在 Rhino 中手工 `Rebuild` 后的观感。
