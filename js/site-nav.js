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

  const contact = document.querySelector("#site-contact")
  if (contact) {
    let opener
    let copySequence = 0
    const status = contact.querySelector('.site-contact__status')
    const isChinese = () => document.documentElement.lang.startsWith("zh")
    const syncContactLanguage = () => {
      document.querySelectorAll("[data-contact-zh]").forEach(node => {
        node.textContent = node.getAttribute(isChinese() ? "data-contact-zh" : "data-contact-en")
      })
      status.textContent = ""
      copySequence++
    }
    syncContactLanguage()
    new MutationObserver(syncContactLanguage).observe(document.documentElement, { attributes: true, attributeFilter: ["lang"] })
    document.querySelectorAll("[data-contact-open]").forEach(button => {
      button.addEventListener("click", () => {
        opener = button
        if (mobile && toggle) {
          mobile.classList.remove("is-open")
          toggle.classList.remove("is-active")
          toggle.setAttribute("aria-expanded", "false")
        }
        status.textContent = ""
        contact.showModal()
        document.documentElement.classList.add("site-contact-open")
        const qr = contact.querySelector("[data-contact-src]")
        if (!qr.hasAttribute("src")) qr.src = qr.dataset.contactSrc
      })
    })
    contact.querySelector("[data-contact-close]").addEventListener("click", () => contact.close())
    contact.addEventListener("click", event => {
      if (event.target !== contact) return
      const bounds = contact.getBoundingClientRect()
      if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) contact.close()
    })
    contact.addEventListener("keydown", event => {
      if (event.key !== "Tab") return
      const controls = Array.from(contact.querySelectorAll('button:not(:disabled), a[href], [tabindex="0"]'))
        .filter(node => node.getClientRects().length)
      const first = controls[0]
      const last = controls[controls.length - 1]
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    })
    contact.addEventListener("close", () => {
      copySequence++
      document.documentElement.classList.remove("site-contact-open")
      // The mobile entry is hidden after opening; return focus to its menu toggle.
      if (opener && !mobile?.contains(opener) && opener.getClientRects().length) opener.focus()
      else if (toggle) toggle.focus()
    })
    contact.querySelector("[data-contact-src]").addEventListener("error", () => {
      contact.querySelector("[data-contact-error]").hidden = false
    })
    contact.querySelector("[data-contact-src]").addEventListener("load", () => {
      contact.querySelector("[data-contact-error]").hidden = true
    })
    contact.querySelectorAll("[data-contact-copy]").forEach(button => {
      button.addEventListener("click", async () => {
        const sequence = ++copySequence
        let succeeded = false
        try {
          await navigator.clipboard.writeText(button.dataset.contactCopy)
          succeeded = true
        } catch (error) {
          // The visible ID and email remain selectable when clipboard access is denied.
        }
        if (sequence !== copySequence || !contact.open) return
        status.textContent = succeeded
          ? (isChinese() ? "已复制" : "Copied")
          : (isChinese() ? "复制失败，请选中联系方式手动复制。" : "Could not copy. Please select the contact details and copy manually.")
      })
    })
  }

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
