# SCRUM-64 — CI/TLS/roles gate review

## Current publication authority — owner approval 2026-11-17

Owner đã xác nhận snapshot và sau đó thay CI-only branch strategy bằng commit
ba cụm, push trực tiếp `main` một lần sau final checks. Giữ `.vscode/settings.json`
local, không stage/delete/revert; noforce/no branch-protection bypass/settings/
deploy/Cloud mutation. Worktree/branch CI cũ giữ nguyên, không tạo nhánh mới.
Thứ tự commit spec/architecture →governance/guardrails →V2/CI để config/tests có
document dependencies, không push intermediate commits.
Historical branch/pending-approval paragraphs dưới đây không current authority.

Agent environment verified gh account HuyTony2703/keyring active, repo
HuyTony2703/GRABMEFOOD viewerPermission ADMIN, default main; no credential read.
Fetch: localHEAD=origin/main=0bba883db9bcbca6a01de2e5d38b4cb57cec1746,
ahead/behind0/0, remote URL unchanged. Workflow reviewed: verify-only, immutable
actions, contents:read, noCloudsecrets/deploy/remote provisioning.
Actual Actions evidence vẫn pending, không được coi auth hoặc push là CI PASS.

Publication manifest reviewed:101files, split21spec/architecture (includes legacy
inventory/runbook),11governance/guardrails,69V2/CI/evidence (61snapshot source +
8root/evidence files). Stage exact filenames từ manifest đã kiểm, không add ./-A.
Heuristic precommit secret/path scan101/101:0findings (privatekeys/provider tokens/
JWT/credentialURLs/literal secrets/forbidden output/env paths); đây không bảo đảm
phát hiện mọi secret. Không đọc/stage `.vscode/settings.json` hoặc existing
credentials; opencode.jsonc chỉ public project metadata/permissions, không secrets.
Constitution temporary review comment removed per its precommit instruction;
no principle change. Runtime sources/images unchanged; v2README chỉ bổ sung S.
Old61-file patch/branch giữ làm historical snapshot, không current main manifest.

**2026-11-17 — C/T/S đã được owner duyệt có điều kiện.**
Các mục proposal/pending bên dưới giữ lịch sử audit; quyết định hiện hành ở đây:
C cho phép tạo worktree/stage nhưng phải trình manifest và staged diff, chờ owner
xác nhận trước commit/push. Owner tự đăng nhập gh; chỉ nhánh scrum-64-ci.
T tối đa hai attempts (host + diagnostic khi Docker sẵn sàng), không auth/SQL;
không đổi endpoint/pull/install/start Desktop. S đã duyệt để đồng bộ tasks/plan và
Jira đích, giữ đầy đủ live TLS/roles/isolation gates; không remote mutation/Done.
Không upload Atlassian Artifacts; evidence giữ trong repo, dẫn path tại Jira.
Không build/start lại6containers, không sửa image/source/Compose/WSL/global config.

## 1. Current evidence / scope

Local scaffold đã kiểm thật ở
[runtime validation](SCRUM-64-runtime-validation.md):5images,6simultaneous healthy,
60s window,200/503/404,stop/start,broker persistence,noOOM/restarts0. Đó không
phải Cloud integration hoặc GitHub Actions evidence.

Lượt này chỉ audit Git/workflow/permissions/Jira/dependencies/metadata và trình
approval. Allowlist ghi: evidence này +references validation/Jira64/21. Không
thực thi22/23/65/67–70 trước tiền nhiệm, không tạo/grant role/schema hoặc SQL.
Đọc AGENTS/permissions/status/diff/workflow/tasks, giữ unrelated user work.

## 2. GitHub CI — actual read-only findings

- Repo `https://github.com/HuyTony2703/GRABMEFOOD`, local branch `main`.
- LocalHEAD và actual remote main từ `git ls-remote` cùng:
  `0bba883db9bcbca6a01de2e5d38b4cb57cec1746`.
  Đây là inspected base SHA, **không phải CI-tested V2 commit**.
- `.github/workflows/v2-ci.yml` và V2 source chưa commit; `git ls-tree HEAD`
  không có workflow này, index không có staged files. Remote branch
  `scrum-64-ci` chưa thấy trong exact-ref lookup tại thời điểm kiểm.
- `gh.exe` có sẵn; `gh repo view ... --json viewerPermission` và `gh workflow list`
  đều fail yêu cầu `gh auth login`. Không đọc token/credentials hoặc tự đăng nhập.
  Git remote read thành công KHÔNG chứng minh Actions/write/push permission.
- Business authorization commit/push/trigger chưa được cấp riêng.
  Không `push --dry-run` để thử quyền ghi; không branch-protection/settings change.

