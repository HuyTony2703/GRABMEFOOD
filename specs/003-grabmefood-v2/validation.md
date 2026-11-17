# SCRUM-18 — Review bằng chứng, chưa phải nghiệm thu ứng dụng

## Current SCRUM-64 amendment — 2026-11-17

Owner duyệt C/T/S có điều kiện. S áp dụng vào tasks T002–T010, plan, research,
traceability, architecture và Jira21/64/47/65/22/67/68/23/69/70. Keep DAG,
live TLS/roles/isolation tests mandatory ở65/67–70, không remote mutation.
64/21 chỉ Done khi local acceptance và actual GitHub CI đều đạt.
C: isolated worktree scrum-64-ci đã stage61allowlisted files; phải owner xác
nhận manifest/staged diff trước commit/push, gh login do owner tự thực hiện.
T: host attempt1 ngày2026-11-17T01:26:35.491Z bị DNS ENOTFOUND sau458ms,
chưa TCP/TLS/certificate verification; không StartupMessage/auth/SQL. Container
attempt chưa chạy, chờ owner mở Docker. Không rerun sáu services hoặc build.
Evidence/manifest/diff references: docs/maintenance/SCRUM-64-gate-review.md.
Các section lịch sử trước S không phải current closure AC.

> **Mốc mới nhất 2026-11-16**: xem section cuối. Sau owner phê duyệt chuẩn hóa
> MCP V2 metadata-only, baseline mới PASS47/47. Kết quả45pass/2fail trước đó
> được giữ như evidence fail-before, không phải trạng thái hiện tại.

> Các kết quả SCRUM-18/46 dưới đây là lịch sử tại thời điểm Supabase Local.
> Quyết định Cloud/session A sau đó thay topology, không viết lại kết quả cũ.
> Current source: [ADR Cloud](../../docs/adr/0001-supabase-cloud.md) và
> [architecture](../../docs/architecture.md). Constitution hiện 3.0.0;
> spec vẫn 31 FR, bổ sung 3 decision records Cloud/session (tổng 10).
> MCP repo-only read-only đã cấu hình, ban đầu needs authentication rồi connected.
> Metadata business tables/migrations rỗng; chưa kiểm application DB/Auth/Storage/
> SMTP hoặc full Auth E2E; rebuild blocked thiếu isolated target.

## Trạng thái

Feature: [spec.md](spec.md); coverage: [traceability.md](traceability.md).
Đã soạn bản review sau 6 câu trả lời specify và 1 câu trả lời clarify của chủ dự án.
Chủ dự án đã phê duyệt toàn bộ spec và amendment constitution tại SCRUM-56 bằng câu
“Tôi duyệt toàn bộ để tiếp tục” ngày 2026-11-15. SCRUM-46 bước đầu đang kiểm kê quyền/
capability thực tế; chưa sửa permission config hoặc quyền tài khoản/GitHub.

## Tooling và workflow thực tế

- `.specify/init-options.json` và `.specify/integration.json`: Spec Kit **1.3.3**,
  integration **OpenCode/PowerShell**, commands `.opencode/commands/speckit.*.md`.
  Không giả có standalone skill hoặc cài công cụ mới.
- Đã đọc hướng dẫn specify/clarify/constitution trong integration đã cài.
- Chạy resolver thật:
  - `.specify/scripts/powershell/resolve-template.ps1 spec-template -Json` — thành công.
  - `.specify/scripts/powershell/resolve-template.ps1 constitution-template -Json` — thành công.
- Không có `.specify/extensions.yml`, thư mục extension/preset trong cây thực tế
  đã kiểm; không có hooks before/after specify/clarify/constitution cần dispatch.
- `.specify/feature.json` trỏ `specs/003-grabmefood-v2`. Đây là metadata local bị
  ignore trong repo hiện tại, không mặc định sẽ đi theo commit; feature directory
  đã được dẫn bằng đường dẫn rõ trong tài liệu.
- Đã chạy **một lần** `.specify/scripts/powershell/check-prerequisites.ps1 -Json -PathsOnly`
  khi bắt đầu clarify: FEATURE_DIR/FEATURE_SPEC đúng feature mới.
  Tool trả BRANCH là tên feature suy ra; `git status --short --branch` xác nhận
  nhánh Git thật vẫn **main**, không tạo/chuyển branch.
- Không chạy plan/tasks/analyze; chúng thuộc gói kiến trúc/kế hoạch sau.
- Constitution 1.0.0 → bản amendment **2.0.0** vì thay nguyên tắc bắt buộc reuse
  React/Vite/components legacy bằng V2 đã duyệt, không chỉ sửa chính tả.
  Giữ các nguyên tắc discovery-only, tiếng Việt/a11y, evidence và tests;
  không bịa ngày ratification gốc. Amendment cùng spec đã được chủ dự án duyệt tại SCRUM-56.

## Kết quả rà clarify

Một câu hỏi được hỏi/trả lời trong lượt clarify chính thức: logout phiên hiện tại,
đổi/khôi phục mật khẩu kết thúc mọi phiên. Sáu quyết định trước đó thuộc lượt specify;
mỗi quyết định ghi một bullet Q→A trong spec, không ghi đề xuất thành phê duyệt.

| Nhóm rà | Kết quả | Nguồn / phần xử lý tiếp |
| --- | --- | --- |
| Functional scope & behavior | Resolved | Không rating; auth/settings/search/saved/random/community/inbox được chốt |
| Domain & data model | Resolved | Món độc lập, offering, stable identity/handle, reply một tầng; không thiết kế schema ở đây |
| Interaction & UX flow | Clear | US1–7, loading/empty/error, onboarding skip/resume, 0/1/n random |
| Non-functional quality | Resolved / Deferred kỹ thuật | Scope bảo mật/riêng tư/a11y rõ; rate/upload/input limits, timing/resource budgets chốt trong contracts/ADR tại SCRUM-19/21/23/31 |
| Integration & external dependencies | Clear | Local mới, mail demo; không cloud bắt buộc hoặc tích hợp social/map/payment |
| Edge cases & failure | Resolved | Query race/filter, session expiry/revocation, wrong owner, hidden/deleted, duplicate/late notification |
| Constraints & tradeoffs | Clear | Xây mới, không migrate/reuse; one-command sau prerequisites, startup không reset |
| Terminology & consistency | Clear | Comment thay scored review, món độc lập khác offering, không giữ pair identity legacy |
| Completion signals | Clear | FR/US/SC và traceability; owner approval là gate riêng, không phải E2E đã pass |
| Misc / placeholders | Clear với TODO metadata | Không còn marker nghiệp vụ trong spec; ngày ratification cũ vẫn TODO đúng thực tế |

Các mục Deferred là phương thức/giới hạn kỹ thuật thuộc task sau, không phải quyền
mở rộng nghiệp vụ. Việc duyệt spec không cho phép triển khai task ngoài gói được giao.

## Checklist

`checklists/requirements.md`: **11/16 → 16/16** ở mức chất lượng đặc tả.
Mới đạt: không còn marker, yêu cầu rõ/testable, đủ scenarios, yêu cầu có tiêu chí
nghiệm thu và coverage phù hợp SC. Không có regression checklist.

Phần Notes của checklist giữ nguyên snapshot **review vòng 1** theo quy tắc
clarify chỉ đổi checkbox; các ghi chú điểm mở tại đó là lịch sử, đã được thay bằng
quyết định trong spec và trạng thái hiện tại ở đây. 16/16 KHÔNG có nghĩa V2 đã chạy
hoặc đạt SC; các SC là mục tiêu sẽ kiểm khi triển khai.

## Kiểm tra thực chạy

Ở mốc draft trước khi tích hợp các câu trả lời cuối:

| Lệnh | Kết quả |
| --- | --- |
| `npm test` | PASS 38/38, không skip |
| `npm run typecheck` | PASS, 0 diagnostics/66 app source files |
| `npm run check:structure` | PASS, 73/73 reachable; không missing imports/unused files |
| Node inline kiểm spec/metadata/checklist/links | PASS ở draft 30 FR/3 markers/11 checklist; tiếp tục PASS 31 FR/1 marker sau lượt trả lời tiếp |

Đã chạy lại trên bản review sau câu trả lời cuối:

| Lệnh | Kết quả thực tế |
| --- | --- |
| `node specs/003-grabmefood-v2/validate.mjs` | PASS, 31 FR duy nhất, 31/31 được trace về Jira, 16/16 checklist, đúng 7 quyết định, links/newlines/whitespace/constitution metadata hợp lệ |
| `npm test` | PASS, 38/38 legacy tests, không skip |
| `npm run typecheck` | PASS, 0 diagnostics/66 files |
| `npm run check:structure` | PASS, 73/73 reachable; missingImports/unusedFiles rỗng |
| `git diff --check` | PASS exit 0; cảnh báo LF→CRLF theo cấu hình Git, không phải lỗi kiểm tra |
| `git check-ignore -v .specify/feature.json` | Xác nhận `.specify/.gitignore:6` ignore local feature pointer |

Một lần thử validator dạng Node inline bị portable shell scanner từ chối
`invalid-structure` trước khi thực thi. Đã chuyển kiểm tài liệu thành script
`validate.mjs` trong feature để chạy lại được; lệnh file ở bảng trên đã PASS.
Đây không phải mã ứng dụng hoặc permission enforcement.

Không build/render/E2E/DB tests vì chưa sửa UI/app hoặc có backend V2.

## File và quyền

- Sửa `.specify/memory/constitution.md`, local `.specify/feature.json`.
- Thêm feature directory gồm spec/checklist/traceability/validation và script
  `validate.mjs` chỉ đọc để kiểm tài liệu, không thêm dependencies hoặc npm scripts.
