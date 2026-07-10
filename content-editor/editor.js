const state = {
  bootstrap: null,
  csrfToken: "",
  schema: null,
  type: "site-settings",
  records: [],
  currentId: null,
  current: null,
  mode: "structured",
  activeSection: null,
  dirty: false,
  valid: false,
  search: "",
  previewLang: "en",
  publishToken: null,
  pendingMedia: {},
}

const typeTabs = document.querySelector("#type-tabs")
const listEl = document.querySelector("#record-list")
const recordCount = document.querySelector("#record-count")
const searchInput = document.querySelector("#record-search")
const formEl = document.querySelector("#content-form")
const statusEl = document.querySelector("#status")
const saveState = document.querySelector("#save-state")
const validationState = document.querySelector("#validation-state")
const saveButton = document.querySelector("#save-button")
const refreshButton = document.querySelector("#refresh-button")
const newButton = document.querySelector("#new-button")
const duplicateButton = document.querySelector("#duplicate-button")
const deleteButton = document.querySelector("#delete-button")
const historyButton = document.querySelector("#history-button")
const publishButton = document.querySelector("#publish-button")
const confirmPublishButton = document.querySelector("#confirm-publish-button")
const currentTitle = document.querySelector("#current-title")
const currentType = document.querySelector("#current-type")
const previewFrame = document.querySelector("#preview-frame")
const previewLink = document.querySelector("#preview-link")
const previewHealth = document.querySelector("#preview-health")
const modeButtons = document.querySelectorAll("[data-mode]")
const previewLangButtons = document.querySelectorAll("[data-preview-lang]")
const sectionNav = document.querySelector("#section-nav")
const previewShortcuts = document.querySelector("#preview-shortcuts")
const publishSummary = document.querySelector("#publish-summary")
const historyDialog = document.querySelector("#history-dialog")
const historyList = document.querySelector("#history-list")
const publishDialog = document.querySelector("#publish-dialog")
const publishFiles = document.querySelector("#publish-files")
const commitMessage = document.querySelector("#commit-message")

function typeSchema(type = state.type) {
  return state.schema?.types?.[type] || null
}

function setStatus(message, isError = false) {
  statusEl.textContent = message || ""
  statusEl.classList.toggle("is-error", isError)
}

function setSaveState(label, kind = "") {
  saveState.textContent = label
  saveState.classList.toggle("is-ready", kind === "ready")
  saveState.classList.toggle("is-error", kind === "error")
}

function setValidation(errors = []) {
  state.valid = errors.length === 0
  validationState.textContent = state.valid ? "内容校验通过" : `${errors.length} 项需要处理`
  validationState.classList.toggle("is-ready", state.valid)
  validationState.classList.toggle("is-error", !state.valid)
  validationState.title = errors.join("\n")
  return errors
}

async function api(path, options = {}) {
  const timeoutMs = options.timeoutMs || 20000
  const controller = new AbortController()
  const timeout = window.setTimeout(() => controller.abort(), timeoutMs)
  const headers = new Headers(options.headers || {})
  if (options.method && options.method !== "GET") {
    headers.set("X-CSRF-Token", state.csrfToken)
  }
  try {
    const response = await fetch(path, { ...options, headers, signal: controller.signal })
    const text = await response.text()
    const payload = text ? JSON.parse(text) : {}
    if (!response.ok) throw new Error(payload.error || `Request failed: ${response.status}`)
    return payload
  } catch (error) {
    if (error.name === "AbortError") throw new Error("请求超时，请确认本地服务仍在运行。")
    throw error
  } finally {
    window.clearTimeout(timeout)
  }
}

function previewBase() {
  return state.bootstrap?.preview_url || "http://127.0.0.1:4001"
}

