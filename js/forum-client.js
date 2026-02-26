(() => {
  const baseUrl = document.body?.dataset.baseurl || ""
  const config = Object.assign({}, window.BEHOP_FORUM_CONFIG || {})
  const supabaseKey = config.supabasePublishableKey || config.supabaseAnonKey || ""

  const withBaseUrl = (path) => {
    if (!path) return ""
    if (/^https?:\/\//i.test(path)) return path
    return `${baseUrl}${path}`.replace(/\/+/g, "/")
  }

  const isSupabaseRestUrl = (url) =>
    /^https:\/\/[^/]+\.supabase\.co\/rest\/v1\/[^/?#]+/i.test(String(url || ""))

  const toTrimmedString = (value) => {
    if (typeof value === "string") return value.trim()
    if (value === null || value === undefined) return ""
    return String(value).trim()
  }

  const pickLang = (value, lang) => {
    if (!value || typeof value === "string") return value || ""
    return value[lang] || value.en || value.zh || ""
  }

  const normalizeLocalized = (value, fallback = "") => {
    if (value && typeof value === "object" && !Array.isArray(value)) {
      return {
        en: toTrimmedString(value.en || value.zh || fallback),
        zh: toTrimmedString(value.zh || value.en || fallback),
      }
    }

    const text = toTrimmedString(value || fallback)
    return {
      en: text,
      zh: text,
    }
  }

  const createInitials = (name) => {
    const text = toTrimmedString(name)
    if (!text) return "AN"

    const words = text.split(/\s+/).filter(Boolean)
    if (words.length >= 2) {
      return `${words[0][0] || ""}${words[1][0] || ""}`.toUpperCase()
    }

    const compact = text.replace(/\s+/g, "")
    return compact.slice(0, 2).toUpperCase()
  }

  const sanitizeSlug = (value) => {
    const source = toTrimmedString(value)
      .toLowerCase()
      .replace(/['’]/g, "")
      .replace(/[^a-z0-9\s-]/g, " ")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "")

    return source
  }

  const normalizeTags = (value, fallbackTag) => {
    const raw = Array.isArray(value)
      ? value
      : typeof value === "string"
        ? value.split(/[,|]/)
        : []

    const tags = raw
      .map((item) => toTrimmedString(item).toLowerCase())
      .filter(Boolean)

    if (fallbackTag && !tags.includes(fallbackTag)) {
      tags.unshift(fallbackTag)
    }

    return [...new Set(tags)]
  }

  const toShortExcerpt = (text, max = 120) => {
    const source = toTrimmedString(text)
    if (!source) return ""
    if (source.length <= max) return source
    return `${source.slice(0, max).trim()}...`
  }

  const splitParagraphs = (text) =>
    toTrimmedString(text)
      .split(/\n+/)
      .map((line) => line.trim())
      .filter(Boolean)

  const extractMessageFromBlocks = (blocks) => {
    if (!Array.isArray(blocks)) return ""

    const lines = []
    blocks.forEach((block) => {
      if (!block || typeof block !== "object") return

      if (block.type === "p" || block.type === "p-rich" || block.type === "h2") {
        const text = pickLang(block, "en") || pickLang(block, "zh")
        if (text) lines.push(toTrimmedString(String(text).replace(/<[^>]+>/g, " ")))
      }
    })

    return lines.filter(Boolean).join("\n")
  }

  const buildReadTime = (titleText, messageText) => {
    const enWords = `${titleText} ${messageText}`.trim().split(/\s+/).filter(Boolean).length
    const zhChars = `${titleText}${messageText}`.replace(/\s+/g, "").length

    const enMinutes = Math.max(1, Math.round(enWords / 220) || 1)
    const zhMinutes = Math.max(1, Math.round(zhChars / 280) || 1)

    return {
      en: `${enMinutes} min`,
      zh: `${zhMinutes} 分钟`,
    }
  }

  const buildArticleBlocks = (message) => {
    const paragraphs = splitParagraphs(message)

    const blocks = [
      {
        type: "h2",
        en: "Question",
        zh: "问题",
      },
    ]

    if (!paragraphs.length) {
      blocks.push({ type: "p", en: "", zh: "" })
      return blocks
    }

    paragraphs.slice(0, 10).forEach((line) => {
      blocks.push({ type: "p", en: line, zh: line })
    })

    return blocks
  }

  const parseTopicSlugFromPage = (page) => {
    if (!page) return ""

    try {
      const parsed = new URL(page, "https://behop.local")
      const fromQuery = parsed.searchParams.get("topic")
      if (fromQuery) return decodeURIComponent(fromQuery)

      const pathMatch = parsed.pathname.match(/\/forum\/topic\/([^/?#]+)/)
      if (pathMatch?.[1]) return decodeURIComponent(pathMatch[1])
    } catch (error) {
      // ignore parse issues
    }

    const queryMatch = String(page).match(/[?&]topic=([^&#]+)/)
    if (queryMatch?.[1]) return decodeURIComponent(queryMatch[1])

    return ""
  }

  const normalizeTopic = (item, index = 0) => {
    if (!item || typeof item !== "object") return null

    const rawContentBlocks = Array.isArray(item.content) ? item.content : null
    const rawMessage =
      toTrimmedString(item.message || item.body || item.contentText || (typeof item.content === "string" ? item.content : "")) ||
      extractMessageFromBlocks(rawContentBlocks)

    const localizedTitle = normalizeLocalized(item.title || item.topicTitle || item.name || "", "")
    const titleFallback = localizedTitle.en || localizedTitle.zh || toShortExcerpt(rawMessage, 36) || "Message"

    const slugSeed =
      item.slug ||
      item.topicSlug ||
      parseTopicSlugFromPage(item.page || item.pagePath || "") ||
      `${titleFallback}-${item.id || item.createdAt || item.created_at || index}`

    const slug = sanitizeSlug(slugSeed)
    if (!slug) return null

    const excerptText = toTrimmedString(item.excerpt || "") || toShortExcerpt(rawMessage, 140)
    const localizedExcerpt = normalizeLocalized(excerptText, toShortExcerpt(titleFallback, 80))

    const authorName =
      toTrimmedString(item.authorName || (typeof item.author === "object" ? item.author.name : item.author)) ||
      "Anonymous"

    const category =
      toTrimmedString(item.category || item.topicCategory || config.topicDefaultCategory || "message") || "message"

    const fallbackTag =
      toTrimmedString(config.topicDefaultTag || "message") || "message"

    const tags = normalizeTags(item.tags, fallbackTag)
    if (!tags.length) tags.push(fallbackTag)

    const title = {
      en: toTrimmedString(localizedTitle.en || localizedTitle.zh || titleFallback),
      zh: toTrimmedString(localizedTitle.zh || localizedTitle.en || titleFallback),
    }

    const messageText = rawMessage || title.en || title.zh
    const content = rawContentBlocks?.length ? rawContentBlocks : buildArticleBlocks(messageText)

    const date =
      toTrimmedString(item.date || item.createdAt || item.created_at || item.submittedAt) || new Date().toISOString()

    const readTime = item.readTime && typeof item.readTime === "object" ? item.readTime : buildReadTime(title.en, messageText)

    return {
      slug,
      category,
      tags,
      author:
        item.author && typeof item.author === "object"
          ? {
              name: toTrimmedString(item.author.name || authorName) || authorName,
              initials: toTrimmedString(item.author.initials || createInitials(authorName)) || createInitials(authorName),
              role: normalizeLocalized(item.author.role || "Community", "Community"),
            }
          : {
              name: authorName,
              initials: createInitials(authorName),
              role: normalizeLocalized("Community", "Community"),
            },
      stats: {
        replies: Number(item.stats?.replies || item.replies) || 0,
        views: Number(item.stats?.views || item.views) || 0,
      },
      date,
      readTime: {
        en: toTrimmedString(readTime.en) || "1 min",
        zh: toTrimmedString(readTime.zh) || "1 分钟",
      },
      title,
      excerpt: {
        en: toTrimmedString((item.excerpt && item.excerpt.en) || localizedExcerpt.en || title.en),
        zh: toTrimmedString((item.excerpt && item.excerpt.zh) || localizedExcerpt.zh || title.zh),
      },
      content,
      status: toTrimmedString(item.status || config.topicInitialStatus || "approved") || "approved",
      source: toTrimmedString(item.source || "community") || "community",
      localDraft: Boolean(item.localDraft),
    }
  }

  const normalizeTopics = (raw) => {
    const source = Array.isArray(raw) ? raw : raw?.topics
    if (!Array.isArray(source)) return []

    const seen = new Set()
    const topics = []

    source.forEach((item, index) => {
      const topic = normalizeTopic(item, index)
      if (!topic || !topic.slug || seen.has(topic.slug)) return
      seen.add(topic.slug)
      topics.push(topic)
    })

    return topics
  }

  const getSupabaseHeaders = () => {
    if (!supabaseKey) return null
    return {
      apikey: supabaseKey,
      Authorization: `Bearer ${supabaseKey}`,
      Prefer: "return=minimal",
    }
  }

  const requestTimeoutMs = Number(config.requestTimeoutMs) || 8000
  const approvedCommentsUrl = withBaseUrl(config.approvedCommentsPath || "/assets/data/forum-comments-approved.json")
  const approvedTopicsUrl = withBaseUrl(config.approvedTopicsPath || "/assets/data/forum-topics-approved.json")
  const approvedMetricsUrl = withBaseUrl(config.approvedMetricsPath || "/assets/data/forum-metrics-approved.json")

  const parseJSONSafe = async (response) => {
    try {
      return await response.json()
    } catch (error) {
      return null
    }
  }

  const postJson = async (url, payload, options = {}) => {
    if (!url) {
      return { ok: false, reason: "missing_url" }
    }

    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), requestTimeoutMs)

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: Object.assign(
          {
            "Content-Type": "application/json",
          },
          options.headers || {}
        ),
        body: JSON.stringify(payload || {}),
        signal: controller.signal,
      })

      const body = await parseJSONSafe(response)
      if (!response.ok) {
        return {
          ok: false,
          status: response.status,
          body,
        }
      }

      return {
        ok: true,
        status: response.status,
        body,
      }
    } catch (error) {
      return {
        ok: false,
        reason: error?.name === "AbortError" ? "timeout" : "network_error",
        error: String(error),
      }
    } finally {
      clearTimeout(timer)
    }
  }

  const getOrCreate = (storage, key, createValue) => {
    try {
      const cached = storage.getItem(key)
      if (cached) return cached
      const next = createValue()
      storage.setItem(key, next)
      return next
    } catch (error) {
      return createValue()
    }
  }

  const createId = () => {
    if (window.crypto && window.crypto.randomUUID) return window.crypto.randomUUID()
    return `id-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
  }

  const getVisitorId = () => getOrCreate(localStorage, "forumVisitorId", createId)
  const getSessionId = () => getOrCreate(sessionStorage, "forumSessionId", createId)

  const hasSessionEvent = (key) => {
    try {
      return sessionStorage.getItem(key) === "1"
    } catch (error) {
      return false
    }
  }

  const markSessionEvent = (key) => {
    try {
      sessionStorage.setItem(key, "1")
    } catch (error) {
      // ignore storage errors
    }
  }

  const fetchJson = async (url, fallbackValue) => {
    try {
      const response = await fetch(url, { cache: "no-store" })
      if (!response.ok) return fallbackValue
      const data = await response.json()
      return data ?? fallbackValue
    } catch (error) {
      return fallbackValue
    }
  }

  const normalizeComments = (raw) => {
    const source = Array.isArray(raw) ? raw : raw?.comments
    if (!Array.isArray(source)) return []
    return source
      .map((item) => ({
        id: item.id || createId(),
        topicSlug: item.topicSlug || item.topic || "",
        author: item.author || item.authorName || "Anonymous",
        location: item.location || "",
        content: item.content || item.message || "",
        createdAt: item.createdAt || item.approvedAt || item.submittedAt || "",
        status: item.status || "approved",
      }))
      .filter((item) => item.topicSlug && item.content)
  }

  const normalizeMetrics = (raw) => {
    const site = raw?.site || {}
    const topics = raw?.topics || {}
    return {
      updatedAt: raw?.updatedAt || "",
      site: {
        visitors: Number(site.visitors) || 0,
        pageViews: Number(site.pageViews) || 0,
        comments: Number(site.comments) || 0,
        todayVisitors: Number(site.todayVisitors) || 0,
      },
      topics,
    }
  }

  const submitComment = async (payload) => {
    if (!config.commentSubmitUrl) {
      return { ok: false, reason: "missing_url" }
    }

    if (isSupabaseRestUrl(config.commentSubmitUrl)) {
      const headers = getSupabaseHeaders()
      if (!headers) {
        return { ok: false, reason: "missing_supabase_key" }
      }

      const mappedPayload = {
        content: payload?.message || payload?.content || "",
        author: payload?.authorName || payload?.author || "Anonymous",
        status: "pending",
        location: payload?.location || "",
        page: payload?.pagePath || payload?.page || `${window.location.pathname}${window.location.search}`,
      }

      return postJson(config.commentSubmitUrl, mappedPayload, { headers })
    }

    return postJson(config.commentSubmitUrl, payload)
  }

  const submitTopic = async (payload) => {
    if (!config.topicSubmitUrl) {
      return { ok: false, reason: "missing_url" }
    }

    if (isSupabaseRestUrl(config.topicSubmitUrl)) {
      const headers = getSupabaseHeaders()
      if (!headers) {
        return { ok: false, reason: "missing_supabase_key" }
      }

      const mappedPayload = {
        slug: sanitizeSlug(payload?.slug || ""),
        title: toTrimmedString(payload?.title || payload?.topicTitle || ""),
        message: toTrimmedString(payload?.message || payload?.content || ""),
        excerpt: toTrimmedString(payload?.excerpt || ""),
        author: toTrimmedString(payload?.authorName || payload?.author || "Anonymous") || "Anonymous",
        category:
          toTrimmedString(payload?.category || config.topicDefaultCategory || "message") || "message",
        tags: normalizeTags(payload?.tags, toTrimmedString(config.topicDefaultTag || "message") || "message"),
        status: toTrimmedString(payload?.status || config.topicInitialStatus || "pending") || "pending",
        language: toTrimmedString(payload?.language || ""),
        location: toTrimmedString(payload?.location || ""),
        page: payload?.pagePath || payload?.page || `${window.location.pathname}${window.location.search}`,
      }

      return postJson(config.topicSubmitUrl, mappedPayload, { headers })
    }

    return postJson(config.topicSubmitUrl, payload)
  }

  const trackEvent = async (payload) => {
    const dedupeKey = payload?.dedupeKey ? `forum_event_once:${payload.dedupeKey}` : ""
    if (dedupeKey && hasSessionEvent(dedupeKey)) {
      return { ok: true, skipped: true }
    }

    const eventPayload = Object.assign(
      {
        eventType: payload?.eventType || "page_view",
        submittedAt: new Date().toISOString(),
        pagePath: window.location.pathname + window.location.search,
        referrer: document.referrer || "",
        language: navigator.language || "",
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || "",
        userAgent: navigator.userAgent || "",
        visitorId: getVisitorId(),
        sessionId: getSessionId(),
      },
      payload || {}
    )

    if (!config.eventSubmitUrl) {
      return { ok: false, reason: "missing_url" }
    }

    let result
    if (isSupabaseRestUrl(config.eventSubmitUrl)) {
      const headers = getSupabaseHeaders()
      if (!headers) {
        return { ok: false, reason: "missing_supabase_key" }
      }

      const mappedPayload = {
        event_type: eventPayload?.eventType || "page_view",
        page: eventPayload?.page || "",
        page_path: eventPayload?.pagePath || "",
        topic_slug: eventPayload?.topicSlug || "",
        topic_title: eventPayload?.topicTitle || "",
        category: eventPayload?.category || "",
        filter: eventPayload?.filter || "",
        sort: eventPayload?.sort || "",
        visitor_id: eventPayload?.visitorId || "",
        session_id: eventPayload?.sessionId || "",
        referrer: eventPayload?.referrer || "",
        language: eventPayload?.language || "",
        timezone: eventPayload?.timezone || "",
        user_agent: eventPayload?.userAgent || "",
        submitted_at: eventPayload?.submittedAt || new Date().toISOString(),
      }

      result = await postJson(config.eventSubmitUrl, mappedPayload, { headers })
    } else {
      result = await postJson(config.eventSubmitUrl, eventPayload)
    }

    if (result.ok && dedupeKey) {
      markSessionEvent(dedupeKey)
    }
    return result
  }

  const formatNumber = (value, lang) => {
    const locale = lang === "zh" ? "zh-CN" : "en-US"
    const number = Number(value) || 0
    return new Intl.NumberFormat(locale).format(number)
  }

  window.FORUM_CLIENT = {
    config,
    approvedCommentsUrl,
    approvedTopicsUrl,
    approvedMetricsUrl,
    canSubmitComments:
      Boolean(config.commentSubmitUrl) &&
      (!isSupabaseRestUrl(config.commentSubmitUrl) || Boolean(supabaseKey)),
    canSubmitTopics:
      Boolean(config.topicSubmitUrl) &&
      (!isSupabaseRestUrl(config.topicSubmitUrl) || Boolean(supabaseKey)),
    canTrackEvents:
      Boolean(config.eventSubmitUrl) &&
      (!isSupabaseRestUrl(config.eventSubmitUrl) || Boolean(supabaseKey)),
    getVisitorId,
    getSessionId,
    normalizeTopics,
    submitComment,
    submitTopic,
    trackEvent,
    fetchApprovedComments: async () => normalizeComments(await fetchJson(approvedCommentsUrl, { comments: [] })),
    fetchApprovedTopics: async () => normalizeTopics(await fetchJson(approvedTopicsUrl, { topics: [] })),
    fetchApprovedMetrics: async () => normalizeMetrics(await fetchJson(approvedMetricsUrl, {})),
    formatNumber,
  }
})()
