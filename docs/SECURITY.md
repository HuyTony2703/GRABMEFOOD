# Security design — GrabMeFood

> B1: shared read-only permission helper, HTTPS/HMAC và private staging→public ảnh đã được duyệt.
> Chi tiết grants/role/token/retention chưa được kiểm chứng; không có quyền apply Cloud.

**Trạng thái:** DRAFT nhóm 2; ma trận và cơ chế dưới đây là đề xuất, chưa áp Cloud.
Nguồn quyền nghiệp vụ: [PRD](PRD.md), [DOMAIN](DOMAIN.md).
Nguồn schema: [DATABASE](DATABASE.md); giao diện: [API](API.md).
**Bản chỉnh 5 service:** quyền browser, quyền user trong từng service và service identity là ba lớp khác nhau.
Không coi năm process dùng chung service_role là isolation. Data API/RPC priority đã chọn,
cơ chế thực thi role qua Data API vẫn là GATE-01, không tự đổi sang JDBC.

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
| Nội dung ẩn/payload quản trị | Không | Không | Đọc/ghi qua Catalog API |
| Nội dung đã xóa | Không | Marker own, không payload | Không khôi phục payload từ API |
| Collection/saved | Không | Own qua Collection | Own; không quyền đọc tất cả bộ riêng |
| Comment public | Community xác minh target khả dụng | Đọc + gửi qua Community | Đọc + gửi qua Community |
| Sửa comment/reply | Không | Own body | Own body, không sửa của người khác |
| Xóa comment/reply | Không | Own | Mọi người |
| Profile riêng | Không | Own | Không mặc định đọc mọi profile ngoài account admin projection |
| Notification/read_at | Không | Own read; mark-read qua Notification | Own; gửi qua Notification |
| Notification payload/recipient | Không | Không tự ghi | Chỉ server/RPC đã được kiểm tra quyền |
| Role/account state | Không | Không ghi | Chỉ Account Administration operation |
| Khóa/mở/xóa account | Không | Không | Account Administration; không tự khóa/xóa hoặc admin active cuối |
| Upload ảnh nội dung | Không | Không | Direct private staging, Catalog validate/finalize, public ảnh hợp lệ |

Không có public collections, user tạo quán, sửa role hoặc xóa user tự phục vụ được xác nhận.

## 3. Ownership, RLS và quyền kết nối

- Catalog có quyền ghi schema Catalog; Collection/Community/Notification/Account Administration tương tự.
  Không SELECT bảng nghiệp vụ owner khác để composition, không cross-owner writes/joins/FK/cascade.
- `catalog_items/restaurants/dishes/articles/selections`: browser chỉ SELECT façade khả dụng.
  Catalog admin API kiểm tra active/admin trước đọc rộng hidden; không mở admin write grant cho browser.
- `collections/saved_items`: không browser direct writes. Collection xác minh ownership/type và availability
  qua Catalog; marker nằm reference riêng, không trao quyền đọc hidden payload Catalog.
- `comments`: Community API kiểm tra target Catalog authoritative; không expose raw comment table/RPC write
  cho client để bỏ qua target check/event workflow.
- `profiles/account_access`: Account Administration sở hữu; không raw profile join để hiện tên tác giả.
- `notifications`: read-only façade own+active; revoke mọi client INSERT/UPDATE/DELETE. Notification API
  cập nhật read_at sau kiểm tra ownership; payload/recipient chỉ service ghi.
- `notification_signals`: SELECT own+active, không client ghi hoặc trả notification text.
- Outbox/receipt/operation của từng owner không Data API exposed, không client table grants.
- Invoker views trên PostgreSQL 17 cần grants underlying và RLS tương ứng; chỉ views/projections owner
  cho phép, không expose private data qua definer view. Không tự đổi settings.
- Scoped JDBC role không tự có `auth.uid()` như user JWT. Service xác minh caller, set context transaction
  an toàn nếu cần RLS hoặc kiểm tra quyền trong service/owned SQL; không tin `userId` trong body.
