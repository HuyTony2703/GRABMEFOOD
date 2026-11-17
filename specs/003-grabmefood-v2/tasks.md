# Tasks: GrabMeFood V2

**Input**: [plan](plan.md), [spec](spec.md), [data model](data-model.md),
[contracts](contracts/README.md), [quickstart](quickstart.md).
Generated using installed Spec Kit tasks template after setup-tasks resolved all
design artifacts. All unchecked: this is a plan, not implementation evidence.
**Tests requested** by spec scenarios/constitution; write fail-before, implement,
then pass-after. Runtime DB actions need target-specific approval first.

## Format / path conventions

`Txxx` is local checklist ID, `SCRUM-n` is actual Jira execution package.
All `v2/` paths are future paths per plan; no legacy imports/assets. Remediation I1:
không task coarse-grained nào hiện được đánh dấu parallel. Story grouping không
cho phép chuẩn bị/chạy trước subtask Jira có predecessor chưa đạt.
Each task inherits full dictionary field types/nullability/FKs/indexes at its
owner, plus Cxx constraints quoted verbatim below. No implementation/commit/push
authorized by this checklist. Before each task reread current Jira amendments.

## Phase 1: Setup

- [ ] T001 SCRUM-63 scaffold independent pnpm workspace in v2/package.json and v2/pnpm-workspace.yaml; create planned apps/services/contracts tree, define test/build scripts; recheck candidate compatibility and ask dependency approval before install; no legacy reuse (FR-028/029).
- [ ] T002 SCRUM-64 implement local apps/broker only orchestration in v2/infra/compose.yaml and resource preflight in v2/scripts/preflight.ps1; guarded scaffold startup without provisioning/deletion; actual six-container liveness, honest unavailable readiness, logging/shutdown/resources/restart/broker persistence evidence; offline negative project/role/TLS-disable/pool4/4/2 guards. Require actual GitHub Actions static/unit/build/smoke on reviewed commit, no Cloud secrets. Owner-approved split S (2026-11-17): live Cloud checks remain unverified, not a closure prerequisite here; mandatory handoff T003/T004–T010, no waiver or implicit remote apply (FR-028/030).

## Phase 2: Foundational — blocking prerequisites

Gates:63→64→65/66→67/68→69/70→71/72→73/74.75/76 remain separately
blocked without isolated target, cannot be silently waived.61/62 follow approved
infrastructure/schema prerequisites, not ticket numeric order. UI77/78→79/80
must precede any user-facing implementation below.

