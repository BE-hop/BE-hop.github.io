import { existsSync, lstatSync, readdirSync, readFileSync } from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const siteRoot = path.resolve(process.env.SITE_ROOT || path.join(root, "_site"))
const errors = []
const warnings = []

function walk(dir, predicate = () => true) {
  if (!existsSync(dir)) return []
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) return walk(full, predicate)
    return predicate(full) ? [full] : []
  })
}

function frontMatter(file) {
  const text = readFileSync(file, "utf8")
  const match = text.match(/^---\s*\n([\s\S]*?)\n---/)
  return match ? match[1] : ""
}

function hasKey(front, key) {
  return new RegExp(`^${key}:`, "m").test(front)
}

function resolveLocalTarget(htmlFile, rawValue) {
  const value = rawValue.split(/[?#]/, 1)[0]
  if (!value) return null
  let decoded = value
  try { decoded = decodeURIComponent(value) } catch { /* keep original */ }
  const target = decoded.startsWith("/")
    ? path.join(siteRoot, decoded.slice(1))
    : path.resolve(path.dirname(htmlFile), decoded)
  if (existsSync(target) && lstatSync(target).isFile()) return target
  if (existsSync(target) && lstatSync(target).isDirectory() && existsSync(path.join(target, "index.html"))) {
    return path.join(target, "index.html")
  }
  if (!path.extname(target) && existsSync(`${target}.html`)) return `${target}.html`
  return false
}

if (!existsSync(path.join(siteRoot, "index.html"))) {
  errors.push("_site/index.html is missing; run the Jekyll build first.")
}

for (const internal of ["content-editor", "career-trend-file", "docs", "test", "AGENTS.md", ".codex", ".content-editor"]) {
  if (existsSync(path.join(siteRoot, internal))) errors.push(`Internal path leaked into _site: ${internal}`)
}

const sourceHtml = walk(root, (file) => file.endsWith(".html") && !file.includes(`${path.sep}_site${path.sep}`) && !file.includes(`${path.sep}node_modules${path.sep}`))
for (const file of sourceHtml) {
  const text = readFileSync(file, "utf8")
  if (text.includes("cdn.tailwindcss.com") || /tailwind\s*=\s*\{/.test(text)) {
    errors.push(`Runtime Tailwind configuration remains: ${path.relative(root, file)}`)
  }
}

for (const file of walk(siteRoot, (item) => item.endsWith(".html"))) {
  const relative = path.relative(siteRoot, file)
  const original = readFileSync(file, "utf8")
  const html = original
    .replace(/<script\b[\s\S]*?<\/script>/gi, "")
    .replace(/<style\b[\s\S]*?<\/style>/gi, "")

  const ids = [...html.matchAll(/\sid=["']([^"']+)["']/gi)].map((match) => match[1])
  const duplicates = ids.filter((id, index) => ids.indexOf(id) !== index)
  if (duplicates.length) errors.push(`${relative}: duplicate ids: ${[...new Set(duplicates)].join(", ")}`)

  for (const match of html.matchAll(/\s(?:href|src)=["']([^"']+)["']/gi)) {
    const raw = match[1]
    if (raw !== raw.trim()) {
      errors.push(`${relative}: URL contains surrounding whitespace: ${JSON.stringify(raw)}`)
      continue
    }
    if (!raw || raw.startsWith("#") || /^(?:https?:|mailto:|tel:|data:|javascript:|\/\/)/i.test(raw)) continue
    const target = resolveLocalTarget(file, raw)
    if (target === false) errors.push(`${relative}: missing local target ${raw}`)
  }

  for (const match of html.matchAll(/<img\b([^>]*)>/gi)) {
    if (!/\salt=["'][^"']*["']/i.test(match[1])) warnings.push(`${relative}: image without alt attribute`)
  }
}

const imagePattern = /^(?:image|cover|thumbnail|before_image|after_image|background_image):\s*["']?(\/img\/[^"'\s]+)["']?\s*$/gm
for (const file of [
  ...walk(path.join(root, "_data"), (item) => /\.ya?ml$/.test(item)),
  ...walk(path.join(root, "_projects"), (item) => item.endsWith(".md")),
  ...walk(path.join(root, "_ai_products"), (item) => item.endsWith(".md")),
  ...walk(path.join(root, "_ai_gallery"), (item) => item.endsWith(".md")),
]) {
  const text = readFileSync(file, "utf8")
  for (const match of text.matchAll(imagePattern)) {
    if (!existsSync(path.join(root, match[1].slice(1)))) {
      errors.push(`${path.relative(root, file)}: missing image ${match[1]}`)
    }
  }
}

const postFiles = walk(path.join(root, "_posts"), (item) => item.endsWith(".md"))
for (const zhFile of postFiles.filter((file) => !file.endsWith("-en.md"))) {
  const front = frontMatter(zhFile)
  if (!/^lang:\s*zh\s*$/m.test(front)) continue
  const enFile = zhFile.replace(/\.md$/, "-en.md")
  if (!existsSync(enFile)) {
    errors.push(`${path.relative(root, zhFile)}: missing English pair`)
    continue
  }
  for (const file of [zhFile, enFile]) {
    const data = frontMatter(file)
    for (const key of ["layout", "title", "subtitle", "date", "author", "lang", "tags"]) {
      if (!hasKey(data, key)) errors.push(`${path.relative(root, file)}: missing front matter key ${key}`)
    }
  }
  const zhSections = readFileSync(zhFile, "utf8").split("\n").filter((line) => /^##\s+/.test(line)).length
  const enSections = readFileSync(enFile, "utf8").split("\n").filter((line) => /^##\s+/.test(line)).length
  if (zhSections !== enSections) errors.push(`${path.relative(root, zhFile)}: bilingual H2 section count differs (${zhSections}/${enSections})`)
}

for (const warning of [...new Set(warnings)].slice(0, 40)) process.stderr.write(`[warn] ${warning}\n`)
if (warnings.length > 40) process.stderr.write(`[warn] ${warnings.length - 40} additional warnings omitted.\n`)
if (errors.length) {
  for (const error of [...new Set(errors)]) process.stderr.write(`[error] ${error}\n`)
  process.exit(1)
}
process.stdout.write(`Site audit passed with ${warnings.length} warning(s).\n`)