- Không chia sẻ ORM entities, migrations hoặc role có quyền write cả năm schema như tiện ích chung.

### Credential isolation — Data API/RPC priority đã duyệt, GATE-01 chưa vượt

Secret API keys Supabase khác tên vẫn có thể cùng map vào `service_role`, bypass RLS và quyền rộng.
Chỉ tách biến môi trường không tạo isolation giữa service.
Ưu tiên khảo sát Data API/RPC với owner-role/EXECUTE scope thật, không tăng đặc quyền để làm test pass.
Nếu không đạt, báo blocker và trình lại phương án; JDBC chưa được chọn làm fallback.
Không tự tạo service Auth accounts, custom JWT issuer/signing keys hoặc role trên Cloud.
HMAC inter-service không tự biến thành Supabase JWT role. Cần kiểm thử hai boundary riêng.
Auth Admin secret chỉ Account Administration. Storage đặc quyền nếu cần thuộc Catalog với scope đã duyệt;
khả năng hạn chế Supabase Storage credential thực tế phải kiểm chứng, không gọi global key là least privilege.

### Database functions

Chỉ public search/read surface có thể exposed. Mutation RPC/SQL nội bộ thuộc owner, không browser gọi trực tiếp.
Exposed wrapper nếu có dùng invoker; helper definer schema không exposed, `search_path` cố định/fully qualified.
Helper definer mặc định revoke EXECUTE PUBLIC/anon/authenticated, grant đúng caller được phép theo chức năng.
Function browser không nhận actor ID để chọn user khác; lấy `auth.uid()` và kiểm tra state.
Owned transaction do service gọi dùng verified actor context và scoped role, không coi JDBC tự mang JWT claims.
Function server-only grant chỉ role owner/consumer cho phép; kiểm tra caller user và service identity theo đường gọi.
Không dùng SQL động từ input để chạy table/column tùy ý.
Các helper dùng trong RLS cần EXECUTE/USAGE phù hợp; không revoke bừa rồi làm hỏng policy.
Không sửa default privileges hoặc function tồn tại ngoài scope migration được duyệt.

## 4. Khóa, xóa và quyền còn trong JWT