- [ ] T003 SCRUM-65/66 inspect approved Cloud target metadata and record no-op or unexpected-data blocker in v2/docs/target-inventory.md; no deletes because target described empty. SCRUM-65 owns formal endpoint/Connect mode/CA/network IPv4/IPv6 and live certificate chain+hostname verification from app environment, plan/quota inventory and sanitized role inventory (unknown is not absent); reject invalid chain/hostname, never disable validation. Credential-free handshake is transport evidence only; authenticated role tests stay T010. Preserve 65→66 and 21→47→22→23 (FR-027/028).
- [ ] T004 SCRUM-67 create Catalog dictionary tables/indexes/local relations and migration tests in v2/infra/migrations/catalog/001_catalog.sql and v2/tests/integration/catalog-schema.test.ts; preserve exact field types from data-model, including “Fields không ghi `?` đều NOT NULL; `?` nullable. UUID PK `id`, timestamps UTC `created_at/updated_at` áp dụng mọi domain row trừ composite PK được ghi rõ. Revisions bắt đầu1, tăng trong owner transaction. Metadata/hashes không được chứa password/raw handle.”; “publication ∈ {draft,published}; name/address khi có phải nonempty sau trim; is_demo=true cho demo content; không giá/vị trí/rating tự suy ra.”; “price_vnd nullable hoặc integer≥0; UNIQUE(dish_id,restaurant_id); public offering cần available=true và cả dish/restaurant published; filter area/price/category cùng một offering.”; “media_state ∈ {pending,ready,failed}; byte_size≤5242880 và >0; mime ∈ {image/jpeg,image/png,image/webp}; object_key unique; catalog source/license nonempty; chỉ attach media ready thuộc đúng owner.” (C00–C03; FR-002–006/026).
- [ ] T005 SCRUM-68 create Community dictionary tables/indexes/local FKs and tests in v2/infra/migrations/community/001_community.sql and v2/tests/integration/community-schema.test.ts; enforce C00 and “display_name trim2..60 Unicode code points; handle nullable trước chọn, sau chọn phải ^[a-z0-9_]{3,30}$, UNIQUE và immutable.”; “theme ∈ {light,dark,system}; app_role ∈ {user,admin}; onboarding_state ∈ {not_started,in_progress,skipped,completed}; notification groups là bốn boolean độc lập; step nullable được giữ khi skipped.”; “target_type ∈ {dish,restaurant}; UNIQUE(profile_id,target_type,target_id) cho saved; target_id external UUID không cross-service FK; random previous per(profile_id,target_type), CAS saved_set revision, không filters/fallback.”; “visible comment body trim1..2000 code points, ≤10 unique mentions theo profile ID có handle; parent chỉ root cùng target; không reply dưới reply; author_deleted xóa body/mentions, giữ tombstone và replies khác; moderator_hidden không được restore body author_deleted.”; “report_state ∈ {open,resolved}; reason nonempty plain text; moderation audit append-only; admin chỉ hide/restore, không sửa body; reply creation cần parent visible.” (C04–C08; FR-009–019).
- [ ] T006 SCRUM-68 create Community authority dictionary tables/indexes and tests in v2/infra/migrations/community/002_authority.sql and v2/tests/integration/authority-schema.test.ts; “session_state ∈ {active,revoked}; handle_digest unique, raw handle không lưu; idle≤24h và absolute≤7d; token_ciphertext chỉ server-side encrypted; session generation phải bằng profile generation và admission_blocked=false khi authorize.”; “context_purpose ∈ {verification,recovery,credential_operation,csrf}; context expiry≤10m và không vượt provider expiry khi có; purpose/state/PKCE bound và one-use; recovery không normal session admission.”; “credential_kind ∈ {change,reset}; credential_state ∈ {protected_pending,provider_updated,succeeded,failed_protected}; operation_id unique, tối đa một active operation/profile; durable generation bump/revoke trước provider update; partial failure không hạ generation hoặc restore session; succeeded cần provider_update_confirmed và cleanup_confirmed.”; “recipient receipt UNIQUE(producer,event_id), input_hash immutable, recipient_count≥0; decision_recipients PK(decision_id,profile_id), groups nonempty subset{reply,mention,restaurant_update,admin_broadcast}; snapshot đầy đủ saved/preferences bền vững trước HTTP response; retry reuse cả empty decision.”; “idempotency UNIQUE(profile_id,operation,request_id); same key different input hash là conflict, không duplicate mutation/event; không persist password hoặc password-derived retry hash.” (C09–C13; FR-007/008/020/021/025/030/031).
- [ ] T007 SCRUM-68 create Notification dictionary tables/indexes/local FKs and tests in v2/infra/migrations/notification/001_notification.sql and v2/tests/integration/notification-schema.test.ts; “broadcast_state ∈ {draft,queued,sent}; title trim1..120/body trim1..2000 code points plain text; queued revision immutable; send idempotent by requestId; admin checked at send.”; “inbox UNIQUE(source_kind,source_id,recipient_id); groups union reply+mention; self-recipient excluded; read_at nullable, once set not reset by replay; all-read only rows in transaction snapshot; no automatic inbox purge.”; “intake_state ∈ {pending,processing,completed,dead}; attempt≥0; event identity/hash immutable; ACK after durable intake commit; processed_events/delivery_decisions retained without automatic purge; importing recipient pages must finish before completion.”; “projections accept only newer revision; external IDs no cross-service FK; authoritative Community enumeration cannot be restricted by projection; Community unavailable means pending, not empty/fallback.” (C14–C17; FR-020–025).
- [ ] T008 SCRUM-67/68 create owner-local outboxes in v2/infra/migrations/catalog/002_outbox.sql, v2/infra/migrations/community/003_outbox.sql, v2/infra/migrations/notification/002_outbox.sql; “domain change+outbox atomic; aggregate_version≥1, schema_version=1, attempts≥0; publisher confirm không consumer commit; sent payload giữ30d từ sent_at, unsent không age-purge như sent.”; “failed payload/DLQ giữ30d; dedup keys/recipient receipts/inbox/tombstone/moderation audit không automatic purge; replay giữ event ID và read state, quá hạn payload cần quy trình riêng.” (C18–C19; FR-021/025/030).
- [ ] T009 SCRUM-69 create grants/RLS/private media policies in v2/infra/migrations/catalog/003_grants.sql, v2/infra/migrations/community/004_grants.sql and v2/infra/migrations/notification/003_grants.sql; “runtime roles riêng chỉ own schema DML/sequence cần thiết, không DDL/owner/superuser; migration principal riêng≤1 khi duyệt; không cross-service SQL/joins/FK hoặc FK Auth/Storage internals; DB TLS chain+hostname; pool caps Catalog4/Community4/Notification2.” (C20; FR-008/012/018/026/030).
- [ ] T010 SCRUM-70 write fail-before/pass-after multi-user/service/Storage/Data API bypass tests in v2/tests/integration/isolation.test.ts; assert own-user/own-schema only and revoked-session denial, not RLS/auth.uid assumptions (FR-008/012/018/026/030).

