# GrabMeFood V2 — current approved architecture amendments

## Owner-approved security simplification — 2026-11-19

This section is the current authority for security/session implementation and
supersedes conflicting historical descriptions later in this file and in the
older SCRUM-59 design narrative. It does not change product features or roadmap
structure.

- Web: Vite + React + TypeScript SPA. Backend: Java 21, Spring Boot 3.5.16,
  Maven multi-module, one Gateway/BFF and separate Catalog, Community, and
  Notification services. RabbitMQ and Supabase Cloud topology are retained.
- Supabase Auth owns credentials, verification/recovery email, and account
  session behavior. Spring Gateway validates Supabase JWTs and is the browser
  API edge. Community owns profile/business data, not custom session authority
  or provider-token custody.
- Do not build a Community session ledger, token custody, refresh fencing, or
  durable global revocation. Logout/expiry follow Supabase Auth-supported
  behavior; never claim immediate global invalidation beyond provider guarantees.
- Keep TLS certificate chain and hostname verification, server-side secrets,
  input validation, basic least-privilege service access, RLS for user-private
  data, and essential cross-user negative tests. Keep secure cookie protections
  and CSRF checks for cookie-authenticated mutations. No additional
  production-hardening infrastructure is required.
- Preserve all user-facing features, Supabase Storage, seed/demo data and media,
  Gateway/Catalog/Community/Notification boundaries, API behavior unrelated to
  advanced session internals, Jira order/dependencies, and SCRUM-49/75/76 gates.
- Existing historical architecture and session protocol entries below remain
  records of earlier decisions, not implementation authority where they
  conflict with this amendment. SCRUM-120 remains blocked; no Cloud operation
  follows from this amendment.

## Historical architecture record

The remaining sections preserve prior evidence and decisions. Apply the
current amendment above wherever a prior session/security statement conflicts.

  giữ backend theo session, không bảo đảm multiplex nhiều idle clients như
  transaction mode.
- Formula scale/rollout: `P = 4*rCatalog + 4*rCommunity + 2*rNotification + m`,
  với `m∈{0,1}`. Một replica mỗi service → P=10 hoặc 11; chạy đồng thời hai bộ
  processes → P=20 hoặc 21, không nằm trong demo budget một bộ. HMR/test workers/
  scripts không được tự tạo thêm pool ngoài caps; release client trong finally,
  đóng pool khi shutdown, không giữ DB transaction qua HTTP/Auth/RabbitMQ wait.
- Gate ordinary connections: **`P + U + H ≤ 57`**, không gồm3 reserved slots.
  P là app runtime+migration backends, U là other backend usage ngoài P, H chỉ
  operational headroom. Definitions/proposal/evidence bên dưới; U_peak chưa biết,
  H=12 đã được owner duyệt provisional; U_peak chưa đo → **chưa PASS aggregate capacity**. Không tự đổi pool size,
  compute, max clients hoặc plan.

### Capacity evidence owner bổ sung — không phải AI independent verification

Nguồn là owner chạy SQL read-only và chụp Dashboard, sau đó cung cấp tóm tắt
trong hội thoại ngày2026-11-16. AI chưa chạy lại SQL, chưa đọc raw SQL/screenshot
hoặc kiểm độc lập. Không tự gán timestamp thu thập/sampling interval chưa có.

**SQL snapshot**: max_connections60, superuser_reserved_connections3,
reserved_connections0, current_client_connections5 tại lúc query.

| Role | State | Connections tại SQL snapshot |
| --- | --- | ---: |
| authenticator | idle | 1 |
| pgbouncer | idle | 1 |
| postgres | active | 1 |
| supabase_admin | idle | 1 |
| supabase_storage_admin | idle | 1 |
| Tổng | | 5 |

`postgres active` có thể là query quan sát từ SQL Editor; chưa đủ bằng chứng để
tự loại nó khỏi count. Role privileged không đồng nghĩa đang dùng reserved slot;
không trừ tiếp các sessions đó chỉ vì đã loại3 slots khỏi ceiling.

