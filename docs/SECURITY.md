# Bảo mật — ranh giới mới

**Trạng thái:** thiết kế quyền Data API/monolith mới chưa hoàn tất.

Supabase Auth xác thực user; publishable key không phải chứng thực danh tính.
RLS và grants bảo vệ dữ liệu truy cập từ browser; server phải xác minh caller
và trạng thái tài khoản trước thao tác đặc quyền. Secret, service_role và
password chỉ ở server/công cụ quản trị được phép. Không mở dữ liệu user B cho
user A, không cho user tự khai admin hoặc bỏ qua khóa bằng phiên còn hạn.

Không cần chứng minh scope riêng giữa năm service vì kiến trúc đó đã bị bỏ.
Không mặc định một secret rộng là an toàn chỉ vì backend là monolith; xác
minh quyền người dùng và hạn chế surface theo từng luồng. Storage cần policy
upload/ownership; Realtime không thay kiểm quyền khi đọc dữ liệu thật.

Acceptance tối thiểu: Auth/RLS A/B, client không ghi dữ liệu admin, locked user
bị chặn, hidden/deleted không lộ, denied requests không đổi dữ liệu.
