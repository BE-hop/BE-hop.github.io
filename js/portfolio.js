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
      "nav.projects.services": "设计服务",
      "nav.projects.about": "关于 BEhop",
      "nav.projects.contact": "联系 BEhop",
      "nav.about": "关于 BEhop",
      "nav.services": "设计服务",
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
      "about.subtitle": "致力于创造与自然和谐共生的空间",
      "about.description": "BEhop 设计成立于2015年，专注于景观设计与空间叙事。BEhop 相信优秀的景观设计能够连接人与自然，创造出既美观又实用的户外空间，并持续为每一个项目带来独特的视角与创新方案。",
      "about.philosophy": "设计理念",
      "about.philosophy.text": "BEhop 的设计理念源于对自然的深刻理解和尊重。每一个项目都从场地分析开始，深入了解当地的气候、植被、文化和客户需求，以此为基础创造独特的景观体验。BEhop 追求的不仅是视觉上的美感，更是人与环境之间的情感连接。",
      "about.stats.projects": "完成项目",
      "about.stats.years": "行业经验",
      "about.stats.awards": "设计奖项",
      "about.stats.team": "专业团队",
      "about.quote": "“设计不是装饰，而是与自然对话的语言。”",
      "about.quoteAuthor": "— BEhop Design",
      "about.values.1.title": "尊重自然",
      "about.values.1.desc": "每一个设计都从理解场地开始",
      "about.values.2.title": "以人为本",
      "about.values.2.desc": "创造人与环境的情感连接",
      "about.values.3.title": "可持续发展",
      "about.values.3.desc": "打造经得起时间考验的设计",

      "services.kicker": "专业服务",
      "services.title": "设计服务",
      "services.subtitle": "从概念到落地的全流程设计服务",
      "services.1.title": "私人庭院设计",
      "services.1.desc": "为您的家创造独特的户外生活空间，打造专属的私家花园，让每一天都与自然相伴。",
      "services.2.title": "商业景观规划",
      "services.2.desc": "提升商业空间的环境品质和价值，为酒店、会所、办公园区提供专业景观解决方案。",
      "services.3.title": "屋顶花园设计",
      "services.3.desc": "将城市空间转化为绿色天堂，最大化利用建筑空间，创造空中花园奇迹。",
      "services.4.title": "生态修复设计",
      "services.4.desc": "恢复和保护自然生态系统，运用生态学原理，重建可持续的自然环境。",
      "services.cta.title": "准备开始您的项目？",
      "services.cta.desc": "与 BEhop 一起探讨如何将您的愿景变为现实",

      "contact.kicker": "联系 BEhop",
      "contact.title": "联系 BEhop",
      "contact.description": "无论您是想打造梦想中的私家花园，还是为商业项目寻找景观解决方案，BEhop 都期待倾听您的想法。",
      "contact.name": "姓名",
      "contact.email": "邮箱",
      "contact.phone.input": "电话",
      "contact.project": "项目类型",
      "contact.message": "项目描述",
      "contact.submit": "发送消息",
      "contact.emailLabel": "电子邮箱",
      "contact.hours": "工作时间",
      "contact.hoursText": "周一至周五 9:00 - 18:00",
      "contact.formTitle": "发送咨询",
      "contact.notice": "BEhop 将在24小时内回复您的咨询",
      "contact.name.placeholder": "您的姓名",
      "contact.email.placeholder": "您的邮箱",
      "contact.phone.placeholder": "联系电话",
      "contact.project.placeholder": "选择项目类型",
      "contact.message.placeholder": "请描述您的项目需求...",

      "footer.rights": "版权所有",
      "footer.description": "BEhop 专注于创造和谐自然的景观设计，为每一个空间赋予独特的生命力。让建筑与自然对话，让生活与诗意相遇。",
      "footer.services": "设计服务",
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
      "nav.projects.services": "Services",
      "nav.projects.about": "About BEhop",
      "nav.projects.contact": "Contact BEhop",
      "nav.about": "About BEhop",
      "nav.services": "Services",
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
      "about.subtitle": "Dedicated to creating spaces in harmony with nature",
      "about.description": "Founded in 2015, BEhop Design is a creative studio specializing in landscape architecture and spatial storytelling. BEhop believes excellent landscape design connects people with nature, creating outdoor spaces that are both beautiful and functional, while bringing fresh perspectives and innovative solutions to every project.",
      "about.philosophy": "Design Philosophy",
      "about.philosophy.text": "BEhop's design philosophy stems from a deep understanding and respect for nature. Every project begins with site analysis, understanding local climate, vegetation, culture, and client needs to create unique landscape experiences. BEhop pursues not only visual beauty but also the emotional connection between people and their environment.",
      "about.stats.projects": "Projects",
      "about.stats.years": "Years",
      "about.stats.awards": "Awards",
      "about.stats.team": "Team Members",
      "about.quote": "\"Design is not decoration, but a language of dialogue with nature.\"",
      "about.quoteAuthor": "— BEhop Design",
      "about.values.1.title": "Respect Nature",
      "about.values.1.desc": "Every design begins with understanding the site",
      "about.values.2.title": "Human-Centered",
      "about.values.2.desc": "Creating emotional connections between people and environment",
      "about.values.3.title": "Sustainability",
      "about.values.3.desc": "Building designs that stand the test of time",

      "services.kicker": "Services",
      "services.title": "Services",
      "services.subtitle": "Full-process design services from concept to completion",
      "services.1.title": "Private Garden Design",
      "services.1.desc": "Create unique outdoor living spaces for your home, crafting exclusive private gardens where you can connect with nature every day.",
      "services.2.title": "Commercial Landscape",
      "services.2.desc": "Enhance environmental quality and value of commercial spaces, providing professional landscape solutions for hotels, resorts, and office parks.",
      "services.3.title": "Rooftop Garden",
      "services.3.desc": "Transform urban spaces into green paradises, maximizing building space to create sky garden wonders.",
      "services.4.title": "Ecological Restoration",
      "services.4.desc": "Restore and protect natural ecosystems, applying ecological principles to rebuild sustainable natural environments.",
      "services.cta.title": "Ready to Start Your Project?",
      "services.cta.desc": "Talk with BEhop about turning your vision into reality",

      "contact.kicker": "Contact BEhop",
      "contact.title": "Contact BEhop",
      "contact.description": "Whether you want to create your dream private garden or find landscape solutions for commercial projects, BEhop looks forward to hearing your ideas.",
      "contact.name": "Name",
      "contact.email": "Email",
      "contact.phone.input": "Phone",
      "contact.project": "Project Type",
      "contact.message": "Project Description",
      "contact.submit": "Send Message",
      "contact.emailLabel": "Email",
      "contact.hours": "Working Hours",
      "contact.hoursText": "Mon - Fri, 9:00 AM - 6:00 PM",
      "contact.formTitle": "Send an Inquiry",
      "contact.notice": "BEhop will respond to your inquiry within 24 hours",
      "contact.name.placeholder": "Your name",
      "contact.email.placeholder": "Your email",
      "contact.phone.placeholder": "Phone number",
      "contact.project.placeholder": "Select project type",
      "contact.message.placeholder": "Please describe your project requirements...",

      "footer.rights": "All Rights Reserved",
      "footer.description": "BEhop creates harmonious landscape designs, bringing unique vitality to every space. Let architecture converse with nature, let life meet poetry.",
      "footer.services": "Services",
      "footer.company": "About BEhop",
      "footer.backToTop": "Back to Top",
    },
  }

  const projectTypes = {
    zh: [
      { value: "", label: "选择项目类型" },
      { value: "private", label: "私人庭院" },
      { value: "commercial", label: "商业景观" },
      { value: "rooftop", label: "屋顶花园" },
      { value: "ecological", label: "生态修复" },
      { value: "other", label: "其他" },
    ],
    en: [
      { value: "", label: "Select project type" },
      { value: "private", label: "Private Garden" },
      { value: "commercial", label: "Commercial Landscape" },
      { value: "rooftop", label: "Rooftop Garden" },
      { value: "ecological", label: "Ecological Restoration" },
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
