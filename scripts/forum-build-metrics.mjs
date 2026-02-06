#!/usr/bin/env node
import fs from "node:fs/promises"
import path from "node:path"

const root = process.cwd()
const commentsPath = path.join(root, "assets/data/forum-comments-approved.json")
const eventsPath = path.join(root, "assets/data/forum-events-approved.json")
const metricsPath = path.join(root, "assets/data/forum-metrics-approved.json")

const parseFile = async (filePath, fallback) => {
  try {
    const raw = await fs.readFile(filePath, "utf8")
    return JSON.parse(raw)
  } catch (error) {
    return fallback
  }
}

const toArray = (value, key) => {
  if (Array.isArray(value)) return value
  if (Array.isArray(value?.[key])) return value[key]
  return []
}

const normalizeComment = (item) => ({
  topicSlug: item.topicSlug || item.topic || "",
  status: item.status || "approved",
  createdAt: item.createdAt || item.approvedAt || item.submittedAt || "",
})

const normalizeEvent = (item) => ({
  eventType: item.eventType || item.type || "page_view",
  topicSlug: item.topicSlug || item.topic || "",
  visitorId: item.visitorId || item.userId || "",
  submittedAt: item.submittedAt || item.createdAt || "",
  status: item.status || "approved",
})

const loadData = async () => {
  const commentsRaw = await parseFile(commentsPath, { comments: [] })
  const eventsRaw = await parseFile(eventsPath, { events: [] })

  const comments = toArray(commentsRaw, "comments")
    .map(normalizeComment)
    .filter((item) => item.topicSlug && item.status === "approved")

  const events = toArray(eventsRaw, "events")
    .map(normalizeEvent)
    .filter((item) => item.eventType === "page_view" && item.status === "approved")

  return { comments, events }
}

const buildMetrics = ({ comments, events }) => {
  const siteVisitorSet = new Set()
  const todayVisitorSet = new Set()
  const topicVisitorSetMap = new Map()
  const topicViewsMap = new Map()
  const topicCommentsMap = new Map()

  const now = Date.now()
  const last24h = now - 24 * 60 * 60 * 1000

  events.forEach((event) => {
    const topicSlug = event.topicSlug
    const visitorId = event.visitorId

    if (visitorId) {
      siteVisitorSet.add(visitorId)

      const eventTs = event.submittedAt ? new Date(event.submittedAt).getTime() : NaN
      if (!Number.isNaN(eventTs) && eventTs >= last24h) {
        todayVisitorSet.add(visitorId)
      }

      if (topicSlug) {
        if (!topicVisitorSetMap.has(topicSlug)) topicVisitorSetMap.set(topicSlug, new Set())
        topicVisitorSetMap.get(topicSlug).add(visitorId)
      }
    }

    if (topicSlug) {
      topicViewsMap.set(topicSlug, (topicViewsMap.get(topicSlug) || 0) + 1)
    }
  })

  comments.forEach((comment) => {
    topicCommentsMap.set(comment.topicSlug, (topicCommentsMap.get(comment.topicSlug) || 0) + 1)
  })

  const topicSlugs = new Set([
    ...topicViewsMap.keys(),
    ...topicCommentsMap.keys(),
    ...topicVisitorSetMap.keys(),
  ])

  const topics = {}
  topicSlugs.forEach((slug) => {
    topics[slug] = {
      visitors: topicVisitorSetMap.get(slug)?.size || 0,
      views: topicViewsMap.get(slug) || 0,
      comments: topicCommentsMap.get(slug) || 0,
      updatedAt: new Date().toISOString(),
    }
  })

  return {
    updatedAt: new Date().toISOString(),
    site: {
      visitors: siteVisitorSet.size,
      pageViews: events.length,
      comments: comments.length,
      todayVisitors: todayVisitorSet.size,
    },
    topics,
  }
}

const main = async () => {
  const data = await loadData()
  const metrics = buildMetrics(data)

  await fs.writeFile(metricsPath, `${JSON.stringify(metrics, null, 2)}\n`, "utf8")

  process.stdout.write(
    `Updated ${path.relative(root, metricsPath)}\n` +
      `- site visitors: ${metrics.site.visitors}\n` +
      `- page views: ${metrics.site.pageViews}\n` +
      `- approved comments: ${metrics.site.comments}\n`
  )
}

main().catch((error) => {
  process.stderr.write(`${error?.stack || error}\n`)
  process.exit(1)
})
