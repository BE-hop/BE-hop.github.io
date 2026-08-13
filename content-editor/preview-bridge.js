(function () {
  "use strict"

  const EDITOR_ORIGIN = "http://127.0.0.1:4567"
  const state = { mode: "edit", lang: document.documentElement.lang === "zh-CN" ? "zh" : "en", bindings: [] }
  const decorated = new Map()
  const composing = new WeakSet()

  function send(type, payload = {}) {
    if (window.parent !== window) window.parent.postMessage({ source: "behop-preview", type, ...payload }, EDITOR_ORIGIN)
  }

  function clean(value) { return String(value == null ? "" : value).replace(/\s+/g, " ").trim() }
  function imagePath(node) { try { return new URL(node.currentSrc || node.src, location.href).pathname } catch (_) { return "" } }

  function candidates(binding) {
    if (binding.kind === "markdown") return [...document.querySelectorAll("[data-behop-markdown]")]
    if (binding.kind === "image") return [...document.images].filter((node) => imagePath(node) === binding.value)
    const value = binding.localized ? binding.values?.[state.lang] : binding.value
    if (!clean(value)) return []
    return [...document.querySelectorAll("[data-en], [data-zh], h1, h2, h3, h4, p, span, a, button, dd, figcaption, li")].filter((node) => {
      const localized = node.getAttribute(`data-${state.lang}`)
      return clean(localized == null ? node.textContent : localized) === clean(value)
    })
  }

  function recordMatchesPage(binding, node) {
    if (binding.type === "homepage" || binding.type === "site-settings") return location.pathname === "/"
    if (binding.type === "about") return location.pathname.startsWith("/about")
    if (binding.type === "archive") return location.pathname.startsWith("/works/archive")
    if (binding.type === "blog") return location.pathname.includes(binding.slug || binding.id.replace(/^\d{4}-\d{2}-\d{2}-/, ""))
    if (location.pathname === binding.previewPath) return true
    return Boolean(node.closest(`a[href='${binding.previewPath}'], a[href='${String(binding.previewPath).replace(/\/$/, "")}']`))
  }

  function clearBindings() {
    decorated.forEach((_binding, node) => {
      node.classList.remove("behop-editable", "behop-editable--selected")
      node.removeAttribute("data-behop-editor-key")
      node.removeAttribute("contenteditable")
    })
    decorated.clear()
  }

  function select(node, binding) {
    if (state.mode !== "edit") return
    decorated.forEach((_item, other) => other.classList.toggle("behop-editable--selected", other === node))
    send("element-selected", { key: binding.key, kind: binding.kind, rect: node.getBoundingClientRect().toJSON() })
    if (binding.kind === "text") {
      node.setAttribute("contenteditable", "plaintext-only")
      node.focus({ preventScroll: true })
      const selection = window.getSelection()
      selection.selectAllChildren(node)
      selection.collapseToEnd()
    }
  }

  function decorate() {
    clearBindings()
    if (state.mode !== "edit") return
    state.bindings.forEach((binding) => candidates(binding).filter((node) => recordMatchesPage(binding, node)).forEach((node) => {
      if (decorated.has(node)) return
      decorated.set(node, binding)
      node.classList.add("behop-editable")
      node.dataset.behopEditorKey = binding.key
    }))
  }

  function applyValue(binding) {
    decorated.forEach((item, node) => {
      if (item.key !== binding.key) return
      if (binding.kind === "image") node.src = binding.previewValue || binding.value
      else {
        const value = binding.localized ? binding.values[state.lang] : binding.value
        // The focused node already contains the user's current input. Replacing
        // it here interrupts IME candidates and can drop the caret entirely.
        if (document.activeElement !== node) node.textContent = value == null ? "" : value
        if (binding.localized) node.setAttribute(`data-${state.lang}`, value == null ? "" : value)
      }
    })
  }

  document.addEventListener("click", (event) => {
    if (state.mode !== "edit") return
    const node = event.target.closest(".behop-editable")
    if (!node) return
    event.preventDefault()
    event.stopImmediatePropagation()
    select(node, decorated.get(node))
  }, true)

  document.addEventListener("input", (event) => {
    const node = event.target.closest(".behop-editable[contenteditable]")
    const binding = node && decorated.get(node)
    if (binding && !composing.has(node) && !event.isComposing) {
      send("field-changed", { key: binding.key, value: node.textContent.replace(/\u00a0/g, " ") })
    }
  }, true)

  document.addEventListener("blur", (event) => {
    const node = event.target.closest(".behop-editable[contenteditable]")
    const binding = node && decorated.get(node)
    if (!binding || composing.has(node)) return
    send("field-committed", { key: binding.key, value: node.textContent.replace(/\u00a0/g, " ") })
  }, true)

  document.addEventListener("compositionstart", (event) => {
    const node = event.target.closest(".behop-editable[contenteditable]")
    if (node && decorated.has(node)) composing.add(node)
  }, true)

  document.addEventListener("compositionend", (event) => {
    const node = event.target.closest(".behop-editable[contenteditable]")
    const binding = node && decorated.get(node)
    if (!binding) return
    composing.delete(node)
    send("field-changed", { key: binding.key, value: node.textContent.replace(/\u00a0/g, " ") })
  }, true)

  document.addEventListener("keydown", (event) => {
    if (!event.isComposing && event.key === "Enter" && !event.shiftKey && event.target.matches(".behop-editable[contenteditable]")) {
      event.preventDefault()
      event.target.blur()
    }
  })

  window.addEventListener("message", (event) => {
    if (event.origin !== EDITOR_ORIGIN || event.source !== window.parent || event.data?.source !== "behop-editor") return
    if (event.data.type === "configure") {
      state.mode = event.data.mode === "preview" ? "preview" : "edit"
      state.lang = event.data.lang === "zh" ? "zh" : "en"
      state.bindings = Array.isArray(event.data.bindings) ? event.data.bindings : []
      document.documentElement.dataset.behopEditorMode = state.mode
      decorate()
    } else if (event.data.type === "binding-value") applyValue(event.data.binding || {})
  })

  const style = document.createElement("style")
  style.textContent = `
    html[data-behop-editor-mode='edit'] .behop-editable { cursor: text !important; outline: 1px dashed transparent; outline-offset: 4px; transition: outline-color .15s, box-shadow .15s; }
    html[data-behop-editor-mode='edit'] img.behop-editable { cursor: pointer !important; }
    html[data-behop-editor-mode='edit'] .behop-editable:hover { outline-color: #06b6d4; }
    html[data-behop-editor-mode='edit'] .behop-editable--selected { outline: 2px solid #06b6d4 !important; box-shadow: 0 0 0 5px rgba(6,182,212,.16); }
  `
  document.head.append(style)
  window.addEventListener("load", () => send("ready", { path: location.pathname, scrollY: window.scrollY }))
})()
