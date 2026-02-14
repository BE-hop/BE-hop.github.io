(() => {
  const translations = {
    zh: {
      "nav.projects": "项目作品",
      "nav.ai": "AI产品",
      "nav.ai.products": "产品精选",
      "nav.ai.gallery": "作品集",
      "nav.ai.categories": "分类",
      "nav.ai.about": "关于 BEhop",
      "nav.projects.featured": "项目精选",
      "nav.projects.services": "创作方向",
      "nav.projects.about": "关于 BEhop",
      "nav.projects.contact": "联系 BEhop",
      "nav.about": "关于 BEhop",
      "nav.services": "创作方向",
      "nav.contact": "联系 BEhop",
      "nav.portfolio": "作品集",
      "nav.blog": "Blog",
      "nav.blog.latest": "最新文章",
      "nav.blog.about": "关于我",
      "nav.blog.archive": "归档",
      "nav.forum": "论坛",
      "nav.brand": "BEhooop",

      "hero.title": "BEhop 设计",
      "hero.subtitle": "让自然与生活和谐共生",
      "hero.description": "BEhop 专注于创造融合自然之美与功能性的景观设计，为每一个空间赋予独特的生命力。十年深耕，百余项目，只为呈现人与自然的完美对话。",
      "hero.cta": "探索作品",
      "hero.cta2": "了解更多",
      "hero.scroll": "滚动",

      "projects.title": "精选项目",
      "projects.subtitle": "每一个设计都是对自然与空间的深度理解",
      "projects.viewAll": "查看全部",
      "projects.viewProject": "查看项目",
      "projects.category.all": "全部",
      "projects.category.private": "私人庭院",
      "projects.category.commercial": "商业景观",
      "projects.category.public": "公共空间",
      "projects.category.ecological": "生态修复",

      "project.1.title": "山水雅居",
      "project.1.desc": "私人庭院 · 苏州",
      "project.1.detail": "融合苏州园林精髓，打造现代东方美学私家花园，尽显江南水乡的诗意与雅致。",
      "project.2.title": "云端花园",
      "project.2.desc": "屋顶花园 · 上海",
      "project.2.detail": "在繁华都市之上，营造一方宁静绿洲，让城市生活重新拥抱自然。",
      "project.3.title": "溪谷会所",
      "project.3.desc": "商业景观 · 杭州",
      "project.3.detail": "为高端度假会所打造沉浸式自然体验，将建筑与山水完美融合。",
      "project.4.title": "静心禅院",
      "project.4.desc": "文化空间 · 北京",
      "project.4.detail": "以禅意美学为核心，创造一个让心灵归于宁静的冥想空间。",
      "project.5.title": "城市绿廊",
      "project.5.desc": "公共空间 · 深圳",
      "project.5.detail": "为城市居民打造可亲近的绿色公共空间，提升社区生活品质。",
      "project.6.title": "湿地重生",
      "project.6.desc": "生态修复 · 成都",
      "project.6.detail": "通过生态修复技术，恢复湿地生态系统，重建野生动植物栖息地。",

      "about.title": "关于 BEhop",
      "about.subtitle": "专注展示 AI 产品驱动的创作成果",
      "about.description": "BEhop 当前定位为 AI 创作展示平台，重点分享基于 AI 产品与工作流完成的项目成果、实验过程和方法复盘。内容目标是沉淀可复用经验，而非面向外部的业务承接页面。",
      "about.philosophy": "创作方法",
      "about.philosophy.text": "每个案例都围绕统一流程展开：明确目标、选择工具、记录参数、对比结果、总结可复用模板。通过结构化沉淀，让一次创作能持续转化为后续项目的能力资产。",
      "about.stats.projects": "案例成果",
      "about.stats.years": "流程沉淀",
      "about.stats.awards": "工具实验",
      "about.stats.team": "知识分享",
      "about.quote": "“AI 不是替代创作，而是放大认知与表达的工具。”",
      "about.quoteAuthor": "— BEhooop",
      "about.values.1.title": "成果导向",
      "about.values.1.desc": "以可验证结果展示 AI 工具价值",
      "about.values.2.title": "流程透明",
      "about.values.2.desc": "记录从输入到输出的关键决策",
      "about.values.3.title": "持续迭代",
      "about.values.3.desc": "通过复盘与实验不断优化方法",

      "services.kicker": "创作方向",
      "services.title": "AI 创作展示",
      "services.subtitle": "以成果、流程与复盘为核心",
      "services.1.title": "工作流拆解",
      "services.1.desc": "拆解从需求到产出的关键步骤，沉淀可复用流程。",
      "services.2.title": "工具组合实践",
      "services.2.desc": "比较不同 AI 工具组合在真实任务下的表现与边界。",
      "services.3.title": "结果对比评估",
      "services.3.desc": "通过版本对比与指标验证，提升输出质量和稳定性。",
      "services.4.title": "方法模板沉淀",
      "services.4.desc": "把有效经验固化为模板，支持后续快速复现。",
      "services.cta.title": "欢迎交流你的实践",
      "services.cta.desc": "共同完善可复用的 AI 创作方法",

      "contact.kicker": "联系 BEhop",
      "contact.title": "联系 BEhop",
      "contact.description": "这里主要接收合作需求，以及 AI 相关的产品服务与咨询服务需求。欢迎留下你的场景、目标和时间安排。",
      "contact.name": "姓名",
      "contact.email": "邮箱",
      "contact.phone.input": "电话",
      "contact.project": "需求类型",
      "contact.message": "需求说明",
      "contact.submit": "发送消息",
      "contact.emailLabel": "电子邮箱",
      "contact.hours": "工作时间",
      "contact.hoursText": "周一至周五 9:00 - 18:00",
      "contact.formTitle": "发送合作需求",
      "contact.notice": "通常会在 24 小时内回复你的需求。",
      "contact.name.placeholder": "您的姓名",
      "contact.email.placeholder": "您的邮箱",
      "contact.phone.placeholder": "联系电话",
      "contact.project.placeholder": "选择需求类型",
      "contact.message.placeholder": "请说明你的合作背景、目标、预算范围与时间安排...",
      "contact.status.sending": "正在发送，请稍候...",
      "contact.status.success": "发送成功，我会尽快通过邮件回复你。",
      "contact.status.error": "发送失败，请稍后重试，或直接发邮件联系我。",

      "footer.rights": "版权所有",
      "footer.description": "BEhop 专注于展示 AI 产品驱动的创作成果与方法沉淀，持续分享可复用的工作流与实践经验。",
      "footer.services": "创作方向",
      "footer.company": "关于 BEhop",
      "footer.backToTop": "返回顶部",
    },
    en: {
      "nav.projects": "Projects",
      "nav.ai": "AI Products",
      "nav.ai.products": "Featured Products",
      "nav.ai.gallery": "Gallery",
      "nav.ai.categories": "Categories",
      "nav.ai.about": "About BEhop",
      "nav.projects.featured": "Featured Projects",
      "nav.projects.services": "Directions",
      "nav.projects.about": "About BEhop",
      "nav.projects.contact": "Contact BEhop",
      "nav.about": "About BEhop",
      "nav.services": "Directions",
      "nav.contact": "Contact BEhop",
      "nav.portfolio": "Portfolio",
      "nav.blog": "Blog",
      "nav.blog.latest": "Latest Posts",
      "nav.blog.about": "About Me",
      "nav.blog.archive": "Archive",
      "nav.forum": "Forum",
      "nav.brand": "BEhooop",

      "hero.title": "BEhop Design",
      "hero.subtitle": "Where Nature Meets Life",
      "hero.description": "BEhop focuses on creating landscape designs that blend natural beauty with functionality, bringing unique vitality to every space. A decade of dedication, over a hundred projects, all for the perfect dialogue between humanity and nature.",
      "hero.cta": "Explore Works",
      "hero.cta2": "Learn More",
      "hero.scroll": "Scroll",

      "projects.title": "Featured Projects",
      "projects.subtitle": "Each design reflects a deep understanding of nature and space",
      "projects.viewAll": "View All",
      "projects.viewProject": "View Project",
      "projects.category.all": "All",
      "projects.category.private": "Private Gardens",
      "projects.category.commercial": "Commercial",
      "projects.category.public": "Public Spaces",
      "projects.category.ecological": "Ecological",

      "project.1.title": "Mountain Retreat",
      "project.1.desc": "Private Garden · Suzhou",
      "project.1.detail": "Blending the essence of Suzhou gardens with modern Eastern aesthetics, creating a private garden that embodies the poetic charm of Jiangnan.",
      "project.2.title": "Sky Garden",
      "project.2.desc": "Rooftop Garden · Shanghai",
      "project.2.detail": "Creating a tranquil oasis above the bustling city, reconnecting urban life with nature.",
      "project.3.title": "Valley Club",
      "project.3.desc": "Commercial Landscape · Hangzhou",
      "project.3.detail": "Crafting an immersive natural experience for a luxury resort, seamlessly integrating architecture with the landscape.",
      "project.4.title": "Zen Courtyard",
      "project.4.desc": "Cultural Space · Beijing",
      "project.4.detail": "Centered on Zen aesthetics, creating a meditative space that brings peace to the soul.",
      "project.5.title": "Urban Greenway",
      "project.5.desc": "Public Space · Shenzhen",
      "project.5.detail": "Creating accessible green public spaces for city residents, enhancing community living quality.",
      "project.6.title": "Wetland Rebirth",
      "project.6.desc": "Ecological Restoration · Chengdu",
      "project.6.detail": "Restoring wetland ecosystems through ecological restoration techniques, rebuilding wildlife habitats.",

      "about.title": "About Us",
      "about.subtitle": "Focused on AI Product-Driven Creative Outcomes",
      "about.description": "BEhop is positioned as an AI creation showcase, focusing on project outcomes, experiments, and workflow retrospectives built with AI products. The goal is to accumulate reusable methods rather than serving as an external client-service channel.",
      "about.philosophy": "Creative Method",
      "about.philosophy.text": "Each case follows a structured loop: define goals, pick tools, record parameters, compare outputs, and extract reusable templates. This turns one-off creation into long-term capability assets.",
      "about.stats.projects": "Showcases",
      "about.stats.years": "Process Assets",
      "about.stats.awards": "Tool Experiments",
      "about.stats.team": "Knowledge Notes",
      "about.quote": "\"AI does not replace creativity; it amplifies cognition and expression.\"",
      "about.quoteAuthor": "— BEhooop",
      "about.values.1.title": "Outcome-First",
      "about.values.1.desc": "Show tool value through verifiable results",
      "about.values.2.title": "Transparent Process",
      "about.values.2.desc": "Document key decisions from input to output",
      "about.values.3.title": "Continuous Iteration",
      "about.values.3.desc": "Improve methods through review and experimentation",

      "services.kicker": "Directions",
      "services.title": "AI Creation Showcase",
      "services.subtitle": "Focused on outcomes, process, and retrospectives",
      "services.1.title": "Workflow Breakdown",
      "services.1.desc": "Decompose key steps from intent to output and keep them reusable.",
      "services.2.title": "Toolchain Practice",
      "services.2.desc": "Compare AI tool combinations under real tasks and constraints.",
      "services.3.title": "Result Evaluation",
      "services.3.desc": "Validate quality through version comparisons and measurable criteria.",
      "services.4.title": "Method Templates",
      "services.4.desc": "Convert successful experience into templates for faster reuse.",
      "services.cta.title": "Share Your Practice",
      "services.cta.desc": "Co-build reusable AI creation methods",

      "contact.kicker": "Contact BEhop",
      "contact.title": "Contact BEhop",
      "contact.description": "This section is for collaboration needs, plus AI-related product services and consulting requests. Share your scenario, goals, and timeline.",
      "contact.name": "Name",
      "contact.email": "Email",
      "contact.phone.input": "Phone",
      "contact.project": "Request Type",
      "contact.message": "Request Details",
      "contact.submit": "Send Message",
      "contact.emailLabel": "Email",
      "contact.hours": "Working Hours",
      "contact.hoursText": "Mon - Fri, 9:00 AM - 6:00 PM",
      "contact.formTitle": "Send Collaboration Request",
      "contact.notice": "Typical response time is within 24 hours.",
      "contact.name.placeholder": "Your name",
      "contact.email.placeholder": "Your email",
      "contact.phone.placeholder": "Phone number",
      "contact.project.placeholder": "Select request type",
      "contact.message.placeholder": "Share your context, goals, budget range, and timeline...",
      "contact.status.sending": "Sending your message...",
      "contact.status.success": "Message sent successfully. I will reply by email soon.",
      "contact.status.error": "Failed to send. Please try again later or email me directly.",

      "footer.rights": "All Rights Reserved",
      "footer.description": "BEhop showcases AI product-driven creative outcomes and method assets, sharing reusable workflows and practical learnings.",
      "footer.services": "Directions",
      "footer.company": "About BEhop",
      "footer.backToTop": "Back to Top",
    },
  }

  const projectTypes = {
    zh: [
      { value: "", label: "选择需求类型" },
      { value: "cooperation", label: "合作需求" },
      { value: "ai-product-service", label: "AI 产品服务" },
      { value: "ai-consulting", label: "AI 咨询服务" },
      { value: "integration", label: "工具接入与落地" },
      { value: "other", label: "其他" },
    ],
    en: [
      { value: "", label: "Select request type" },
      { value: "cooperation", label: "Collaboration" },
      { value: "ai-product-service", label: "AI Product Service" },
      { value: "ai-consulting", label: "AI Consulting" },
      { value: "integration", label: "Tool Integration" },
      { value: "other", label: "Other" },
    ],
  }

  const langButtons = document.querySelectorAll("[data-lang]")
  const i18nNodes = document.querySelectorAll("[data-i18n]")
  const dualLangNodes = document.querySelectorAll("[data-zh][data-en]")
  const i18nPlaceholders = document.querySelectorAll("[data-i18n-placeholder]")
  const i18nAria = document.querySelectorAll("[data-i18n-aria]")
  const projectTypeSelect = document.querySelector("#project-type")

  const setLang = (lang) => {
    const dict = translations[lang] || translations.en
    document.documentElement.lang = lang

    i18nNodes.forEach((node) => {
      const key = node.getAttribute("data-i18n")
      if (key && dict[key]) {
        node.textContent = dict[key]
      }
    })

    dualLangNodes.forEach((node) => {
      const value = node.getAttribute(lang === "zh" ? "data-zh" : "data-en")
      if (value) {
        node.textContent = value
      }
    })

    i18nPlaceholders.forEach((node) => {
      const key = node.getAttribute("data-i18n-placeholder")
      if (key && dict[key]) {
        node.setAttribute("placeholder", dict[key])
      }
    })

    i18nAria.forEach((node) => {
      const key = node.getAttribute("data-i18n-aria")
      if (key && dict[key]) {
        node.setAttribute("aria-label", dict[key])
      }
    })

    if (projectTypeSelect) {
      projectTypeSelect.innerHTML = ""
      projectTypes[lang].forEach((option) => {
        const opt = document.createElement("option")
        opt.value = option.value
        opt.textContent = option.label
        if (option.value === "") {
          opt.disabled = true
          opt.selected = true
        }
        projectTypeSelect.appendChild(opt)
      })
    }

    langButtons.forEach((button) => {
      button.classList.toggle("is-active", button.dataset.lang === lang)
    })

    localStorage.setItem("portfolioLang", lang)
  }

  langButtons.forEach((button) => {
    button.addEventListener("click", () => setLang(button.dataset.lang || "en"))
  })

  setLang(localStorage.getItem("portfolioLang") || "en")

  const getCurrentLang = () => (document.documentElement.lang === "zh" ? "zh" : "en")
  const getCurrentDict = () => translations[getCurrentLang()] || translations.en

  const contactForm = document.querySelector("#contact-form")
  const contactStatus = document.querySelector("#contact-form-status")
  const contactSubmitButton = contactForm ? contactForm.querySelector('button[type="submit"]') : null

  const setContactStatus = (message = "") => {
    if (!contactStatus) return
    contactStatus.textContent = message
    contactStatus.classList.toggle("hidden", !message)
  }

  if (contactForm) {
    contactForm.addEventListener("submit", async (event) => {
      event.preventDefault()

      if (!contactForm.checkValidity()) {
        contactForm.reportValidity()
        return
      }

      const dict = getCurrentDict()
      const endpoint = contactForm.getAttribute("data-ajax-endpoint")
      if (!endpoint) {
        setContactStatus(dict["contact.status.error"] || translations.en["contact.status.error"])
        return
      }

      if (contactSubmitButton) {
        contactSubmitButton.disabled = true
        contactSubmitButton.setAttribute("aria-busy", "true")
      }

      setContactStatus(dict["contact.status.sending"] || translations.en["contact.status.sending"])

      const formData = new FormData(contactForm)
      formData.set("_subject", getCurrentLang() === "zh" ? "BEhop 联系表单新消息" : "New message from BEhop contact form")

      try {
        const response = await fetch(endpoint, {
          method: "POST",
          body: formData,
          headers: {
            Accept: "application/json",
          },
        })

        const payload = await response.json().catch(() => null)
        const success = payload && Object.prototype.hasOwnProperty.call(payload, "success")
          ? payload.success === true || payload.success === "true"
          : response.ok

        if (!response.ok || !success) {
          throw new Error("Contact form request failed")
        }

        contactForm.reset()
        setContactStatus(dict["contact.status.success"] || translations.en["contact.status.success"])
      } catch (error) {
        setContactStatus(dict["contact.status.error"] || translations.en["contact.status.error"])
      } finally {
        if (contactSubmitButton) {
          contactSubmitButton.disabled = false
          contactSubmitButton.removeAttribute("aria-busy")
        }
      }
    })
  }

  const filterButtons = document.querySelectorAll("[data-filter]")
  const projectCards = document.querySelectorAll("[data-project]")

  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const category = button.getAttribute("data-filter") || "all"
      filterButtons.forEach((btn) => btn.classList.remove("is-active"))
      button.classList.add("is-active")

      projectCards.forEach((card) => {
        const cardCategory = card.getAttribute("data-category")
        const shouldShow = category === "all" || category === cardCategory
        card.classList.toggle("hidden", !shouldShow)
      })
    })
  })

  const header = document.querySelector(".nav-header")
  const mobileMenu = document.querySelector(".nav-mobile")
  const menuToggle = document.querySelector("[data-menu-toggle]")
  const menuIcon = document.querySelector(".menu-icon")
  const closeIcon = document.querySelector(".close-icon")

  const updateHeader = () => {
    if (!header) return
    header.classList.toggle("is-scrolled", window.scrollY > 50)
  }

  updateHeader()
  window.addEventListener("scroll", updateHeader)

  if (menuToggle && mobileMenu) {
    menuToggle.addEventListener("click", () => {
      const isOpen = mobileMenu.classList.toggle("is-open")
      menuToggle.setAttribute("aria-expanded", String(isOpen))
      if (menuIcon && closeIcon) {
        menuIcon.classList.toggle("hidden", isOpen)
        closeIcon.classList.toggle("hidden", !isOpen)
      }
    })

    mobileMenu.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        mobileMenu.classList.remove("is-open")
        menuToggle.setAttribute("aria-expanded", "false")
        if (menuIcon && closeIcon) {
          menuIcon.classList.remove("hidden")
          closeIcon.classList.add("hidden")
        }
      })
    })
  }

  const scrollTopButton = document.querySelector("[data-scroll-top]")
  if (scrollTopButton) {
    scrollTopButton.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" })
    })
  }

  const currentYear = document.querySelector("#current-year")
  if (currentYear) {
    currentYear.textContent = String(new Date().getFullYear())
  }
})()
