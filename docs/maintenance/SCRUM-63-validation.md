# SCRUM-63 — scaffold và evidence

## Authority / scope

Owner duyệt chuyển19 Done và giao Gói C63→64 sau predecessors. Đã kiểm current
Jira19/21/63/64/latest comments trước làm;19 workflow41 trả Done;21 blockers6/19
đều Done;21/63 chuyển In Progress bằng transitions thật.64 vẫn To Do tới63 gate.

Owner chọn Duyệt cho exact dependency set qua clarification tool trước cài:
Next16.4.6/React+DOM19.3.1, Nest common/core/platform-express12.5.0,
reflect0.2.2/rxjs7.8.2/zod4.6.7, TS5.9.3/Jest30.5.2/ts-jest29.4.15/
ESLint9.39.1/typescript-eslint8.72.2/types Node24.19.2/react+DOM19.3.0/jest30.0.0.
Public registry versions/engines/peers checked; metadata is not runtime evidence.

Root `.mise.toml` remains legacy Node22/pnpm10.34.3. Actual executable Node24.16.0/
pnpm11.5.0; v2/.mise.toml pins these independently. pnpm warns root legacy
pnpm.overrides ignored; không sửa root để che warning. No global install/update.

Allowlist: `v2/**`, README, architecture/validation handoff and this evidence.
64 future CI `.github/workflows/` only after63 gate. No legacy source/lockfile/
global OpenCode/permissions/schema/credentials changes. v2 did not exist before
task; preserved existing modified/untracked/.vscode user work.

## Implementation boundary

8 workspace projects: independent root + Web/Gateway/Catalog/Community/
Notification + contracts/config. Shared transport/config only, no shared domain
ORM or cross-service imports. Nest health/request IDs/logging/shutdown foundation;
Next diagnostic HTML (not product UI/theme) and health only; no new CSS/assets.
App ports3000–3004 local default, Nest PORT override. No ordinary Auth/session/
business endpoints/DB pools/network probes. Public business/private paths404.

Liveness200 means process alive. Readiness503 explicitly dependency probes/business
runtime not implemented, even when URL strings validate; no fake Cloud success.
Config wrong-project/TLS-disable/pool/port guard, no credential in returned config/
errors/log. Runtime roles/grants/TLS connectivity tests remain tasks64/69/70.

Install: `pnpm install --ignore-scripts` (twice: initial install then root tooling
workspace package links);473 third-party packages, lockfile/store in v2, no
global/generator/blanket lifecycle build execution. Root package/lock unchanged.
ESLint9 deprecation and transitive glob10 deprecation visible; keep approved pin,
no silent major upgrade. No statement that metadata/install equals security audit.

## Regression record — unapproved DB host accepted

- Symptom: service config could mark a DB URL configured for other project while
  SUPABASE_PROJECT_REF was correct, violating safe-target env guard intent.
- Inert reproduction: tests/unit/config.test.ts uses wrong host, no network/
  password/real env reads.
- RED: add assertion before fix; `pnpm test` → **17 pass/1 fail, exit1**,
  “rejects an unapproved DB target…” did not throw.
- Fix: reject DB host other than direct Connect metadata actually supplied by
  owner; direct username must match supplied limited runtime role. No inferred
  pooler endpoint: future owner-supplied Connect metadata needs explicit support.
- Positive redaction fixture now uses approved public host + inert canary, keeps
  secret/host absence assertions. Negative wrong-project regression unchanged.
- GREEN: same `pnpm test` → **18/18 PASS** after fix.
- Jest saw generated `.next/standalone` duplicate package after first build:
  scope haste roots to actual tests directory (testMatch unchanged), not skip/
  weaken assertions. Build-generated distribution isn't a second source package.

## Runtime observations

`Get-Command docker`: per-user DockerDesktop CLI now present (historical report
without CLI is superseded for PATH presence only). `docker compose version`:
v5.7.0. `docker info --format '{{.ServerVersion}}'` exit1, missing docker_engine
pipe. No Engine running evidence, no Docker pull/start/WSL/settings mutations.
Ports probe returned no rows/exit1, not sole proof ports available; smoke uses
actual ephemeral binding. Need explicit resources/Engine checks before64 run.

## Verification record

Initial scaffold: pnpm lint PASS; pnpm typecheck PASS all7 child packages;
pnpm test17/17PASS; pnpm build PASS including Next16.4.6 production build;
pnpm test:smoke PASS all5 process starts,200/503/404, safe logs, Nest app.close
via test IPC. These precede regression guard/structure tests; not final totals.
Windows IPC test is not POSIX/Docker signal proof; no browser/mobile product UI
or Auth/Cloud/SMTP verification. No manual service left running by smoke.

### Final scaffold gate

- `NEXT_TELEMETRY_DISABLED=1; pnpm verify` (PowerShell env assignment): PASS lint,
  typecheck tất cả7 child packages, Jest **24/24**, build tất cả7 packages,
  smoke cả5 processes. Next production HTML/health đã kiểm HTTP; không browser/
  keyboard/mobile product UI verification, vì chưa có product UI.
- `pnpm install --frozen-lockfile --ignore-scripts`: PASS, already up to date.
- Legacy baseline riêng: `npm test` **47/47 PASS**; `npm run typecheck` **0
  diagnostics/66 files**; `npm run check:structure` **73/73**;
  `npm run build` **PASS/1740 modules**. Không dùng baseline legacy chứng minh V2.
- `git check-ignore -v`: env example được exception; node_modules, pnpm store,
  Next output bị ignore. Không commit/push; không thay legacy package/lockfiles.
- Sau status-doc sync: feature validator PASS31/31, checklist16/16,10 decisions;
  contracts validator PASS11docs/64tasks/24constraints/31FR, core hashes không đổi;
  guardrails validator PASS7docs/45rules/staticOnly; `git diff --check` exit0
  (chỉ LF→CRLF warnings). Git diff không bao gồm untracked scaffold; bằng chứng
  scaffold là commands build/test/smoke thực chạy phía trên, không diff-stat.

**Đã đạt63:** workspace/pins riêng, Next/Nest build/start độc lập, transport/config
packages, safe env validation/ports, docs và regression fail-before/pass-after.
Jira63 đã ghi acceptance; workflow41 đã trả `statusName: Done`.
Parent21 giữ In Progress (handoff10042);64 giữ To Do (blocker10041).
**Chưa đạt ở64, không waive:** Compose/CI chưa tạo/chạy, Docker SIGTERM/runtime,
Cloud network/TLS authentication/role isolation, dependency readiness và resources.
Docker Engine pipe không khả dụng; runtime roles/credentials và fallback Connect
metadata chưa có. Không Cloud mutation hoặc startup provisioning.
