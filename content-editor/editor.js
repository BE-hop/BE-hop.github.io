const state = {
  bootstrap: null, csrfToken: "", schema: null, type: "homepage", records: [], currentId: null,
  drafts: new Map(), dirty: new Set(), pendingMedia: {}, bindings: [], selectedKey: null,
  mode: "edit", lang: "en", activeSection: null, search: "", publishToken: null,
}

const $ = (selector) => document.querySelector(selector)
const $$ = (selector) => [...document.querySelectorAll(selector)]
const previewFrame = $("#preview-frame")
const statusEl = $("#status")
const typeTabs = $("#type-tabs")
const listEl = $("#record-list")
const formEl = $("#content-form")
const sectionNav = $("#section-nav")
const saveButton = $("#save-all-button")
const publishButton = $("#publish-button")
const contentDrawer = $("#content-drawer")
const inspectorDrawer = $("#inspector-drawer")
const markdownDialog = $("#markdown-dialog")

function keyFor(type, id) { return `${type}:${id}` }
function clone(value) { return structuredClone(value) }
function typeSchema(type = state.type) { return state.schema?.types?.[type] || null }
function previewBase() { return state.bootstrap?.preview_url || "http://127.0.0.1:4001" }
function normalizePath(path) { return !path ? "" : /^https?:/.test(path) ? path : `${previewBase()}${path.startsWith("/") ? path : `/${path}`}` }
function setStatus(message, error = false) { statusEl.textContent = message || ""; statusEl.classList.toggle("is-error", error); statusEl.hidden = !message }

async function api(path, options = {}) {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), options.timeoutMs || 20000)
  const headers = new Headers(options.headers || {})
  if (options.method && options.method !== "GET") headers.set("X-CSRF-Token", state.csrfToken)
  try {
    const response = await fetch(path, { ...options, headers, signal: controller.signal })
    const text = await response.text()
    const payload = text ? JSON.parse(text) : {}
    if (!response.ok) throw new Error(payload.error || `请求失败：${response.status}`)
    return payload
  } catch (error) {
    if (error.name === "AbortError") throw new Error("请求超时，请确认本地服务仍在运行。")
    throw error
  } finally { clearTimeout(timeout) }
}

function getByPath(value, path) {
  if (!path) return value
  return path.split(".").reduce((cursor, part) => cursor == null ? undefined : Array.isArray(cursor) && /^\d+$/.test(part) ? cursor[Number(part)] : cursor[part], value)
}

function setByPath(value, path, next) {
  const parts = path.split("."); let cursor = value
  parts.slice(0, -1).forEach((part, index) => {
    const followingIsIndex = /^\d+$/.test(parts[index + 1])
    if (Array.isArray(cursor) && /^\d+$/.test(part)) cursor = cursor[Number(part)]
    else { if (cursor[part] == null) cursor[part] = followingIsIndex ? [] : {}; cursor = cursor[part] }
  })
  const last = parts.at(-1)
  if (Array.isArray(cursor) && /^\d+$/.test(last)) cursor[Number(last)] = next
  else cursor[last] = next
}

function dirtyCurrent() {
  if (!state.currentId) return
  state.dirty.add(keyFor(state.type, state.currentId))
  updateSaveState()
}

function updateSaveState() {
  const count = state.dirty.size
  saveButton.disabled = count === 0
  saveButton.textContent = count ? `保存全部（${count}）` : "全部已保存"
}

function draft(type = state.type, id = state.currentId) { return state.drafts.get(keyFor(type, id)) }

function bindingValue(binding) {
  const content = draft(binding.type, binding.id)
  if (!content) return ""
  if (binding.body) return content.body?.[binding.lang] ?? content.body ?? ""
  return getByPath(content.data, binding.path)
}

function publicLabel(path) {
  const field = Object.values(state.schema.types).flatMap((schema) => schema.sections || []).flatMap((section) => section.fields || []).find((item) => item.path === path)
  return field?.label || path.split(".").at(-1).replaceAll("_", " ")
}

function flatten(value, path = "", output = []) {
  if (Array.isArray(value)) value.forEach((item, index) => flatten(item, `${path}.${index}`.replace(/^\./, ""), output))
  else if (value && typeof value === "object") Object.entries(value).forEach(([key, item]) => flatten(item, `${path}.${key}`.replace(/^\./, ""), output))
  else output.push({ path, value })
  return output
}

