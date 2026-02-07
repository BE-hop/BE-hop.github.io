#!/usr/bin/env node
import fs from "node:fs/promises"
import path from "node:path"

const root = process.cwd()
const outputPath = path.join(root, "assets/data/forum-comments-approved.json")

const readEnv = (key) => (process.env[key] || "").trim()

const parseTopicSlugFromPage = (page) => {
  if (!page) return ""

  try {
    const parsed = new URL(page, "https://behop.local")
    const fromQuery = parsed.searchParams.get("topic")
    if (fromQuery) return fromQuery

    const pathMatch = parsed.pathname.match(/\/forum\/topic\/([^/?#]+)/)
    if (pathMatch?.[1]) return decodeURIComponent(pathMatch[1])
  } catch (error) {
    // ignore parse issues
  }

  const queryMatch = String(page).match(/[?&]topic=([^&#]+)/)
  if (queryMatch?.[1]) return decodeURIComponent(queryMatch[1])

  return ""
}

const buildApprovedCommentsUrl = (commentSubmitUrl) => {
  const endpoint = new URL(commentSubmitUrl)
  endpoint.searchParams.set("select", "id,created_at,content,author,status,location,page")
  endpoint.searchParams.set("order", "created_at.desc")
  return endpoint.toString()
}

const fetchApprovedRows = async ({ commentSubmitUrl, supabaseKey }) => {
  const url = buildApprovedCommentsUrl(commentSubmitUrl)
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

const normalizeRow = (row) => {
  const topicSlug = row.topicSlug || row.topic_slug || parseTopicSlugFromPage(row.page || "")
  return {
    id: String(row.id ?? ""),
    topicSlug,
    author: row.author || "Anonymous",
    location: row.location || "",
    content: row.content || "",
    createdAt: row.created_at || "",
    status: "approved",
  }
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

const main = async () => {
  const commentSubmitUrl = readEnv("FORUM_COMMENT_SUBMIT_URL")
  const supabaseKey = readEnv("SUPABASE_SERVICE_ROLE_KEY")

  if (!commentSubmitUrl) {
    throw new Error("FORUM_COMMENT_SUBMIT_URL is required (use GitHub repository secret)")
  }
  if (!/\.supabase\.co\/rest\/v1\//i.test(commentSubmitUrl)) {
    throw new Error("FORUM_COMMENT_SUBMIT_URL is not a Supabase REST endpoint")
  }
  if (!supabaseKey) {
    throw new Error("SUPABASE_SERVICE_ROLE_KEY is required (use GitHub repository secret)")
  }
  if (!looksLikeServiceRoleKey(supabaseKey)) {
    throw new Error(
      "SUPABASE_SERVICE_ROLE_KEY does not look like a service role key. Check GitHub secret value."
    )
  }

  const rows = await fetchApprovedRows({ commentSubmitUrl, supabaseKey })
  const statusCounts = countByStatus(rows)
  const approvedRows = rows.filter((row) => isApprovedStatus(row.status))
  const normalized = approvedRows.map(normalizeRow)
  const comments = normalized.filter((item) => item.topicSlug && item.content)
  const skipped = normalized.length - comments.length
  const nonApproved = rows.length - approvedRows.length

  const output = {
    updatedAt: new Date().toISOString(),
    comments,
  }

  await fs.writeFile(outputPath, `${JSON.stringify(output, null, 2)}\n`, "utf8")

  process.stdout.write(
    `Updated ${path.relative(root, outputPath)}\n` +
      `- rows fetched: ${rows.length}\n` +
      `- rows by status: ${JSON.stringify(statusCounts)}\n` +
      `- approved status matched: ${approvedRows.length}\n` +
      `- status filtered out: ${nonApproved}\n` +
      `- comments written: ${comments.length}\n` +
      `- skipped (missing topic/content): ${skipped}\n`
  )
}

main().catch((error) => {
  process.stderr.write(`${error?.stack || error}\n`)
  process.exit(1)
})