### Workflow đã đọc — chưa actual run

`v2-ci.yml`: push/PR paths V2+workflow, workflow_dispatch, Ubuntu24.04,
permissions contents:read, checkout credentials không persist, action SHAs pin,
Node24.16.0/pnpm11.5.0 đã duyệt; frozen install --ignore-scripts,
`pnpm verify` (lint/typecheck/unit/infra/build/host-process smoke).
Không secrets.*, Cloud calls/migration/seed/reset/deploy hoặc image build/start.
Infra parser tests cần ComposeCLI nhưng không Engine; actual runner availability
vẫn phải để CI run xác minh, không tự giả PASS.

| CI evidence field | Actual current value |
| --- | --- |
| Run URL / run ID | Chưa có run cho V2 snapshot này |
| CI commit SHA | Chưa tạo/push; không gán inspected base SHA làm CI proof |
| Jobs defined | `verify` |
| Jobs executed / result | Chưa chạy |
| Local evidence | Prior report36infra/24Jest/lint/typecheck và actual Docker; tách riêng CI |

### CI approval request — chưa thực hiện

Đề nghị owner cho phép:

1. Tự đăng nhập `gh auth login` qua trình duyệt trên máy (không token trong chat/
   Jira; agent không tự đổi account credentials/settings).
2. Tạo isolated worktree mới `D:\Projects\GRABMEFOOD-CI-SCRUM-64`, branch
   `scrum-64-ci` từ base SHA trên. Nếu path/branch đã tồn tại thì dừng, không
   delete/overwrite. Không chuyển branch hoặc staging user work ở workspace chính.
3. Chỉ copy/review/commit Git-visible `v2/**` +`.github/workflows/v2-ci.yml`
   (current inventory61source files; review exact manifest/diff trước commit).
   Không `.env` thật/node_modules/store/.next/dist/reports/volumes, `.vscode/`,
   root governance/docs/user changes khác. `.env.example` chỉ inert documentation.
   Đây là CI snapshot, không merge/publish toàn bộ handoff artifacts.
4. Push **nhánh mới, không force**, push trigger chạy workflow hiện có trong
   snapshot. Không push main/merge/deploy/settings/paid runner/secrets/Cloud.
5. Read actual run/job logs/status bằng authenticated gh; ghi URL/SHA/jobs/
   conclusion, không gọi local PASS là GitHub PASS. Nếu Actions disabled/quyền
   thiếu thì báo blocker, không tự mở quyền.

Chưa được duyệt nên chưa tạo worktree/branch, stage/commit/push/trigger.

## 3. Cloud TLS — target và minimal test đề xuất

Nguồn approved direct Connect metadata/ADR/current config:

- Project `bdhavbwmxbttymerizvx`.
- Direct PostgreSQL `db.bdhavbwmxbttymerizvx.supabase.co:5432`,
  database `postgres`; admin username trong owner report KHÔNG được dùng làm
  runtime credential hoặc service-role proof.
- Session pooler Connect host/port/role-format chưa được owner cung cấp;
  không suy từ ref, không tự đổi transaction pooler/mua IPv4 add-on.
- Repo MCP scoped read_only, chỉ5metadata tools; arbitrarySQL/key retrieval deny.
  TLS ngoài MCP cũng cần owner approval riêng, không dùng tool khả dụng để bypass.
- CA owner báo đã tải trước đây, chưa có exact path/approved read. Không search
  credentials hoặc filesystem ngoài allowlist để tự lấy CA/password.

### TLS request T — không cần password/role/SDK

Nếu owner duyệt, tối đa **2handshakes tuần tự**, mỗi môi trường1attempt,
timeout≤10s, đúng một target direct phía trên:

1. Host Node24 built-in net/tls: DNS A/AAAA →TCP →PostgreSQL SSLRequest
   (8bytes,code80877103), yêu cầu server trả `S`.
2. TLS qua socket đó, `servername`=exact Connect hostname, **rejectUnauthorized:true**,
   chain+hostname verification mặc định; không custom callback bypass.
3. Dùng trust store mặc định. Nếu owner chọn CA project, chỉ đọc public certificate
   tại exact path được cấp, không in nội dung; fail nếu chain/name không hợp lệ,
   không fallback rejectUnauthorized=false/sslmode=require.
4. **Close trước PostgreSQL StartupMessage/authentication**. Không username/password/
   DATABASE_URL/API key/session/Auth request/SQL, không create/grant/config/seed.
5. Chỉ log env/target public/verified flags/TLS protocol/public fingerprint và
   sanitized error. Không gọi handshake là DB login/service-role/pool PASS.
