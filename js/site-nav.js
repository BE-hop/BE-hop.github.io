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
    const tabs = [...contact.querySelectorAll('[data-contact-tab]')]
    const loadQR = () => {
      const qr = contact.querySelector('[data-contact-src]')
      if (contact.open && !contact.querySelector('#contact-panel-qr').hidden && !qr.hasAttribute('src')) qr.src = qr.dataset.contactSrc
    }
    const selectTab = (tab, focus = false) => {
      tabs.forEach(item => {
        const active = item === tab
        item.setAttribute('aria-selected', String(active))
        item.tabIndex = active ? 0 : -1
        contact.querySelector(`#${item.getAttribute('aria-controls')}`).hidden = !active
      })
      status.textContent = ''
      copySequence++
      if (focus) tab.focus()
      loadQR()
    }
    tabs.forEach((tab, index) => {
      tab.addEventListener('click', () => selectTab(tab))
      tab.addEventListener('keydown', event => {
        if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return
        event.preventDefault()
        const next = event.key === 'Home' ? 0 : event.key === 'End' ? tabs.length - 1 : (index + (event.key === 'ArrowRight' ? 1 : -1) + tabs.length) % tabs.length
        selectTab(tabs[next], true)
      })
    })
    const form = contact.querySelector('#contact-form')
    const formStatus = contact.querySelector('#contact-form-status')
    const submit = form.querySelector('[type="submit"]')
    let sending = false
    form.addEventListener('submit', async event => {
      event.preventDefault()
      if (sending || !form.reportValidity()) return
      sending = true
      submit.disabled = true
      submit.setAttribute('aria-busy', 'true')
      const message = (zh, en) => { formStatus.textContent = isChinese() ? zh : en }
      message('正在发送…', 'Sending…')
      const data = Object.fromEntries(new FormData(form).entries())
      data._subject = isChinese() ? 'BEhop 联系表单新消息' : 'New message from BEhop contact form'
      if (!/^(localhost|127\.0\.0\.1)$/.test(location.hostname)) data._url = location.href.split('#')[0]
      try {
        const response = await fetch(form.dataset.ajaxEndpoint, {
          method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify(data)
        })
        const payload = await response.json()
        if (!response.ok || (payload.success !== true && payload.success !== 'true')) throw new Error('Contact delivery not confirmed')
        form.reset()
        message('消息已发送，感谢联系。', 'Message sent. Thank you for getting in touch.')
      } catch (error) {
        // Keep the draft and offer an explicit retry instead of sending twice through a fallback.
        message('发送未成功，内容已保留。请重试，或使用上方邮箱直接发送。', 'Could not confirm delivery. Your draft is saved here. Please retry or use the email link above.')
      } finally {
        sending = false
        submit.disabled = false
        submit.removeAttribute('aria-busy')
      }
    })
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
        loadQR()
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
      const controls = Array.from(contact.querySelectorAll('button:not(:disabled):not([tabindex="-1"]), a[href], input:not([type="hidden"]):not([tabindex="-1"]), select, textarea, [tabindex="0"]'))
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
    if (isOpen) mobile.scrollTop = 0
    mobile.classList.toggle("is-open", isOpen)
    toggle.classList.toggle("is-active", isOpen)
    toggle.setAttribute("aria-expanded", String(isOpen))
  }

  toggle.addEventListener("click", () => {
    setOpen(!mobile.classList.contains("is-open"))
  })

  document.addEventListener("keydown", event => {
    if (event.key !== "Escape" || !mobile.classList.contains("is-open")) return
    setOpen(false)
    toggle.focus()
  })
  window.matchMedia("(max-width: 900px)").addEventListener("change", event => {
    if (!event.matches) setOpen(false)
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