[User management](https://supabase.com/docs/guides/auth/managing-user-data) nêu:
ban không thu hồi session hiện có; xóa user không làm access token cũ hết hạn ngay.
Vì vậy đề xuất:

1. Account Administration sở hữu account gate; không FK Auth cascade xuyên owner.
   Thiếu row hoặc không active đều deny thao tác cá nhân.
2. Mỗi service/RLS dùng authorization contract hiện tại, không chỉ `auth.uid()!=null` hoặc bản sao event.
3. Account Administration lock đặt blocked trước gọi Auth ban; Auth lỗi thì giữ blocked và báo partial, không rollback
   sang active rồi mở lại dữ liệu. Unlock chỉ đặt active sau Auth unban thành công.
4. Delete giữ pending deny gate, yêu cầu owner cleanup/Storage ownership và nhận receipts trước hard delete Auth.
   Không DELETE bảng service khác, không dựa Auth cascade; guard/receipt phải sống qua lỗi và event trễ.
5. Token cũ chỉ còn đọc dữ liệu public; không còn đọc saved/notifications hoặc ghi comment.

Đây là thiết kế đề xuất cần test nhiều tab/token cũ. Không tuyên bố chặn Auth token issuance khi bước
Auth ban đang lỗi; phần “chặn đăng nhập” hoàn chỉnh chỉ đạt khi cả Auth và app gate được kiểm chứng.
Không cần mua tính năng single-session/timeouts để thay app authorization.

### Current-state authorization — shared read-only helper đã chọn DEC-031

| Cách | Tác động |
| --- | --- |
| Account API check thay helper | Phương án đã cân nhắc, không chọn làm nền tảng RLS hiện tại |
| Account-owned shared DB helper read-only, versioned, trả gate tối thiểu | **Đã chọn**: RLS/service đọc quyền hiện tại; **ngoại lệ coupling có chủ đích**, không fully autonomous DB-per-service |
| Role/blocked projection theo event hoặc cache TTL | Có độ trễ khóa; không đủ acceptance phiên đang mở nếu chỉ dùng cách này |

Helper browser chỉ trả state của auth.uid, không param cho phép enumerate user khác;
helper server chỉ grant scoped role và trả dữ kiện quyền tối thiểu cho actor đã được service xác minh.
Không cho SELECT thẳng bảng account hoặc write helper; tránh RLS recursion.
Đổi layout sang project/database riêng phải xét lại security contract, không giữ shared helper một cách giả tạo.
Race permission-check→commit, cache gate và timeout phải được kiểm thử; không tự nới cam kết khóa tức thì.

## 5. Realtime riêng tư

Khuyến nghị Postgres Changes trên bảng tín hiệu tối thiểu thay vì broadcast payload notification:

- RLS signal: current user active và user_id đúng caller; client filter chỉ là tối ưu, không security boundary.
- Signal là bảng thật Notification-owned trong schema đề xuất `notification`, không view public.
  Grant USAGE/SELECT tối thiểu để Realtime kiểm tra quyền và test custom-schema subscription;
  không tự expose toàn schema Notification qua Data API.
- Chỉ INSERT/UPDATE; không publish DELETE chứa old row riêng tư.
- Không đưa email, comment body, notification body vào tín hiệu.
- Nhận tín hiệu thì Data API refetch theo quyền hiện tại; không cho update trực tiếp bằng payload socket.
- Test A subscribe filter B, token cũ sau khóa, reconnect, refresh token và delete user.
- Không giả auth cache của Broadcast/Presence tương đương Postgres Changes. Chưa dùng private broadcast.
- Nếu test chứng minh tín hiệu còn tới token bị khóa, không được suy thành đọc được inbox; vẫn phải
  phân loại leak metadata và sửa trước nghiệm thu theo threat model đã duyệt.

## 6. Storage và upload — public đích + private staging đã chọn

| Lựa chọn | Lợi ích | Rủi ro |
| --- | --- | --- |
| Bucket public cho ảnh minh họa | **Đã chọn** cho ảnh hợp lệ; thuận tiện browser/OG | User chấp nhận URL/cache còn đọc khi hide |
| Bucket private + policy + URL hạn ngắn | Hạn chế origin access theo nội dung/quyền | Signed URL không thu hồi riêng ngay, preview URL hết hạn; thêm lượt ký |
| Private + server public image route kiểm tra trạng thái | URL ổn định cho OG và kiểm tra trước trả ảnh | Thêm vai trò Spring/renderer và băng thông runtime; phải duyệt, không mặc định |

DEC-033: ảnh đích public, staging private; không ký public URL như thể ảnh bí mật.
Payload quán/món ẩn vẫn phải được bảo vệ, không dùng ngoại lệ ảnh để public cả JSON/HTML.
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

### Kiểm tra byte ảnh — phương án 1 đã chọn DEC-033

Giữ so sánh để ghi lại lựa chọn:

1. **Đã chọn:** browser upload vào vùng private cách ly trên Storage; Catalog đọc đúng object theo asset ID,
   Catalog kiểm tra byte/decode/pixel rồi chuyển thành object đích bất biến trước khi cho gắn nội dung công khai.
   Upload vẫn trực tiếp Supabase; Catalog bổ sung validation, không thay Storage hoặc xây transformer.
   Cần state pending/validated/rejected, chặn overwrite object đã duyệt, policy không đọc ảnh pending,
   kiểm tra hash/version để tránh thay byte sau validation và cleanup orphan có kiểm soát.
2. Không chọn hiện tại: file đi qua Catalog để kiểm tra rồi upload Storage. Tăng băng thông/
   bộ nhớ và thay đường upload đã đề xuất; phải duyệt thay đổi trách nhiệm này.

Phương án đã chọn, nhưng tên bucket/state/endpoint finalize/giới hạn và credential cụ thể còn review,
không có bucket hoặc upload pipeline đã tạo.
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

### Service-to-service trust và dữ liệu xóa

- HTTPS khi triển khai và secret HMAC riêng theo cặp service đã duyệt DEC-039.
  Ký destination, timestamp và nội dung; verify chữ ký/producer/allowlist và chống replay/lặp.
  Không dùng Supabase secret như danh tính service, không thêm Auth Service.
- Canonical bytes cần ràng buộc method, path/query, destination, timestamp, nonce/request ID và body hash;
  algorithm/header names/skew/nonce TTL/key rotation là thiết kế chi tiết phải review trước code.
  Chữ ký đúng nhưng event-type sai vẫn deny; retry hợp lệ không mất dedup nghiệp vụ.
- Internal route không chỉ dựa vào prefix `/internal` hoặc mạng local. Verify producer, audience, payload,
  replay/dedup và loại event service đó được phép phát. User JWT không thay service authentication.
- Consumer kiểm tra producer/event-type allowlist; không để Catalog giả `CommentRemovedByAdmin`
  hoặc Notification gọi user-delete vì biết endpoint.
- Chỉ Account Administration phát cleanup user; từng owner thực thi và trả durable receipt.
- Events/receipts/tombstone không chứa raw comment/email/token. Việc giữ user ID tối thiểu sau xóa
  vẫn cần quyết định retention/quyền dữ liệu, không tự giữ vĩnh viễn vì dễ retry.
- Event trễ sau xóa không được tạo lại dữ liệu. Versioned deletion watermark/deny check là candidate,
  thời hạn receipt và khả năng replay phải được duyệt cùng cleanup.

## 8. Kiểm thử bắt buộc trong kế hoạch sau baseline

| Nhóm | Negative/positive evidence cần có |
| --- | --- |
| Public content | Hidden/deleted payload không đọc qua tables/views/RPC/SSR; URL ảnh public cũ là ngoại lệ đã chấp thuận |
| Private | A/B allow/deny SELECT/INSERT/UPDATE/DELETE, unchanged-row proof khi deny trả 0 rows |
| Privilege escalation | Sửa owner/role/state/recipient, gọi server-only RPC bằng user key đều thất bại |
| Comment | Không đổi author/parent/target; không reply nhiều tầng; admin không sửa lời người khác |
| Account | Old JWT sau lock/delete bị chặn dữ liệu riêng và ghi; ban upstream lỗi không báo full success |
| Notification | Subscribe A/B, forge recipients/events/read_at, retry không nhân đôi |
| Storage | Nonadmin/blocked upload denied; spoof MIME/oversize/path overwrite; cleanup shared asset không xóa nhầm |
| Server | Invalid issuer/audience/expired token, fail-closed JWKS/Auth outage, admin role thay đổi |
| Service isolation | Mỗi role không SELECT/UPDATE schema khác; key khác tên nhưng quyền global không được coi là pass |
| Events | Producer giả/type sai, duplicate/out-of-order/gap, crash sau commit/trước ack, retry theo consumer |
| Cleanup | Mất một service khi xóa, event trễ sau xóa user, receipt thiếu không báo full success |
| Dependency | Catalog/Account timeout không fallback cho phép thao tác hoặc trả stale hidden content |
| HMAC | Sai đích/body/method/path, chữ ký sai/hết hạn, replay và key rotation; user JWT không thay service credential |
| Admin safety | Không tự khóa/xóa; hai operation cạnh tranh không vô hiệu hóa toàn bộ admin active |

Đây là tiêu chí thiết kế, chưa test nào được chạy. Chiến lược và lệnh test thuộc nhóm 3/kế hoạch.

## 9. Nguồn

- [RLS](https://supabase.com/docs/guides/database/postgres/row-level-security)
- [API security](https://supabase.com/docs/guides/api/securing-your-api)
- [Database functions](https://supabase.com/docs/guides/database/functions)
- [JWT](https://supabase.com/docs/guides/auth/jwts)
- [Postgres Changes](https://supabase.com/docs/guides/realtime/postgres-changes)
- [Storage downloads/signed URL revocation](https://supabase.com/docs/guides/storage/serving/downloads)

## 10. P01 — trust model Data API/RPC, đề xuất chờ duyệt

Khảo sát tài liệu ngày 2026-11-23, không thử trên project. Tên role dưới đây là candidate,
không role đã tạo. `role` PostgreSQL trong JWT khác business role admin của ứng dụng.

### Caller matrix

| Caller | API key / token issuer | DB role dự kiến | Allow | Deny | Cấp/thu hồi |
| --- | --- | --- | --- | --- | --- |
| Browser khách / SSR public | Publishable, không user token | anon | Public façade đã lọc | Private/hidden/server RPC | Owner grants; key public không là bí mật |
| User A | Publishable + Supabase Auth JWT A | authenticated | Public và private own qua surface cho phép | Dữ liệu B, direct commands | Auth cấp token; current-state gate chặn phiên cũ |
| User B | Publishable + Supabase Auth JWT B | authenticated | Public và private own | Dữ liệu A, direct commands | Tương tự A |
| Admin active | Publishable + Supabase Auth JWT | authenticated, không DB superuser | Public/own; admin command qua owner kiểm tra current state | Raw account writes, private collection người khác | Admin bootstrap riêng; không client tự cấp |
| Blocked/deletion_pending | JWT cũ vẫn có thể hợp lệ chữ ký | authenticated nhưng gate deny | Public như khách | Private reads/writes và admin commands | Account gate chặn; Auth ban/delete không thay gate |
| Catalog | Publishable + machine JWT candidate, issuer chưa chọn | catalog_runtime candidate | Catalog RPC và helper quyền tối thiểu | Schema/RPC mutation owner khác, Auth Admin | Provisioning riêng cần duyệt, revoke grant/gate và token lifecycle |
| Collection | Như trên, identity riêng | collection_runtime candidate | Collection RPC/helper; gọi Catalog HTTP theo contract | Raw Catalog/Account và RPC owner khác | Như trên |
| Community | Như trên, identity riêng | community_runtime candidate | Community RPC/helper; Catalog HTTP | Raw Catalog/Account và RPC owner khác | Như trên |
| Notification | Như trên, identity riêng | notification_runtime candidate | Notification RPC/helper | Collection writes, account mutations | Như trên |
| Account Administration | Machine identity riêng cho dữ liệu; Auth Admin client tách | account_runtime candidate | Account RPC; Auth Admin qua credential riêng | Business tables/RPC owner khác | Chủ dự án duyệt provisioning/secret channel riêng |

Auth Admin credential vẫn có thể mang quyền nền tảng rộng: không tuyên bố account service được
cô lập hoàn toàn chỉ bởi account_runtime. Tương tự Catalog Storage privileged client là boundary riêng.

### Candidate comparison và giới hạn

| Candidate | Nhận xét / quyền cần thêm |
| --- | --- |
| Secret key riêng từng service | Không đạt owner isolation: cùng service_role/BYPASSRLS; tên key không giới hạn schema |
| Chỉ forward user JWT | Giữ user identity nhưng không chứng minh Spring/service đã kiểm tra command; grant RPC cho authenticated cho phép user gọi trực tiếp |
| Imported signing key/custom JWT | Supabase có tài liệu hỗ trợ JWT tự mint; cần import/trust config, issuer/key custody/rotation và quyền cấp role. Không phát signing key rộng cho năm service: service giữ key có thể ký role/actor khác |
| Supabase Auth machine accounts + controlled claims/hook | Candidate giữ issuer Supabase, không phát private signing key cho service. Cần principal riêng, allowlist bảo vệ phía server, token/refresh revocation và chứng minh DB role/EXECUTE. Không dùng user_metadata làm role |
| Machine accounts + claim, vẫn authenticated | Có thể phân biệt principal trong function nhưng grants cùng role không tự tạo role isolation. Muốn dùng phải review lại yêu cầu role riêng; chưa coi là đáp án B1 |
| JDBC scoped roles | Có thể khảo sát nếu user yêu cầu; chưa chọn, không fallback tự động |

**Đã duyệt hướng khảo sát DEC-042, không duyệt cơ chế triển khai:** đánh giá khả năng Supabase Auth cấp machine identity
với DB role riêng trước khi cân nhắc custom issuer. Tài liệu hook có schema enum role
anon/authenticated nhưng ví dụ HTTP có sửa role từ app_metadata: chưa đủ để khẳng định hosted
Auth chấp nhận arbitrary DB role. Role switching/membership và đường revoke cần proof, không đoán.
Tài liệu [Postgres roles](https://supabase.com/docs/guides/database/postgres/roles) mô tả
`authenticator` đổi sang role từ JWT; chưa chứng minh Auth phát JWT machine có role custom
hay role đó được `authenticator` phép chuyển. Không đổi `role` claim user hoặc Auth hook production
trước khi có design và quyền Cloud riêng.
Theo thông tin chủ dự án, project đã có JWT signing key **ECC P-256**; không tạo/xoay key
hiện hữu. Signing key là cơ chế xác minh token, **không** cấp quyền PostgreSQL role riêng.
Khảo sát trực tiếp chỉ đọc do chủ dự án cung cấp cho thấy role/schema ứng viên của năm
service chưa được tạo; chưa thể chứng minh cũng chưa thể bác bỏ machine-role. P02/P03
tiếp tục không cần proof này; chỉ persistence/grants/RPC phụ thuộc GATE-01 bị chặn.

Không credential nào trên tự gắn cả user JWT và machine JWT vào một Authorization header.
Service xác minh user, truyền actor context đã xác minh qua RPC được grant cho đúng owner.
DB tin service trong miền được phép; việc chống một service bị chiếm quyền giả actor ngay trong
miền mình chưa được giải quyết bằng HMAC hoặc owner role. Cần ghi trust boundary, không hứa
cryptographic end-user delegation khi chỉ truyền verified_actor_id.

### Helper và negative proof cần có

- Browser helper không nhận arbitrary actor ID, chỉ đọc auth.uid; trả boolean/state tối thiểu.
- Server helper chỉ scoped caller, không raw SELECT/enumeration; actor ID lấy từ user JWT đã verify.
- Revoke EXECUTE PUBLIC và direct grants không cần; default privileges phải xét theo creator role.
  Helper definer có owner tối thiểu, search_path cố định, không broad postgres quyền mọi owner.
- Test service C gọi RPC L và đổi schema/profile bị deny; test đổi actor/owner trong body, modified JWT,
  user tự sửa metadata, expired/revoked machine token, token cũ sau account lock.
- Test anonymous/authenticated gọi server RPC denied và không row nào thay đổi; không chỉ nhìn HTTP code.
- Target hiện tại chưa kiểm tra các grants, Auth hook, signing config hoặc plan hỗ trợ; không thay Cloud.

### Remaining decisions theo slice

| Trước slice | Còn phải chốt |
| --- | --- |
| P02/M1 | Machine identity candidate, actor trust, provisioning/rotation/revoke; local hay Cloud; versions/test packages/manifest |
| M2 | Locale URL/fallback, content fields/area, map/license/seed, upload limits; admin bootstrap |
| M3 | Collection naming/rename/delete, marker action, random một bộ/xác suất; Auth linking |
| M4 | HMAC canonicalization/rotation, historical-save/re-save boundary, latency/history retention |
| M5/M6 | Cleanup receipts/tombstones/assets retention, recovery budgets/free hosting/release target |

Nguồn đọc: [API keys](https://supabase.com/docs/guides/api/api-keys),
[JWT](https://supabase.com/docs/guides/auth/jwts),
[RBAC](https://supabase.com/docs/guides/database/postgres/custom-claims-and-role-based-access-control-rbac),
[Token hook](https://supabase.com/docs/guides/auth/auth-hooks/custom-access-token-hook),
[Functions](https://supabase.com/docs/guides/database/functions),
[Custom schemas](https://supabase.com/docs/guides/api/using-custom-schemas).
Không áp broad GRANT ALL từ ví dụ custom-schema vào dự án; profile chọn schema không là authorization.
