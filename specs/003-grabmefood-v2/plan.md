# Implementation Plan: GrabMeFood V2

**Branch**: `main` (Git thực, không tạo branch) | **Date**: 2026-11-16
**Input**: [spec.md](spec.md), SCRUM-19/60; SCRUM-59 đã Done.
**Status**: Design artifacts để analyze; không implementation permission.
Helper `BRANCH=003-grabmefood-v2` là feature identifier, không branch Git thực.

## Summary

Khám phá món/quán tiếng Việt, identity riêng món, saved/random cá nhân, comments/
mentions và in-app inbox; admin quản lý demo mới. Không orders/map/ratings.
Giữ [architecture](../../docs/architecture.md),
[ADR-0001](../../docs/adr/0001-supabase-cloud.md);
6 quyết định + recipient receipt và **remediation approval mới, riêng biệt**
ở [ADR-0002](../../docs/adr/0002-v2-contracts.md).

## Technical Context

**Language/Version**: TypeScript; Node24 hiện có theo historical research,
TypeScript5.9 candidate. Pin sau compatibility check/owner dependency approval63.
**Primary Dependencies**: Next.js/React/Tailwind Web, NestJS Gateway/Catalog/
Community/Notification, pnpm, RabbitMQ; pg/jose/amqplib/Supabase SDK candidates
theo [research](research.md), không thêm ORM/Redis/K8s/Elastic mặc định.
**Storage**: Supabase Cloud PostgreSQL/Auth/Storage; schemas/roles riêng.
**Testing**: Jest unit/contract/integration, Playwright E2E, GitHub Actions tại64;
no secret-bearing default CI integration. Root npm tests vẫn chỉ legacy.
**Target Platform**: Windows host + Docker local apps/broker, mobile/desktop browser;
Internet/Cloud required, origin localhost:3000.
**Project Type**: independent `v2/` pnpm web + services monorepo, chưa tồn tại.
**Performance Goals**: one process/service, pool4/4/2, H12 outside reserved3,
ordinary57 owner report; `P+U+H≤57` cần đo111. Local steady≤4GiB/peak≈6GiB
provisional; không latency/throughput guarantee giả.
**Constraints**: usableRAM≥15GiB/free≥6GiB, Docker-data free≥15GiB/workspace≥10GiB
preflight64; TLS chain+hostname; no startup provisioning; no cross-service SQL.
Amendment owner-approved64: explicit `demo-lite` production runtime-only
freeRAM≥4GiB, declared container caps total2GiB; default/full/build vẫn≥6GiB,
disk/usableRAM guards không đổi. Build tách runtime, đủ6containers, DB4/4/2 giữ.
Record `v2/infra/demo-lite.json`, architecture approved-alternative và evidence64;
chưa Compose enforcement/workload/resource runtime PASS.
Superseding local resource experiment64 (owner-authorized budget adjustment):
demo-lite bounded build2048MiB/noSwap/sequential +runtime cap total2048MiB,
Windows reserve1024 +measured incremental allowance1280 →available4352MiB
(4.25GiB) perphase. Heavy build chỉ trong cappedLinux container; runtime image
assembly không compile Node. Default/unbounded fallback không được áp budget này.
Pilot install/build thật noOOM nhưng packagingFAIL, rerun blocked hostload;
full-runtime/Cloud/CI và acceptance/dependencies không đổi. Xem evidence64.
**Scale/Scope**: seven stories,31 FR, demo≥20 dishes/8 restaurants/2 users/1 admin;
không multi-replica/unbounded fanout SLA.

## Constitution Check

Pre-Phase0: approved spec available, business scope unchanged;59 Done;
no Cloud write; no UI skills for backend/design documents.
Unknowns6/6 + receipt clarification resolved by owner; package research reused,
one read-only research dispatch for crash-safe fanout.
Remediation C1/U1/U2/I1 được owner duyệt riêng sau analyze; không hồi tố approval6/6.
Spec có amendment default4 nhóm/creation-only notification; media GET read matrix/
no-store và fresh purpose-bound reauth/resume cụ thể ở contracts. Không rerun
research/plan/tasks generation khi artifacts hiện có đủ; sửa đúng findings.

