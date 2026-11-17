# Phase 0 research — SCRUM-19

**Status**: In progress; giữ phân biệt quyết định đã duyệt và đề xuất chờ duyệt.
**Date**: 2026-11-15
**Source**: [spec.md](spec.md), constitution 3.0.0 và Jira SCRUM-19/59/60.
Không chạy lại specify; không có schema/runtime V2 để tuyên bố đã kiểm integration.

## Các quyết định đã được duyệt

- Stack/services/schema isolation theo SCRUM-5 và constitution.
- Supabase Cloud PostgreSQL/Auth/Storage; localhost apps/broker, không reset/migrate
  legacy. Quyết định này thay local-only trước đó, không làm lại research từ đầu.
- Chủ dự án chọn monorepo độc lập **`v2/`**, giữ root Vite nguyên trạng tới gói
  dọn legacy; không import/reuse source, CSS, layout, component hoặc asset cũ.
- Spec nghiệp vụ đã Approved, gồm yêu cầu FR-031 thu hồi phiên khi logout và
  đổi/khôi phục mật khẩu; không tự hạ yêu cầu thành chỉ thu hồi refresh token.

## Host discovery — kết quả thật, không phải resource budget đã đạt

| Mục | Kết quả |
| --- | --- |
| OS | Windows 11 Home |
| RAM hữu dụng / trống lúc đo | 15.71 GiB / 4.98 GiB |
| CPU logic | 20 |
| Ổ C trống | 17.76 GiB |
| Ổ D trống | 61.25 GiB |
| Node / pnpm | 24.16.0 / 11.5.0 |
| pnpm warning tại root legacy | `pnpm.overrides` trong package.json bị pnpm 11 bỏ qua; không tự sửa legacy |
| WSL | `wsl --status` exit 1, báo chưa được cài |
| Docker CLI | `Get-Command docker` chưa tìm thấy trong PATH hiện tại |
| Store package tìm được | `26737FrancescoSorge.Dockerun`, version 1.0.2.0 |
| Docker Desktop paths đã kiểm | Không thấy executables ở Program Files hoặc LOCALAPPDATA/Programs/DockerDesktop |
| Supabase CLI | Không trong PATH, không có shim ở root node_modules/.bin |

Không kết luận Dockerun là mã độc hoặc tự gỡ nó. Chưa chứng minh có Docker Engine
tương thích đang chạy; không tự cài WSL, nhận license, đổi BIOS/Windows features,
di chuyển Docker data, sửa `.wslconfig` hoặc restart máy.

Docker docs dẫn bản chính thức tại
<https://apps.microsoft.com/detail/xp8cbj40xlbwkx> và
<https://docs.docker.com/desktop/setup/install/windows-install/>.
Docker có đường cài per-user mới nên đã kiểm cả per-user lẫn all-users.
Ổ C ít trống hơn D: nơi lưu image/VHD phải được chủ máy chọn trước khi pull stack.

## Compatibility research — chỉ đọc npm registry, chưa cài dependencies

Các version đã query tồn tại tại thời điểm nghiên cứu:

| Package | Version | Ghi chú |
| --- | --- | --- |
| next / react | 16.4.6 / 19.3.1 | Node >=20.9, React 19 phù hợp peer Next |
| @nestjs/core/common/platform-express | 12.5.0 | Đồng major; Node đang có đáp ứng floor runtime |
| typescript | 5.9.3 | Candidate pin tương thích ts-jest; không cài TS 7 latest tự động |
| jest / ts-jest | 30.5.2 / 29.4.15 | ts-jest peer chấp nhận Jest 30, TypeScript >=4.3 và <7 |
| @playwright/test | 1.65.1 | Node >=20 |
| supabase CLI | 3.1.0 | Metadata nghiên cứu trước Cloud; không còn prerequisite chạy local Supabase; remote command vẫn cần duyệt riêng |
| @supabase/supabase-js | 2.119.0 | Node >=22 |
| amqplib / pg / jose / zod | 2.3.1 / 8.23.1 / 6.2.17 / 4.6.7 | Candidate cho broker/SQL/JWT/validation, chờ duyệt dependency set |
| tailwindcss / eslint | 4.3.5 / 9.39.1 | Candidate; ESLint 9 đã query tồn tại |