function normalizePath(path) {
  if (!path) return ""
  if (/^https?:\/\//.test(path)) return path
  return `${previewBase()}${path.startsWith("/") ? path : `/${path}`}`
}

function getByPath(value, path) {
  if (!path) return value
  return path.split(".").reduce((cursor, part) => {
    if (cursor == null) return undefined
    return Array.isArray(cursor) && /^\d+$/.test(part) ? cursor[Number(part)] : cursor[part]
  }, value)
}

function setByPath(value, path, next) {
  const parts = path.split(".")
  let cursor = value
  parts.slice(0, -1).forEach((part) => {
    const numeric = /^\d+$/.test(part)
    if (Array.isArray(cursor) && numeric) {
      cursor = cursor[Number(part)]
    } else {
      if (cursor[part] == null) cursor[part] = {}
      cursor = cursor[part]
    }
  })
  const last = parts[parts.length - 1]
  if (Array.isArray(cursor) && /^\d+$/.test(last)) cursor[Number(last)] = next
  else cursor[last] = next
}

function deleteByPath(value, path) {
  const parts = path.split(".")
  const key = parts.pop()
  const parent = getByPath(value, parts.join("."))
  if (Array.isArray(parent) && /^\d+$/.test(key)) parent.splice(Number(key), 1)
  else if (parent && key) delete parent[key]
}

function blankValueFor(field) {
  if (field.type === "array") return []
  if (field.type === "object") return {}
  if (field.type === "boolean") return false
  if (field.type === "number") return 0
  return ""
}

function ensureFieldValue(field) {
  let value = getByPath(state.current.data, field.path)
  if (typeof value === "undefined") {
    value = blankValueFor(field)
    setByPath(state.current.data, field.path, value)
  }
  return value
}

function markDirty() {
  state.dirty = true
  saveButton.disabled = false
  setSaveState("有未保存修改", "error")
  validateCurrent()
}

function isBlank(value) {
  return value == null || value === "" || (Array.isArray(value) && value.length === 0)
}

function validateCurrent() {
  if (!state.current) return setValidation(["尚未选择内容"])
  const errors = []
  const schema = typeSchema()
  const hiddenDraft = state.current.data?.visibility === "hidden"
  if (!hiddenDraft) {
    ;(schema.required || []).forEach((path) => {
      if (isBlank(getByPath(state.current.data, path))) errors.push(`缺少必填字段：${path}`)
    })
  }
  if (state.type === "blog") {
    const zhCount = (state.current.body?.zh || "").split("\n").filter((line) => /^##\s+/.test(line)).length
    const enCount = (state.current.body?.en || "").split("\n").filter((line) => /^##\s+/.test(line)).length
    if (zhCount !== enCount) errors.push(`中英文二级章节数量不一致：${zhCount} / ${enCount}`)
  }
  return setValidation(errors)
}

function fieldLabel(path) {
  return path.split(".").map((part) => /^\d+$/.test(part) ? `#${Number(part) + 1}` : part.replaceAll("_", " ")).join(" / ")
}

function imageField(path, value, meta = {}) {
  const wrapper = document.createElement("div")
  wrapper.className = "image-field"
  const label = document.createElement("label")
  label.textContent = meta.label || fieldLabel(path)
  wrapper.appendChild(label)

  if (value) {
    const img = document.createElement("img")
    img.alt = meta.label || fieldLabel(path)
    img.src = state.pendingMedia[value]?.previewUrl || normalizePath(value)
    wrapper.appendChild(img)
  }

  const actions = document.createElement("div")
  actions.className = "image-actions"
  const input = document.createElement("input")
  input.type = "file"
  input.accept = "image/jpeg,image/png,image/webp,image/gif"
  input.multiple = false
  input.hidden = true
  const upload = document.createElement("button")
  upload.type = "button"
  upload.textContent = value ? "替换图片" : "上传图片"
  upload.addEventListener("click", () => input.click())
  input.addEventListener("change", async () => {
    const file = input.files?.[0]
    if (!file) return
    upload.disabled = true
    upload.textContent = "正在上传…"
    try {
      const body = new FormData()
      body.append("field", path)
      body.append("file", file)
      const result = await api(`/api/media/${state.type}/${state.currentId}`, { method: "POST", body, timeoutMs: 70000 })
      state.pendingMedia[result.path] = { token: result.draft_token, previewUrl: result.preview_url }
      setByPath(state.current.data, path, result.path)
      markDirty()
      renderForm()
      setStatus(`图片已进入当前草稿：${result.path}`)
    } catch (error) {
      setStatus(error.message, true)
    } finally {
      upload.disabled = false
      upload.textContent = value ? "替换图片" : "上传图片"
    }
  })
  const pathText = document.createElement("span")
  pathText.className = "image-path"
  pathText.textContent = value || "尚未选择图片"
  actions.append(upload, input, pathText)
  wrapper.appendChild(actions)
  return wrapper
}

function scalarField(path, value, meta = {}) {
  if (meta.type === "image") return imageField(path, value, meta)
  const wrapper = document.createElement("div")
  wrapper.className = "field"
  const label = document.createElement("label")
  label.textContent = meta.label || fieldLabel(path)
  let input
  if (meta.type === "textarea" || (typeof value === "string" && (value.length > 100 || value.includes("\n")))) {
    input = document.createElement("textarea")
  } else if (meta.type === "select") {
    input = document.createElement("select")
    ;(meta.options || []).forEach((item) => {
      const option = document.createElement("option")
      option.value = item
      option.textContent = item
      option.selected = item === value
      input.appendChild(option)
    })
  } else {
    input = document.createElement("input")
    input.type = meta.type === "email" ? "email" : meta.type === "date" ? "date" : "text"
  }
  input.value = meta.type === "date" && value ? String(value).slice(0, 10) : value == null ? "" : value
  input.addEventListener("input", () => {
    setByPath(state.current.data, path, input.value)
    markDirty()
  })
  input.addEventListener("change", () => {
    setByPath(state.current.data, path, input.value)
    markDirty()
  })
  wrapper.append(label, input)
  if (meta.help) {
    const help = document.createElement("small")
    help.textContent = meta.help
    wrapper.appendChild(help)
  }
  return wrapper
}

function booleanField(path, value, meta = {}) {
  const wrapper = document.createElement("div")
  wrapper.className = "field"
  const label = document.createElement("label")
  label.textContent = meta.label || fieldLabel(path)
  const select = document.createElement("select")
  ;[[true, "是 / true"], [false, "否 / false"]].forEach(([optionValue, text]) => {
    const option = document.createElement("option")
    option.value = String(optionValue)
    option.textContent = text
    option.selected = optionValue === value
    select.appendChild(option)
  })
  select.addEventListener("change", () => {
    setByPath(state.current.data, path, select.value === "true")
    markDirty()
  })
  wrapper.append(label, select)
  return wrapper
}

function numberField(path, value, meta = {}) {
  const wrapper = scalarField(path, value, meta)
  const input = wrapper.querySelector("input")
  if (input) {
    input.type = "number"
    input.addEventListener("input", () => {
      setByPath(state.current.data, path, input.value === "" ? "" : Number(input.value))
    })
  }
  return wrapper
}

function defaultArrayItem(path, current) {
  if (current[0] && typeof current[0] === "object") {
    return Object.fromEntries(Object.keys(current[0]).map((key) => [key, ""]))
  }
  if (/sections$/.test(path)) return { title_zh: "", title_en: "", body_zh: "", body_en: "" }
  if (/(drawings|renderings|result_gallery)$/.test(path)) return { image: "", caption_zh: "", caption_en: "" }
  return ""
}

function arrayField(path, value, meta = {}) {
  const wrapper = document.createElement("div")
  wrapper.className = "group-field"
  const title = document.createElement("div")
  title.className = "group-title"
  title.textContent = meta.label || fieldLabel(path)
  wrapper.appendChild(title)

  value.forEach((item, index) => {
    const itemPath = `${path}.${index}`
    const itemEl = document.createElement("div")
    itemEl.className = "array-item"
    const header = document.createElement("div")
    header.className = "array-header"
    const strong = document.createElement("strong")
    strong.textContent = `${meta.label || fieldLabel(path)} #${index + 1}`
    const actions = document.createElement("div")
    actions.className = "array-actions"
    const up = document.createElement("button")
    up.type = "button"
    up.textContent = "上移"
    up.disabled = index === 0
    up.addEventListener("click", () => {
      ;[value[index - 1], value[index]] = [value[index], value[index - 1]]
      markDirty(); renderForm()
    })
    const down = document.createElement("button")
    down.type = "button"
    down.textContent = "下移"
    down.disabled = index === value.length - 1
    down.addEventListener("click", () => {
      ;[value[index + 1], value[index]] = [value[index], value[index + 1]]
      markDirty(); renderForm()
    })
    const remove = document.createElement("button")
    remove.type = "button"
    remove.textContent = "删除"
    remove.className = "danger-button"
    remove.addEventListener("click", () => {
      deleteByPath(state.current.data, itemPath)
      markDirty(); renderForm()
    })
    actions.append(up, down, remove)
    header.append(strong, actions)
    itemEl.append(header, renderValue(itemPath, item, {}))
    wrapper.appendChild(itemEl)
  })

  const add = document.createElement("button")
  add.type = "button"
  add.textContent = "新增一项"
  add.addEventListener("click", () => {
    value.push(defaultArrayItem(path, value))
    markDirty(); renderForm()
  })
  wrapper.appendChild(add)
  return wrapper
}

function objectField(path, value, meta = {}) {
  const wrapper = document.createElement("div")
  wrapper.className = "group-field"
  const title = document.createElement("div")
  title.className = "group-title"
  title.textContent = meta.label || fieldLabel(path)
  wrapper.appendChild(title)
  Object.keys(value).forEach((key) => wrapper.appendChild(renderValue(`${path}.${key}`, value[key], {})))
  return wrapper
}

function renderValue(path, value, meta = {}) {
  const key = path.split(".").pop()
  if (!meta.type && typeof value === "string" && /(^|_)(image|cover|thumbnail)$/.test(key)) {
    meta = { ...meta, type: "image" }
  }
  if (Array.isArray(value)) return arrayField(path, value, meta)
  if (value && typeof value === "object") return objectField(path, value, meta)
  if (typeof value === "boolean") return booleanField(path, value, meta)
  if (typeof value === "number") return numberField(path, value, meta)
  return scalarField(path, value, meta)
}

function renderSectionNav() {
  sectionNav.innerHTML = ""
  if (state.mode !== "structured") {
    sectionNav.hidden = true
    return
  }
  const sections = typeSchema()?.sections || []
  if (!state.activeSection && sections[0]) state.activeSection = sections[0].id
  sectionNav.hidden = false
  sections.forEach((section) => {
    const button = document.createElement("button")
    button.type = "button"
    button.textContent = section.title
    button.className = section.id === state.activeSection ? "is-active" : ""
    button.addEventListener("click", () => {
      state.activeSection = section.id
      renderForm()
    })
    sectionNav.appendChild(button)
  })
}

function renderBodyEditors() {
  if (typeof state.current.body === "undefined") return
  const wrapper = document.createElement("div")
  wrapper.className = "group-field body-editor-grid"
  const title = document.createElement("div")
  title.className = "group-title"
  title.textContent = state.type === "blog" ? "Markdown 正文" : "Markdown body / 详情页补充"
  wrapper.appendChild(title)
  if (state.type === "blog") {
    ;[["zh", "中文正文"], ["en", "English body"]].forEach(([lang, labelText]) => {
      const field = document.createElement("div")
      field.className = "field"
      const label = document.createElement("label")
      label.textContent = labelText
      const textarea = document.createElement("textarea")
      textarea.value = state.current.body?.[lang] || ""
      textarea.addEventListener("input", () => {
        state.current.body[lang] = textarea.value
        markDirty()
      })
      field.append(label, textarea)
      wrapper.appendChild(field)
    })
  } else {
    const textarea = document.createElement("textarea")
    textarea.value = state.current.body || ""
    textarea.addEventListener("input", () => {
      state.current.body = textarea.value
      markDirty()
    })
    wrapper.appendChild(textarea)
  }
  formEl.appendChild(wrapper)
}

function renderStructured() {
  const sections = typeSchema()?.sections || []
  if (!sections.some((section) => section.id === state.activeSection)) state.activeSection = sections[0]?.id || null
  renderSectionNav()
  const section = sections.find((item) => item.id === state.activeSection)
  if (section) {
    const card = document.createElement("section")
    card.className = "editor-section-card"
    const header = document.createElement("div")
    header.className = "section-heading"
    const title = document.createElement("h3")
    title.textContent = section.title
    const desc = document.createElement("p")
    desc.textContent = section.description || ""
    header.append(title, desc)
    card.appendChild(header)
    ;(section.fields || []).forEach((field) => card.appendChild(renderValue(field.path, ensureFieldValue(field), field)))
    formEl.appendChild(card)
  }
  renderBodyEditors()
}

function renderAdvanced() {
  sectionNav.hidden = true
  const wrapper = document.createElement("div")
  wrapper.className = "field"
  const label = document.createElement("label")
  label.textContent = "高级 JSON / Markdown 数据"
  const textarea = document.createElement("textarea")
  textarea.className = "advanced-editor"
  textarea.value = JSON.stringify({ data: state.current.data, body: state.current.body }, null, 2)
  textarea.addEventListener("input", () => {
    try {
      const parsed = JSON.parse(textarea.value)
      state.current.data = parsed.data || {}
      state.current.body = parsed.body
      markDirty()
      setStatus("高级数据格式有效。")
    } catch (error) {
      setValidation(["高级 JSON 格式无效"])
      setStatus(`高级 JSON 格式错误：${error.message}`, true)
    }
  })
  wrapper.append(label, textarea)
  formEl.appendChild(wrapper)
}

function renderForm() {
  formEl.innerHTML = ""
  if (!state.current) return
  if (state.mode === "structured") renderStructured()
  else renderAdvanced()
  validateCurrent()
}

function recordMatches(record) {
  const haystack = [record.title_zh, record.title_en, record.id, record.year, record.visibility, record.status].filter(Boolean).join(" ").toLowerCase()
  return haystack.includes(state.search.toLowerCase())
}

function renderRecords() {
  listEl.innerHTML = ""
  const records = state.records.filter(recordMatches)
  recordCount.textContent = `${records.length} 项`
  records.forEach((record) => {
    const button = document.createElement("button")
    button.type = "button"
    button.className = `record${record.id === state.currentId ? " is-active" : ""}`
    button.addEventListener("click", () => selectRecord(record.id))
    const image = document.createElement("img")
    image.alt = record.title_en || record.title_zh || record.id
    image.src = normalizePath(record.image || "/img/profile-small.png")
    const text = document.createElement("span")
    const title = document.createElement("span")
    title.className = "record-title"
    title.textContent = record.title_zh || record.title_en || record.id
    const meta = document.createElement("span")
    meta.className = "record-meta"
    meta.textContent = [record.year, record.visibility, record.status].filter(Boolean).join(" · ") || record.id
    text.append(title, meta)
    button.append(image, text)
    listEl.appendChild(button)
  })
}

function renderTypeTabs() {
  typeTabs.innerHTML = ""
  Object.entries(state.schema.types).forEach(([type, schema]) => {
    const button = document.createElement("button")
    button.type = "button"
    button.className = `tab${type === state.type ? " is-active" : ""}`
    button.textContent = schema.label_zh || schema.label || type
    button.addEventListener("click", () => switchType(type))
    typeTabs.appendChild(button)
  })
}

function shortcutLinks() {
  const base = previewBase()
  return [
    ["当前详情", previewLink.href || `${base}/`],
    ["首页", `${base}/`],
    ["AI Tools", `${base}/behop-ai-product/`],
    ["Works", `${base}/works/`],
    ["Archive", `${base}/works/archive/`],
    ["Blog", `${base}/blog/en/`],
    ["About", `${base}/about/`],
  ]
}

function renderPreviewShortcuts() {
  previewShortcuts.innerHTML = ""
  shortcutLinks().forEach(([label, url]) => {
    const button = document.createElement("button")
    button.type = "button"
    button.textContent = label
    button.addEventListener("click", () => {
      previewFrame.src = `${url}${url.includes("?") ? "&" : "?"}editor=${Date.now()}`
      previewLink.href = url
    })
    previewShortcuts.appendChild(button)
  })
}

async function updatePreview(cacheBust = false) {
  if (!state.currentId) return
  try {
    const payload = await api(`/api/preview-url/${state.type}/${state.currentId}`)
    previewFrame.src = cacheBust ? `${payload.url}${payload.url.includes("?") ? "&" : "?"}editor=${Date.now()}` : payload.url
    previewLink.href = payload.url
    renderPreviewShortcuts()
  } catch (error) {
    setStatus(`内容已加载，但预览地址不可用：${error.message}`, true)
  }
}

async function loadRecords(selectFirst = true) {
  setStatus("正在读取内容列表…")
  const payload = await api(`/api/content/${state.type}`)
  state.records = payload.records || []
  const exists = state.records.some((record) => record.id === state.currentId)
  if (!exists) state.currentId = selectFirst ? state.records[0]?.id || null : null
  renderRecords()
  if (state.currentId) await loadRecord(state.currentId)
  else {
    state.current = null
    currentTitle.textContent = "暂无内容"
    formEl.innerHTML = ""
  }
}

async function loadRecord(id) {
  state.currentId = id
  state.activeSection = null
  const payload = await api(`/api/content/${state.type}/${id}`)
  state.current = payload
  state.dirty = false
  saveButton.disabled = true
  duplicateButton.disabled = Boolean(typeSchema()?.singleton)
  deleteButton.disabled = Boolean(typeSchema()?.singleton)
  historyButton.disabled = false
  currentType.textContent = typeSchema()?.label || state.type
  currentTitle.textContent = payload.data?.title_zh || payload.data?.zh?.title || payload.data?.title_en || payload.data?.en?.title || id
  setSaveState("已保存到本地", "ready")
  renderRecords()
  renderForm()
  await updatePreview()
  setStatus("内容已加载。")
}

async function discardPendingMedia() {
  const paths = Object.keys(state.pendingMedia)
  for (const path of paths) {
    await api(`/api/media/${state.type}/${state.currentId}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ path }),
    })
  }
  state.pendingMedia = {}
}

async function confirmDiscard(message) {
  if (!state.dirty) return true
  if (!window.confirm(message)) return false
  await discardPendingMedia()
  state.dirty = false
  return true
}

async function selectRecord(id) {
  if (!await confirmDiscard("当前内容尚未保存，确定切换吗？")) return
  await loadRecord(id).catch((error) => setStatus(error.message, true))
}

async function switchType(type) {
  if (type === state.type) return
  if (!await confirmDiscard("当前内容尚未保存，确定切换类型吗？")) return
  state.type = type
  state.currentId = null
  state.current = null
  state.activeSection = null
  state.search = ""
  searchInput.value = ""
  renderTypeTabs()
  newButton.disabled = Boolean(typeSchema()?.singleton)
  await loadRecords()
}

async function saveCurrent() {
  if (!state.current) return
  const errors = validateCurrent()
  if (errors.length) {
    setStatus(errors.join("；"), true)
    return
  }
  setStatus("正在保存到本地…")
  const payload = await api(`/api/content/${state.type}/${state.currentId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(state.current),
  })
  state.current = payload
  state.pendingMedia = {}
  state.dirty = false
  saveButton.disabled = true
  setSaveState("已保存到本地", "ready")
  await loadRecords(false)
  state.currentId = payload.id
  state.current = payload
  renderRecords()
  renderForm()
  await updatePreview(true)
  await refreshBootstrapStatus()
  setStatus("保存成功，预览会在 Jekyll 自动重建后更新。")
}

async function createNew(prefill = null) {
  if (typeSchema()?.singleton) return
  const suggestion = state.type === "blog" ? "new-post" : "new-item"
  const rawId = window.prompt("请输入英文 slug（小写字母、数字和连字符）", suggestion)
  if (!rawId) return
  const payload = { id: rawId }
  if (prefill) {
    payload.data = structuredClone(prefill.data)
    payload.body = structuredClone(prefill.body)
  }
  const created = await api(`/api/content/${state.type}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  })
  state.currentId = created.id
  await loadRecords(false)
  await loadRecord(created.id)
  setStatus(prefill ? "副本已创建，请修改标题和内容。" : "草稿已创建。")
}

async function deleteCurrent() {
  if (!state.current || typeSchema()?.singleton) return
  if (!window.confirm(`确定将 ${state.currentId} 移入本地回收站吗？`)) return
  await discardPendingMedia()
  state.dirty = false
  await api(`/api/content/${state.type}/${state.currentId}`, { method: "DELETE" })
  state.currentId = null
  state.current = null
  await loadRecords()
  await refreshBootstrapStatus()
  setStatus("内容已移入本地回收站，可通过历史快照恢复。")
}

async function openHistory() {
  if (!state.currentId) return
  const payload = await api(`/api/history/${state.type}/${state.currentId}`)
  historyList.innerHTML = ""
  const records = payload.records || []
  if (!records.length) historyList.textContent = "还没有历史快照。"
  records.forEach((record) => {
    const item = document.createElement("div")
    item.className = "history-item"
    const info = document.createElement("div")
    const time = document.createElement("strong")
    time.textContent = new Date(record.created_at).toLocaleString()
    const path = document.createElement("code")
    path.textContent = record.original
    info.append(time, document.createElement("br"), path)
    const restore = document.createElement("button")
    restore.type = "button"
    restore.textContent = "恢复"
    restore.addEventListener("click", async () => {
      if (!window.confirm("恢复会覆盖当前本地内容，并先创建新的快照。继续吗？")) return
      await discardPendingMedia()
      const restored = await api(`/api/history/${state.type}/${state.currentId}/restore`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: record.token }),
      })
      state.current = restored
      state.dirty = false
      renderForm()
      await updatePreview(true)
      historyDialog.close()
      setStatus("历史版本已恢复。")
    })
    item.append(info, restore)
    historyList.appendChild(item)
  })
  historyDialog.showModal()
}

async function refreshBootstrapStatus() {
  const bootstrap = await api("/api/bootstrap")
  state.bootstrap = bootstrap
  state.csrfToken = bootstrap.csrf_token
  previewHealth.textContent = bootstrap.preview_healthy ? "预览运行中" : "预览未启动"
  previewHealth.classList.toggle("is-healthy", bootstrap.preview_healthy)
  previewHealth.classList.toggle("is-error", !bootstrap.preview_healthy)
  const changed = bootstrap.git?.session_changed || []
  publishSummary.textContent = changed.length ? `本次会话有 ${changed.length} 个文件待发布。` : "当前会话没有待发布内容。"
  publishButton.disabled = changed.length === 0
  return bootstrap
}

async function startPublish() {
  publishButton.disabled = true
  publishButton.textContent = "正在构建和检查…"
  try {
    const result = await api("/api/publish/preflight", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
      timeoutMs: 180000,
    })
    state.publishToken = result.token
    publishFiles.innerHTML = ""
    result.paths.forEach((path) => {
      const li = document.createElement("li")
      li.textContent = path
      publishFiles.appendChild(li)
    })
    publishDialog.showModal()
    setStatus("发布检查通过，请复核文件并二次确认。")
  } catch (error) {
    setStatus(`发布被阻止：${error.message}`, true)
  } finally {
    publishButton.disabled = false
    publishButton.textContent = "检查并发布"
  }
}

async function confirmPublish() {
  if (!state.publishToken) return
  confirmPublishButton.disabled = true
  confirmPublishButton.textContent = "正在提交并推送…"
  try {
    const result = await api("/api/publish/confirm", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token: state.publishToken, commit_message: commitMessage.value }),
      timeoutMs: 180000,
    })
    state.publishToken = null
    publishDialog.close()
    await refreshBootstrapStatus()
    setStatus(`发布成功：${result.commit.slice(0, 12)}。GitHub Pages 正在部署。`)
  } catch (error) {
    setStatus(`推送失败：${error.message}`, true)
  } finally {
    confirmPublishButton.disabled = false
    confirmPublishButton.textContent = "二次确认并推送"
  }
}

function bindEvents() {
  searchInput.addEventListener("input", () => {
    state.search = searchInput.value
    renderRecords()
  })
  refreshButton.addEventListener("click", async () => {
    if (!await confirmDiscard("当前内容尚未保存，确定刷新吗？")) return
    loadRecords().catch((error) => setStatus(error.message, true))
  })
  newButton.addEventListener("click", async () => {
    if (!await confirmDiscard("当前内容尚未保存，确定新建内容吗？")) return
    createNew().catch((error) => setStatus(error.message, true))
  })
  duplicateButton.addEventListener("click", () => {
    if (state.dirty) {
      setStatus("复制前请先保存当前内容。", true)
      return
    }
    createNew(state.current).catch((error) => setStatus(error.message, true))
  })
  deleteButton.addEventListener("click", () => deleteCurrent().catch((error) => setStatus(error.message, true)))
  historyButton.addEventListener("click", () => openHistory().catch((error) => setStatus(error.message, true)))
  saveButton.addEventListener("click", () => saveCurrent().catch((error) => setStatus(error.message, true)))
  publishButton.addEventListener("click", startPublish)
  confirmPublishButton.addEventListener("click", confirmPublish)
  modeButtons.forEach((button) => button.addEventListener("click", () => {
    state.mode = button.dataset.mode
    modeButtons.forEach((node) => node.classList.toggle("is-active", node === button))
    renderForm()
  }))
  previewLangButtons.forEach((button) => button.addEventListener("click", () => {
    state.previewLang = button.dataset.previewLang
    previewLangButtons.forEach((node) => node.classList.toggle("is-active", node === button))
    previewFrame.contentWindow?.postMessage({ type: "behop:set-language", lang: state.previewLang }, previewBase())
  }))
  window.addEventListener("beforeunload", (event) => {
    if (!state.dirty) return
    event.preventDefault()
    event.returnValue = ""
  })
}

async function initialize() {
  bindEvents()
  setStatus("正在初始化内容工作台…")
  const bootstrap = await refreshBootstrapStatus()
  state.schema = bootstrap.schema
  state.type = Object.keys(state.schema.types)[0]
  renderTypeTabs()
  newButton.disabled = Boolean(typeSchema()?.singleton)
  renderPreviewShortcuts()
  await loadRecords()
}

initialize().catch((error) => {
  setSaveState("初始化失败", "error")
  setStatus(error.message, true)
})