- Giữ nguyên ba tài liệu kiểm kê untracked có sẵn từ Gói 1.
- Không sửa AGENTS ở mốc này; không application/config dependency/schema/migration,
  Supabase remote/local, permission config, quyền tài khoản/GitHub, reset hoặc deploy.
- Không commit/push. Không có bug fix để báo regression pass giả.

## Gate tiếp tục

Đã thêm evidence vào Jira và chuyển **SCRUM-55 Done** sau khi kiểm tài liệu cuối đạt.
Chủ dự án đã duyệt toàn bộ, không chỉ trả lời bảy câu hỏi cục bộ. Sau khi chạy lại
kiểm tài liệu/baseline đều đạt, đã comment evidence và chuyển **SCRUM-56/SCRUM-18 Done**.
**SCRUM-46/57/58 Done**: chủ dự án sau đó chọn A cho project-only permission
config và canary vô hại. SCRUM-57 đã merge AGENTS/matrix, có tests;
SCRUM-58 đã có workflow/templates/config và live deny canary. Mốc cuối PASS
46 tests (38 legacy + 8 guardrail), typecheck/structure, static guardrail/spec validators
và Git diff check. Chỉ kiểm nhánh deny live, không claim nhánh ask hoặc CI đã kiểm live.
Nguồn evidence riêng: [SCRUM-46-validation](../../docs/maintenance/SCRUM-46-validation.md).

## Kiểm kê quyền thực tế trước SCRUM-46

- `opencode --version`: **v2.3.0**.
- Đã dùng skill OpenCode và đọc tài liệu V2 tại
  `https://opencode.ai/docs/config`, `/permissions`, `/cli` vì SCRUM-58 cần
  kiểm permission enforcement của harness thật; không dùng skill UI.
- Không thấy `opencode.json(c)` trực tiếp hoặc trong `.opencode/` tại repo và
  các ancestor `D:\Projects`, `D:\`; không thấy config file tại
  `C:\ProgramData\opencode`. Không suy từ đó rằng mọi policy runtime đều đã biết.
- Đọc có chọn lọc config global `C:\Users\HUY\.config\opencode\opencode.jsonc`
  qua JSONC parser TypeScript đang cài: không có `permissions`, legacy `permission`,
  top-level policy array hoặc agent permission overrides được liệt kê.
  Không in providers/API keys/config toàn bộ; không thay config global.
- Theo docs V2, AGENTS không tự chặn công cụ; rule `ask`/`deny` và canary test
  cần config hỗ trợ. Chưa có bằng chứng live gate `ask`/`deny` của chính sách mới.
- Sau kiểm kê này, chủ dự án đã chọn A: cho phép tạo config permission **project-only**
  `D:\Projects\GRABMEFOOD\opencode.jsonc` và canary vô hại. Đã tạo theo quyền đó;
  không sửa global/account/GitHub hoặc đổi AC thành documentation-only.

## SCRUM-59 — Cloud synchronization và ranh giới tiếp tục

### Quyết định và scope

Owner duyệt Cloud PostgreSQL/Auth/Storage; apps/broker localhost, monorepo `v2/`,
session A và origin/callback/reset paths; full Auth sau scaffold. Không chạy lại
specify, không tạo data-model/contracts/Compose/env/migrations/seed khi chúng chưa
tồn tại ở V2. Plan vẫn template có annotation, full plan/tasks/analyze là SCRUM-60.
Constitution 3.0.0 thay local-only, giữ ngày ratification chưa rõ.

### Kiểm tra thực chạy sau amendment

| Check | Kết quả |
| --- | --- |
| `node --test tests/contracts/guardrails.test.mjs` trước config mới | RED: 8 pass/1 fail vì chưa có mcp.servers; test scope/read-only/deny mới không bị bỏ/giảm assertion |
| `npm test` sau config | PASS 47/47, không skip (38 legacy + 9 guardrail) |
| `npm run typecheck` | PASS 0 diagnostics/66 files |
| `npm run check:structure` | PASS 73/73 reachable, không missing/unused |
| `node specs/003-grabmefood-v2/validate.mjs` | PASS 31 FR, 31 mapped, 16/16 checklist, 10 owner decisions |
| `node scripts/check-guardrails.mjs` | PASS 7 documents/45 rules; staticOnly=true |
| `git diff --check` | PASS, chỉ LF→CRLF warnings |
| `opencode mcp list` | Lần đầu needs authentication; lần sau connected |
| Supabase `get_project_url` | URL thực `https://bdhavbwmxbttymerizvx.supabase.co` |
| Supabase `list_tables` (public/catalog/community/notification, verbose=false) | `tables=[]`; chỉ các schema yêu cầu, không dữ liệu cá nhân |
| Supabase `list_migrations` | `migrations=[]` |

Không lấy metadata trên làm kết luận toàn project rỗng hoặc DB TLS/SMTP/E2E đã
đạt. Không đọc keys/credentials, arbitrary SQL, Auth users, Storage objects.
Không build/render vì chỉ docs/config/test, không UI hoặc app runtime thay đổi.
Canary hard deny giữ nguyên; không lặp live canary hoặc tuyên bố MCP mutation
đã test live. Không install skills/deps/global config, remote write, commit/push.

### Jira đã sửa — không tạo ticket mới

Đã quét đủ **114 issues**, hai trang (100 + 14), cùng scope GrabMeFood V2.
Đọc current body/status/assignee/updated trước edit; kiểm updated trước full-body
write để phát hiện thay đổi đồng thời (không có conflict trả về). Chỉ ghi
description; thêm summary cho 35/47/65/66/75 để bỏ tên Local sai.
Không gửi status/assignee/dependency fields, không transition hoặc tạo issue.

- SCRUM-5–35 (tất cả keys liên tiếp trong khoảng).
- SCRUM-37, SCRUM-38, SCRUM-43–49.
- SCRUM-53–60, SCRUM-63–76.
- SCRUM-81–84, SCRUM-87–88.
- SCRUM-107–108, SCRUM-111–112, SCRUM-114–117.

Tổng **76 issues**: 65 có amendment theo nhóm kiến trúc/DB/Auth/Storage/CI/demo/
guardrail; thêm 11 task chỉ sửa câu quyền reset chung cũ thành isolated approved
target. Những “local” mô tả apps/broker/runtime trên máy vẫn giữ. Lịch sử inventory/
waiver không bị biến thành Cloud từ đầu. Rebuild hai vòng không miễn, blocked.

### Files thay đổi trong lượt Cloud

- `AGENTS.md`, `README.md`, `.specify/memory/constitution.md`.
- `opencode.jsonc`, `scripts/check-guardrails.mjs`, `tests/contracts/guardrails.test.mjs`.
- `docs/architecture.md`, `docs/permissions.md`, `docs/adr/0001-supabase-cloud.md`.
- `docs/legacy-inventory.md`, `docs/runbooks/legacy-backup-restore.md`,
  `docs/maintenance/SCRUM-6-validation.md`: chỉ note supersession, giữ snapshot.
- `specs/003-grabmefood-v2/spec.md`, `research.md`, `plan.md`, `traceability.md`,
  `validation.md`, `validate.mjs`.

### Đã đạt / Chưa đạt / Bị chặn

- **Đã đạt**: Cloud/session decisions recorded; project-only constrained MCP;
  selective repo/Jira amendments, boundaries/budget draft tiếp tục, static baseline.
- **Chưa đạt**: SCRUM-59 overall acceptance; khoảng 65% ước tính công việc (trước
  amendment khoảng 40%), không phải progress field hoặc % nghiệm thu. Cần owner
  review boundaries/budget và actual Cloud Connect/plan/TLS/limits để khóa config.
- **Bị chặn**: destructive/rebuild/restore thiếu isolated approved target;
  full Auth/E2E chưa có scaffold, không triển khai task tương lai ở lượt này.
- Owner cần cung cấp Connect metadata không bí mật (mode/host/port/user/database/
  TLS yêu cầu) và plan/limits, không DSN/password/key. Secrets sau đó chỉ local
  env ngoài Git theo task được giao. Gmail delivery/Dashboard redirects chưa kiểm.
- Không chuyển SCRUM-60/63/64; giữ SCRUM-19/59 In Progress, các task sau To Do.

## SCRUM-59 — bổ sung Connect/TLS/capacity ngày 2026-11-16

### Outcome và thay đổi

- Direct host/port/database/user do owner cung cấp đã ghi trong architecture/
  research/ADR, không có password hoặc DSN thật. `postgres` không được đưa thành
  runtime principal chung; roles/grants chưa tạo.
- Nano, pool size15/cặp user-database, max pooler clients200 là **owner Dashboard
  report**, không independently queried; max_connections/plan chưa biết.
- Budget proposal10 runtime (4+4+2), migration1, worst-case11, per-role pooler
  cap và scale/rollout formula đã bổ sung. Chưa đạt aggregate capacity gate
  `P+U+H≤M` vì M/U/H chưa biết. Không đổi compute/pools/client caps hoặc config Cloud.
- SSL enforcement owner report; verify chain+hostname bắt buộc. CA local chưa
  đọc/kiểm, không copy/commit file hoặc đọc env/secret. Không gọi MCP SQL.
- `.vscode/` mới thấy trong Git status được giữ nguyên, không đọc/sửa.
  `opencode.jsonc` đã khác snapshot: user đổi khối MCP sang legacy-shaped,
  broad URL không read_only, rule deny ngoài5 metadata vẫn còn. Không sửa/revert
  user config, không thay tests để che mismatch, không dùng đường khác vượt deny.