Nest 12 CLI generator mặc định có thể chọn Vitest/oxlint thay stack Jest đã duyệt.
Đề xuất scaffold thủ công tối thiểu, không chạy generator có side effects ngoài
workspace; dùng Jest đúng roadmap. Node >=24.9 cần cho Nest 12 ESM packages khi
dùng Jest theo migration guide; Node 24.16.0 đang có đáp ứng. Version/peers vẫn
phải kiểm bằng install/build/tests ở SCRUM-63, không gọi metadata lookup là PASS runtime.

## Local CLI findings — lịch sử, không dùng cho Cloud default; broker vẫn áp dụng

- CLI v3: `supabase start` thường vẫn dùng Docker; native runtime là experimental,
  không hỗ trợ Windows và không được tự thay cho kiến trúc Docker đã duyệt.
- Không dùng flag/config v2 lỗi thời: mail inbox v3 dùng `[local_smtp]`, không
  dùng `[inbucket]`; local default không thay nghĩa cấm remote/link/deploy.
- Start/stop không reset volume. Không chạy `db reset`, `down --volumes` hoặc
  `stack destroy` để làm setup xanh.
- RabbitMQ publisher confirm và consumer ack là hai việc riêng; confirm không
  chứng minh consumer commit. Cần outbox transaction, publisher confirms,
  manual ack sau consumer commit và idempotency.

## Strict session revocation — owner đã duyệt A

**Finding**: Supabase sign-out thu hồi refresh/session nhưng access JWT có thể còn
hợp lệ tới expiry. Chỉ kiểm signature/expiry hoặc rút ngắn TTL không đủ FR-031.

**Accepted A (owner)**: Next.js server-only BFF, browser chỉ giữ cookie
opaque HttpOnly; Community sở hữu app-session/revocation ledger và gọi supported
Auth APIs. Gateway/business services kiểm quyền đồng bộ qua HTTP; không đọc
`auth.sessions`, không FK/SQL chéo schema, không thêm Redis hoặc service mới.
Không tự enroll app-session chỉ vì có JWT/refresh/recovery callback hợp lệ.

Tradeoff đã duyệt: auth-check không có positive cache, Community lỗi thì private
actions fail-closed (503), còn catalog công khai có thể đọc. Khi đổi/reset mật khẩu
lỗi một phần, giữ trạng thái bảo vệ và không báo thành công giả. Request mới authorize
sau durable revocation bị chặn; request đã authorize trước đó có thể hoàn tất.

Không đọc/ghi Auth internals. Chưa triển khai ledger. Xem
[architecture](../../docs/architecture.md) và [ADR Cloud](../../docs/adr/0001-supabase-cloud.md).

## Cloud transition — hiện tại, không phải runtime evidence

- Project ref owner cung cấp `bdhavbwmxbttymerizvx`; không tự suy API/DB endpoints.
- MCP project-only đã cấu hình `read_only=true`, features docs/database/development.
  Chỉ metadata allowlist; `execute_sql`/migrations/keys và mọi tool khác denied.
- `opencode mcp list` ban đầu **needs authentication**, sau đó **connected**.
  Actual exposed schemas đã đọc trước gọi. `get_project_url` trả
  `https://bdhavbwmxbttymerizvx.supabase.co`; `list_tables` với
  public/catalog/community/notification trả `tables=[]`; `list_migrations`
  trả `migrations=[]`. Không query rows/SQL hoặc secrets. Không suy Auth/Storage
  rỗng; chưa có application PostgreSQL/TLS connection evidence.
- Direct Connect/TLS đã được owner bổ sung 2026-11-16 (xem section dưới).
  Max_connections/reserved đã có owner report ở capacity section cuối file;
  Session pooler metadata, plan và managed-services peak usage chưa có.
  Credentials vào env local ngoài Git theo service, migration principal riêng.
- Owner xác nhận Gmail SMTP `smtp.gmail.com:465`, Google app password ở Dashboard;
  delivery chưa test. Origin `http://localhost:3000`, callback `/auth/callback`,
  reset `/auth/reset-password` đã duyệt, chưa có scaffold/route hoặc Dashboard evidence.
- Không isolated test target; reset/rebuild hai vòng và restore vẫn blocked,
  không lấy project chính rỗng để thay đích. Không tạo project/phí.
- Full Auth/callback/error UI/E2E thuộc SCRUM-26/81/82 sau scaffold, không triển khai ở đây.

## Sources