6. Nếu muốn evidence từ môi trường appLinux:1fresh diagnostic container dùng
   **existing built Catalog image**, resolve/pin actual imageID trước start;
   Node entrypoint chỉ chạy probe, cap256MiB/noSwap, no volume (trừ readonly
   approved probe/publicCA), no deps/pool/business startup. Không start6services,
   không pull/rebuild hoặc đụng existing stopped containers. Diagnostic giữ stopped,
   không --rm/delete.

Ảnh hưởng: max1TCP/SSL connection tồn tại mỗi lúc trong≤10s (2env nối tuần tự),
có thể được server ghi connection-attempt/consume transient negotiation slot;
không authenticated DB workload. Địa chỉ direct có historical IPv6 route failure;
nếu network fail thì báo blocked, không disable TLS hoặc guess pooler endpoint.
Host-only PASS không thay appLinux TLS evidence.

**Chưa được phép nên chưa DNS/TCP/TLS/CA read hoặc container probe.**
Docker metadata lookup hiện còn fail pipe `dockerDesktopLinuxEngine` missing
(không auto start Desktop). Không suy Cloud down; existing imageID/current stopped
state chưa fresh-query được lúc audit này. Prior retained state ở runtime report.

## 4. Roles — biết gì, chưa biết gì

Fresh allowed metadata: list_tables(public/catalog/community/notification)→[],
list_migrations→[]. Local `v2/infra/migrations` chưa có. Jira22/23/67–70 ToDo.
Đây là evidence **chưa implementation/migration trong repo**, không chứng minh
live pg_roles rỗng/roles không tồn tại. MCP tools được phép không enumerate roles;
không chạy SQL/đọc password/env để “chứng minh”.

Live runtime-role existence: **UNKNOWN / chưa verified**, không ghi “đã có”
hoặc “chắc chắn chưa có”. Tên *_runtime trong unit fixtures là inert, không
approved live role roster. Owner có thể cung cấp sanitized role inventory từ
Dashboard/owner-run metadata, không password/rolpassword; formal inventory ở65.
Không dùng admin connection PASS để thay limited-service negative tests.

Current ownership:
-22/67: migrations Catalog **và service DB roles** theo title/parent22.
-22/68: Community/Notification schemas; parent22 nói migrations tạo3schemas+
  DBusers/roles. Đề xuất chốt role creations tương ứng tại67/68, không làm trước.
-23/69: least-privilege grants/RLS/Storage policies; runtime≠migration principal.
-23/70: actual authenticated own-schema positive +cross-schema/user/admin/
  privilege-escalation negatives, TLS verification trong client/runtime dùng role.

## 5. Acceptance-induced cycle — không phải Jira-link cycle mới

Đã dùng Graph context21, hydrate64/47; raw Jira issuelinks xác nhận direction:

```text
21(In Progress, chứa64) --Blocks10007-->47(ToDo,65→66)
47 --Blocks10009-->22(ToDo,67→68:create roles/schema)
22 --Blocks10010-->23(ToDo,69→70:grants/isolation)

nhưng current64/21 acceptance đòi runtime Cloud service roles/integration
       <-- cần đầu ra22/23
```

Đó là cycle do **acceptance đòi đầu ra của successor**, không kết luận graph link
tự có directed cycle. Chưa thêm/xóa/reverse links để giải quyết ngầm.
Source tasks T002 đòi64 TLS/network/role readiness; T004–T010 mới tạo schema/
roles/grants và chạy isolation. Approved split59 đặt live connectivity64 khi
roles chưa có phải blocked; nay cần owner amendment để tách gate, không tự waive.
Target47/65 cũng đã sở hữu actual Connect metadata/TLS/plan/inventory sau21.

## 6. Đề xuất split S — CHƯA DUYỆT / chưa áp dụng

Giữ DAG21→47→22→23→48. Không tạo role sớm hoặc drop permission tests khỏi roadmap.

