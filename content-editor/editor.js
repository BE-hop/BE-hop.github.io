const state = {
  type: "homepage",
  records: [],
  currentId: "homepage",
  current: null,
  dirty: false,
  mode: "simple",
  activeSection: null,
  uploadingField: null,
}

const typeLabels = {
  homepage: "Homepage",
  projects: "Works",
  "ai-products": "AI Tools",
  archive: "Archive",
}

const rootFields = {
  homepage: ["hero", "ai_tools", "works", "contact", "footer"],
  projects: [
    "title_zh", "title_en", "subtitle_zh", "subtitle_en", "category",
    "category_label_zh", "category_label_en", "status_zh", "status_en",
    "year", "location_zh", "location_en", "role_zh", "role_en", "tools",
    "summary_zh", "summary_en", "context_zh", "context_en", "problem_zh",
    "problem_en", "concept_zh", "concept_en", "design_strategy_zh",
    "design_strategy_en", "outcome_zh", "outcome_en", "reflection_zh",
    "reflection_en", "cover", "image", "drawings", "renderings",
    "related_posts", "order", "featured", "archive_ref",
  ],
  "ai-products": [
    "title_zh", "title_en", "subtitle_zh", "subtitle_en", "category",
    "category_zh", "category_en", "visibility", "status_zh", "status_en",
    "summary_zh", "summary_en", "image", "cover", "tags", "chips",
    "problem_zh", "problem_en", "target_users", "workflow", "features",
    "tech_stack", "input_output_zh", "input_output_en", "demo_zh",
    "demo_en", "before_image", "after_image", "before_label_zh",
    "before_label_en", "after_label_zh", "after_label_en", "result_gallery",
    "limitations", "next_steps", "order",
  ],
  archive: [
    "id", "title_zh", "title_en", "year", "source_group", "type_zh",
    "type_en", "status", "visibility", "source_label_zh",
    "source_label_en", "thumbnail", "project_url", "summary_zh",
    "summary_en", "tags",
  ],
}