function isImagePath(path) { return /(^|\.)(image|cover|thumbnail|background_image|before_image|after_image)$/.test(path) }
function localizedPair(path, data) {
  const match = path.match(/^(.*?)(?:_)?(zh|en)$/)
  if (!match) return null
  const base = match[1].replace(/_$/, "")
  const dotted = path.endsWith(".zh") || path.endsWith(".en")
  const zhPath = dotted ? `${base}.zh` : `${base}_zh`
  const enPath = dotted ? `${base}.en` : `${base}_en`
  const zh = getByPath(data, zhPath)
  const en = getByPath(data, enPath)
  return zh !== undefined || en !== undefined ? { base, zhPath, enPath, values: { zh: zh ?? "", en: en ?? "" } } : null
}

function rebuildBindings() {
  const bindings = []
  state.drafts.forEach((content) => {
    const seen = new Set()
    flatten(content.data).forEach(({ path, value }) => {
      if (typeof value !== "string" && typeof value !== "number") return
      let pair = localizedPair(path, content.data)
      if (content.type === "blog" && /^(zh|en)\./.test(path)) {
        const field = path.replace(/^(zh|en)\./, "")
        pair = { base: field, zhPath: `zh.${field}`, enPath: `en.${field}`, values: { zh: getByPath(content.data, `zh.${field}`) ?? "", en: getByPath(content.data, `en.${field}`) ?? "" } }
      }
      if (pair) {
        const pairKey = `${content.type}:${content.id}:${pair.base}`
        if (seen.has(pairKey)) return
        seen.add(pairKey)
        bindings.push({ key: pairKey, type: content.type, id: content.id, kind: "text", localized: true, paths: { zh: pair.zhPath, en: pair.enPath }, values: pair.values, previewPath: content.preview_url })
      } else if (isImagePath(path) && String(value).startsWith("/img/")) {
        bindings.push({ key: `${content.type}:${content.id}:${path}`, type: content.type, id: content.id, path, kind: "image", value: String(value), previewValue: state.pendingMedia[value]?.previewUrl, previewPath: content.preview_url })
      } else if (String(value).trim() && !/(^|\.)(layout|visibility|category|status|order|date|author|lang|id|url)$/.test(path)) {
        bindings.push({ key: `${content.type}:${content.id}:${path}`, type: content.type, id: content.id, path, kind: "text", value: String(value), previewPath: content.preview_url })
      }
    })
    if (content.body !== undefined) {
      if (content.type === "blog") {
        ;["zh", "en"].forEach((lang) => bindings.push({ key: `${content.type}:${content.id}:body:${lang}`, type: content.type, id: content.id, body: true, lang, kind: "markdown", value: content.body?.[lang] || "", slug: content.id.replace(/^\d{4}-\d{2}-\d{2}-/, ""), previewPath: content.preview_url }))
      } else bindings.push({ key: `${content.type}:${content.id}:body`, type: content.type, id: content.id, body: true, kind: "markdown", value: content.body || "", previewPath: content.preview_url })
    }
  })
  state.bindings = bindings
  configurePreview()
}

function configurePreview() {
  previewFrame.contentWindow?.postMessage({ source: "behop-editor", type: "configure", mode: state.mode, lang: state.lang, bindings: state.bindings }, previewBase())
}

function updateBinding(binding) {
  previewFrame.contentWindow?.postMessage({ source: "behop-editor", type: "binding-value", binding }, previewBase())
}

async function ensureDraft(type, id) {
  const key = keyFor(type, id)
  if (state.drafts.has(key)) return state.drafts.get(key)
  const content = await api(`/api/content/${type}/${id}`)
  content.preview_url = (await api(`/api/preview-url/${type}/${id}`)).url.replace(previewBase(), "")
  state.drafts.set(key, content)
  return content
}

async function loadAllDrafts() {
  for (const type of Object.keys(state.schema.types)) {
    const payload = await api(`/api/content/${type}`)
    for (const record of payload.records || []) await ensureDraft(type, record.id)
  }
  rebuildBindings()
}

async function loadRecords(selectFirst = false) {
  const payload = await api(`/api/content/${state.type}`)
  state.records = payload.records || []
  if (selectFirst && !state.currentId) state.currentId = state.records[0]?.id || null
  renderRecords()
  if (state.currentId) selectRecord(state.currentId, false)
}

