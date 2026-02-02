(() => {
  const list = document.querySelector("[data-forum-list]")
  if (!list || !window.FORUM_TOPICS) return

  const baseUrl = document.body?.dataset.baseurl || ""
  const basePath = `${baseUrl}/forum/`.replace(/\/+/g, "/")
  const params = new URLSearchParams(window.location.search)

  const legacyTopic = params.get("topic")
  if (legacyTopic) {
    window.location.href = `${basePath}topic/?topic=${encodeURIComponent(legacyTopic)}`
    return
  }

  const getParam = (key, fallback) => params.get(key) || fallback

  const category = getParam("category", "all")
  const filter = getParam("filter", "all")
  const sort = getParam("sort", "latest")
  const page = Number.parseInt(getParam("page", "1"), 10) || 1
  const pageSize = 6

  const topics = [...window.FORUM_TOPICS]

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

  const sorted = filtered.sort((a, b) => {
    if (sort === "views") return (b.stats?.views || 0) - (a.stats?.views || 0)
    if (sort === "replies") return (b.stats?.replies || 0) - (a.stats?.replies || 0)
    return new Date(b.date).getTime() - new Date(a.date).getTime()
  })

  const start = Math.max(0, (page - 1) * pageSize)
  const pageItems = sorted.slice(start, start + pageSize)

  const cards = Array.from(list.querySelectorAll("[data-topic]"))
  const cardMap = new Map(cards.map((card) => [card.dataset.topic, card]))

  cards.forEach((card) => card.classList.add("hidden"))
  pageItems.forEach((topic) => {
    const card = cardMap.get(topic.slug)
    if (card) card.classList.remove("hidden")
  })

  const emptyState = document.querySelector("[data-forum-empty]")
  if (emptyState) {
    emptyState.classList.toggle("hidden", pageItems.length > 0)
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

  const loadMore = document.querySelector("[data-forum-load-more]")
  if (loadMore) {
    const hasNext = start + pageSize < sorted.length
    loadMore.classList.toggle("hidden", !hasNext)
    if (hasNext) {
      loadMore.href = buildUrl({ page: page + 1 })
    }
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

  const filterOptions = ["all", "pinned", "news"]
  const sortOptions = ["latest", "views", "replies"]
  const getLang = () => localStorage.getItem("portfolioLang") || "en"
  const labelMap = {
    filter: {
      all: { en: "Filter · All", zh: "筛选 · 全部" },
      pinned: { en: "Filter · Pinned", zh: "筛选 · 置顶" },
      news: { en: "Filter · News", zh: "筛选 · 资讯" },
    },
    sort: {
      latest: { en: "Sort · Latest", zh: "排序 · 最新" },
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
    })
  })
})()
