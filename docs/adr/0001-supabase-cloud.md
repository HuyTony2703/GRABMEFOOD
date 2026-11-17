# ADR-0001 — Supabase Local → Supabase Cloud

- Jira: SCRUM-5 / SCRUM-19 / SCRUM-59.
- Status: **Accepted — topology và ranh giới dưới đây; không phải quyền mutation**.
- Người ghi: coding agent, 2026-11-15.
- Approver: chủ dự án, quyết định “Chuyển từ Supabase Local sang SUPABASE CLOUD”;
  tiếp theo duyệt phương án phiên A và “Đồng ý cả 3 và nhớ update những thứ cần thiết lên jira”.
- Nguồn nghiệp vụ: [spec V2](../../specs/003-grabmefood-v2/spec.md), không đổi 31 FR.

## Context và options

SCRUM-59 mới có draft; chưa có scaffold/schema/migration V2. Local Supabase
trước đây yêu cầu thêm runtime/tài nguyên máy; Docker/WSL chưa sẵn sàng được
kiểm chứng. Owner chọn Cloud thay vì tiếp tục Local hoặc self-host. Giữ research
và evidence Local như lịch sử, không chạy lại specify.

## Decision

Cloud project owner chỉ định: `bdhavbwmxbttymerizvx`, phục vụ PostgreSQL/Auth/
Storage. Owner nói project rỗng; MCP metadata xác nhận không có bảng trong
public/catalog/community/notification và migrations rỗng, không suy Auth/Storage
rỗng. API URL thực `https://bdhavbwmxbttymerizvx.supabase.co`. Web Next.js, Gateway,
Catalog, Community, Notification và RabbitMQ chạy localhost trong monorepo mới
`v2/`. Docker còn dùng cho local components; không start Supabase Local mặc định.
Không tạo/xóa project, không bắt trả phí/deploy, không xóa môi trường cũ.

Business schemas `catalog`/`community`/`notification` và runtime DB roles riêng.
Không cross-service business SQL/join/FK. Frontend business APIs qua Gateway.
Migration credential tách runtime; không dùng postgres/service_role chung cho services.
Direct PostgreSQL role không ngầm có `auth.uid()`; backend kiểm quyền bắt buộc.

Session A: Next server-only BFF, browser chỉ có opaque HttpOnly cookie;
Community giữ session/revocation ledger và token server-side. Authorization
đồng bộ fail-closed, không positive cache/broker làm nguồn quyền. Không SQL Auth
internals/Redis/service mới. Request được authorize sau durable revocation bị
chặn; request đã authorize trước đó có thể xong. Partial credential-operation
failure phải giữ bảo vệ, không khôi phục phiên hoặc báo thành công giả.

## Consequences và verification

- Internet/Cloud latency, project availability/pausing, plan quotas, connections,
  Auth/email/storage/egress limits trở thành prerequisites demo. Gói/limits thực tế
  chưa biết; không bịa số hoặc gọi metadata check là kết nối DB thành công.
- Direct hay session pooler phải lấy từ Dashboard Connect thật và kiểm tương
  thích IPv4/IPv6/driver/TLS/role; không suy host/port/user từ ref.
- Pool budget theo service và tổng Cloud connections phải được đo ở task hạ tầng;
  TLS xác thực certificate, secrets ở local env riêng ngoài Git, không log DSN.
- Auth Site URL mong muốn `http://localhost:3000`; callback
  `http://localhost:3000/auth/callback`; reset UI
  `http://localhost:3000/auth/reset-password`. Dashboard chưa kiểm/đổi.
- Owner đã cấu hình Gmail SMTP `smtp.gmail.com:465` với Google app password;
  không copy vào code/env frontend. Delivery chưa kiểm. Default SMTP không là
  fallback được coi chắc chắn hoạt động; kiểm provider/rate limits trước demo.
- Storage buckets/policies/bootstrap idempotent dùng supported APIs, không sửa
  system internals. Bypass Data API/Storage/private-data paths phải bị kiểm.
- Startup không migration/seed/reset. Các thao tác remote kể cả không destructive
  phải xin riêng target/allowlist/impact. Migration đã áp dụng không viết lại.
- Rebuild hai vòng/restore chỉ trên isolated target đã định danh và duyệt riêng.
  Owner không yêu cầu project thử khác, nên gate này **blocked**, không đổi đích
  sang project chính hoặc miễn test.
- MCP repo-only `read_only=true`, project-scoped; chỉ metadata được allowlist,
  arbitrary SQL/mutation/key retrieval denied. OAuth ở `/mcps`, ngoài repo.

## Follow-up theo task hiện có

### Bổ sung evidence 2026-11-16 — không mở quyền execution

Owner cung cấp direct endpoint `db.bdhavbwmxbttymerizvx.supabase.co:5432`,
database/user `postgres`; đây không phải shared runtime credential được duyệt.
SSL enforcement đã bật theo owner, CA local đã tải nhưng chưa kiểm. Client phải
verify certificate chain/hostname (`verify-full` hoặc driver-equivalent).