Owner-approved split S (2026-11-17), mandatory additions without removing C00–C20:
T004/SCRUM-67 creates Catalog runtime role and separate migration principal mapping;
T005–T007/SCRUM-68 create Community/Notification runtime roles and ownership mappings.
Target-specific remote apply still needs separate approval. T009/SCRUM-69 enforces
least privilege and pool4/4/2; T010/SCRUM-70 requires actual per-service authenticated
DB TLS chain+hostname, own-schema positive and cross-schema/user/admin/DDL/
privilege-escalation negatives, no shared admin fallback. Migration principal≤1
only with separate approval; aggregate P+U+H≤57/H12 full-workload evidence stays111.
No downstream feature acceptance may substitute scaffold/CI for these live tests.
- [ ] T011 SCRUM-71/72 create supported-API Auth/Storage provisioning and admin/bootstrap verification in v2/scripts/provision-auth-storage.mjs and v2/tests/integration/bootstrap.test.ts; exact URLs and private buckets, request approval before apply, no Auth/Storage SQL internals (FR-007/008/027/028).
- [ ] T012 SCRUM-73/74 create fresh marked demo20 dishes/8 restaurants/2 users/admin and licensed image manifest in v2/scripts/seed-demo.mjs and v2/docs/media-sources.json; no legacy content or fabricated real restaurant claims (FR-004/027).
- [ ] T013 SCRUM-75/76 implement/run isolated2-cycle rebuild/restore checks in v2/tests/integration/rebuild.test.ts only after separately approved isolated target; currently BLOCKED, never fallback main project (FR-028; SC-007).
- [ ] T014 SCRUM-61 build envelope validators/internal service auth/owner outbox in v2/packages/contracts/src/events.ts and v2/services/catalog/src/outbox/outbox.ts, v2/services/community/src/outbox/outbox.ts, v2/services/notification/src/outbox/outbox.ts; domains+outbox atomic, confirms/manual ACK/intake commit per events contract (FR-021/025/030).
- [ ] T015 SCRUM-62 test duplicates/ordering/broker crash/DB failure/retry/DLQ/payload mismatch/retention and replay authorization in v2/tests/integration/event-delivery.test.ts; no reset shared target (FR-021/025/030).
- [ ] T016 SCRUM-77/78 obtain approved fresh visual direction/preview in v2/docs/direction.md before UI implementation, using applicable UI skills; no legacy screenshot/template reuse (FR-029).
- [ ] T017 SCRUM-79/80 implement approved new tokens/components/shell in v2/apps/web/src/components/ui/index.ts and v2/apps/web/src/app/layout.tsx; keyboard/mobile/desktop/reduced-motion/state checks (FR-029/030).