- Owner đề nghị không isolated target được ghi là pending governance/exact
  target/allowlist/impact/backup confirmation, không tự tạo reset scope trong59.
  Không reset/migrate/seed, không scaffold60/63/64 hoặc cài optional skills.

### Kiểm tra thật trong lượt này

| Lệnh / check | Kết quả |
| --- | --- |
| `git status --short --branch` | main; giữ existing changes/untracked, thấy `.vscode/` mới |
| `npm test` | **45 PASS / 2 FAIL**; guardrails shape kỳ vọng mcp.servers nhưng hiện mcp.supabase, test read-only không tìm thấy servers; không skip/assertion change |
| `npm run typecheck` | PASS, 0 diagnostics/66 files |
| `npm run check:structure` | PASS 73/73, không missing/unused |
| `Resolve-DnsName -Name db.bdhavbwmxbttymerizvx.supabase.co -Type AAAA -DnsOnly` | Có AAAA; không chứng minh host/container có usable IPv6 route |
| `Test-NetConnection -ComputerName db.bdhavbwmxbttymerizvx.supabase.co -Port 5432` | Name resolution failed, TcpTestSucceeded=False, RemotePort=0; chưa tới TCP/TLS/Auth |
| `node specs/003-grabmefood-v2/validate.mjs` | PASS 31 FR/31 mapped/16 checklist/10 decisions; docs links/newlines hợp lệ |
| `node scripts/check-guardrails.mjs` | FAIL cùng mismatch mcp.supabase vs mcp.servers, không phải current guardrail PASS |
| `git diff --check` | PASS exit0, chỉ LF→CRLF warnings; untracked task docs được kiểm riêng bởi spec validator |

Không kết luận DB down/TCP port closed hoặc TLS verified. Không tạo application
DB client nên chưa có application connection/E2E; current tests không xanh.
Không thay config để làm test xanh khi chưa chốt owner change.

### Jira và files lượt này

Đã đọc tiền nhiệm18/46 và current task/roadmap. Sửa descriptions sau khi đọc
current fields/updated, kiểm conflict trước ghi: SCRUM-5/19/59/60/21/64/22/23/
47/65/67/68/69/70/31/111/112/33/34/35/63 (**21 issues**).
Không đổi status/assignee/dependencies hoặc tạo issue. Chỉ đồng bộ thiết kế/
acceptance tương lai, không execute các task đó.

Files sửa: `docs/architecture.md`, `docs/adr/0001-supabase-cloud.md`,
`docs/permissions.md`, `specs/003-grabmefood-v2/research.md`, file validation này.
Không sửa AGENTS/constitution/spec để tự hợp thức hóa reset exception; không sửa
opencode.jsonc/guardrail tests hoặc `.vscode/`.

### Gate tiếp tục

SCRUM-59 khoảng70% ước tính (trước65%), vẫn In Progress, chưa acceptance. Cần:
review architecture/budget; actual M/U/H/plan; usable connectivity từ môi trường
chạy services; TLS/driver evidence sau scaffold; reconcile config/policy với owner.
Phần kết nối IPv4 fallback cần Session pooler Connect metadata không bí mật nếu
direct IPv6 không dùng được. Không xin password hoặc key trong chat.

## SCRUM-59 — MCP V2 metadata-only đã được owner duyệt

### Phạm vi / root cause / thay đổi

Owner đồng ý đề xuất chuẩn hóa riêng khối MCP và giữ metadata-only trong SCRUM-59,
đồng bộ Jira. Trước sửa, config dùng legacy shape/URL rộng bỏ read_only, không
khớp policy guardrail đã duyệt. Chỉ sửa `opencode.jsonc` khối MCP sang
`mcp.servers.supabase`, ref `bdhavbwmxbttymerizvx`, `read_only=true`, features
docs/database/development; không đảo/revert changes khác. Giữ nguyên45 permission
rules, hard canary policy, tests và `.vscode/`; không mở write hoặc cài dependencies.

Fresh regression evidence: `node --test tests/contracts/guardrails.test.mjs`
trước sửa **7 PASS / 2 FAIL**, lỗi shape/read-only như đã báo. Sau sửa `npm test`
**47/47 PASS** (9 guardrail), không sửa/bỏ/skip assertion. Đây là config regression
record, không tạo lịch sử runtime V2 giả.

Các checks sau sửa đã thực chạy:
- `npm run typecheck`: PASS0 diagnostics/66 files.
- `npm run check:structure`: PASS73/73 reachable, không missing/unused.
- `opencode mcp list`: Supabase và Atlassian connected.
- `node scripts/check-guardrails.mjs`: PASS7 documents/45 rules, staticOnly=true.
- `node specs/003-grabmefood-v2/validate.mjs`: PASS31 FR/31 mapped/16 checklist/
  10 decisions, links/newlines/whitespace.
- `git diff --check`: PASS exit0, chỉ LF→CRLF warnings.

Đã đồng bộ và read-back verify21 descriptions Jira: SCRUM-5/19/59/60/21/64/
22/23/47/65/67/68/69/70/31/111/112/33/34/35/63. Thay đoạn MCP blocker bằng
owner approval + current resolution/evidence, không chỉ append note để giữ lời
khẳng định45pass/2fail hiện tại sai. Toàn bộ21 verified có resolution và không
còn marker blocker cũ; status/assignee read-back giữ nguyên. Không gửi
dependency fields, không tạo issue hoặc transition.

Files: `opencode.jsonc`, `docs/permissions.md`, `docs/architecture.md`,
`docs/adr/0001-supabase-cloud.md`, `research.md` và validation này.
Không application/UI/global config/remote mutation; không build/render vì không UI.

### Gate

Blocker MCP config/policy đã gỡ, quyền ghi không mở trong SCRUM-59. Mọi write ở
task sau phải xác định thao tác và approval cụ thể; không blanket. Các yêu cầu
capacity M/U/H/plan, usable DB network/TLS evidence, review architecture/budget
và destructive exception chưa thay đổi. Khoảng70% estimated SCRUM-59, vẫn
In Progress; không bắt đầu SCRUM-60 hoặc scaffold/migrate/seed/reset/deploy.

## Capacity evidence owner — mốc mới nhất SCRUM-59

### Evidence và budget review

Owner cung cấp kết quả SQL read-only và tóm tắt Dashboard; AI chưa chạy SQL,
chưa kiểm độc lập raw output/screenshot. Chưa có timestamp/sampling window thật
để tự ghi thành một phép đo peak. Các mục “chưa biết M/reserved” trong snapshot
trước được thay bằng evidence owner dưới đây, không sửa kết quả lịch sử.

- SQL: max_connections60, superuser_reserved_connections3, reserved_connections0,
  current_client_connections5. Roles/state: authenticator idle1, pgbouncer idle1,
  postgres active1, supabase_admin idle1, supabase_storage_admin idle1. Postgres
  active có thể là diagnostic SQL Editor; không tự loại khỏi count.
- Dashboard **snapshot khác**: connections8/60, active queries0, idle-in-
  transaction0, blocked queries0, top blocker/longest running không hiển thị.
  Sessions lọc anon/authenticated/postgres; “No active sessions” không có nghĩa
  toàn DB không có connections. Không gọi5/8 mâu thuẫn hoặc dùng8 làm peak.
- Ordinary theoretical ceiling60−3−0=57; không phải quota riêng của app.
  Nano vẫn chưa xác nhận plan; pool15/cặp user-database và200 pooler clients
  khác tầng PostgreSQL60.
- Giữ P=10 runtime4/4/2, migration tối đa1 khi được duyệt. **H=12 operational
  slots chỉ là proposal chờ review**, ngoài3 reserved slots đã trừ. Lý do/
  definitions/time-series review được ghi ở [worksheet](../../docs/architecture.md).
  Gate `P+U+H≤57`: P=11/H=12 thì cần U_peak≤34; runtime10 thì≤35.
  U không gồm app/migration đã thuộc P; không đếm pooler front-end client và
  PostgreSQL backend tương ứng hai lần. H không là managed usage hoặc reserved3.
- **Chưa aggregate capacity PASS**: thiếu U_peak đầy đủ workloads/time series,
  review H=12, plan, app network/TLS và architecture/resource review.
  Dashboard redirects/SMTP delivery/Auth E2E chưa kiểm; session-pooler Connect
  metadata vẫn thiếu nếu cần IPv4 fallback. Không tự mở rộng scope để thu peak
  khi chưa có ứng dụng hoặc task hạ tầng được giao.

### Recovery sau tool interruption và Jira

Lượt batch Jira bị ngắt không được coi là rollback hoặc thất bại tất cả.
Đã đọc lại21 descriptions/status/updated/assignee:20 issue đã lưu capacity
supplement đúng một lần, chỉ SCRUM-33 còn thiếu. Chỉ sửa3 đoạn capacity/MCP và
thêm evidence vào33 sau khi đọc current/kiểm updated chống concurrent edit.
Read-back33 có đúng một supplement, gate57/U_peak34 và status/assignee không đổi.
20 issue còn lại không bị ghi lại hoặc thêm supplement trùng.

21 issue đã đồng bộ: SCRUM-5/19/59/60/21/64/22/23/47/65/67/68/69/70/31/
111/112/33/34/35/63. Không đổi dependencies/status/assignee, tạo ticket hoặc
transition. Giữ19/59 In Progress,60/21/63/64 To Do. Evidence capacity mới đã
thay trực tiếp câu M/reserved chưa biết và gate cũ, không chỉ append ghi chú.

