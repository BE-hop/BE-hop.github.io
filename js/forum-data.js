(() => {
  const topics = [
    {
      slug: "ai-irrigation-2026",
      category: "ai",
      tags: ["pinned", "news", "trending"],
      author: {
        name: "Sarah Mitchell",
        initials: "SM",
        role: { en: "AI Specialist", zh: "AI 专家" },
      },
      stats: { replies: 47, views: 1234 },
      date: "2026-02-02T09:00:00Z",
      readTime: { en: "6 min", zh: "6 分钟" },
      title: {
        en: "How AI is revolutionizing irrigation systems in 2026",
        zh: "AI 如何在 2026 年重塑灌溉系统",
      },
      excerpt: {
        en: "Exploring smart irrigation strategies, sensor fusion, and ML-driven scheduling for healthier landscapes with less water.",
        zh: "讨论智能灌溉、传感器融合与机器学习排程，帮助景观更健康、用水更少。",
      },
      content: [
        {
          type: "p",
          en: "Modern irrigation now blends soil sensors, weather APIs, and evapotranspiration models into a single control layer. Instead of static schedules, AI adjusts zones in near real-time based on plant stress signals and microclimate shifts.",
          zh: "现代灌溉已将土壤传感器、天气 API 与蒸散模型整合到统一控制层，不再依赖固定排程，而是依据植物胁迫与微气候变化实时微调分区。",
        },
        {
          type: "p",
          en: "Teams report 25–40% water savings while improving plant health and reducing runoff violations. The biggest gains come from pairing smart valves with continuous soil moisture calibration.",
          zh: "许多团队报告节水 25–40%，并改善植物健康、降低径流违规风险，最显著的效果来自智能阀门与持续的土壤湿度校准。",
        },
        {
          type: "h2",
          en: "Implementation checklist",
          zh: "实施清单",
        },
        {
          type: "ul",
          en: [
            "Audit irrigation zones and verify flow rates",
            "Integrate local weather + ET data",
            "Set manual override rules for extreme events",
            "Track KPIs: water per zone, plant stress, runoff",
          ],
          zh: [
            "复核灌溉分区与流量参数",
            "接入本地天气与蒸散数据",
            "设置极端天气的人工干预规则",
            "跟踪指标：分区用水、植物胁迫、径流",
          ],
        },
        {
          type: "p",
          en: "Start with a pilot site, validate data accuracy, then scale to larger properties. Clear ownership between operations and tech teams prevents drift in sensor maintenance.",
          zh: "建议从试点场地开始验证数据准确性，再扩展到更大项目。运维与技术团队明确分工，可避免传感器维护失控。",
        },
      ],
    },
    {
      slug: "sustainable-landscaping-guide",
      category: "landscape",
      tags: ["pinned", "featured"],
      author: {
        name: "James Chen",
        initials: "JC",
        role: { en: "Landscape Architect", zh: "景观设计师" },
      },
      stats: { replies: 32, views: 892 },
      date: "2026-02-02T07:00:00Z",
      readTime: { en: "7 min", zh: "7 分钟" },
      title: {
        en: "Sustainable landscaping practices: A comprehensive guide",
        zh: "可持续景观实践：全面指南",
      },
      excerpt: {
        en: "A practical framework for designing resilient, low-impact landscapes from site analysis to long-term maintenance.",
        zh: "从场地分析到长期维护的实践框架，帮助设计更具韧性、低影响的景观。",
      },
      content: [
        {
          type: "p",
          en: "Sustainable landscapes start with site-specific decisions: soil remediation, water availability, and native plant communities. Early analysis reduces future maintenance costs and supports biodiversity.",
          zh: "可持续景观始于针对场地的决策：土壤修复、水资源评估与本土植物群落。前期分析能降低后期维护成本并提升生物多样性。",
        },
        {
          type: "p",
          en: "Pair drought-tolerant planting with layered irrigation, mulching, and permeable surfaces. The goal is to slow runoff and retain moisture without increasing labor.",
          zh: "将耐旱植物与分层灌溉、覆盖物和透水铺装结合，实现减缓径流与保水，同时不增加维护强度。",
        },
        {
          type: "h2",
          en: "Design framework",
          zh: "设计框架",
        },
        {
          type: "ul",
          en: [
            "Native-first plant palettes with seasonal interest",
            "Low-carbon materials and local sourcing",
            "Maintenance plans aligned with growth cycles",
            "Biodiversity corridors and pollinator zones",
          ],
          zh: [
            "以本土植物为主并兼顾季相变化",
            "低碳材料与本地采购优先",
            "与生长周期匹配的维护计划",
            "构建生物多样性廊道与传粉区",
          ],
        },
        {
          type: "p",
          en: "Communicate measurable outcomes to clients: water savings, reduced fertilizers, and carbon estimates. Clear metrics build trust and justify premium design fees.",
          zh: "向客户展示可量化成果：节水、减少化肥使用和碳排估算。明确指标能建立信任并支撑更高的设计价值。",
        },
      ],
    },
    {
      slug: "epa-regulations-landscape-contractors",
      category: "news",
      tags: ["news"],
      author: {
        name: "Michael Torres",
        initials: "MT",
        role: { en: "Regulatory Analyst", zh: "法规分析师" },
      },
      stats: { replies: 28, views: 756 },
      date: "2026-02-02T05:00:00Z",
      readTime: { en: "5 min", zh: "5 分钟" },
      title: {
        en: "New EPA regulations impact on landscape contractors",
        zh: "新 EPA 法规对景观承包商的影响",
      },
      excerpt: {
        en: "What the latest guidance means for pesticide runoff, stormwater controls, and field documentation.",
        zh: "解读最新指南对农药径流、雨洪控制和现场记录的影响。",
      },
      content: [
        {
          type: "p",
          en: "The EPA updates focus on runoff control, chemical storage, and documentation for commercial landscape operations. Contractors should expect stricter audits on water discharge and pesticide handling.",
          zh: "EPA 新规强调径流控制、化学品储存与商业景观作业的记录管理，预计对排水与农药处理的审计将更严格。",
        },
        {
          type: "p",
          en: "Operational impacts include more frequent site inspections, updated training requirements, and tighter controls on application schedules during rain events.",
          zh: "运营层面需增加现场检查频次、更新培训要求，并在雨天对施用计划实施更严格的限制。",
        },
        {
          type: "h2",
          en: "Action steps",
          zh: "建议行动",
        },
        {
          type: "ul",
          en: [
            "Audit chemical storage and spill response kits",
            "Update SOPs for runoff and stormwater",
            "Document applications with photos and logs",
            "Review local/state guidance for add-ons",
          ],
          zh: [
            "核查化学品储存与泄漏应急装备",
            "更新径流与雨洪管理 SOP",
            "用照片与日志记录施用情况",
            "结合地方/州级细则补充要求",
          ],
        },
        {
          type: "p",
          en: "Always consult local regulations and legal counsel for compliance. The guidance is evolving and may differ by state and watershed authority.",
          zh: "建议结合地方监管与法律顾问确保合规。该指南仍在变化，且不同州与流域管理机构存在差异。",
        },
      ],
    },
    {
      slug: "drones-property-surveys",
      category: "ai",
      tags: ["trending"],
      author: {
        name: "Emily Rodriguez",
        initials: "ER",
        role: { en: "Tech Consultant", zh: "技术顾问" },
      },
      stats: { replies: 19, views: 543 },
      date: "2026-02-02T03:00:00Z",
      readTime: { en: "6 min", zh: "6 分钟" },
      title: {
        en: "Using drones for large-scale property surveys",
        zh: "使用无人机进行大型场地测绘",
      },
      excerpt: {
        en: "A practical workflow for drone-based surveys, photogrammetry, and site planning.",
        zh: "无人机测绘、摄影测量与场地规划的实用流程。",
      },
      content: [
        {
          type: "p",
          en: "Drones enable fast capture of topography, vegetation health, and construction progress. For large properties, they reduce survey time from days to hours.",
          zh: "无人机可快速获取地形、植被健康与施工进度等信息，对于大型场地，测绘时间可从数天缩短到数小时。",
        },
        {
          type: "p",
          en: "Pair flight planning software with photogrammetry tools to generate orthomosaics and 3D models. Export surfaces directly into CAD or GIS workflows.",
          zh: "结合航线规划与摄影测量工具生成正射影像与三维模型，并可直接导出到 CAD 或 GIS 流程。",
        },
        {
          type: "h2",
          en: "Recommended workflow",
          zh: "推荐流程",
        },
        {
          type: "ul",
          en: [
            "Define survey goals and ground control points",
            "Capture imagery with consistent overlap",
            "Process data into models and contours",
            "Validate accuracy with spot checks",
          ],
          zh: [
            "明确测绘目标与控制点",
            "以一致重叠率采集影像",
            "处理数据生成模型与等高线",
            "用抽样测点验证精度",
          ],
        },
        {
          type: "p",
          en: "Always follow airspace regulations and obtain required permits. Safety protocols are critical when working near active job sites.",
          zh: "请遵守空域法规并取得必要许可。在施工现场附近飞行时，安全流程尤为重要。",
        },
      ],
    },
    {
      slug: "low-maintenance-plants",
      category: "landscape",
      tags: ["featured"],
      author: {
        name: "David Park",
        initials: "DP",
        role: { en: "Horticulturist", zh: "园艺师" },
      },
      stats: { replies: 41, views: 987 },
      date: "2026-02-01T21:00:00Z",
      readTime: { en: "4 min", zh: "4 分钟" },
      title: {
        en: "Best plants for low-maintenance commercial properties",
        zh: "低维护商业场地的植物推荐",
      },
      excerpt: {
        en: "A curated palette of resilient plants that keep maintenance costs low without sacrificing visual impact.",
        zh: "精选耐久植物组合，在控制维护成本的同时保持景观表现力。",
      },
      content: [
        {
          type: "p",
          en: "Choose drought-tolerant and disease-resistant species matched to local climate zones. Layering grasses, shrubs, and groundcovers creates texture while reducing weed pressure.",
          zh: "选择适应当地气候的耐旱、抗病品种，通过草本、灌木与地被的分层配置形成质感并减少杂草压力。",
        },
        {
          type: "p",
          en: "Favor plants with long seasonal interest and minimal pruning needs. Standardized palettes also simplify procurement and replacement.",
          zh: "优先选择季相持久、修剪需求低的植物，标准化的植物清单还能简化采购与替换。",
        },
        {
          type: "h2",
          en: "Planting mix ideas",
          zh: "种植组合建议",
        },
        {
          type: "ul",
          en: [
            "Ornamental grasses + evergreen shrubs",
            "Native perennials with long bloom cycles",
            "Low-growing groundcovers for edging",
            "Succulents for high-heat zones",
          ],
          zh: [
            "观赏草 + 常绿灌木",
            "花期长的本土多年生植物",
            "低矮地被用于边界与覆土",
            "高热区域使用多肉类植物",
          ],
        },
        {
          type: "p",
          en: "Combine with smart irrigation and soil amendments to further reduce maintenance. Document plant performance to refine future palettes.",
          zh: "结合智能灌溉与土壤改良可进一步降低维护成本，并记录植物表现以优化后续配置。",
        },
      ],
    },
    {
      slug: "ml-pest-detection",
      category: "ai",
      tags: ["trending", "aitalk"],
      author: {
        name: "Lisa Wang",
        initials: "LW",
        role: { en: "AI Researcher", zh: "AI 研究员" },
      },
      stats: { replies: 23, views: 612 },
      date: "2026-02-01T12:00:00Z",
      readTime: { en: "5 min", zh: "5 分钟" },
      title: {
        en: "Machine learning for pest detection and prevention",
        zh: "机器学习在虫害识别与预防中的应用",
      },
      excerpt: {
        en: "AI Talk: use Q&A to break down how computer vision catches early pest risks and guides intervention.",
        zh: "AI Talk：通过问答形式拆解计算机视觉如何提前识别虫害风险并指导干预。",
      },
      content: [
        {
          type: "p",
          en: "AItalk format uses a practical Q&A flow so teams can quickly understand how the model works and how to deploy it on site.",
          zh: "AItalk 采用实战问答流，帮助团队快速理解模型原理和现场落地方式。",
        },
        {
          type: "h2",
          en: "AItalk Q&A",
          zh: "AItalk 问答",
        },
        {
          type: "qa",
          items: [
            {
              question: {
                en: "What is the earliest visible sign the model can detect?",
                zh: "模型最早能识别哪类可见征兆？",
              },
              answer: {
                en: "Usually subtle leaf discoloration and small spotting patterns. Detection is often 5-10 days earlier than manual patrol.",
                zh: "通常是轻微叶色异常与小范围斑点模式，相比人工巡检通常可提前 5-10 天识别。",
              },
            },
            {
              question: {
                en: "How do we reduce false positives in a real project?",
                zh: "在真实项目中如何降低误报？",
              },
              answer: {
                en: "Use fixed camera angles, standard light windows, and weekly human review. Keep image labels updated after each confirmed case.",
                zh: "采用固定拍摄角度、统一光照时间窗，并进行每周人工复核；每次确诊后都同步更新标注数据。",
              },
            },
            {
              question: {
                en: "Should the model run in the cloud or on edge devices?",
                zh: "模型应该跑在云端还是边缘设备？",
              },
              answer: {
                en: "For time-sensitive sites, use edge inference for alerts and sync summarized data to cloud for retraining.",
                zh: "对时效要求高的场地建议边缘端实时识别预警，同时将摘要数据回传云端用于再训练。",
              },
            },
            {
              question: {
                en: "How does this connect with existing maintenance SOPs?",
                zh: "这套系统如何与现有养护 SOP 融合？",
              },
              answer: {
                en: "Map each alert level to a clear action list: inspect zone, capture close-up photos, apply targeted treatment, then log outcome.",
                zh: "将每个告警等级映射到明确动作：分区复检、补拍近景、精准处理、记录结果并回写系统。",
              },
            },
          ],
        },
        {
          type: "p",
          en: "Publishing future AItalk posts only needs the `aitalk` tag plus `qa` content blocks. The detail page will switch to dialogue mode automatically.",
          zh: "后续发布 AItalk 内容时，只需添加 `aitalk` 标签并使用 `qa` 内容块，详情页会自动切换为对话模式。",
        },
      ],
    },
    {
      slug: "landscapetech-summit-2026",
      category: "news",
      tags: ["news"],
      author: {
        name: "Robert Kim",
        initials: "RK",
        role: { en: "Industry Analyst", zh: "行业分析师" },
      },
      stats: { replies: 15, views: 423 },
      date: "2026-02-01T08:00:00Z",
      readTime: { en: "4 min", zh: "4 分钟" },
      title: {
        en: "Industry conference recap: LandscapeTech Summit 2026",
        zh: "行业会议回顾：LandscapeTech Summit 2026",
      },
      excerpt: {
        en: "Highlights from the year’s largest landscape technology gathering, plus the trends that stood out.",
        zh: "年度最大景观科技大会回顾，以及最值得关注的趋势。",
      },
      content: [
        {
          type: "p",
          en: "This year’s summit emphasized automation, electrification, and AI-enabled maintenance workflows. Vendors showcased end-to-end platforms that connect design, build, and operations.",
          zh: "今年大会强调自动化、电动化与 AI 驱动的维护流程，供应商展示了连接设计、施工与运维的端到端平台。",
        },
        {
          type: "p",
          en: "Notable launches included robotic mowing fleets, battery storage for job sites, and digital twin tools for large campuses.",
          zh: "亮点产品包括机器人割草车队、工地储能系统以及大型园区数字孪生工具。",
        },
        {
          type: "h2",
          en: "Trends to watch",
          zh: "值得关注的趋势",
        },
        {
          type: "ul",
          en: [
            "Battery performance and charging infrastructure",
            "Autonomous maintenance for large estates",
            "AI scheduling across labor + equipment",
            "Water intelligence and sensor fusion",
          ],
          zh: [
            "电池性能与充电基础设施",
            "大型园区的自动化维护",
            "AI 驱动的人员与设备排程",
            "水资源智能与传感器融合",
          ],
        },
        {
          type: "p",
          en: "If you attended, share your favorite session notes or vendor demos. The community benefits from real-world feedback beyond the brochures.",
          zh: "如果你参会，欢迎分享最有价值的议题或展示，社区更需要来自一线的反馈而非宣传册。",
        },
      ],
    },
    {
      slug: "profitable-maintenance-program",
      category: "business",
      tags: ["featured"],
      author: {
        name: "Amanda Foster",
        initials: "AF",
        role: { en: "Operations Lead", zh: "运营负责人" },
      },
      stats: { replies: 56, views: 1567 },
      date: "2026-01-31T12:00:00Z",
      readTime: { en: "8 min", zh: "8 分钟" },
      title: {
        en: "Building a profitable landscape maintenance program",
        zh: "打造可盈利的景观养护计划",
      },
      excerpt: {
        en: "From scope definition to retention strategy, build a maintenance program that delivers steady revenue and client trust.",
        zh: "从服务范围到留存策略，建立稳定收入并赢得客户信任的养护体系。",
      },
      content: [
        {
          type: "p",
          en: "Recurring maintenance revenue depends on clear scope, consistent quality, and predictable staffing. Documented service tiers simplify sales and reduce scope creep.",
          zh: "稳定的维护收入来自清晰的服务范围、稳定的质量与可预测的人员配置。标准化服务层级能减少范围扩张带来的风险。",
        },
        {
          type: "p",
          en: "Pricing works best when aligned to outcomes: plant health, site appearance, and response SLAs. Offer optional add-ons that solve seasonal pain points.",
          zh: "定价应与结果挂钩：植物健康、场地表现与响应时效。提供针对季节痛点的增值选项，可提升续约率。",
        },
        {
          type: "h2",
          en: "Program components",
          zh: "项目组成",
        },
        {
          type: "ul",
          en: [
            "Seasonal checklists and reporting",
            "Client communication cadence",
            "Quality audits and photo logs",
            "Upsell pathways and renewal timing",
          ],
          zh: [
            "季节性检查清单与报告",
            "客户沟通节奏与节点",
            "质量抽检与照片记录",
            "增值服务路径与续约时机",
          ],
        },
        {
          type: "p",
          en: "Track margin per property and adjust staffing early. Small operational changes often yield bigger gains than aggressive price hikes.",
          zh: "持续追踪单个项目的利润率并及时调整人力配置，往往比激进涨价更有效。",
        },
      ],
    },
    {
      slug: "aitalk-design-copilot",
      category: "ai",
      tags: ["aitalk", "featured"],
      author: {
        name: "Noah Lin",
        initials: "NL",
        role: { en: "Product Designer", zh: "产品设计师" },
      },
      stats: { replies: 18, views: 468 },
      date: "2026-02-03T10:00:00Z",
      readTime: { en: "6 min", zh: "6 分钟" },
      title: {
        en: "AI Talk: How a design copilot speeds up landscape concepting",
        zh: "AI Talk：设计副驾如何加速景观方案概念阶段",
      },
      excerpt: {
        en: "A practical Q&A case about prompts, iteration loops, and team collaboration in a real design workflow.",
        zh: "一个实战问答案例：如何在真实设计流程中使用提示词、迭代闭环和团队协作。",
      },
      content: [
        {
          type: "p",
          en: "This AItalk case shows a full question-answer flow from first brief to concept alignment.",
          zh: "这个 AItalk 案例演示了从需求输入到方案对齐的完整问答流程。",
        },
        {
          type: "h2",
          en: "Project Q&A",
          zh: "项目问答",
        },
        {
          type: "qa",
          items: [
            {
              question: {
                en: "What should we feed the copilot in the first prompt?",
                zh: "第一轮提示词应该输入哪些信息？",
              },
              answer: {
                en: "Start with site constraints, target users, maintenance budget, and the emotional tone of the space. Keep each requirement as a short bullet.",
                zh: "先输入场地约束、目标人群、维护预算和空间情绪目标，并把每项需求写成简短要点。",
              },
            },
            {
              question: {
                en: "How many concept directions are reasonable in one round?",
                zh: "一轮生成多少个概念方向比较合适？",
              },
              answer: {
                en: "Three to five directions is usually enough. More options often reduce review quality and slow down decisions.",
                zh: "通常 3 到 5 个方向最合适，数量太多会降低评审质量并拖慢决策。",
              },
            },
            {
              question: {
                en: "How do we avoid pretty but unbuildable outputs?",
                zh: "如何避免“好看但落不了地”的结果？",
              },
              answer: {
                en: "Add hard constraints into every iteration: buildable slope, local species list, and material availability. Ask the model to explain tradeoffs.",
                zh: "每轮都加入硬约束：可施工坡度、本地植物清单、材料可得性，并要求模型解释取舍理由。",
              },
            },
            {
              question: {
                en: "How does the team review AI outputs efficiently?",
                zh: "团队如何高效评审 AI 输出？",
              },
              answer: {
                en: "Use a fixed checklist: spatial logic, climate fit, maintenance load, and cost risk. Keep only one actionable revision goal per round.",
                zh: "使用固定清单评审：空间逻辑、气候适配、维护负担、成本风险；每轮只保留一个可执行修改目标。",
              },
            },
          ],
        },
        {
          type: "p",
          en: "To publish more AItalk posts, keep using the `aitalk` tag and `qa` blocks. The detail page will stay in dialogue mode automatically.",
          zh: "后续只要继续使用 `aitalk` 标签和 `qa` 数据块，详情页会自动保持对话展示模式。",
        },
      ],
    },
    {
      slug: "ai-class-solidification",
      category: "ai",
      tags: ["aitalk", "trending", "featured"],
      author: {
        name: "BEhop",
        initials: "BH",
        role: { en: "AItalk Editor", zh: "AItalk 编辑" },
      },
      stats: { replies: 0, views: 0 },
      date: "2026-02-06T10:00:00Z",
      readTime: { en: "15 min", zh: "15 分钟" },
      title: {
        en: "AI Talk: Will AI intensify class solidification?",
        zh: "AI Talk：AI 会加剧阶级固化吗？",
      },
      source: "https://chatgpt.com/share/6985fa0b-daec-800b-992a-3140be0d6767",
      excerpt: {
        en: "Full AItalk transcript: from productivity equalization to the deeper power structure of distribution, trust, capital, organization, and rule-making.",
        zh: "完整 AItalk 原文：从生产力平权到分发、信任、资本、组织与规则制定权的深度拆解。",
      },
      content: [
        {
          type: "qa",
          items: [
            {
              question: {
                zh: "AI 解放生产力。但供需关系不会改变，效率的增高并不会提高需求，只会加剧竞争、压低利润。AI 带来的生产力平权是否会加剧阶级固化？当 AI 能满足所有需求，还需要新血液吗？",
              },
              answerBlocks: [
                {
                  type: "p",
                  zh: "你这个判断里有一半是“经济学的冷酷真相”，另一半是“忽略了价值捕获机制会变形”。",
                },
                {
                  type: "h2",
                  zh: "1）效率提升 ≠ 需求不变，但会改变需求形状",
                },
                {
                  type: "p",
                  zh: "在既定偏好与预算下，供给暴增会把同质化产品的边际利润压到接近零，尤其是数字内容、软件、设计稿这类复制成本趋近于 0 的品类。",
                },
                {
                  type: "p",
                  zh: "但效率提升会带来两种需求变化：",
                },
                {
                  type: "ul",
                  zh: [
                    "释放原来“太贵/太麻烦”的需求（例如小团队过去请不起的定制和个性化）。",
                    "竞争从“能不能做”迁移到“做什么、为什么、谁来信、在哪卖”（品牌、渠道、信任、审美、合规、服务）。",
                  ],
                },
                {
                  type: "p",
                  zh: "所以“利润更低”对同质供给成立；但对“能拿到渠道、能做差异、能做系统服务”的供给并不必然成立。",
                },
                {
                  type: "h2",
                  zh: "2）生产力平权会不会加剧固化？会，而且是分叉式",
                },
                {
                  type: "p",
                  zh: "更准确的一句话：AI 降低了技能壁垒，但抬高了资本、分发与组织壁垒。",
                },
                {
                  type: "ul",
                  zh: [
                    "加剧固化（强者更强）：已有数据、算力、资金、渠道、品牌、合规资源与用户关系的组织，更容易把 AI 变成长期资产。",
                    "打破固化（新机会）：个人与小团队也能做出过去大公司才做得出的东西，但机会不在“同质产品更快”，而在新分发方式、新产品形态（工作流工具/服务化）和跨学科组合。",
                  ],
                },
                {
                  type: "p",
                  zh: "结论不是“必然固化”，而是“技能平权 ≠ 结果平权”。结果取决于能否把 AI 能力转化为可持续价值捕获点。",
                },
                {
                  type: "h2",
                  zh: "3）“你所在的位置决定责任，也决定你怎么用 AI”",
                },
                {
                  type: "ul",
                  zh: [
                    "既得位置：更容易把 AI 用于降本增效、强化控制、提高壁垒。若只追求效率最大化，系统会更集中、更排他。",
                    "挑战者位置：应把 AI 用在快速试错、跨界组合、做小而深、建立信任网络。关键提醒是“做得出来不等于卖得出去”。",
                  ],
                },
                {
                  type: "h2",
                  zh: "4）“AI 满足所有需求后还需要新血液吗？”",
                },
                {
                  type: "p",
                  zh: "短期会出现“既然机器能满足需求，为何还培养新人”的诱惑，但长期仍然必须需要新血液：",
                },
                {
                  type: "ul",
                  zh: [
                    "需求会漂移：满足一层后会长出下一层。",
                    "价值不仅是产出，还有意义与信任（医疗、教育、公共治理、文化都绕不开“人对人的认可”）。",
                    "系统需要多样性对抗脆弱性：越依赖单一系统，越需要新目标、新价值判断、新纠错视角。",
                    "“AI 满足了什么需求”本质是权力问题。没有新血液参与，决定权会越来越集中。",
                  ],
                },
                {
                  type: "p",
                  zh: "更尖锐地说：当 AI 能满足所有“被定义过”的需求，真正稀缺的是“定义新需求与新规则的权力”。",
                },
                {
                  type: "p",
                  zh: "现实判断：AI 会把制作能力变成基础设施，真正分层的是谁拥有分发、信任、资本与规则制定权。",
                },
              ],
            },
            {
              question: {
                zh: "详细分析理解“定义新需求与新规则的权力”“分发、信任、资本和规则制定权”“资本、分发与组织壁垒”“人对人的认可”。",
              },
              answerBlocks: [
                {
                  type: "p",
                  zh: "把这四组关键词合起来看，它们其实是同一个逻辑：产能变便宜后，稀缺从“会做”迁移到“能被选择、能被相信、能被规模化、能被合法化”。",
                },
                {
                  type: "h2",
                  zh: "1）定义新需求与新规则的权力",
                },
                {
                  type: "p",
                  zh: "这包含两层权力：定义需求与定义规则。",
                },
                {
                  type: "h2",
                  zh: "A. 定义新需求：不是满足，而是命名",
                },
                {
                  type: "ul",
                  zh: [
                    "命名权：把模糊痛点命名成清晰问题。谁命名，谁设定讨论框架。",
                    "议程设置：决定市场“应该在意什么”。",
                    "标准答案塑造：定义什么叫“好”，从而改变竞争赛道。",
                  ],
                },
                {
                  type: "p",
                  zh: "本质上，需求定义权就是把注意力和预算从别处挪到你这里的能力。",
                },
                {
                  type: "h2",
                  zh: "B. 定义新规则：不是做产品，而是改赛道",
                },
                {
                  type: "p",
                  zh: "规则制定权决定了什么算合格、谁能进入、收益如何分配。",
                },
                {
                  type: "ul",
                  zh: [
                    "平台规则：谁有曝光与推荐。",
                    "接口规则：谁能接入生态（API、插件、格式）。",
                    "合规规则：什么能卖、卖给谁、谁负责。",
                    "行业标准：什么算质量与验收。",
                  ],
                },
                {
                  type: "p",
                  zh: "当制作成本趋近于 0，规则就是收费闸口。谁管闸，谁收税。",
                },
                {
                  type: "h2",
                  zh: "2）分发、信任、资本和规则制定权",
                },
                {
                  type: "p",
                  zh: "这是 AI 时代的价值捕获四件套。生产变便宜后，这四件事反而更贵、更集中。",
                },
                {
                  type: "h2",
                  zh: "A. 分发：你能把东西送到谁面前",
                },
                {
                  type: "p",
                  zh: "分发不是“发出去”，而是稳定触达与可重复转化。",
                },
                {
                  type: "ul",
                  zh: [
                    "渠道：平台流量、私域、B 端销售、行业网络。",
                    "注意力：是否持续出现在目标客户视野。",
                    "转化链路：看到你、理解你、相信你、付费你、复购你。",
                  ],
                },
                {
                  type: "p",
                  zh: "AI 能帮做内容，但不能替你拥有渠道。内容越多，渠道越稀缺。",
                },
                {
                  type: "h2",
                  zh: "B. 信任：你凭什么被选中",
                },
                {
                  type: "p",
                  zh: "当供给爆炸，用户缺的不是选择，而是判断成本。信任就是替用户省判断成本。",
                },
                {
                  type: "ul",
                  zh: [
                    "过往记录：案例、口碑、可验证成果。",
                    "身份背书：组织、证书、权威引用、合作伙伴。",
                    "一致性：长期稳定输出同一质量标准。",
                    "责任承诺：售后、赔付、合同、可追责。",
                  ],
                },
                {
                  type: "p",
                  zh: "AI 产出越容易，伪造越多，信任越贵；“可验证性”会成为溢价来源。",
                },
                {
                  type: "h2",
                  zh: "C. 资本：你能用钱换时间、换规模、换确定性吗",
                },
                {
                  type: "ul",
                  zh: [
                    "承受亏损：用补贴换份额。",
                    "投入基础设施：数据、算力、研发、合规、渠道团队。",
                    "购买风险对冲：法律、保险、供应链冗余。",
                  ],
                },
                {
                  type: "p",
                  zh: "AI 让试错更快，但大规模试错依旧需要资本，所以资本仍是阶层放大器。",
                },
                {
                  type: "h2",
                  zh: "D. 规则制定权：你能决定别人怎么参与",
                },
                {
                  type: "ul",
                  zh: [
                    "拥有平台：决定推荐与抽成。",
                    "拥有标准：决定谁合格。",
                    "拥有许可：决定谁能入场。",
                    "拥有协议：决定谁能接入你的生态。",
                  ],
                },
                {
                  type: "p",
                  zh: "分发带来规模，规模带来议价权，议价权带来规则权，规则权又反过来稳固分发，这是闭环。",
                },
                {
                  type: "h2",
                  zh: "3）资本、分发与组织壁垒",
                },
                {
                  type: "p",
                  zh: "在 AI 把技能壁垒冲垮后，真正剩下的护城河就是资本、分发与组织能力。",
                },
                {
                  type: "ul",
                  zh: [
                    "资本壁垒：不是成本高，而是“亏得起、扛得住周期”。",
                    "分发壁垒：不是会营销，而是占据入口（用户习惯入口、搜索入口、工作流入口、采购入口）。",
                    "组织壁垒：不是人多，而是系统能持续复制胜利（流程化、协同、知识沉淀、治理结构）。",
                  ],
                },
                {
                  type: "p",
                  zh: "AI 让个人更强，也让组织上限更高，因为组织可以把 AI 嵌入流程，把个体能力转化为稳定产能。",
                },
                {
                  type: "h2",
                  zh: "4）人对人的认可",
                },
                {
                  type: "p",
                  zh: "这不是“情绪价值”的小问题，而是社会系统的许可机制。",
                },
                {
                  type: "p",
                  zh: "在高不确定领域，用户购买的不只是产物本身，还包括：谁背书、谁负责、是否被社会承认。",
                },
                {
                  type: "h2",
                  zh: "认可的四种形式",
                },
                {
                  type: "ul",
                  zh: [
                    "合法性认可：证照、资质、合规、责任主体。",
                    "专业性认可：同行评价、评审体系、标准引用。",
                    "关系性认可：人脉网络、圈层身份、共同体信任。",
                    "价值观认可：你代表什么立场、审美与伦理。",
                  ],
                },
                {
                  type: "p",
                  zh: "AI 可以生成答案，但很难替你获得社会许可。越是 AI 泛滥，用户越会追问“是谁做的”。",
                },
                {
                  type: "p",
                  zh: "最后可操作的结论：AI 让“做出来”变便宜，竞争主战场会转移到定义问题、定义规则、稳定分发、建立信任、规模化抗周期，以及获得社会许可。",
                },
              ],
            },
          ],
        },
      ],
    },
    {
      slug: "why-domestic-llms-struggle",
      category: "ai",
      tags: ["aitalk", "trending"],
      author: {
        name: "BEhop",
        initials: "BH",
        role: { en: "AItalk Editor", zh: "AItalk 编辑" },
      },
      stats: { replies: 0, views: 0 },
      date: "2026-02-07T10:00:00Z",
      readTime: { en: "10 min", zh: "10 分钟" },
      title: {
        en: "AI Talk: Why do domestic large models feel weaker?",
        zh: "AI Talk：为什么国内大模型不行？",
      },
      source: "https://chatgpt.com/share/69871643-a120-800b-b5bf-54815fd7f340",
      excerpt: {
        en: "A practical breakdown for builders: model ownership vs product leverage, and when to train your own model.",
        zh: "从创业与复利视角拆解：为什么“做模型”不一定比“做应用”更赚，以及何时才值得自建模型。",
      },
      content: [
        {
          type: "qa",
          items: [
            {
              question: {
                zh: "详细帮我思考分析一下，类似 v0 这样的网页设计 AI。为什么不去训练自己的大模型实现一劳永逸？如果电力和 GPU 是水，大模型就是树，应用是果子。既然越靠近源头越硬核，个人是不是更该去种树，掌握源头获得更大收益？",
              },
              answerBlocks: [
                {
                  type: "p",
                  zh: "你这个“水（算力/电力）—树（大模型）—果子（应用）”的比喻非常贴近现实，但关键点在于：对个人或小团队来说，种树不等于拥有果园定价权。",
                },
                {
                  type: "p",
                  zh: "靠近源头确实更硬核，但容易忽略分发、产品化、数据和生态位这些真正决定收益的要素。下面用创业和复利视角把问题拆开。",
                },
                {
                  type: "h2",
                  zh: "1）“谁掌握大模型谁是王”在大公司成立，在个人身上通常不成立",
                },
                {
                  type: "p",
                  zh: "大公司之所以更像“王”，通常同时拥有：",
                },
                {
                  type: "ul",
                  zh: [
                    "超大算力与资本（训练、推理、迭代成本可长期承担）。",
                    "海量数据与渠道（分发、生态、客户关系）。",
                    "工程与合规体系（安全、隐私、版权、稳定性）。",
                    "高人才密度（训练、系统、产品、增长协同）。",
                  ],
                },
                {
                  type: "p",
                  zh: "个人想复刻“王位”，最常卡在三件事：",
                },
                {
                  type: "ul",
                  zh: [
                    "训练成本不是一次性投入，模型会持续过时。",
                    "模型不是产品，用户要的是结果交付而不是一个 API。",
                    "护城河未必来自模型本身，最终比的是工作流、数据闭环和分发。",
                  ],
                },
                {
                  type: "p",
                  zh: "结论：对个人而言，做模型往往是成本中心，做应用才更接近利润中心。除非你能在细分场景长期做到更便宜、更好用、更可控，并且有明确渠道变现。",
                },
                {
                  type: "h2",
                  zh: "2）“越靠近源头收益越大”只说对一半：上限更高，但成功概率急剧下降",
                },
                {
                  type: "p",
                  zh: "可以把 AI 产业分成四层（从源头到应用）：",
                },
                {
                  type: "ul",
                  zh: [
                    "算力与基础设施（水源）。",
                    "基础模型（树）。",
                    "模型能力工程（嫁接与园艺：微调、RAG、工具调用、评测、推理优化）。",
                    "应用产品（果子：直接交付结果的体验）。",
                  ],
                },
                {
                  type: "p",
                  zh: "对个人更现实的是：",
                },
                {
                  type: "ul",
                  zh: [
                    "直接训练基础模型，上限高但投入重、胜率低。",
                    "做模型能力工程，通常是性价比最高的层。",
                    "做应用最接近收入，但要强产品能力和分发能力。",
                  ],
                },
                {
                  type: "p",
                  zh: "所以更现实的策略不是执着从零种树，而是成为最会嫁接和最会做菜的人。你靠近的是能力形成机制，而不是参数本身。",
                },
                {
                  type: "h2",
                  zh: "3）v0 类产品的真实壁垒：不是模型，而是闭环",
                },
                {
                  type: "p",
                  zh: "像 v0 这类网页设计 AI，核心不是单次生成，而是系统性的产品闭环：",
                },
                {
                  type: "ul",
                  zh: [
                    "输入理解：需求拆解与约束识别。",
                    "生成执行：多轮迭代、局部修改、组件化组织。",
                    "结果校验：可运行、可编译、风格一致、可维护。",
                    "交互效率：用户几乎零成本指出“改哪里”。",
                    "生态协同：组件库、模板、部署链路、协作链路。",
                    "数据飞轮：用户修改行为反哺策略、模板与评测。",
                  ],
                },
                {
                  type: "p",
                  zh: "如果只训练一个模型却没有这些能力，结果就是有树，但没有厨房、菜单、供应链和收银台。",
                },
                {
                  type: "h2",
                  zh: "4）训练自己的模型有意义，但要换定义",
                },
                {
                  type: "p",
                  zh: "对个人最有意义的“种树”通常不是训练通用基础模型，而是三种“私人树”：",
                },
                {
                  type: "h2",
                  zh: "A. 垂直领域模型（小而专）",
                },
                {
                  type: "ul",
                  zh: [
                    "掌握专业术语、规范与结构化表达。",
                    "沉淀你所在领域的审美偏好与决策逻辑。",
                    "固化你的交付标准（模板化、可复用）。",
                  ],
                },
                {
                  type: "p",
                  zh: "这更像在公共森林里培养你的专属果树品种。",
                },
                {
                  type: "h2",
                  zh: "B. 数据资产 + 评测体系（真正的源头）",
                },
                {
                  type: "ul",
                  zh: [
                    "高质量专有数据（标注、案例、失败样本）。",
                    "可持续增长的数据采集渠道。",
                    "可量化评测基准（明确什么叫好）。",
                  ],
                },
                {
                  type: "p",
                  zh: "当你掌握这些，即使切换底层模型，也能持续提升能力。",
                },
                {
                  type: "h2",
                  zh: "C. 可复制的工作流（复利资产）",
                },
                {
                  type: "ul",
                  zh: [
                    "从需求到生成再到修改和导出的标准模板。",
                    "可复用组件库与提示库。",
                    "自动化评测与回归机制（模型升级不崩）。",
                    "可部署、可售卖的工具链。",
                  ],
                },
                {
                  type: "p",
                  zh: "工作流才是个人长期复利的树干，模型只是会换季的树叶。",
                },
                {
                  type: "h2",
                  zh: "5）什么时候值得“自己种树”？",
                },
                {
                  type: "p",
                  zh: "满足下面五条中的两条以上，再考虑训练或自建模型：",
                },
                {
                  type: "ul",
                  zh: [
                    "有持续且独占的数据来源。",
                    "目标场景高频、刚需、强付费且可规模化。",
                    "推理成本是业务核心瓶颈。",
                    "隐私或合规要求必须本地化部署。",
                    "已经拥有稳定分发渠道（客户、流量、团队、行业背书）。",
                  ],
                },
                {
                  type: "p",
                  zh: "如果不满足，就把树外包给开源或大厂，把精力放在果园经营。",
                },
                {
                  type: "h2",
                  zh: "6）结合景观/设计/AI 工作流，更现实的路线",
                },
                {
                  type: "p",
                  zh: "你真正该争取的不是拥有一个通用大模型，而是占领一个垂直生态位：让别人一想到某类设计交付，就想到你这套工具和标准。",
                },
                {
                  type: "ul",
                  zh: [
                    "景观/城市设计版 v0：从需求到功能分区、流线、指标、草图、表达和汇报材料一条龙。",
                    "设计院交付自动化：CAD、图纸、清单、说明文本生成与校核。",
                    "私有数据飞轮：把项目案例、修改记录、评审意见沉淀为模板与评测资产。",
                  ],
                },
                {
                  type: "p",
                  zh: "核心结论：你掌握的是果子的配方、供应链和品控标准，而不是从零造树。",
                },
              ],
            },
          ],
        },
      ],
    },
    {
      slug: "design-cognition-encoding",
      category: "ai",
      tags: ["design-cognition"],
      author: {
        name: "BEhop",
        initials: "BH",
        role: { en: "Design Strategy", zh: "设计策略" },
      },
      stats: { replies: 0, views: 0 },
      date: "2026-02-14T09:00:00Z",
      readTime: { en: "7 min", zh: "7 分钟" },
      title: {
        en: "Design Cognition Encoding: A New Core Capability for Designers in the AI Era",
        zh: "Design Cognition Encoding：AI时代设计师的新核心能力",
      },
      excerpt: {
        en: "When execution gets automated, the real moat shifts to encoding design judgment into reusable systems and workflows.",
        zh: "当执行能力被 AI 快速普及，设计师真正的稀缺性将转向“把设计认知编码成可复用系统”的能力。",
      },
      content: [
        {
          type: "p",
          en: "Design Cognition Encoding means turning a designer's implicit judgment into reusable structures: rules, workflows, data models, and evaluation standards.",
          zh: "Design Cognition Encoding 指的是：把设计师脑中的经验、判断逻辑与审美标准，转化为可表达、可计算、可复用的结构，如规则、流程、数据模型和评估标准。",
        },
        {
          type: "h2",
          en: "1) Why it becomes critical now",
          zh: "1）为什么现在必须重视",
        },
        {
          type: "p",
          en: "AI can generate sketches and options quickly, so pure execution is no longer scarce. The new edge is whether your logic can guide AI consistently.",
          zh: "AI 已能快速生成效果图、草图和方案建议，单纯“会做图”正在变成基础能力。新的竞争力在于：你是否能把设计逻辑结构化，并稳定地驱动 AI 产出高质量结果。",
        },
        {
          type: "h2",
          en: "2) This shift is already happening",
          zh: "2）这件事其实已经在发生",
        },
        {
          type: "ul",
          en: [
            "Parametric design that converts constraints into adjustable systems.",
            "Prompt engineering and workflow automation that encode experience into repeatable steps.",
            "Template libraries and scripts that preserve methods as long-term assets.",
          ],
          zh: [
            "参数化设计：把空间尺度、人流、光照等约束转化为可调系统。",
            "Prompt 工程与自动化工作流：把经验写成可重复调用的步骤。",
            "模板库与脚本：把方法沉淀为团队可复用的长期资产。",
          ],
        },
        {
          type: "h2",
          en: "3) Designer roles will split",
          zh: "3）设计师角色会加速分化",
        },
        {
          type: "ul",
          en: [
            "Executors: use AI to deliver faster, but face higher substitutability.",
            "Cognition encoders: define principles, build systems, and shape tools with stronger long-term leverage.",
          ],
          zh: [
            "执行型设计师：借助 AI 提升效率，但可替代性更高。",
            "认知编码型设计师：能抽象原则、构建流程、定义工具，长期杠杆更强。",
          ],
        },
        {
          type: "h2",
          en: "4) From selling time to selling cognition assets",
          zh: "4）从“卖时间”到“卖认知资产”",
        },
        {
          type: "p",
          en: "Once knowledge becomes modules, checklists, and toolchains, it can be reused across projects and create compounding value instead of one-off labor income.",
          zh: "当设计经验被编码为模块、检查清单和工具链，它就能在多个项目中复用，从“一次劳动一次收入”转向“持续复利的认知资产收益”。",
        },
        {
          type: "h2",
          en: "5) Practical starting path for individual designers",
          zh: "5）普通设计师的可执行起点",
        },
        {
          type: "ul",
          en: [
            "Short-term: write down your decision rules and project checklists.",
            "Mid-term: map repeatable workflows and connect them with AI tools.",
            "Long-term: productize your know-how into templates, plugins, or internal standards.",
          ],
          zh: [
            "短期：先写出你的决策规则与项目 checklist。",
            "中期：把高频流程标准化，并接入 AI 工具形成固定链路。",
            "长期：将经验产品化为模板、插件、模型或内部标准。",
          ],
        },
        {
          type: "h2",
          en: "Final takeaway",
          zh: "一句话结论",
        },
        {
          type: "p",
          en: "AI will not replace designers, but it will reprice design work. Scarcity moves from making outputs to encoding design cognition into systems.",
          zh: "AI 不会直接取代设计师，但会重估设计工作的价值。未来真正稀缺的，不是“会做设计的人”，而是“能把设计认知转化为系统的人”。",
        },
      ],
    },
  ]

  const categoryLabels = {
    all: { en: "All Topics", zh: "全部话题" },
    landscape: { en: "Landscape Design", zh: "景观设计" },
    ai: { en: "AI & Technology", zh: "AI 与技术" },
    news: { en: "Industry News", zh: "行业资讯" },
    featured: { en: "Featured", zh: "精选" },
    trending: { en: "Trending", zh: "热门" },
    business: { en: "Business", zh: "商业" },
  }

  const tagLabels = {
    pinned: { en: "Pinned", zh: "置顶" },
    news: { en: "News", zh: "资讯" },
    featured: { en: "Featured", zh: "精选" },
    trending: { en: "Trending", zh: "热门" },
    aitalk: { en: "AI Talk", zh: "AI 对话" },
    "design-cognition": { en: "Design Cognition", zh: "设计认知" },
  }

  // Tag-driven detail template selection.
  const detailLayoutByTag = {
    aitalk: "dialogue",
    "design-cognition": "insight",
  }

  const detailLayoutLabels = {
    article: { en: "Article", zh: "文章" },
    dialogue: { en: "AI Talk · Q&A", zh: "AI Talk · 问答" },
    insight: { en: "Insight Brief", zh: "洞察长文" },
  }

  window.FORUM_TOPICS = topics
  window.FORUM_CATEGORY_LABELS = categoryLabels
  window.FORUM_TAG_LABELS = tagLabels
  window.FORUM_DETAIL_LAYOUT_BY_TAG = detailLayoutByTag
  window.FORUM_DETAIL_LAYOUT_LABELS = detailLayoutLabels
})()
