(() => {
  const list = document.querySelector("[data-forum-list]")
  if (!list) return

  const staticTopics = Array.isArray(window.FORUM_TOPICS) ? [...window.FORUM_TOPICS] : []
  const categoryLabels = window.FORUM_CATEGORY_LABELS || {}
  const tagLabels = window.FORUM_TAG_LABELS || {}
  const forumClient = window.FORUM_CLIENT || null

  const baseUrl = document.body?.dataset.baseurl || ""
  const baseForum = `${baseUrl}/forum/`.replace(/\/+/g, "/")
  const baseTopic = `${baseForum}topic/`
  const params = new URLSearchParams(window.location.search)

  const legacyTopic = params.get("topic")
  if (legacyTopic) {
    window.location.href = `${baseTopic}?topic=${encodeURIComponent(legacyTopic)}`
    return
  }

  const getParam = (key, fallback) => params.get(key) || fallback
  const getStorageItem = (storage, key, fallback = "") => {
    try {
      const value = storage.getItem(key)
      return value === null || value === undefined ? fallback : value
    } catch (error) {
      return fallback
    }
  }

  const getLang = () => getStorageItem(localStorage, "portfolioLang", "en")
  const pickLang = (value, lang) => {
    if (!value || typeof value === "string") return value || ""
    return value[lang] || value.en || value.zh || ""
  }

  const categoryOptions = ["all", "message", "landscape", "ai", "news", "featured", "trending"]
  const filterOptions = ["all", "message", "pinned", "news", "aitalk", "design-cognition", "design-rules"]
  const sortOptions = ["latest", "oldest", "views", "replies"]

  const categoryParam = getParam("category", "all")
  const filterParam = getParam("filter", "all")
  const sortParam = getParam("sort", "latest")

  const category = categoryOptions.includes(categoryParam) ? categoryParam : "all"
  const filter = filterOptions.includes(filterParam) ? filterParam : "all"
  const sort = sortOptions.includes(sortParam) ? sortParam : "latest"
  const initialPage = Math.max(1, Number.parseInt(getParam("page", "1"), 10) || 1)
  const pageSize = 6

  let visibleCount = initialPage * pageSize
  let approvedComments = []
  let approvedMetrics = null
  let approvedTopics = []
  let localTopics = []
  let topics = [...staticTopics]
  const staticTopicSlugSet = new Set(staticTopics.map((topic) => topic?.slug).filter(Boolean))

  const emptyState = document.querySelector("[data-forum-empty]")
  const loadMore = document.querySelector("[data-forum-load-more]")
  const composeModal = document.querySelector("[data-compose-modal]")
  const composeForm = document.querySelector("[data-compose-form]")
  const composeSubmit = document.querySelector("[data-compose-submit]")

  const localDraftKey = "forumTopicDrafts"
  const defaultTopicTag =
    String(forumClient?.config?.topicDefaultTag || "message")
      .trim()
      .toLowerCase() || "message"
  const defaultTopicCategory =
    String(forumClient?.config?.topicDefaultCategory || "message")
      .trim()
      .toLowerCase() || "message"

  const composeI18n = {
    zh: {
      missingConfig:
        "留言发布功能尚未完成配置（topicSubmitUrl 或 Supabase key 缺失）。请先在 forum-config.js 配置后再发布。",
      titleRequired: "请先填写留言标题。",
      messageRequired: "请先填写留言内容。",
      submitSuccess: "发布成功，正在打开留言详情页...",
      submitError: "发布失败，请稍后再试。",
    },
    en: {
      missingConfig:
        "Topic publishing is not configured yet (topicSubmitUrl or Supabase key missing). Configure forum-config.js first.",
      titleRequired: "Please enter a title.",
      messageRequired: "Please enter your message.",
      submitSuccess: "Published. Opening the topic page...",
      submitError: "Publish failed. Please try again later.",
    },
  }

  const parseJsonSafe = (raw, fallback) => {
    try {
      return JSON.parse(raw)
    } catch (error) {
      return fallback
    }
  }

  const normalizeTopicList = (raw) => {
    if (forumClient?.normalizeTopics) {
      return forumClient.normalizeTopics(raw)
    }

    const source = Array.isArray(raw) ? raw : raw?.topics
    return Array.isArray(source) ? source : []
  }

  const isPersistentDraftTopic = (topic, approvedSlugSet = new Set()) => {
    if (!topic?.slug) return false
    if (!topic.localDraft) return false
    if (staticTopicSlugSet.has(topic.slug) || approvedSlugSet.has(topic.slug)) return false

    const status = String(topic.status || "").trim().toLowerCase()
    if (status === "approved" || status === "published") return false

    return true
  }

  const filterPersistentDraftTopics = (items, approvedSlugSet = new Set()) =>
    (items || []).filter((topic) => isPersistentDraftTopic(topic, approvedSlugSet))

  const loadLocalTopics = () => {
    try {
      const parsed = parseJsonSafe(localStorage.getItem(localDraftKey) || "[]", [])
      const normalized = normalizeTopicList(parsed)
      const filtered = filterPersistentDraftTopics(normalized).slice(0, 100)
      if (filtered.length !== normalized.length) saveLocalTopics(filtered)
      return filtered
    } catch (error) {
      return []
    }
  }

  const saveLocalTopics = (items) => {
    try {
      localStorage.setItem(localDraftKey, JSON.stringify(items || []))
    } catch (error) {
      // ignore storage quota and private mode errors
    }
  }

  const mergeTopics = (...groups) => {
    const merged = []
    const seen = new Set()

    groups.forEach((group) => {
      ;(group || []).forEach((topic) => {
        if (!topic?.slug || seen.has(topic.slug)) return
        seen.add(topic.slug)
        merged.push(topic)
      })
    })

    return merged
  }

  const upsertLocalTopic = (topic) => {
    if (!topic?.slug) return

    localTopics = filterPersistentDraftTopics(mergeTopics([topic], localTopics)).slice(0, 100)
    saveLocalTopics(localTopics)
    topics = mergeTopics(localTopics, approvedTopics, staticTopics)
  }

  const formatNumber = (value, lang = getLang()) => {
    if (forumClient?.formatNumber) return forumClient.formatNumber(value, lang)
    const locale = lang === "zh" ? "zh-CN" : "en-US"
    return new Intl.NumberFormat(locale).format(Number(value) || 0)
  }

  const formatTopicDateTag = (dateValue, lang) => {
    if (!dateValue) return ""
    const date = new Date(dateValue)
    if (Number.isNaN(date.getTime())) return dateValue

    const locale = lang === "zh" ? "zh-CN" : "en-US"
    return new Intl.DateTimeFormat(locale, {
      year: "numeric",
      month: "short",
      day: "numeric",
      timeZone: "UTC",
    }).format(date)
  }

  const buildUrl = (updates) => {
    const next = new URLSearchParams(params)
    Object.entries(updates).forEach(([key, value]) => {
      if (value === null || value === undefined || value === "") {
        next.delete(key)
        return
      }
      next.set(key, String(value))
    })
    const query = next.toString()
    return query ? `${baseForum}?${query}` : baseForum
  }

  // Normalize unsupported query values to prevent empty/invalid states.
  if (category !== categoryParam || filter !== filterParam || sort !== sortParam) {
    window.history.replaceState({}, "", buildUrl({ category, filter, sort, page: initialPage }))
  }

  const getTopicMetric = (slug) => approvedMetrics?.topics?.[slug] || {}

  const getCategoryCounts = () => {
    const counts = {
      all: topics.length,
      message: 0,
      landscape: 0,
      ai: 0,
      news: 0,
      featured: 0,
      trending: 0,
    }

    topics.forEach((topic) => {
      if (Object.prototype.hasOwnProperty.call(counts, topic.category)) {
        counts[topic.category] += 1
      }
      if (Array.isArray(topic.tags) && topic.tags.includes("featured")) counts.featured += 1
      if (Array.isArray(topic.tags) && topic.tags.includes("trending")) counts.trending += 1
    })

    return counts
  }

  const getApprovedCommentCountMap = () => {
    const map = {}
    approvedComments.forEach((comment) => {
      if (!comment?.topicSlug) return
      map[comment.topicSlug] = (map[comment.topicSlug] || 0) + 1
    })
    return map
  }

  const getRepliesCount = (topic, commentMap) => {
    const topicMetric = getTopicMetric(topic.slug)
    const approvedCount = Number(topicMetric.comments) || commentMap[topic.slug] || 0
    const fallback = Number(topic.stats?.replies) || 0
    return approvedCount || fallback
  }

  const getViewsCount = (topic) => {
    const topicMetric = getTopicMetric(topic.slug)
    return Number(topicMetric.views) || Number(topic.stats?.views) || 0
  }

  const getFilteredSorted = () => {
    const commentMap = getApprovedCommentCountMap()
    const filtered = topics.filter((topic) => {
      if (category !== "all") {
        if (category === "featured" || category === "trending") {
          if (!Array.isArray(topic.tags) || !topic.tags.includes(category)) return false
        } else if (topic.category !== category) {
          return false
        }
      }

      if (filter !== "all") {
        if (!Array.isArray(topic.tags) || !topic.tags.includes(filter)) return false
      }

      return true
    })

    return filtered.sort((a, b) => {
      if (sort === "views") return getViewsCount(b) - getViewsCount(a)
      if (sort === "replies") return getRepliesCount(b, commentMap) - getRepliesCount(a, commentMap)
      if (sort === "oldest") return new Date(a.date).getTime() - new Date(b.date).getTime()
      return new Date(b.date).getTime() - new Date(a.date).getTime()
    })
  }

  const createTagNode = (tag, lang) => {
    const node = document.createElement("span")
    const label = pickLang(tagLabels[tag], lang) || tag

    if (tag === "pinned") {
      node.className = "inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-primary/10 text-primary"
      node.textContent = label
      return node
    }

    if (tag === "news") {
      node.className =
        "inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-accent text-accent-foreground"
      node.textContent = label
      return node
    }

    if (tag === "message") {
      node.className =
        "inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-emerald-100 text-emerald-700"
      node.textContent = label
      return node
    }

    if (tag === "aitalk") {
      node.className = "inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-primary/10 text-primary"
      node.textContent = label
      return node
    }

    if (tag === "design-cognition") {
      node.className =
        "inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-sky-100 text-sky-700"
      node.textContent = label
      return node
    }

    if (tag === "design-rules") {
      node.className =
        "inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-amber-100 text-amber-700"
      node.textContent = label
      return node
    }

    node.className = "inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-muted text-muted-foreground"
    node.textContent = label
    return node
  }

  const createTopicCard = (topic, lang) => {
    const commentMap = getApprovedCommentCountMap()
    const replies = getRepliesCount(topic, commentMap)
    const views = getViewsCount(topic)
    const categoryLabel = pickLang(categoryLabels[topic.category], lang) || topic.category

    const article = document.createElement("article")
    const link = document.createElement("a")
    link.href = `${baseTopic}?topic=${encodeURIComponent(topic.slug)}`
    link.dataset.topic = topic.slug
    link.className =
      "group block bg-card rounded-lg border border-border p-5 hover:border-primary/30 transition-colors no-underline"

    link.innerHTML = `
      <div class="flex gap-4">
        <div class="shrink-0">
          <div class="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
            <span class="text-sm font-medium text-muted-foreground" data-topic-author-initials></span>
          </div>
        </div>
        <div class="flex-1 min-w-0">
          <div class="flex items-center gap-2 mb-1 flex-wrap" data-topic-meta></div>
          <h3 class="text-base font-medium text-foreground group-hover:text-primary transition-colors line-clamp-1 mb-1" data-topic-title></h3>
          <p class="text-sm text-muted-foreground line-clamp-2 leading-relaxed mb-3" data-topic-excerpt></p>
          <div class="flex items-center gap-4 text-xs text-muted-foreground">
            <span class="font-medium text-foreground" data-topic-author-name></span>
            <span class="flex items-center gap-1">
              <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
              </svg>
              <span data-topic-replies-value></span>
            </span>
            <span class="flex items-center gap-1">
              <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6-10-6-10-6"></path>
                <circle cx="12" cy="12" r="3"></circle>
              </svg>
              <span data-topic-views-value></span>
            </span>
            <span class="flex items-center gap-1 ml-auto">
              <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <polyline points="12 6 12 12 16 14"></polyline>
              </svg>
              <span data-topic-date-value></span>
            </span>
          </div>
        </div>
      </div>
    `

    const meta = link.querySelector("[data-topic-meta]")
    const renderedTags = []
    ;["pinned", "news", "message", "aitalk", "design-cognition", "design-rules"].forEach((tag) => {
      if (Array.isArray(topic.tags) && topic.tags.includes(tag)) renderedTags.push(tag)
    })
    if (!renderedTags.length && Array.isArray(topic.tags) && topic.tags[0]) {
      renderedTags.push(topic.tags[0])
    }
    renderedTags.slice(0, 2).forEach((tag) => meta.appendChild(createTagNode(tag, lang)))

    const categoryNode = document.createElement("span")
    categoryNode.className = "text-xs text-muted-foreground"
    categoryNode.textContent = categoryLabel
    meta.appendChild(categoryNode)

    const dateTagNode = document.createElement("span")
    dateTagNode.dataset.topicTimeTag = topic.slug
    dateTagNode.className = "inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-muted text-muted-foreground"
    dateTagNode.textContent = formatTopicDateTag(topic.date, lang)
    meta.appendChild(dateTagNode)

    link.querySelector("[data-topic-author-initials]").textContent = topic.author?.initials || "BE"
    link.querySelector("[data-topic-title]").textContent = pickLang(topic.title, lang)
    link.querySelector("[data-topic-excerpt]").textContent = pickLang(topic.excerpt, lang)
    link.querySelector("[data-topic-author-name]").textContent = topic.author?.name || "BEhop"
    link.querySelector("[data-topic-replies-value]").textContent = formatNumber(replies, lang)
    link.querySelector("[data-topic-views-value]").textContent = formatNumber(views, lang)
    link.querySelector("[data-topic-date-value]").textContent = formatTopicDateTag(topic.date, lang)

    article.appendChild(link)
    return article
  }

  const updateCategoryCountBadges = () => {
    const lang = getLang()
    const counts = getCategoryCounts()

    document.querySelectorAll("[data-category-count]").forEach((node) => {
      const key = node.dataset.categoryCount
      node.textContent = formatNumber(counts[key] || 0, lang)
    })
  }

  const updateSidebarStatsFromApprovedData = () => {
    const lang = getLang()
    const membersNode = document.querySelector("[data-forum-stat-members]")
    const topicsNode = document.querySelector("[data-forum-stat-topics]")
    const repliesNode = document.querySelector("[data-forum-stat-replies]")
    const onlineNode = document.querySelector("[data-forum-stat-online]")
    const commentMap = getApprovedCommentCountMap()
    const totalReplies = topics.reduce((sum, topic) => sum + getRepliesCount(topic, commentMap), 0)

    if (topicsNode) topicsNode.textContent = formatNumber(topics.length, lang)

    if (membersNode) membersNode.textContent = formatNumber(Number(approvedMetrics?.site?.visitors) || 0, lang)
    if (repliesNode) repliesNode.textContent = formatNumber(Number(approvedMetrics?.site?.comments) || totalReplies, lang)
    if (onlineNode) onlineNode.textContent = formatNumber(Number(approvedMetrics?.site?.todayVisitors) || 0, lang)
  }

  const renderTopContributors = () => {
    const wrap = document.querySelector("[data-forum-contributors]")
    if (!wrap) return

    const lang = getLang()
    const commentMap = getApprovedCommentCountMap()
    const byAuthor = new Map()

    topics.forEach((topic) => {
      const authorName = topic.author?.name || "BEhop"
      const existing = byAuthor.get(authorName) || {
        name: authorName,
        initials: topic.author?.initials || "BE",
        role: pickLang(topic.author?.role, lang) || "",
        score: 0,
      }

      existing.role = pickLang(topic.author?.role, lang) || existing.role
      existing.score += 1
      existing.score += getRepliesCount(topic, commentMap)
      byAuthor.set(authorName, existing)
    })

    const rows = [...byAuthor.values()].sort((a, b) => b.score - a.score).slice(0, 4)
    wrap.innerHTML = ""

    rows.forEach((entry) => {
      const row = document.createElement("div")
      row.className = "flex items-center gap-3"

      row.innerHTML = `
        <div class="w-8 h-8 rounded-full bg-muted flex items-center justify-center shrink-0">
          <span class="text-xs font-medium text-muted-foreground">${entry.initials}</span>
        </div>
        <div class="flex-1 min-w-0">
          <div class="text-sm font-medium text-foreground truncate">${entry.name}</div>
          <div class="text-xs text-muted-foreground">${entry.role || "-"}</div>
        </div>
        <div class="text-xs text-muted-foreground">${formatNumber(entry.score, lang)}</div>
      `

      wrap.appendChild(row)
    })

    if (!rows.length) {
      const empty = document.createElement("div")
      empty.className = "text-xs text-muted-foreground"
      empty.textContent = "-"
      wrap.appendChild(empty)
    }
  }

  const renderList = () => {
    const sorted = getFilteredSorted()
    const items = sorted.slice(0, visibleCount)
    const lang = getLang()

    list.innerHTML = ""
    items.forEach((topic) => list.appendChild(createTopicCard(topic, lang)))

    if (emptyState) emptyState.classList.toggle("hidden", items.length > 0)

    if (loadMore) {
      const hasNext = visibleCount < sorted.length
      loadMore.classList.toggle("hidden", !hasNext)
      if (hasNext) {
        const nextPage = Math.floor(visibleCount / pageSize) + 1
        loadMore.href = buildUrl({ page: nextPage })
      }
    }

    updateCategoryCountBadges()
    updateSidebarStatsFromApprovedData()
    renderTopContributors()
    return { total: sorted.length }
  }

  const categoryLinks = document.querySelectorAll("[data-category-link]")
  categoryLinks.forEach((link) => {
    const linkCategory = link.dataset.categoryLink
    const isActive = linkCategory === category
    link.classList.toggle("bg-primary", isActive)
    link.classList.toggle("text-primary-foreground", isActive)
    link.classList.toggle("text-muted-foreground", !isActive)
    link.classList.toggle("hover:text-foreground", !isActive)
    link.setAttribute("aria-current", isActive ? "page" : "false")
    link.href = buildUrl({ category: linkCategory, page: 1 })
  })

  const labelMap = {
    filter: {
      all: { en: "Filter · All", zh: "筛选 · 全部" },
      message: { en: "Filter · Message", zh: "筛选 · 留言" },
      pinned: { en: "Filter · Pinned", zh: "筛选 · 置顶" },
      news: { en: "Filter · News", zh: "筛选 · 资讯" },
      aitalk: { en: "Filter · AI Talk", zh: "筛选 · AI 对话" },
      "design-cognition": { en: "Filter · Design Cognition", zh: "筛选 · 设计认知" },
      "design-rules": { en: "Filter · Design Rules", zh: "筛选 · 设计规则" },
    },
    sort: {
      latest: { en: "Sort · Newest", zh: "排序 · 最新" },
      oldest: { en: "Sort · Oldest", zh: "排序 · 最早" },
      views: { en: "Sort · Views", zh: "排序 · 浏览" },
      replies: { en: "Sort · Replies", zh: "排序 · 回复" },
    },
  }

  const updateToggle = (type, value, linkEl, labelEl, options) => {
    if (!linkEl) return
    const currentIndex = Math.max(0, options.indexOf(value))
    const nextValue = options[(currentIndex + 1) % options.length]
    linkEl.href = buildUrl({ [type]: nextValue, page: 1 })

    if (!labelEl) return
    const lang = getLang()
    const label = labelMap[type]?.[value]?.[lang] || labelMap[type]?.[value]?.en
    labelEl.textContent = label || labelEl.textContent
  }

  const refreshToolbar = () => {
    updateToggle(
      "filter",
      filter,
      document.querySelector("[data-filter-link]"),
      document.querySelector("[data-filter-label]"),
      filterOptions
    )
    updateToggle(
      "sort",
      sort,
      document.querySelector("[data-sort-link]"),
      document.querySelector("[data-sort-label]"),
      sortOptions
    )
  }

  const setComposeFeedback = (type, text) => {
    const node = document.querySelector("[data-compose-feedback]")
    if (!node) return

    if (!text) {
      node.classList.add("hidden")
      node.className = "forum-compose-feedback hidden"
      node.textContent = ""
      return
    }

    node.classList.remove("hidden")
    node.textContent = text
    node.className = "forum-compose-feedback"

    if (type === "success") {
      node.classList.add("border-primary/30", "bg-primary/5", "text-foreground")
      return
    }

    if (type === "warning") {
      node.classList.add("border-border", "bg-muted", "text-muted-foreground")
      return
    }

    node.classList.add("border-red-300", "bg-red-50", "text-red-700")
  }

  const setComposeOpen = (isOpen) => {
    if (!composeModal) return
    composeModal.classList.toggle("hidden", !isOpen)
    document.body.style.overflow = isOpen ? "hidden" : ""
  }

  const getComposeCopy = () => composeI18n[getLang()] || composeI18n.en

  const shortExcerpt = (text, max = 140) => {
    const source = String(text || "").trim()
    if (!source) return ""
    if (source.length <= max) return source
    return `${source.slice(0, max).trim()}...`
  }

  const createUniqueSlug = (title) => {
    const normalized = String(title || "")
      .trim()
      .toLowerCase()
      .replace(/['’]/g, "")
      .replace(/[^a-z0-9\s-]/g, " ")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "")

    const base = normalized || `message-${Date.now().toString(36)}`
    const used = new Set(topics.map((topic) => topic.slug))

    if (!used.has(base)) return base

    let i = 1
    let next = `${base}-${i}`
    while (used.has(next)) {
      i += 1
      next = `${base}-${i}`
    }

    return next
  }

  const buildDraftTopic = ({ slug, title, message, authorName, submittedAt, status }) => {
    const normalized = normalizeTopicList([
      {
        slug,
        category: defaultTopicCategory,
        tags: [defaultTopicTag],
        author: authorName,
        status,
        source: "community",
        date: submittedAt,
        title: {
          en: title,
          zh: title,
        },
        excerpt: {
          en: shortExcerpt(message),
          zh: shortExcerpt(message),
        },
        message,
        localDraft: true,
      },
    ])

    return normalized[0] || null
  }

  const bindCompose = () => {
    if (!composeModal || !composeForm) return

    document.querySelectorAll("[data-compose-open]").forEach((button) => {
      button.addEventListener("click", () => {
        setComposeFeedback("", "")
        setComposeOpen(true)
      })
    })

    document.querySelectorAll("[data-compose-close]").forEach((button) => {
      button.addEventListener("click", () => {
        setComposeOpen(false)
      })
    })

    window.addEventListener("keydown", (event) => {
      if (event.key !== "Escape") return
      if (composeModal.classList.contains("hidden")) return
      setComposeOpen(false)
    })

    composeForm.addEventListener("submit", async (event) => {
      event.preventDefault()

      const copy = getComposeCopy()

      if (!forumClient?.canSubmitTopics) {
        setComposeFeedback("warning", copy.missingConfig)
        return
      }

      const nameInput = composeForm.querySelector("[data-compose-name]")
      const locationInput = composeForm.querySelector("[data-compose-location]")
      const titleInput = composeForm.querySelector("[data-compose-title]")
      const messageInput = composeForm.querySelector("[data-compose-message]")

      const authorName = String(nameInput?.value || "").trim() || (getLang() === "zh" ? "匿名用户" : "Anonymous")
      const location = String(locationInput?.value || "").trim()
      const title = String(titleInput?.value || "").trim()
      const message = String(messageInput?.value || "").trim()

      if (!title) {
        setComposeFeedback("error", copy.titleRequired)
        return
      }

      if (!message) {
        setComposeFeedback("error", copy.messageRequired)
        return
      }

      const slug = createUniqueSlug(title)
      const submittedAt = new Date().toISOString()
      const status = String(forumClient?.config?.topicInitialStatus || "pending").trim() || "pending"

      const payload = {
        slug,
        title,
        message,
        excerpt: shortExcerpt(message),
        authorName,
        category: defaultTopicCategory,
        tags: [defaultTopicTag],
        status,
        language: getLang(),
        location: location || Intl.DateTimeFormat().resolvedOptions().timeZone || "",
        pagePath: window.location.pathname + window.location.search,
        visitorId: forumClient.getVisitorId(),
        sessionId: forumClient.getSessionId(),
        submittedAt,
      }

      if (composeSubmit) {
        composeSubmit.disabled = true
        composeSubmit.classList.add("opacity-70")
      }

      const result = await forumClient.submitTopic(payload)

      if (composeSubmit) {
        composeSubmit.disabled = false
        composeSubmit.classList.remove("opacity-70")
      }

      if (!result.ok) {
        setComposeFeedback("error", copy.submitError)
        return
      }

      const draftTopic = buildDraftTopic(payload)
      if (draftTopic) {
        upsertLocalTopic(draftTopic)
      }

      renderResult = renderList()
      setComposeFeedback("success", copy.submitSuccess)

      if (forumClient?.canTrackEvents) {
        forumClient.trackEvent({
          eventType: "topic_submit",
          page: "forum_index",
          topicSlug: slug,
          topicTitle: title,
          category: defaultTopicCategory,
          dedupeKey: `topic-submit:${slug}:${submittedAt}`,
        })
      }

      window.setTimeout(() => {
        window.location.href = `${baseTopic}?topic=${encodeURIComponent(slug)}`
      }, 260)
    })

    if (composeSubmit) {
      composeSubmit.disabled = !forumClient?.canSubmitTopics
      composeSubmit.classList.toggle("opacity-60", !forumClient?.canSubmitTopics)
      composeSubmit.classList.toggle("cursor-not-allowed", !forumClient?.canSubmitTopics)
    }
  }

  const hydrateApprovedData = async () => {
    if (!forumClient) return

    try {
      const [comments, metrics, fetchedTopics] = await Promise.all([
        forumClient.fetchApprovedComments(),
        forumClient.fetchApprovedMetrics(),
        forumClient.fetchApprovedTopics ? forumClient.fetchApprovedTopics() : Promise.resolve([]),
      ])

      approvedComments = comments
      approvedMetrics = metrics
      approvedTopics = Array.isArray(fetchedTopics) ? fetchedTopics : []
      const approvedSlugSet = new Set(approvedTopics.map((topic) => topic?.slug).filter(Boolean))
      const cleanedLocalTopics = filterPersistentDraftTopics(localTopics, approvedSlugSet).slice(0, 100)
      if (cleanedLocalTopics.length !== localTopics.length) {
        localTopics = cleanedLocalTopics
        saveLocalTopics(localTopics)
      }
      topics = mergeTopics(localTopics, approvedTopics, staticTopics)
      renderResult = renderList()
    } catch (error) {
      // keep static fallback values
    }
  }

  localTopics = loadLocalTopics()
  topics = mergeTopics(localTopics, approvedTopics, staticTopics)

  refreshToolbar()
  let renderResult = renderList()
  bindCompose()

  if (loadMore) {
    loadMore.addEventListener("click", (event) => {
      const hasNext = visibleCount < renderResult.total
      if (!hasNext) return

      event.preventDefault()
      visibleCount += pageSize
      renderResult = renderList()

      const nextPageValue = Math.max(1, Math.ceil(Math.min(visibleCount, renderResult.total) / pageSize))
      window.history.replaceState({}, "", buildUrl({ page: nextPageValue }))
    })
  }

  hydrateApprovedData()

  if (forumClient?.canTrackEvents) {
    forumClient.trackEvent({
      eventType: "page_view",
      page: "forum_index",
      category,
      filter,
      sort,
      dedupeKey: `forum-index:${window.location.pathname}${window.location.search}`,
    })
  }

  document.querySelectorAll("[data-lang]").forEach((button) => {
    button.addEventListener("click", () => {
      refreshToolbar()
      renderResult = renderList()
    })
  })
})()
