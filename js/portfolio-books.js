(function () {
  "use strict"

  const root = document.querySelector(".portfolio-books")
  if (!root) return

  const books = {
    planning: { number: "01", en: "Planning", zh: "规划" },
    landscape: { number: "02", en: "Landscape", zh: "景观" },
    spatial: { number: "03", en: "Spatial + Architecture", zh: "空间与建筑" },
  }
  const spreads = { planning: [], landscape: [], spatial: [] }
  root.querySelectorAll("[data-book-spread]").forEach((node) => {
    const book = node.dataset.book
    if (spreads[book]) spreads[book].push({ src: node.dataset.src, en: node.dataset.altEn, zh: node.dataset.altZh })
  })

  const reader = root.querySelector("#portfolio-reader")
  const stage = root.querySelector("[data-reader-stage]")
  const canvas = root.querySelector("[data-reader-canvas]")
  const tilt = root.querySelector("[data-reader-tilt]")
  const currentImage = root.querySelector("[data-reader-current]")
  const incomingImage = root.querySelector("[data-reader-incoming]")
  const turnLayer = root.querySelector("[data-reader-turn]")
  const title = root.querySelector("[data-reader-title]")
  const kicker = root.querySelector("[data-reader-kicker]")
  const counter = root.querySelector("[data-reader-counter]")
  const status = root.querySelector("[data-reader-status]")
  const fallback = root.querySelector("[data-reader-fallback]")
  const previous = root.querySelector("[data-reader-prev]")
  const next = root.querySelector("[data-reader-next]")
  const loupe = root.querySelector("[data-reader-loupe]")
  const loupeLens = root.querySelector("[data-reader-loupe-lens]")
  const loupeToggle = root.querySelector("[data-reader-loupe-toggle]")
  const coverButtons = Array.from(root.querySelectorAll("[data-book-select]"))
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)")
  const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)")
  const STRIP_COUNT = 18
  const PAGE_SPAN = .5
  const CURL_PEAK = .6
  const MAGNIFICATION = 2.3
  const state = {
    book: "planning",
    pages: { planning: 0, landscape: 0, spatial: 0 },
    turning: false,
    pointer: null,
    animation: null,
    loupeOn: true,
    loupeX: .82,
    loupeY: .78,
    loupeTarget: null,
  }

  const clamp = (value, min, max) => Math.max(min, Math.min(max, value))
  const language = () => {
    try { return localStorage.getItem("portfolioLang") === "zh" ? "zh" : "en" } catch (error) { return document.documentElement.lang === "zh" ? "zh" : "en" }
  }
  const t = (en, zh) => language() === "zh" ? zh : en
  const pageIndex = () => state.pages[state.book]
  const currentSpread = () => spreads[state.book][pageIndex()]

  const loadSpread = (spread) => new Promise((resolve) => {
    if (!spread) { resolve(false); return }
    if (spread.width && spread.height) { resolve(true); return }
    const image = new Image()
    image.onload = () => {
      spread.width = image.naturalWidth
      spread.height = image.naturalHeight
      resolve(true)
    }
    image.onerror = () => resolve(false)
    image.src = spread.src
  })
  const setImage = (image, spread, visible) => {
    if (!spread) return
    image.onload = () => {
      spread.width = image.naturalWidth
      spread.height = image.naturalHeight
      if (visible) updateLoupe()
    }
    image.src = spread.src
    image.alt = visible ? (language() === "zh" ? spread.zh : spread.en) : ""
  }
  const fittedImage = (spread, rect) => {
    const sourceWidth = spread.width || rect.width
    const sourceHeight = spread.height || rect.height
    const scale = Math.min(rect.width / sourceWidth, rect.height / sourceHeight)
    const width = sourceWidth * scale
    const height = sourceHeight * scale
    return { width, height, x: (rect.width - width) / 2, y: (rect.height - height) / 2 }
  }

  const applyLanguage = () => {
    document.documentElement.lang = language()
    document.querySelectorAll("[data-portfolio-en][data-portfolio-zh]").forEach((node) => {
      node.textContent = t(node.dataset.portfolioEn, node.dataset.portfolioZh)
    })
    Object.keys(books).forEach((key) => {
      const book = books[key]
      const count = spreads[key].length
      root.querySelectorAll(`[data-book-title="${key}"]`).forEach((node) => { node.textContent = t(book.en, book.zh) })
      root.querySelectorAll(`[data-book-count="${key}"]`).forEach((node) => { node.textContent = t(`${count} spreads`, `${count} 张图面`) })
    })
    render(false)
  }
  const updateReaderText = () => {
    const book = books[state.book]
    const index = pageIndex() + 1
    const count = spreads[state.book].length
    title.textContent = t(book.en, book.zh)
    kicker.textContent = `${book.number} / ${t(book.en, book.zh)}`
    counter.textContent = `${String(index).padStart(2, "0")} / ${String(count).padStart(2, "0")}`
    status.textContent = t(`Spread ${index} of ${count}`, `图面 ${index} / ${count}`)
    previous.disabled = index === 1
    next.disabled = index === count
    previous.setAttribute("aria-label", t("Previous spread", "上一张图面"))
    next.setAttribute("aria-label", t("Next spread", "下一张图面"))
  }
  const preloadAround = () => {
    const pages = spreads[state.book]
    ;[pageIndex() - 1, pageIndex() + 1].forEach((index) => { if (pages[index]) loadSpread(pages[index]) })
  }
  const render = (freshImage) => {
    const spread = currentSpread()
    if (!spread) return
    if (freshImage || currentImage.getAttribute("src") !== spread.src) setImage(currentImage, spread, true)
    else currentImage.alt = language() === "zh" ? spread.zh : spread.en
    updateReaderText()
    coverButtons.forEach((button) => {
      const selected = button.dataset.bookSelect === state.book
      button.classList.toggle("is-selected", selected)
      button.setAttribute("aria-selected", String(selected))
    })
    fallback.hidden = true
    updateLoupeState()
    preloadAround()
  }

  const updateLoupe = () => {
    const spread = currentSpread()
    if (!finePointer.matches || !state.loupeOn || !spread) return
    const stageRect = stage.getBoundingClientRect()
    const rect = canvas.getBoundingClientRect()
    const lensRect = loupeLens.getBoundingClientRect()
    if (!rect.width || !rect.height || !lensRect.width) return
    const x = clamp(state.loupeX, -.04, 1.04)
    const y = clamp(state.loupeY, -.08, 1.08)
    const fit = fittedImage(spread, rect)
    const canvasX = x * rect.width
    const canvasY = y * rect.height
    loupe.style.setProperty("--loupe-left", `${rect.left - stageRect.left + canvasX}px`)
    loupe.style.setProperty("--loupe-top", `${rect.top - stageRect.top + canvasY}px`)
    loupeLens.style.backgroundImage = `url("${spread.src}")`
    loupeLens.style.backgroundSize = `${fit.width * MAGNIFICATION}px ${fit.height * MAGNIFICATION}px`
    loupeLens.style.backgroundPosition = `${lensRect.width / 2 - (canvasX - fit.x) * MAGNIFICATION}px ${lensRect.height / 2 - (canvasY - fit.y) * MAGNIFICATION}px`
    loupe.setAttribute("aria-hidden", "false")
  }
  const updateLoupeState = () => {
    const enabled = finePointer.matches && state.loupeOn
    loupe.setAttribute("aria-hidden", enabled ? "false" : "true")
    loupeToggle.hidden = !finePointer.matches
    loupeToggle.setAttribute("aria-pressed", String(state.loupeOn))
    loupeToggle.setAttribute("aria-label", t(state.loupeOn ? "Hide loupe" : "Show loupe", state.loupeOn ? "隐藏放大镜" : "显示放大镜"))
    if (enabled) updateLoupe()
  }
  const easeLoupeAside = (direction) => {
    if (!state.loupeOn || !finePointer.matches || state.loupeDrag) return
    state.loupeTarget = { x: direction === 1 ? .1 : .9, y: .82 }
    const move = () => {
      if (!state.loupeTarget || state.loupeDrag) return
      const dx = state.loupeTarget.x - state.loupeX
      const dy = state.loupeTarget.y - state.loupeY
      state.loupeX += dx * .17
      state.loupeY += dy * .17
      updateLoupe()
      if (Math.abs(dx) < .002 && Math.abs(dy) < .002) { state.loupeTarget = null; return }
      requestAnimationFrame(move)
    }
    requestAnimationFrame(move)
  }

  const clearTurn = () => {
    if (state.animation) cancelAnimationFrame(state.animation)
    state.animation = null
    turnLayer.replaceChildren()
    turnLayer.classList.remove("is-active")
    incomingImage.style.opacity = "0"
    incomingImage.removeAttribute("src")
    currentImage.style.clipPath = "none"
  }
  const styleFace = (face, spread, canvasX, rect) => {
    const fit = fittedImage(spread, rect)
    face.style.backgroundImage = `url("${spread.src}")`
    face.style.backgroundSize = `${fit.width}px ${fit.height}px`
    face.style.backgroundPosition = `${fit.x - canvasX}px ${fit.y}px`
  }
  const makeFace = (side) => {
    const face = document.createElement("span")
    face.className = `portfolio-reader__strip-face portfolio-reader__strip-face--${side}`
    const shade = document.createElement("span")
    shade.className = "portfolio-reader__strip-shade"
    const glow = document.createElement("span")
    glow.className = "portfolio-reader__strip-glow"
    face.append(shade, glow)
    return face
  }
  const buildTurn = (direction, target) => {
    const outgoing = currentSpread()
    const rect = canvas.getBoundingClientRect()
    const stripWidth = rect.width * PAGE_SPAN / STRIP_COUNT
    clearTurn()
    setImage(incomingImage, target, false)
    incomingImage.style.opacity = "1"
    currentImage.style.clipPath = direction === 1 ? "inset(0 50% 0 0)" : "inset(0 0 0 50%)"
    turnLayer.classList.add("is-active")
    turnLayer.style.setProperty("--book-width", `${rect.width}px`)
    turnLayer.style.setProperty("--page-span", String(PAGE_SPAN))
    turnLayer.style.setProperty("--strip-count", String(STRIP_COUNT))
    const curl = document.createElement("div")
    curl.className = `portfolio-reader__curl portfolio-reader__curl--${direction === 1 ? "next" : "previous"}`
    let host = curl
    const strips = []
    for (let index = 0; index < STRIP_COUNT; index += 1) {
      const strip = document.createElement("span")
      strip.className = "portfolio-reader__strip"
      if (index === STRIP_COUNT - 1) strip.classList.add("is-edge")
      const front = makeFace("front")
      const back = makeFace("back")
      const outgoingX = direction === 1 ? rect.width / 2 + index * stripWidth : rect.width / 2 - (index + 1) * stripWidth
      const incomingX = direction === 1 ? rect.width / 2 - (index + 1) * stripWidth : rect.width / 2 + index * stripWidth
      styleFace(front, outgoing, outgoingX, rect)
      styleFace(back, target, incomingX, rect)
      strip.append(front, back)
      host.append(strip)
      host = strip
      strips.push(strip)
    }
    turnLayer.append(curl)
    return { direction, target, outgoing, curl, strips, progress: 0, velocity: 0 }
  }
  const paintTurn = (turn, progress) => {
    turn.progress = progress
    const visibleProgress = clamp(progress, -.035, 1.035)
    const theta = Math.PI * visibleProgress
    const curve = CURL_PEAK * Math.sin(Math.PI * visibleProgress)
    const headAngle = theta + curve
    const segmentAngle = 2 * curve / STRIP_COUNT
    const degrees = 180 / Math.PI
    turn.curl.style.transform = `rotateY(${(turn.direction === 1 ? -1 : 1) * headAngle * degrees}deg)`
    turn.curl.style.setProperty("--segment-angle", `${segmentAngle * degrees}deg`)
    turn.curl.style.setProperty("--turn-shade", String(Math.abs(Math.sin(Math.PI * visibleProgress))))
    turn.strips.forEach((strip, index) => {
      const nearLight = Math.abs(Math.cos(headAngle - index * segmentAngle))
      const farLight = Math.abs(Math.cos(headAngle - (index + 1) * segmentAngle))
      strip.style.setProperty("--strip-light", nearLight.toFixed(3))
      strip.style.setProperty("--shade-near", ((1 - nearLight) * .58).toFixed(3))
      strip.style.setProperty("--shade-far", ((1 - farLight) * .58).toFixed(3))
    })
  }
  const finishTurn = (turn, committed) => {
    if (committed) state.pages[state.book] += turn.direction
    state.turning = false
    state.pointer = null
    setImage(currentImage, currentSpread(), true)
    clearTurn()
    root.classList.remove("is-turning")
    render(false)
  }
  const springTo = (turn, target, initialVelocity) => {
    if (reducedMotion.matches) { finishTurn(turn, target === 1); return }
    let velocity = initialVelocity || 0
    let last = performance.now()
    const stiffness = target === 1 ? 170 : 150
    const damping = target === 1 ? 26 : 24
    const frame = (now) => {
      const dt = Math.min(.032, Math.max(.001, (now - last) / 1000))
      last = now
      const displacement = turn.progress - target
      velocity += (-stiffness * displacement - damping * velocity) * dt
      turn.progress += velocity * dt
      paintTurn(turn, turn.progress)
      if (Math.abs(turn.progress - target) < .002 && Math.abs(velocity) < .02) {
        turn.progress = target
        paintTurn(turn, target)
        state.animation = null
        finishTurn(turn, target === 1)
      } else {
        state.animation = requestAnimationFrame(frame)
      }
    }
    state.animation = requestAnimationFrame(frame)
  }
  const startTurn = async (direction) => {
    const target = spreads[state.book][pageIndex() + direction]
    if (state.turning || !target) return null
    state.turning = true
    root.classList.add("is-turning")
    reader.classList.add("is-loading")
    easeLoupeAside(direction)
    const ready = await loadSpread(target)
    reader.classList.remove("is-loading")
    if (!ready) {
      state.turning = false
      root.classList.remove("is-turning")
      fallback.hidden = false
      fallback.textContent = t("This board could not be loaded. Please try again.", "这张图面无法加载，请重试。")
      return null
    }
    if (reducedMotion.matches) {
      state.pages[state.book] += direction
      state.turning = false
      root.classList.remove("is-turning")
      render(true)
      return null
    }
    const turn = buildTurn(direction, target)
    paintTurn(turn, 0)
    return turn
  }
  const step = async (direction) => {
    const turn = await startTurn(direction)
    if (turn) springTo(turn, 1, 0)
  }
  const selectBook = (book, focusReader) => {
    if (!books[book] || state.turning) return
    state.book = book
    clearTurn()
    setImage(currentImage, currentSpread(), true)
    render(false)
    if (focusReader) {
      reader.scrollIntoView({ behavior: reducedMotion.matches ? "auto" : "smooth", block: "start" })
      window.setTimeout(() => reader.focus({ preventScroll: true }), reducedMotion.matches ? 0 : 420)
    }
  }

  coverButtons.forEach((button) => button.addEventListener("click", () => selectBook(button.dataset.bookSelect, true)))
  document.querySelectorAll("[data-book-jump]").forEach((link) => link.addEventListener("click", () => selectBook(link.dataset.bookJump, false)))
  previous.addEventListener("click", () => step(-1))
  next.addEventListener("click", () => step(1))
  reader.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft") { event.preventDefault(); step(-1) }
    if (event.key === "ArrowRight") { event.preventDefault(); step(1) }
  })

  canvas.addEventListener("pointerdown", async (event) => {
    if (event.button !== 0 || state.turning) return
    event.preventDefault()
    const rect = canvas.getBoundingClientRect()
    const direction = event.clientX > rect.left + rect.width / 2 ? 1 : -1
    const pointer = {
      id: event.pointerId,
      x0: event.clientX,
      lastX: event.clientX,
      direction,
      width: rect.width,
      moved: 0,
      velocity: 0,
      previousProgress: 0,
      previousTime: performance.now(),
      turn: null,
      released: false,
    }
    state.pointer = pointer
    canvas.setPointerCapture(event.pointerId)
    const turn = await startTurn(direction)
    if (!turn || state.pointer !== pointer) { if (state.pointer === pointer) state.pointer = null; return }
    pointer.turn = turn
    const delta = pointer.lastX - pointer.x0
    const progress = clamp((direction === 1 ? -delta : delta) / (pointer.width * .62), 0, 1)
    paintTurn(turn, progress)
    if (pointer.released) {
      state.pointer = null
      const commit = pointer.moved < 6 || progress > .42 || pointer.velocity > 1.1
      springTo(turn, commit ? 1 : 0, pointer.velocity)
    }
  })
  canvas.addEventListener("pointermove", (event) => {
    if (!state.pointer || event.pointerId !== state.pointer.id) {
      if (state.turning) return
      const rect = stage.getBoundingClientRect()
      const x = (event.clientX - rect.left) / rect.width - .5
      const y = (event.clientY - rect.top) / rect.height - .5
      tilt.style.setProperty("--tilt-x", `${clamp(-y * 2.2, -1.4, 1.4)}deg`)
      tilt.style.setProperty("--tilt-y", `${clamp(x * 2.6, -1.7, 1.7)}deg`)
      return
    }
    const pointer = state.pointer
    pointer.lastX = event.clientX
    const delta = event.clientX - pointer.x0
    pointer.moved = Math.max(pointer.moved, Math.abs(delta))
    const progress = clamp((pointer.direction === 1 ? -delta : delta) / (pointer.width * .62), 0, 1)
    const now = performance.now()
    pointer.velocity = (progress - pointer.previousProgress) / Math.max(.001, (now - pointer.previousTime) / 1000)
    pointer.previousProgress = progress
    pointer.previousTime = now
    if (pointer.turn) paintTurn(pointer.turn, progress)
  })
  const endPointerTurn = (event) => {
    if (!state.pointer || event.pointerId !== state.pointer.id) return
    const pointer = state.pointer
    if (canvas.hasPointerCapture(event.pointerId)) canvas.releasePointerCapture(event.pointerId)
    if (!pointer.turn) { pointer.released = true; return }
    state.pointer = null
    const commit = pointer.moved < 6 || pointer.turn.progress > .42 || pointer.velocity > 1.1
    springTo(pointer.turn, commit ? 1 : 0, pointer.velocity)
  }
  canvas.addEventListener("pointerup", endPointerTurn)
  canvas.addEventListener("pointercancel", endPointerTurn)
  canvas.addEventListener("dragstart", (event) => event.preventDefault())
  stage.addEventListener("pointerleave", () => {
    if (!state.pointer && !state.turning) {
      tilt.style.setProperty("--tilt-x", "0deg")
      tilt.style.setProperty("--tilt-y", "0deg")
    }
  })

  loupeToggle.addEventListener("click", () => { state.loupeOn = !state.loupeOn; updateLoupeState() })
  loupe.addEventListener("pointerdown", (event) => {
    if (!finePointer.matches || event.button !== 0) return
    event.preventDefault()
    event.stopPropagation()
    state.loupeTarget = null
    loupe.setPointerCapture(event.pointerId)
    state.loupeDrag = { id: event.pointerId, clientX: event.clientX, clientY: event.clientY, x: state.loupeX, y: state.loupeY }
  })
  loupe.addEventListener("pointermove", (event) => {
    if (!state.loupeDrag || event.pointerId !== state.loupeDrag.id) return
    const rect = canvas.getBoundingClientRect()
    state.loupeX = clamp(state.loupeDrag.x + (event.clientX - state.loupeDrag.clientX) / rect.width, -.04, 1.04)
    state.loupeY = clamp(state.loupeDrag.y + (event.clientY - state.loupeDrag.clientY) / rect.height, -.08, 1.08)
    updateLoupe()
  })
  const endLoupeDrag = (event) => { if (state.loupeDrag && event.pointerId === state.loupeDrag.id) state.loupeDrag = null }
  loupe.addEventListener("pointerup", endLoupeDrag)
  loupe.addEventListener("pointercancel", endLoupeDrag)
  window.addEventListener("resize", updateLoupe)
  finePointer.addEventListener("change", updateLoupeState)
  window.addEventListener("storage", (event) => { if (["portfolioLang", "blogLang", "behopAiLang"].includes(event.key)) applyLanguage() })
  document.querySelectorAll("[data-lang]").forEach((button) => button.addEventListener("click", () => {
    const lang = button.dataset.lang === "zh" ? "zh" : "en"
    try {
      localStorage.setItem("portfolioLang", lang)
      localStorage.setItem("blogLang", lang)
      localStorage.setItem("behopAiLang", lang)
    } catch (error) {
      // The reader can still switch for this visit when storage is unavailable.
    }
    document.querySelectorAll("[data-lang]").forEach((item) => item.classList.toggle("is-active", item.dataset.lang === lang))
    applyLanguage()
  }))

  setImage(currentImage, currentSpread(), true)
  applyLanguage()
})()
