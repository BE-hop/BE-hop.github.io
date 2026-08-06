(() => {
  const nav = document.querySelector("[data-site-nav]")
  if (!nav) return

  const toggle = nav.querySelector("[data-site-nav-toggle]")
  const mobile = nav.querySelector("[data-site-nav-mobile]")
  const brand = nav.querySelector("[data-depth-brand]")
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)")

  if (brand) {
    const syncDepthText = () => brand.setAttribute("data-depth-text", brand.textContent.trim())
    syncDepthText()
    new MutationObserver(syncDepthText).observe(brand, { childList: true, characterData: true, subtree: true })

    if (!reduceMotion.matches && window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
      brand.parentElement.addEventListener("pointermove", (event) => {
        const bounds = brand.getBoundingClientRect()
        const x = Math.max(-1, Math.min(1, (event.clientX - bounds.left) / bounds.width * 2 - 1))
        const y = Math.max(-1, Math.min(1, (event.clientY - bounds.top) / bounds.height * 2 - 1))
        brand.style.setProperty("--brand-rotate-x", `${(-y * 5).toFixed(2)}deg`)
        brand.style.setProperty("--brand-rotate-y", `${(x * 7).toFixed(2)}deg`)
        brand.style.setProperty("--brand-depth-x", `${(2.2 + x * 1.2).toFixed(2)}px`)
        brand.style.setProperty("--brand-depth-y", `${(2.2 + y * 1.2).toFixed(2)}px`)
      })
      brand.parentElement.addEventListener("pointerleave", () => {
        brand.style.removeProperty("--brand-rotate-x")
        brand.style.removeProperty("--brand-rotate-y")
        brand.style.removeProperty("--brand-depth-x")
        brand.style.removeProperty("--brand-depth-y")
      })
    }
  }

  const updateNav = () => {
    nav.classList.toggle("is-scrolled", window.scrollY > 40)
  }

  updateNav()
  window.addEventListener("scroll", updateNav)

  if (!toggle || !mobile) return

  const setOpen = (isOpen) => {
    mobile.classList.toggle("is-open", isOpen)
    toggle.classList.toggle("is-active", isOpen)
    toggle.setAttribute("aria-expanded", String(isOpen))
  }

  toggle.addEventListener("click", () => {
    setOpen(!mobile.classList.contains("is-open"))
  })

  mobile.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => setOpen(false))
  })

  document.addEventListener("click", (event) => {
    if (!nav.contains(event.target)) setOpen(false)
  })

  window.addEventListener("message", (event) => {
    let origin
    try {
      origin = new URL(event.origin)
    } catch (error) {
      return
    }
    if (!["127.0.0.1", "localhost"].includes(origin.hostname)) return
    if (!event.data || event.data.type !== "behop:set-language") return
    const lang = event.data.lang === "zh" ? "zh" : "en"
    try {
      localStorage.setItem("portfolioLang", lang)
      localStorage.setItem("blogLang", lang)
      localStorage.setItem("behopAiLang", lang)
    } catch (error) {
      // Ignore storage failures and still refresh the preview.
    }
    window.location.reload()
  })
})()