### Files và checks thực chạy sau capacity update

Files: `docs/architecture.md`, `docs/adr/0001-supabase-cloud.md`,
`specs/003-grabmefood-v2/research.md`, file validation này. Không đổi business
spec/constitution/permissions/MCP/tests hoặc `.vscode/`.

| Lệnh | Kết quả |
| --- | --- |
| `npm test` | PASS47/47, không skip |
| `npm run typecheck` | PASS0 diagnostics/66 files |
| `npm run check:structure` | PASS73/73 reachable, không missing/unused |
| `node scripts/check-guardrails.mjs` | PASS7 docs/45 rules, staticOnly=true |
| `node specs/003-grabmefood-v2/validate.mjs` | PASS31 FR/31 mapped/16 checklist/10 decisions, docs links/newlines |
| `git diff --check` | PASS exit0, chỉ LF→CRLF warnings |

Các checks là baseline/static docs, không PostgreSQL/application capacity tests.
Không gọi Supabase MCP/SQL, không mở write, đọc CA/credentials hoặc remote
mutation/migration/seed/reset/deploy/plan-compute-pool change; không commit/push.
Không build/render vì không UI/application changes.

### Gate hiện tại

Đã gỡ thiếu M/reserved ở mức owner report; chưa gỡ peak/headroom-review/network/
TLS/resource acceptance. SCRUM-59 vẫn khoảng70% ước tính khối lượng, chưa Done,
không tự tăng % vì thêm snapshot và không chuyển SCRUM-60.

## Gói A — snapshot review trước owner approval

Đã đọc AGENTS/permissions/constitution, current Jira5/19/59 và amendments/
comments mới nhất19/59; đọc scopes60/64/70/107/108/111/112 để đề xuất đúng nơi
kiểm runtime, không dùng roadmap nhớ trong hội thoại để giao việc. Không làm
lại task Done hoặc sửa output trước chỉ vì nó tồn tại.

Đã đối chiếu architecture/ADR/spec/research/bàn giao hiện có với package.json/
repo. Root vẫn legacy, glob không tìm v2. Spec Kit metadata1.3.3 và installed
clarify instructions đã đọc; không gọi skill UI, install skills hoặc rerun
specify/plan/tasks/analyze. Clarification ở đây là owner approval kỹ thuật/
acceptance, không tự thêm câu trả lời vào approved business spec.

Review matrix/provenance/acceptance-split **Proposed** đã ghi trong
[architecture](../../docs/architecture.md), section Gói A. Boundary ownership,
session A, revocation timing khớp ADR ở mức tài liệu; chưa có runtime negative/
concurrency/fault evidence. Giữ nguyên các decision Accepted hiện có.

Điểm chặn cần owner quyết định:
- Caps4/4/2 + migration1 khi duyệt + operational H12 vẫn proposal; resource
  targets RAM/disk/guard cũng chưa measured/approved provisional.
- Câu constraints/permissions tests kế thừa và full-workload/app-TLS blockers
  không thể nghiệm thu trên hệ thống V2 chưa scaffold. Đề xuất59 design/provisional,
  runtime sau scaffold tại64/70/107/108/111/112; chưa đổi AC hoặc miễn test.
- Plan/Session pooler Connect metadata còn thiếu nếu direct không usable;
  không yêu cầu password/key/DSN chứa secret. Không dùng MCP connected làm proof.

Checks thực chạy trong Gói A trước phần review documentation:
`npm test` PASS47/47, `npm run typecheck` PASS0/66,
`npm run check:structure` PASS73/73. Đây là static/legacy baseline, không DB/
TLS/capacity/Auth tests. Không remote Supabase call/SQL/mutation, start stack/
scaffold, change MCP/global config, commit/push hoặc touch `.vscode/`.

Files sửa trong Gói A: architecture và validation này, chỉ ghi review/proposal;
không thay ADR Accepted/spec/acceptance/status/assignee. Chờ owner approval
trước phần phụ thuộc; SCRUM-59 chưa Done, không tự nâng progress estimate70%.

## Gói A — owner đã duyệt các đề xuất

Approval trong hội thoại ngày2026-11-16: **“tôi duyệt các đề xuất”**. Thay trạng
thái Proposed của Gói A bằng approved design/provisional budgets/acceptance split;
không ghi owner đã chấp thuận runtime capacity hoặc cấp quyền execution.

Đã duyệt:
- Review C4/conceptual ERD/ownership/trust/session A, giữ nguyên approved ADR.
- DB pool caps4/4/2, migration1 chỉ khi có approval thao tác riêng, H12 ngoài3
  reserved slots; gate57 với U_peak không đếm lại P, chưa runtime PASS.
- Local resource targets: service RAM estimate2304MiB, steady≤4GiB/peak≈6GiB,
  preflight usable RAM≥15GiB/free≥6GiB, Docker data free≥15GiB/workspace≥10GiB,
  provisional/chưa đo, không tự pin/mua/chuyển data location.
- SCRUM-59 gate thiết kế/provenance/provisional budgets/risk + linked obligations,
  không buộc measured full-workload/app TLS trước scaffold. Không miễn runtime
  tests:64 connectivity/TLS/resource readiness;70 isolation;107/108 journeys/
  revocation/fault;111 peak pools/capacity/resource/performance;112 audit.

Artifacts đổi sau approval: architecture/ADR/research/validation; business spec,
FR IDs, MCP/permissions, app/tests/global config không đổi. Acceptance sau
approval được đồng bộ Jira; không tự transition status hoặc khởi động task sau.
Plan/Session-pooler metadata nếu cần fallback và toàn bộ runtime evidence vẫn
thiếu; đưa đúng gate sau scaffold, không biến thành successful verification.

Review gate thiết kế được đối chiếu trong architecture (5 acceptance rows).
Jira59 giữ In Progress để bàn giao; estimate70% cũ không phải acceptance/progress
field và không tự tăng để thay việc nghiệm thu. Không coi parent19 hoàn tất khi
full contracts/plan/analyze của60 chưa làm.

### Jira đồng bộ sau approval và verification

Đã read-current/updated trước ghi và read-back verify23 descriptions:
SCRUM-5/19/59/60/21/64/22/23/47/65/67/68/69/70/31/111/112/33/34/35/63/107/108.
Sửa trạng thái H/budgets thành approved provisional, thêm approval Gói A và
acceptance split vào issues liên quan. Riêng59 thay mục nghiệm thu kế thừa bằng
5 design acceptance rows đã duyệt; không đòi full parent19/60 artifacts hoặc
runtime schema/workload tests trước scaffold.

Giữ status/assignee read-back23/23; không gửi dependency fields, không transition,
tạo ticket hoặc thực hiện các task To Do. Amendment roadmap5 chỉ đồng bộ quyết
định mới, không làm lại task Done. Không thấy concurrent-update conflict trong
kiểm updated trước ghi; nếu có thay đổi chồng lấn phải dừng xin phân chia.

Lượt đầu getJiraIssue cho5/19/59 lỗi DNS `ENOTFOUND mcp.atlassian.com` trước edit;
20 issue khác đã được verified. Đã retry riêng3 issue một lần, đọc current trước
ghi, lấy block approval từ60 đã lưu; cả3 sau đó verified, không duplicate amendment.

Checks sau approval/artifact updates:
| Lệnh | Kết quả |
| --- | --- |
| `npm test` | PASS47/47, không skip/test/assertion change |
| `npm run typecheck` | PASS0 diagnostics/66 files |
| `npm run check:structure` | PASS73/73, không missing/unused |
| `node scripts/check-guardrails.mjs` | PASS7 documents/45 rules, staticOnly=true |
| `node specs/003-grabmefood-v2/validate.mjs` | PASS31 FR/31 mapped/16 checklist/10 business decisions, architecture/ADR links và format |
| `git diff --check` | PASS exit0, chỉ LF→CRLF warnings |

- **Đã đạt — gate review thiết kế Gói A**: current Jira/spec/ADR được đối chiếu,
  owner duyệt review/provisional budgets và acceptance split; 5 acceptance thiết
  kế có evidence trong architecture. Không còn decision Gói A chờ owner approval.
- **Chưa đạt — các runtime gates riêng**: aggregate capacity/resource/network/TLS/
  session/Auth/SMTP/redirect verification; đã map tasks sau scaffold, không miễn.
- **Missing inputs/runtime blockers**: plan, Session pooler Connect metadata nếu
  cần fallback, prerequisites/credentials qua kênh an toàn và workload/time series.
  Không yêu cầu dán secret chat; approval không tạo các inputs này.

SCRUM-59 vẫn In Progress theo giới hạn lượt làm và để bàn giao; chưa tự chuyển
Done hoặc khởi động60. Không Supabase MCP call/SQL/remote mutation, config quyền/
compute/pools/plan changes, dependencies/scaffold, commit/push hoặc UI changes.

## Chốt nghiệm thu SCRUM-59 — Done

Owner yêu cầu **“tiếp tục cho xong đi chứ”** sau approval Gói A. Không tiếp tục
giữ task In Progress chỉ để bàn giao khi đủ acceptance thiết kế đã duyệt.

Đã đọc lại current Jira59 (mục5 acceptance và approval), kiểm19/60 statuses,
đối chiếu design gate matrix trong architecture và chạy lại final checks:
- `npm test`: PASS47/47.
- `npm run typecheck`: PASS0 diagnostics/66 files.
- `npm run check:structure`: PASS73/73 reachable.
- `node specs/003-grabmefood-v2/validate.mjs`: PASS31/31/16/10.
- `node scripts/check-guardrails.mjs`: PASS7 docs/45 rules/staticOnly.
- `git diff --check`: PASS exit0, chỉ LF→CRLF warnings.