const schemas = {
  homepage: [
    {
      id: "hero",
      title: "主页首屏 Hero",
      position: "对应刚进入网站看到的第一屏：背景图、身份标签、主标题、说明文字和按钮。",
      fields: [
        ["hero.background_image", "首屏背景图", "建议 1800px 宽以内，复杂图片会影响文字可读性。"],
        ["hero.badge_zh", "身份标签（中文）"],
        ["hero.badge_en", "身份标签（英文）"],
        ["hero.title_lines_zh", "主标题分行（中文）"],
        ["hero.title_lines_en", "主标题分行（英文）"],
        ["hero.description_zh", "首屏说明（中文）"],
        ["hero.description_en", "首屏说明（英文）"],
        ["hero.primary_cta_zh", "主按钮（中文）"],
        ["hero.primary_cta_en", "主按钮（英文）"],
        ["hero.secondary_cta_zh", "次按钮（中文）"],
        ["hero.secondary_cta_en", "次按钮（英文）"],
      ],
    },
    {
      id: "home-ai",
      title: "首页 AI Tools 入口区",
      position: "对应主页中 AI Tools 卡片组上方的标题和说明，具体工具卡片来自 AI Tools 内容。",
      fields: [
        ["ai_tools.kicker_zh", "小标题（中文）"],
        ["ai_tools.kicker_en", "小标题（英文）"],
        ["ai_tools.title_zh", "区块标题（中文）"],
        ["ai_tools.title_en", "区块标题（英文）"],
        ["ai_tools.subtitle_zh", "区块说明（中文）"],
        ["ai_tools.subtitle_en", "区块说明（英文）"],
        ["ai_tools.view_all_zh", "查看全部按钮（中文）"],
        ["ai_tools.view_all_en", "查看全部按钮（英文）"],
      ],
    },
    {
      id: "home-works",
      title: "首页 Works 入口区",
      position: "对应主页精选项目区标题、说明、筛选按钮和 Archive 入口。",
      fields: [
        ["works.kicker_zh", "小标题（中文）"],
        ["works.kicker_en", "小标题（英文）"],
        ["works.title_zh", "区块标题（中文）"],
        ["works.title_en", "区块标题（英文）"],
        ["works.subtitle_zh", "区块说明（中文）"],
        ["works.subtitle_en", "区块说明（英文）"],
        ["works.view_all_zh", "查看全部项目按钮（中文）"],
        ["works.view_all_en", "查看全部项目按钮（英文）"],
        ["works.archive_label_zh", "归档入口（中文）"],
        ["works.archive_label_en", "归档入口（英文）"],
      ],
    },
    {
      id: "contact",
      title: "主页 Contact 区",
      position: "对应主页底部联系表单上方说明、邮箱和工作时间。",
      fields: [
        ["contact.kicker_zh", "小标题（中文）"],
        ["contact.kicker_en", "小标题（英文）"],
        ["contact.title_zh", "标题（中文）"],
        ["contact.title_en", "标题（英文）"],
        ["contact.description_zh", "说明（中文）"],
        ["contact.description_en", "说明（英文）"],
        ["contact.email", "展示邮箱"],
        ["contact.hours_text_zh", "工作时间（中文）"],
        ["contact.hours_text_en", "工作时间（英文）"],
      ],
    },
    {
      id: "footer",
      title: "页脚 Footer",
      position: "对应网站最底部品牌名、描述、版权和返回顶部文字。",
      fields: [
        ["footer.brand_zh", "品牌名（中文）"],
        ["footer.brand_en", "品牌名（英文）"],
        ["footer.description_zh", "页脚描述（中文）"],
        ["footer.description_en", "页脚描述（英文）"],
        ["footer.rights_zh", "版权文字（中文）"],
        ["footer.rights_en", "版权文字（英文）"],
        ["footer.back_to_top_zh", "返回顶部（中文）"],
        ["footer.back_to_top_en", "返回顶部（英文）"],
      ],
    },
  ],
  projects: [
    {
      id: "work-card",
      title: "Works 列表卡片",
      position: "对应首页 Works 卡片、Works 列表页卡片和项目入口信息。",
      fields: [
        ["cover", "卡片封面 / 详情封面", "首页和 Works 列表优先使用这张图。"],
        ["title_zh", "项目标题（中文）"],
        ["title_en", "项目标题（英文）"],
        ["subtitle_zh", "项目副标题（中文）"],
        ["subtitle_en", "项目副标题（英文）"],
        ["summary_zh", "卡片摘要（中文）"],
        ["summary_en", "卡片摘要（英文）"],
        ["category", "分类代码"],
        ["category_label_zh", "分类标签（中文）"],
        ["category_label_en", "分类标签（英文）"],
        ["status_zh", "状态标签（中文）"],
        ["status_en", "状态标签（英文）"],
        ["year", "年份"],
      ],
    },
    {
      id: "work-detail",
      title: "项目详情正文",
      position: "对应项目详情页：概览、背景、问题、概念、策略、结果和复盘。",
      fields: [
        ["role_zh", "我的角色（中文）"],
        ["role_en", "我的角色（英文）"],
        ["tools", "工具列表"],
        ["location_zh", "地点（中文）"],
        ["location_en", "地点（英文）"],
        ["context_zh", "项目背景（中文）"],
        ["context_en", "项目背景（英文）"],
        ["problem_zh", "设计问题（中文）"],
        ["problem_en", "设计问题（英文）"],
        ["concept_zh", "概念（中文）"],
        ["concept_en", "概念（英文）"],
        ["design_strategy_zh", "设计策略（中文）"],
        ["design_strategy_en", "设计策略（英文）"],
        ["outcome_zh", "结果（中文）"],
        ["outcome_en", "结果（英文）"],
        ["reflection_zh", "复盘（中文）"],
        ["reflection_en", "复盘（英文）"],
      ],
    },
    {
      id: "work-images",
      title: "项目详情图片",
      position: "对应项目详情页中的图纸/流程图和效果图区域。",
      fields: [
        ["image", "备用主图"],
        ["drawings", "图纸 / 流程图组"],
        ["renderings", "效果图组"],
      ],
    },
    {
      id: "work-settings",
      title: "排序与关联",
      position: "控制首页和 Works 列表排序，以及归档关联。",
      fields: [
        ["order", "排序，数字越小越靠前"],
        ["featured", "是否精选"],
        ["archive_ref", "Archive 对应 ID"],
        ["related_posts", "相关博客链接"],
      ],
    },
  ],
  "ai-products": [
    {
      id: "ai-card",
      title: "AI Tools 列表卡片",
      position: "对应首页 AI Tools 卡片和 AI Tools 列表页卡片。",
      fields: [
        ["cover", "工具封面图"],
        ["title_zh", "工具标题（中文）"],
        ["title_en", "工具标题（英文）"],
        ["subtitle_zh", "工具副标题（中文）"],
        ["subtitle_en", "工具副标题（英文）"],
        ["summary_zh", "卡片摘要（中文）"],
        ["summary_en", "卡片摘要（英文）"],
        ["category_zh", "分类（中文）"],
        ["category_en", "分类（英文）"],
        ["status_zh", "状态（中文）"],
        ["status_en", "状态（英文）"],
        ["visibility", "公开状态"],
        ["order", "排序"],
      ],
    },
    {
      id: "ai-detail",
      title: "工具详情说明",
      position: "对应 AI 工具详情页的问题、目标用户、工作流、功能和技术栈。",
      fields: [
        ["problem_zh", "解决的问题（中文）"],
        ["problem_en", "解决的问题（英文）"],
        ["target_users", "目标用户"],
        ["workflow", "工作流步骤"],
        ["features", "功能点"],
        ["tech_stack", "技术栈"],
        ["input_output_zh", "输入输出（中文）"],
        ["input_output_en", "输入输出（英文）"],
        ["limitations", "限制"],
        ["next_steps", "下一步"],
      ],
    },
    {
      id: "ai-images",
      title: "工具图片与结果",
      position: "对应 AI 工具详情页封面、前后对比和结果图组。",
      fields: [
        ["image", "备用主图"],
        ["before_image", "对比前图片"],
        ["after_image", "对比后图片"],
        ["before_label_zh", "对比前标签（中文）"],
        ["before_label_en", "对比前标签（英文）"],
        ["after_label_zh", "对比后标签（中文）"],
        ["after_label_en", "对比后标签（英文）"],
        ["result_gallery", "结果图组"],
      ],
    },
  ],
  archive: [
    {
      id: "archive-card",
      title: "Archive 归档卡片",
      position: "对应 /works/archive/ 页面中每一张归档卡片。",
      fields: [
        ["thumbnail", "归档缩略图"],
        ["title_zh", "标题（中文）"],
        ["title_en", "标题（英文）"],
        ["summary_zh", "说明（中文）"],
        ["summary_en", "说明（英文）"],
        ["year", "年份"],
        ["type_zh", "类型（中文）"],
        ["type_en", "类型（英文）"],
        ["source_label_zh", "来源标签（中文）"],
        ["source_label_en", "来源标签（英文）"],
      ],
    },
    {
      id: "archive-settings",
      title: "归档状态与链接",
      position: "控制归档项是否公开、是否跳转到详情页以及标签。",
      fields: [
        ["id", "归档 ID"],
        ["source_group", "来源分组"],
        ["status", "状态"],
        ["visibility", "公开程度"],
        ["project_url", "详情链接，可留空"],
        ["tags", "标签"],
      ],
    },
  ],
}

