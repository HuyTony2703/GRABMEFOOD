# Kiểm thử — hướng monolith

Phân biệt kiểm tra tĩnh, frontend, một backend Spring thật, Supabase Data API,
Auth/RLS, migration/replay và luồng end-to-end. Proof năm service trước đây
không được tính là proof cho monolith hoặc database mới.

Theo requirement ID trong [PRD](PRD.md) và business rule ID trong
[DOMAIN](DOMAIN.md), kiểm cả happy path và deny path: A/B sở hữu dữ liệu,
role admin, tài khoản khóa với phiên cũ, dữ liệu ẩn/xóa, comment/reply,
saved/random và thông báo đúng người. Không tự gọi build xanh là acceptance.

Chưa có test end-to-end mới được chạy sau quyết định đổi kiến trúc.