## Phase 3: US1 — Khám phá (P1, MVP)

Goal: public catalog/search/detail độc lập private features.
Independent test:2 sellers/null price/draft and combined filters; US1.1–7/SC-001.
Gates:T001–T012/T014–T017; approved Auth prerequisite for admin-seeded fixtures.

- [ ] T018 [US1] SCRUM-85/86 write public DTO/pagination/error/publication contract tests first in v2/tests/contracts/catalog.test.ts (FR-001–006/030).
- [ ] T019 [US1] SCRUM-92 write Vietnamese matching/same-offering/null-price/cursor mutation tests first in v2/tests/integration/search.test.ts (FR-005/006).
- [ ] T020 [US1] SCRUM-85 implement Catalog models/queries/public endpoints per C01/C02 in v2/services/catalog/src/content/catalog.ts and v2/services/catalog/src/search/search.ts; category/area dictionary, no cross-service SQL (FR-001–006).
- [ ] T021 [US1] SCRUM-86 implement public-menu event diff/outbox, excluding photo/name-only edits, in v2/services/catalog/src/publication/publication.ts (FR-025/026).
- [ ] T022 [US1] SCRUM-89/90 implement new home from Gateway with real error/empty/loading and render tests in v2/apps/web/src/app/page.tsx and v2/tests/e2e/home.spec.ts (FR-001/002/004/029/030).
- [ ] T023 [US1] SCRUM-91/92 implement URL-preserved search/back/forward/cursor/filter/sort in v2/apps/web/src/app/search/page.tsx and v2/tests/e2e/search.spec.ts (FR-005/006/029/030).
- [ ] T024 [US1] SCRUM-93/94 implement restaurant detail/offering prices/unavailable states in v2/apps/web/src/app/restaurants/[id]/page.tsx and v2/tests/e2e/restaurant.spec.ts (FR-002–004/029/030).
- [ ] T025 [US1] SCRUM-95/96 implement independent dish detail/multiple sellers in v2/apps/web/src/app/dishes/[id]/page.tsx and v2/tests/e2e/dish.spec.ts (FR-002–004/029/030).

## Phase 4: US2 — Tài khoản/hồ sơ (P1)

Goal: identity/session/preferences thật, không JWT-only.
Independent test:A/B +2 A sessions/mailboxes, US2.1–9/SC-002.
Gates:foundation/71–72/UI gates; no dependency on comments/inbox.

