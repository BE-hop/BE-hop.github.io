---
layout: post
title: "RU-LineArt Latest Update (2026-02-16) 🛠️"
subtitle: "Optional hand-drawn stroke stabilization added: denoise first, fit later, preserve key anchors"
date: 2026-02-16
author: liu.ruyuan
lang: en
tags: [RU-LineArt, Rhino, NURBS, stroke stabilization, project iteration]
---

> 中文版本: `/2026/02/16/ru-lineart-latest-update/`

This iteration focuses on a very specific issue:
**hand-drawn lines naturally jitter, but we still want smoother curves in Rhino without shape drift**.

In practical tests, we observed a key signal:
the same extracted curve looks much smoother after one Rhino `Rebuild`.
That indicates the missing piece is not "stronger fitting," but **pre-fit stabilization**.

## Visual Result (Before vs After) 👀

<div style="display:grid; grid-template-columns:repeat(auto-fit,minmax(280px,1fr)); gap:16px; margin:12px 0 8px;">
  <figure style="margin:0;">
    <figcaption style="margin:0 0 8px;">Input (Before)</figcaption>
    <div style="height:320px; display:flex; align-items:center; justify-content:center; background:#101218; border-radius:8px; overflow:hidden;">
      <img src="/img/ai-products/ru-lineart-input.jpg" alt="RU-LineArt Input" style="max-width:100%; max-height:100%; object-fit:contain;" />
    </div>
  </figure>
  <figure style="margin:0;">
    <figcaption style="margin:0 0 8px;">Output (After)</figcaption>
    <div style="height:320px; display:flex; align-items:center; justify-content:center; background:#101218; border-radius:8px; overflow:hidden;">
      <img src="/img/ai-products/ru-lineart-output.png" alt="RU-LineArt Output" style="max-width:100%; max-height:100%; object-fit:contain;" />
    </div>
  </figure>
</div>

## Goals for This Iteration 🎯

1. Keep baseline behavior intact to avoid side effects from changing global defaults.
2. Add an optional "hand-drawn stabilization" capability, similar to stroke smoothing in drawing software.
3. Preserve endpoints and crossing anchors so smoothing does not cause drift or broken continuity.

## Core Changes 🧩

### 1) Added a New Stabilization Stage (Optional)

A new `fit.stabilize` stage is inserted before fitting, with this flow:

1. Arc-length resampling (uniform point spacing to reduce uneven pixel sampling effects).
2. Multi-pass Savitzky-Golay smoothing (remove high-frequency jitter).
3. `blend` controls the mix ratio between "original trajectory vs smoothed trajectory."
4. After each pass, endpoints and protected anchors are snapped back (prevent key-position drift).

Implementation file:
- `sketch2rhino/src/sketch2rhino/fit/stroke_stabilize.py`

### 2) Integrated into Main Pipeline but Disabled by Default

Pipeline now becomes:
`path_extract -> stabilize(optional) -> simplify -> nurbs_fit`

Benefits:
- Smoothing handles jitter noise first,
- simplification and NURBS fitting then handle geometric expression,
- each stage has a clear role and avoids interference.

Changed file:
- `sketch2rhino/src/sketch2rhino/pipeline.py`

### 3) Expanded Configuration System

Added config model: `StabilizeConfig`, including:
- `enable`
- `method` (currently `savgol`)
- `window`
- `polyorder`
- `passes`
- `blend`
- `resample_step_px`
- `anchor_snap_radius_px`

Changed files:
- `sketch2rhino/src/sketch2rhino/config.py`
- `sketch2rhino/configs/default.yaml` (new fields added, default `enable: false`)

### 4) Added a Hand-Drawn Preset

For out-of-the-box usage:
- `sketch2rhino/configs/handdrawn_smooth.yaml`

This preset enables stabilization by default with parameters tuned for hand-drawn jitter reduction.

### 5) Added Tests and Updated Docs

New test coverage includes:
- roughness decreases after stabilization
- endpoints remain fixed
- protected anchors are preserved

New test file:
- `sketch2rhino/tests/test_stabilize.py`

Documentation updated:
- `sketch2rhino/README.md`

## Why This Approach Is More Stable ✅

Previously, directly increasing fit smoothness (for example only tuning `spline.smoothing`) caused two common side effects:

1. Curves become rounder but less faithful to original hand-drawn trajectory.
2. Crossings or endpoints get pulled away.

The new strategy separates concerns:
- **stabilize first (clean input)**,
- **fit second (express geometry)**.

Anchor snap-back ensures critical topology positions are retained.

## Results 📊

- Default behavior stays unchanged (backward-compatible with old outputs).
- With the hand-drawn preset enabled, subjective smoothness improves clearly.
- On `sample_crossing`, polyline points converge from `[12, 11]` to `[11, 7]`, and control points from `[10, 8]` to `[10, 6]`, while key structure continuity is preserved.
- All tests passed: `10 passed`.

## Usage 🚀

### Keep Original Baseline (Default)

```bash
.venv/bin/sketch2rhino run \
  --image data/samples/sample.png \
  --out   data/outputs/sample.3dm \
  --config configs/default.yaml \
  --debug data/outputs/debug_sample
```

### Enable Hand-Drawn Stabilization Preset

```bash
.venv/bin/sketch2rhino run \
  --image data/samples/sample.png \
  --out   data/outputs/sample_smooth.3dm \
  --config configs/handdrawn_smooth.yaml \
  --debug data/outputs/debug_sample_smooth
```

## Tuning Tips (Hand-Drawn Scenarios)

- Want smoother results: increase `fit.stabilize.window` first (for example `13 -> 15`).
- Want closer shape fidelity: reduce `fit.stabilize.blend` (for example `0.75 -> 0.6`).
- Seeing local key-point drift: increase `anchor_snap_radius_px` or inspect protected-anchor sourcing.

## Summary ✍️

This is not just "extra smoothing."
It restructures the pipeline by moving hand-drawn noise handling forward:
**stabilize first, fit second, anchor fallback always on**.

Final effect: without sacrificing topology stability, exported curves are closer to real hand-drawn intent and closer to the visual quality after manual Rhino `Rebuild`.