**Dashboard snapshot khác**: Connections8/60; active queries0; idle in
transaction0; blocked queries0; top blocker/longest running không hiển thị.
Sessions đang lọc3 roles anon/authenticated/postgres, nên “No active sessions”
không nói toàn DB không có kết nối. Không dùng5 và8 như cùng thời điểm, không
gọi chúng mâu thuẫn hoặc lấy8 làm peak. Active queries0 không có nghĩa connections0.

### Headroom và review budget — owner duyệt provisional, không capacity PASS

Giữ cap P=10 runtime (4+4+2), migration tối đa1 khi có approval, worst-case P=11.
Owner duyệt provisional **H=12 operational slots**, xấp xỉ21% ceiling ordinary57, **ngoài**3
superuser reserved slots đã trừ. Lý do: giữ buffer cho dao động ngoài các cửa sổ
đo, reconnect/startup/monitoring và thời gian xử lý khi sát trần. Đây là lựa chọn
thận trọng để review trên Nano khi chưa biết U_peak, không phải Supabase requirement
hoặc số liệu đã đo. Không cấp buffer này cho app pool/replica bổ sung.

- U bao gồm PostgreSQL backends managed Auth/Storage/PostgREST, pooler backends/
  clients khác, admin/SQL Editor, monitoring và diagnostics **chưa nằm trong P**.
  Đếm mỗi backend/session một lần; không cộng pooler front-end client vào cùng
  backend lần nữa. Không tính lại app/migration sessions đã thuộc P.
- H không là measured usage, không gồm3 reserved slots, không cộng lại một
  managed-service allocation đã tính trong U. Phần tăng chưa quan sát có thể
  tạm dùng buffer; khi trở thành sustained usage phải đưa vào U và tính lại.
- Ràng buộc với H=12 (approved provisional):

| Scenario | P | U tối đa theo bất đẳng thức, không phải measured peak |
| --- | ---: | ---: |
| Một process/service, runtime | 10 | 57−10−12=35 |
| Runtime + một migration đã được duyệt | 11 | 57−11−12=34 |

Vì thế **`11 + U_peak + 12 ≤ 57` yêu cầu `U_peak ≤ 34`**. Đây chỉ là
điều kiện kiểm khi peak usage có evidence; H đã duyệt provisional, cần re-review
nếu số đo/thông số/workload thay đổi. Không thế5/8
snapshot vào U_peak để tuyên bố PASS; không gọi34 là U thực tế hoặc quota được
Cloud cấp. Phần3 slots superuser không là overflow budget cho ứng dụng.

**Review outcome**: cap4/4/2 và H12 được owner duyệt provisional có điều kiện, chưa pin/apply.
Đã biết ceiling theo owner report; còn thiếu plan, U_peak theo thời gian khi
đầy đủ apps/broker/Auth/Storage chạy để kiểm/review lại H=12. Giới hạn kết nối không
chứng minh Nano đủ CPU/RAM/latency; resource/workload evidence vẫn phải có.

**Evidence kế tiếp, không thực thi SQL ở SCRUM-59**: ở task kiểm thử/hạ tầng được
giao sau này, thu time series có timestamp, sampling interval/window và workload:
idle baseline, startup, concurrent journeys/Auth/Storage, polling/consumers,
reconnect/shutdown; migration đồng thời chỉ nếu được duyệt. Phân biệt P_actual/
U_actual bằng app/service role + application_name/connection identity, không lấy
total rồi cộng app lần nữa. Kiểm pool waiting/acquisition timeout và leak/idle
transaction, review peak/headroom với owner; không thu raw query/secret/PII không
cần thiết. Nếu vượt envelope, dừng review/tune proposal, không tự đổi Cloud plan.

### TLS, connectivity và credential gate

- Yêu cầu owner: client xác minh **certificate chain và hostname** bằng
  `verify-full` hoặc tương đương driver. SSL enforcement chỉ từ chối plaintext,
  không thay client-side identity verification. Không `rejectUnauthorized=false`,
  không `NODE_TLS_REJECT_UNAUTHORIZED=0`, không chỉ `sslmode=require`.
- CA file local hiện chỉ do owner báo đường dẫn, không được embed absolute path
  làm prerequisite portable của repo. Task infrastructure sau sẽ dùng đường dẫn
  env server-only và read-only mount trong container; không commit password,
  private keys hoặc copy CA vào bundle. Cần kiểm PEM/expiry/fingerprint/provenance
  trước sử dụng; chưa có kết quả certificate verification ở lượt này.