- [ ] T026 [US2] SCRUM-81 write auth/cookie/CSRF/provider-error contract tests first in v2/tests/contracts/auth.test.ts; include reauth/resume DTO/proof-purpose/CSRF/expired context/status authorization (FR-007/008/012/030/031).
- [ ] T027 [US2] SCRUM-81/82 write session expiry/revocation/refresh race/recovery-only/partial-failure tests first in v2/tests/integration/session.test.ts; include fresh proof after expiry, wrong subject/purpose deny, encrypted custody/erasure, terminal response loss and concurrent resume fencing (FR-007/008/031).
- [ ] T028 [US2] SCRUM-81 implement Community session/token custody/authorize/login/admission/refresh per C09–C11 in v2/services/community/src/auth/sessions.ts; signed service credential not user authority (FR-007/008/031).
- [ ] T029 [US2] SCRUM-81 implement BFF same-origin forwarding/private no-store and purpose-bound callback in v2/apps/web/src/app/api/v1/[...path]/route.ts and v2/apps/web/src/app/auth/callback/route.ts (FR-007/008/012/030/031).
- [ ] T030 [US2] SCRUM-81 implement password-operation protected state/reauth/resume/reconciliation/status and current-only logout in v2/services/community/src/auth/credential-operations.ts; “operation reauth cần fresh proof đúng subject/purpose và expiry; operation context bind profile_id/operation_id/generation, expiry≤10m và≤proof expiry; provider_proof_ciphertext encrypted server-only, erase sau use/expiry; attempt_version≥1 CAS, lease/fencing chống concurrent resume; không restore phiên cũ hoặc recovery auto-login.”; C23 fields/local FK conditional nullability in authority dictionary must be added/tested under SCRUM-68 T006 before81, no plaintext password storage (FR-007/031).
- [ ] T031 [US2] SCRUM-82 implement fresh Auth/reset UI and real2-mailbox verify/reset E2E in v2/apps/web/src/app/auth/page.tsx, v2/apps/web/src/app/auth/reset-password/page.tsx and v2/tests/e2e/auth.spec.ts (FR-007/008/029/030/031).
- [ ] T032 [US2] SCRUM-83 implement profile/preferences/onboarding/immutable handles/mention suggestions/avatar proxy per C03–C05/C21–C22 in v2/services/community/src/profile/profile.ts and v2/tests/contracts/profile.test.ts; “defaults reply/mention/restaurant_update/admin_broadcast=true; reply/mention chỉ phát khi tạo comment/reply, không phát lại khi edit; creation recipient refs bất biến, preferences vẫn xét tại recipient decision.”; “media GET phải recheck ready/publication/attachment hoặc ledger+ownership mỗi request; draft Catalog chỉ Admin, unattached avatar chỉ chính chủ; private Storage, no signed URL tới browser; Cache-Control private,no-store; không304/shared cache.”; test attached vs unattached avatar, removed avatar, foreign-user/admin deny and no cache replay (FR-009–012).
- [ ] T033 [US2] SCRUM-84 implement fresh onboarding/settings persisted theme/groups and owner isolation tests in v2/apps/web/src/app/settings/page.tsx, v2/apps/web/src/app/onboarding/page.tsx and v2/tests/e2e/settings.spec.ts (FR-009–012/029/030).

## Phase 5: US3 — Saved/random (P1)

Goal: private two-type saved/random without filters/fallback.
Independent test:A/B with0/1/n, duplicate saves, unavailable target and race; SC-003.
Gates:US2 backend+Catalog resolve+actual Jira97→98→99→100.

- [ ] T034 [US3] SCRUM-97/99 write saved/random contract tests first in v2/tests/contracts/saved-random.test.ts (FR-013–016).
- [ ] T035 [US3] SCRUM-99 write unsave/random race, no-repeat, Catalog503-not-empty tests first in v2/tests/integration/random.test.ts (FR-014–016/030).
- [ ] T036 [US3] SCRUM-97 implement saved uniqueness/current public validation/events/CAS sets per C06 in v2/services/community/src/saved/saved.ts (FR-013/014/025).
- [ ] T037 [US3] SCRUM-98 implement fresh two-tab saved UI/persistence/isolation E2E in v2/apps/web/src/app/saved/page.tsx and v2/tests/e2e/saved.spec.ts (FR-013/014/029/030).
- [ ] T038 [US3] SCRUM-99 implement server per-user/type previous result/random CAS finalization in v2/services/community/src/saved/random.ts (FR-015/016).
- [ ] T039 [US3] SCRUM-100 implement fresh random UI0/1/n/error/empty with no filter in v2/apps/web/src/app/random/page.tsx and v2/tests/e2e/random.spec.ts (FR-015/016/029/030).

## Phase 6: US4 — Comments/reply/mentions (P2)

Goal: đúng actor/target/ownership/plain text, no ratings.
Independent test:two verified users on public target + admin moderation; SC-004.
Gates:US2, Catalog resolve, event61/62, Jira101→102.

