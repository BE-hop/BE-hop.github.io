(() => {
  const root = document.documentElement
  const animatedHeroes = document.querySelectorAll('.showcase-home-hero, .ai-page-hero')
  const pause = () => animatedHeroes.forEach(node => node.classList.toggle('is-motion-paused', document.hidden || node.dataset.offscreen === 'true'))
  if ('IntersectionObserver' in window) {
    const motionObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => { entry.target.dataset.offscreen = String(!entry.isIntersecting) })
      pause()
    })
    animatedHeroes.forEach(node => motionObserver.observe(node))
  }
  document.addEventListener('visibilitychange', pause)
  pause()
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)")
  root.classList.add("showcase-js")

  // Content stays visible; decoration never delays reading or handles pointer movement.
  document.querySelectorAll('[data-scroll-reveal]').forEach(node => node.classList.add('is-reveal-visible'))

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

  // Native scrolling keeps trackpads, wheel input and touch responsive.
})()
