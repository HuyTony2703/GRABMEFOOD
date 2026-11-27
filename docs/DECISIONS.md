# Quyết định hiện hành — GrabMeFood

**Kiến trúc (nhóm xác nhận 2026-11-27):** bỏ hướng năm microservices, chuyển
sang một ứng dụng Spring Boot và một project Supabase. Giữ frontend React/Vite;
không tái sử dụng backend/SQL của phương án cũ. Làm lại database nghiệp vụ
từ đầu, kết nối bằng Supabase Data API. Có thể chia module và schema theo miền
nghiệp vụ nhưng chỉ có **một** backend process/deployment.

**Phạm vi dọn:** nhóm yêu cầu xóa vĩnh viễn mã backend/proof cũ kể cả chưa
commit, không sao lưu; giữ frontend. Giữ project Supabase và nền tảng
Auth/Storage; dọn đối tượng ứng dụng cũ theo inventory, không xóa migration
history để giả như các thay đổi Cloud chưa từng diễn ra. Jira phải phản ánh
kiến trúc hiện hành, không sửa lịch sử issue thành bằng chứng sản phẩm mới.

**Giữ nguyên phạm vi nghiệp vụ** và các requirement ID ở [PRD](PRD.md), rule ID
ở [DOMAIN](DOMAIN.md); quyết định về UI ở [DESIGN](../DESIGN.md) và
[APP-FLOWS](APP-FLOWS.md) không tự đổi theo kiến trúc. Đặc biệt giữ quyền dữ
liệu riêng, chặn user bị khóa ở phiên cũ, tiến trình xóa trung thực, recipient
notification và nội dung public/hidden.

**Chưa chốt:** schema, grants/RLS, API/RPC mới, đường thao tác admin, cấu hình
hosting miễn phí, migration/recovery, Auth hook Dashboard và acceptance thực
tế sau khi chuyển đổi. Không tuyên bố GATE-01 của hướng cũ “đã đạt”; phép thử
quyền mới phải được thiết kế theo surface mới. Không tự đóng Jira Done.

## Câu hỏi mở cần quyết định trước khi triển khai phần liên quan

- **Nội dung/UX:** quy tắc gán khu vực và xử lý chồng lấn; copy VI/EN,
  fallback bản đồ và thông báo khi đích đã xóa. Nguồn chi tiết: [PRD](PRD.md),
  [APP-FLOWS](APP-FLOWS.md), [DESIGN](../DESIGN.md).
- **Dữ liệu cá nhân:** trường marker tối thiểu, retention, xử lý công khai lại
  và mục từng bị ẩn riêng; xác suất random và trường hợp ẩn/xóa đồng thời.
  Nguồn: [DOMAIN](DOMAIN.md), BR-LIFE-05..06 và BR-RND-05.
- **Thông báo:** cách chứng minh user đã lưu tại cả thời điểm sự kiện và gửi,
  trường hợp bỏ lưu/lưu lại, delivery/retry và retention.
  Nguồn: [DOMAIN](DOMAIN.md), BR-NOT-11.
- **Quyền/kiến trúc mới:** schema, grants/RLS, hợp đồng Data API/RPC và Spring,
  quyền admin, Auth hook, migration/replay, hosting miễn phí; chưa có proof
  thực tế cho luồng mới. Nguồn: [DATABASE](DATABASE.md), [API](API.md),
  [SECURITY](SECURITY.md), [OPERATIONS](OPERATIONS.md).

Đây là danh mục truy vết, không phải phê duyệt giải pháp hoặc acceptance đã đạt.

## Quyết định nghiệp vụ và trình bày vẫn còn hiệu lực

Chỉ giữ các mã quyết định có nội dung còn áp dụng và được nêu trực tiếp ở đây.
Không phục hồi DEC-001..023 hoặc suy diễn nội dung từ các mã không còn nguồn;
tham chiếu cũ không còn phù hợp phải bỏ. PRD và DOMAIN là nguồn chuẩn cho
yêu cầu và business rules; bảng dưới đây không tạo thêm yêu cầu mới.
Hướng vận chuyển kỹ thuật trong bản lịch sử **không** còn hiệu lực.