- [ ] T040 [US4] SCRUM-101 write comments/thread/mention DTO contract tests first in v2/tests/contracts/comments.test.ts; assert create emits once/edit never re-emits, delayed event uses immutable creation refs not edited mentions (FR-017–021).
- [ ] T041 [US4] SCRUM-102 write foreign-owner/depth/target mismatch/delete/hide/restore/XSS tests first in v2/tests/integration/comments.test.ts (FR-012/018/019/030).
- [ ] T042 [US4] SCRUM-101 implement comments/replies/mentions/tombstones/reports/moderation/audit per C07/C08 and combined event in v2/services/community/src/comments/comments.ts and v2/services/community/src/comments/moderation.ts (FR-017–021).
- [ ] T043 [US4] SCRUM-102 implement new safe thread/mention picker/report/moderation UI and E2E in v2/apps/web/src/components/comments/thread.tsx and v2/tests/e2e/comments.spec.ts (FR-017–019/029/030).

## Phase 7: US5 — In-app notifications (P2)

Goal: đúng recipients/dedup/read/preferences/broadcast.
Independent test:two users+admin, all groups, late/replayed events; SC-005.
Gates:US2/US3 saved backend/US4 events/US6 catalog events;103→104→105→106.

- [ ] T044 [US5] SCRUM-103/104 write inbox/recipient/broadcast contract tests first in v2/tests/contracts/notifications.test.ts; four groups default enabled authority is remediation approval, not6/6 (FR-020–025).
- [ ] T045 [US5] SCRUM-103/104 write receipt crash/response loss/zero recipients/stale projection/group combinations/read replay tests first in v2/tests/integration/recipients.test.ts; include comment edit before delayed event processing without new recipient IDs (FR-021/022/025/030).
- [ ] T046 [US5] SCRUM-103 implement authoritative Community full enumeration and immutable receipts per C12 in v2/services/community/src/notifications/recipient-decisions.ts; snapshot commit is approved processing point, no cross-service SQL (FR-020/021/025).
- [ ] T047 [US5] SCRUM-103 implement Notification durable intake, versioned follow projection, receipt import and unique delivery per C15–C19 in v2/services/notification/src/intake/intake.ts and v2/services/notification/src/projection/follows.ts (FR-020/021/025).
- [ ] T048 [US5] SCRUM-104 implement owner inbox/count/read/all-read/target-fallback API with ledger authz in v2/services/notification/src/inbox/inbox.ts and v2/tests/integration/inbox-isolation.test.ts (FR-012/022/024/030).
- [ ] T049 [US5] SCRUM-105 implement new bell/inbox visible-tab polling/backoff/no-store in v2/apps/web/src/components/notifications/inbox.tsx and v2/tests/e2e/inbox.spec.ts (FR-022/024/029/030).
- [ ] T050 [US5] SCRUM-106 implement Notification compose/preview/send/idempotency/per-action admin check per C14 in v2/services/notification/src/broadcasts/broadcasts.ts and new UI/E2E in v2/apps/web/src/app/admin/broadcasts/page.tsx and v2/tests/e2e/broadcast.spec.ts (FR-023/025/029/030).

## Phase 8: US6 — Admin catalog (P2)

Goal: tự quản lý demo không sửa code.
Independent test:admin draft→offering→publish, normal user/direct upload denied; SC-001.
Backend85/86 is shared with US1, must be implemented before UI87/88 and US1 pages
per current Jira; phase grouping does not defer CRUD until after US5.