- Với candidate driver `pg`, phải dùng một nguồn cấu hình TLS rõ ràng để DSN
  parser không ghi đè CA/verification; kiểm hostname against Connect host và
  test wrong CA/hostname rejection tại task hạ tầng, không triển khai driver ở đây.
- Credential quản trị chỉ cho workflow đã duyệt; không copy DSN `postgres` vào
  tất cả services. Password nếu đưa vào URI phải percent-encode **password
  component**, không encode cả URI hoặc log URI thật. Không yêu cầu secret chat.
- Thực chạy từ Windows host: `Resolve-DnsName ... -Type AAAA -DnsOnly` trả AAAA;
  `Test-NetConnection ... -Port 5432` báo name resolution failed,
  `TcpTestSucceeded=False`, `RemotePort=0`. Không tới TCP/TLS/Auth, không chứng minh
  port đóng hoặc project down. DNS AAAA không chứng minh usable IPv6 route từ
  Windows/Docker. Cần kiểm đường mạng usable trước chọn direct; nếu IPv4-only,
  owner cung cấp Session pooler Connect metadata không bí mật. Không mua IPv4 add-on.
- Không đọc certificate ngoài repo, không đọc password/env, không connect
  PostgreSQL hoặc chạy SQL bằng MCP trong lượt này.

### MCP đã reconcile; yêu cầu reset không thực thi trong SCRUM-59

Owner từng báo đã cấp MCP read/write và cho phép không dùng isolated target. Kiểm file
trước phê duyệt tiếp theo thấy `mcp.supabase`, URL rộng không `read_only=true`, `enabled=true`;
đồng thời `permissions` vẫn deny `supabase_*` trừ 5 metadata tools. Đây là user
change, đã giữ nguyên để hỏi owner. Lúc đó `npm test`
45 pass/2 fail do guardrail expectation `mcp.servers`/read-only. Không đổi tests
để che mismatch, không qua shell/SQL/agent khác để vượt deny.

Owner tiếp theo trả lời “đồng ý và nhớ cập nhật lại jira nếu có hay đổi cần sự
đồng bọ”, chấp thuận riêng chuẩn hóa MCP V2 và giữ metadata-only cho SCRUM-59.
Chỉ khối MCP trong repo đã đổi thành `mcp.servers.supabase`, project ref cố định
`bdhavbwmxbttymerizvx`, `read_only=true`, features docs/database/development.
Permissions/policies/canary/tests không đổi; arbitrary SQL/mutations/key retrieval
vẫn deny. Sau sửa `npm test` PASS47/47, typecheck0/66, structure73/73;
`opencode mcp list` connected. Đây không là PostgreSQL/TLS/SMTP application test.

Quyền tool read/write không tự giao migration/seed/reset hoặc task tương lai.
Exception bỏ isolated test target còn xung đột constitution/AGENTS/ADR; trước
destructive execution cần review amendment và trình exact target/allowlist/impact/
backup status, chờ owner xác nhận riêng. SCRUM-59 hiện không cần destructive
operation nào; **không đưa ra reset allowlist hoặc thực thi reset trong task này**.

## Gate

- SCRUM-59: owner đã duyệt Gói A review boundaries/session, provisional budgets và
  phân chia design/runtime acceptance bên dưới. Gate thiết kế được đối chiếu bằng
  artifacts/static checks; không đòi full-workload trước scaffold hoặc miễn test.
  SCRUM-59 đã Done sau final gate verification theo yêu cầu owner; không chuyển
  parent19 hoặc bắt đầu60.
- SCRUM-60: chưa tạo full contracts/data-model/plan/tasks/analyze; template còn rỗng.
  Ngoại lệ: ADR Cloud đã tạo theo yêu cầu chuyển đổi, không làm toàn SCRUM-60.
- SCRUM-63/64: chưa scaffold/install dependencies/start Docker; chưa được giao
  execution, full contracts/plan/prerequisites và approval thao tác vẫn phải đạt.
- Không migrations/seed/reset/config remote/UI/full Auth. Rebuild/restore blocked
  vì chưa có isolated approved target; không thử trên project chính.

