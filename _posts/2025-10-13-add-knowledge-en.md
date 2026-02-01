---
layout: post
title: "📖➕ Knowledge Base Project: Added Plant Fundamentals Collection"
subtitle: "Building the automated foundation for a plant brain"
date: 2025-10-13
author: liu.ruyuan
lang: en
tags: [AI, knowledge base, plant design]
---

## Building on the previously developed local [rag_local knowledge base project]({% post_url 2025-10-10-The-first-vibe-coding-en %}), I added a new local project.

The original rag project aimed to build my plant-design knowledge base, with the long-term goal of having a chief-level plant designer's brain. I need AI knowledge to construct a baseline plant designer, which becomes my second plant-design brain.

The key point: as my project experience grows, the knowledge base will expand beyond the current limits of AI itself. Because the knowledge base is deployed locally and built with Obsidian's markdown structure, I can add knowledge anytime based on experience and reflection. Later, as long as it connects to my local Obsidian folder, it can answer any professional question.

It solves my current lack of familiarity with plants and the lack of time and energy to memorize large amounts of foundational plant knowledge. As it grows in the future, it can be shared and reused by others. That is its value.

This add_knowledge project solves the problem of collecting foundational plant knowledge. Through a fixed Q&A structure, it gathers AI-generated information about a plant's basics, ecology, planting, and more, and integrates everything into the knowledge base. It avoids manually typing plant names one by one, saving time. It runs in the background and generates a plant-dictionary-like markdown manual. Combined with the previous project, I can easily query and think through my dictionary using AI.

### Successful run log
```bash
conda activate local_rag_env
(base) mac@MacBook-Air add_knowledge % conda activate local_rag_env
(local_rag_env) mac@MacBook-Air add_knowledge % python -m src.cli.main run
2025-10-13 14:15:01,840 [INFO] src.core.runner: 正在运行 (1/4)：油松
2025-10-13 14:15:01,841 [INFO] src.core.runner: Skip element 油松 (already done)
2025-10-13 14:15:01,842 [INFO] src.core.runner: 运行完毕 (1/4)：油松，状态=skipped
2025-10-13 14:15:01,842 [INFO] src.core.runner: 正在运行 (2/4)：山杏
2025-10-13 14:15:01,842 [INFO] src.core.runner: Skip element 山杏 (already done)
2025-10-13 14:15:01,842 [INFO] src.core.runner: 运行完毕 (2/4)：山杏，状态=skipped
2025-10-13 14:15:01,842 [INFO] src.core.runner: 正在运行 (3/4)：侧柏
2025-10-13 14:15:01,842 [INFO] src.core.runner: 正在运行 (4/4)：国槐
2025-10-13 14:15:50,008 [INFO] src.core.runner: Completed element 侧柏 -> data/outputs/侧柏.md
2025-10-13 14:15:50,009 [INFO] src.core.runner: 运行完毕 (3/4)：侧柏，状态=done
2025-10-13 14:16:44,167 [INFO] src.core.runner: Completed element 国槐 -> data/outputs/国槐.md
2025-10-13 14:16:44,167 [INFO] src.core.runner: 运行完毕 (4/4)：国槐，状态=done
2025-10-13 14:16:44,167 [INFO] src.core.runner: 运行总结：共处理 4 项，完成 2，跳过 2，失败 0。
2025-10-13 14:16:44,167 [INFO] __main__: Run finished: [{'status': 'skipped', 'hash': 'a97a02074fa9f03f3c0cb530d9eb2a1ed2ba580fea1f5652ac9d5467a63002a3'}, {'status': 'skipped', 'hash': '8fa9cd5010d310c080334f8fd22588db7eeec7cf9e79535922cdcb59b83f5ea7'}, {'status': 'done', 'hash': '66005f58a96b7dba06536993192b7512cced12fe7440bf318a3c5887d264a373', 'path': 'data/outputs/侧柏.md'}, {'status': 'done', 'hash': '112eba9f36b5227ad6f4feebe31d8d5a3dc7a062fadb0e24c495ded22925d8c7', 'path': 'data/outputs/国槐.md'}]
(local_rag_env) mac@MacBook-Air add_knowledge % 
```
---

### Excerpt of generated plant knowledge
---

title: "Chinese arborvitae (侧柏)"
created_at: '2025-10-13T06:15:50.007355+00:00'
provider: qwen
model: qwen3-max
input_hash: 66005f58a96b7dba06536993192b7512cced12fe7440bf318a3c5887d264a373
project: "Knowledge Base Batch Enrichment"

---

# Chinese arborvitae (侧柏)

## I. Core skills: project-grounded "hard skills" and "soft coordination"

### 1. Botanical fundamentals: "knowing plants" is the foundation
- **Basic profile**:
  - Taxonomy: Cupressaceae · *Platycladus*; scientific name *Platycladus orientalis*; a China-endemic monotypic genus.
  - Growth habit: sun-loving; cold tolerant (to about -20°C); drought tolerant; wide soil pH tolerance (5.5–8.5); avoid waterlogging.
  - Ecology: widely distributed native of northern China; non-invasive; often forms stable communities with 油松, 山桃, 荆条, etc.; provides nesting habitat for birds (e.g., azure-winged magpie).