- <https://nextjs.org/docs/app/getting-started/installation>
- <https://docs.nestjs.com/migration-guide>
- <https://registry.npmjs.org/> — package metadata/peer dependencies, không chạy install.
- <https://supabase.com/docs/guides/local-development/cli/migrating-to-v3>
- <https://supabase.com/docs/guides/local-development/docker-and-native-runtimes>
- <https://supabase.com/docs/guides/local-development/cli/config>
- <https://supabase.com/docs/guides/auth/sessions>
- <https://supabase.com/docs/guides/auth/signout>
- <https://supabase.com/docs/guides/auth/server-side/advanced-guide>
- <https://www.rabbitmq.com/docs/confirms>

Research về strict auth có một lượt agent read-only theo yêu cầu dispatch research
của workflow `speckit.plan`; không cho agent sửa file/Jira hoặc gọi remote Supabase.
Không có hook extension trước/sau plan trong cây `.specify/` đã kiểm.

## Mốc kiểm tra draft trước Cloud — bằng chứng lịch sử

- `setup-plan.ps1 -Json`: thành công, tạo `plan.md` từ resolver; file còn là
  template chuẩn bị, chưa gọi đó là plan đã hoàn tất. `BRANCH` của helper là tên
  feature suy ra, Git thật vẫn `main`.
- `npm test`: PASS 46/46 baseline; `npm run typecheck`: PASS 0 diagnostics/66 files;
  `npm run check:structure`: PASS 73/73 reachable.
- `node specs/003-grabmefood-v2/validate.mjs`: PASS 31 FR/31 mapped/16 checklist/7
  business decisions; validator này không chứng minh architecture draft đã hoàn thiện.
- Node inline kiểm links architecture/research: PASS; `git diff --check`: PASS
  (chỉ warnings LF→CRLF cho các tracked changes có sẵn).
- Chưa chạy setup-tasks/analyze: chỉ được analyze khi có plan/tasks hoàn chỉnh.
- Không sửa application/toolchain/lockfiles/permission config; không cài package,
  scaffold, start/reset stack hoặc sửa remote/global. Architecture draft còn chờ
  câu trả lời về strict session authority trước phần thiết kế phụ thuộc.

Các câu “chờ session authority” trong snapshot trên đã được thay bằng approval A.
Số tests/version/checks snapshot không phải kết quả kiểm sau amendment Cloud.

## Bổ sung SCRUM-59 — 2026-11-16

- Owner cung cấp direct host `db.bdhavbwmxbttymerizvx.supabase.co`, port5432,
  database/user `postgres`. Đây là management connection metadata, không được
  dùng làm shared runtime principal. Runtime roles vẫn theo ownership approved.
- Owner báo SSL enforcement bật, CA tải tại
  `C:\Users\HUY\Downloads\prod-ca-2021.crt`; file chưa đọc/kiểm. Bắt buộc chain+
  hostname verification, `verify-full`/driver-equivalent; không bypass certificate.
- Dashboard owner report: Nano, pool size15/cặp user-database, max pooler clients200.
  Không suy ra subscription plan/max_connections từ Nano hoặc xem200 là DB slots.
- Giữ candidate caps4/4/2 (10 runtime), migration1 riêng; không đổi Cloud config.
  Direct không chịu pooler15/200; session mode kiểm từng role4≤15/4≤15/2≤15.
  Ở mốc ban đầu chưa biết M/U/H; owner capacity evidence bổ sung ở cuối file
  thay gate bằng `P+U+H≤57` và tách reserved slots. Worksheet/scale math ở
  [architecture](../../docs/architecture.md), không plan triển khai song song.
- Official docs phân biệt app pools/pooler clients/PostgreSQL backends, direct
  cần usable IPv6 hoặc IPv4 add-on, session pooler là fallback IPv4. Không mua add-on.
- Actual host check: AAAA lookup thành công; Test-NetConnection theo host thất bại
  ở name resolution, RemotePort0/TcpTestSucceededFalse. Không có TCP/TLS/Auth
  evidence; không kết luận server down hoặc IPv6 mọi môi trường không hỗ trợ.
- Snapshot trước phê duyệt tiếp theo: owner sửa MCP config và báo read/write; URL không read_only, broad
  features, legacy-shaped mcp.supabase; permissions vẫn deny ngoài metadata.
  Không ghi đè user work hoặc vượt deny. Lúc đó tests45pass/2fail, không còn
  được dùng snapshot47pass ngày trước làm baseline hiện tại.
- Owner đề nghị không isolated target; chưa áp dụng exception vào governance
  hoặc destructive runbooks. SCRUM-59 không reset/migration/seed; exact target/
  allowlist/impact/backup confirmation vẫn phải có trước destructive execution.
