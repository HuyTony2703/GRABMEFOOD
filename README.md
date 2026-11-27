# GrabMeFood

Website khám phá ẩm thực dân dã dành cho sinh viên quanh Làng Đại học ĐHQG TP.HCM.

> **Trạng thái: đang chuyển kiến trúc sang một ứng dụng Spring Boot dùng Supabase Data API.**
> Mã backend thử nghiệm theo năm microservices đã bị loại bỏ theo quyết định mới của nhóm;
> frontend được giữ nhưng còn các đường gọi backend local cần sửa sau. Chưa có backend monolith
> hay schema sản phẩm mới chạy được. Các tài liệu lịch sử có thể còn nhắc hướng cũ, không phải
> chỉ dẫn triển khai hiện hành.
> GRAB-2 đã Done ở phạm vi thiết kế; các proof backend cũ không nghiệm thu kiến trúc mới.

## Mục tiêu

- Khám phá theo luồng quán → chi tiết quán → chi tiết món thuộc quán.
- Tìm kiếm, bài viết ẩm thực và danh sách tuyển chọn theo chủ đề.
- Lưu quán/món vào bộ sưu tập riêng tư và chọn ngẫu nhiên từ các mục đã lưu.
- Bình luận, trả lời một cấp, thông báo cá nhân và khu vực quản trị.
- Giao diện và nội dung biên tập bằng tiếng Việt/Anh; ưu tiên máy tính, điện thoại vẫn sử dụng được.

Michelin Guide là tham chiếu về bố cục, trải nghiệm và loại nội dung, **không phải đặc tả tính năng mở**.
GrabMeFood có nhận diện riêng; không sao chép thương hiệu, ảnh, bài viết hoặc dữ liệu chưa có quyền.
Không có khách sạn, đặt bàn, đặt món, giao hàng, thanh toán hoặc sao/chứng nhận.

## Bối cảnh demo

Bản đầu phục vụ đồ án, không có hạn chót cố định; ưu tiên nhanh nhưng không làm ẩu.
Có định hướng công khai sau, nhưng chưa có quyền deploy/release.
Chỉ sử dụng phương án miễn phí đã kiểm chứng, không tự phát sinh phí.

Tên và địa chỉ quán thật có thể được dùng làm tham chiếu sau khi kiểm tra nguồn và điều kiện sử dụng.
Mô tả, món và giá được phép tạo để demo; phải phân biệt với thông tin thực tế.
Ưu tiên ảnh có giấy phép phù hợp; thiếu ảnh thì dùng ảnh AI tạo và ghi rõ tính minh họa.
AI chuẩn bị nội dung trước, **không tích hợp dịch vụ AI vào ứng dụng**.

## Công nghệ đã xác nhận

- Frontend: React + TypeScript + Vite.
- Backend shell mới ở [`backend/`](backend/README.md): Java 21 LTS,
  Spring Boot 4.2.0 và Maven Wrapper 3.10.2; chưa có API nghiệp vụ.
- PostgreSQL trên Supabase Cloud; tận dụng Auth, Data API, Storage, Realtime và RPC phù hợp.
- **Kiến trúc mục tiêu mới của nhóm: một Spring Boot monolith**. Catalog, Collection,
  Community, Notification và Account Administration là các miền nghiệp vụ, không phải
  năm service chạy/deploy riêng. Backend cũ không được tái sử dụng.
- Supabase vẫn cung cấp Auth/Storage/Realtime/PostgreSQL, không tự xây Auth Service.
  Browser chỉ gọi Data API ở surface đã được cấp quyền thực và kiểm thử RLS.
- Dùng Supabase Data API để kết nối; schema/quyền dữ liệu sản phẩm sẽ thiết kế lại từ đầu.
  Không dùng cơ chế danh tính máy, HTTP outbox/HMAC giữa năm service của phương án cũ.
- Public SSR React/Vite, private CSR; upload private staging → Catalog validate → ảnh public.
  Hosting SSR và backend miễn phí chưa được kiểm chứng.

