---
layout: post
title: "From Sketch Lines to Rhino-Editable Curves: RU-LineArt Progress Update 🚀"
subtitle: "The MVP is running ✅; the next phase focuses on stability, accuracy, and evaluability"
date: 2026-02-15
author: liu.ruyuan
lang: en
tags: [RU-LineArt, Rhino, NURBS, computer vision, project update]
---

> 中文版本: `/2026/02/15/ru-lineart-project-progress/`

## Project Background and Goal 🎯

I am building a local tool called `RU-LineArt`, with a clear goal:

- Input: a single-line planar sketch (allowing hand jitter, uneven stroke width, and local crossings)
- Output: `.3dm` curve objects that remain editable in Rhino
- Constraint: fully automatic, no manual interaction, and MVP-first focus on "runnable" + "editable"

The core value is converting "visually perceived sketch lines" into "geometrically editable curves."

## Current Technical Pipeline (Implemented) 🧩

The end-to-end pipeline is already running:

1. Preprocessing (`vision/preprocess.py`)
   - Grayscale loading and normalization
   - Otsu / adaptive binarization
   - Optional denoising (Gaussian / Bilateral)
   - Morphological cleanup (open/close)

2. Skeletonization (`vision/skeletonize.py`)
   - Uses `skimage` skeletonization to compress thick strokes into single-pixel centerlines
   - Adds spur pruning to remove short noisy branches

3. Topology Graph + Path Extraction (`topo/graph_build.py` + `topo/path_extract.py`)
   - Builds pixel graph with 8-neighborhood connectivity
   - Supports connected-component modes (`largest` / `all`)
   - Endpoint-pair path extraction (Dijkstra pairing)
   - Crossing strategy uses `overpass`, favoring straight-through behavior
   - Loops are cut and exported as open curves for consistency

4. Geometric Fitting (`fit/polyline_simplify.py` + `fit/nurbs_fit.py`)
   - RDP simplification + moving-average smoothing
   - Iterative open-curve NURBS fitting with `splprep`
   - Control-point count constrained by config (default `<= 50`)
   - Includes fallback strategies for fitting failures, so the pipeline exits stably

5. Rhino Export (`export/rhino3dm_writer.py`)
   - Uses `rhino3dm` to generate `.3dm`
   - Supports both single-curve and multi-curve export
   - Auto-layering and naming (`main_nurbs` for single; `stroke_001...` for multi)

6. Debug Artifacts (`debug/*`)
   - Auto-exports binary maps, skeleton maps, path overlays, polyline/NURBS JSON, and reports
   - Makes it easy to trace issues stage by stage: image -> topology -> geometry

## Progress and Validation Results 📊

The project has moved from "solution design" to a "usable MVP":

- CLI can run directly:

```bash
.venv/bin/sketch2rhino run \
  --image data/samples/sample.png \
  --out   data/outputs/sample.3dm \
  --config configs/default.yaml \
  --debug data/outputs/debug_sample
```

- Output modes now support:
  - `single`: extract one main curve
  - `multi`: extract multiple open curves and sort by length

- Testing status: 8 `pytest` test cases, all passing (preprocessing, skeletonization, path extraction, NURBS fitting, and 3dm export all covered)

- Multiple sample artifacts have been generated:
  - `data/outputs/sample_curve_multi_v2.3dm`
  - `data/outputs/sample_crossing_multi_v2.3dm`
  - Matching debug directories include full intermediate outputs and `report.json`

- A typical report shows:
  - `curve_multi_v2`: single-curve export, 9 control points, millisecond-level total pipeline time
  - `crossing_multi_v2`: two-curve export (`curve_count = 2`), and crossing cases are now split and exported stably

## Known Boundaries at This Stage ⚠️

Although the MVP is functional, it is not yet production-generalizable:

- In highly tangled sketches, main-path selection can still deviate from human expectation
- Crossing/loop robustness needs more pressure testing on real-world samples
- Systematic quality metrics are still missing (for example, geometric error and editability scores)
- The repository still lacks formal commit history; versioning and milestone management should be completed soon

## Next Phase Plan 🛠️

The next focus is "stability + evaluability":

1. Build a small benchmark dataset and evaluation scripts (scenario-based statistics)
2. Strengthen crossing disambiguation and loop-cut strategies to reduce wrong connections
3. Add regression tests for failure-prone cases and expand test coverage
4. Complete the first normalized commits and version milestones for a regular release rhythm
5. Evaluate an optional "light interactive correction" mode (while keeping full-auto as default)

## Summary ✍️

The key milestone is not a single algorithmic trick, but a full engineering loop:
from sketch pixels, to skeleton topology, to Rhino-editable NURBS, now completed end-to-end.

The project objective is shifting from "can run" to "stable, accurate, and measurable."