| ID | Phần tiếp tục áp dụng |
| --- | --- |
| DEC-035 | Không tự thông báo cho chính mình khi reply; chống trùng do nhiều bộ; broadcast chỉ user active. |
| DEC-037 | Chặn hiển thị/sử dụng trước; khi xóa cần trạng thái đang xử lý và xác nhận đủ bước trước khi báo xong. |
| DEC-045 | Mỗi lần lưu chọn một bộ phù hợp loại; cùng mục có thể lưu vào nhiều bộ qua thao tác riêng. |
| DEC-046 | Random theo tất cả mục đã lưu hoặc mục tự chọn; không có mode theo một bộ. |
| DEC-047 | Thao tác admin nguy hiểm cần xác nhận, nêu tác động và thể hiện pending/partial/complete trung thực. |
| DEC-048 | Sau đăng nhập quay về trang trước, user tự xác nhận lại thao tác, không tự gửi. |
| DEC-049 | Atlas wireframe low-fi được chọn làm đầu vào bước thiết kế tiếp theo. |
| DEC-050 | Mobile được biểu diễn bằng responsive reflow. |
| DEC-051 | Giữ Bình luận & thông báo thành section riêng trong tài liệu. |
| DEC-052 | Dialog lưu mẫu chọn một bộ phù hợp loại. |
| DEC-054 | Dùng danh sách thông báo thay vì panel trong bước thiết kế. |
| DEC-055 | Các hướng trình bày wireframe được duyệt, không tự duyệt copy cuối. |
| DEC-057 | Giữ atlas làm điểm xuất phát, copy VI/EN chưa chốt. |
| DEC-059 | Discovery low-fi giữ nút tìm, nhãn kết quả, bố trí card. |
| DEC-060 | Có xác nhận phạm vi người nhận trước broadcast admin. |
| DEC-061 | Checklist acceptance còn thiếu là truy vết, không phải kết quả test. |
| DEC-062 | Layout/copy chưa chốt và OQ/TBD vẫn mở. |
| DEC-063 | GRAB-2 nghiệm thu artifact thiết kế; test sản phẩm thuộc milestone sau. |
| DEC-064 | Discovery ba cột desktop, một cột mobile; editorial sau kết quả. |
| DEC-065 | Thẻ kết quả có affordance lưu. |
| DEC-066 | Empty/error riêng, error có retry; copy cuối chưa chốt. |
| DEC-067 | Random theo thứ tự chọn loại, tập mục, bắt đầu, kết quả. |
| DEC-068 | Notification row có preview, read state và timestamp placeholder. |
| DEC-069 | Bộ sưu tập có hai tab Quán/Món trong low-fi. |
| DEC-070 | Nút sửa/xóa của tác giả; reply thụt một cấp. |
| DEC-071 | Admin content: danh sách rồi editor minh họa. |
| DEC-072 | Chi tiết quán: tên/địa chỉ, gallery/map, giới thiệu, món, bình luận. |
| DEC-073 | Chi tiết món: quán cha, tên/lưu, ảnh, mô tả/giá, bình luận. |
| DEC-074 | Bài viết/tuyển chọn có danh sách chung và trang chi tiết theo loại. |
| DEC-075 | Entry Auth gồm email, đăng ký, Google và recovery link. |
| DEC-076 | Admin account action có danh sách và dialog pending/partial/retry. |
| DEC-077 | Xóa bình luận/broadcast cần dialog xác nhận tác động/phạm vi. |
| DEC-078 | Affordance quản lý tại từng bộ sưu tập; thao tác cụ thể chưa chốt. |
| DEC-079 | Khi map embed lỗi dùng placeholder và link Google Maps hợp lệ. |
| DEC-080 | Copy state/CTA VI/EN chưa chốt, không chỉ dùng màu để phân biệt. |
| DEC-081 | Editorial sáng, neutral và xanh được chọn để render review. |
| DEC-082 | Render editorial sáng được duyệt làm visual baseline GRAB-2. |
