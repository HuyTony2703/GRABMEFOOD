# Vận hành — hướng monolith

Một backend Spring Boot, frontend React/Vite (SSR theo hướng đã duyệt), một
project Supabase. Không deploy năm service, không quản trị HMAC theo cặp,
runtime role/machine identity hoặc outbox HTTP giữa năm process cũ.

Trước khi thay Cloud: xác nhận đúng project, inventory dữ liệu/đối tượng/phụ
thuộc, bảo vệ cấu hình nền tảng, thao tác migration theo thứ tự, đọc lại kết
quả và dừng khi trạng thái không xác định. Không reset toàn project, sửa
Supabase Auth/SMTP/billing, xóa `auth`/`storage`, hoặc xóa migration ledger.

**Dọn Cloud đã thực hiện 2026-11-27, target `bdhavbwmxbttymerizvx`:**
trước dọn 5 schema ứng dụng/10 bảng đều rỗng, 2 public view, 3 function
ứng dụng, 8 role và 17 migration history entries; 0 Auth user, 0 Storage
object. Hai lần thử migration đầu lỗi quyền owner/SET ROLE và rollback, không
để lại mutation. Migration `20261127091758` bỏ đối tượng ứng dụng đích danh
trong một transaction; migration `20261127091831` bỏ default ACL phụ thuộc
và 8 role. Đọc lại: 0 schema/role/function/view ứng dụng, `public` không có
bảng/view sản phẩm; Auth user và Storage bucket/object đều 0; ledger có
19 entries (giữ 17 entry lịch sử). GET Data API vào `catalog_restaurants`
trả 404/PGRST205 như mong đợi sau khi view bị bỏ.

**Giới hạn chưa kiểm từ MCP:** cấu hình Dashboard Auth hook đang bật/tắt
không đọc được qua SQL; function `account_admin.machine_access_token_hook`
đã xóa theo hướng cũ, nên phải xác nhận hook đã tắt trên Dashboard trước
khi tạo Auth user mới. Không dùng phép đếm 0 user làm bằng chứng cấu hình
hook. Security advisor còn cảnh báo cũ ở `public.rls_auto_enable()`; đây là
function/event trigger nền tảng không bị xóa trong đợt dọn:
https://supabase.com/docs/guides/database/database-linter?lint=0028_anon_security_definer_function_executable
và https://supabase.com/docs/guides/database/database-linter?lint=0029_authenticated_security_definer_function_executable.

Secret chỉ qua kênh đã duyệt, không commit hay in log. Kế hoạch backup,
hosting miễn phí, cấu hình và phục hồi cho hệ thống mới cần chốt trước release.