**5/5 design acceptance đạt**: C4/conceptual ERD/ownership/trust; session A;
provenance/risks/conditional connection strategy; approved provisional budgets;
runtime obligations đã có task follow-up theo owner-approved acceptance split.

Jira list transitions thật có Done41; đã comment final gate evidence rồi gọi
`transitionJiraIssue` cho59, response xác nhận **statusName=Done**. Không transition
parent19 hoặc60. Lần đầu đọc MCP Atlassian gặp DNS ENOTFOUND, retry một lần
thành công trước khi đóng; không giả kết quả khi lỗi mạng.

Các câu “giữ In Progress để bàn giao”/estimate70% trong snapshot trước đã được
thay thế bởi mốc chốt này. SCRUM-59 hoàn tất phần thiết kế, không chỉ tạm giữ70%.
Không tuyên bố parent19/full V2 hoàn tất; chưa bắt đầu60.

Runtime/capacity/resource/network/TLS/session/Auth/SMTP/redirect evidence vẫn
chưa kiểm, đúng follow-ups64/70/107/108/111/112. Plan/Session-pooler metadata nếu
cần fallback vẫn thiếu. Không dùng Done59 để miễn test hoặc cấp quyền SQL/
remote mutation/scaffold/migration/seed/reset/deploy/commit/push.

Read-back Jira sau closure-description update xác nhận59 Done,19 In Progress,
60 To Do; đã comment bàn giao cho19. Files chốt: README.md, docs/architecture.md,
docs/adr/0001-supabase-cloud.md, research.md và validation.md. Không làm lại
gói Done khác, không giữ59 ở70% hoặc mở task60 chỉ để tiếp tục báo tiến độ.

## SCRUM-60 — Gói B được giao và owner approval

Owner giao riêng60 sau59 Done; tiếp theo xác nhận **“Duyệt cả 6”**:
REST/cursor20–50/Problem Details; giữ BFF/Community ledger + idle24h/absolute7d/
context≤10m; input/upload limits; authoritative recipient HTTP + durable first
decision; retention/replay; design/static/analyze acceptance split cho60.
Chi tiết authority tại [ADR-0002](../../docs/adr/0002-v2-contracts.md).

Plan research phát hiện plain eligibility HTTP rồi Notification commit có crash
window. Đã hỏi ngay trước phần recipient phụ thuộc; owner chọn **Duyệt** Community
immutable receipt trước HTTP response. Snapshot commit là lúc xử lý,0-recipient
cũng frozen; saved/preferences đổi sau đó không hủy pending delivery. Projection
không được hạn chế full authoritative enumeration.

### Current context và allowlist

Đọc AGENTS/permissions/constitution/spec/ADR/research và bàn giao; Git main có
modified/untracked user work, giữ `.vscode/` và mọi thay đổi trước phiên.
Jira đọc mới5/19/59/60 + latest comments19/60;59 Done/60 To Do, không có comment60
trước lượt này. Đọc danh sách actual61–118 To Do để map tasks, không suy từ số.
Không thấy update chồng lấn ở các files đọc trước sửa; không claim có filesystem
lock. Khi có concurrent edit phải dừng partition, không overwrite.

Allowlist thực dùng: plan/research/data-model/quickstart/tasks/traceability/
validation trong feature; contracts/{README,http,authorization,events}.md và
contracts/validate.mjs (static design validator); architecture, ADR-0001/0002.
Business spec/checklist unchanged; no app/config/lockfile/permissions/migration
changes. Jira60 thêm approval comment10029, transition21 thật trả In Progress.
Không chuyển task khác, không scaffold/install/Cloud SQL/mutation/reset/commit/push.

### Spec Kit workflows thực tế

- Installed1.3.3/OpenCode PowerShell integration; đọc actual plan/tasks/analyze
  instructions và setup/common/resolver scripts. Không UI skill, không install.
- Không `.specify/extensions*` trước plan/tasks; không mandatory hooks bị bỏ qua.
- `setup-plan.ps1 -Json` với feature dir explicit và NO_PERSIST=1: exit0, existing
  plan preserved/skipping copy, absolute feature/spec/plan đúng. Helper branch
  là003-grabmefood-v2, actual Git main; không tạo/chuyển branch/feature.json.
- Phase0 reused existing research +1 read-only research agent theo workflow;
  receipt finding được owner clarify trước design phụ thuộc.
- Phase1 tạo dictionary/C00–C20, HTTP/auth/events, quickstart và plan compliance.
- `setup-tasks.ps1 -Json`: exit0, template actual `.specify/templates/tasks-template.md`,
  AVAILABLE_DOCS research/data-model/contracts/quickstart. Generated64 tasks,
  US1=8/US2=8/US3=6/US4=4/US5=7/US6=4/US7=3; setup/foundation/polish=24.
  All unchecked, files/Jira mapped; current roadmap order + isolated-target blocker
  explicit. MVP public discoveryUS1 after prerequisites, not early implementation.

### Checks executed trước read-only analyze

| Command | Actual result |
| --- | --- |
| `npm test` | PASS47/47,0 fail/skip; unchanged legacy/guardrail baseline only |
| `npm run typecheck` | PASS0 diagnostics/66 source files |
| `npm run check:structure` | PASS73/73, missingImports=[]/unusedFiles=[] |
| `node scripts/check-guardrails.mjs` | PASS7 docs/45 rules/staticOnly |
| `node specs/003-grabmefood-v2/validate.mjs` | PASS31 requirements/31 mapped/16 checklist/10 business decisions |
| `node specs/003-grabmefood-v2/contracts/validate.mjs` | PASS11 docs/64 task IDs/21 constraints quoted verbatim/31 FR rows; hashes reported; static only |
| `git diff --check` | PASS exit0; LF→CRLF warnings only |

No build/render needed for documentation-only work; no V2 runtime tests executed.
Static validator checks shape/links/coverage, not semantics/security behavior.
Next: installed check-prerequisites RequireSpec/RequireTasks/IncludeTasks then
analyze A–F **strictly read-only**, output report in conversation, no remediation
or file writes during analyze. SCRUM-60 not Done until analysis acceptance gate
is evaluated; findings must not be silently edited away.

## SCRUM-60 — remediation approval4 điểm và vòng kiểm lại

### Authority và lịch sử

Analyze đầu tiên trong hội thoại/Jira60 comment10030 có C1 critical/U1 high/
U2 high/I1 medium; parent19 comment10031 giữ task chưa Done. Owner sau đó nói
**“Tôi duyệt remediation cả 4 điểm, với các điều kiện…”** và yêu cầu không
runtime/remote hoặc tự Done. Approval này **mới**, không hồi tố approval6/6.
ADR-0002/spec ghi riêng bốn nhóm reply/mention/cập nhật quán đã lưu/broadcast
quản trị mặc định bật và create-only events. Historical report không xóa/viết lại.

Trước sửa đọc git status/diff/AGENTS/permissions/current contracts/dictionary/
tasks/plan/spec và installed analyze command; preserved main modified/untracked
user work/.vscode. Lượt MCP bị interrupted trước ghi; chỉ retry read-only,
read-back59 Done/60 In Progress/19 In Progress, comments60 đúng10029/10030,
không thấy approval/edits mới xung đột. Không dùng result interrupted làm evidence.

### Files/changes trong allowlist SCRUM-60

- ADR-0002, spec/research/plan/traceability/quickstart/validation:
  separate approval4 điểm; giữ31 FR/64 task IDs/7 stories và Jira dependencies.
  Scenarios thêm US2.10–11, US4.11, US6.5.
- contracts/http: GET media public/admin/owner-avatar, conditional/range/cache/
  proxy rules và reauth/resume/status errors/DTOs.
- contracts/authorization: proof purpose/account/operation/generation binding,
  encrypted provider-proof custody/erasure, expired context không renew bằng
  cookie/UUID, fresh proof không ordinary admission; concurrent CAS/fencing và
  **uncertain remote-write guard** (lease không fence được provider).
- contracts/events: edit không re-emit, immutable creation recipient refs cho
  delayed event, preferences vẫn authoritative tại receipt decision.
- data-model: C21–C23, auth_context encrypted-proof/binding fields và operation
  attempt/lease/remote-attempt-state; schema constraints chỉ là dictionary.
- tasks: exact C00–C23 quotes trong task descriptions, remove coarse `[P]` và
  cross-ticket parallel examples, original execution graph unchanged.
- contracts/validate.mjs: add static regression guards, retain all prior assertions.
  Count21→24 vì thêm3 constraints mới, không xóa/bỏ skip assertion để che finding.

### Regression RED → GREEN (documentation-level)

1. Thêm guards **trước** artifact fixes, chạy
   `node specs/003-grabmefood-v2/contracts/validate.mjs`:
   **exit1/16 errors** cho separate authority/default names,4 GET routes/cache,
   reauth/resume routes+proof fields/purpose, expected24 constraints và `[P]`.
   Core old hashes giữ như report10030; no app/runtime regression claimed.
2. Sửa approved artifacts rồi chạy **cùng command, guards không bị bỏ/giảm**:
   exit0/errors=[],11 docs/64 task IDs/24 verbatim constraints/31 mapped FR.
3. Sau đó strengthen quote check chỉ chấp nhận exact constraint trong actual
   task descriptions, thêm execution-graph unchanged và uncertain remote-write
   guard. Đây là static contract regression, không chứng minh runtime security.

### Actual checks sau remediation, trước analyze

