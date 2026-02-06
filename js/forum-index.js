(() => {
  const list = document.querySelector("[data-forum-list]")
  if (!list || !Array.isArray(window.FORUM_TOPICS)) return

  const topics = [...window.FORUM_TOPICS]
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
  const getLang = () => localStorage.getItem("portfolioLang") || "en"
  const pickLang = (value, lang) => {
    if (!value || typeof value === "string") return value || ""
    return value[lang] || value.en || value.zh || ""
  }

  const category = getParam("category", "all")
  const filter = getParam("filter", "all")
  const sort = getParam("sort", "latest")
  const initialPage = Math.max(1, Number.parseInt(getParam("page", "1"), 10) || 1)
  const pageSize = 6

  let visibleCount = initialPage * pageSize
  let approvedComments = []
  let approvedMetrics = null

  const emptyState = document.querySelector("[data-forum-empty]")
  const loadMore = document.querySelector("[data-forum-load-more]")

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

  const getTopicMetric = (slug) => approvedMetrics?.topics?.[slug] || {}

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

    if (tag === "aitalk") {
      node.className = "inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-primary/10 text-primary"
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
    ;["pinned", "news", "aitalk"].forEach((tag) => {
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

  const updateSidebarStatsFromApprovedData = () => {
    const lang = getLang()
    const membersNode = document.querySelector("[data-forum-stat-members]")
    const topicsNode = document.querySelector("[data-forum-stat-topics]")
    const repliesNode = document.querySelector("[data-forum-stat-replies]")
    const onlineNode = document.querySelector("[data-forum-stat-online]")

    if (topicsNode) topicsNode.textContent = formatNumber(topics.length, lang)
    if (!approvedMetrics) return

    if (membersNode) membersNode.textContent = formatNumber(approvedMetrics.site?.visitors || 0, lang)
    if (repliesNode) repliesNode.textContent = formatNumber(approvedMetrics.site?.comments || 0, lang)
    if (onlineNode) onlineNode.textContent = formatNumber(approvedMetrics.site?.todayVisitors || 0, lang)
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

    updateSidebarStatsFromApprovedData()
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

  const filterOptions = ["all", "pinned", "news", "aitalk"]
  const sortOptions = ["latest", "oldest", "views", "replies"]
  const labelMap = {
    filter: {
      all: { en: "Filter · All", zh: "筛选 · 全部" },
      pinned: { en: "Filter · Pinned", zh: "筛选 · 置顶" },
      news: { en: "Filter · News", zh: "筛选 · 资讯" },
      aitalk: { en: "Filter · AI Talk", zh: "筛选 · AI 对话" },
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

  refreshToolbar()
  let renderResult = renderList()

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

  const hydrateApprovedData = async () => {
    if (!forumClient) return
    try {
      const [comments, metrics] = await Promise.all([
        forumClient.fetchApprovedComments(),
        forumClient.fetchApprovedMetrics(),
      ])
      approvedComments = comments
      approvedMetrics = metrics
      renderResult = renderList()
    } catch (error) {
      // keep static fallback values
    }
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
