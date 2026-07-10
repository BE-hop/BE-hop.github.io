import { spawnSync } from "node:child_process"
import { mkdtempSync, readFileSync, rmSync } from "node:fs"
import { tmpdir } from "node:os"
import path from "node:path"
import { fileURLToPath } from "node:url"

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const tempDir = mkdtempSync(path.join(tmpdir(), "behop-tailwind-"))
const generated = path.join(tempDir, "tailwind.css")
const binary = path.join(root, "node_modules", ".bin", "tailwindcss")

try {
  const result = spawnSync(
    binary,
    ["-c", "tailwind.config.cjs", "-i", "css/tailwind-input.css", "-o", generated, "--minify"],
    { cwd: root, encoding: "utf8" }
  )
  if (result.status !== 0) {
    process.stderr.write(result.stderr || result.stdout || "Tailwind build failed.\n")
    process.exit(1)
  }

  const expected = readFileSync(path.join(root, "css", "tailwind.css"))
  const actual = readFileSync(generated)
  if (!expected.equals(actual)) {
    process.stderr.write("css/tailwind.css is stale. Run: npm run css:build\n")
    process.exit(1)
  }

  const css = expected.toString("utf8")
  if (/NaN%|undefined|null\)/.test(css)) {
    process.stderr.write("css/tailwind.css contains an invalid generated color value.\n")
    process.exit(1)
  }
  process.stdout.write("Generated Tailwind CSS is current.\n")
} finally {
  rmSync(tempDir, { recursive: true, force: true })
}