| Command | Result đã thực chạy |
| --- | --- |
| `npm test` | PASS47/47,0 fail/skip, unchanged root legacy/guardrail baseline |
| `npm run typecheck` | PASS0 diagnostics/66 files |
| `npm run check:structure` | PASS73/73, no missing/unused |
| `node scripts/check-guardrails.mjs` | PASS7 docs/45 rules/staticOnly |
| `node specs/003-grabmefood-v2/validate.mjs` | PASS31/31/16/10 historical Q/A entries; remediation authority ghi section riêng, không xóa decisions cũ |
| `node specs/003-grabmefood-v2/contracts/validate.mjs` | PASS11 docs/64 tasks/24 C00–C23 quotes/31 FR; spec/plan/tasks SHA256 in output |
| `git diff --check` | PASS exit0, LF→CRLF warnings only |

Không UI/app change nên không build/render; no migration/seed/Auth/Storage/network/
Cloud action hoặc real credentials. Fresh provider reconciliation nếu không có
supported definitive outcome phải giữ protected503, không claim đã tested.
Isolated rebuild target vẫn chưa có; runtime tests đúng tasks, không được miễn.

### Handoff boundary trước read-only analyze

Reuse installed Spec Kit1.3.3; no setup-plan/tasks generation rerun vì artifacts đủ.
`check-prerequisites -Json -RequireSpec -RequireTasks -IncludeTasks` dùng explicit
feature + NO_PERSIST=1 trước analyze lại; kiểm extensions/hook registry thực tế.
Sau khi bắt đầu analyze không sửa artifacts/remediate findings mới.
Report actual analyze trong hội thoại/Jira60/19 với file/line references và
snapshot hashes; approval remediation không tự chuyển Done. Giữ60 In Progress.

## SCRUM-60 — đối chiếu toàn bộ AC để trình owner nghiệm thu

### Authority / phạm vi lượt bàn giao

Owner yêu cầu hoàn tất riêng60, đối chiếu **toàn bộ AC hiện tại**, bổ sung đúng
scope nếu thiếu; tách document verification khỏi runtime obligations sau;
**trình owner duyệt chuyển Done**, chưa tự scaffold/Cloud action.

Đã đọc lại current Jira60/19, predecessor59 và comments60 (mới nhất10033).
59 Done,60/19 In Progress. Mục tiêu/AC/amendments trong description có snapshot
“chưa60/59≈70%”, đã được latest closure/assignment/approval thay thế; không dùng
chúng để làm lại59 hoặc coi60 chưa được giao.

Trong lượt này chỉ bổ sung matrix/evidence bàn giao ở validation.md và cập nhật
index trạng thái docs/architecture.md; không thay spec/contracts/plan/tasks,
không thêm business decision hoặc thực hiện task sau. Git main/user work/.vscode
được giữ; không thấy chồng lấn current sources đã đọc. Spec Kit artifacts đủ,
reuse workflow evidence đã chạy, không rerun generation/constitution/specify
hoặc dùng UI skills không liên quan.

### Matrix đối chiếu AC và phần kế thừa từ SCRUM-19

Các hàng là nhóm bằng chứng từ mục tiêu/AC/amendments hiện có, **không tạo AC
mới**. “Đã đạt” dưới đây chỉ là design/document verification, chưa owner Done.

| Nhóm AC hiện tại | Artifact / evidence cụ thể | Kết quả tài liệu |
| --- | --- | --- |
| Tiền nhiệm subtask /1 đã nghiệm thu | Jira59 Done; architecture section Chốt SCRUM-59, validation historical final5/5 | Đã đạt; không làm lại59 |
| C4/diagram/service ownership/topology | [architecture](../../docs/architecture.md): C4 context/container, ownership matrix, trust boundary; [data-model](data-model.md): owner-local dictionary + ERD; [events](contracts/events.md): receipt sequence | Đã đạt; nhất quán Cloud DB/Auth/Storage + local apps/broker |
| Schema/DB role và data model/constraints | data-model C00–C23, fields/nullability/local FKs/indexes/state; tasks T004–T010 quote constraints và plan runtime tests | Đã đạt thiết kế; chưa DDL/schema được áp dụng |
| HTTP business/service contracts | [http](contracts/http.md): public/admin/profile/saved/random/comments/inbox/broadcast/media/internal operation tables/DTOs | Đã đạt |
| Pagination/errors/polling | http Pagination/search, Error dictionary, Inbox polling; default20/max50, opaque query-bound cursor, Problem Details, hidden/logout polling stop | Đã đạt |
| Auth/session/revocation/internal identity | [authorization](contracts/authorization.md): action matrix, service issuer/audience/signature/expiry, BFF cookies/server-only tokens, Community ledger, sync fail-closed/epoch/partial-failure/reauth-resume | Đã đạt; không browser JWT-only hoặc positive authorization cache |
| Media GET/private-data boundary | http Media GET proxy + data-model C22 + task tests T032/T051–T053; publication/attachment/ledger/ownership checked, no-store/no304/shared-cache/raw URL bypass | Đã đạt thiết kế; không claim runtime đã secure |
| Event envelope/versioning/outbox/ordering/fanout | events envelope/payloads/producer-intake protocol/recipient receipt/projection/retry-DLQ; Community authoritative HTTP, full candidate enumeration, immutable receipt, no cross-service SQL | Đã đạt |
| Retention/replay/idempotency | events Retention và ordering/replay; data-model C12–C19; payload30d khác no-auto-purge dedup/receipt/inbox; replay same ID/read state, quá hạn không đoán input | Đã đạt |
| ADR/phê duyệt/source of truth | [ADR-0001](../../docs/adr/0001-supabase-cloud.md) giữ Cloud/session; [ADR-0002](../../docs/adr/0002-v2-contracts.md) ghi6/6 + receipt + remediation approval mới riêng biệt; spec là business source | Đã đạt; actual repo path `docs/adr/` được giữ, không tạo bản sao `docs/decisions/` từ path lịch sử19 |
| Spec Kit plan/research/quickstart | [plan](plan.md)/[research](research.md)/[quickstart](quickstart.md) + setup-plan/setup-tasks actual evidence ở sections trước; installed1.3.3/OpenCode-PowerShell, branch thực main | Đã đạt, không template rỗng hoặc workflow giả |
| Tasks và requirements trace theo Jira hiện tại | [tasks](tasks.md):64 unchecked/US1–7/exact paths, no coarse parallel markers, giữ graph; [traceability](traceability.md):31/31 FR +7/7 SC mapped; validator24 verbatim constraints | Đã đạt coverage kế hoạch, không64 task implementation đã xong |
| Analyze thực tế/read-only/remediation | Jira60 comment10030 initial4 findings; owner approval4 riêng; comment10033 + report hội thoại post-remediation: old4 resolved/no new findings,0 critical/high/medium/low,38keys covered/no unmapped tasks | Đã đạt review; giữ historical findings, không tự sửa trong analyze |
| Resource budget và Cloud constraints | architecture Localhost budget/capacity worksheet/TLS, plan Technical Context:4/4/2, migration1 riêng, H12 ngoài3reserved, ordinary57 owner report; no K8s/Redis/Elastic | Đã đạt design/provenance/provisional; không measured capacity PASS |
| Tests/regression/docs handoff | baseline/static commands dưới đây + historical RED16errors→GREEN; parent architecture link/index cập nhật; giữ scope/no secret/no Cloud mutation | Đã đạt kiểm tài liệu; đủ bằng chứng để trình owner quyết định |

### Tách nghiệm thu tài liệu khỏi obligations runtime

ADR-0002 decision6 và owner instruction hiện tại áp dụng gate document/design60.
Các câu AC chung “UI có render mobile/desktop, dữ liệu có constraints/permissions
tests” áp dụng khi có UI/schema implementation, **không biến60 thành scaffold/
migration/Auth task**. SCRUM-60 có data constraints/test design và artifact validation,
không giả là DB constraints/permissions tests đã chạy.

| Runtime obligation chưa chạy | Task thực hiện sau theo trace | Tác động gate60 |
| --- | --- | --- |
| DB connectivity/TLS/resource readiness |64, sau approved credentials/preflight prerequisites | Không chặn document acceptance60; không claim đã nối Cloud |
| Migrations/grants/user-service isolation |67–70 với approval remote riêng | Không chặn60; schema dictionary không thay test thật |
| Auth/email/callback/revocation/media flows |81/82/83/88;107/108/112 | Không chặn60; chưa Auth/SMTP/media runtime PASS |
| Broker/fanout/receipt/replay/faults |61/62/103/104/108 | Không chặn60; contracts + obligations đã đủ để triển khai/test |
| Full workload/pools/headroom/security/UI |109/110/111/112 | Không chặn60; provisional không measured |
| Isolated rebuild/restore2 vòng |75/76; hiện chưa approved isolated target | Blocker riêng75/76, không là blocker document60 |

### Evidence kiểm lại trong lượt nghiệm thu

Actual commands đã thực chạy lại:
- `npm test`: exit0,47/47 PASS,0 fail/skip (legacy/guardrail baseline only).
- `npm run typecheck`: exit0,0 diagnostics/66 files.
- `npm run check:structure`: exit0,73/73 reachable; missingImports/unusedFiles=[].
- `node scripts/check-guardrails.mjs`: exit0,7 docs/45 rules/staticOnly.
- `node specs/003-grabmefood-v2/validate.mjs`: exit0,31 FR/31 mapped/16 quality
  checklist/10 historical Q/A entries; subsequent remediation authority section riêng.
- `node specs/003-grabmefood-v2/contracts/validate.mjs`: exit0,11 docs/64 IDs/
 24 exact C00–C23 constraints in task descriptions/31 FR; no errors.