- **Ornamental and functional traits**:
  - Seasonal character: evergreen, stays green year-round and provides a stable backdrop in winter.
  - Form: a tree up to ~20 m tall; crown mostly conical or broadly ovate; dense branching with natural sculptural quality.
  - Functional value: strong soil stabilization (well-developed root system); wind and pollution resistance (tolerant to SO₂, Cl₂); aromatic wood with insect-repellent properties; traditional medicinal use (leaves used to cool blood and stop bleeding).
- **Practical knowledge**:
  - Propagation: mainly from seed, also cuttings (hardwood or softwood); seedlings grow slowly but are long-lived (up to a thousand years).
  - Transplanting: best in spring (Mar–Apr) or autumn (Oct–Nov); root ball diameter should be 6–8× DBH; avoid deep planting.
  - Pests/diseases: generally resistant; occasional cypress moth and double-striped longhorn beetle; can be controlled by releasing natural enemies (e.g., Scleroderma wasps) or physical trapping.

### 2. Planting design ability: "using the right plant" is core
- **Function-driven planting**:
  - Suitable for dry, poor, windy areas in northern regions (e.g., North China, Northwest) as windbreak/sand-fixation forest or ecological restoration pioneer.
  - Often used in cemeteries, temples, and memorial spaces for its solemn form and cultural symbolism (longevity, steadfastness).
  - Not suitable for low-lying or waterlogged areas, or humid southern regions (prone to root rot).
- **Aesthetic-driven planting**:
  - Color: deep green all year; useful as a background tree to contrast seasonal plants (e.g., magnolia in spring, smoke tree in autumn).
  - Layering: can be used as specimen (sculptural focus), in rows (ceremonial avenues), or in groups (dense-forest atmosphere).
  - Texture: fine scale leaves contrast with rough stone or concrete, reinforcing order in modern landscapes.
- **Ecology-driven planting**:
  - In North China, can simulate a native community structure of "Chinese arborvitae + 荆条 + 白羊草" to improve ecosystem stability.
  - Combine with drought-tolerant shrubs (e.g., 连翘, 紫穗槐) to build low-maintenance, high-biodiversity native plant communities.

### 3. Technical expression and communication: "explaining the design" is key
- **Drawing and modeling**:
  - CAD construction drawings should specify species (avoid confusion with juniper), size (e.g., H3.0m/P1.8m), and spacing (group planting 2–3 m).
  - SU/Lumion can use high-fidelity models to simulate crown expansion after 5–10 years (annual height growth ~20–30 cm).
- **Cross-disciplinary coordination**:
  - Coordinate with grading: use contour-banded planting on slopes to improve soil and water conservation.
  - Coordinate with irrigation: because it is drought-tolerant, reduce drip points and only keep temporary irrigation in the first 1–2 years.
- **Client communication**:
  - Emphasize its advantages: low maintenance, long lifespan, and cultural value to persuade clients away from high-maintenance evergreens (e.g., cedar).
  - Explain that "slow growth" is not a flaw but a long-term ecological investment (e.g., millennium-old arborvitae at Beijing Tanzhe Temple).

### 4. On-site guidance and implementation: "survive and thrive" is the baseline
- **Planting stage**:
  - Verify nursery sources: prioritize locally grown seedling stock (better adaptability) and avoid southern grafted stock.
  - Supervise planting: keep the root collar slightly above grade; mix backfill with ~30% humus to improve aeration.
- **Maintenance handoff**:
  - Establishment care: water 3 times after planting (5–7 day intervals), then gradually reduce; young trees need winter protection from desiccation (use windbreaks).
  - Long-term tracking: record survival rates and growth speed; optimize future plant selection standards (e.g., prefer 4–6 cm DBH to balance cost and survival).

## II. Sustainable growth skills: the "evolution" to handle change

### 1. Continuous updates on policy and ecological theory
- **Policy alignment**:
  - Fits national afforestation and difficult-site ecological restoration policies; suitable for mine restoration and barren hill afforestation.
  - Strong carbon sequestration (about 5–8 kg carbon per tree per year), contributing to dual-carbon goals.
- **Ecological theory application**:
  - Under the "near-natural forestry" concept, it can serve as a building species for North China mountain forests, guiding natural succession.
  - In the "low-maintenance landscape" trend, it can replace high-water turf and build water-saving evergreen frameworks.

### 2. Iterative application of new tools
- **Digital tools**:
  - Use PlantPredict to simulate growth curves under different site conditions and estimate spatial occupancy after 10 years.
  - Use drone imagery to assess the health of existing arborvitae stands (NDVI analysis).
- **Database building**:
  - Build a "Chinese arborvitae application database" to record survival rates, pest incidence, and aesthetic performance across regions (e.g., Beijing, Shanxi, Gansu).

### 3. Expanding interdisciplinary knowledge
- **Related disciplines**:
  - Soil science: in limestone mountains, Chinese arborvitae can tolerate high-calcium environments without extra amendment.
  - Humanities and social studies: in rural landscapes, arborvitae is often planted at village entrances or ancestral halls, carrying feng-shui forest meaning; design should respect cultural context.
- **Cross-domain collaboration**:
  - Collaborate with ecologists in degraded landscapes...