| Hạng mục | Evidence đã có | Phần thiếu | Task phụ trách | Cần tôi duyệt |
| --- | --- | --- | --- | --- |
| Scaffold/local orchestration/resources/shutdown/broker persistence | Runtime report:5images/6healthy đồng thời,200/503/404,noOOM,stop/start,persistence | Không cần replay6containers; mọi regression mới phải test phù hợp | Giữ64/21 | Không đổi local AC; không Done chỉ nhờ static |
| CI không Cloud secrets | Workflow source, local checks riêng | Auth+authorized branch snapshot/push và actual run URL/SHA/job/conclusion | Giữ64/21 | CI approval/worktree/commit/push; owner login gh |
| Config safety | Project ref/role/TLS-disable/pool guards +negative tests | Không biến URL validation thành Cloud PASS | Giữ64 | Approved split xác nhận offline guard là scaffold gate |
| Live endpoint/network/certificate chain+hostname | Approved direct metadata; historical network failure; chưa liveTLS | Inventory Connect/mode/CA, IPv4/IPv6, credential-free probe từ môi trường app,negative verification cases | Formal gate47/65 (không roles); current64 chỉ diagnostic nếu T được duyệt | Split S +TLS T; exact CA path nếu dùng |
| Create/map runtime+separate migration roles/schema ownership | ADR/data dictionary, chưa migrations | Approved target-specific migrations/apply/role roster; không dùng shared postgres |22/67–68 | Split S; remote apply riêng ở task đó |
| Authenticated DB TLS, grants/isolation/no cross-schema | C20 +planned tests | Actual service-role logins with verified TLS,own-schema allow/cross-schema deny,no superuser/DDL/admin fallback,pool4/4/2 |23/69–70 | Split S; credentials/access permission riêng, tests vẫn mandatory |
| Auth/Storage readiness/quotas/email | Owner reports/historical metadata only | Supported-API provisioning/quota/real account/Storage tests; SMTP delivery |48/71–72 rồi Auth81–82 theo existing roadmap | Không waive; remote/provisioning scope riêng |
| Aggregate Cloud capacity | Provisional4/4/2,H12,ordinary57 owner report | U_peak/time-series/leaks/waits/headroom full workload |111; security audit112 | Không gọi local scaffold run là full capacity PASS |

### Điều kiện đóng64/21 theo proposal (chỉ sau owner duyệt)

- Giữ local actual gate +source/runbook/env/logging/shutdown/negative config checks.
- **Actual GitHub CI** trên exact reviewed commit phải đạt, noCloud secrets.
- Ghi Cloud integration not-verified và handoff rõ tới65/67–70; không nhận là PASS.
- Formal liveTLS/role/grant/integration gates không còn precondition của64,
  mà successor chịu trách nhiệm và vẫn block downstream features theo roadmap.
- Role tests70 cần evidence thật; failure ở65/69/70 không bypass bằng CI/liveness.
- Trước chốt: owner duyệt S; sau đó mới đồng bộ task descriptions/T002/plan/
  validation/traceability liên quan. Chưa sửa artifacts approved hay links ở lượt này.
- **Không chuyển Done tại audit này**; quyền approve split không tự thay actualCI
  run hoặc owner closure review. Không bắt đầu successor trước closure hợp lệ.

## 7. Decisions needed / next verified boundary

1. **CI C:** isolated worktree+branch snapshot+commit/push/push-trigger, allowlist
   section2; user login gh outside chat. Hoặc owner tự publish/run rồi cung cấp
   runURL/SHA để đối chiếu read-only.
2. **TLS T:** credential-free target/2environments/timeout/validation section3;
   default trust store hoặc publicCA exact path; DockerDesktop phải reachable
   trước single-container probe, không restart6apps.
3. **Split S:** chính thức route formal liveTLS→65/create roles→67–68/
   grants+authenticated tests→69–70, keep local+actualCI→64. Không drop tests.

Trong khi chờ: no branch/worktree/write/trigger/TLS/SQL/role creation/acceptance
mutation/status transition/Artifacts upload. Evidence repo path tại Jira64/21.

## 8. Fresh checks của audit (không phải CI/Cloud/runtime replay)

- `npm test`47/47 PASS; typecheck0diagnostics/66files; structure73/73.
- `pnpm test:infra`36/36 PASS với ComposeCLI parser, Engine không truy cập được;
  không start Docker/appservices. HTTP probe unit fixtures chỉ localhost ephemeral.
- `git diff --check` exit0(LFwarnings). Không rerun production build,6containers,
  liveCloud TLS hoặc role/SQL tests; previous36/24/runtime report vẫn dated evidence,
  không gán GitHub runURL/CI SHA chưa tồn tại.
- Chưa dùng SpecKit specify/analyze workflow: current Jira+T002/T004–T010 đủ cho
  targeted dependency review. Không gọi đây là rerun full SpecKit analyze.

Jira64 comment**10060**,parent21 comment**10061** dẫn report này và evidence
runtime, ghi C/T/S pending approval. Chỉ comments, không sửa description AC,
dependencies/assignee/status, không đóng task hoặc thực thi successor.

## 9. Approved C/T/S — execution boundary 2026-11-17