- `git diff --check`: exit0, LF→CRLF warnings only; Git check không bao phủ nội
  dung untracked nên không dùng nó làm proof duy nhất cho new design docs.

Core hashes vẫn khớp snapshot post-remediation đã analyze tại Jira10033:
spec `4e2fa0320f3a364511aa49bec5ab5036db168d2ee07b727de4edb1d76a2cef58`;
plan `51e5690ff9d28de47ba7e7d950d19b324896f0114a3bd138be63719ce28ed4b6`;
tasks `6c64e2d6b22f10f16b956cc0e2cd02e7e251cf46f880daf150ae8b173da6f487`.
Lượt này không sửa core artifacts nên reuse analyze report thực thay rerun workflow
để tạo evidence trùng. Chỉ cập nhật handoff/index sau khi pha analyze trước đã kết
thúc, không remediation mới. Không build/render vì không UI/app change.

### Kết luận trình duyệt / điểm tiếp tục

- **Đã đạt**: toàn bộ phạm vi AC tài liệu60 có artifact/evidence; remediation4
  resolved theo report sau sửa; không còn document blocker/findings chưa xử lý
  được xác định trong lượt đối chiếu. Đủ điều kiện **trình owner duyệt Done60**.
- **Chưa đạt (ngoài gate60)**: runtime V2 chưa được implement/verify, không nhận
  SMTP/TLS/Auth/capacity/isolation/rebuild PASS. Obligations task sau giữ nguyên.
- **Chờ owner**: approval chuyển Done60;60/19 vẫn In Progress, không transition
  trong lượt này, không tự nghiệm thu parent19 hoặc bắt đầu63.

Đề xuất next task dựa **live Jira links**, không chỉ remembered roadmap:
21 có inward Blocks từ6 (Done, link10003) và19 (In Progress, link10004);
63 là subtask đầu21 (To Do, rồi64). Đã dùng Graph context21 + hydrate19/63 và
đối chiếu raw Jira inward/outward links để không đọc ngược chiều quan hệ.
Do đó đề xuất **SCRUM-63 dưới SCRUM-21 sau khi60 và parent19 được nghiệm thu**.
Đây là đề xuất, không assignment/execution approval; không đổi dependency/status,
không scaffold/install/Cloud action hoặc mở quyền bằng task handoff.

## Chốt SCRUM-60 và review riêng SCRUM-19

### Owner approval và transition riêng60

Owner xác nhận **“Tôi duyệt nghiệm thu tài liệu SCRUM-60 theo bảng AC và evidence
đã báo cáo. Cho phép chuyển riêng SCRUM-60 sang Done.”** Đồng thời yêu cầu review
độc lập19 gồm59, không auto Done parent do60 hoàn tất; báo dependencies/gate63,
chưa scaffold/Cloud. Gói C63→64 là assignment sau predecessors, không waiver19.

Đọc mới AGENTS/permissions/git status/diff, handoff, Jira59/60/19/21/63/64/18/6
và latest comments60/19 trước hành động. Không thấy issue/file chồng lấn cần
partition trong nguồn đã đọc; user work/untracked/.vscode giữ nguyên.
Installed plan/tasks/analyze artifacts đủ, không rerun specify/constitution hoặc
gọi UI skill/cài thêm công cụ. Chỉ README/architecture/validation cập nhật status/
review; core contracts/spec/plan/tasks và application không đổi.

Workflow hiện tại liệt kê Done transition41 khả dụng cho60. Sau check cuối và
owner approval, đã comment acceptance/giới hạn rồi gọi transition riêng60;
response thật **“Issue SCRUM-60 transitioned successfully”, statusName=Done**.
Không gọi transition19/21/63/64. Những dòng “chờ duyệt60/In Progress” ở các
snapshot trước được thay bởi mốc closure này, không xóa historical evidence.

### Review task cha — không chỉ đếm hai subtasks Done

Current19 AC: “C4/ERD/ADR/contracts và ownership matrix nhất quán, không frontend
ghi business DB. Plan/tasks/analyze Spec Kit map Jira mới. Tài nguyên máy được
ghi, không thêm K8s/Redis/Elastic.” Mục chi tiết còn yêu cầu boundaries, internal
identity, outbox/idempotency/retry/DLQ/versioning/ordering/fanout/projection,
pagination/errors/polling. Đối chiếu độc lập như sau:

| Điều kiện hoàn tất19 | Evidence đã kiểm | Kết quả review |
| --- | --- | --- |
| Predecessor19 đã nghiệm thu | Current Jira18 Done,55/56 Done, approved V2 spec | Đã đạt; không làm lại18 |
| Phần59 đạt actual acceptance/approval | Current Jira59 Done; description5/5 design gates/closure; architecture C4/ERD/ownership/trust/provenance/budgets và ADR-0001 | Đã đạt; không suy từ60 hoặc chỉ field status |
| Phần60 đạt actual acceptance/approval | Matrix15 nhóm, actual analyze10033/remediation, audit10035, owner nghiệm thu60 và transition41 thực | Đã đạt; no remaining identified document findings |
| Cross-artifact consistency/service isolation | architecture C4/ownership/trust + data-model C00–C23 + HTTP/auth/events: BFF/server-only tokens, Community ledger, private schemas/roles, no frontend SQL/cross-service FK | Đã đạt design review |
| Technical communication/reliability scope19 | HTTP pagination/errors/polling/media; authorization signature/issuer/audience/expiry/ledger; events envelope/version/outbox/ordering/projection/receipt/fanout/retry/DLQ/retention/replay | Đã đạt tài liệu, chưa runtime capability |
| Plan/tasks/analyze map Jira thật | plan/research/quickstart,64 unchecked exact-path tasks,31FR+7SC trace, installed workflow evidence và actual post-remediation analyze | Đã đạt coverage/review; không64 implementation tasks Done |
| Resources/approved stack/no platform expansion | architecture historical host measurement + owner reports + provisional4/4/2/H12/resource guards, plan stack; no K8s/Redis/Elastic | Đã đạt document/provenance gate, không capacity runtime PASS |
| DoD evidence/docs/regression/scope | Actual commands dưới đây, static RED16errors→GREEN ở remediation; parent-doc index/status update, no secret/Cloud mutation/legacy removal | Đã đạt document checks |

**Kết luận độc lập19:** không xác định AC thiết kế/tài liệu nào còn thiếu evidence
qua review hiện tại; đủ cơ sở **trình owner nghiệm thu/chuyển19 Done riêng**.
Không tự chuyển19 vì cả59/60 đã Done. Chưa có explicit permission transition19;
giữ In Progress, không xem “Gói C sau tiền nhiệm” là permission đóng parent.
Runtime obligations vẫn ở tasks sau, không là thiếu evidence design19.

### Dependencies và điều kiện bắt đầu63

Current links19: inward Blocks từ18 Done (link10002). Current links21:
inward Blocks từ6 Done (10003) và19 In Progress (10004);63/64 là hai children,
cả hai To Do. Đã dùng Graph context21 và hydrate key19/63; raw Jira inward/outward
links xác nhận direction. Không có dependency mới được thêm/xóa.

1. **Gate còn chờ**: owner chốt nghiệm thu và permission transition riêng19.
   Sau19 Done, hai direct predecessor6/19 của21 mới đều đạt. Không tự đổi status/
   dependencies để bypass; không có thiếu predecessor59/60 nữa.
2. **63 trước64**:63 chỉ pnpm workspace/Next/Nest skeletons/contracts/config
   packages không shared domain ORM, env validation và ports theo current task;
   không business endpoints/full Auth/UI theme. Trước sửa nêu allowlist cụ thể,
   reread current plan/task và chốt compatible dependency versions/installation
   approval; candidate versions trong research không phải đã install/verified.
3. **64 sau63 nghiệm thu**: Compose chỉ apps/RabbitMQ localhost, health/readiness/
   logging/shutdown/env validation/CI static-unit-build không Cloud secrets.
   Resources/Docker/WSL/ports cần kiểm thực trước chạy; historical freeRAM4.98GiB
   thấp hơn full-stack guard6GiB, Docker/WSL chưa có verification, không dùng số cũ
   như readiness hiện tại. Không health giả để che dependency unavailable.
4. **Cloud boundary**: không Supabase Local, không startup migration/seed/reset.
   Connectivity chỉ khi action/target/credentials/CA được cấp hợp lệ; giữ TLS
   chain+hostname và pool4/4/2/H12. Missing inputs/roles/probes phải báo blocker đúng
   task64, không lấy nó chặn document gate19 hoặc xin secrets trong chat.
5. **Không vượt thứ tự**: không tự provisioning/schema/grants/seed/rebuild, không
   full Auth/business feature/deploy/paid plan/global config/commit/push. Không
   giữ blocked75/76 thành dependency giả trước scaffold63; những gates đó giữ vị
   trí và isolated-target requirements riêng.

### Verification lượt closure60/review19

Đã chạy lại trước transition: `npm test` PASS47/47,0fail/skip;
`npm run typecheck` PASS0 diagnostics/66files; `npm run check:structure` PASS73/73;
`node scripts/check-guardrails.mjs` PASS7docs/45rules/staticOnly;
`node specs/003-grabmefood-v2/validate.mjs` PASS31/31/16/10;
`node specs/003-grabmefood-v2/contracts/validate.mjs` PASS11docs/64IDs/
24verbatim constraints/31FR/errors=[].
Core spec/plan/tasks hashes không đổi từ actual analyze10033; reuse evidence,
không giả rerun analysis hay coi tests root là V2 runtime tests.
Sau status-doc edits kiểm lại feature/contracts validators và diff-check;
no build/render vì không UI/app changes. Không scaffold, install, Docker start,
Cloud probes/SQL/mutation hoặc credentials reads.

