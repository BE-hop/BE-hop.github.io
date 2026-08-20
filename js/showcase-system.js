(() => {
  const root = document.documentElement
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)")
  root.classList.add("showcase-js")

  const heroHeading = document.querySelector("[data-masked-heading]")
  if (heroHeading && !reduceMotion.matches) {
    let hasRevealed = false
    try {
      hasRevealed = sessionStorage.getItem("behopHeroRevealed") === "true"
      if (!hasRevealed) sessionStorage.setItem("behopHeroRevealed", "true")
    } catch (error) {
      hasRevealed = false
    }
    heroHeading.classList.toggle("is-masked", !hasRevealed)
  }

  window.requestAnimationFrame(() => root.classList.add("showcase-ready"))

  const heroGrid = document.querySelector("[data-hero-grid-scan]")
  if (heroGrid && !reduceMotion.matches && window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
    const heroSection = heroGrid.closest(".showcase-home-hero")
    let gridFrame = null
    let pointerX = 0
    let pointerY = 0
    const updateGridFocus = () => {
      gridFrame = null
      const bounds = heroSection.getBoundingClientRect()
      const x = Math.min(90, Math.max(10, ((pointerX - bounds.left) / bounds.width) * 100))
      const y = Math.min(86, Math.max(14, ((pointerY - bounds.top) / bounds.height) * 100))
      heroSection.style.setProperty("--hero-grid-x", `${x.toFixed(2)}%`)
      heroSection.style.setProperty("--hero-grid-y", `${y.toFixed(2)}%`)
    }
    heroSection.addEventListener("pointermove", (event) => {
      pointerX = event.clientX
      pointerY = event.clientY
      if (gridFrame === null) gridFrame = window.requestAnimationFrame(updateGridFocus)
    })
    heroSection.addEventListener("pointerleave", () => {
      heroSection.style.removeProperty("--hero-grid-x")
      heroSection.style.removeProperty("--hero-grid-y")
    })
  }

  const revealNodes = document.querySelectorAll("[data-scroll-reveal]")
  if (!reduceMotion.matches && "IntersectionObserver" in window) {
    const observer = new IntersectionObserver((entries, currentObserver) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return
        entry.target.classList.remove("is-reveal-pending")
        entry.target.classList.add("is-reveal-visible")
        currentObserver.unobserve(entry.target)
      })
    }, { threshold: 0, rootMargin: "0px 0px -8%" })

    revealNodes.forEach((node) => {
      node.classList.add("is-reveal-pending")
      observer.observe(node)
    })
  } else {
    revealNodes.forEach((node) => node.classList.add("is-reveal-visible"))
  }

  if (window.matchMedia("(hover: hover) and (pointer: fine)").matches && !reduceMotion.matches) {
    document.querySelectorAll("[data-spotlight-card]").forEach((card) => {
      card.addEventListener("pointermove", (event) => {
        const bounds = card.getBoundingClientRect()
        card.style.setProperty("--spotlight-x", `${event.clientX - bounds.left}px`)
        card.style.setProperty("--spotlight-y", `${event.clientY - bounds.top}px`)
      })
    })
  }

  const stackCards = document.querySelectorAll("[data-scroll-stack-card]")
  stackCards.forEach((card, index) => card.style.setProperty("--stack-index", String(index)))

  const siteNav = document.querySelector("[data-site-nav]")
  const chapterNav = document.querySelector("[data-home-chapter-nav]")
  const toneSections = [...document.querySelectorAll("[data-nav-tone]")]
  if ((siteNav || chapterNav) && toneSections.length) {
    let toneFrame = null
    const updateNavTone = () => {
      toneFrame = null
      const probeY = Math.max(1, (siteNav?.getBoundingClientRect().height || 72) / 2)
      const activeSection = toneSections.find((section) => {
        const bounds = section.getBoundingClientRect()
        return bounds.top <= probeY && bounds.bottom > probeY
      }) || toneSections[toneSections.length - 1]
      const isDark = activeSection?.dataset.navTone === "dark"
      siteNav?.classList.toggle("is-over-dark", isDark)
      siteNav?.classList.toggle("is-over-light", !isDark)
      chapterNav?.classList.toggle("is-over-dark", isDark)
      chapterNav?.classList.toggle("is-over-light", !isDark)
      if (chapterNav) {
        const activeKey = activeSection?.dataset.sectionKey
        chapterNav.querySelectorAll("[data-home-nav]").forEach((link) => {
          link.setAttribute("aria-current", String(link.dataset.homeNav === activeKey))
        })
      }
    }

    window.addEventListener("scroll", () => {
      if (toneFrame === null) toneFrame = window.requestAnimationFrame(updateNavTone)
    }, { passive: true })
    window.addEventListener("resize", updateNavTone)
    updateNavTone()
  }

  const homeSections = [...document.querySelectorAll("[data-home-section]")]
  const canSnapSections = window.matchMedia("(min-width: 1024px) and (hover: hover) and (pointer: fine)")
  if (homeSections.length > 1 && canSnapSections.matches && !reduceMotion.matches) {
    let wheelIntent = 0
    let lastWheelAt = 0
    let snapLocked = false

    const sectionIndexAtViewport = () => {
      const probe = window.scrollY + 96
      let activeIndex = 0
      homeSections.forEach((section, index) => {
        if (section.offsetTop <= probe) activeIndex = index
      })
      return activeIndex
    }

    const snapToSection = (index) => {
      const target = homeSections[index]
      if (!target) return
      snapLocked = true
      window.scrollTo({ top: target.offsetTop, behavior: "smooth" })
      window.setTimeout(() => {
        snapLocked = false
        wheelIntent = 0
      }, 720)
    }

    window.addEventListener("wheel", (event) => {
      if (snapLocked || event.ctrlKey || event.shiftKey || Math.abs(event.deltaY) < 2) return
      if (event.target instanceof Element && event.target.closest("input, select, textarea, [contenteditable='true'], [data-native-scroll]")) return

      const now = performance.now()
      if (now - lastWheelAt > 180 || Math.sign(wheelIntent) !== Math.sign(event.deltaY)) wheelIntent = 0
      lastWheelAt = now
      wheelIntent += event.deltaY
      if (Math.abs(wheelIntent) < 28) return

      const direction = Math.sign(wheelIntent)
      const currentIndex = sectionIndexAtViewport()
      const currentBounds = homeSections[currentIndex].getBoundingClientRect()
      const atSectionTop = Math.abs(currentBounds.top) <= 42
      const atSectionBottom = currentBounds.bottom <= window.innerHeight + 56
      const shouldSnapNext = direction > 0 && currentIndex < homeSections.length - 1 && (currentIndex === 0 || atSectionBottom)
      const shouldSnapPrevious = direction < 0 && currentIndex > 0 && atSectionTop

      if (!shouldSnapNext && !shouldSnapPrevious) return
      event.preventDefault()
      snapToSection(currentIndex + direction)
    }, { passive: false })
  }
})()
