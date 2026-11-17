// Documentation-only checks. No application, database or permission mutation.
import assert from "node:assert/strict"
import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

const feature = fileURLToPath(new URL(".", import.meta.url))
const root = fileURLToPath(new URL("../../", import.meta.url))
const load = (name) => fs.readFileSync(path.join(feature, name), "utf8")
const spec = load("spec.md")
const trace = load("traceability.md")
const checklist = load("checklists/requirements.md")
const requirements = [...spec.matchAll(/^- \*\*(FR-\d{3})\*\*:/gm)].map((m) => m[1])
const mapped = new Set()

for (const match of trace.matchAll(/FR-(\d{3})(?:[–-](?:FR-)?(\d{3}))?/g)) {
  const start = Number(match[1])
  const end = Number(match[2] ?? match[1])
  assert.ok(end >= start, `Invalid requirement range: ${match[0]}`)
  for (let n = start; n <= end; n++) {
    mapped.add(`FR-${String(n).padStart(3, "0")}`)
  }
}

assert.ok(requirements.length > 0, "No functional requirements")
assert.equal(new Set(requirements).size, requirements.length, "Duplicate FR IDs")
assert.deepEqual(
  requirements.filter((id) => !mapped.has(id)),
  [],
  "Requirements missing from Jira traceability",
)
assert.deepEqual(
  [...mapped].filter((id) => !requirements.includes(id)),
  [],
  "Traceability references unknown requirements",
)
assert.ok(!spec.includes("[NEEDS CLARIFICATION:"), "Unresolved spec clarification")

for (const heading of [
  "## User Scenarios & Testing",
  "## Requirements",
  "## Success Criteria",
  "## Assumptions",
  "## Clarifications",
]) {
  assert.ok(spec.includes(heading), `Missing mandatory section: ${heading}`)
}

const checkboxes = [...checklist.matchAll(/^- \[([ xX])\]/gm)]
const passed = checkboxes.filter((match) => match[1].toLowerCase() === "x").length
assert.equal(checkboxes.length, 16, "Unexpected quality checklist shape")
assert.equal(passed, checkboxes.length, "Quality checklist still has failing items")

const acceptedDecisions = [...spec.matchAll(/^- Q:/gm)].length
assert.equal(acceptedDecisions, 10, "Expected seven original and three Cloud/session owner decisions")

for (const name of [
  "spec.md",
  "research.md",
  "plan.md",
  "traceability.md",
  "validation.md",
  "checklists/requirements.md",
  "../../docs/architecture.md",
  "../../docs/adr/0001-supabase-cloud.md",
  "../../docs/legacy-inventory.md",
  "../../docs/runbooks/legacy-backup-restore.md",
  "../../docs/maintenance/SCRUM-6-validation.md",
]) {
  const file = path.join(feature, name)
  const text = fs.readFileSync(file, "utf8")
  assert.ok(text.endsWith("\n"), `${name}: missing final newline`)
  text.split("\n").forEach((line, index) => {
    assert.ok(!/[\t ]+$/.test(line), `${name}:${index + 1}: trailing whitespace`)
  })
  for (const match of text.matchAll(/\]\(([^)]+\.md)\)/g)) {
    assert.ok(
      fs.existsSync(path.resolve(path.dirname(file), match[1])),
      `${name}: missing linked file ${match[1]}`,
    )
  }
}

const constitution = fs.readFileSync(
  path.join(root, ".specify/memory/constitution.md"),
  "utf8",
)
assert.ok(constitution.includes("**Version**: 3.0.0"), "Constitution version mismatch")
assert.ok(spec.includes("bdhavbwmxbttymerizvx"), "Approved Cloud target missing")
assert.ok(spec.includes("isolated target"), "Isolated rebuild gate missing")
assert.ok(
  constitution.includes("TODO(RATIFICATION_DATE)"),
  "Unknown original ratification date must remain explicit",
)

console.log(
  JSON.stringify(
    {
      feature: path.relative(root, feature).replaceAll("\\", "/"),
      requirements: requirements.length,
      mappedRequirements: mapped.size,
      checklist: `${passed}/${checkboxes.length}`,
      acceptedDecisions,
      errors: [],
    },
    null,
    2,
  ),
)
