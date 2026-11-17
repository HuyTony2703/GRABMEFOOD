# SCRUM-54 — Miễn backup/restore legacy

> Runbook/waiver lịch sử Gói 1. Quy tắc Local cho task sau bên dưới đã được
> thay bằng [Cloud ADR](../adr/0001-supabase-cloud.md) tại SCRUM-59.
> Hiện dùng Cloud PostgreSQL/Auth/Storage, apps/broker localhost; không start
> Supabase Local. Rebuild/restore V2 cần isolated approved target, hiện blocked.
> Miễn legacy giữ nguyên, không trở thành quyền reset/xóa Cloud.

## Quyết định và giới hạn

Ngày 2026-11-15, chủ dự án xác nhận chưa từng có backend/database/Storage, không có nguồn backend ngoài repo, yêu cầu không lưu backup và đồng ý sửa nghiệm thu SCRUM-54.

**Trạng thái: bỏ qua backup/restore legacy theo quyết định được duyệt.**

- Không tạo archive code, SQL dump, Auth export hoặc Storage object backup.
- Backup location, checksum, manifest artifact và restore target: **N/A**.
- Restore command, test và kết quả phục hồi: **không chạy**.
- Git HEAD/origin trong inventory chỉ là thông tin kiểm kê, không được gọi là bản backup đã thử phục hồi.
- Không xóa/reset ứng dụng, browser state, database, volume hoặc project nào.

Đầu ra thay thế là biên bản miễn backup này và `docs/legacy-inventory.md`, không phải bằng chứng có backup phục hồi được.

## Quy tắc áp dụng cho task sau

- V2 mới dùng Supabase CLI local, không yêu cầu tài khoản/project Supabase cloud.
- SCRUM-47/65/66 xác minh instance local mới và trạng thái sạch; không cần xóa legacy DB vốn không tồn tại. Nếu phát hiện data/instance ngoài dự kiến, dừng hỏi, không kế thừa quyền xóa từ quyết định này.
- SCRUM-49/75/76 vẫn phải kiểm thử reset–rebuild V2 hai vòng, Auth/Storage/permission/seed failure và thử phục hồi **fixture V2 local** nếu AC của task yêu cầu. Miễn legacy không miễn test độ tin cậy V2.
- Trước mọi thao tác phá hủy, trình target, phạm vi và ảnh hưởng để xin xác nhận riêng.
- Startup demo không tự reset dữ liệu. Stop/restart phải giữ dữ liệu; reset là thao tác riêng có guard.
- Đóng gói bài nộp ở SCRUM-8/115/116: root folder chứa source/config/migrations/seed/assets demo mới, `.env.example` và một lệnh khởi động sau prerequisites. Loại `node_modules`, Docker volumes, secrets thật và backup; ghi rõ Docker/toolchain/tài nguyên/Internet lần đầu.

Gói này chỉ ghi quyết định; chưa có script bootstrap/reset/rebuild/restore V2 được triển khai.
