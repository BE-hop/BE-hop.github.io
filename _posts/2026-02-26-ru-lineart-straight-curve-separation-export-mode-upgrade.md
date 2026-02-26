---
layout: post
title: "RU-LineArt 更新日志（2026-02-26）：直曲分离与导出模式升级 🧭"
subtitle: "三种几何模式上线，分段识别增强，密集线稿拓扑更稳、调试更可诊断"
date: 2026-02-26
author: liu.ruyuan
lang: zh
tags: [RU-LineArt, Rhino, NURBS, Polyline, 拓扑优化]
---

> English version: `/2026/02/26/ru-lineart-straight-curve-separation-export-mode-upgrade-en/`

这次迭代聚焦两个直接影响交付质量的问题：

1. 直线段经常被误当成曲线，导出后出现不必要的 NURBS 化失真。
2. 密集区域和近距离并排线容易漏识别或误连接，拓扑稳定性不足。

同时，这次也补齐了交付链路能力：几何导出模式可控、调试可视化更清晰、桌面发布流程更统一。

## 核心更新 1：新增三种几何导出模式 🎛️

新增配置项：`fit.geometry_mode`

- `mixed`：自动分类（默认）
- `polyline_only`：全部强制导出为 Polyline（PL）
- `nurbs_only`：全部强制导出为 NURBS

并支持 CLI 覆盖：

```bash
.venv/bin/sketch2rhino run \
  --image /absolute/path/to/input.png \
  --out /absolute/path/to/output.3dm \
  --config configs/default.yaml \
  --geometry-mode polyline_only
```

对应改动：

- `src/sketch2rhino/config.py`（新增模式与校验）
- `src/sketch2rhino/pipeline.py`（按模式强制路由拟合）
- `src/sketch2rhino/cli.py`（新增 `--geometry-mode`）

## 核心更新 2：分段与直线判定增强 ✂️

针对“长方形被圆化”和“局部直段被整体曲线带偏”，补了分段与直线识别策略：

- 多尺度角点检测
- 圆角（fillet）识别后拆段
- 段端点节点化对齐（便于后期 Join）
- 直线段优先导出 PL（减少不必要的 NURBS）

新增密集线稿预设：

- `configs/dense_topology.yaml`
- `configs/parallel_detail.yaml`

## 核心更新 3：拓扑与调试可视化升级 🔍

调试工件新增/强化如下：

- `01_binarized.png`
- `02_skeleton.png`
- `03_path_overlay.png`（路径提取结果）
- `03_segment_overlay.png`（分段后、拟合前结果）

这让“未识别线条”和“误连接线条”可以分层定位，而不是只看最终 3DM。

## 核心更新 4：桌面应用与 Agent 发现能力 🧩

本次同步完善了桌面端与发现能力：

- 本地 API 与 discovery 文件（`tool_manifest.json` / `README_AI.md`）
- 桌面端构建脚本与说明更新
- 更新提示 feed 示例（`update_feed.example.json`）

## README 与测试 ✅

README 已按新能力更新，重点包括：

- 几何模式说明（`mixed / polyline_only / nurbs_only`）
- CLI 新参数 `--geometry-mode`
- 并排双线与密集区域的参数建议

测试状态：

- 新增模式测试：`tests/test_geometry_mode.py`
- 全量测试通过：`29 passed`

本次代码提交：`cb21cca`

## 本次打包结果 📦

### macOS

- 新版包目录：`/Users/mac/Documents/RU-LineArt/sketch2rhino/desktop_app/release/RU-LineArt-macOS-20260226-163100`
- 新版 zip：`/Users/mac/Documents/RU-LineArt/sketch2rhino/desktop_app/release/RU-LineArt-macOS-20260226-163100.zip`
- 固定文件名（已同步覆盖）：`/Users/mac/Documents/RU-LineArt/sketch2rhino/desktop_app/release/RU-LineArt-macOS.zip`

### Windows

- 现有 zip（release 目录）：`/Users/mac/Documents/RU-LineArt/sketch2rhino/desktop_app/release/RU-LineArt-windows.zip`

说明：Windows 包仍建议在 Windows Runner（GitHub Actions）或 Windows 本机构建，以保证运行时一致性。

## 使用建议（如何选模式）🚀

- 追求后续编辑自由度：优先 `mixed`。
- 工业草图、直线占比高：优先 `polyline_only`。
- 需要统一曲线语义或后续曲面流程：选择 `nurbs_only`。

## 一句话总结 ✍️

这次更新把“线稿转 3DM”从单一路径拟合升级为“可控导出模式 + 更稳分段拓扑 + 可诊断调试链路”，在复杂线稿场景下更稳定，也更容易工程化落地。