const listEl = document.querySelector("#record-list")
const formEl = document.querySelector("#content-form")
const statusEl = document.querySelector("#status")
const saveButton = document.querySelector("#save-button")
const reloadButton = document.querySelector("#reload-record-button")
const refreshButton = document.querySelector("#refresh-button")
const currentTitle = document.querySelector("#current-title")
const currentType = document.querySelector("#current-type")
const previewFrame = document.querySelector("#preview-frame")
const previewLink = document.querySelector("#preview-link")
const modeButtons = document.querySelectorAll("[data-mode]")
const sectionNav = document.querySelector("#section-nav")
const previewShortcuts = document.querySelector("#preview-shortcuts")

function setStatus(message, isError = false) {
  statusEl.textContent = message || ""
  statusEl.classList.toggle("is-error", isError)
}

async function api(path, options = {}) {
  const timeoutMs = options.timeoutMs || 15000
  const controller = new AbortController()
  const timeout = window.setTimeout(() => controller.abort(), timeoutMs)

  try {
    const response = await fetch(path, { ...options, signal: controller.signal })
    const text = await response.text()
    const payload = text ? JSON.parse(text) : {}
    if (!response.ok) {
      throw new Error(payload.error || `Request failed: ${response.status}`)
    }
    return payload
  } catch (error) {
    if (error.name === "AbortError") {
      throw new Error("请求超时。请确认编辑器服务仍在运行，或图片文件不要过大。")
    }
    throw error
  } finally {
    window.clearTimeout(timeout)
  }
}

