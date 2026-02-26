---
layout: post
title: "RU-LineArt Update (2026-02-26): Straight-Curve Separation and Export Modes 🧭"
subtitle: "Three geometry modes, stronger segmentation, and more stable topology for dense line art"
date: 2026-02-26
author: liu.ruyuan
lang: en
tags: [RU-LineArt, Rhino, NURBS, Polyline, topology]
---

> 中文版本: `/2026/02/26/ru-lineart-straight-curve-separation-export-mode-upgrade/`

This iteration targets two issues that directly affected delivery quality:

1. Straight segments were often treated as curves, causing unnecessary NURBS distortion in export.
2. Dense regions and near-parallel strokes could produce missing detections or wrong connections.

At the same time, this release also improved delivery readiness: controllable export modes, clearer debugging visibility, and a more unified desktop packaging workflow.

## Core Update 1: Three Geometry Export Modes 🎛️

A new config option is added: `fit.geometry_mode`

- `mixed`: automatic classification (default)
- `polyline_only`: force all outputs to Polyline (PL)
- `nurbs_only`: force all outputs to NURBS

CLI override is also supported:

```bash
.venv/bin/sketch2rhino run \
  --image /absolute/path/to/input.png \
  --out /absolute/path/to/output.3dm \
  --config configs/default.yaml \
  --geometry-mode polyline_only
```

Implementation points:

- `src/sketch2rhino/config.py` (new mode schema and validation)
- `src/sketch2rhino/pipeline.py` (mode-based forced fitting routes)
- `src/sketch2rhino/cli.py` (new `--geometry-mode`)

## Core Update 2: Stronger Segmentation and Line Classification ✂️

To address "rectangles becoming rounded" and "local straight parts pulled by global curve fitting," segmentation and line recognition were reinforced with:

- multi-scale corner detection
- fillet-aware segmentation
- endpoint node alignment for easier downstream Join
- polyline-first export for straight segments

New presets for dense line drawings:

- `configs/dense_topology.yaml`
- `configs/parallel_detail.yaml`

## Core Update 3: Topology and Debug Visualization Upgrade 🔍

Debug artifacts were added/refined:

- `01_binarized.png`
- `02_skeleton.png`
- `03_path_overlay.png` (path extraction result)
- `03_segment_overlay.png` (after segmentation, before fitting)

This allows layered diagnosis for "missing strokes" and "wrongly connected strokes," instead of only inspecting the final 3DM.

## Core Update 4: Desktop App and Agent Discovery Readiness 🧩

Desktop and discovery capabilities were improved together:

- local API and discovery files (`tool_manifest.json` / `README_AI.md`)
- updated desktop build scripts and instructions
- update feed example (`update_feed.example.json`)

## README and Tests ✅

README was updated for the new capabilities, including:

- geometry mode guidance (`mixed / polyline_only / nurbs_only`)
- CLI parameter `--geometry-mode`
- parameter hints for parallel lines and dense regions

Test status:

- new mode test: `tests/test_geometry_mode.py`
- full test suite passed: `29 passed`

Commit in RU-LineArt repo: `cb21cca`

## Packaging Output 📦

### macOS

- package directory: `/Users/mac/Documents/RU-LineArt/sketch2rhino/desktop_app/release/RU-LineArt-macOS-20260226-163100`
- versioned zip: `/Users/mac/Documents/RU-LineArt/sketch2rhino/desktop_app/release/RU-LineArt-macOS-20260226-163100.zip`
- fixed-name zip (updated): `/Users/mac/Documents/RU-LineArt/sketch2rhino/desktop_app/release/RU-LineArt-macOS.zip`

### Windows

- existing zip (release folder): `/Users/mac/Documents/RU-LineArt/sketch2rhino/desktop_app/release/RU-LineArt-windows.zip`

Note: Windows packaging is still recommended on a Windows runner (GitHub Actions) or a native Windows machine for runtime consistency.

## Usage Advice (How to Pick a Mode) 🚀

- Need flexible downstream editing: start with `mixed`.
- Straight-line-heavy industrial sketches: prefer `polyline_only`.
- Need unified curve semantics or NURBS-based surfacing pipeline: use `nurbs_only`.

## One-Line Summary ✍️

This update upgrades "line art to 3DM" from a single fitting path into a controlled export system with stronger topology handling and a diagnosable debug pipeline, making dense sketch scenarios more stable and production-ready.
