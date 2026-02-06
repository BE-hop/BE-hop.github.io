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
  }

  // Tag-driven detail template selection.
  const detailLayoutByTag = {
    aitalk: "dialogue",
  }

  const detailLayoutLabels = {
    article: { en: "Article", zh: "文章" },
    dialogue: { en: "AI Talk · Q&A", zh: "AI Talk · 问答" },
  }

  window.FORUM_TOPICS = topics
  window.FORUM_CATEGORY_LABELS = categoryLabels
  window.FORUM_TAG_LABELS = tagLabels
  window.FORUM_DETAIL_LAYOUT_BY_TAG = detailLayoutByTag
  window.FORUM_DETAIL_LAYOUT_LABELS = detailLayoutLabels
})()
