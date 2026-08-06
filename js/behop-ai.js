(() => {
  const transNodes = document.querySelectorAll("[data-en][data-zh]")
  const langButtons = document.querySelectorAll(".lang-button")
  const mobileMenu = document.querySelector("[data-mobile-menu]")
  const menuToggle = document.querySelector("[data-menu-toggle]")
  const header = document.querySelector(".ai-header")

  const getStoredLang = () => {
    try {
      return localStorage.getItem("portfolioLang")
        || localStorage.getItem("behopAiLang")
        || localStorage.getItem("blogLang")
        || "en"
    } catch (error) {
      return "en"
    }
  }

  const syncStoredLang = (lang) => {
    try {
      localStorage.setItem("portfolioLang", lang)
      localStorage.setItem("behopAiLang", lang)
      localStorage.setItem("blogLang", lang)
    } catch (error) {
      // ignore storage errors
    }
  }

  let currentLang = getStoredLang()

  const applyLanguage = (lang) => {
    currentLang = lang
    document.documentElement.lang = lang
    transNodes.forEach((node) => {
      const value = node.getAttribute(`data-${lang}`)
      if (value) {
        node.textContent = value
      }
    })

    langButtons.forEach((button) => {
      if (button.dataset.lang === "toggle") return
      button.classList.toggle("is-active", button.dataset.lang === lang)
    })

    syncStoredLang(lang)
    updateLightboxContent()
    updateFilterStatus()
  }

  langButtons.forEach((button) => {
    button.addEventListener("click", () => {
      if (button.dataset.lang === "toggle") {
        applyLanguage(currentLang === "zh" ? "en" : "zh")
      } else {
        applyLanguage(button.dataset.lang || "en")
      }
    })
  })

  if (menuToggle && mobileMenu) {
    menuToggle.addEventListener("click", () => {
      mobileMenu.classList.toggle("hidden")
    })

    mobileMenu.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        mobileMenu.classList.add("hidden")
      })
    })
  }

  const updateHeader = () => {
    if (!header) return
    header.classList.toggle("is-scrolled", window.scrollY > 20)
  }

  updateHeader()
  window.addEventListener("scroll", updateHeader)

  const filterButtons = document.querySelectorAll("[data-filter]")
  const productCards = document.querySelectorAll("[data-category]")
  const filterStatus = document.querySelector("#ai-filter-status")
  const filterTimers = new WeakMap()
  let activeFilter = "All"

  const updateFilterStatus = () => {
    if (!filterStatus) return
    const visibleCount = [...productCards].filter((card) => !card.classList.contains("hidden")).length
    const activeButton = [...filterButtons].find((button) => button.dataset.filter === activeFilter)
    const label = activeButton?.getAttribute(`data-${currentLang}`) || activeFilter
    filterStatus.textContent = currentLang === "zh"
      ? `正在显示 ${visibleCount} 个${activeFilter === "All" ? "" : label}工具。`
      : activeFilter === "All"
        ? `Showing all ${visibleCount} tools.`
        : `Showing ${visibleCount} ${label} tool${visibleCount === 1 ? "" : "s"}.`
  }

  const setProductVisibility = (card, shouldShow) => {
    const activeTimer = filterTimers.get(card)
    if (activeTimer) window.clearTimeout(activeTimer)

    if (shouldShow) {
      card.classList.remove("hidden")
      card.setAttribute("aria-hidden", "false")
      window.requestAnimationFrame(() => card.classList.remove("is-filtered-out"))
      return
    }

    card.setAttribute("aria-hidden", "true")
    card.classList.add("is-filtered-out")
    const timer = window.setTimeout(() => card.classList.add("hidden"), 190)
    filterTimers.set(card, timer)
  }

  const applyFilter = (target) => {
    activeFilter = target
    filterButtons.forEach((button) => {
      const isActive = button.dataset.filter === target
      button.classList.toggle("is-active", isActive)
      button.setAttribute("aria-pressed", String(isActive))
    })

    productCards.forEach((card) => {
      const category = card.getAttribute("data-category")
      setProductVisibility(card, target === "All" || target === category)
    })
    window.setTimeout(updateFilterStatus, 200)
  }

  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      applyFilter(button.getAttribute("data-filter") || "All")
    })
  })

  const lightbox = document.querySelector("[data-lightbox]")
  const lightboxImage = document.querySelector("[data-lightbox-image]")
  const lightboxTitle = document.querySelector("[data-lightbox-title]")
  const lightboxDescription = document.querySelector("[data-lightbox-description]")
  const lightboxCategory = document.querySelector("[data-lightbox-category]")
  const lightboxClose = document.querySelector("[data-lightbox-close]")
  const lightboxPrev = document.querySelector("[data-lightbox-prev]")
  const lightboxNext = document.querySelector("[data-lightbox-next]")
  const galleryItems = Array.from(document.querySelectorAll("[data-gallery-item]"))

  let activeGalleryIndex = null

  const setLightboxIndex = (index) => {
    if (!galleryItems.length) return
    const safeIndex = (index + galleryItems.length) % galleryItems.length
    activeGalleryIndex = safeIndex
    const item = galleryItems[safeIndex]

    if (lightboxImage) {
      lightboxImage.src = item.getAttribute("data-image") || ""
      lightboxImage.alt = item.getAttribute(`data-title-${currentLang}`) || ""
    }

    updateLightboxContent()
  }

  const updateLightboxContent = () => {
    if (activeGalleryIndex === null) return
    const item = galleryItems[activeGalleryIndex]
    if (!item) return

    const title = item.getAttribute(`data-title-${currentLang}`) || ""
    const desc = item.getAttribute(`data-desc-${currentLang}`) || ""
    const cat = item.getAttribute(`data-cat-${currentLang}`) || ""

    if (lightboxTitle) lightboxTitle.textContent = title
    if (lightboxDescription) lightboxDescription.textContent = desc
    if (lightboxCategory) lightboxCategory.textContent = cat
  }

  applyLanguage(currentLang)

  galleryItems.forEach((item, index) => {
    item.addEventListener("click", () => {
      if (lightbox) {
        lightbox.classList.add("is-open")
      }
      setLightboxIndex(index)
    })
  })

  if (lightboxClose) {
    lightboxClose.addEventListener("click", () => {
      if (lightbox) lightbox.classList.remove("is-open")
      activeGalleryIndex = null
    })
  }

  if (lightboxPrev) {
    lightboxPrev.addEventListener("click", () => {
      if (activeGalleryIndex === null) return
      setLightboxIndex(activeGalleryIndex - 1)
    })
  }

  if (lightboxNext) {
    lightboxNext.addEventListener("click", () => {
      if (activeGalleryIndex === null) return
      setLightboxIndex(activeGalleryIndex + 1)
    })
  }

  if (lightbox) {
    lightbox.addEventListener("click", (event) => {
      if (event.target === lightbox) {
        lightbox.classList.remove("is-open")
        activeGalleryIndex = null
      }
    })
  }

  const yearNode = document.querySelector("#ai-year")
  if (yearNode) {
    yearNode.textContent = String(new Date().getFullYear())
  }
})()
