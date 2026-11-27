# Database — thiết kế lại

**Trạng thái:** chưa thiết kế schema nghiệp vụ mới. Đã dọn schema, bảng, view,
function và role ứng dụng cũ trên project Supabase bằng hai migration
`retire_old_application_objects_with_owner_context` (`20261127091758`) và
`retire_old_application_roles` (`20261127091831`). Giữ `auth`, `storage`
và migration history (19 mục sau dọn).

Một PostgreSQL phục vụ monolith. Có thể chọn một hay nhiều schema để tổ chức
dữ liệu; schema không biến module thành microservice. Không tái sử dụng SQL,
role runtime, machine principal, function hoặc contract của backend cũ.

Trước migration mới: chốt bảng/constraint theo PRD và DOMAIN, đường cấp quyền
cho browser và backend qua Data API, RLS/grants, xử lý transaction/RPC khi
cần nguyên tử, test A không đọc/sửa dữ liệu riêng B, và một nguồn migration
có thể replay. Không tự chọn FK/cascade hoặc retention thay nhóm sản phẩm.
