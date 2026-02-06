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
    approvedMetricsUrl,
    canSubmitComments:
      Boolean(config.commentSubmitUrl) &&
      (!isSupabaseRestUrl(config.commentSubmitUrl) || Boolean(supabaseKey)),
    canTrackEvents:
      Boolean(config.eventSubmitUrl) &&
      (!isSupabaseRestUrl(config.eventSubmitUrl) || Boolean(supabaseKey)),
    getVisitorId,
    getSessionId,
    submitComment,
    trackEvent,
    fetchApprovedComments: async () => normalizeComments(await fetchJson(approvedCommentsUrl, { comments: [] })),
    fetchApprovedMetrics: async () => normalizeMetrics(await fetchJson(approvedMetricsUrl, {})),
    formatNumber,
  }
})()