- Không cài Supabase skills từ đoạn optional, không đọc credentials/CA ngoài repo,
  không implementation/scaffold/remote mutation hoặc thay status Jira.

Nguồn tra cứu chính thức ngày 2026-11-16:

- <https://supabase.com/docs/guides/database/connecting-to-postgres>
- <https://supabase.com/docs/guides/database/connecting-to-postgres/pooling-and-limits>
- <https://supabase.com/docs/guides/database/connection-management>

Một URL SSL riêng `/guides/database/postgres/ssl-enforcement` trả404;
section SSL của connecting-to-postgres ở trên đủ dùng để kiểm chain/hostname.

### MCP reconciliation sau owner đồng ý — 2026-11-16

Owner chấp thuận chuẩn hóa riêng khối MCP về V2 và metadata-only trong SCRUM-59.
`mcp.servers.supabase`, `read_only=true`, project ref cố định và features
docs/database/development đã khớp policy. Không đổi permissions/policies/tests
hoặc `.vscode/`, không cài skills. Fresh RED trước sửa: guardrail7pass/2fail;
GREEN sau sửa: npm test47/47, typecheck0/66, structure73/73, MCP list connected.
Mở write ở task sau cần thao tác/approval cụ thể; không có remote mutation.

## Capacity evidence owner bổ sung — 2026-11-16

**Provenance**: owner chạy SQL chỉ đọc/chụp Dashboard và cung cấp tóm tắt;
AI chưa chạy SQL hoặc xem raw output/screenshot để kiểm độc lập.

- SQL snapshot: max_connections60, superuser_reserved_connections3,
  reserved_connections0; ordinary theoretical ceiling60−3−0=57. Count5 gồm
  authenticator idle1, pgbouncer idle1, postgres active1, supabase_admin idle1,
  supabase_storage_admin idle1. Postgres active có thể là SQL Editor diagnostic,
  không tự trừ nó khỏi count hoặc suy role privileged dùng reserved slot.
- Dashboard snapshot khác: connections8/60, active queries0, idle-in-transaction0,
  blocked queries0, top blocker/longest running không hiển thị. Sessions lọc
  anon/authenticated/postgres; “No active sessions” không có nghĩa toàn DB rỗng.
  Không coi5/8 mâu thuẫn/cùng thời điểm hoặc8 là peak.
- Nano/pooler15 mỗi cặp user-database/clients200 giữ đúng tầng giới hạn;
  chưa biết plan. PostgreSQL60 không phải pooler clients200.
- **Approved provisional trong Gói A**: giữ runtime4/4/2=10 và migration1 khi được duyệt riêng.
  H=12 operational slots (~21% ordinary57), ngoài3 superuser slots đã
  trừ. Buffer cho dao động/reconnect/startup/monitoring, không measured peak
  hoặc yêu cầu chính thức Supabase. Không cấp H để tăng app caps/replicas.
- Gate `P+U+H≤57`; U chỉ other backend sessions chưa tính trong P, không
  double-count app/migration hoặc front-end pooler clients và backend tương ứng.
  P=11/H=12 → U_peak≤34; runtime10 → U_peak≤35. Chưa đo U_peak full workload/
  time series nên chưa PASS; H đã duyệt provisional, phải re-review nếu workload/
  limits thay đổi. Chỉ biết ceiling theo owner report.
- Chi tiết snapshot/workload-review và remaining gates dẫn về
  [capacity worksheet](../../docs/architecture.md), không tạo plan song song.
- Không SQL/MCP query/remote write, không sửa config/limits, không tiến SCRUM-60.

## Gói A review và approval — 2026-11-16

Current Jira/spec/ADR/repo đã được đối chiếu: ownership/session A nhất quán ở
mức thiết kế; root vẫn legacy, chưa v2/scaffold/schema/runtime tests. Owner nói
“tôi duyệt các đề xuất”, duyệt review/provisional budgets và phân chia design59/
runtime sau scaffold. [Architecture](../../docs/architecture.md) ghi review matrix,
provenance, acceptance được duyệt và test obligations theo task hiện tại.

Không chạy lại specify/plan/tasks/analyze, không dùng skill UI hoặc triển khai60.
Local resource targets cũng chỉ approved provisional, không số đo container thật.
Peak/resource/TLS/Auth verification chuyển thành follow-up theo acceptance split
được duyệt, không bị miễn hoặc báo PASS. Plan và Session pooler metadata thiếu
nếu cần fallback vẫn là missing input, không tự ghép endpoint hoặc xin secrets.