function renderTypeTabs() {
  typeTabs.innerHTML = ""
  Object.entries(state.schema.types).forEach(([type, schema]) => {
    const button = document.createElement("button"); button.type = "button"; button.textContent = schema.label_zh || schema.label
    button.className = type === state.type ? "is-active" : ""
    button.onclick = async () => { state.type = type; state.currentId = null; renderTypeTabs(); await loadRecords(true) }
    typeTabs.append(button)
  })
}

function renderRecords() {
  const search = state.search.toLowerCase()
  const records = state.records.filter((record) => [record.title_zh, record.title_en, record.id, record.year].filter(Boolean).join(" ").toLowerCase().includes(search))
  $("#record-count").textContent = `${records.length} 项`; listEl.innerHTML = ""
  records.forEach((record) => {
    const button = document.createElement("button"); button.type = "button"; button.className = `record${record.id === state.currentId ? " is-active" : ""}`
    const image = document.createElement("img"); image.alt = ""; image.src = normalizePath(record.image || "/img/profile-small.png")
    const text = document.createElement("span"); text.innerHTML = `<strong>${record.title_zh || record.title_en || record.id}</strong><small>${[record.year, record.visibility, record.status].filter(Boolean).join(" · ") || record.id}</small>`
    button.append(image, text); button.onclick = () => selectRecord(record.id, true); listEl.append(button)
  })
}

async function selectRecord(id, navigate = true) {
  state.currentId = id
  const content = await ensureDraft(state.type, id)
  $("#current-type").textContent = typeSchema()?.label_zh || state.type
  $("#current-title").textContent = content.data?.title_zh || content.data?.zh?.title || content.data?.title_en || content.data?.en?.title || id
  $("#duplicate-button").disabled = Boolean(typeSchema()?.singleton)
  $("#delete-button").disabled = Boolean(typeSchema()?.singleton)
  $("#history-button").disabled = false
  state.activeSection = typeSchema()?.sections?.[0]?.id || null
  renderRecords(); renderInspector()
  if (navigate) {
    const path = content.preview_url || "/"
    previewFrame.src = `${previewBase()}${path}${path.includes("?") ? "&" : "?"}editor=${Date.now()}`
    closeDrawer(contentDrawer); openDrawer(inspectorDrawer)
  }
}

function renderInspector() {
  sectionNav.innerHTML = ""; formEl.innerHTML = ""
  const content = draft(); if (!content) return
  const sections = typeSchema()?.sections || []
  sections.forEach((section) => {
    const button = document.createElement("button"); button.type = "button"; button.textContent = section.title; button.className = section.id === state.activeSection ? "is-active" : ""
    button.onclick = () => { state.activeSection = section.id; renderInspector() }; sectionNav.append(button)
  })
  const section = sections.find((item) => item.id === state.activeSection)
  ;(section?.fields || []).forEach((field) => formEl.append(renderField(field.path, getByPath(content.data, field.path), field)))
  if (section === sections.at(-1)) {
    const known = new Set(sections.flatMap((item) => item.fields || []).map((field) => field.path))
    const extraKeys = Object.keys(content.data || {}).filter((path) => !known.has(path) && !["layout"].includes(path))
    if (extraKeys.length) {
      const details = document.createElement("details"); details.className = "extra-settings"
      const summary = document.createElement("summary"); summary.textContent = "更多页面设置"; details.append(summary)
      extraKeys.forEach((path) => details.append(renderField(path, content.data[path], {})))
      formEl.append(details)
    }
  }
  if (content.body !== undefined) {
    const button = document.createElement("button"); button.type = "button"; button.className = "wide-button"; button.textContent = "编辑 Markdown 正文"; button.onclick = openMarkdown; formEl.append(button)
  }
}

