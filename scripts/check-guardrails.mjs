// Static checks only; never claim this matcher proves live OpenCode enforcement.
import assert from "node:assert/strict"
import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"
import { pathToFileURL } from "node:url"

export const root = fileURLToPath(new URL("../", import.meta.url))
export const configFile = path.join(root, "opencode.jsonc")

// The .jsonc file intentionally uses the JSON subset so no parser dependency is needed.
export function readPolicy() {
  return JSON.parse(fs.readFileSync(configFile, "utf8"))
}

export function wildcard(pattern, value, windows = true) {
  const normalized = (text) =>
    windows ? text.replaceAll("\\", "/").toLowerCase() : text
  const escaped = normalized(pattern)
    .split("*")
    .map((part) => part.split("?").map((s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("."))
    .join(".*")
  return new RegExp(`^${escaped}$`, "s").test(normalized(value))
}

// Config-only V2 rule-order model for tests; no saved/agent/managed runtime rules.
export function evaluate(rules, action, resource, windows = true) {
  let effect = "ask"
  for (const rule of rules) {
    const matchesResource =
      wildcard(rule.resource, resource, windows) ||
      (action === "shell" &&
        rule.resource.endsWith(" *") &&
        wildcard(rule.resource.slice(0, -2), resource, windows))
    if (wildcard(rule.action, action, windows) && matchesResource) effect = rule.effect
  }
  return effect
}

export const documentPaths = [
  "AGENTS.md",
  "docs/permissions.md",
  "docs/workflows/bug-regression.md",
  "docs/workflows/adr.md",
  "docs/templates/bug-record.md",
  "docs/templates/adr.md",
  "docs/maintenance/SCRUM-46-validation.md",
]

export function validateGuardrails() {
  const config = readPolicy()
  assert.equal(config.$schema, "https://opencode.ai/config.json")
  assert.deepEqual(
    Object.keys(config).sort(),
    ["$schema", "mcp", "permissions", "policies"].sort(),
    "Do not modify models/providers/global settings through this profile",
  )
  assert.deepEqual(Object.keys(config.mcp), ["servers"])
  assert.deepEqual(Object.keys(config.mcp.servers), ["supabase"])
  const server = config.mcp.servers.supabase
  assert.deepEqual(Object.keys(server).sort(), ["type", "url"])
  assert.equal(server.type, "remote")
  const url = new URL(server.url)
  assert.equal(url.origin + url.pathname, "https://mcp.supabase.com/mcp")
  assert.deepEqual([...url.searchParams.keys()].sort(), ["features", "project_ref", "read_only"])
  assert.equal(url.searchParams.get("project_ref"), "bdhavbwmxbttymerizvx")
  assert.equal(url.searchParams.get("read_only"), "true")
  assert.equal(url.searchParams.get("features"), "docs,database,development")
  assert.ok(Array.isArray(config.permissions) && config.permissions.length > 0)
  for (const rule of config.permissions) {
    assert.deepEqual(Object.keys(rule).sort(), ["action", "effect", "resource"])
    assert.ok(["allow", "ask", "deny"].includes(rule.effect))
    assert.equal(typeof rule.action, "string")
    assert.equal(typeof rule.resource, "string")
    assert.ok(
      !(rule.action === "*" && rule.resource === "*" && rule.effect === "allow"),
      "No blanket automatic allow",
    )
  }
  for (const file of documentPaths) {
    const absolute = path.join(root, file)
    const text = fs.readFileSync(absolute, "utf8")
    assert.ok(text.endsWith("\n"), `${file}: missing final newline`)
    text.split("\n").forEach((line, index) => {
      assert.ok(!/[\t ]+$/.test(line), `${file}:${index + 1}: trailing whitespace`)
    })
    for (const match of text.matchAll(/\]\(([^)]+\.md)\)/g)) {
      assert.ok(
        fs.existsSync(path.resolve(path.dirname(absolute), match[1])),
        `${file}: missing link ${match[1]}`,
      )
    }
  }
  assert.equal(evaluate(config.permissions, "edit", "src/app/App.tsx"), "ask")
  assert.equal(evaluate(config.permissions, "shell", "npm install anything"), "ask")
  assert.equal(evaluate(config.permissions, "edit", ".opencode/permission-canary.txt"), "deny")
  assert.ok(
    config.policies.some(
      (p) =>
        p.action === "tool.use" &&
        p.resource === "edit:.opencode/permission-canary.txt" &&
        p.effect === "deny",
    ),
    "Canary must also have a hard policy deny",
  )
  return { documents: documentPaths.length, rules: config.permissions.length, staticOnly: true }
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  assert.equal(process.argv.length, 2, "This validator accepts no runtime or mutation arguments")
  console.log(JSON.stringify(validateGuardrails(), null, 2))
}