- [ ] T051 [US6] SCRUM-85/87 write admin CRUD/publish/upload boundary tests first in v2/tests/contracts/admin-catalog.test.ts; public/admin media GET must recheck publication or ledger, forged headers and direct bucket deny (FR-002/004/026/030).
- [ ] T052 [US6] SCRUM-88 write MIME/size/Storage failure/draft proxy/foreign user negative tests first in v2/tests/integration/media.test.ts; include published→draft, revoked admin, If-None-Match/Range/optimizer/shared cache bypass, no redirects/Storage credential disclosure (FR-004/012/026/030).
- [ ] T053 [US6] SCRUM-85/86 implement Catalog admin CRUD/media proxy and publication validation in v2/services/catalog/src/admin/admin.ts and v2/services/catalog/src/media/media.ts; references shared models T020/publication T021, no duplicate implementation (FR-003/004/025/026).
- [ ] T054 [US6] SCRUM-87/88 implement new admin catalog UI and create→publish E2E in v2/apps/web/src/app/admin/catalog/page.tsx and v2/tests/e2e/admin-catalog.spec.ts (FR-026/029/030).

## Phase 9: US7 — Reproducible demo (P2)

Goal: portable folder/root/local startup, persistent restart, honest prerequisites.
Independent test:clean path on machine with approved prerequisites; SC-007.
Gates:all desired journeys + approved provisioning +115→116;75/76 remains blocked
until isolated target exists, not satisfied by successful shared-project startup.

- [ ] T055 [US7] SCRUM-115 write startup-no-provisioning/persistence command tests first in v2/tests/integration/startup.test.ts (FR-027/028/030).
- [ ] T056 [US7] SCRUM-115 package demo orchestration and prerequisites guide in v2/scripts/demo.mjs and v2/docs/demo.md; one command after prerequisites, no author absolute paths or embedded secrets (FR-027/028).
- [ ] T057 [US7] SCRUM-116 run clean-path rehearsal/stop-restart and record real evidence in v2/docs/demo-validation.md; include2-cycle rebuild link or explicit isolated-target blocker, no success by description (FR-027/028; SC-007).

## Phase 10: Polish & cross-cutting

- [ ] T058 SCRUM-107 implement journeys/regression CI opt-in integration and E2E in v2/tests/e2e/journeys.spec.ts and v2/docs/ci.md covering SC-001–007/FR-030/031; no remote secrets in default CI.
- [ ] T059 SCRUM-108 inject broker/service/Auth/Storage/DB/receipt fault points and session races in v2/tests/integration/distributed-faults.test.ts; fix defects only with fail-before/pass-after regression (FR-030/031).
- [ ] T060 SCRUM-109/110 audit/fix keyboard/mobile/desktop/reduced motion/contrast/loading/empty/error in v2/tests/e2e/accessibility.spec.ts and v2/docs/accessibility.md (FR-029; SC-006).
- [ ] T061 SCRUM-111 measure full-workload P/U/headroom/RAM/CPU/latency/pool waits/leaks and public SEO in v2/tests/integration/capacity.test.ts and v2/docs/performance.md; timestamp/window/workload/sampling, not owner snapshot peak (FR-028/030).
- [ ] T062 SCRUM-112 audit service identity/CSRF/tokens/logs/direct DB/Storage bypass/revocation/roles and replay operations in v2/tests/integration/security.test.ts and v2/docs/security.md (FR-008/012/018/023/026/030/031).
- [ ] T063 SCRUM-113/114 polish new UI/design docs and obtain actual user acceptance in v2/docs/DESIGN.md and v2/docs/acceptance.md; all SC-001–007 evidence or explicit blockers, no fabricated capability (FR-001–031).
- [ ] T064 SCRUM-117/118 only after owner target-specific delete approval list exact legacy files/impact/backup status in v2/docs/legacy-removal-allowlist.md, remove confirmed targets then verify no legacy imports/assets and regressions in v2/tests/integration/no-legacy.test.ts; no delete at60 (FR-027/029).

## Dependencies & execution order

Current Jira snapshot read at generation:59 Done,60 assigned In Progress,
61–118 To Do. No future checkbox is Done. SCRUM-5 current sequence controls:

