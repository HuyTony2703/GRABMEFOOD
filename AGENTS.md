# GRABMEFOOD — agent instructions

## Sources of truth

- Read the assigned Jira task/subtasks and their predecessors under roadmap SCRUM-5.
- Governance: [.specify/memory/constitution.md](.specify/memory/constitution.md).
- Approved V2 business scope: [specs/003-grabmefood-v2/spec.md](specs/003-grabmefood-v2/spec.md);
  use its traceability/checklist/validation, not a competing requirements document.
- Architecture, service ownership, HTTP/event contracts and ADR belong to SCRUM-19.
  SCRUM-19 design is approved in `docs/architecture.md` and V2 contracts/ADR;
  design approval is not evidence that business runtime is implemented.
- V2 direction/design system must be approved in the UI tasks before implementation.
  Current PRODUCT.md, DESIGN.md and specs 001/002 describe legacy, not approved V2 UI.
- Tool/action authority: [docs/permissions.md](docs/permissions.md).

## Before every task

1. Inspect Git status; preserve existing modifications and untracked user work.
2. Compare requirements against actual code, configuration and schema; name the intended
   outcome, predecessor, file allowlist and relevant skills.
3. Ask immediately about ambiguity affecting business, architecture, data, security,
   design approval or acceptance. Wait before dependent work. If clear, say
   “Yêu cầu đủ rõ để thực hiện trong phạm vi …” and continue without invented questions.
4. Do only assigned subtasks in order. A proposal is not an approved decision.
5. Check installed skill/version/integration before use. Do not install missing tools
   without permission. Reuse sufficient Spec Kit artifacts rather than rerunning workflows.

## V2 boundaries

- Follow the approved stack and service boundaries in the constitution; do not change
  stack, contracts, dependencies or business scope without approval.
- Supabase **Cloud** owns PostgreSQL/Auth/Storage; frontend, Gateway, Catalog,
  Community, Notification and RabbitMQ remain localhost in independent `v2/`.
  Supabase Local is not required for default run/demo. See
  [Cloud ADR](docs/adr/0001-supabase-cloud.md); no remote mutation without separate approval.
- Build UI/layout/CSS/components/assets/content anew. Do not preserve legacy UI by recoloring it.
- Keep Vietnamese-first discovery; no ordering/delivery/booking, map page or star ratings.
  Exact behavior belongs in the approved spec, not here.
- Do not fabricate prices, ratings, records, capability claims or successful responses.
  An action without a backend must remain disabled and explain its unavailable state.

## Safety and permissions

- Edit only the current task allowlist. Ask before any out-of-scope change.
- Never revert/discard user work or use a reset/checkout to hide changes.
- Before any delete/reset, present exact target, allowlist, impact and backup status;
  wait for target-specific owner confirmation. The legacy backup waiver is not a reset grant.
- Do not modify global OpenCode settings, account permissions, credentials, GitHub settings,
  branch protection, remote Supabase or deploy without separate explicit approval.
- Do not commit/push without a request. Do not use shell/scripts/Code Mode/another agent
  to bypass an ask/deny. Tool permission is not business authorization.
- Never print secrets or read credentials to prove a guardrail. Use inert canaries only.
- Project-only Supabase MCP is read-only and scoped to `bdhavbwmxbttymerizvx`;
  only explicitly allowlisted metadata tools may run. No arbitrary SQL.
  Rebuild/destructive tests require a separately identified, approved isolated target;
  none exists now. An allegedly empty main project is not that target.
- This file guides behavior; project `opencode.jsonc` gates supported tool operations.
  Neither replaces a sandbox, server authorization, tests, CI or repository protection.
- Bug fixes require an appropriate regression test: fail-before/pass-after with evidence.
  Never weaken tests, skip assertions or rewrite expected output just to hide a defect.

## Current runtime — legacy only

- React + TypeScript + Vite + Tailwind/Radix in Figma Make; **not** the V2 scaffold.
- Read README.md for current layout/commands. Entry `src/main.tsx`, wrapper
  `vite.figma.config.ts`, versions `.mise.toml`. Do not remove `.figma/` or wrappers.
- A dev server may already run on `$PORT` (default 8443); check before starting another.
- While an assigned task still touches legacy, retain feature grouping in `src/app/`,
  shared data logic in `src/app/lib/`, state in `src/app/contexts/`, and `@/` imports.
  This is not permission to reuse those modules/assets in V2.
- Preserve existing URLs/content unless the assigned approved change explicitly replaces them;
  V2's independent dish identity supersedes the legacy dish-pair requirement.

## Verification and handoff

- Before handoff run `npm test`, `npm run typecheck`, `npm run check:structure` while
  these remain the actual scripts. For UI changes also run `npm run build` and inspect
  render/interactions, keyboard, mobile/desktop and loading/empty/error states.
- Use the appropriate supported service/DB/E2E checks once those exist. Do not invent
  a passing test or call current legacy tests proof of V2 behavior.
- Report Đã đạt / Chưa đạt / Bị chặn with files/migrations, exact executed checks/results
  and evidence; update relevant docs/Jira. Done requires the actual acceptance gate.
- Stop at a verified boundary if blocked; give the next step. Do not move to another package.