Frontend SSR hiện còn gọi Catalog local cổng 8086, vì vậy chưa tích hợp backend
shell mới; test/evidence local cũ chỉ là lịch sử và không chứng minh luồng
frontend → monolith → Supabase mới.
Toolchain mục tiêu và giới hạn hiện tại nằm ở [TRD](docs/TRD.md).

## Bản đồ tài liệu và nguồn chuẩn

| Tài liệu | Trách nhiệm / nguồn chuẩn | Trạng thái |
| --- | --- | --- |
| [AGENTS.md](AGENTS.md) | Quyền thao tác và quy tắc làm việc của agent | Nhóm 1 đã duyệt |
| [docs/PRD.md](docs/PRD.md) | Phạm vi, requirement ID và acceptance nghiệp vụ | Nhóm 1 đã duyệt |
| [docs/DOMAIN.md](docs/DOMAIN.md) | Thuật ngữ, quan hệ và business rules | Nhóm 1 đã duyệt; câu hỏi mở vẫn mở |
| [docs/APP-FLOWS.md](docs/APP-FLOWS.md) | Luồng người dùng, điều hướng, trạng thái UI | Nhóm 1 đã duyệt; đề xuất ghi rõ chưa chốt vẫn chờ duyệt |
| [docs/DECISIONS.md](docs/DECISIONS.md) | Quyết định hiện hành và các vấn đề chưa chốt; không khôi phục mã quyết định cũ không còn nguồn | Đang rà soát cho GRAB-1 |
| [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) | Hướng monolith hiện hành | Chưa có triển khai mới |
| [docs/TRD.md](docs/TRD.md) | Phiên bản, tích hợp và yêu cầu kỹ thuật | Nhóm 2 đã review; TBD vẫn mở |
| [docs/DATABASE.md](docs/DATABASE.md) | Thiết kế dữ liệu, constraints, indexes và ownership | GRAB-5 Done theo owner duyệt; giới hạn kiểm chứng vẫn được ghi nhận |
| [docs/API.md](docs/API.md) | Hợp đồng Data API, RPC và Spring đề xuất | Nhóm 2 đã review; TBD vẫn mở |
| [docs/SECURITY.md](docs/SECURITY.md) | Permission matrix, Auth/RLS/Storage và đặc quyền | Nhóm 2 đã review; TBD vẫn mở |
| [DESIGN.md](DESIGN.md) | Hướng thiết kế riêng, tokens, components và accessibility | Nhóm 2 đã review; TBD vẫn mở |
| [docs/TEST-STRATEGY.md](docs/TEST-STRATEGY.md) | Chiến lược kiểm thử và Definition of Done | Nhóm 3 đã duyệt; evidence local theo slice, chưa nghiệm thu tích hợp toàn hệ thống |
| [docs/OPERATIONS.md](docs/OPERATIONS.md) | Môi trường, email, migration, deploy và recovery | Nhóm 3 đã duyệt; chưa quyền vận hành Cloud |

Các dòng chưa viết là kế hoạch tài liệu, không phải file hoặc thiết kế đã hoàn thành.
README chỉ là tổng quan và bản đồ; không là bản sao đầy đủ của PRD.
Jira theo dõi timeline/dependency; trạng thái To Do không chứng minh chưa có công việc.
Đối chiếu quyết định mới ở DECISIONS; không tự chuyển issue sang Done.
Spec Kit chưa được xác minh/cài đặt; chưa có artifact nào của Spec Kit là nguồn chuẩn.

## Thứ tự và điểm dừng

1. Nhóm sản phẩm/quy tắc đã được duyệt; TBD không tự trở thành quyết định.
2. Nhóm thiết kế đã được duyệt để tiếp tục; chốt riêng các phương án/TBD trước implementation.
3. Kiểm chứng/vận hành cũ không thay proof của database/backend mới.
4. Jira GRAB-3..GRAB-10 theo dõi timeline sau khi cập nhật hướng kiến trúc.
5. Thiết kế lại database, API và acceptance cho một backend trước khi triển khai sản phẩm.

Không tự commit/push hoặc deploy.
