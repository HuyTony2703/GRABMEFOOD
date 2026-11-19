# ADR-0002 — Contracts và gate thiết kế SCRUM-60

- Status: **Accepted — 6 đề xuất được owner trả lời “Duyệt cả 6”** ngày2026-11-16.
- Phạm vi: contracts/kế hoạch; không quyền scaffold, cài dependency hoặc remote action.
- Tiền nhiệm: SCRUM-59 Done; [ADR-0001](0001-supabase-cloud.md) giữ nguyên.
- Business source: [spec V2](../../specs/003-grabmefood-v2/spec.md), không thêm FR.
- Stack execution location is amended by [ADR-0003](0003-vite-spring-stack.md).
- Security/session implementation is amended by the owner-approved student-project
  baseline dated 2026-11-19. It supersedes Decision 2 and advanced custom
  session/revocation mechanics where they conflict; account/product behavior,
  service boundaries, TLS, server-side secrets, validation and basic authorization
  remain.

## Decision được duyệt

1. REST JSON `/api/v1`; cursor opaque mặc định20/tối đa50, thứ tự có ID làm khóa
   phụ. Cursor gắn filters/sort, không cam kết snapshot bất biến. Problem Details
   có mã lỗi ổn định/request ID, không lộ dữ liệu riêng.
2. Gateway is the browser-facing BFF and validates Supabase Auth JWTs. Supabase
   Auth owns credentials and account/session behavior. Keep the approved secure
   browser cookie edge, CSRF protection for cookie-authenticated mutations, and
   service credentials/basic authorization. Do not build a Community session
   ledger, token custody, refresh fencing, or durable global revocation. Logout,
   expiry and password recovery follow Supabase Auth-supported behavior; do not
   claim immediate global invalidation beyond provider guarantees.
3. Display name2–60 ký tự; handle3–30 ASCII thường/số/`_`, chọn một lần;
   comment1–2.000 ký tự/tối đa10 mentions; broadcast title120/body2.000 ký tự;
   ảnh JPEG/PNG/WebP≤5 MiB qua BFF/Gateway/owner, không browser direct upload.
4. Notification gọi HTTP Community quyết định authoritative saved/preferences
   tại bước quyết định recipient; projection chỉ là hỗ trợ tìm ứng viên.
   Lần xử lý đầu lưu quyết định bền vững, retry/replay không tính thêm recipients.
   Community lỗi thì hoãn, không dùng stale projection thay authority.
5. V2 không tự xóa inbox/tombstone comment/moderation audit/dedup keys.
   Outbox đã phát giữ30 ngày; payload lỗi/DLQ giữ30 ngày; replay thủ công sau xử
   lý nguyên nhân, giữ event ID. Replay quá hạn cần quy trình riêng.
   Không chạy cleanup/replay trong SCRUM-60.
6. Gate60 là design contracts/data model/traceability/static validation/analyze
   read-only. Runtime constraints/permissions/session/fault tests được lập tasks
   tại Jira tương ứng; chưa tồn tại thì không yêu cầu runtime hoặc ghi đã PASS.

## Ngoại lệ v1 có phạm vi — Catalog draft-first, 2026-11-17

Owner chấp nhận **BREAKING CHANGE so với bản thiết kế v1 cũ** trước implementation:
tạo dish/restaurant draft trước, upload chỉ định owner, attach sau; publish không
bắt buộc ảnh. Chi tiết tại HTTP/data-model. Đây không backward-compatible với
create `mediaIds` nonempty hoặc upload không có owner. Rule versioning chung không
đổi và ngoại lệ này không áp cho thay đổi khác.

Evidence: local V2 scaffold chỉ health/diagnostic, repo search không tìm thấy client
ba POST cũ. Owner xác nhận **theo hiểu biết** chưa triển khai V2 cho người dùng
và chưa tạo/cho phép external clients/services/integrations dùng ba POST cũ;
không phải independent verification mọi hệ thống bên ngoài. Nếu phát hiện consumer
cũ, dừng và trình phương án chuyển đổi. Không ghi đã kiểm mọi môi trường.