## Gói C — cập nhật sau approval riêng19 và scaffold63

Owner cho phép chuyển19 Done để tiếp tục63→64. Đã reread current Jira và review
parent độc lập phía trên; transition41 trả `statusName: Done`. Không auto-close
vì children Done.21 blockers6/19 đều Done;21/63 chuyển In Progress trước scaffold.
Các đoạn “chờ duyệt19/chưa scaffold” phía trên là evidence lịch sử, không current.

Scaffold63 độc lập trong `v2/`: owner duyệt exact dependency pins/install trước
cài; không source/assets legacy hoặc product theme/Auth/business features.
Final `pnpm verify` PASS lint/typecheck/build, Jest24/24, HTTP smoke5 processes;
frozen install PASS. Legacy checks riêng PASS47/47,0diagnostics/66files,
structure73/73,build1740modules. Regression sai DB project có RED17pass/1fail
trước fix và GREEN18/18 sau fix; final24 bao gồm structural tests.
Chi tiết/file/giới hạn: [evidence63](../../docs/maintenance/SCRUM-63-validation.md).

64 còn Docker Engine/resources/Cloud roles/TLS/preflight và Compose/CI; không lấy
liveness200 làm readiness/business/Cloud PASS. Không remote mutation, SQL,
credential reads, Supabase Local hoặc commit/push. Không thay approved contracts.

### SCRUM-64 — kickoff và static work sau owner approval

Owner duyệt tiếp tục64, yêu cầu kiểm docker version/info; không pull/start trước
duyệt exact version/digest.63 vẫn Done;64 chuyển In Progress,21 giữ In Progress.
Actual Engine29.9.3/Desktop4.99.0/linux-amd64 đã truy cập được; metadata-only
imagetools xác định Node24.16.0-bookworm-slim/RabbitMQ4.4.0-management và digests
trong `v2/infra/image-proposal.json`, pending-owner-approval. Không image layers/
containers. Historical missing Engine pipe không còn current blocker.

Delivered phần độc lập: read-only Windows host preflight/pure policy tests,
GitHub Actions workflow pinned SHAs/Node+pnpm, không Cloud secrets hoặc Docker
operations. CI chưa push/chạy remotely, static assertions không actual Actions run.
Host preflight blocked: freeRAM4.307GiB<6, Docker data disk unknown; workspace/
Engine/Compose/Linux/ports đạt point-in-time. Không tự sửa WSL/settings/data path
hoặc waive guards. Compose/runtime/Cloud TLS còn thiếu,64 chưa Done.
Evidence: [SCRUM-64](../../docs/maintenance/SCRUM-64-validation.md).

Owner tiếp theo duyệt2image pins và xác nhận Docker data ởC. Resource recheck
actual: freeRAM3.22–3.83GiB<6/Cfree12.947GiB<15; không node.exe Windows hoặc
listener service mặc định, Docker0containers/0images. Image approval không
resource override. Đã trình `demo-lite` production/all6containers/caps2GiB,
runtime-only guard4GiB/build6GiB, disk15GiB giữ; **proposal chưa được duyệt hoặc
áp dụng**, thresholds hiện tại không đổi. Không kill/delete/prune/WSL config/
pull/build/start hoặc Cloud action.64/21 giữ In Progress; full proposal/evidence64.

Owner tiếp theo: “Tôi duyệt profile trên và nhớ bổ sung trên jira để đồng bộ”.
Đã ghi demo-lite owner-approved và hỗ trợ explicit profile+phase trong preflight:
runtime4GiB/build6GiB, disk15GiB/default6GiB không đổi; all6container caps2GiB
chỉ declared, chưa enforce/verify trong Compose. Earlier “chưa duyệt” là lịch sử.
Test-first new profile: RED15pass/3fail trước implementation; GREEN19/19 sau
implementation và thêm exact-profile assertion, không giảm negative/default tests.
Actual runtime preflight mới RAM4.680862GiB PASS nhưng C12.969654GiB<15 BLOCKED,
workspace60.681843/Engine/Linux/Compose/ports PASS; Cloud vẫn not-verified.
Không pull/build/start hoặc sửa máy.64/21 giữ In Progress, đồng bộ approval trên Jira.

Rereview64 theo yêu cầu tiếp tục/chỉ Done khi xong: đã thêm Compose6localservices/
Linux multi-stage Dockerfile/container liveness probe/start-demo.ps1 fail-closed.
Compose CLI parser thật PASS với inert canary, caps/pins/ports/volume assertions;
infra27/27 PASS, Jest24/24,lint/typecheck7packages PASS. Root47/47,typecheck0/66,
structure73/73 riêng. Actual entrypoint ScaffoldOnly bị chặn trước mutation do
Cfree12.970882<15; RAM4.686214≥4 PASS runtime-only. Dockerinfo cuối vẫn0images/
0containers. Không Docker build/start/Cloud/remoteCI PASS;64/21 giữ In Progress,
chi tiết evidence64. Yêu cầu Done có điều kiện không waive các AC chưa đạt.

Owner sau đó tự di chuyển Docker data bằng Desktop sang `D:\DockerDesktopWSL`.
Actual Engine29.9.3 usable/0images/0containers; folder/VHD metadata có. Preflight
đã dùng supplied path, không fixedC; không sửa/hạ15GiB. New data/workspaceD
59.128883GiB PASS, CWindows/temp14.818–14.837GiB đo riêng, build contextD.
Runtime/build preflight rerun tuần tự còn BLOCKED do freeRAM2.806854<4 /
2.786564<6; ports PASS. Earlier parallel port probe collision không persistent
port failure. Không pull/build/start hoặc xóaoldDockerC/data.64/21 chưa Done.

Owner tiếp theo cho đo/điều chỉnh local budget thay fixed6GiB, không waiver
safety/pins/services/acceptance. Bounded Linux builder2GiB/noSwap/2CPU,
heap768/Nextworker1, sequential; runtime6caps vẫn2GiB/noSwap. PilotA pull
exactNode và chạy thật: partialbuild packagingFAIL/nonTTY, noOOM/restarts0,
cgrouppeak1537.85MiB, minWindowsavailable2825.84MiB, maxVMWS3649.27MiB.
BaselineVM≈960.62MiB; conservative residual≈1150.8 →allowance1280; budget
2048workload+1280allowance+1024reserve=4352MiB(4.25GiB) perphase.
Không doublecountbaseline hoặcswap/VMcapacity; runtimeallowance chưa validated.
Regression29pass/3fail→32/32 sau scriptfix; actual rerunblocked, new33rdVMcase
và revisedbudget tests chưa finalrerun vì hostavailable0.634GiB<reserve1.
Không fullruntime/CI/CloudPASS, không Done; evidence
[budget validation](../../docs/maintenance/SCRUM-64-budget-validation.md).

Owner đóng apps và giao cached retry: initial preflight available7.565880 PASS,
reuse builderA/caps/cache. Next+4Nest+2shared production builds actual PASS,
resume gặp actual deploy-dir-not-empty; regression RED3/1→GREEN4/4, fix dùng
fresh attempt deploy directory, không delete. ResumeB Linux compilation/packaging
exit0/noOOM/cgrouppeak1130512384/minWindowsavailable4398.48MiB PASS.
AssembleDocker4/5images Gateway/Catalog/Community/Notification exit0; Web chưa
build vì subsequent RAMgate4.240234 rồi3.763187<4.25. Không app/broker start/
healthy hoặc whole6simultaneous proof;64/21 giữ In Progress.
Fresh infra34/34,lint/Jest24/24,root47/47+0/66+73/73 PASS.

Tiếp tục đúng artifact boundary: preflight7.816471GiB/D57.072487 PASS, chỉ
assembleWeb từ tar,5/5appimages build. Actual runtime-smoke.ps1 exit0:
6/6simultaneous healthy60s,live200/ready503/business404/Web200,stop/start+
durable broker message PASS; cgroup caps/noSwap/OOMfalse/restarts0 verified.
37samples,minWindowsavailable4964.42MiB/maxVMWS2993.07MiB. Sau scoped
graceful-stop0running apps, definitions/data/images giữ;5Nodeexit143(SIGTERM),
Rabbitexit0. Không Cloud/GitHubCI/long-workload/business success claim.
Fresh infra36/36,Jest24/24,lint/typecheck7/root47/47+0/66+73/73 và validators
PASS.64/21 In Progress vì còn actualCloudTLS/roles/quotas/CI gates.
Evidence [runtime64](../../docs/maintenance/SCRUM-64-runtime-validation.md).

2026-11-17 gate review: giữ actual local evidence, không build/start lại.
GH CLI unauthenticated, workflow/V2 chưa commit; inspected local/remote main
SHA0bba883db9bcbca6a01de2e5d38b4cb57cec1746 không phải CI-testedV2SHA.
Fresh allowed Cloud metadata tables/migrations[] không enumerate roles;
live roles UNKNOWN. Current Jira21→47→22→23 plus64roleAC tạo acceptance-induced
cycle, không phải new graph-link cycle. Tách formalTLS→65/roles→67–68/grants+
authenticated tests→69–70 là **proposal chờ owner duyệt**, chưa thayT002/AC/links.
Xem [gate review](../../docs/maintenance/SCRUM-64-gate-review.md);
không actualCI/TLS/SQL/Cloudmutation/commit-push hoặc chuyểnDone.