## Tiến độ thực tế

Trước approval Gói A ngày2026-11-16: khoảng **70% SCRUM-59** theo ước tính khối lượng, không phải % Jira
hay tỷ lệ acceptance. Đã giữ và bổ sung C4/ERD boundaries, ownership, session A,
trust và Cloud/local resource proposal. Ở mốc đó còn thiếu review/acceptance.
Direct Connect/SSL và max_connections60/reserved3/ordinary57 đã có owner evidence;
các mục U_peak, plan, network/TLS/app/resource evidence là follow-ups runtime sau
scaffold theo acceptance split đã duyệt. H12/pool/resource targets được duyệt
provisional, không phải capacity/runtime PASS.
Blocker thiếu giới hạn DB đã được gỡ ở mức owner report, không phải aggregate
capacity PASS. Không tự cập nhật progress field hoặc chuyển task; estimate cũ
không thay thế bảng đối chiếu gate thiết kế sau approval.
Không chuyển SCRUM-60; không lấy baseline legacy tests làm bằng chứng V2 runtime.

## Gói A — review SCRUM-59 và approval owner

Review này đối chiếu current SCRUM-59/task cha19, descriptions/amendments và
comments mới nhất đã đọc, approved spec/ADR, research/validation và repo thực tế.
Review ban đầu trình proposals, không tự sửa acceptance trước owner approval.
Owner sau đó xác nhận **“tôi duyệt các đề xuất”** trong hội thoại ngày2026-11-16:
duyệt phần review thiết kế/assumptions, provisional budgets và acceptance split.
Không suy ra permission remote hoặc acceptance runtime thành công.
Spec Kit1.3.3/OpenCode-PowerShell đã kiểm metadata/instructions; reuse artifacts,
không chạy lại specify/plan/tasks/analyze hoặc tạo spec nghiệp vụ song song.

### Review tính nhất quán — đã đối chiếu ở mức thiết kế

| Boundary | Kết quả review | Chưa được coi là đã kiểm runtime |
| --- | --- | --- |
| Service/data ownership | Catalog content/offerings/media; Community profiles/preferences/saved/comments/session ledger; Notification inbox/read/projection. Schema/role riêng, HTTP/events thay business cross-schema SQL/FK | Roles/grants/constraints chưa tạo, ERD hiện là conceptual boundary |
| Browser/BFF/Gateway | Opaque HttpOnly cookie, tokens server-side; frontend business APIs qua Gateway; không shared runtime postgres/admin credential | Chưa có browser/BFF/API implementation để kiểm CSRF/cookies/token leaks |
| Session/revocation | Khớp ADR session A: Community authority, fail-closed sync check, không JWT-only/positive cache/broker authority; normal login admission khác recovery-only | Chưa có logout/password/reset/refresh races hoặc partial-failure tests |
| Revocation timing | Chặn authorization mới sau durable point; request authorized trước đó có thể hoàn tất. Không tự đổi thành cancel in-flight | Cần integration/fault tests sau implementation |
| Identity và quyền | Không tin browser identity header; backend authz không assume auth.uid(); không direct private Storage/Data API bypass | Service auth details/contracts ở60; negative tests sau schema/services |
| Cloud/local | Cloud DB/Auth/Storage, local apps/broker; TLS chain+hostname, không startup migration/seed/reset | MCP connected/DNS AAAA không chứng minh PostgreSQL/TLS/Auth/SMTP thành công |

Không thấy lý do phải đổi các ranh giới hoặc session A đã duyệt. Những chi tiết
HTTP/event payloads, service-auth/timeouts, schema dictionary đầy đủ vẫn thuộc60,
không được biến review59 thành triển khai contracts/scaffold/Auth application.

### Phân loại evidence và assumption