### Chốt riêng SCRUM-59

Sau yêu cầu owner hoàn tất, final5/5 design gate được kiểm lại và Jira59 đã
transition Done ngày2026-11-16. Review/research phase0 của toàn SCRUM-19 không
được gọi hoàn tất vì60/contracts/plan/tasks/analyze chưa làm. Runtime/capacity/
TLS/Auth/SMTP/redirect evidence vẫn là follow-ups chưa kiểm, không bị miễn.

## Phase 0 SCRUM-60 — sau approval6/6

Owner trả lời **“Duyệt cả 6”** cho6 đề xuất contracts và gate thiết kế.
[ADR-0002](../../docs/adr/0002-v2-contracts.md) ghi nguyên phạm vi quyết định;
không thay ADR-0001 hoặc spec nghiệp vụ.

| Decision | Rationale | Alternatives considered |
| --- | --- | --- |
| REST/cursor/Problem Details | Boundary chung cho Web/Gateway/owner | Offset và error shape riêng từng API bị loại |
| BFF/ledger + idle24h/absolute7d/context10m | Giữ authority và deadline được duyệt | Browser tokens/JWT-only bị loại theo ADR-0001 |
| Validation/upload proxy limits | DTO và quyền kiểm đồng nhất | Direct upload chưa được duyệt, không sử dụng |
| Authoritative recipient HTTP + durable first decision | Late/replayed events không dùng stale projection hoặc tính recipients lần nữa | Projection-only và re-evaluate retry không đáp ứng approval |
| Retention tách payload/dedup | Replay giữ identity không tạo bản sao | TTL dedup bằng payload30d bị loại |
| Design/runtime acceptance split60 | Tài liệu có thể kiểm trước scaffold | Legacy tests không chứng minh runtime V2 |

Không còn unknown nghiệp vụ cần chạy specify. Hạn chế Cloud chưa có plan/network/
TLS/session-pooler metadata là runtime prerequisites tại65/70/81/111/112 theo
owner-approved split S ngày2026-11-17 (64 giữ offline guards +local/actualCI), không
được thay bằng endpoint đoán. Dependency versions ở bảng lịch sử là candidates,
không phê duyệt cài; SCRUM-63 phải recheck compatibility/owner approval trước install.
Không chạy lại host/Supabase/SMTP probes trong task thiết kế.

### Research dispatch thực tế — receipt crash/retry

Plan workflow yêu cầu dispatch research: một agent read-only đã review
spec/ADR/architecture, không sửa file/Jira/Supabase. Finding: plain eligibility
HTTP rồi inbox commit có crash window tính lại recipients; projection-only
candidates bỏ sót newly saved user. Recommendation: Community immutable receipt
snapshot trước response, full authoritative enumeration, freeze cả empty/pages;
Notification durable intake/import/unique inbox, không transaction qua HTTP.
Owner đã chọn Duyệt cho mốc snapshot/receipt ownership. Receipt/dedup không TTL
theo payload30d. Obligations ở contracts/events.md và tasks62/103/104/108;
không runtime verification.

## Remediation SCRUM-60 — authority mới sau analyze

Analyze trước có C1 critical/U1 high/U2 high/I1 medium, report Jira60 comment10030.
Owner tiếp theo duyệt **remediation cả4 điểm với điều kiện**, tách riêng khỏi6/6:
default reply/mention/restaurant_update/admin_broadcast=true, create-only
reply/mention events; media GET current publication/ledger/owner check và cache
không bypass; fresh proof purpose-bound khi password context expired; parallel
markers tuân Jira, dependencies giữ nguyên. ADR-0002/spec ghi approval mới này.

Design resolution (không research execution/provider test mới): proxy bytes thay
signed private URL, no-store cho cả public media nhằm không cache ảnh thành draft;
reauth mint context mới thay gia hạn expired cookie, encrypted proof custody và
same-operation CAS/fencing, không ordinary session admission. Immutable creation
recipient refs ngăn delayed event lấy mentions từ bản edit để phát thêm.
Không rerun plan/setup-tasks hoặc spawn research agent lần nữa vì artifacts đủ.
Regression guard chỉ kiểm static contract presence/constraint propagation và
marker policy; runtime security tests vẫn thuộc81/82/88/103/104/108/112.