```text
59 Done →60(design/analyze) →63→64→65→66→67→68→69→70→71→72→73→74
→75→76 [blocked: isolated target] →61→62→77→78→79→80→81→82→83→84
→85→86→87→88→89→90→91→92→93→94→95→96→97→98→99→100
→101→102→103→104→105→106→107→108→109→110→111→112→113→114
→115→116→117→118
```

Do not bypass75/76 or change Jira dependencies because design can describe later
stories. Owner must resolve any scheduling blocker/reorder separately. Within a
Jira package test tasks precede models/services/endpoints/UI/integration; schema
models physically created in67/68, story tasks implement repositories/validation.
Explicit task deps:US1 T020+T021 shares85/86 with US6 T053;US6 UI T054 before
US1 UI T022 per roadmap. US3 needs US2+Catalog;US4 needs US2+Catalog;US5 needs
producer events and US2/3/4/6 backends. US7 depends real journeys/provisioning,
not mocks. Story isolated tests can use new local test doubles for contract cases,
never as runtime/demo capability claims.

## Parallel review — không cặp task parallel được duyệt hiện tại

Remediation I1 bỏ toàn bộ marker `[P]`;64 task/IDs/Jira mapping và dependency
graph phía trên giữ nguyên. Checklist nhóm story không là lịch chạy tuần tự
theo T-number; mỗi phần việc phải được giao theo Jira và đúng predecessor.

| Story | Thứ tự Jira bắt buộc, không ví dụ parallel xuyên package |
| --- | --- |
| US1 |85→86→89→90→91→92→93→94→95→96; T019 chỉ tại92 |
| US2 |81→82→83→84; T027 tách phần81/82 khi được giao, không chạy phần82 sớm |
| US3 |97→98→99→100; T034 tách saved97/random99, không chạy trước98 |
| US4 |101→102; T041 tại102 sau101 |
| US5 |103→104→105→106; T044/T045 thực hiện đúng phần mỗi subtask, không concurrently qua103/104 |
| US6 |85→86→87→88; T051 phần85/87 phải chờ package tương ứng, T052 tại88 |
| US7 |115→116; T055 test trước implementation T056 trong115, không parallel |

Finer-grained independent test files chỉ có thể parallel sau khi chia scope trong
cùng subtask đã giao và predecessor đạt; hiện chưa đánh dấu cặp task cụ thể.
Nếu sessions chạm cùng file/issue phải dừng xin phân chia, không suy quyền song song.

## Remediation C21/C22/C23 — propagation tới schema và tests

Trước implementation stories, T005/T006 áp dụng exact conditional fields/constraints
mới của dictionary trong SCRUM-68; T004/T009 áp dụng media owner/private bucket
constraints trong67/69. Không dời schema work sang81/83 vì task quote nằm ở story.

Constraint C21 dùng cho T005/T032/T040/T042/T044/T045:
“defaults reply/mention/restaurant_update/admin_broadcast=true; reply/mention chỉ phát khi tạo comment/reply, không phát lại khi edit; creation recipient refs bất biến, preferences vẫn xét tại recipient decision.”
Test default persistence cả4 nhóm và edit/no-event/delayed-recipient ở
v2/tests/contracts/profile.test.ts và v2/tests/integration/recipients.test.ts.
C22 quoted ởT032, cũng áp dụng T009/T051–T053 và Catalog media route; C23 quoted
ởT030, cũng áp dụng T006/T026–T031 và authority-schema tests. Chỉ design/tests
obligations, không runtime implementation ở60.

## Implementation strategy / checkpoints

MVP US1 public discovery after infra/schema/Auth provisioning/new design/admin
content prerequisites. Independently validate SC-001, then incremental US2–US6
with tests and acceptance gates. No deploy implied. Run quickstart static/current
commands and later implemented V2 test scripts; never commit/push by checklist.
At every checkpoint report Đã đạt/Chưa đạt/Bị chặn with real evidence; blocked
rebuild or Cloud delivery cannot be silently changed to pass.
