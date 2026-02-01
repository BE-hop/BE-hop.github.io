(() => {
  const transNodes = document.querySelectorAll("[data-en][data-zh]")
  const langButtons = document.querySelectorAll(".lang-button")
  const mobileMenu = document.querySelector("[data-mobile-menu]")
  const menuToggle = document.querySelector("[data-menu-toggle]")
  const header = document.querySelector(".ai-header")

  let currentLang = localStorage.getItem("behopAiLang") || "en"

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

    localStorage.setItem("behopAiLang", lang)
    updateLightboxContent()
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

  applyLanguage(currentLang)

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

  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const target = button.getAttribute("data-filter")
      filterButtons.forEach((btn) => btn.classList.remove("is-active"))
      button.classList.add("is-active")

      productCards.forEach((card) => {
        const category = card.getAttribute("data-category")
        const show = target === "All" || target === category
        card.classList.toggle("hidden", !show)
      })
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
