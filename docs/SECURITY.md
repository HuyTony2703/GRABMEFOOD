# Security design — GrabMeFood

**Trạng thái:** DRAFT nhóm 2; ma trận và cơ chế dưới đây là đề xuất, chưa áp Cloud.
Nguồn quyền nghiệp vụ: [PRD](PRD.md), [DOMAIN](DOMAIN.md).
Nguồn schema: [DATABASE](DATABASE.md); giao diện: [API](API.md).

## 1. Nguyên tắc và trust

- Không tin browser dù màn hình là admin. Kiểm tra authorization ở DB/Spring theo đường gọi thực.
- Dữ liệu công khai chỉ là nội dung khả dụng; dữ liệu cá nhân mặc định deny.
- Supabase Auth quản lý password, email verification, recovery, Google OAuth; không tự thay thế.
- Publishable key không là user JWT; secret/legacy service_role chỉ server. Không phát secret cho admin browser.
- Grants quyết định thao tác có thể gọi; RLS quyết định row; CHECK/FK/column grants bảo vệ shape/trường bất biến.
- Trạng thái active/admin đọc từ DB hiện tại, không user_metadata và không JWT claim cũ làm nguồn duy nhất.
- Không suy từ policy tồn tại ra quyền đã đúng; bắt buộc test truy cập chéo và phiên bị khóa.

## 2. Ma trận quyền đề xuất

`Own` luôn gồm active account; tài khoản blocked/deletion_pending chỉ còn quyền đọc public như khách.

| Tài nguyên / thao tác | Khách | User active | Admin active |
| --- | --- | --- | --- |
| Nội dung khả dụng | Đọc | Đọc | Đọc |
| Nội dung ẩn/payload quản trị | Không | Không | Đọc/ghi qua admin surface |
| Nội dung đã xóa | Không | Marker own, không payload | Không khôi phục payload từ API |
| Collection/saved | Không | Own | Own; không quyền đọc tất cả bộ riêng |
| Comment public | Đọc nếu target khả dụng | Đọc + gửi | Đọc + gửi |
| Sửa comment/reply | Không | Own body | Own body, không sửa của người khác |
| Xóa comment/reply | Không | Own | Mọi người |
| Profile riêng | Không | Own | Không mặc định đọc mọi profile ngoài account admin projection |
| Notification/read_at | Không | Own read, đổi trạng thái đọc | Own; gửi qua Spring |
| Notification payload/recipient | Không | Không tự ghi | Chỉ server/RPC đã được kiểm tra quyền |
| Role/account state | Không | Không ghi | Chỉ Spring operation; không direct update |
| Khóa/mở/xóa account | Không | Không | Spring; ràng buộc admin/self còn chờ duyệt |
| Upload ảnh nội dung | Không | Không | Theo Storage policy kiểm tra admin hiện tại |

Không có public collections, user tạo quán, sửa role hoặc xóa user tự phục vụ được xác nhận.

## 3. RLS/grants theo nhóm bảng

- `catalog_items`: khách/user đọc row khả dụng hoặc owner marker ID tối thiểu; admin active có
  ngoại lệ đọc toàn registry để quản trị nội dung ẩn. Registry không chứa payload.
  Owner marker không trao quyền đọc restaurant/dish hidden; ngoại lệ admin không trao quyền collection người khác.
- `restaurants/dishes/articles/selections`: read public khi available; admin read rộng nhưng active check.
  Dish policy phải kiểm tra cha; translation/media/selection membership không được tạo đường vòng lộ hidden.
- `collections`: SELECT/INSERT/UPDATE(name)/DELETE own, không UPDATE owner/kind; các thao tác chưa duyệt OQ-07
  chưa đưa vào migration. `saved_items`: SELECT/DELETE own; INSERT chỉ RPC có kiểm tra target.
- `comments`: public đọc target available; mọi mutation qua RPC, không grants trực tiếp để tránh bỏ notification.
- `profiles`: owner-only; projection tên tác giả public chỉ tên cần cho comment, không email.
- `notifications`: SELECT own+active, UPDATE chỉ read_at; revoke INSERT/DELETE và UPDATE payload từ client.
- `notification_signals`: SELECT own+active, không client ghi. Không trả notification text qua Realtime.
- `private.account_access/operations/event_receipts`: không Data API expose, không client table grants.
- Mọi view public phải review `security_invoker=true` trên PostgreSQL 17; không assume views áp RLS mặc định.
- Tránh policy đệ quy: helper private actor_active/admin đọc account_access bằng quyền đủ,
  không để account policy đọc ngược vào chính bảng.

### Database functions