## Rationale và alternatives

- Cursor thay offset để có thứ tự tiếp nối xác định, không hứa stable snapshot
  khi dữ liệu đổi. Problem Details thay error shape tùy endpoint.
- Supabase Auth is authoritative for account/session identity; Gateway validates
  provider JWTs. No custom ledger or stronger revocation guarantee is implied.
- Proxy upload thay direct signed upload để không mở bypass private authorization.
- Recipient decision bền vững thay re-evaluate mỗi retry; HTTP authority thay
  projection eventually consistent khi xác định ai được nhận.
- Retain dedup keys thay xóa theo tuổi payload, tránh replay sinh bản sao.
- Design/runtime split tránh yêu cầu DB/service chưa tồn tại để nghiệm thu tài liệu.

## Consequences

Các chi tiết protocol/schema bên [contracts](../../specs/003-grabmefood-v2/contracts/README.md)
là thiết kế dẫn xuất từ6 quyết định, phải được analyze; không phải runtime evidence.
Contract không tự cấp permission SQL/Auth/Storage hoặc thay Cloud settings.
Giới hạn của provider nếu chặt hơn phải được kiểm ở preflight/Auth tasks; không
tự sửa Dashboard hoặc hạ certificate verification.

## Clarification recipient receipt — owner duyệt tiếp

Owner chọn **“Duyệt (Recommended)”** khi được hỏi về crash giữa Community HTTP
response và Notification commit. Community lưu immutable recipient receipt theo
event ID trước khi trả HTTP; snapshot bền vững này là mốc “lúc xử lý”.
Bỏ lưu/tắt nhóm trước mốc bị loại; thay đổi sau mốc không hủy delivery đang chờ
materialize. Quyết định0 recipients cũng phải bền vững và được reuse.
Community enumerates nguồn có thẩm quyền đầy đủ; projection không được loại
người vừa lưu vì event projection tới trễ. Receipt thuộc schema Community,
inbox/read state thuộc Notification; không distributed transaction/cross-schema SQL.

## Remediation approval — riêng biệt với approval6/6

Owner xác nhận **“Tôi duyệt remediation cả 4 điểm”** trong lượt tiếp theo ngày
2026-11-16, sau report C1/U1/U2/I1. Đây là approval mới, không hồi tố thành
phần của “Duyệt cả 6”; report ban đầu giữ nguyên như evidence lịch sử.

1. Mặc định bật bốn nhóm **reply, mention, cập nhật quán đã lưu, broadcast quản
   trị**. Reply/mention chỉ phát khi tạo comment/reply, không phát lại khi sửa,
   kể cả thêm/đổi mentions. Preferences lúc recipient decision vẫn theo receipt.
2. Media GET proxy phải xác định published/draft/avatar và quyền đọc tại owner;
   không proxy/cache/private Storage URL bypass. Public catalog chỉ media ready
   đang gắn content published; draft/unattached Catalog chỉ Admin sau ledger check;
   avatar công khai chỉ bản sanitized đang gắn profile, chưa gắn chỉ chính chủ.
   Không admin override để đọc avatar riêng của user khác.
3. Password operation resume sau context expiry cần proof **mới, còn hiệu lực,
   đúng purpose**, bind account/operation; recovery không cấp normal app-session,
   không phục hồi old generation. Supported provider APIs, không SQL internals.
4. Bỏ các parallel markers/ví dụ vượt package Jira; không sửa dependencies.

Only SCRUM-60 spec/contracts/plan/tasks/docs related; no runtime/remote changes.
Owner yêu cầu checks + read-only analyze lại và báo remaining findings, **không
tự Done vì remediation được duyệt**. Không upload Atlassian Artifacts khi chưa
có đồng ý riêng.