| Gate | Post-design evidence |
| --- | --- |
| Discovery-only/Vietnamese-first | FR-001–006, HTTP no orders/map/rating |
| Evidence before claims | quickstart distinguishes static/runtime |
| Functional integrity | story-specific failure/empty/authz test tasks |
| Approved stack/ownership | data model C20; BFF/ledger sync authorization |
| No legacy reuse | independent tree; visual gate77/78 before UI79/80 |
| No unauthorized operation | no scaffold/DDL/install/Cloud action; rebuild blocked |
| Verification | static validators + read-only analyze, runtime not waived |

No constitution exception proposed. Subject to analyze, not runtime PASS.

## Project Structure

### Documentation

`specs/003-grabmefood-v2/`: spec có owner-approved amendment (giữ31 FR); research.md; plan.md; data-model.md;
contracts/{README,http,authorization,events}.md; quickstart.md; tasks.md;
traceability.md; validation.md. ADRs in `docs/adr/`, not competing decisions tree.

### Planned source code — no files created in60

```text
v2/
  package.json
  pnpm-workspace.yaml
  apps/web/src/app/            # new Next UI + api/v1 BFF routes
  apps/web/src/components/     # new approved design only
  apps/gateway/src/            # routing/request IDs/service auth; no SQL
  services/catalog/src/       # db/content/search/publication/media/outbox
  services/community/src/     # db/auth/profile/saved/comments/receipts/outbox
  services/notification/src/  # db/intake/projection/inbox/broadcasts/outbox
  packages/contracts/src/     # DTO/schema only; no business repositories
  infra/compose.yaml          # local apps/broker only
  infra/migrations/catalog/
  infra/migrations/community/
  infra/migrations/notification/
  scripts/
  tests/contracts/
  tests/integration/
  tests/e2e/
  docs/
```

Paths are planned targets. Root Vite/.figma/wrappers stay unchanged. Shared
contracts define validation only; business rules stay in owning services.

## Phase 0 — Research

Reuse research evidence. Owner6/6+receipt resolves design choices. Cloud plan/
session-pooler/usable TLS/SMTP remain runtime gates65/70/81/111/112, not invented inputs.

## Phase 1 — Design

[Data model](data-model.md) dictionary/indexes/state/constraints C00–C23;
[HTTP](contracts/http.md) DTO/operations/pagination/errors/polling;
[authorization](contracts/authorization.md) trust/session races;
[events](contracts/events.md) payload/outbox/receipt/replay;
[quickstart](quickstart.md) current checks/future validation.
No schema applied; Community authority and Notification materialization stay separate.
Media GET: public published/attached sanitized bytes, Admin-only Catalog draft,
owner-only unattached avatar; all routes no-store/no conditional304/shared cache.
Password resume: context expiry không unlock operation; fresh proof đúng account/
purpose/operation/generation, encrypted provider custody, CAS/fencing, no auto-login.

## Phase 2 — Tasks / delivery strategy

Use installed tasks template after design. US1–7 priority grouping does not
override Jira prerequisites. MVP public discovery US1 after infra/schema/design
gates; private stories incrementally. No generated task executed during60.
Remediation I1:64 tasks giữ IDs/dependencies, không task-level parallel marker;
test-first chỉ trong phần Jira đang được giao, không chuẩn bị subtask sau sớm.

## Verification strategy

At60: docs/links/constraints propagation/FR coverage/task format + baseline.
Then installed analyze prerequisites and read-only semantic passes A–F; report
findings without remediation. Owner approval required for follow-up fixes.
Runtime:64 local scaffold/resources/honest readiness/config-negative guards and actual GitHub CI;
65 formal live network/Connect/chain+hostname/quota inventory;67–68 role creation;
69 grants;70 authenticated service-role TLS/isolation;62 event faults;82 Auth E2E;
107/108 journeys/revocation;109/110 UI/a11y;111 capacity/resources;112 security;
75/76 isolated rebuild. Runtime tests not replaced by static docs or legacy tests.

Owner-approved acceptance split S, 2026-11-17: supersedes earlier64 live-Cloud
closure prerequisite, not the before-demo TLS/security obligations. Keep Jira DAG
21→47→22→23→48 and subtask order.64/21 may close only after local acceptance
and actual CI on the owner-reviewed snapshot pass, with explicit unverified Cloud
handoff to65/67–70. No remote mutation/role creation permission follows from S.
Credential-free TLS diagnostic cannot establish role login/grants/capacity.

## Complexity Tracking

No exception. Approved tradeoffs: synchronous authz availability coupling,
encrypted token custody/reconciliation, Community receipt + Notification import,
outbox/dedup. No extra coordinator service or distributed SQL.