| Loại | Đầu vào hiện có | Giới hạn |
| --- | --- | --- |
| AI static checks | Current root package vẫn legacy; glob không có v2; baseline tests47/47, typecheck0/66, structure73/73 | Không là test runtime V2 hoặc proof Cloud |
| AI tool observations đã ghi lịch sử | MCP metadata API URL/tables/migrations; DNS AAAA có nhưng host TCP probe không tới kết nối | Không chạy lại hoặc nâng thành successful DB/TLS verification ở review này |
| Owner report | Direct Connect; SSL enforcement/CA đã tải; Nano/pool15/clients200; SQL60/3/0/57 và snapshots5/8; Gmail SMTP | AI chưa kiểm độc lập DB settings/CA/SMTP/SQL screenshot |
| Approved provisional | Caps4/4/2, migration1 khi được duyệt riêng, H=12; local RAM/disk/startup guard targets | Owner duyệt Gói A; chưa pin/configure hoặc measured |
| Chưa có evidence | Plan, usable app network/TLS, U_peak/time series full workload, measured RAM/CPU/latency, redirects/email/Auth E2E | Không PASS; phải có task/runtime phù hợp để kiểm |

### Dependency acceptance cần owner duyệt trước khi chỉnh

Current SCRUM-59 có mục tiêu C4/ERD/ownership/trust nhưng kế thừa câu “dữ liệu có
constraints/permissions tests”; các amendment còn liệt kê U_peak/app TLS thiếu.
Trong khi đó repo chưa scaffold V2, schema/services chưa có; parent19 còn gồm
contracts/plan/tasks/analyze thuộc subtask60 sau59. Nếu buộc59 có tất cả runtime
evidence của hệ thống đầy đủ trước scaffold, tạo dependency vòng.

**Phân chia được owner duyệt trong Gói A để đồng bộ acceptance Jira:**

| Gate | Phạm vi đề xuất | Evidence vẫn bắt buộc, không được miễn |
| --- | --- | --- |
| SCRUM-59 | Review C4/conceptual ERD/ownership/session A, provenance/assumptions/risk; owner chốt provisional budgets và đường kết nối dự kiến | Owner approval review + budgets; test design obligations và runtime follow-ups được định danh, không báo runtime/capacity PASS |
| SCRUM-64 sau scaffold | Cloud/local preflight, resource/readiness, connectivity và certificate/hostname verification từ môi trường chạy | Smoke positive/negative TLS theo quyền và credentials được cấp riêng; không buộc full feature workload ở đây |
| SCRUM-70 sau schema/grants; SCRUM-112 audit | Service/user isolation, RLS/backend authz, secret/internal-auth/Storage negative tests | Evidence thật, không thay bằng conceptual ERD |
| SCRUM-107/108 sau features | Journeys/session revocation, recovery-only, concurrency/outage/partial failure | Test theo ADR/FR-031, không JWT-only fallback |
| SCRUM-111 khi full workload sẵn | Peak other usage, pools/waits/leaks, RAM/CPU/latency và headroom review | Time series/window/workload tách P/U; aggregate capacity gate, không dùng5/8 làm peak |

Đã đọc current scopes các tasks được dẫn trên. Sau owner approval, bảng là phân
chia acceptance được duyệt để đồng bộ Jira; không giao thực hiện, không tự đổi
dependencies/status hoặc chuyển task.
Network TLS cần credentials/role/target chưa có ở64 thì phải báo blocked và
owner điều phối prerequisite, không giả bootstrap/reset đã được cấp quyền.

### Quyết định Gói A đã được owner duyệt — không mở lại session A

- Chấp thuận provisional pool caps4/4/2, migration1 khi được duyệt riêng,
  H=12 ngoài3 reserved; cùng local resource targets ở section budget. Chấp thuận
  provisional không pin settings, cấp migration hoặc chứng minh capacity PASS.
- Chấp thuận phân chia design acceptance59 và runtime validation sau scaffold
  ở bảng trên. AC đã đồng bộ;59 đã Done sau final verification, không chuyển60.
- Owner cung cấp plan và Session pooler Connect metadata không bí mật nếu chọn
  fallback. Direct chưa chứng minh usable; không khẳng định chắc chắn không dùng
  được ở mọi mạng. Không tự ghép endpoint hoặc giảm certificate verification.

### Đối chiếu gate thiết kế SCRUM-59 sau approval

