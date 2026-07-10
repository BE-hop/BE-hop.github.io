(() => {
  const translations = {
    zh: {
      "nav.projects": "项目案例",
      "nav.ai": "AI工具",
      "nav.ai.products": "工具精选",
      "nav.ai.gallery": "工具实验",
      "nav.ai.categories": "分类",
      "nav.ai.about": "关于 BEhop",
      "nav.projects.featured": "全部案例",
      "nav.projects.home": "首页精选",
      "nav.projects.archive": "作品归档",
      "nav.projects.services": "创作方向",
      "nav.projects.about": "关于 BEhop",
      "nav.projects.contact": "联系 BEhop",
      "nav.about": "关于我",
      "nav.services": "创作方向",
      "nav.contact": "联系 BEhop",
      "nav.portfolio": "项目案例",
      "nav.blog": "Blog",
      "nav.blog.latest": "最新文章",
      "nav.blog.about": "关于我",
      "nav.blog.archive": "归档",
      "nav.forum": "AI情报",
      "nav.brand": "BEhooop",

      "forum.meta.title": "BEhop AI Digest | BEhooop",
      "forum.hero.badge": "BEhop AI 情报",
      "forum.hero.title": "AI Digest",
      "forum.hero.subtitle": "AI 新闻、工具、趋势与设计应用",
      "forum.hero.desc": "筛选 AI 新闻、工具、行业趋势、设计行业应用与技巧教程，并记录我对设计工作流的解读。",
      "forum.categories.title": "情报分类",
      "forum.categories.all": "全部内容",
      "forum.categories.message": "留言",
      "forum.categories.landscape": "景观设计",
      "forum.categories.ai": "AI 与技术",
      "forum.categories.news": "行业资讯",
      "forum.categories.featured": "精选",
      "forum.categories.trending": "热门",
      "forum.categories.business": "商业",
      "forum.stats.title": "内容数据",
      "forum.stats.members": "关注方向",
      "forum.stats.topics": "条目",
      "forum.stats.replies": "评论",
      "forum.stats.online": "更新",
      "forum.list.title": "最新情报",
      "forum.actions.filter": "筛选",
      "forum.actions.sort": "排序",
      "forum.actions.publish": "提交线索",
      "forum.actions.loadMore": "加载更多内容",
      "forum.empty": "暂无符合条件的内容",
      "forum.tag.pinned": "置顶",
      "forum.tag.news": "资讯",
      "forum.tag.message": "留言",
      "forum.tag.aitalk": "AI 对话",
      "forum.compose.title": "提交 AI 线索",
      "forum.compose.subtitle": "提交后会进入审核，可用于后续 AI 情报、工具或设计应用记录。",
      "forum.compose.label.name": "昵称",
      "forum.compose.label.location": "地点",
      "forum.compose.label.title": "线索标题",
      "forum.compose.label.message": "线索内容",
      "forum.compose.placeholder.name": "输入昵称（可选）",
      "forum.compose.placeholder.location": "城市/地区（可选）",
      "forum.compose.placeholder.title": "例如：一个值得关注的 AI 设计工具",
      "forum.compose.placeholder.message": "请输入新闻、工具、教程、趋势或设计应用线索...",
      "forum.compose.tag": "标签：AI 线索",
      "forum.compose.note": "提交后默认进入审核，通过后再展示。",
      "forum.compose.cancel": "取消",
      "forum.compose.submit": "提交线索",
      "forum.topic1.title": "AI 如何在 2026 年重塑灌溉系统",
      "forum.topic1.excerpt": "讨论最新智能灌溉技术，机器学习如何优化商业景观的用水效率与日常维护...",
      "forum.topic1.replies": "47",
      "forum.topic1.views": "1,234",
      "forum.topic1.time": "2 小时前",
      "forum.topic2.title": "可持续景观实践：全面指南",
      "forum.topic2.excerpt": "涵盖本土植物选择、节水策略与降低碳足迹的可持续景观设计最佳实践。",
      "forum.topic2.replies": "32",
      "forum.topic2.views": "892",
      "forum.topic2.time": "4 小时前",
      "forum.topic3.title": "新 EPA 法规对景观承包商的影响",
      "forum.topic3.excerpt": "解读最新环保署指南，并说明其对 2026 年景观企业运营的影响。",
      "forum.topic3.replies": "28",
      "forum.topic3.views": "756",
      "forum.topic3.time": "6 小时前",
      "forum.topic4.title": "使用无人机进行大型场地测绘",
      "forum.topic4.excerpt": "将无人机用于土地测绘、航拍与景观规划的实操指南。",
      "forum.topic4.replies": "19",
      "forum.topic4.views": "543",
      "forum.topic4.time": "8 小时前",
      "forum.topic5.title": "低维护商业场地的植物推荐",
      "forum.topic5.excerpt": "推荐耐旱、耐用的植物组合，降低维护成本同时保持景观美感。",
      "forum.topic5.replies": "41",
      "forum.topic5.views": "987",
      "forum.topic5.time": "12 小时前",
      "forum.topic6.title": "机器学习在虫害识别与预防中的应用",
      "forum.topic6.excerpt": "AI Talk 形式：用问答方式拆解计算机视觉如何提前识别虫害并指导精准干预。",
      "forum.topic6.replies": "23",
      "forum.topic6.views": "612",
      "forum.topic6.time": "1 天前",
      "forum.topic7.title": "行业会议回顾：LandscapeTech Summit 2026",
      "forum.topic7.excerpt": "盘点年度景观科技大会的重点趋势与新品发布。",
      "forum.topic7.replies": "15",
      "forum.topic7.views": "423",
      "forum.topic7.time": "1 天前",
      "forum.topic8.title": "打造可盈利的景观养护计划",
      "forum.topic8.excerpt": "通过维护合同、定价模型与客户留存策略建立稳定收入来源。",
      "forum.topic8.replies": "56",
      "forum.topic8.views": "1,567",
      "forum.topic8.time": "2 天前",
      "forum.topic9.title": "AI Talk：设计副驾如何加速景观方案概念阶段",
      "forum.topic9.excerpt": "一个实战问答案例：如何在真实设计流程中使用提示词、迭代闭环和团队协作。",
      "forum.topic9.replies": "18",
      "forum.topic9.views": "468",
      "forum.topic9.time": "3 天前",
      "forum.news.title": "AI 新闻与工具",
      "forum.news.viewAll": "查看全部",
      "forum.news.item1.title": "AI 草坪养护创业公司完成 5000 万美元 B 轮融资",
      "forum.news.item2.title": "新型抗旱草种获准商业化应用",
      "forum.news.item3.title": "大型景观公司启用全电动施工车队",
      "forum.news.item4.title": "智能传感器试点让用水浪费降低 40%",
      "forum.contributors.title": "关注方向",
      "forum.contributors.role.ai": "AI 专家",
      "forum.contributors.role.landscape": "景观设计师",
      "forum.contributors.role.tech": "技术顾问",
      "forum.contributors.role.horticulture": "园艺师",
      "forum.detail.back": "返回 AI 情报",
      "forum.detail.replies": "回复",
      "forum.detail.views": "浏览",
      "forum.detail.join": "返回列表",
      "forum.detail.readMore": "阅读更多",
      "forum.detail.related": "相关话题",
      "forum.detail.info": "话题信息",
      "forum.detail.category": "分类",
      "forum.detail.updated": "更新",
      "forum.detail.readTime": "阅读时长",
      "forum.detail.layout": "展示形式",
      "forum.detail.analytics": "互动数据",
      "forum.detail.analytics.siteVisitors": "站点访客",
      "forum.detail.analytics.siteViews": "站点浏览",
      "forum.detail.analytics.topicVisitors": "本篇访客",
      "forum.detail.analytics.topicComments": "本篇评论",
      "forum.detail.prev": "上一篇",
      "forum.detail.next": "下一篇",
      "forum.footer.tagline": "筛选 AI 新闻、工具、趋势观察与设计工作流应用。",
      "forum.footer.community": "AI 情报",
      "forum.footer.resources": "资源",
      "forum.footer.company": "公司",
      "forum.footer.link.forum": "AI 情报",
      "forum.footer.link.members": "成员",
      "forum.footer.link.guidelines": "指南",
      "forum.footer.link.events": "活动",
      "forum.footer.link.library": "资料库",
      "forum.footer.link.api": "API",
      "forum.footer.link.blog": "Blog",
      "forum.footer.link.newsletter": "通讯",
      "forum.footer.link.about": "关于我们",
      "forum.footer.link.careers": "加入我们",
      "forum.footer.link.contact": "联系",
      "forum.footer.link.privacy": "隐私政策",
      "forum.footer.rights": "© 2026 BEhop. 保留所有权利。",
      "forum.footer.links.terms": "条款",
      "forum.footer.links.privacy": "隐私",
      "forum.footer.links.cookies": "Cookies",
    },
    en: {
      "nav.projects": "Works",
      "nav.ai": "AI Tools",
      "nav.ai.products": "Featured Tools",
      "nav.ai.gallery": "Tool Experiments",
      "nav.ai.categories": "Categories",
      "nav.ai.about": "About BEhop",
      "nav.projects.featured": "All Works",
      "nav.projects.home": "Home Featured",
      "nav.projects.archive": "Archive",
      "nav.projects.services": "Directions",
      "nav.projects.about": "About BEhop",
      "nav.projects.contact": "Contact BEhop",
      "nav.about": "About",
      "nav.services": "Directions",
      "nav.contact": "Contact BEhop",
      "nav.portfolio": "Works",
      "nav.blog": "Blog",
      "nav.blog.latest": "Latest Posts",
      "nav.blog.about": "About Me",
      "nav.blog.archive": "Archive",
      "nav.forum": "AI Digest",
      "nav.brand": "BEhooop",

      "forum.meta.title": "BEhop AI Digest | BEhooop",
      "forum.hero.badge": "BEhop AI Digest",
      "forum.hero.title": "AI Digest",
      "forum.hero.subtitle": "AI news, tools, trends, and design applications",
      "forum.hero.desc": "Curated AI news, tool notes, industry trends, design applications, and practical tutorials with interpretation for design workflows.",
      "forum.categories.title": "Digest Categories",
      "forum.categories.all": "All Items",
      "forum.categories.message": "Messages",
      "forum.categories.landscape": "Landscape Design",
      "forum.categories.ai": "AI & Technology",
      "forum.categories.news": "Industry News",
      "forum.categories.featured": "Featured",
      "forum.categories.trending": "Trending",
      "forum.categories.business": "Business",
      "forum.stats.title": "Digest Stats",
      "forum.stats.members": "Focus Areas",
      "forum.stats.topics": "Items",
      "forum.stats.replies": "Comments",
      "forum.stats.online": "Updates",
      "forum.list.title": "Latest Digest",
      "forum.actions.filter": "Filter",
      "forum.actions.sort": "Sort",
      "forum.actions.publish": "Submit Signal",
      "forum.actions.loadMore": "Load More Items",
      "forum.empty": "No items match your filters yet.",
      "forum.tag.pinned": "Pinned",
      "forum.tag.news": "News",
      "forum.tag.message": "Message",
      "forum.tag.aitalk": "AI Talk",
      "forum.compose.title": "Submit An AI Signal",
      "forum.compose.subtitle": "Submitted signals go into moderation and may become future AI digest, tool, or design application notes.",
      "forum.compose.label.name": "Name",
      "forum.compose.label.location": "Location",
      "forum.compose.label.title": "Signal Title",
      "forum.compose.label.message": "Signal Details",
      "forum.compose.placeholder.name": "Enter your name (optional)",
      "forum.compose.placeholder.location": "City / Region (optional)",
      "forum.compose.placeholder.title": "Example: A design AI tool worth watching",
      "forum.compose.placeholder.message": "Share AI news, tools, tutorials, trends, or design application notes...",
      "forum.compose.tag": "Tag: AI Signal",
      "forum.compose.note": "Submitted content is moderated before display.",
      "forum.compose.cancel": "Cancel",
      "forum.compose.submit": "Submit Signal",
      "forum.topic1.title": "How AI is revolutionizing irrigation systems in 2026",
      "forum.topic1.excerpt": "Exploring the latest developments in smart irrigation technology and how machine learning is optimizing water usage across commercial landscapes...",
      "forum.topic1.replies": "47",
      "forum.topic1.views": "1,234",
      "forum.topic1.time": "2h ago",
      "forum.topic2.title": "Sustainable landscaping practices: A comprehensive guide",
      "forum.topic2.excerpt": "Best practices for eco-friendly landscape design, including native plant selection, water conservation, and reducing carbon footprint in your projects.",
      "forum.topic2.replies": "32",
      "forum.topic2.views": "892",
      "forum.topic2.time": "4h ago",
      "forum.topic3.title": "New EPA regulations impact on landscape contractors",
      "forum.topic3.excerpt": "Breaking down the recent Environmental Protection Agency guidelines and what they mean for landscape businesses operating in 2026.",
      "forum.topic3.replies": "28",
      "forum.topic3.views": "756",
      "forum.topic3.time": "6h ago",
      "forum.topic4.title": "Using drones for large-scale property surveys",
      "forum.topic4.excerpt": "A practical guide to implementing drone technology for accurate land surveys, aerial photography, and project planning in landscaping.",
      "forum.topic4.replies": "19",
      "forum.topic4.views": "543",
      "forum.topic4.time": "8h ago",
      "forum.topic5.title": "Best plants for low-maintenance commercial properties",
      "forum.topic5.excerpt": "Recommendations for hardy, drought-resistant plants that reduce maintenance costs while maintaining visual appeal for commercial clients.",
      "forum.topic5.replies": "41",
      "forum.topic5.views": "987",
      "forum.topic5.time": "12h ago",
      "forum.topic6.title": "Machine learning for pest detection and prevention",
      "forum.topic6.excerpt": "AI Talk format: a Q&A breakdown of how computer vision catches pest risks early and guides targeted treatment.",
      "forum.topic6.replies": "23",
      "forum.topic6.views": "612",
      "forum.topic6.time": "1d ago",
      "forum.topic7.title": "Industry conference recap: LandscapeTech Summit 2026",
      "forum.topic7.excerpt": "Key takeaways from this year's largest landscape technology conference, including new product announcements and industry trends.",
      "forum.topic7.replies": "15",
      "forum.topic7.views": "423",
      "forum.topic7.time": "1d ago",
      "forum.topic8.title": "Building a profitable landscape maintenance program",
      "forum.topic8.excerpt": "Strategies for creating recurring revenue through maintenance contracts, pricing models, and client retention techniques.",
      "forum.topic8.replies": "56",
      "forum.topic8.views": "1,567",
      "forum.topic8.time": "2d ago",
      "forum.topic9.title": "AI Talk: How a design copilot speeds up landscape concepting",
      "forum.topic9.excerpt": "A practical Q&A case about prompts, iteration loops, and team collaboration in a real design workflow.",
      "forum.topic9.replies": "18",
      "forum.topic9.views": "468",
      "forum.topic9.time": "3d ago",
      "forum.news.title": "AI News & Tools",
      "forum.news.viewAll": "View All",
      "forum.news.item1.title": "AI-powered lawn care startup raises $50M Series B",
      "forum.news.item2.title": "New drought-resistant grass variety approved for commercial use",
      "forum.news.item3.title": "Major landscape company adopts fully electric fleet",
      "forum.news.item4.title": "Smart sensors reduce water waste by 40% in pilot program",
      "forum.contributors.title": "Focus Areas",
      "forum.contributors.role.ai": "AI Specialist",
      "forum.contributors.role.landscape": "Landscape Architect",
      "forum.contributors.role.tech": "Tech Consultant",
      "forum.contributors.role.horticulture": "Horticulturist",
      "forum.detail.back": "Back to AI Digest",
      "forum.detail.replies": "Replies",
      "forum.detail.views": "Views",
      "forum.detail.join": "Back to List",
      "forum.detail.readMore": "Read More",
      "forum.detail.related": "Related Topics",
      "forum.detail.info": "Topic Info",
      "forum.detail.category": "Category",
      "forum.detail.updated": "Updated",
      "forum.detail.readTime": "Read Time",
      "forum.detail.layout": "Layout",
      "forum.detail.analytics": "Engagement Data",
      "forum.detail.analytics.siteVisitors": "Site Visitors",
      "forum.detail.analytics.siteViews": "Site Views",
      "forum.detail.analytics.topicVisitors": "Topic Visitors",
      "forum.detail.analytics.topicComments": "Topic Comments",
      "forum.detail.prev": "Previous",
      "forum.detail.next": "Next",
      "forum.footer.tagline": "Curated AI signals, tool notes, trend observations, and design workflow applications.",
      "forum.footer.community": "AI Digest",
      "forum.footer.resources": "Resources",
      "forum.footer.company": "Company",
      "forum.footer.link.forum": "AI Digest",
      "forum.footer.link.members": "Members",
      "forum.footer.link.guidelines": "Guidelines",
      "forum.footer.link.events": "Events",
      "forum.footer.link.library": "Documentation",
      "forum.footer.link.api": "API",
      "forum.footer.link.blog": "Blog",
      "forum.footer.link.newsletter": "Newsletter",
      "forum.footer.link.about": "About",
      "forum.footer.link.careers": "Careers",
      "forum.footer.link.contact": "Contact",
      "forum.footer.link.privacy": "Privacy",
      "forum.footer.rights": "© 2026 BEhop. All rights reserved.",
      "forum.footer.links.terms": "Terms",
      "forum.footer.links.privacy": "Privacy",
      "forum.footer.links.cookies": "Cookies",
    },
  }

  const langButtons = document.querySelectorAll("[data-lang]")
  const i18nNodes = document.querySelectorAll("[data-i18n]")
  const i18nPlaceholders = document.querySelectorAll("[data-i18n-placeholder]")
  const getStorageItem = (key, fallback = "") => {
    try {
      const value = localStorage.getItem(key)
      return value === null || value === undefined ? fallback : value
    } catch (error) {
      return fallback
    }
  }
  const setStorageItem = (key, value) => {
    try {
      localStorage.setItem(key, value)
    } catch (error) {
      // ignore storage errors
    }
  }
  const getStoredLang = () => (
    getStorageItem("portfolioLang")
    || getStorageItem("blogLang")
    || getStorageItem("behopAiLang")
    || "en"
  )
  const syncStoredLang = (lang) => {
    setStorageItem("portfolioLang", lang)
    setStorageItem("blogLang", lang)
    setStorageItem("behopAiLang", lang)
  }

  const setLang = (lang) => {
    const dict = translations[lang] || translations.en
    document.documentElement.lang = lang

    i18nNodes.forEach((node) => {
      const key = node.getAttribute("data-i18n")
      if (key && dict[key]) {
        node.textContent = dict[key]
      }
    })

    i18nPlaceholders.forEach((node) => {
      const key = node.getAttribute("data-i18n-placeholder")
      if (key && dict[key]) {
        node.setAttribute("placeholder", dict[key])
      }
    })

    if (dict["forum.meta.title"]) {
      document.title = dict["forum.meta.title"]
    }

    langButtons.forEach((button) => {
      button.classList.toggle("is-active", button.dataset.lang === lang)
    })

    syncStoredLang(lang)
  }

  langButtons.forEach((button) => {
    if (button.dataset.lang) {
      button.addEventListener("click", () => setLang(button.dataset.lang || "en"))
    }
  })

  setLang(getStoredLang())

  const toggle = document.querySelector("[data-forum-menu-toggle]")
  const menu = document.querySelector("[data-forum-menu]")
  if (!toggle || !menu) return

  const openIcon = toggle.querySelector("[data-forum-icon-open]")
  const closeIcon = toggle.querySelector("[data-forum-icon-close]")

  const setOpen = (isOpen) => {
    menu.classList.toggle("hidden", !isOpen)
    toggle.setAttribute("aria-expanded", String(isOpen))
    if (openIcon) openIcon.classList.toggle("hidden", isOpen)
    if (closeIcon) closeIcon.classList.toggle("hidden", !isOpen)
  }

  setOpen(false)

  toggle.addEventListener("click", (event) => {
    event.stopPropagation()
    setOpen(menu.classList.contains("hidden"))
  })

  document.addEventListener("click", (event) => {
    if (!menu.contains(event.target) && !toggle.contains(event.target)) {
      setOpen(false)
    }
  })

  window.addEventListener("resize", () => {
    if (window.innerWidth >= 768) {
      setOpen(false)
    }
  })
})()
