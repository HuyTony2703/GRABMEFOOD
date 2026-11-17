// Static design-artifact validation only. No database/network/process mutation.
import { readFileSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';

const here = dirname(fileURLToPath(import.meta.url));
const feature = resolve(here, '..');
const names = ['spec.md', 'plan.md', 'research.md', 'data-model.md', 'quickstart.md',
  'tasks.md', 'traceability.md', 'contracts/README.md', 'contracts/http.md',
  'contracts/authorization.md', 'contracts/events.md'];
const docs = Object.fromEntries(names.map(name => [name, readFileSync(resolve(feature, name), 'utf8')]));
const errors = [];
const check = (ok, message) => { if (!ok) errors.push(message); };
for (const [name, text] of Object.entries(docs)) {
  check(text.endsWith('\n'), `${name}: missing final newline`);
  check((text.match(/^```/gm) ?? []).length % 2 === 0, `${name}: unbalanced fence`);
  for (const match of text.matchAll(/\[[^\]\n]*\]\(([^)\s]+)\)/g)) {
    const target = match[1].split('#')[0];
    if (target && !/^[a-z]+:\/\//i.test(target)) {
      check(existsSync(resolve(dirname(resolve(feature, name)), target)), `${name}: broken link ${target}`);
    }
  }
}
const taskLines = docs['tasks.md'].split('\n').filter(line => line.startsWith('- ['));
const tasks = taskLines.map(line => line.match(/^- \[ \] (T\d{3})(?: \[P\])?(?: \[US([1-7])\])? (.+)$/));
tasks.forEach((task, i) => {
  check(Boolean(task), `task line ${i + 1}: invalid format`);
  if (!task) return;
  check(task[1] === `T${String(i + 1).padStart(3, '0')}`, `task sequence ${task[1]}`);
  check(/SCRUM-\d+/.test(task[3]), `${task[1]}: no actual Jira package`);
  check(/v2\/[\w/.[\]-]+\.\w+/.test(task[3]), `${task[1]}: no concrete file path`);
});
const ids = new Set(tasks.filter(Boolean).map(task => task[1]));
const constraints = [...docs['data-model.md'].matchAll(/\*\*(C\d{2})\*\*: ([^\r\n]+)/g)];
check(constraints.length === 24, 'expected C00–C23');
for (const [, id, text] of constraints) {
  check(taskLines.some(line => line.includes(text)), `${id}: constraint not quoted verbatim in task description`);
}
const coverageRows = [...docs['traceability.md'].matchAll(/^\| (FR-\d{3}) \| ([^\n]+)$/gm)];
const specIds = [...docs['spec.md'].matchAll(/^- \*\*(FR-\d{3})\*\*:/gm)].map(m => m[1]);
check(coverageRows.length === specIds.length, 'FR coverage row count differs from spec');
for (const id of specIds) {
  const rows = coverageRows.filter(m => m[1] === id);
  check(rows.length === 1, `${id}: missing or duplicate coverage`);
  if (!rows.length) continue;
  const mapped = rows[0][2].match(/\bT\d{3}\b/g) ?? [];
  check(mapped.length > 0, `${id}: no task`);
  mapped.forEach(task => check(ids.has(task), `${id}: unknown ${task}`));
}
for (const name of ['plan.md', 'tasks.md', 'data-model.md', 'contracts/http.md',
  'contracts/authorization.md', 'contracts/events.md']) {
  check(!/\[FEATURE\]|\[DATE\]|NEEDS CLARIFICATION|TXXX|REMOVE IF UNUSED/.test(docs[name]),
    `${name}: unfilled template`);
}
const storyCounts = Object.fromEntries(Array.from({ length: 7 }, (_, i) =>
  [`US${i + 1}`, tasks.filter(task => task?.[2] === String(i + 1)).length]));
Object.entries(storyCounts).forEach(([story, count]) => check(count > 0, `${story}: no tasks`));
// Regression guards for SCRUM-60 C1/U1/U2/I1. Text checks are not runtime auth tests.
const http = docs['contracts/http.md'];
const auth = docs['contracts/authorization.md'];
const adr = readFileSync(resolve(feature, '../../docs/adr/0002-v2-contracts.md'), 'utf8');
check(adr.includes('Remediation approval — riêng biệt với approval6/6'),
  'C1: missing separately dated remediation authority');
check(docs['spec.md'].includes('reply, mention, cập nhật quán đã lưu, broadcast quản trị'),
  'C1: spec missing four named default-enabled groups');
check(docs['spec.md'].includes('không phát lại khi chỉnh sửa'),
  'C1: creation-only reply/mention policy missing from spec');
for (const route of ['/media/catalog/{id}', '/admin/media/{id}', '/media/avatars/{profileId}', '/me/avatar/{id}']) {
  check(http.includes(`GET \`${route}\``), `U1: missing GET ${route}`);
}
check(http.includes('Cache-Control: private, no-store') &&
  http.includes('Không trả304') && http.includes('không shared cache'),
  'U1: media cache/publication authorization rules missing');
for (const route of ['/auth/operations/{id}/reauth', '/auth/operations/{id}/resume']) {
  check(http.includes(`POST \`${route}\``), `U2: missing POST ${route}`);
}
for (const field of ['operation_id?:UUID', 'provider_proof_ciphertext?:bytes', 'proof_expires_at?:timestamp']) {
  check(docs['data-model.md'].includes(field), `U2: missing ${field}`);
}
check(auth.includes('Reset chỉ chấp nhận recovery proof mới') &&
  auth.includes('không cấp normal app-session') &&
  auth.includes('expired context không được gia hạn'),
  'U2: purpose-bound fresh reauthentication rules missing');
check(auth.includes('Không redispatch password update khi attempt cũ còn ambiguous') &&
  auth.includes('Fresh proof chứng minh identity/purpose, không chứng minh') &&
  docs['data-model.md'].includes('provider_attempt_state:remote_attempt_state'),
  'U2: fresh proof/lease expiry must not bypass uncertain remote-write guard');
check(!taskLines.some(line => /^- \[ \] T\d{3} \[P\]/.test(line)),
  'I1: no coarse cross-package task is approved for parallel execution');
const executionGraph = [
  '59 Done →60(design/analyze) →63→64→65→66→67→68→69→70→71→72→73→74',
  '→75→76 [blocked: isolated target] →61→62→77→78→79→80→81→82→83→84',
  '→85→86→87→88→89→90→91→92→93→94→95→96→97→98→99→100',
  '→101→102→103→104→105→106→107→108→109→110→111→112→113→114',
  '→115→116→117→118',
].join('\n');
check(docs['tasks.md'].includes(executionGraph), 'I1: approved Jira execution graph changed');
console.log(JSON.stringify({
  staticOnly: true,
  documents: names.length,
  tasks: tasks.length,
  storyCounts,
  constraintsQuoted: constraints.length,
  requirementsMapped: coverageRows.length,
  hashes: Object.fromEntries(['spec.md', 'plan.md', 'tasks.md'].map(name =>
    [name, createHash('sha256').update(docs[name]).digest('hex')])),
  errors,
}, null, 2));
if (errors.length) process.exitCode = 1;