function normalizePath(path) {
  if (!path) return ""
  if (/^https?:\/\//.test(path)) return path
  return `http://127.0.0.1:4001${path.startsWith("/") ? path : `/${path}`}`
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
    if (Array.isArray(cursor) && /^\d+$/.test(part)) {
      cursor = cursor[Number(part)]
      return
    }
    if (cursor[part] == null) cursor[part] = {}
    cursor = cursor[part]
  })
  const last = parts[parts.length - 1]
  if (Array.isArray(cursor) && /^\d+$/.test(last)) {
    cursor[Number(last)] = next
  } else {
    cursor[last] = next
  }
}

function deleteByPath(value, path) {
  const parts = path.split(".")
  const key = parts.pop()
  const parent = getByPath(value, parts.join("."))
  if (Array.isArray(parent) && /^\d+$/.test(key)) {
    parent.splice(Number(key), 1)
  } else if (parent && key) {
    delete parent[key]
  }
}

function markDirty() {
  state.dirty = true
  saveButton.disabled = false
  setStatus("有未保存修改。")
}

function fieldConfig(raw) {
  return Array.isArray(raw) ? { path: raw[0], label: raw[1], help: raw[2] } : raw
}

function displayLabel(path) {
  return path
    .split(".")
    .map((part) => (/^\d+$/.test(part) ? `#${Number(part) + 1}` : part.replaceAll("_", " ")))
    .join(" / ")
}

function isImageField(path, value) {
  const key = path.split(".").pop()
  return typeof value === "string" && (
    /(^|_)(image|cover|thumbnail)$/.test(key)
    || key === "background_image"
    || value.startsWith("/img/")
  )
}

function isLongText(value) {
  return typeof value === "string" && (value.length > 90 || value.includes("\n"))
}

function renderScalar(path, value, meta = {}) {
  const wrapper = document.createElement("div")
  wrapper.className = isImageField(path, value) ? "image-field" : "field"

  const label = document.createElement("label")
  label.textContent = meta.label || displayLabel(path)
  wrapper.appendChild(label)

  if (isImageField(path, value)) {
    const img = document.createElement("img")
    img.alt = meta.label || displayLabel(path)
    img.src = normalizePath(value)
    wrapper.appendChild(img)

    const actions = document.createElement("div")
    actions.className = "image-actions"

    const input = document.createElement("input")
    input.type = "file"
    input.accept = "image/*"
    input.hidden = true

    const replace = document.createElement("button")
    replace.type = "button"
    replace.textContent = state.uploadingField === path ? "正在上传..." : "替换图片"
    replace.disabled = state.uploadingField === path
    replace.addEventListener("click", () => input.click())
    input.addEventListener("change", () => {
      uploadImage(path, input.files[0], replace).catch((error) => setStatus(error.message, true))
    })

    const pathText = document.createElement("span")
    pathText.className = "image-path"
    pathText.textContent = value || "暂无图片路径"

    actions.append(replace, input, pathText)
    wrapper.appendChild(actions)
  } else {
    const input = isLongText(value) ? document.createElement("textarea") : document.createElement("input")
    input.value = value == null ? "" : value
    input.addEventListener("input", () => {
      setByPath(state.current.data, path, input.value)
      markDirty()
    })
    wrapper.appendChild(input)
  }

  if (meta.help) {
    const help = document.createElement("small")
    help.textContent = meta.help
    wrapper.appendChild(help)
  }

  return wrapper
}

