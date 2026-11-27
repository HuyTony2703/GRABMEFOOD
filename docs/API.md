# API — thiết kế lại cho monolith

**Trạng thái:** chưa có contract sản phẩm mới được triển khai.

- Browser có thể dùng Supabase Auth và Data API cho những surface đã có RLS/grants
  kiểm chứng; không tin `owner_id`, vai trò hoặc recipient do client tự khai.
- Một Spring Boot backend (không năm endpoint gốc khác nhau) xử lý các thao tác
  cần xác minh nghiệp vụ, quyền admin hay bí mật server; backend kết nối Supabase
  bằng Data API. Credential server không xuất hiện ở browser.
- Chỉ dùng RPC khi cần transaction hoặc kiểm tra quyền nguyên tử và đã xác minh
  caller/EXECUTE. Một chuỗi HTTP request không tự là một transaction.
- Không có HTTP/HMAC nội bộ giữa các module, machine JWT hay owner-service RPC
  của thiết kế cũ.

Routes, DTO, validation, error và quyền của từng luồng sẽ được chốt theo
[PRD](PRD.md) và [DOMAIN](DOMAIN.md) trước khi code sản phẩm mới.
