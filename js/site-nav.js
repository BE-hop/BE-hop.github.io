(() => {
  const nav = document.querySelector("[data-site-nav]")
  if (!nav) return

  const toggle = nav.querySelector("[data-site-nav-toggle]")
  const mobile = nav.querySelector("[data-site-nav-mobile]")

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
