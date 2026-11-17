import test from "node:test"
import assert from "node:assert/strict"
import fs from "node:fs"
import path from "node:path"
import {
  evaluate,
  wildcard,
  readPolicy,
  validateGuardrails,
  root,
} from "../../scripts/check-guardrails.mjs"

test("guardrail documents and project-only config have valid references and shape", () => {
  assert.equal(validateGuardrails().staticOnly, true)
})

test("V2 config matcher models whole-value Windows paths and ordered exceptions", () => {
  assert.ok(wildcard("docs/*.md", "DOCS\\permissions.md"))
  assert.ok(!wildcard("docs/*.md", "src/docs/permissions.md"))
  assert.ok(wildcard("a?c", "abc"))
  assert.ok(!wildcard("a?c", "abbc"))
  assert.ok(wildcard("file[1].md", "file[1].md"))
  assert.equal(evaluate([{ action: "shell", resource: "git status *", effect: "allow" }], "shell", "git status"), "allow")
  assert.equal(evaluate([{ action: "edit", resource: "*", effect: "allow" }, { action: "edit", resource: "secret/*", effect: "deny" }], "edit", "secret/key"), "deny")
  assert.equal(evaluate([], "edit", "anywhere"), "ask")
})

test("only task documents auto-edit; application, config and environment mutation must ask", () => {
  const { permissions } = readPolicy()
  for (const file of ["src/app/App.tsx", "package.json", "AGENTS-not-allowlisted.md", ".env", "opencode.jsonc"]) {
    assert.equal(evaluate(permissions, "edit", file), "ask", file)
  }
  assert.equal(evaluate(permissions, "edit", "docs/permissions.md"), "allow")
  assert.equal(evaluate(permissions, "edit", "docs/unassigned-feature.md"), "ask")
})

test("shell has no general Node, PowerShell, Git or package-install auto-allow", () => {
  const { permissions } = readPolicy()
  for (const command of ["node -e writeFile", "powershell arbitrary.ps1", "npm install x", "git push origin main", "git reset --hard", "supabase db reset", "docker compose down --volumes"]) {
    assert.equal(evaluate(permissions, "shell", command), "ask", command)
  }
  for (const command of ["git status --short", "npm test", "npm run typecheck", "npm run check:structure", "node scripts/check-guardrails.mjs"]) {
    assert.equal(evaluate(permissions, "shell", command), "allow", command)
  }
})

test("remote Supabase tools deny and Jira writes still ask; Code Mode does not blanket-allow MCP", () => {
  const { permissions } = readPolicy()
  assert.equal(evaluate(permissions, "execute", "*"), "allow")
  assert.equal(evaluate(permissions, "supabase_apply_migration", "*"), "deny")
  assert.equal(evaluate(permissions, "supabase_execute_sql", "*"), "deny")
  assert.equal(evaluate(permissions, "atlassian_addOrEditJiraIssueComment", "*"), "ask")
  assert.equal(evaluate(permissions, "atlassian_editJiraIssue", "*"), "ask")
})

test("Supabase MCP is project-scoped read-only with only explicit metadata reads", () => {
  const { mcp, permissions } = readPolicy()
  assert.deepEqual(Object.keys(mcp.servers), ["supabase"])
  const server = mcp.servers.supabase
  assert.deepEqual(Object.keys(server).sort(), ["type", "url"])
  assert.equal(server.type, "remote")
  const url = new URL(server.url)
  assert.equal(url.origin + url.pathname, "https://mcp.supabase.com/mcp")
  assert.equal(url.searchParams.get("project_ref"), "bdhavbwmxbttymerizvx")
  assert.equal(url.searchParams.get("read_only"), "true")
  assert.equal(url.searchParams.get("features"), "docs,database,development")
  for (const name of ["get_project_url", "list_tables", "list_extensions", "list_migrations", "search_docs"]) {
    assert.equal(evaluate(permissions, `supabase_${name}`, "*"), "allow")
  }
  for (const name of ["execute_sql", "apply_migration", "get_publishable_keys", "deploy_edge_function", "create_branch", "delete_branch", "unknown_tool"]) {
    assert.equal(evaluate(permissions, `supabase_${name}`, "*"), "deny")
  }
})

test("env reads, outside directories and harmless unknown shell canary ask", () => {
  const { permissions } = readPolicy()
  assert.equal(evaluate(permissions, "read", ".env.local"), "ask")
  assert.equal(evaluate(permissions, "read", "apps/web/.env"), "ask")
  assert.equal(evaluate(permissions, "read", ".env.example"), "allow")
  assert.equal(evaluate(permissions, "external_directory", "C:/Users/HUY/private/*"), "ask")
  assert.equal(evaluate(permissions, "shell", "Write-Output GRABMEFOOD_PERMISSION_CANARY"), "ask")
})

test("deny canary stays deny even if a docs path could otherwise be allowed", () => {
  const { permissions, policies } = readPolicy()
  assert.equal(evaluate(permissions, "edit", ".opencode/permission-canary.txt"), "deny")
  assert.equal(evaluate(permissions, "edit", ".OPENCODE\\permission-canary.txt"), "deny")
  assert.ok(policies.some((p) => p.resource === "edit:.opencode/permission-canary.txt" && p.effect === "deny"))
})

test("regression and ADR templates require real evidence, not fabricated history or accepted proposals", () => {
  const bug = fs.readFileSync(path.join(root, "docs/workflows/bug-regression.md"), "utf8")
  const adr = fs.readFileSync(path.join(root, "docs/templates/adr.md"), "utf8")
  assert.match(bug, /RED/)
  assert.match(bug, /GREEN/)
  assert.match(bug, /Không revert\/reset/)
  assert.match(bug, /không tạo lịch sử giả/)
  assert.match(adr, /Status: \*\*Proposed\*\*/)
  assert.match(adr, /chưa được duyệt/)
})
