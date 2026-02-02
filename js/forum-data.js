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
      tags: ["trending"],
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
        en: "Computer vision models can flag early pest symptoms and reduce the need for blanket pesticide treatments.",
        zh: "计算机视觉模型可提前识别虫害症状，降低大范围喷洒的需求。",
      },
      content: [
        {
          type: "p",
          en: "High-resolution imagery from phones or fixed cameras can detect leaf discoloration, spotting, and canopy thinning. Early warnings allow targeted intervention.",
          zh: "来自手机或固定摄像头的高分辨率图像可识别叶片变色、斑点与树冠稀疏等症状，为精准干预提供早期预警。",
        },
        {
          type: "p",
          en: "Successful programs combine labeled datasets with field validation. Human verification reduces false positives and improves model retraining.",
          zh: "成功项目通常结合标注数据与现场验证，人工复核降低误报并提升模型迭代效果。",
        },
        {
          type: "h2",
          en: "Deployment tips",
          zh: "部署建议",
        },
        {
          type: "ul",
          en: [
            "Standardize lighting and capture angles",
            "Use edge devices for on-site inference",
            "Schedule retraining every season",
            "Integrate with IPM workflows",
          ],
          zh: [
            "统一拍摄光线与角度",
            "使用边缘设备进行现场识别",
            "按季节定期重新训练",
            "与综合虫害管理流程结合",
          ],
        },
        {
          type: "p",
          en: "When paired with agronomic expertise, ML becomes a decision support tool rather than a black box. Start small and scale after accuracy benchmarks are met.",
          zh: "与专业园艺知识结合时，机器学习更像决策辅助而非黑箱。建议先小规模试点，达到准确率目标后再扩展。",
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
  }

  window.FORUM_TOPICS = topics
  window.FORUM_CATEGORY_LABELS = categoryLabels
  window.FORUM_TAG_LABELS = tagLabels
})()
