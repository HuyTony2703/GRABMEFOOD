# GrabMeFood

Website khám phá ẩm thực dân dã dành cho sinh viên quanh Làng Đại học ĐHQG TP.HCM.

> **Trạng thái: làm rõ và soạn tài liệu — chưa triển khai sản phẩm.**
> Nhóm tài liệu sản phẩm dưới đây là **DRAFT, chờ review**, chưa phải baseline được duyệt.
> Việc duyệt đề cương tài liệu không cấp quyền triển khai, tạo Jira hoặc thay đổi Cloud.

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
- Hướng phân chia đã duyệt: browser gọi Supabase trực tiếp cho luồng phù hợp;
  Spring xử lý quản trị đặc quyền và điều phối, không làm proxy cho mọi request.

Chi tiết kỹ thuật, đường API và schema chưa được thiết kế thành baseline.
Không có mã ứng dụng, migration, package hoặc lệnh chạy sản phẩm ở thời điểm này.

## Bản đồ tài liệu và nguồn chuẩn

| Tài liệu | Trách nhiệm / nguồn chuẩn | Trạng thái |
| --- | --- | --- |
| [AGENTS.md](AGENTS.md) | Quyền thao tác và quy tắc làm việc của agent | DRAFT |
| [docs/PRD.md](docs/PRD.md) | Phạm vi, requirement ID và acceptance nghiệp vụ | DRAFT |
| [docs/DOMAIN.md](docs/DOMAIN.md) | Thuật ngữ, quan hệ và business rules | DRAFT |
| [docs/APP-FLOWS.md](docs/APP-FLOWS.md) | Luồng người dùng, điều hướng, trạng thái UI | DRAFT |
| [docs/DECISIONS.md](docs/DECISIONS.md) | Quyết định, bằng chứng, câu hỏi mở và tiến độ review | DRAFT |
| `docs/ARCHITECTURE.md` | Thành phần, trust boundaries và đường gọi | Chưa viết — nhóm 2 |
| `docs/TRD.md` | Phiên bản, tích hợp và yêu cầu kỹ thuật | Chưa viết — nhóm 2 |
| `docs/DATABASE.md` | Thiết kế dữ liệu, constraints, indexes và ownership | Chưa viết — nhóm 2 |
| `docs/API.md` | Hợp đồng Data API, RPC và Spring đã được quyết định | Chưa viết — nhóm 2 |
| `docs/SECURITY.md` | Permission matrix, Auth/RLS/Storage và đặc quyền | Chưa viết — nhóm 2 |
| `DESIGN.md` | Hướng thiết kế riêng, tokens, components và accessibility | Chưa viết — nhóm 2 |
| `docs/TEST-STRATEGY.md` | Chiến lược kiểm thử và Definition of Done | Chưa viết — nhóm 3 |
| `docs/OPERATIONS.md` | Môi trường, email, migration, deploy và recovery | Chưa viết — nhóm 3 |

Các dòng chưa viết là kế hoạch tài liệu, không phải file hoặc thiết kế đã hoàn thành.
README chỉ là tổng quan và bản đồ; không là bản sao đầy đủ của PRD.
Jira sau này theo dõi công việc và evidence, không là bộ đặc tả cạnh tranh với docs.
Spec Kit chưa được xác minh/cài đặt; chưa có artifact nào của Spec Kit là nguồn chuẩn.

## Thứ tự và điểm dừng

1. Review nhóm sản phẩm/quy tắc hiện tại.
2. Khi được duyệt, viết và review nhóm thiết kế.
3. Viết và review kiểm chứng/vận hành.
4. Duyệt baseline và kế hoạch; đề xuất Jira trước khi tạo.
5. Duyệt spike kết nối có target, tác động và cleanup rõ ràng.
6. Triển khai theo lát cắt do chủ sản phẩm chọn.

Không tự commit/push, deploy, tạo issue hoặc thao tác ghi Cloud.