function renderField(path, value, meta = {}) {
  const wrapper = document.createElement("label"); wrapper.className = "field"; const caption = document.createElement("span"); caption.textContent = meta.label || publicLabel(path); wrapper.append(caption)
  if (Array.isArray(value) || value && typeof value === "object") {
    const textarea = document.createElement("textarea"); textarea.value = JSON.stringify(value, null, 2); textarea.rows = Math.min(12, textarea.value.split("\n").length + 1)
    textarea.onchange = () => { try { setByPath(draft().data, path, JSON.parse(textarea.value)); dirtyCurrent(); rebuildBindings(); setStatus("") } catch (_) { setStatus("列表格式无效，请检查标点。", true) } }
    wrapper.append(textarea); return wrapper
  }
  let input
  if (meta.type === "boolean") { input = document.createElement("select"); [[true, "是"], [false, "否"]].forEach(([item, label]) => { const option = new Option(label, String(item)); option.selected = item === value; input.add(option) }) }
  else if (meta.type === "select") { input = document.createElement("select"); (meta.options || []).forEach((item) => input.add(new Option(item, item, false, item === value))) }
  else if (meta.type === "textarea") input = document.createElement("textarea")
  else { input = document.createElement("input"); input.type = meta.type === "number" ? "number" : meta.type === "date" ? "date" : "text" }
  input.value = value == null ? "" : value
  input.oninput = () => { const next = meta.type === "boolean" ? input.value === "true" : meta.type === "number" ? Number(input.value) : input.value; setByPath(draft().data, path, next); dirtyCurrent(); rebuildBindings() }
  wrapper.append(input); return wrapper
}

function selectedBinding() { return state.bindings.find((binding) => binding.key === state.selectedKey) }
function showSelection(binding) {
  state.selectedKey = binding?.key || null
  $("#selection-tools").hidden = !binding
  if (!binding) return
  state.type = binding.type; state.currentId = binding.id; renderTypeTabs(); loadRecords(false); selectRecord(binding.id, false)
  $("#selection-label").textContent = binding.kind === "image" ? "已选择图片" : binding.kind === "markdown" ? "已选择正文" : "已选择文字"
  $("#image-tools").hidden = binding.kind !== "image"; $("#markdown-button").hidden = binding.kind !== "markdown"
  openDrawer(inspectorDrawer)
}

function applyTextChange(binding, value, syncPreview = false) {
  const content = draft(binding.type, binding.id); if (!content) return
  if (binding.localized) { const path = binding.paths[state.lang]; setByPath(content.data, path, value); binding.values[state.lang] = value }
  else { setByPath(content.data, binding.path, value); binding.value = value }
  state.dirty.add(keyFor(binding.type, binding.id)); updateSaveState()
  if (syncPreview) updateBinding(binding)
}

async function uploadSelectedImage(file) {
  const binding = selectedBinding(); if (!binding || binding.kind !== "image" || !file) return
  const body = new FormData(); body.append("field", binding.path); body.append("file", file, file.name || `clipboard-${Date.now()}.png`)
  setStatus("正在处理图片…")
  const result = await api(`/api/media/${binding.type}/${binding.id}`, { method: "POST", body, timeoutMs: 70000 })
  state.pendingMedia[result.path] = { token: result.draft_token, previewUrl: `${location.origin}${result.preview_url}` }
  const content = draft(binding.type, binding.id); setByPath(content.data, binding.path, result.path)
  binding.value = result.path; binding.previewValue = `${location.origin}${result.preview_url}`
  state.dirty.add(keyFor(binding.type, binding.id)); updateSaveState(); updateBinding(binding); renderInspector(); setStatus("图片已进入草稿，点击保存后写入网站。")
}

async function pasteImage() {
  if (!navigator.clipboard?.read) { setStatus("浏览器不支持主动读取剪贴板，请复制图片后直接按 Command/Ctrl + V。", true); return }
  const items = await navigator.clipboard.read()
  for (const item of items) { const type = item.types.find((value) => value.startsWith("image/")); if (type) return uploadSelectedImage(new File([await item.getType(type)], `clipboard.${type.split("/")[1]}`, { type })) }
  setStatus("剪贴板中没有图片。", true)
}

function openMarkdown() {
  const content = draft(); if (!content) return
  const body = content.type === "blog" ? content.body?.[state.lang] || "" : content.body || ""
  $("#markdown-editor").value = body; markdownDialog.showModal()
}

function applyMarkdown() {
  const content = draft(); if (!content) return
  if (content.type === "blog") content.body[state.lang] = $("#markdown-editor").value
  else content.body = $("#markdown-editor").value
  dirtyCurrent(); rebuildBindings(); markdownDialog.close(); setStatus("Markdown 已应用到草稿。")
}

