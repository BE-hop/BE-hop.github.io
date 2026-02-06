(() => {
  const list = document.querySelector("[data-forum-list]")
  if (!list || !window.FORUM_TOPICS) return

  const baseUrl = document.body?.dataset.baseurl || ""
  const basePath = `${baseUrl}/forum/`.replace(/\/+/g, "/")
  const params = new URLSearchParams(window.location.search)
  const forumClient = window.FORUM_CLIENT || null

  const legacyTopic = params.get("topic")
  if (legacyTopic) {
    window.location.href = `${basePath}topic/?topic=${encodeURIComponent(legacyTopic)}`
    return
  }

  const getParam = (key, fallback) => params.get(key) || fallback
  const getLang = () => localStorage.getItem("portfolioLang") || "en"

  const category = getParam("category", "all")
  const filter = getParam("filter", "all")
  const sort = getParam("sort", "latest")
  const initialPage = Math.max(1, Number.parseInt(getParam("page", "1"), 10) || 1)
  const pageSize = 6

  const topics = [...window.FORUM_TOPICS]
  const cards = Array.from(list.querySelectorAll("[data-topic]"))
  const cardEntries = cards.map((card) => ({
    card,
    article: card.closest("article") || card,
  }))
  const cardMap = new Map(cardEntries.map((entry) => [entry.card.dataset.topic, entry]))

  let visibleCount = initialPage * pageSize
  let approvedComments = []
  let approvedMetrics = null

  const formatNumber = (value, lang = getLang()) => {
    if (forumClient?.formatNumber) return forumClient.formatNumber(value, lang)
    const locale = lang === "zh" ? "zh-CN" : "en-US"
    return new Intl.NumberFormat(locale).format(Number(value) || 0)
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
    return query ? `${basePath}?${query}` : basePath
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

  const upsertTimeTag = (entry, topic, lang) => {
    if (!entry?.card || !topic) return

    const metaLine =
      entry.card.querySelector("[data-topic-meta]") ||
      entry.card.querySelector(".flex.items-center.gap-2.mb-1.flex-wrap") ||
      entry.card.querySelector("h3")?.previousElementSibling

    if (!metaLine) return

    let timeTag = metaLine.querySelector("[data-topic-time-tag]")
    if (!timeTag) {
      timeTag = document.createElement("span")
      timeTag.dataset.topicTimeTag = topic.slug
      timeTag.className =
        "inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-muted text-muted-foreground"
      metaLine.appendChild(timeTag)
    }

    timeTag.textContent = formatTopicDateTag(topic.date, lang)
  }

  const renderTimeTags = () => {
    const lang = getLang()
    topics.forEach((topic) => {
      const entry = cardMap.get(topic.slug)
      if (entry) upsertTimeTag(entry, topic, lang)
    })
  }

  const getFilteredSorted = () => {
    const filtered = topics.filter((topic) => {
      if (category !== "all") {
        if (category === "featured" || category === "trending") {
          if (!topic.tags || !topic.tags.includes(category)) return false
        } else if (topic.category !== category) {
          return false
        }
      }

      if (filter !== "all") {
        if (!topic.tags || !topic.tags.includes(filter)) return false
      }

      return true
    })

    return filtered.sort((a, b) => {
      if (sort === "views") return (b.stats?.views || 0) - (a.stats?.views || 0)
      if (sort === "replies") return (b.stats?.replies || 0) - (a.stats?.replies || 0)
      if (sort === "oldest") return new Date(a.date).getTime() - new Date(b.date).getTime()
      return new Date(b.date).getTime() - new Date(a.date).getTime()
    })
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

  const updateCardStatsFromApprovedData = () => {
    const commentCountMap = getApprovedCommentCountMap()
    const lang = getLang()

    topics.forEach((topic) => {
      const entry = cardMap.get(topic.slug)
      if (!entry) return

      const statsWrap = entry.card.querySelector(".flex.items-center.gap-4.text-xs.text-muted-foreground")
      if (!statsWrap) return

      const statGroups = Array.from(statsWrap.children).filter((node) => {
        const classList = node?.classList
        return (
          classList &&
          classList.contains("flex") &&
          classList.contains("items-center") &&
          classList.contains("gap-1")
        )
      })

      const repliesNode = statGroups[0]?.querySelector("span:last-child")
      const viewsNode = statGroups[1]?.querySelector("span:last-child")

      const topicMetric = getTopicMetric(topic.slug)
      const approvedCommentsCount = Number(topicMetric.comments) || commentCountMap[topic.slug] || 0
      const approvedViewsCount = Number(topicMetric.views) || Number(topic.stats?.views) || 0

      if (repliesNode) {
        const fallbackReplies = Number(topic.stats?.replies) || 0
        const value = approvedCommentsCount || fallbackReplies
        repliesNode.textContent = formatNumber(value, lang)
      }

      if (viewsNode) {
        viewsNode.textContent = formatNumber(approvedViewsCount, lang)
      }
    })
  }

  const updateSidebarStatsFromApprovedData = () => {
    const lang = getLang()

    const membersNode = document.querySelector("[data-forum-stat-members]")
    const topicsNode = document.querySelector("[data-forum-stat-topics]")
    const repliesNode = document.querySelector("[data-forum-stat-replies]")
    const onlineNode = document.querySelector("[data-forum-stat-online]")

    if (topicsNode) {
      topicsNode.textContent = formatNumber(topics.length, lang)
    }

    if (!approvedMetrics) return

    if (membersNode) {
      membersNode.textContent = formatNumber(approvedMetrics.site?.visitors || 0, lang)
    }

    if (repliesNode) {
      repliesNode.textContent = formatNumber(approvedMetrics.site?.comments || 0, lang)
    }

    if (onlineNode) {
      onlineNode.textContent = formatNumber(approvedMetrics.site?.todayVisitors || 0, lang)
    }
  }

  const applyApprovedSnapshots = () => {
    updateCardStatsFromApprovedData()
    updateSidebarStatsFromApprovedData()
  }

  const emptyState = document.querySelector("[data-forum-empty]")
  const loadMore = document.querySelector("[data-forum-load-more]")

  const renderList = () => {
    const sorted = getFilteredSorted()
    const items = sorted.slice(0, visibleCount)

    cardEntries.forEach((entry) => entry.article.classList.add("hidden"))

    items.forEach((topic) => {
      const entry = cardMap.get(topic.slug)
      if (!entry) return
      entry.article.classList.remove("hidden")
      list.appendChild(entry.article)
    })

    renderTimeTags()
    applyApprovedSnapshots()

    if (emptyState) {
      emptyState.classList.toggle("hidden", items.length > 0)
    }

    if (loadMore) {
      const hasNext = visibleCount < sorted.length
      loadMore.classList.toggle("hidden", !hasNext)

      if (hasNext) {
        const nextPage = Math.floor(visibleCount / pageSize) + 1
        loadMore.href = buildUrl({ page: nextPage })
      }
    }

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

    if (labelEl) {
      const lang = getLang()
      const label = labelMap[type]?.[value]?.[lang] || labelMap[type]?.[value]?.en
      labelEl.textContent = label || labelEl.textContent
    }
  }

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

  const initialRenderResult = renderList()

  if (loadMore) {
    loadMore.addEventListener("click", (event) => {
      const hasNext = visibleCount < initialRenderResult.total || visibleCount < getFilteredSorted().length
      if (!hasNext) return

      event.preventDefault()
      visibleCount += pageSize
      const result = renderList()

      const nextPageValue = Math.max(1, Math.ceil(Math.min(visibleCount, result.total) / pageSize))
      const nextUrl = buildUrl({ page: nextPageValue })
      window.history.replaceState({}, "", nextUrl)
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
      applyApprovedSnapshots()
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
      renderTimeTags()
      applyApprovedSnapshots()
    })
  })
})()
