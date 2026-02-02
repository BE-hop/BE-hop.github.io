(() => {
  const topics = window.FORUM_TOPICS
  if (!topics || !Array.isArray(topics) || topics.length === 0) return

  const baseUrl = document.body?.dataset.baseurl || ""
  const baseForum = `${baseUrl}/forum/`.replace(/\/+/g, "/")
  const baseTopic = `${baseForum}topic/`
  const params = new URLSearchParams(window.location.search)
  const slug = params.get("topic")

  const pickLang = (value, lang) => {
    if (!value || typeof value !== "object") return value
    return value[lang] || value.en || value.zh || ""
  }

  const formatDate = (dateValue, lang) => {
    if (!dateValue) return ""
    const date = new Date(dateValue)
    if (Number.isNaN(date.getTime())) return dateValue
    const locale = lang === "zh" ? "zh-CN" : "en-US"
    return date.toLocaleDateString(locale, {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const sortedByDate = [...topics].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  )

  const getTopic = (targetSlug) => topics.find((topic) => topic.slug === targetSlug)

  const render = (showNotice = false) => {
    const lang = localStorage.getItem("portfolioLang") || "en"
    const topic = getTopic(slug) || topics[0]

    const title = pickLang(topic.title, lang)
    const excerpt = pickLang(topic.excerpt, lang)
    const categoryLabels = window.FORUM_CATEGORY_LABELS || {}
    const tagLabels = window.FORUM_TAG_LABELS || {}

    const categoryLabel = pickLang(categoryLabels[topic.category] || {}, lang) || topic.category

    const titleNode = document.querySelector("[data-topic-title]")
    if (titleNode) titleNode.textContent = title

    const excerptNode = document.querySelector("[data-topic-excerpt]")
    if (excerptNode) excerptNode.textContent = excerpt

    const authorNode = document.querySelector("[data-topic-author]")
    if (authorNode) authorNode.textContent = topic.author?.name || ""

    const authorInitials = document.querySelector("[data-topic-author-initials]")
    if (authorInitials) authorInitials.textContent = topic.author?.initials || ""

    const dateNode = document.querySelector("[data-topic-date]")
    if (dateNode) dateNode.textContent = formatDate(topic.date, lang)

    const repliesNode = document.querySelector("[data-topic-replies]")
    if (repliesNode) repliesNode.textContent = topic.stats?.replies ?? ""

    const viewsNode = document.querySelector("[data-topic-views]")
    if (viewsNode) viewsNode.textContent = topic.stats?.views ?? ""

    const updatedNode = document.querySelector("[data-topic-updated]")
    if (updatedNode) updatedNode.textContent = formatDate(topic.date, lang)

    const readTimeNode = document.querySelector("[data-topic-readtime]")
    if (readTimeNode) readTimeNode.textContent = pickLang(topic.readTime, lang)

    const categoryNode = document.querySelector("[data-topic-category]")
    if (categoryNode) categoryNode.textContent = categoryLabel

    const categoryDetail = document.querySelector("[data-topic-category-detail]")
    if (categoryDetail) categoryDetail.textContent = categoryLabel

    const backLink = document.querySelector("[data-back-link]")
    if (backLink) backLink.href = `${baseForum}?category=${encodeURIComponent(topic.category)}`

    const breadcrumb = document.querySelector("[data-topic-breadcrumb]")
    if (breadcrumb) {
      breadcrumb.innerHTML = ""
      const forumLink = document.createElement("a")
      forumLink.href = baseForum
      forumLink.textContent = lang === "zh" ? "论坛" : "Forum"
      forumLink.className = "hover:text-white no-underline"

      const divider = document.createElement("span")
      divider.textContent = "/"

      const categoryLink = document.createElement("a")
      categoryLink.href = `${baseForum}?category=${encodeURIComponent(topic.category)}`
      categoryLink.textContent = categoryLabel
      categoryLink.className = "hover:text-white no-underline"

      const divider2 = document.createElement("span")
      divider2.textContent = "/"

      const titleSpan = document.createElement("span")
      titleSpan.textContent = title

      breadcrumb.append(forumLink, divider, categoryLink, divider2, titleSpan)
    }

    const tagsWrap = document.querySelector("[data-topic-tags]")
    if (tagsWrap) {
      tagsWrap.innerHTML = ""
      ;(topic.tags || []).forEach((tag) => {
        const badge = document.createElement("span")
        badge.className = "inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-white/15 text-white"
        badge.textContent = pickLang(tagLabels[tag] || {}, lang) || tag
        tagsWrap.appendChild(badge)
      })
    }

    const contentWrap = document.querySelector("[data-topic-content]")
    if (contentWrap) {
      contentWrap.innerHTML = ""
      ;(topic.content || []).forEach((block) => {
        const text = pickLang(block, lang)
        if (!text && !Array.isArray(block?.en)) return

        if (block.type === "h2") {
          const heading = document.createElement("h2")
          heading.className = "text-xl font-semibold text-foreground"
          heading.textContent = text
          contentWrap.appendChild(heading)
          return
        }

        if (block.type === "ul") {
          const list = document.createElement("ul")
          list.className = "space-y-2 text-sm text-foreground"
          const items = pickLang(block, lang) || []
          items.forEach((item) => {
            const li = document.createElement("li")
            li.className = "flex items-start gap-2"
            const dot = document.createElement("span")
            dot.className = "mt-1 h-1.5 w-1.5 rounded-full bg-primary"
            const textNode = document.createElement("span")
            textNode.textContent = item
            li.append(dot, textNode)
            list.appendChild(li)
          })
          contentWrap.appendChild(list)
          return
        }

        const paragraph = document.createElement("p")
        paragraph.className = "text-sm leading-relaxed text-foreground/90"
        paragraph.textContent = text
        contentWrap.appendChild(paragraph)
      })
    }

    const relatedList = document.querySelector("[data-related-list]")
    if (relatedList) {
      relatedList.innerHTML = ""
      const related = topics.filter((item) => item.slug !== topic.slug)
      const sameCategory = related.filter((item) => item.category === topic.category)
      const primary = sameCategory.length ? sameCategory : related

      const picks = []
      primary.forEach((item) => {
        if (picks.length < 3 && !picks.includes(item)) picks.push(item)
      })
      related.forEach((item) => {
        if (picks.length < 3 && !picks.includes(item)) picks.push(item)
      })

      picks.forEach((item) => {
        const link = document.createElement("a")
        link.href = `${baseTopic}?topic=${encodeURIComponent(item.slug)}`
        link.className = "group flex flex-col gap-1 rounded-lg border border-border px-3 py-2 hover:bg-muted transition-colors no-underline"

        const titleEl = document.createElement("span")
        titleEl.className = "text-sm font-medium text-foreground group-hover:text-primary transition-colors"
        titleEl.textContent = pickLang(item.title, lang)

        const meta = document.createElement("span")
        meta.className = "text-xs text-muted-foreground"
        meta.textContent = pickLang(categoryLabels[item.category] || {}, lang) || item.category

        link.append(titleEl, meta)
        relatedList.appendChild(link)
      })
    }

    const index = sortedByDate.findIndex((item) => item.slug === topic.slug)
    const prev = sortedByDate[index + 1]
    const next = sortedByDate[index - 1]

    const prevLink = document.querySelector("[data-topic-prev]")
    const nextLink = document.querySelector("[data-topic-next]")

    if (prevLink) {
      if (prev) {
        prevLink.href = `${baseTopic}?topic=${encodeURIComponent(prev.slug)}`
        const prevTitle = prevLink.querySelector("[data-topic-prev-title]")
        if (prevTitle) prevTitle.textContent = pickLang(prev.title, lang)
        prevLink.classList.remove("hidden")
      } else {
        prevLink.classList.add("hidden")
      }
    }

    if (nextLink) {
      if (next) {
        nextLink.href = `${baseTopic}?topic=${encodeURIComponent(next.slug)}`
        const nextTitle = nextLink.querySelector("[data-topic-next-title]")
        if (nextTitle) nextTitle.textContent = pickLang(next.title, lang)
        nextLink.classList.remove("hidden")
      } else {
        nextLink.classList.add("hidden")
      }
    }

    document.title = `${title} | BEhooop`

    if (showNotice) {
      const main = document.querySelector("main")
      if (main && !main.querySelector("[data-topic-notice]")) {
        const notice = document.createElement("div")
        notice.dataset.topicNotice = "true"
        notice.className = "mb-6 rounded-lg border border-border bg-muted px-4 py-3 text-sm text-muted-foreground"
        notice.textContent = lang === "zh" ? "未找到对应话题，已为你展示最新话题。" : "Topic not found. Showing the latest topic instead."
        main.prepend(notice)
      }
    }
  }

  render(!getTopic(slug))

  document.querySelectorAll("[data-lang]").forEach((button) => {
    button.addEventListener("click", () => {
      render()
    })
  })
})()