async function saveAll() {
  if (!state.dirty.size) return
  const records = [...state.dirty].map((key) => { const content = state.drafts.get(key); return { type: content.type, id: content.id, content } })
  saveButton.disabled = true; saveButton.textContent = "正在保存…"; setStatus("正在校验并写入全部改动…")
  try {
    const result = await api("/api/save-batch", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ records }), timeoutMs: 120000 })
    result.records.forEach((content) => { content.preview_url = state.drafts.get(keyFor(content.type, content.id))?.preview_url; state.drafts.set(keyFor(content.type, content.id), content) })
    state.dirty.clear(); state.pendingMedia = {}; updateSaveState(); await refreshBootstrap(); rebuildBindings()
    const path = new URL(previewFrame.src).pathname; previewFrame.src = `${previewBase()}${path}?editor=${Date.now()}`
    setStatus(`已保存 ${result.records.length} 项内容，预览正在刷新。`)
  } catch (error) { updateSaveState(); setStatus(`保存失败，草稿仍保留：${error.message}`, true) }
}

async function refreshBootstrap() {
  state.bootstrap = await api("/api/bootstrap"); state.csrfToken = state.bootstrap.csrf_token
  $("#preview-health").textContent = state.bootstrap.preview_healthy ? "预览运行中" : "预览未启动"
  $("#preview-health").classList.toggle("is-error", !state.bootstrap.preview_healthy)
  const changed = state.bootstrap.git?.session_changed || []; publishButton.disabled = changed.length === 0
}

function openDrawer(drawer) { drawer.classList.add("is-open"); drawer.setAttribute("aria-hidden", "false") }
function closeDrawer(drawer) { drawer.classList.remove("is-open"); drawer.setAttribute("aria-hidden", "true") }

async function createNew() {
  if (typeSchema()?.singleton) return
  const id = prompt("请输入英文 slug（小写字母、数字和连字符）", state.type === "blog" ? "new-post" : "new-item"); if (!id) return
  const created = await api(`/api/content/${state.type}`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) })
  state.drafts.set(keyFor(state.type, created.id), created); await loadRecords(); await selectRecord(created.id, true); rebuildBindings(); await refreshBootstrap()
}

async function duplicateCurrent() {
  const source = draft(); if (!source) return
  const id = prompt("请输入副本英文 slug", `${source.id}-copy`); if (!id) return
  const created = await api(`/api/content/${state.type}`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id, data: source.data, body: source.body }) })
  state.drafts.set(keyFor(state.type, created.id), created); await loadRecords(); await selectRecord(created.id, true); rebuildBindings(); await refreshBootstrap()
}

async function deleteCurrent() {
  if (!state.currentId || typeSchema()?.singleton || !confirm("确定移入本地回收站吗？")) return
  await api(`/api/content/${state.type}/${state.currentId}`, { method: "DELETE" }); state.drafts.delete(keyFor(state.type, state.currentId)); state.currentId = null; await loadRecords(true); rebuildBindings(); await refreshBootstrap()
}

async function openHistory() {
  if (!state.currentId) return
  const payload = await api(`/api/history/${state.type}/${state.currentId}`); const list = $("#history-list"); list.innerHTML = ""
  ;(payload.records || []).forEach((record) => { const item = document.createElement("div"); item.className = "history-item"; item.innerHTML = `<span><strong>${new Date(record.created_at).toLocaleString()}</strong></span>`; const button = document.createElement("button"); button.textContent = "恢复"; button.onclick = async () => { if (!confirm("恢复会覆盖当前本地内容，继续吗？")) return; const restored = await api(`/api/history/${state.type}/${state.currentId}/restore`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ token: record.token }) }); state.drafts.set(keyFor(state.type, state.currentId), restored); rebuildBindings(); renderInspector(); $("#history-dialog").close() }; item.append(button); list.append(item) })
  $("#history-dialog").showModal()
}

async function startPublish() {
  try { publishButton.disabled = true; setStatus("正在构建和检查…"); const result = await api("/api/publish/preflight", { method: "POST", headers: { "Content-Type": "application/json" }, body: "{}", timeoutMs: 180000 }); state.publishToken = result.token; $("#publish-files").innerHTML = result.paths.map((path) => `<li>${path}</li>`).join(""); $("#publish-dialog").showModal(); setStatus("发布检查通过，请复核文件。") } catch (error) { setStatus(`发布被阻止：${error.message}`, true); publishButton.disabled = false }
}