function renderBoolean(path, value, meta = {}) {
  const wrapper = document.createElement("div")
  wrapper.className = "field"
  const label = document.createElement("label")
  label.textContent = meta.label || displayLabel(path)
  const select = document.createElement("select")
  ;[true, false].forEach((optionValue) => {
    const option = document.createElement("option")
    option.value = String(optionValue)
    option.textContent = optionValue ? "是 / true" : "否 / false"
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

function renderNumber(path, value, meta = {}) {
  const wrapper = document.createElement("div")
  wrapper.className = "field"
  const label = document.createElement("label")
  label.textContent = meta.label || displayLabel(path)
  const input = document.createElement("input")
  input.type = "number"
  input.value = value
  input.addEventListener("input", () => {
    setByPath(state.current.data, path, input.value === "" ? "" : Number(input.value))
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

function blankFromExample(example) {
  if (Array.isArray(example)) return []
  if (example && typeof example === "object") {
    return Object.fromEntries(Object.keys(example).map((key) => [key, ""]))
  }
  return ""
}

function renderArray(path, value, meta = {}) {
  const wrapper = document.createElement("div")
  wrapper.className = "group-field"
  const title = document.createElement("div")
  title.className = "group-title"
  title.textContent = meta.label || displayLabel(path)
  wrapper.appendChild(title)

  if (meta.help) {
    const help = document.createElement("p")
    help.className = "field-help"
    help.textContent = meta.help
    wrapper.appendChild(help)
  }

  value.forEach((item, index) => {
    const itemPath = `${path}.${index}`
    const itemEl = document.createElement("div")
    itemEl.className = "array-item"

    const arrayHeader = document.createElement("div")
    arrayHeader.className = "array-header"
    const titleText = document.createElement("strong")
    titleText.textContent = `${meta.label || displayLabel(path)} #${index + 1}`
    const remove = document.createElement("button")
    remove.type = "button"
    remove.textContent = "删除这一项"
    remove.addEventListener("click", () => {
      deleteByPath(state.current.data, itemPath)
      markDirty()
      renderForm()
    })
    arrayHeader.append(titleText, remove)
    itemEl.appendChild(arrayHeader)
    itemEl.appendChild(renderField(itemPath, item))
    wrapper.appendChild(itemEl)
  })

  const add = document.createElement("button")
  add.type = "button"
  add.textContent = "新增一项"
  add.addEventListener("click", () => {
    value.push(blankFromExample(value[0]))
    markDirty()
    renderForm()
  })
  wrapper.appendChild(add)
  return wrapper
}

function renderObject(path, value, meta = {}) {
  const wrapper = document.createElement("div")
  wrapper.className = "group-field"
  const title = document.createElement("div")
  title.className = "group-title"
  title.textContent = meta.label || displayLabel(path)
  wrapper.appendChild(title)

  Object.keys(value).forEach((key) => {
    wrapper.appendChild(renderField(path ? `${path}.${key}` : key, value[key]))
  })
  return wrapper
}

function renderField(path, value, meta = {}) {
  if (Array.isArray(value)) return renderArray(path, value, meta)
  if (value && typeof value === "object") return renderObject(path, value, meta)
  if (typeof value === "boolean") return renderBoolean(path, value, meta)
  if (typeof value === "number") return renderNumber(path, value, meta)
  return renderScalar(path, value, meta)
}

function orderedKeys() {
  const preferred = rootFields[state.type] || []
  const existing = Object.keys(state.current.data || {})
  return [...preferred.filter((key) => existing.includes(key)), ...existing.filter((key) => !preferred.includes(key))]
}

function renderSectionNav() {
  sectionNav.innerHTML = ""
  const sections = schemas[state.type] || []
  if (state.mode !== "simple") {
    sectionNav.hidden = true
    return
  }

  if (!state.activeSection && sections[0]) state.activeSection = sections[0].id
  sectionNav.hidden = false
  sections.forEach((section, index) => {
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

function renderSimpleForm() {
  const sections = schemas[state.type] || []
  if (!state.activeSection || !sections.some((section) => section.id === state.activeSection)) {
    state.activeSection = sections[0] ? sections[0].id : null
  }
  renderSectionNav()

  sections
    .filter((section) => section.id === state.activeSection)
    .forEach((section) => {
      const card = document.createElement("section")
      card.className = "editor-section-card"

      const header = document.createElement("div")
      header.className = "section-heading"
      const title = document.createElement("h3")
      title.textContent = section.title
      const position = document.createElement("p")
      position.textContent = section.position
      header.append(title, position)
      card.appendChild(header)

      section.fields.map(fieldConfig).forEach((field) => {
        const value = getByPath(state.current.data, field.path)
        if (typeof value === "undefined") return
        card.appendChild(renderField(field.path, value, field))
      })

      formEl.appendChild(card)
    })
}

function renderAdvancedForm() {
  sectionNav.hidden = true
  orderedKeys().forEach((key) => {
    formEl.appendChild(renderField(key, state.current.data[key]))
  })
}

function renderForm() {
  formEl.innerHTML = ""
  if (!state.current) return

  if (state.mode === "simple") {
    renderSimpleForm()
  } else {
    renderAdvancedForm()
  }

  if (typeof state.current.body === "string") {
    const wrapper = document.createElement("div")
    wrapper.className = "field"
    const label = document.createElement("label")
    label.textContent = "Markdown body / 详情页底部补充"
    const textarea = document.createElement("textarea")
    textarea.value = state.current.body
    textarea.addEventListener("input", () => {
      state.current.body = textarea.value
      markDirty()
    })
    const help = document.createElement("small")
    help.textContent = "一般优先改上方结构化字段；这里用于保留详情页底部补充说明。"
    wrapper.append(label, textarea, help)
    formEl.appendChild(wrapper)
  }
}

function renderRecords() {
  listEl.innerHTML = ""
  state.records.forEach((record) => {
    const button = document.createElement("button")
    button.type = "button"
    button.className = `record${record.id === state.currentId ? " is-active" : ""}`
    button.addEventListener("click", () => loadRecord(record.id))

    const image = document.createElement("img")
    image.alt = record.title_en || record.title_zh || record.id
    image.src = normalizePath(record.image || "/img/portfolio/hero-landscape.jpg")

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

function shortcutLinks() {
  const links = [
    ["首页", "http://127.0.0.1:4001/"],
    ["AI Tools", "http://127.0.0.1:4001/behop-ai-product/"],
    ["Works", "http://127.0.0.1:4001/works/"],
    ["Archive", "http://127.0.0.1:4001/works/archive/"],
  ]
  if (previewLink.href) links.unshift(["当前详情", previewLink.href])
  return links
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

async function loadRecords() {
  setStatus("正在读取列表...")
  const payload = await api(`/api/content/${state.type}`)
  state.records = payload.records || []
  if (!state.currentId || !state.records.some((record) => record.id === state.currentId)) {
    state.currentId = state.records[0] ? state.records[0].id : null
  }
  renderRecords()
  if (state.currentId) await loadRecord(state.currentId)
}

async function loadRecord(id) {
  state.currentId = id
  state.activeSection = null
  setStatus("正在读取内容...")
  const payload = await api(`/api/content/${state.type}/${id}`)
  state.current = payload
  state.dirty = false
  saveButton.disabled = false
  reloadButton.disabled = false
  currentType.textContent = typeLabels[state.type] || state.type
  currentTitle.textContent = payload.data.title_zh || payload.data.title_en || id
  renderRecords()
  renderForm()
  await updatePreview()
  setStatus("内容已加载。")
}

async function saveCurrent() {
  if (!state.current) return
  setStatus("正在保存...")
  const payload = await api(`/api/content/${state.type}/${state.currentId}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(state.current),
  })
  state.current = payload
  state.dirty = false
  saveButton.disabled = false
  renderForm()
  await loadRecords()
  await updatePreview(true)
  setStatus("保存成功。Jekyll 预览会在重新构建后显示最新内容。")
}

function validateImageFile(file) {
  if (!file) return "没有选择文件。"
  if (!file.type || !file.type.startsWith("image/")) return "请选择图片文件，不要上传 PDF、PPT 或其他文件。"
  if (file.size > 10 * 1024 * 1024) return "图片超过 10MB，请先压缩后再上传。"
  return ""
}

async function uploadImage(fieldPath, file, button) {
  const validationError = validateImageFile(file)
  if (validationError) {
    setStatus(validationError, true)
    return
  }
  if (!state.current) return

  state.uploadingField = fieldPath
  if (button) {
    button.disabled = true
    button.textContent = "正在上传..."
  }
  setStatus("正在上传并替换图片...")

  try {
    const body = new FormData()
    body.append("field", fieldPath)
    body.append("file", file)
    const payload = await api(`/api/image/${state.type}/${state.currentId}`, {
      method: "POST",
      body,
      timeoutMs: 60000,
    })
    state.current = payload.content
    state.dirty = false
    await loadRecords()
    renderForm()
    await updatePreview(true)
    setStatus(`图片已替换：${payload.path}`)
  } catch (error) {
    setStatus(error.message || "图片上传失败。", true)
  } finally {
    state.uploadingField = null
    if (button) {
      button.disabled = false
      button.textContent = "替换图片"
    }
  }
}

async function updatePreview(cacheBust = false) {
  if (!state.currentId) return
  const payload = await api(`/api/preview-url/${state.type}/${state.currentId}`)
  const url = cacheBust ? `${payload.url}?editor=${Date.now()}` : payload.url
  previewFrame.src = url
  previewLink.href = payload.url
  renderPreviewShortcuts()
}

function bindEvents() {
  document.querySelectorAll(".tab").forEach((tab) => {
    tab.addEventListener("click", async () => {
      if (state.dirty && !window.confirm("当前内容还没保存，确定切换吗？")) return
      document.querySelectorAll(".tab").forEach((node) => node.classList.remove("is-active"))
      tab.classList.add("is-active")
      state.type = tab.dataset.type
      state.currentId = state.type === "homepage" ? "homepage" : null
      state.current = null
      state.activeSection = null
      await loadRecords().catch((error) => setStatus(error.message, true))
    })
  })

  modeButtons.forEach((button) => {
    button.addEventListener("click", () => {
      state.mode = button.dataset.mode
      modeButtons.forEach((node) => node.classList.toggle("is-active", node === button))
      renderForm()
    })
  })

  saveButton.addEventListener("click", () => {
    saveCurrent().catch((error) => setStatus(error.message, true))
  })

  reloadButton.addEventListener("click", () => {
    if (!state.currentId) return
    loadRecord(state.currentId).catch((error) => setStatus(error.message, true))
  })

  refreshButton.addEventListener("click", () => {
    loadRecords().catch((error) => setStatus(error.message, true))
  })
}

bindEvents()
renderPreviewShortcuts()
loadRecords().catch((error) => setStatus(error.message, true))