Exposed wrapper invoker chỉ gọi helper private với `search_path` cố định và tên fully qualified.
Helper definer mặc định revoke EXECUTE PUBLIC/anon/authenticated, grant đúng caller được phép theo chức năng.
Function của user không nhận actor ID để chọn user khác; lấy `auth.uid()` và kiểm tra state trong body.
Function server-only grant chỉ role tương ứng privileged context; vẫn kiểm tra verified actor.
Không dùng SQL động từ input để chạy table/column tùy ý.
Các helper dùng trong RLS cần EXECUTE/USAGE phù hợp; không revoke bừa rồi làm hỏng policy.
Không sửa default privileges hoặc function tồn tại ngoài scope migration được duyệt.

## 4. Khóa, xóa và quyền còn trong JWT

[User management](https://supabase.com/docs/guides/auth/managing-user-data) nêu:
ban không thu hồi session hiện có; xóa user không làm access token cũ hết hạn ngay.
Vì vậy đề xuất:

1. App gate `private.account_access` có FK Auth; thiếu row hoặc không active đều deny thao tác cá nhân.
2. Tất cả RLS/RPC và Spring dùng gate, không chỉ `auth.uid()!=null`.
3. Spring lock đặt blocked trước gọi Auth ban; Auth lỗi thì giữ blocked và báo partial, không tự rollback
   sang active rồi mở lại dữ liệu. Unlock chỉ đặt active sau Auth unban thành công.
4. Delete dùng pending gate, dọn Storage ownership hợp lệ, gọi Auth Admin hard delete và kiểm tra cleanup.
5. Token cũ chỉ còn đọc dữ liệu public; không còn đọc saved/notifications hoặc ghi comment.

Đây là thiết kế đề xuất cần test nhiều tab/token cũ. Không tuyên bố chặn Auth token issuance khi bước
Auth ban đang lỗi; phần “chặn đăng nhập” hoàn chỉnh chỉ đạt khi cả Auth và app gate được kiểm chứng.
Không cần mua tính năng single-session/timeouts để thay app authorization.

## 5. Realtime riêng tư

Khuyến nghị Postgres Changes trên bảng tín hiệu tối thiểu thay vì broadcast payload notification:

- RLS signal: current user active và user_id đúng caller; client filter chỉ là tối ưu, không security boundary.
- Chỉ INSERT/UPDATE; không publish DELETE chứa old row riêng tư.
- Không đưa email, comment body, notification body vào tín hiệu.
- Nhận tín hiệu thì Data API refetch theo quyền hiện tại; không cho update trực tiếp bằng payload socket.
- Test A subscribe filter B, token cũ sau khóa, reconnect, refresh token và delete user.
- Không giả auth cache của Broadcast/Presence tương đương Postgres Changes. Chưa dùng private broadcast.
- Nếu test chứng minh tín hiệu còn tới token bị khóa, không được suy thành đọc được inbox; vẫn phải
  phân loại leak metadata và sửa trước nghiệm thu theo threat model đã duyệt.

## 6. Storage và upload — quyết định chưa chốt

| Lựa chọn | Lợi ích | Rủi ro |
| --- | --- | --- |
| Bucket public cho ảnh minh họa | Dễ browser/OG, CDN hiệu quả, không thêm media proxy | Ẩn bài không thu hồi public URL/ảnh cache; ai biết URL còn đọc được |
| Bucket private + policy + URL hạn ngắn | Hạn chế origin access theo nội dung/quyền | Signed URL không thu hồi riêng ngay, preview URL hết hạn; thêm lượt ký |
| Private + server public image route kiểm tra trạng thái | URL ổn định cho OG và kiểm tra trước trả ảnh | Thêm vai trò Spring/renderer và băng thông runtime; phải duyệt, không mặc định |

**Chưa chọn** (G2-P07). Nội dung ẩn không được tự chuyển thành bí mật tuyệt đối nếu ảnh từng công khai;
phải thống nhất phạm vi “ẩn” và cache trước duyệt.
Không tạo bucket trong giai đoạn này.

Các điều kiện upload đề xuất chung:

- Admin active mới được upload; tên object do app sinh UUID, không overwrite asset chung.
- Chỉ JPEG/PNG/WebP; cần kiểm tra MIME/chữ ký file, kích thước, số pixel; không SVG/HTML executable.
  Storage policy và MIME khai báo không chứng minh byte ảnh an toàn.
- Đề xuất tối đa 5 MB/ảnh và kích thước cạnh dài 2560 px; giá trị chờ duyệt.
- Path gắn item/asset và uploader theo thiết kế; không tin owner_id browser gửi.
- Metadata nguồn/giấy phép/AI và alt vi/en; không nhập raw iframe/HTML trong caption.
- Upload xong DB link lỗi tạo orphan: có operation cleanup explicit, không xóa object tùy tiện.
- Xóa payload DB không tự xóa object Storage; chỉ xóa asset không còn references và qua Storage API.
- Không tự sửa/xóa trực tiếp bảng `storage.objects` bằng SQL.
- Auth user sở hữu Storage object có thể không xóa được: workflow phải xử lý trước và không báo thành công giả.

### Kiểm tra byte ảnh — G2-P12, chưa chọn

Hai phương án thực tế cần duyệt trước khi chốt upload:

1. Browser upload vào vùng private cách ly trên Storage; Spring đọc đúng object theo asset ID,
   kiểm tra byte/decode/pixel rồi chuyển thành object đích bất biến trước khi cho gắn nội dung công khai.
   Upload vẫn trực tiếp Supabase; Spring bổ sung validation, không thay Storage hoặc xây transformer.
   Cần state pending/validated/rejected, chặn overwrite object đã duyệt, policy không đọc ảnh pending,
   kiểm tra hash/version để tránh thay byte sau validation và cleanup orphan có kiểm soát.
2. File đi qua Spring để kiểm tra rồi upload Storage. Đơn giản hóa trạng thái nhưng tăng băng thông/
   bộ nhớ và thay đường upload đã đề xuất; phải duyệt thay đổi trách nhiệm này.

Chưa có phương án nào được chọn; bucket/staging state/API finalize không được coi là đã chốt.
Client-side validation chỉ hỗ trợ UX, không là evidence kiểm tra server.
Nếu quyết định chỉ kiểm tra MIME/size phía Storage thì phải ghi rõ giảm cam kết kiểm tra byte,
không giữ nguyên acceptance “signature/pixel đã bảo vệ” mà không có thành phần thực hiện.

## 7. Browser, content và server hardening

- Bình luận plain text, escape output; bài viết Markdown sanitizer không raw HTML/script/event handlers.
- URL allowlist cho map/embed/ảnh; không `javascript:`/`data:` tùy ý. Iframe title rõ, không che attribution Google.
- Link ngoài có rel phù hợp; redirect sau Auth chỉ local path allowlist.
- CORS Spring theo origin dev/test được duyệt, không `*` với credentials.
- Bearer API không dùng cookie ngầm; nếu chọn cookie SSR/session thì phải thiết kế CSRF/SameSite riêng.
- CSP phải phù hợp map iframe và media provider, không thêm `unsafe-eval` chỉ để vượt lỗi.
- Không log token/cookie/password, không public Actuator env/heapdump hoặc raw provider error.
- Rate limit/comment abuse: cần đề xuất thông số ở nhóm test/vận hành; không tự thêm Redis/captcha tính phí.
- Role promotion/demotion và bootstrap admin không là endpoint công khai mặc định.

## 8. Kiểm thử bắt buộc trong kế hoạch sau baseline

| Nhóm | Negative/positive evidence cần có |
| --- | --- |
| Public content | Hidden/deleted không đọc qua tables, views, joins, RPC, SSR hoặc cache được quản lý |
| Private | A/B allow/deny SELECT/INSERT/UPDATE/DELETE, unchanged-row proof khi deny trả 0 rows |
| Privilege escalation | Sửa owner/role/state/recipient, gọi server-only RPC bằng user key đều thất bại |
| Comment | Không đổi author/parent/target; không reply nhiều tầng; admin không sửa lời người khác |
| Account | Old JWT sau lock/delete bị chặn dữ liệu riêng và ghi; ban upstream lỗi không báo full success |
| Notification | Subscribe A/B, forge recipients/events/read_at, retry không nhân đôi |
| Storage | Nonadmin/blocked upload denied; spoof MIME/oversize/path overwrite; cleanup shared asset không xóa nhầm |
| Server | Invalid issuer/audience/expired token, fail-closed JWKS/Auth outage, admin role thay đổi |

Đây là tiêu chí thiết kế, chưa test nào được chạy. Chiến lược và lệnh test thuộc nhóm 3/kế hoạch.

## 9. Nguồn

- [RLS](https://supabase.com/docs/guides/database/postgres/row-level-security)
- [API security](https://supabase.com/docs/guides/api/securing-your-api)
- [Database functions](https://supabase.com/docs/guides/database/functions)
- [JWT](https://supabase.com/docs/guides/auth/jwts)
- [Postgres Changes](https://supabase.com/docs/guides/realtime/postgres-changes)
- [Storage downloads/signed URL revocation](https://supabase.com/docs/guides/storage/serving/downloads)