async function confirmPublish() {
  if (!state.publishToken) return
  try { const result = await api("/api/publish/confirm", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ token: state.publishToken, commit_message: $("#commit-message").value }), timeoutMs: 180000 }); state.publishToken = null; $("#publish-dialog").close(); await refreshBootstrap(); setStatus(`发布成功：${result.commit.slice(0, 12)}。`) } catch (error) { setStatus(`推送失败：${error.message}`, true) }
}

function bindEvents() {
  $("#content-button").onclick = () => openDrawer(contentDrawer); $("#inspector-button").onclick = () => openDrawer(inspectorDrawer)
  $$('[data-close-drawer]').forEach((button) => button.onclick = () => closeDrawer(button.closest("aside")))
  $$('[data-close-dialog]').forEach((button) => button.onclick = () => button.closest("dialog").close())
  $$('[data-work-mode]').forEach((button) => button.onclick = () => { state.mode = button.dataset.workMode; $$('[data-work-mode]').forEach((item) => item.classList.toggle("is-active", item === button)); configurePreview() })
  $$('[data-preview-lang]').forEach((button) => button.onclick = () => { state.lang = button.dataset.previewLang; $$('[data-preview-lang]').forEach((item) => item.classList.toggle("is-active", item === button)); previewFrame.contentWindow?.postMessage({ type: "behop:set-language", lang: state.lang }, previewBase()); configurePreview() })
  $("#record-search").oninput = (event) => { state.search = event.target.value; renderRecords() }
  $("#new-button").onclick = createNew; $("#duplicate-button").onclick = duplicateCurrent; $("#delete-button").onclick = deleteCurrent
  $("#history-button").onclick = openHistory; saveButton.onclick = saveAll; publishButton.onclick = startPublish; $("#confirm-publish-button").onclick = confirmPublish
  $("#choose-image-button").onclick = () => $("#image-input").click(); $("#image-input").onchange = (event) => uploadSelectedImage(event.target.files?.[0]); $("#paste-image-button").onclick = () => pasteImage().catch((error) => setStatus(error.message, true))
  $("#markdown-button").onclick = openMarkdown; $("#markdown-cancel").onclick = () => markdownDialog.close(); $("#markdown-apply").onclick = applyMarkdown
  $("#page-picker").onchange = (event) => { previewFrame.src = `${previewBase()}${event.target.value}?editor=${Date.now()}` }
  window.addEventListener("paste", (event) => { const file = [...event.clipboardData.files].find((item) => item.type.startsWith("image/")); if (file && selectedBinding()?.kind === "image") { event.preventDefault(); uploadSelectedImage(file).catch((error) => setStatus(error.message, true)) } })
  window.addEventListener("message", (event) => {
    if (event.origin !== previewBase() || event.source !== previewFrame.contentWindow || event.data?.source !== "behop-preview") return
    if (event.data.type === "ready") configurePreview()
    else if (event.data.type === "element-selected") showSelection(state.bindings.find((binding) => binding.key === event.data.key))
    else if (event.data.type === "field-changed" || event.data.type === "field-committed") {
      const binding = state.bindings.find((item) => item.key === event.data.key)
      if (binding) applyTextChange(binding, event.data.value, event.data.type === "field-committed")
    }
  })
  window.addEventListener("beforeunload", (event) => { if (state.dirty.size) { event.preventDefault(); event.returnValue = "" } })
}

async function initialize() {
  bindEvents(); setStatus("正在加载网站内容…"); await refreshBootstrap(); state.schema = state.bootstrap.schema
  state.type = state.schema.types.homepage ? "homepage" : Object.keys(state.schema.types)[0]
  renderTypeTabs(); await loadAllDrafts(); await loadRecords(true)
  const pages = [["主页", "/"], ["Works", "/works/"], ["AI Tools", "/behop-ai-product/"], ["Archive", "/works/archive/"], ["Blog", "/blog/en/"], ["About", "/about/"]]
  pages.forEach(([label, path]) => $("#page-picker").add(new Option(label, path)))
  updateSaveState(); setStatus("")
}

initialize().catch((error) => setStatus(`初始化失败：${error.message}`, true))
