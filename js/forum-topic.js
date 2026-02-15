(() => {
  const topics = window.FORUM_TOPICS
  if (!topics || !Array.isArray(topics) || topics.length === 0) return

  const baseUrl = document.body?.dataset.baseurl || ""
  const baseForum = `${baseUrl}/forum/`.replace(/\/+/g, "/")
  const baseTopic = `${baseForum}topic/`
  const params = new URLSearchParams(window.location.search)
  const requestedSlug = (params.get("topic") || "").trim()
  const forumClient = window.FORUM_CLIENT || null

  const categoryLabels = window.FORUM_CATEGORY_LABELS || {}
  const tagLabels = window.FORUM_TAG_LABELS || {}
  const detailLayoutByTag = window.FORUM_DETAIL_LAYOUT_BY_TAG || {}
  const detailLayoutLabels = window.FORUM_DETAIL_LAYOUT_LABELS || {}

  const qaRoleLabels = {
    question: { en: "Question", zh: "提问" },
    answer: { en: "Answer", zh: "回答" },
  }

  const commentI18n = {
    zh: {
      title: "评论",
      subtitle: "评论提交后会进入审核，通过后显示在本页。",
      empty: "暂无已审核评论，欢迎提交你的观点。",
      count: (value) => `${value} 条`,
      formTitle: "发表评论",
      name: "昵称",
      location: "地点",
      message: "评论内容",
      namePlaceholder: "输入昵称（可选）",
      locationPlaceholder: "城市/地区（可选）",
      messagePlaceholder: "输入你的评论（审核后展示）",
      submit: "提交评论",
      note: "提交后默认进入待审核，审核通过后会显示。",
      feedbackPending: "评论已提交，等待管理员审核后展示。",
      feedbackError: "提交失败，请稍后再试。",
      feedbackDisabled: "评论提交功能尚未完成配置（接口 URL 或 Supabase Key 缺失），当前仅显示已审核评论。",
      feedbackMessageRequired: "请先填写评论内容。",
      anonymous: "匿名用户",
      locationFallback: "未提供地点",
    },
    en: {
      title: "Comments",
      subtitle: "New comments enter moderation and appear here after approval.",
      empty: "No approved comments yet. Be the first to share your view.",
      count: (value) => `${value} comments`,
      formTitle: "Leave A Comment",
      name: "Name",
      location: "Location",
      message: "Comment",
      namePlaceholder: "Enter your name (optional)",
      locationPlaceholder: "City / Region (optional)",
      messagePlaceholder: "Write your comment (will be reviewed)",
      submit: "Submit Comment",
      note: "Your comment is queued for moderation and shown after approval.",
      feedbackPending: "Comment submitted and pending moderation.",
      feedbackError: "Submission failed. Please try again later.",
      feedbackDisabled:
        "Comment submission is not fully configured yet (endpoint URL or Supabase key missing). Showing approved comments only.",
      feedbackMessageRequired: "Please enter your comment.",
      anonymous: "Anonymous",
      locationFallback: "Location not provided",
    },
  }

  let approvedComments = []
  let approvedMetrics = null
  let activeTopic = null

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

  const formatNumber = (value, lang) => {
    if (forumClient?.formatNumber) return forumClient.formatNumber(value, lang)
    const locale = lang === "zh" ? "zh-CN" : "en-US"
    return new Intl.NumberFormat(locale).format(Number(value) || 0)
  }

  const sortedByDate = [...topics].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  )

  const getTopic = (targetSlug) => topics.find((topic) => topic.slug === targetSlug)
  const fallbackTopic = sortedByDate[0] || topics[0]
  const requestedTopic = requestedSlug ? getTopic(requestedSlug) : null
  const activeTopicSlug = (requestedTopic || fallbackTopic)?.slug || ""
  const showNotice = Boolean(requestedSlug) && !requestedTopic

  if (!activeTopicSlug) {
    window.location.href = baseForum
    return
  }

  if (!requestedSlug || showNotice) {
    const next = new URLSearchParams(params)
    next.set("topic", activeTopicSlug)
    if (showNotice) {
      next.set("from", "not-found")
    } else {
      next.delete("from")
    }
    window.history.replaceState({}, "", `${baseTopic}?${next.toString()}`)
  }

  const getTopicMetric = (topicSlug) => approvedMetrics?.topics?.[topicSlug] || {}

  const getTopicComments = (topicSlug) =>
    approvedComments
      .filter((comment) => comment.topicSlug === topicSlug)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

  const resolveLayout = (topic) => {
    if (topic?.detailLayout) return topic.detailLayout

    const tags = Array.isArray(topic?.tags) ? topic.tags : []
    for (const tag of tags) {
      if (detailLayoutByTag[tag]) return detailLayoutByTag[tag]
    }

    return "article"
  }

  const createParagraph = (text, className = "text-sm leading-relaxed text-foreground/90") => {
    const paragraph = document.createElement("p")
    paragraph.className = className
    paragraph.textContent = text
    return paragraph
  }

  const createRichParagraph = (html, className = "text-sm leading-relaxed text-foreground/90") => {
    const paragraph = document.createElement("p")
    paragraph.className = className
    paragraph.innerHTML = html
    return paragraph
  }

  const createHeading = (text, className = "text-xl font-semibold text-foreground") => {
    const heading = document.createElement("h2")
    heading.className = className
    heading.textContent = text
    return heading
  }

  const createBulletList = (items, options = {}) => {
    const {
      listClass = "space-y-2 text-sm text-foreground",
      itemClass = "flex items-start gap-2",
      dotClass = "mt-1 h-1.5 w-1.5 rounded-full bg-primary",
    } = options

    const list = document.createElement("ul")
    list.className = listClass

    items.forEach((item) => {
      const li = document.createElement("li")
      li.className = itemClass

      const dot = document.createElement("span")
      dot.className = dotClass

      const textNode = document.createElement("span")
      textNode.textContent = item

      li.append(dot, textNode)
      list.appendChild(li)
    })

    return list
  }

  const pickLangArray = (value, lang) => {
    if (Array.isArray(value)) return value
    if (!value || typeof value !== "object") return []
    const localized = value[lang] || value.en || value.zh
    return Array.isArray(localized) ? localized : []
  }

  const pickLangMatrix = (value, lang) => {
    const localized = pickLang(value, lang)
    if (!Array.isArray(localized)) return []
    return localized.filter((row) => Array.isArray(row))
  }

  const createDivider = (className) => {
    const divider = document.createElement("hr")
    divider.className = className
    return divider
  }

  const createQuoteBlock = (lines, className = "forum-insight-quote", lineClassName = "forum-insight-quote__line") => {
    const quote = document.createElement("blockquote")
    quote.className = className
    lines.forEach((line) => {
      const lineNode = document.createElement("p")
      lineNode.className = lineClassName
      lineNode.innerHTML = line
      quote.appendChild(lineNode)
    })
    return quote
  }

  const createInsightTable = (headers, rows) => {
    const wrap = document.createElement("div")
    wrap.className = "forum-insight-table-wrap"

    const table = document.createElement("table")
    table.className = "forum-insight-table"

    if (Array.isArray(headers) && headers.length) {
      const thead = document.createElement("thead")
      const tr = document.createElement("tr")
      headers.forEach((header) => {
        const th = document.createElement("th")
        th.textContent = header
        tr.appendChild(th)
      })
      thead.appendChild(tr)
      table.appendChild(thead)
    }

    const tbody = document.createElement("tbody")
    rows.forEach((row) => {
      const tr = document.createElement("tr")
      row.forEach((cell) => {
        const td = document.createElement("td")
        td.textContent = cell
        tr.appendChild(td)
      })
      tbody.appendChild(tr)
    })
    table.appendChild(tbody)
    wrap.appendChild(table)

    return wrap
  }

  const appendInsightNode = (container, lastSection, node) => {
    if (lastSection) {
      lastSection.appendChild(node)
      return
    }

    const section = document.createElement("section")
    section.className = "forum-insight-section"
    section.appendChild(node)
    container.appendChild(section)
  }

  const renderQaAnswerBlock = (container, block, lang) => {
    if (!block || typeof block !== "object") return
    const value = pickLang(block, lang)
    if (!value && !Array.isArray(block?.en) && !Array.isArray(block?.zh)) return

    if (block.type === "h2" || block.type === "h3") {
      const heading = document.createElement("h3")
      heading.className = "forum-qa-answer__heading"
      heading.textContent = value
      container.appendChild(heading)
      return
    }

    if (block.type === "ul") {
      const items = pickLangArray(block, lang)
      if (!items.length) return
      container.appendChild(
        createBulletList(items, {
          listClass: "forum-qa-answer__list",
          itemClass: "forum-qa-answer__list-item",
          dotClass: "forum-qa-answer__dot",
        })
      )
      return
    }

    container.appendChild(createParagraph(value, "forum-qa-answer__paragraph"))
  }

  const renderQaBlock = (container, block, lang) => {
    const thread = document.createElement("section")
    thread.className = "forum-qa-thread"

    const items = Array.isArray(block?.items) ? block.items : []

    items.forEach((item, index) => {
      const questionText = pickLang(item?.question, lang)
      const answerText = pickLang(item?.answer, lang)
      const answerBlocks = pickLangArray(item?.answerBlocks, lang)
      if (!questionText && !answerText && !answerBlocks.length) return

      const pair = document.createElement("article")
      pair.className = "forum-qa-pair"

      const questionCard = document.createElement("div")
      questionCard.className = "forum-qa-question"

      const questionMeta = document.createElement("div")
      questionMeta.className = "forum-qa-question__meta"

      const questionRole = document.createElement("span")
      questionRole.className = "forum-qa-question__role"
      questionRole.textContent = pickLang(qaRoleLabels.question, lang)

      const questionIndex = document.createElement("span")
      questionIndex.className = "forum-qa-question__index"
      questionIndex.textContent = `Q${index + 1}`

      questionMeta.append(questionRole, questionIndex)
      questionCard.appendChild(questionMeta)

      if (questionText) {
        const questionBody = document.createElement("p")
        questionBody.className = "forum-qa-question__text"
        questionBody.textContent = questionText
        questionCard.appendChild(questionBody)
      }

      const answerCard = document.createElement("div")
      answerCard.className = "forum-qa-answer"

      const answerMeta = document.createElement("div")
      answerMeta.className = "forum-qa-answer__meta"
      answerMeta.textContent = pickLang(qaRoleLabels.answer, lang)
      answerCard.appendChild(answerMeta)

      const answerBody = document.createElement("div")
      answerBody.className = "forum-qa-answer__body"

      if (answerText) {
        answerBody.appendChild(createParagraph(answerText, "forum-qa-answer__paragraph"))
      }

      answerBlocks.forEach((answerBlock) => {
        renderQaAnswerBlock(answerBody, answerBlock, lang)
      })

      answerCard.appendChild(answerBody)
      pair.append(questionCard, answerCard)
      thread.appendChild(pair)
    })

    if (!thread.children.length) {
      const empty = document.createElement("div")
      empty.className = "forum-dialogue-empty"
      empty.textContent =
        lang === "zh"
          ? "当前对话内容为空，请在数据中补充 qa.items。"
          : "No dialogue items found. Add qa.items in the topic data."
      thread.appendChild(empty)
    }

    container.appendChild(thread)
  }

  const renderArticleBlock = (container, block, lang) => {
    if (block.type === "qa") {
      renderQaBlock(container, block, lang)
      return
    }

    if (block.type === "hr") {
      container.appendChild(createDivider("forum-insight-divider"))
      return
    }

    const blockValue = pickLang(block, lang)
    if (!blockValue && !Array.isArray(block?.en)) return

    if (block.type === "h2") {
      container.appendChild(createHeading(blockValue))
      return
    }

    if (block.type === "ul") {
      const items = pickLang(block, lang) || []
      if (items.length) container.appendChild(createBulletList(items))
      return
    }

    if (block.type === "quote") {
      const lines = pickLangArray(block.lines, lang)
      if (!lines.length) return
      container.appendChild(createQuoteBlock(lines))
      return
    }

    if (block.type === "table") {
      const headers = pickLangArray(block.headers, lang)
      const rows = pickLangMatrix(block.rows, lang)
      if (!headers.length || !rows.length) return
      container.appendChild(createInsightTable(headers, rows))
      return
    }

    if (block.type === "p-rich") {
      container.appendChild(createRichParagraph(blockValue))
      return
    }

    container.appendChild(createParagraph(blockValue))
  }

  const renderDialogueBlock = (container, block, lang) => {
    if (block.type === "qa") {
      renderQaBlock(container, block, lang)
      return
    }

    if (block.type === "hr") {
      container.appendChild(createDivider("forum-insight-divider"))
      return
    }

    const blockValue = pickLang(block, lang)
    if (!blockValue && !Array.isArray(block?.en)) return

    if (block.type === "h2") {
      container.appendChild(
        createHeading(blockValue, "text-base md:text-lg font-semibold text-foreground/90 tracking-wide")
      )
      return
    }

    if (block.type === "ul") {
      const items = pickLang(block, lang) || []
      if (items.length) {
        container.appendChild(
          createBulletList(items, {
            listClass: "space-y-2 text-sm text-foreground/90",
            itemClass: "flex items-start gap-2",
            dotClass: "mt-1.5 h-1.5 w-1.5 rounded-full bg-accent",
          })
        )
      }
      return
    }

    if (block.type === "quote") {
      const lines = pickLangArray(block.lines, lang)
      if (!lines.length) return
      container.appendChild(createQuoteBlock(lines))
      return
    }

    if (block.type === "table") {
      const headers = pickLangArray(block.headers, lang)
      const rows = pickLangMatrix(block.rows, lang)
      if (!headers.length || !rows.length) return
      container.appendChild(createInsightTable(headers, rows))
      return
    }

    if (block.type === "p-rich") {
      container.appendChild(createRichParagraph(blockValue, "forum-dialogue-note text-sm leading-relaxed"))
      return
    }

    container.appendChild(createParagraph(blockValue, "forum-dialogue-note text-sm leading-relaxed"))
  }

  const renderInsightBlock = (container, block, lang) => {
    if (block.type === "qa") {
      renderQaBlock(container, block, lang)
      return
    }

    if (block.type === "hr") {
      container.appendChild(createDivider("forum-insight-divider"))
      return
    }

    const blockValue = pickLang(block, lang)
    const hasArrayValue = Array.isArray(block?.en) || Array.isArray(block?.zh)
    const hasStructuredArray = Array.isArray(pickLang(block?.lines, lang)) || Array.isArray(pickLang(block?.rows, lang))
    if (!blockValue && !hasArrayValue && !hasStructuredArray) return

    if (block.type === "h2") {
      const section = document.createElement("section")
      section.className = "forum-insight-section"
      section.appendChild(createHeading(blockValue, "forum-insight-section__title"))
      container.appendChild(section)
      return
    }

    const lastSection =
      container.lastElementChild && container.lastElementChild.classList.contains("forum-insight-section")
        ? container.lastElementChild
        : null

    if (block.type === "ul") {
      const items = pickLangArray(block, lang)
      if (!items.length) return

      const list = createBulletList(items, {
        listClass: "forum-insight-list",
        itemClass: "forum-insight-list__item",
        dotClass: "forum-insight-list__dot",
      })

      appendInsightNode(container, lastSection, list)
      return
    }

    if (block.type === "quote") {
      const lines = pickLangArray(block.lines, lang)
      if (!lines.length) return
      appendInsightNode(container, lastSection, createQuoteBlock(lines))
      return
    }

    if (block.type === "table") {
      const headers = pickLangArray(block.headers, lang)
      const rows = pickLangMatrix(block.rows, lang)
      if (!headers.length || !rows.length) return
      appendInsightNode(container, lastSection, createInsightTable(headers, rows))
      return
    }

    const paragraphClass = container.childElementCount === 0 ? "forum-insight-lead" : "forum-insight-paragraph"
    const paragraph =
      block.type === "p-rich"
        ? createRichParagraph(blockValue, paragraphClass)
        : createParagraph(blockValue, paragraphClass)

    appendInsightNode(container, lastSection, paragraph)
  }

  const setCommentFeedback = (type, text) => {
    const node = document.querySelector("[data-topic-comment-feedback]")
    if (!node) return

    if (!text) {
      node.classList.add("hidden")
      node.className = "hidden mt-3 rounded-md border px-3 py-2 text-sm"
      node.textContent = ""
      return
    }

    node.classList.remove("hidden")
    node.textContent = text
    node.className = "mt-3 rounded-md border px-3 py-2 text-sm"

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

  const renderComments = (topic, lang) => {
    const copy = commentI18n[lang] || commentI18n.en
    const comments = getTopicComments(topic.slug)

    const titleNode = document.querySelector("[data-topic-comments-title]")
    if (titleNode) titleNode.textContent = copy.title

    const countNode = document.querySelector("[data-topic-comments-count]")
    if (countNode) countNode.textContent = copy.count(comments.length)

    const subtitleNode = document.querySelector("[data-topic-comments-subtitle]")
    if (subtitleNode) subtitleNode.textContent = copy.subtitle

    const emptyNode = document.querySelector("[data-topic-comments-empty]")
    if (emptyNode) emptyNode.textContent = copy.empty

    const formTitleNode = document.querySelector("[data-topic-comment-form-title]")
    if (formTitleNode) formTitleNode.textContent = copy.formTitle

    const labelName = document.querySelector("[data-topic-comment-label-name]")
    if (labelName) labelName.textContent = copy.name

    const labelLocation = document.querySelector("[data-topic-comment-label-location]")
    if (labelLocation) labelLocation.textContent = copy.location

    const labelMessage = document.querySelector("[data-topic-comment-label-message]")
    if (labelMessage) labelMessage.textContent = copy.message

    const submitButton = document.querySelector("[data-topic-comment-submit]")
    if (submitButton) {
      submitButton.textContent = copy.submit
      submitButton.disabled = !forumClient?.canSubmitComments
      submitButton.classList.toggle("opacity-60", !forumClient?.canSubmitComments)
      submitButton.classList.toggle("cursor-not-allowed", !forumClient?.canSubmitComments)
    }

    const noteNode = document.querySelector("[data-topic-comment-form-note]")
    if (noteNode) {
      noteNode.textContent = forumClient?.canSubmitComments ? copy.note : copy.feedbackDisabled
    }

    const inputName = document.querySelector("[data-topic-comment-name]")
    if (inputName) inputName.placeholder = copy.namePlaceholder

    const inputLocation = document.querySelector("[data-topic-comment-location]")
    if (inputLocation) inputLocation.placeholder = copy.locationPlaceholder

    const inputMessage = document.querySelector("[data-topic-comment-message]")
    if (inputMessage) inputMessage.placeholder = copy.messagePlaceholder

    const listNode = document.querySelector("[data-topic-comments-list]")
    if (listNode) {
      listNode.innerHTML = ""
      comments.forEach((comment) => {
        const card = document.createElement("article")
        card.className = "rounded-lg border border-border bg-card px-4 py-3"

        const header = document.createElement("div")
        header.className = "flex flex-wrap items-center justify-between gap-2"

        const author = document.createElement("strong")
        author.className = "text-sm text-foreground"
        author.textContent = comment.author || copy.anonymous

        const meta = document.createElement("span")
        meta.className = "text-xs text-muted-foreground"
        const location = comment.location || copy.locationFallback
        const date = formatDate(comment.createdAt, lang)
        meta.textContent = date ? `${location} · ${date}` : location

        header.append(author, meta)

        const content = document.createElement("p")
        content.className = "mt-2 text-sm leading-relaxed text-foreground/90"
        content.textContent = comment.content

        card.append(header, content)
        listNode.appendChild(card)
      })
    }

    if (emptyNode) {
      emptyNode.classList.toggle("hidden", comments.length > 0)
    }

    return comments.length
  }

  const bindCommentForm = () => {
    const form = document.querySelector("[data-topic-comment-form]")
    if (!form || form.dataset.bound === "1") return

    form.dataset.bound = "1"
    form.addEventListener("submit", async (event) => {
      event.preventDefault()

      const lang = localStorage.getItem("portfolioLang") || "en"
      const copy = commentI18n[lang] || commentI18n.en

      if (!forumClient?.canSubmitComments) {
        setCommentFeedback("warning", copy.feedbackDisabled)
        return
      }

      const nameInput = form.querySelector("[data-topic-comment-name]")
      const locationInput = form.querySelector("[data-topic-comment-location]")
      const messageInput = form.querySelector("[data-topic-comment-message]")

      const authorName = (nameInput?.value || "").trim() || copy.anonymous
      const location = (locationInput?.value || "").trim()
      const message = (messageInput?.value || "").trim()

      if (!message) {
        setCommentFeedback("error", copy.feedbackMessageRequired)
        return
      }

      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone || ""
      const payload = {
        topicSlug: activeTopic?.slug || "",
        topicTitle: activeTopic ? pickLang(activeTopic.title, lang) : "",
        authorName,
        location: location || timezone,
        message,
        language: lang,
        timezone,
        pagePath: window.location.pathname + window.location.search,
        visitorId: forumClient.getVisitorId(),
        sessionId: forumClient.getSessionId(),
        submittedAt: new Date().toISOString(),
      }

      const submitButton = form.querySelector("[data-topic-comment-submit]")
      if (submitButton) {
        submitButton.disabled = true
        submitButton.classList.add("opacity-70")
      }

      const result = await forumClient.submitComment(payload)

      if (submitButton) {
        submitButton.disabled = false
        submitButton.classList.remove("opacity-70")
      }

      if (result.ok) {
        if (messageInput) messageInput.value = ""
        setCommentFeedback("success", copy.feedbackPending)

        if (forumClient?.canTrackEvents) {
          forumClient.trackEvent({
            eventType: "comment_submit",
            page: "forum_topic",
            topicSlug: payload.topicSlug,
            dedupeKey: `comment-submit:${payload.topicSlug}:${Date.now()}`,
          })
        }
        return
      }

      setCommentFeedback("error", copy.feedbackError)
    })
  }

  const render = (showNotice = false) => {
    const lang = localStorage.getItem("portfolioLang") || "en"
    const topic = getTopic(activeTopicSlug) || topics[0]
    activeTopic = topic

    const layout = resolveLayout(topic)
    const topicComments = getTopicComments(topic.slug)
    const topicMetric = getTopicMetric(topic.slug)

    const title = pickLang(topic.title, lang)
    const excerpt = pickLang(topic.excerpt, lang)
    const categoryLabel = pickLang(categoryLabels[topic.category] || {}, lang) || topic.category
    const layoutLabel = pickLang(detailLayoutLabels[layout] || {}, lang) || layout

    const approvedCommentCount = Number(topicMetric.comments) || topicComments.length
    const approvedTopicViews = Number(topicMetric.views) || Number(topic.stats?.views) || 0

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
    if (repliesNode) {
      const fallbackReplies = Number(topic.stats?.replies) || 0
      repliesNode.textContent = formatNumber(approvedCommentCount || fallbackReplies, lang)
    }

    const viewsNode = document.querySelector("[data-topic-views]")
    if (viewsNode) {
      viewsNode.textContent = formatNumber(approvedTopicViews, lang)
    }

    const updatedNode = document.querySelector("[data-topic-updated]")
    if (updatedNode) updatedNode.textContent = formatDate(topic.date, lang)

    const readTimeNode = document.querySelector("[data-topic-readtime]")
    if (readTimeNode) readTimeNode.textContent = pickLang(topic.readTime, lang)

    const layoutNode = document.querySelector("[data-topic-layout]")
    if (layoutNode) layoutNode.textContent = layoutLabel

    const layoutBadgeNode = document.querySelector("[data-topic-layout-badge]")
    if (layoutBadgeNode) layoutBadgeNode.textContent = layoutLabel

    const categoryNode = document.querySelector("[data-topic-category]")
    if (categoryNode) categoryNode.textContent = categoryLabel

    const categoryDetail = document.querySelector("[data-topic-category-detail]")
    if (categoryDetail) categoryDetail.textContent = categoryLabel

    const siteVisitorsNode = document.querySelector("[data-site-visitors]")
    if (siteVisitorsNode) siteVisitorsNode.textContent = formatNumber(approvedMetrics?.site?.visitors || 0, lang)

    const siteViewsNode = document.querySelector("[data-site-views]")
    if (siteViewsNode) siteViewsNode.textContent = formatNumber(approvedMetrics?.site?.pageViews || 0, lang)

    const topicVisitorsNode = document.querySelector("[data-topic-visitors]")
    if (topicVisitorsNode) topicVisitorsNode.textContent = formatNumber(topicMetric?.visitors || 0, lang)

    const topicCommentsNode = document.querySelector("[data-topic-comments-total]")
    if (topicCommentsNode) topicCommentsNode.textContent = formatNumber(approvedCommentCount, lang)

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
        badge.className =
          "forum-tag-chip inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-white/15 text-white"
        if (detailLayoutByTag[tag]) {
          badge.classList.add("bg-white/25")
        }
        badge.textContent = pickLang(tagLabels[tag] || {}, lang) || tag
        tagsWrap.appendChild(badge)
      })
    }

    const contentWrap = document.querySelector("[data-topic-content]")
    if (contentWrap) {
      contentWrap.innerHTML = ""
      if (layout === "dialogue") {
        contentWrap.className = "forum-dialogue"
      } else if (layout === "insight") {
        contentWrap.className = "forum-insight"
      } else {
        contentWrap.className = "forum-article space-y-6"
      }

      ;(topic.content || []).forEach((block) => {
        if (layout === "dialogue") {
          renderDialogueBlock(contentWrap, block, lang)
          return
        }

        if (layout === "insight") {
          renderInsightBlock(contentWrap, block, lang)
          return
        }

        renderArticleBlock(contentWrap, block, lang)
      })
    }

    renderComments(topic, lang)

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
        link.className =
          "group flex flex-col gap-1 rounded-lg border border-border px-3 py-2 hover:bg-muted transition-colors no-underline"

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
        notice.textContent =
          lang === "zh"
            ? "未找到对应话题，已为你展示最新话题。"
            : "Topic not found. Showing the latest topic instead."
        main.prepend(notice)
      }
    }

    bindCommentForm()
  }

  const topicForTracking = getTopic(activeTopicSlug) || topics[0]

  if (forumClient?.canTrackEvents) {
    forumClient.trackEvent({
      eventType: "page_view",
      page: "forum_topic",
      topicSlug: topicForTracking.slug,
      topicTitle: pickLang(topicForTracking.title, "en"),
      dedupeKey: `forum-topic:${topicForTracking.slug}:${window.location.pathname}${window.location.search}`,
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
      render(showNotice)
    } catch (error) {
      // keep fallback data
    }
  }

  render(showNotice)
  hydrateApprovedData()

  document.querySelectorAll("[data-lang]").forEach((button) => {
    button.addEventListener("click", () => {
      render(showNotice)
    })
  })
})()