Owner Dashboard report Nano/pool size15 mỗi cặp user-database/max pooler clients200.
Ban đầu chưa biết PostgreSQL max_connections; owner SQL evidence bổ sung bên dưới.
Plan/managed peak usage vẫn chưa biết. Caps đề xuất
4+4+2 runtime, migration1 riêng không tự thay Cloud settings; xem worksheet trong
[architecture](../architecture.md). Aggregate capacity còn chưa xác minh.

Owner báo MCP read/write và đề nghị bỏ isolated test target. Trước phê duyệt sau, config MCP đã
đổi nhưng tool deny còn nguyên, khác policy/tests. Không tự revert user work,
không apply reset exception hoặc vượt deny. Governance hiện vẫn yêu cầu isolated
target; cần review amendment và target-specific impact/allowlist/backup confirmation
trước destructive execution. Task SCRUM-59 không cần destructive operations.

Owner sau đó đồng ý chuẩn hóa MCP V2 và giữ metadata-only trong SCRUM-59.
Khối MCP repo đã dùng `mcp.servers.supabase`/project ref cố định/`read_only=true`,
features docs/database/development; permissions/policies/tests không đổi.
Blocker cấu hình được gỡ, không mở quyền ghi hoặc áp dụng ngoại lệ destructive.

### Owner capacity evidence bổ sung — budget provisional, chưa runtime acceptance

Owner chạy SQL read-only báo max_connections60, superuser_reserved_connections3,
reserved_connections0, current_client_connections5. Dashboard snapshot khác8/60;
không lấy5/8 làm peak hoặc kết luận mâu thuẫn. AI chưa kiểm độc lập. Ordinary
ceiling lý thuyết57 không phải app allocation; pooler clients200 không là DB slots.

[Worksheet](../architecture.md) giữ P=10 runtime, tối đa1 migration nếu duyệt;
H=12 operational slots **ngoài**3 reserved slots đã được owner duyệt provisional
trong Gói A; không thay Cloud config hoặc cấp execution.
Gate `P+U+H≤57`, U là other backends không gồm app/migration đã tính P.
Với P=11/H=12 cần U_peak≤34, chưa có peak evidence nên **chưa capacity PASS**.
Đây là provisional budget/evidence bổ sung, không thay Accepted topology, không đổi settings/
plan/permissions hoặc mở quyền SQL/write. Review workload/resource/network/TLS
và full Auth/SMTP/redirects vẫn còn.

### Gói A — owner approval phân chia acceptance

Owner xác nhận **“tôi duyệt các đề xuất”** trong hội thoại ngày2026-11-16, sau
review Gói A tại [architecture](../architecture.md). Chấp thuận ranh giới/session
đã duyệt và provisional DB caps4/4/2, migration1 chỉ khi được duyệt riêng, H12,
cùng local resource targets/guards. Đây không phải measured capacity/resource PASS.

SCRUM-59 nghiệm thu **thiết kế/provisional budget/provenance/risk và follow-up
test obligations**, không buộc full-workload evidence trước khi scaffold tồn tại.
Runtime checks không bị miễn:64 preflight/connectivity/TLS/resource readiness;
70 isolation/grants;107/108 journeys/revocation/fault;111 full-workload/capacity/
performance;112 security/operations audit. Task/credentials/schema prerequisites
và approval remote vẫn áp dụng, không khởi động các task đó ở lượt này.

Session A/strict revocation và privilege boundaries giữ nguyên. Không authorise
SQL, browser tokens, JWT-only authorization hoặc remote mutation. Plan/Session
pooler Connect metadata và runtime evidence còn thiếu phải theo dõi thật, không
được ghi như đã có vì approval. Không tự transition Jira hoặc chuyển SCRUM-60.

### Task follow-up giữ nguyên

SCRUM-59 đã hoàn tất review C4/ownership/trust/provisional budget và Done theo
final design gate verification ngày2026-11-16. SCRUM-60 khóa contracts/
data model/plan/tasks/analyze; hiện chưa thực hiện. SCRUM-21/63/64 scaffold và Cloud
preflight/CI. SCRUM-35 và các tasks con provisioning, migration, grants, Auth/Storage,
seed/rebuild giữ acceptance gates và phê duyệt remote riêng. SCRUM-26/81/82 full
Auth và E2E sau scaffold; SCRUM-10/31/7/8 integration/security/demo/runbooks.

### Tiếp nối SCRUM-60

Owner sau đó giao riêng60 và duyệt6 contract proposals + recipient receipt
clarification. [ADR-0002](0002-v2-contracts.md) ghi authority mới này;
“chưa thực hiện60” ở snapshot trước không là cấm task đã giao.
Topology/session A/Cloud constraints ở ADR này không thay đổi.
