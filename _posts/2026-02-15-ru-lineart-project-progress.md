---
layout: post
title: "从草图线条到 Rhino 可编辑曲线：RU-LineArt 项目开发进展总结 🚀"
subtitle: "MVP 已跑通 ✅，下一阶段聚焦稳定性、准确性与可评估性"
date: 2026-02-15
author: liu.ruyuan
lang: zh
tags: [RU-LineArt, Rhino, NURBS, 计算机视觉, 项目复盘]
---

> English version: `/2026/02/15/ru-lineart-project-progress-en/`

## 项目背景与目标 🎯

我在做一个本地工具 `RU-LineArt`，目标很明确：

- 输入：一张单线条平面草图（允许手抖、线宽不均、局部交叉）
- 输出：可在 Rhino 中继续编辑的 `.3dm` 曲线对象
- 约束：全自动、无人工交互、MVP 阶段优先解决“可跑通”和“可编辑”

核心价值是把“视觉上的草图线”转换成“几何上可继续建模的曲线”。

## 当前技术路线（已实现）🧩

整个流程已经形成可运行闭环：

1. 预处理（`vision/preprocess.py`）
   - 灰度读取与标准化
   - Otsu / 自适应二值化
   - 可选去噪（Gaussian / Bilateral）
   - 形态学清理（open/close）

2. 骨架化（`vision/skeletonize.py`）
   - 使用 `skimage` 骨架化把粗线压成单像素中心线
   - 增加短毛刺裁剪（spur pruning）减少噪声分支

3. 拓扑构图与路径提取（`topo/graph_build.py` + `topo/path_extract.py`）
   - 基于 8 邻域建立像素图
   - 支持连通域分离（`largest` / `all`）
   - 端点对路径提取（Dijkstra 配对）
   - 交叉策略使用 `overpass`，倾向“直行穿越”
   - 对闭环做切开处理，统一导出为开放曲线

4. 几何拟合（`fit/polyline_simplify.py` + `fit/nurbs_fit.py`）
   - RDP 抽稀 + 移动平均平滑
   - `splprep` 迭代拟合开曲线 NURBS
   - 控制点上限受配置约束（默认 `<= 50`）
   - 拟合异常时有 fallback 策略，保证流程稳定结束

5. Rhino 导出（`export/rhino3dm_writer.py`）
   - 使用 `rhino3dm` 生成 `.3dm`
   - 支持单曲线与多曲线导出
   - 自动图层和命名（单体 `main_nurbs`，多曲线 `stroke_001...`）

6. 调试产物（`debug/*`）
   - 自动输出二值图、骨架图、路径叠加图、polyline/nurbs JSON、report
   - 便于回溯“图像 -> 拓扑 -> 几何”的每一阶段问题

## 当前进度与验证结果 📊

截至目前，项目已经从“方案期”进入“可用 MVP 期”：

- CLI 已可直接运行：

```bash
.venv/bin/sketch2rhino run \
  --image data/samples/sample.png \
  --out   data/outputs/sample.3dm \
  --config configs/default.yaml \
  --debug data/outputs/debug_sample
```

- 输出模式已支持：
  - `single`：提取一条主曲线
  - `multi`：提取多条开放曲线并按长度排序

- 测试状态：`pytest` 共 8 个用例，当前全部通过（图像预处理、骨架化、路径提取、NURBS 拟合、3dm 导出均有覆盖）

- 样例产物已生成多组：
  - `data/outputs/sample_curve_multi_v2.3dm`
  - `data/outputs/sample_crossing_multi_v2.3dm`
  - 对应调试目录下有完整中间结果和 `report.json`

- 一组典型 report 显示：
  - `curve_multi_v2`：单曲线导出，控制点 9，整条链路耗时在毫秒级
  - `crossing_multi_v2`：双曲线导出（`curve_count = 2`），交叉场景已能稳定拆分并输出

## 目前仍然存在的边界 ⚠️

虽然 MVP 已跑通，但离“生产可泛化”还有距离：

- 极复杂缠绕草图下，主路径选择仍可能偏离人眼预期
- 交叉/闭环的鲁棒性还需要更多真实数据压力测试
- 缺少更系统的质量指标（如几何误差、编辑稳定性评分）
- 仓库当前还没有正式提交历史，工程版本化与里程碑管理需要尽快补齐

## 下一阶段计划 🛠️

下一步我会把重点放在“稳定性与可评估性”上：

1. 建立小型基准数据集与评测脚本（按场景分类统计）
2. 强化交叉消歧与闭环切分策略，减少错误连接
3. 增加异常场景回归测试，扩展测试覆盖面
4. 完成首批规范化提交与版本节点，补上发布节奏
5. 评估是否加入“轻交互纠错”作为可选模式（保持默认全自动）

## 小结 ✍️

这次阶段开发最关键的成果，不是某个单点算法，而是把完整工程链路打通：从草图像素，到骨架拓扑，再到 Rhino 可编辑 NURBS，已经实现端到端闭环。

接下来，项目目标会从“能跑”转向“稳、准、可评估”。