Owner duyệt C/T/S với các điều kiện được giữ nguyên: review manifest/staged diff
trước commit/push; owner tự login gh và mở Docker; không remote mutation.
S đã đồng bộ descriptions Jira21/64/47/65/22/67/68/23/69/70 (read-modify-write
markdown, giữ nội dung cũ dưới amendment ưu tiên), tasks T002–T010/plan/research/
traceability/validation và architecture. Không đổi nghiệp vụ spec.md/contracts/
constitution; không thêm dependency link vì DAG hiện tại đã đúng. Chưa task Done.

### C — staged snapshot để owner xác nhận

- Worktree mới: `D:\Projects\GRABMEFOOD-CI-SCRUM-64`, branch `scrum-64-ci`,
  base `0bba883db9bcbca6a01de2e5d38b4cb57cec1746`; tạo sau khi xác nhận
  path/branch chưa tồn tại, không overwrite/discard workspace chính.
- **61 new files, 7242 additions, 0 deletions**, chỉ `v2/**` và workflow;
  gồm scaffold63 làm dependency cần thiết cho64. Exact Git blob từng file
  so với source workspace chính trùng nhau (Git newline normalization).
- Full manifest: [SCRUM-64-ci-files.txt](SCRUM-64-ci-files.txt).
- Full staged patch, gồm lockfile:
  [SCRUM-64-ci-staged.diff](SCRUM-64-ci-staged.diff).
- Staged tree `42636bd62dda5dd80600a853e57bc32984bf7f7e` (KHÔNG là commit SHA).
- Exported patch SHA256:
  `2E6F3F1C5655DEFD668DA4CCC94B67906A94AA3C52DF14E86362DF490DD61759`.
- Scope review: manifest/toolchain approved exact pins +lockfile; independent
  7packages, config/contracts, diagnostic-only Web/Nest; Compose/Dockerfile/
  budgets/guards/harnesses/regression tests và workflow `verify`.
  Không actual .env/store/node_modules/generated dist/reports/volumes hoặc
  unrelated root/user changes. `.env.example` chỉ inert values, không credentials.
  README links tới root evidence không nằm trong CI snapshot theo allowlist;
  CI tests không cần root docs. Đây không phải full documentation release.
- Worktree `node --test tests/infra/*.test.mjs`: **36/36 PASS**, không install/
  build/images/Engine startup. Staged diff check PASS, LF warnings only.
- `gh repo view ... --json viewerPermission` vẫn requires login lúc kiểm đầu lượt;
  technical permission chưa verified. **Chưa commit/push/trigger**, runURL/
  CIcommitSHA/job conclusion chưa có; planned job `verify`.
- Owner xác nhận manifest/patch rồi mới commit/push nhánh scrum-64-ci. Nếu staged
  tree thay đổi, phải trình lại diff, không coi approval cũ bao phủ source mới.

### T — kết quả tách môi trường

| Environment | Attempt | Actual result |
| --- | --- | --- |
| Host Windows |1, `2026-11-17T01:26:35.491Z` | **BLOCKED DNS `ENOTFOUND`**,458ms, trước TCP/SSLRequest/TLS; chain/hostname chưa verify |
| Catalog diagnostic Linux | Chưa dùng attempt2 | Chờ owner mở Docker Engine; không auto start/pull/install hoặc sáu services |

Host probe source đã lưu ở approved temp
`C:\Users\HUY\AppData\Local\Temp\opencode\scrum64-tls-probe.cjs`.
Built-in Node net/tls, fixed direct endpoint5432, global timeout10000ms,
autoSelectFamily:false (không tự nhiều TCP retries), PG SSLRequest8bytes/code
80877103, require response `S`, default trust +SNI +rejectUnauthorized:true,
không callback bypass; close trước StartupMessage. Không credential read/auth/SQL.
Actual host lỗi DNS nên chưa gửi SSLRequest, không suy server down/role unavailable.
Không retry host/đổi endpoint. Chỉ còn attempt2 cho container khi Docker sẵn sàng.

### Remaining closure

Local scaffold evidence giữ nguyên. S không miễn actual GitHub CI hoặc các tests
downstream;64/21 In Progress. Điểm chờ hiện tại: owner review staged patch +
gh login; owner mở Docker cho optional diagnostic attempt2. Không Artifacts upload.

Post-amendment checks actual PASS: root47/47,typecheck0/66,structure73/73;
feature31/31/checklist16/16/10decisions; contracts11docs/64tasks/24constraints/
31FR;diffcheck0(LFwarnings). Không build. Jira readback10/10 amendment present,
21/64 vẫn In Progress, các successor To Do. Current evidence comments64:**10063**,
21:**10062**. Main workspace index giữ trống; staged snapshot tree unchanged,
worktree không có unstaged source changes tại final check.
