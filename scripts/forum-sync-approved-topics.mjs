#!/usr/bin/env node
import fs from "node:fs/promises"
import path from "node:path"

const root = process.cwd()
const outputPath = path.join(root, "assets/data/forum-topics-approved.json")

const readEnv = (key) => (process.env[key] || "").trim()

const toTrimmedString = (value) => {
  if (typeof value === "string") return value.trim()
  if (value === null || value === undefined) return ""
  return String(value).trim()
}

const sanitizeSlug = (value) =>
  toTrimmedString(value)
    .toLowerCase()
    .replace(/['’]/g, "")
    .replace(/[^a-z0-9\s-]/g, " ")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")

const buildApprovedTopicsUrl = (topicSubmitUrl) => {
  const endpoint = new URL(topicSubmitUrl)
  endpoint.searchParams.set(
    "select",
    "id,created_at,slug,title,message,excerpt,author,category,tags,status"
  )
  endpoint.searchParams.set("order", "created_at.desc")
  return endpoint.toString()
}

const fetchApprovedRows = async ({ topicSubmitUrl, supabaseKey }) => {
  const url = buildApprovedTopicsUrl(topicSubmitUrl)
  const response = await fetch(url, {
    method: "GET",
    headers: {
      apikey: supabaseKey,
      Authorization: `Bearer ${supabaseKey}`,
      Accept: "application/json",
    },
  })

  if (!response.ok) {
    const body = await response.text()
    throw new Error(`Supabase query failed (${response.status}): ${body}`)
  }

  const data = await response.json()
  if (!Array.isArray(data)) {
    throw new Error("Supabase response is not an array")
  }

  return data
}

const isApprovedStatus = (value) => {
  const normalized = String(value || "")
    .trim()
    .toLowerCase()
  return ["approved", "aproved", "approve", "accepted", "published", "pass"].includes(normalized)
}

const looksLikeServiceRoleKey = (key) => {
  if (!key) return false
  if (key.startsWith("sb_secret_")) return true
  if (key.startsWith("sb_publishable_")) return false
  if (key.split(".").length === 3) {
    try {
      const payload = key.split(".")[1]
      const decoded = Buffer.from(payload.replace(/-/g, "+").replace(/_/g, "/"), "base64").toString("utf8")
      return decoded.includes('"role":"service_role"') || decoded.includes('"role":"supabase_admin"')
    } catch (error) {
      return false
    }
  }
  return false
}

const countByStatus = (rows) => {
  const map = {}
  rows.forEach((row) => {
    const key = String(row?.status || "")
      .trim()
      .toLowerCase()
    map[key || "(empty)"] = (map[key || "(empty)"] || 0) + 1
  })
  return map
}

const normalizeTags = (value) => {
  const source = Array.isArray(value)
    ? value
    : typeof value === "string"
      ? value.split(/[,|]/)
      : []

  const tags = source
    .map((item) => String(item || "").trim().toLowerCase())
    .filter(Boolean)

  if (!tags.includes("message")) tags.unshift("message")
  return [...new Set(tags)]
}

const createInitials = (name) => {
  const text = toTrimmedString(name)
  if (!text) return "AN"

  const words = text.split(/\s+/).filter(Boolean)
  if (words.length >= 2) {
    return `${words[0][0] || ""}${words[1][0] || ""}`.toUpperCase()
  }

  return text.replace(/\s+/g, "").slice(0, 2).toUpperCase()
}

const shortExcerpt = (text, max = 140) => {
  const value = toTrimmedString(text)
  if (!value) return ""
  if (value.length <= max) return value
  return `${value.slice(0, max).trim()}...`
}

const buildReadTime = (text) => {
  const enWords = text.trim().split(/\s+/).filter(Boolean).length
  const zhChars = text.replace(/\s+/g, "").length
  return {
    en: `${Math.max(1, Math.round(enWords / 220) || 1)} min`,
    zh: `${Math.max(1, Math.round(zhChars / 280) || 1)} 分钟`,
  }
}

const buildContentBlocks = (message) => {
  const parts = message
    .split(/\n+/)
    .map((line) => line.trim())
    .filter(Boolean)

  const blocks = [{ type: "h2", en: "Question", zh: "问题" }]
  if (!parts.length) {
    blocks.push({ type: "p", en: "", zh: "" })
    return blocks
  }

  parts.slice(0, 10).forEach((line) => {
    blocks.push({ type: "p", en: line, zh: line })
  })

  return blocks
}

const normalizeRow = (row, index) => {
  const message = toTrimmedString(row.message)
  const titleRaw = toTrimmedString(row.title) || shortExcerpt(message, 48) || `Message ${index + 1}`
  const slug = sanitizeSlug(row.slug || `${titleRaw}-${row.id || row.created_at || index}`)
  if (!slug) return null

  const authorName = toTrimmedString(row.author) || "Anonymous"
  const excerpt = toTrimmedString(row.excerpt) || shortExcerpt(message)
  const combined = `${titleRaw} ${message}`.trim()

  return {
    slug,
    category: toTrimmedString(row.category || "message") || "message",
    tags: normalizeTags(row.tags),
    author: {
      name: authorName,
      initials: createInitials(authorName),
      role: {
        en: "Community",
        zh: "社区成员",
      },
    },
    stats: {
      replies: 0,
      views: 0,
    },
    date: toTrimmedString(row.created_at) || new Date().toISOString(),
    readTime: buildReadTime(combined || titleRaw),
    title: {
      en: titleRaw,
      zh: titleRaw,
    },
    excerpt: {
      en: excerpt || titleRaw,
      zh: excerpt || titleRaw,
    },
    content: buildContentBlocks(message || titleRaw),
    status: "approved",
    source: "community",
  }
}

const main = async () => {
  const topicSubmitUrl = readEnv("FORUM_TOPIC_SUBMIT_URL")
  const supabaseKey = readEnv("SUPABASE_SERVICE_ROLE_KEY")

  if (!topicSubmitUrl) {
    throw new Error("FORUM_TOPIC_SUBMIT_URL is required (use GitHub repository secret)")
  }
  if (!/\.supabase\.co\/rest\/v1\//i.test(topicSubmitUrl)) {
    throw new Error("FORUM_TOPIC_SUBMIT_URL is not a Supabase REST endpoint")
  }
  if (!supabaseKey) {
    throw new Error("SUPABASE_SERVICE_ROLE_KEY is required (use GitHub repository secret)")
  }
  if (!looksLikeServiceRoleKey(supabaseKey)) {
    throw new Error(
      "SUPABASE_SERVICE_ROLE_KEY does not look like a service role key. Check GitHub secret value."
    )
  }

  const rows = await fetchApprovedRows({ topicSubmitUrl, supabaseKey })
  const statusCounts = countByStatus(rows)

  const approvedRows = rows.filter((row) => isApprovedStatus(row.status))
  const topics = []
  const seen = new Set()

  approvedRows.forEach((row, index) => {
    const topic = normalizeRow(row, index)
    if (!topic || seen.has(topic.slug)) return
    seen.add(topic.slug)
    topics.push(topic)
  })

  const output = {
    updatedAt: new Date().toISOString(),
    topics,
  }

  await fs.writeFile(outputPath, `${JSON.stringify(output, null, 2)}\n`, "utf8")

  process.stdout.write(
    `Updated ${path.relative(root, outputPath)}\n` +
      `- rows fetched: ${rows.length}\n` +
      `- rows by status: ${JSON.stringify(statusCounts)}\n` +
      `- approved rows: ${approvedRows.length}\n` +
      `- topics written: ${topics.length}\n`
  )
}

main().catch((error) => {
  process.stderr.write(`${error?.stack || error}\n`)
  process.exit(1)
})
