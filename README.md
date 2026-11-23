# GrabMeFood

Website khám phá ẩm thực dân dã dành cho sinh viên quanh Làng Đại học ĐHQG TP.HCM.

> **Trạng thái: tài liệu đã duyệt; đang tiếp tục các lát cắt implementation theo dependency.**
> **Ba nhóm tài liệu đã được duyệt; B1 tổng hợp phạm vi và hướng kiến trúc đã xác nhận.**
> Theo DEC-044, bỏ spike M1; GATE-01 và các TBD kỹ thuật vẫn mở.
> Lát cắt frontend hiện tại không kết nối API/dữ liệu/Auth và không chứng minh quyền.

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
- Backend: Spring Boot, Java 21 LTS, Maven; phiên bản Spring Boot cụ thể chưa chốt.
- PostgreSQL trên Supabase Cloud; tận dụng Auth, Data API, Storage, Realtime và RPC phù hợp.
- **Kiến trúc mục tiêu đã duyệt: 5 microservices**, mỗi service build/chạy/deploy độc lập:
  Catalog, Collection, Community, Notification và Account Administration.
- Mục tiêu microservices là làm quen hệ thống phân tán trong đồ án, không phải nhu cầu chịu tải đã đo.
- Supabase vẫn cung cấp Auth/Storage/Realtime/PostgreSQL, không tự xây Auth Service.
  Browser gọi Data API ở surface được service sở hữu cho phép; không dùng truy cập trực tiếp để bỏ qua nghiệp vụ.
- Hướng Spring chỉ xử lý quản trị trong bản nháp trước đã được thay thế; ownership và đường gọi mới ở
  [ARCHITECTURE](docs/ARCHITECTURE.md) đã review nhóm 2 nhưng các lựa chọn/TBD vẫn cần chốt.
- Đã chọn schema/role riêng cùng DB, ưu tiên Data API/RPC; scoped authorization còn phải chứng minh.
  GATE-01 chỉ chặn triển khai persistence/quyền phụ thuộc proof, không dừng P02/P03 hay thiết kế độc lập.
- Đã chọn HTTP outbox/inbox, HTTPS/HMAC theo cặp và helper quyền chỉ đọc của Account Administration.
- Public SSR React/Vite, private CSR; upload private staging → Catalog validate → ảnh public.
  Không tự thêm Gateway/broker; hosting miễn phí cho năm service và SSR chưa được kiểm chứng.

Chi tiết kỹ thuật, đường API và schema chưa được thiết kế thành baseline.
Đã bắt đầu lát cắt frontend Catalog discovery/SSR theo DEC-044; đây chưa phải ứng dụng
đầy đủ và chưa kết nối Catalog API, dữ liệu, Auth, RLS hoặc bất kỳ service nào.
Các component discovery, detail và editorial hiện mới là presentation slice; chưa có route
nội dung hoặc dữ liệu runtime.

## Bản đồ tài liệu và nguồn chuẩn

| Tài liệu | Trách nhiệm / nguồn chuẩn | Trạng thái |
| --- | --- | --- |
| [AGENTS.md](AGENTS.md) | Quyền thao tác và quy tắc làm việc của agent | Nhóm 1 đã duyệt |
| [docs/PRD.md](docs/PRD.md) | Phạm vi, requirement ID và acceptance nghiệp vụ | Nhóm 1 đã duyệt |
| [docs/DOMAIN.md](docs/DOMAIN.md) | Thuật ngữ, quan hệ và business rules | Nhóm 1 đã duyệt; câu hỏi mở vẫn mở |
| [docs/APP-FLOWS.md](docs/APP-FLOWS.md) | Luồng người dùng, điều hướng, trạng thái UI | Nhóm 1 đã duyệt; đề xuất ghi rõ chưa chốt vẫn chờ duyệt |
| [docs/DECISIONS.md](docs/DECISIONS.md) | Quyết định, bằng chứng, câu hỏi mở và tiến độ review | Sổ cập nhật; phân biệt từng trạng thái |
| [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) | Thành phần, trust boundaries và đường gọi | Nhóm 2 đã review; TBD vẫn mở |
| [docs/TRD.md](docs/TRD.md) | Phiên bản, tích hợp và yêu cầu kỹ thuật | Nhóm 2 đã review; TBD vẫn mở |
| [docs/DATABASE.md](docs/DATABASE.md) | Thiết kế dữ liệu, constraints, indexes và ownership | Nhóm 2 đã review; TBD vẫn mở |
| [docs/API.md](docs/API.md) | Hợp đồng Data API, RPC và Spring đề xuất | Nhóm 2 đã review; TBD vẫn mở |
| [docs/SECURITY.md](docs/SECURITY.md) | Permission matrix, Auth/RLS/Storage và đặc quyền | Nhóm 2 đã review; TBD vẫn mở |
| [DESIGN.md](DESIGN.md) | Hướng thiết kế riêng, tokens, components và accessibility | Nhóm 2 đã review; TBD vẫn mở |
| [docs/TEST-STRATEGY.md](docs/TEST-STRATEGY.md) | Chiến lược kiểm thử và Definition of Done | Nhóm 3 đã duyệt; có test frontend slice, chưa test tích hợp |
| [docs/OPERATIONS.md](docs/OPERATIONS.md) | Môi trường, email, migration, deploy và recovery | Nhóm 3 đã duyệt; chưa quyền vận hành Cloud |
| [Kế hoạch B1](docs/superpowers/plans/2026-11-23-baseline-and-delivery.md) | Preparation, gate, dependency và các milestone đầy đủ | Jira timeline GRAB-3..10; spike bỏ theo DEC-044 |

Các dòng chưa viết là kế hoạch tài liệu, không phải file hoặc thiết kế đã hoàn thành.
README chỉ là tổng quan và bản đồ; không là bản sao đầy đủ của PRD.
Jira theo dõi timeline/dependency; trạng thái To Do không chứng minh chưa có công việc.
Đối chiếu gần nhất ghi tại DECISIONS và kế hoạch B1; không tự chuyển issue sang Done.
Spec Kit chưa được xác minh/cài đặt; chưa có artifact nào của Spec Kit là nguồn chuẩn.

## Thứ tự và điểm dừng

1. Nhóm sản phẩm/quy tắc đã được duyệt; TBD không tự trở thành quyết định.
2. Nhóm thiết kế đã được duyệt để tiếp tục; chốt riêng các phương án/TBD trước implementation.
3. Nhóm kiểm chứng/vận hành đã duyệt; baseline B1 không đóng các gate chưa có proof.
4. Kế hoạch B1 đã duyệt; Jira GRAB-3..GRAB-10 theo dõi timeline.
5. Spike M1 đã được bỏ theo DEC-044; không có proof GATE-01.
6. Triển khai các lát cắt độc lập; dừng persistence/quyền tại gate và xin duyệt thao tác Cloud riêng.

Không tự commit/push, deploy, tạo issue hoặc thao tác ghi Cloud.