| Acceptance thiết kế được duyệt | Evidence / trạng thái |
| --- | --- |
| C4/conceptual ERD/ownership/trust nhất quán Cloud + local | Các section tương ứng ở file này, khớp spec/ADR; review tài liệu đã đạt |
| Session A và ranh giới authority/revocation giữ nguyên | ADR Accepted và review matrix; không browser token/JWT-only; review đã đạt |
| Provenance/assumptions/risk/connection strategy minh bạch | Owner reports và AI observations tách biệt; direct chỉ dùng nếu usable, Session pooler metadata là prerequisite fallback; không claim TLS PASS |
| Provisional DB và local resource budgets có owner quyết định | Caps4/4/2, migration1 khi duyệt riêng, H12 và local targets: approved provisional; chưa pin hoặc measured |
| Runtime checks có acceptance follow-up, không bị miễn |64 preflight/TLS/resource,70 isolation,107/108 journeys/fault,111 workload/capacity,112 audit; đã duyệt phân chia, chưa thực thi |

Plan, session-pooler endpoint và runtime evidence chưa có vẫn phải ghi thiếu.
Chúng không bị biến thành “đã đạt” để đóng gate; đã được phân loại vào runtime/
preflight follow-ups sau scaffold thay vì dependency vòng trước scaffold.

### Chốt SCRUM-59

Owner yêu cầu “tiếp tục cho xong đi chứ”; đã kiểm final5/5 design acceptance
và checks, Jira workflow `transitionId=41` trả `statusName=Done`.
Không giữ In Progress chỉ vì đang bàn giao. Estimate70% ở các snapshot trước
không là tiến độ hiện tại: phần thiết kế59 đã hoàn tất theo acceptance được duyệt.
SCRUM-19 vẫn còn60; chưa thực hiện60, scaffold hoặc runtime verification.

## SCRUM-60 — contracts/planning sau approval

Owner giao riêng60 sau59 Done, duyệt6 đề xuất và Community receipt linearization
tại [ADR-0002](adr/0002-v2-contracts.md). Các câu “chưa60/template” phía trên là
snapshot trước assignment này, không trạng thái hiện tại.
[Plan](../specs/003-grabmefood-v2/plan.md),
[data dictionary](../specs/003-grabmefood-v2/data-model.md),
[HTTP/session/events](../specs/003-grabmefood-v2/contracts/README.md),
[task trace](../specs/003-grabmefood-v2/traceability.md) đã qua remediation và
analyze read-only; owner đã nghiệm thu tài liệu và Jira SCRUM-60 đã Done.
Không scaffold/app/schema được tạo. Token/session authority vẫn Community;
recipient receipt cũng Community, inbox/read/import Notification; projection
không là recipient authority. Diagram session/delivery bổ sung trong artifacts.
Runtime gates/budgets/no implicit provisioning giữ nguyên, không capacity PASS.

### Bàn giao nghiệm thu SCRUM-60 — owner đã duyệt và Jira Done

Đối chiếu current AC60 và phần kế thừa từ19 đã hoàn tất ở mức tài liệu:
HTTP/events/pagination/errors/auth/retention/replay, data dictionary/diagrams/
ownership, ADR được duyệt, plan/tasks/analyze và requirements trace đều có
artifact/evidence thật. Bảng đầy đủ và kết quả checks tại
[validation — đối chiếu toàn bộ AC](../specs/003-grabmefood-v2/validation.md#scrum-60--đối-chiếu-toàn-bộ-ac-để-trình-owner-nghiệm-thu).
Analyze sau remediation không phát hiện findings còn lại trong vòng review;
report hội thoại/Jira60 comment10033. Approval remediation không là approval Done;
owner sau đó đã **nghiệm thu riêng60 và cho phép chuyển riêng60 sang Done**.

Không đòi UI render/schema permission tests hoặc Cloud full-workload chưa tồn tại
để đóng task tài liệu. Những obligations64/70/81/82/88/103/104/107/108/111/112
và75/76 vẫn chưa chạy, không bị miễn và không nâng thành PASS. Chưa có scaffold.
SCRUM-60 Done bằng workflow transition41 đã trả statusName=Done; SCRUM-19 giữ
In Progress để review/owner chốt task cha riêng, không tự Done do60 hoàn tất.
Dependency Jira hiện tại:21 bị chặn bởi6 (Done) và19 (In Progress). Đề xuất63
(subtask đầu21, rồi64) **sau** gate60/19 được nghiệm thu và owner giao scope mới;
không triển khai hoặc đổi dependencies ở lượt bàn giao.

### Review riêng task cha SCRUM-19 sau closure60

Đã kiểm current AC19 độc lập với trạng thái con: predecessor18 Done;59 đạt
5/5 design gate/owner approval và Done;60 đủ AC/document evidence/owner approval
và Done. C4/ERD/ownership/trust ở59 khớp dictionary/HTTP/auth/events/ADR/plan ở60;
31FR+7SC→64 task paths/Jira/analyze; resources/provenance/provisional budgets và
no K8s/Redis/Elastic được ghi. Baseline/static validators đã chạy thật.
Review matrix đầy đủ tại [validation](../specs/003-grabmefood-v2/validation.md#chốt-scrum-60-và-review-riêng-scrum-19).

Không xác định còn thiếu evidence trong **AC thiết kế của19** qua lượt review;
đủ trình owner nghiệm thu parent, nhưng chưa được phép tự transition19.
Runtime64/70/81/82/107/108/111/112 và rebuild75/76 giữ nguyên, không trở thành
pre-scaffold evidence để giữ19 mở. Blocker hiện tại của63 là gate nghiệm thu19
chưa chốt, không phải60 chưa Done hay thiếu runtime Auth/Cloud trong task thiết kế.
Gói C đã được nêu với điều kiện sau predecessors, không bỏ gate19:
chưa scaffold/install/start Docker/Cloud probes hoặc tạo CI ở lượt này.

## Owner-approved stack amendment — SCRUM-5, 2026-11-19

This section amends the historical Next.js/NestJS target below; it does not
rewrite historical approvals or change service/data boundaries. See
[ADR-0003](adr/0003-vite-spring-stack.md) and the normative
[HTTP/session contracts](../specs/003-grabmefood-v2/contracts/README.md).

- **Web:** Vite + React + TypeScript SPA. Next.js is not the target V2 web
  framework. Keep the existing legacy removal gate: do not remove legacy
  Next.js/Node until Spring Gateway auth/session works and SPA production build
  passes.
- **Backend:** Java 21 LTS, Spring Boot 3.5.16, Maven multi-module. One
  Spring Gateway/BFF plus independent Catalog, Community and Notification
  services. Spring Boot 3.5.16 is the latest 3.5 patch announced by Spring on
  2026-06-25, but Spring identifies it as the final OSS release of that
  generation; support must be reviewed before implementation/release. The
  requested 3.3.x line is also unsupported: 3.3.13 was its final OSS patch
  (2025-06-19). Sources and rationale are in ADR-0003. No extra framework.
- **Session transport:** Supabase Auth owns account credentials and supported
  session/refresh behavior. Spring Gateway is the browser-facing edge, validates
  Supabase JWTs, and provides the agreed cookie/CSRF/CORS handling. Community
  owns profile and application data, not a custom session ledger or provider
  token custody. Use provider-supported logout and expiry; do not claim
  immediate global revocation beyond provider guarantees.
- Keep basic authorization at the owning service, least-privilege service
  database access, RLS for user-private records, TLS chain/hostname verification,
  server-side secrets, and input validation. Do not add custom refresh fencing,
  durable revocation machinery, exhaustive distributed-failure matrices, or
  production-hardening infrastructure for the student project.
- **HTTP contract:** existing `/api/v1` Markdown contracts remain normative.
  The OpenAPI representation is
  `../specs/003-grabmefood-v2/contracts/openapi.yaml`; it records existing
  operations and DTOs without adding business behavior. Java DTOs are the
  implementation source of truth; CI checks provider DTO compatibility and
  generates TypeScript frontend types from OpenAPI, with provider and consumer
  contract tests.
- **Database:** Flyway alone owns schema. JPA/Hibernate
  `ddl-auto=none`; no schema generation/update. V001–V015, seed, RLS/grants,
  DB contracts and data evidence remain unchanged. No Cloud connection,
  preflight or apply follows from this amendment.
- SCRUM-77 remains research-only and SCRUM-78 remains visual approval only;
  neither is UI implementation authorization. All UI remains unstarted pending
  its approved direction gate.
