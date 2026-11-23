# Quyết định, câu hỏi mở và review

**Trạng thái:** DRAFT nhóm 1. Ngày tổng hợp: 2026-11-23.
Các mục “đã xác nhận” phản ánh phát biểu/chấp thuận trong hội thoại, không có nghĩa tài liệu
đã được duyệt baseline. Chủ dự án chưa duyệt nhóm tài liệu này.

## 1. Nguồn chuẩn

- Phạm vi/acceptance: PRD; thuật ngữ/business rules: DOMAIN; luồng: APP-FLOWS.
- File này giữ lịch sử, tình trạng phê duyệt, evidence và câu hỏi mở; không sao chép toàn bộ đặc tả.
- Tài liệu kiến trúc/kỹ thuật là nhóm 2; test/vận hành là nhóm 3, chưa viết.
- Chưa có Jira issue hoặc artifact Spec Kit được tạo trong công việc này.
- Chưa tạo `docs/adr/`; chỉ tách ADR khi cần ghi quyết định kiến trúc đủ lớn, tránh file lặp.

## 2. Quyết định đã xác nhận

Tất cả dưới đây được xác nhận trong cuộc trao đổi khởi tạo ngày 2026-11-23 theo ngày phiên làm việc.
Không giả định có phê duyệt độc lập cho các chi tiết triển khai chưa trình.

| ID | Quyết định | Lý do/bối cảnh |
| --- | --- | --- |
| DEC-001 | Dự án mới, không kế thừa sản phẩm/kiến trúc/Jira cũ | Chủ dự án yêu cầu thiết lập lại phạm vi |
| DEC-002 | Repo local `D:\Projects\GRABMEFOOD` | Chủ dự án xác nhận đường dẫn |
| DEC-003 | Sinh viên quanh Làng Đại học ĐHQG TP.HCM; đồ án trước, công khai sau | Không có deadline; nhanh nhưng không ẩu; chỉ miễn phí |
| DEC-004 | Quán là điểm khám phá chính, món thuộc một quán và có trang riêng | User điều chỉnh luồng theo tham chiếu Michelin |
| DEC-005 | Không khách sạn/đặt bàn; các chức năng khác theo danh sách đã chốt | Không dùng “giống Michelin” thay đặc tả; nhận diện riêng |
| DEC-006 | Nhiều bộ sưu tập riêng tư, tách quán/món; cùng mục có thể ở nhiều bộ | Không chia sẻ công khai |
| DEC-007 | Random đã lưu, toàn bộ hoặc tự chọn mục; có thể lặp; toàn bộ khử trùng | Bỏ mục không khả dụng; tập rỗng báo và gợi ý chọn lại |
| DEC-008 | Email/mật khẩu + Google; xác thực email và khôi phục mật khẩu | Khách vẫn đọc nội dung; thao tác cá nhân cần tài khoản |
| DEC-009 | Tìm tên quán/món trả quán, có lọc khu vực | Không duyệt lọc giá/nhóm món |
| DEC-010 | Có bài viết, danh sách tuyển chọn; chỉ admin quản lý nội dung | Dữ liệu chuẩn bị trước |
| DEC-011 | Bình luận chữ quán/món, không điểm; công khai ngay, reply một cấp | Chủ sửa/xóa của mình; admin xóa mọi bình luận |
| DEC-012 | Việt/Anh cho giao diện/nội dung biên tập; không tự dịch bình luận | Ưu tiên máy tính, điện thoại dùng được; cần SEO/preview chia sẻ |
| DEC-013 | Tên/địa chỉ quán thật tham chiếu Maps; mô tả/món/giá có thể giả lập | Thay quyết định quán hoàn toàn hư cấu; giữ nhãn demo |
| DEC-014 | Ảnh có quyền phù hợp, không có thì ảnh AI; AI không tích hợp runtime | Không mặc định được lấy ảnh từ Maps/Michelin |
| DEC-015 | Bản đồ trong trang quán, nút mở Google Maps ở góc | Cách tích hợp miễn phí chưa chốt |
| DEC-016 | Có khu quản trị; khóa/mở/xóa user | Khóa giữ dữ liệu, chặn cả phiên đang mở; xóa cả dữ liệu riêng/bình luận |
| DEC-017 | Chuông realtime, chấm đỏ chưa đọc, mở một mục đánh dấu đọc; có đọc tất cả | Năm loại sự kiện theo DOMAIN; admin gửi riêng/toàn bộ; chỉ trong web |
| DEC-018 | React + TS + Vite; Spring Boot; Java 21 LTS + Maven; PostgreSQL Supabase | Không bỏ Spring hoặc tự thêm hạ tầng lớn |
| DEC-019 | Browser dùng Supabase trực tiếp; RPC cho transaction; Spring đặc quyền | Ưu tiên capability có sẵn; chưa cần Edge Functions/JDBC runtime |
| DEC-020 | Công khai/ẩn/xóa, không nháp | Thay đề xuất workflow nháp chưa được duyệt vì user thấy rườm rà |
| DEC-021 | Ẩn quán kéo theo tính không khả dụng của món | Giữ marker; loại khỏi tìm kiếm/random |
| DEC-022 | Xóa quán kéo theo món, comment/reply; xóa món kéo theo comment/reply | Giữ dấu “Không còn khả dụng” trong bộ sưu tập |
| DEC-023 | Duyệt đề cương 3 nhóm và bắt đầu nhóm 1 | Chưa duyệt baseline, Jira, spike hoặc triển khai |

### Hướng kiến trúc đã duyệt, chưa là thiết kế chi tiết

- Browser → Auth cho đăng ký/đăng nhập/khôi phục.
- Browser → Data API cho đọc công khai, tìm kiếm, bộ sưu tập/mục lưu, đọc và đánh dấu thông báo.
- Browser → Storage theo policy; Browser → Realtime cho thông báo riêng.
- RPC xử lý thao tác nguyên tử gắn thay đổi dữ liệu với thông báo, ví dụ reply, gỡ nội dung, công bố món.
- Spring xác thực quyền admin, gọi Auth Admin API cho quản lý tài khoản và điều phối dữ liệu ứng dụng;
  gửi thông báo quản trị riêng/toàn bộ.
- Hướng runtime: Auth Admin API + Data API/RPC; không ghép nhiều HTTP request rồi gọi là transaction.
- Auth Admin API và transaction dữ liệu ứng dụng không nguyên tử chung; cần retry/xử lý thất bại một phần.
- Migration/admin có thể dùng đường kết nối/secret khác; không hứa không cần DB password.

## 3. Điều đã kiểm chứng và giới hạn bằng chứng

Đây là ảnh chụp trạng thái lúc khảo sát, không là cam kết tài nguyên không thay đổi.

| Hạng mục | Evidence chỉ đọc trong phiên | Chưa chứng minh |
| --- | --- | --- |
| Repo | Remote đúng `https://github.com/HuyTony2703/GRABMEFOOD.git`; lúc bắt đầu chỉ `.git`, không tracked file; Git sạch trên `main` | Không có code/build/test sản phẩm |
| Jira | Site `huyngocto12356.atlassian.net`; project `GRAB`, ID `10066`, business/next-gen; issue count 0 theo insight | Không thử ghi issue |
| Jira types/status | Task `10067`, Sub-task `10068`; To Do `10066`, Done `10067` | Không suy ra transition graph đầy đủ hoặc có Epic/Story |
| Jira permissions | Project xuất hiện khi lọc action `create` và `edit` | Chưa xác minh quyền admin, đổi workflow/types, delete/transition |
| Supabase target | API URL trả `https://bdhavbwmxbttymerizvx.supabase.co` | Không phải test Data API qua browser |
| Supabase dữ liệu | `public` không có bảng theo list_tables; aggregate Auth users 0, buckets 0, objects 0 | Không khẳng định toàn DB trống hoặc disposable |
| Supabase function | Có `public.rls_auto_enable()`, SECURITY DEFINER, returns event_trigger, gắn `ensure_rls` | Chưa xác định nguồn tạo/lịch sử migration hoặc khả năng gọi qua Data API |
| SMTP | Chủ dự án báo đã cấu hình và sẽ sử dụng | Không đọc/đổi secret, chưa gửi email kiểm chứng |
| Auth/RLS/Spring | Chưa có test thực tế | Không tuyên bố hệ thống hoạt động |

Security Advisor ghi nhận cảnh báo quyền EXECUTE của function trên cho anon/authenticated:
[anon](https://supabase.com/docs/guides/database/database-linter?lint=0028_anon_security_definer_function_executable),
[authenticated](https://supabase.com/docs/guides/database/database-linter?lint=0029_authenticated_security_definer_function_executable).
Do function trả event_trigger, không suy ra ngay cảnh báo đồng nghĩa endpoint khai thác được.
Chưa sửa grants/function/trigger; cần đánh giá riêng và xin quyền nếu phải thay đổi.

### Tài liệu ngoài đã tham khảo

- [Michelin Vietnam restaurants](https://guide.michelin.com/en/vn/restaurants):
  nội dung search index cho thấy các nhóm lọc; công cụ đọc trực tiếp chưa trả nội dung hữu ích.
  **Chưa kiểm thử tương tác UI/gợi ý tìm kiếm thực tế**.
- [Trung tâm quản lý KTX](https://ktxhcm.edu.vn): tham chiếu KTX A/B.
- [Thanh Niên — chợ đêm Làng Đại học](https://thanhnien.vn/thien-duong-mua-sam-o-lang-dai-hoc-bong-dung-diu-hiu-185230816194331647.htm):
  tham chiếu địa danh, không chứng minh hiện trạng từng quán.
- [Supabase pricing](https://supabase.com/pricing), [SMTP](https://supabase.com/docs/guides/auth/auth-smtp),
  [Realtime authorization](https://supabase.com/docs/guides/realtime/authorization): đã đọc tài liệu trong phiên.
  Không thay cho kiểm tra plan/quota hoặc cấu hình thực của project.
- SMTP mặc định được tài liệu mô tả giới hạn địa chỉ và 2 email/giờ; không áp giới hạn này như kết luận
  cho SMTP riêng của chủ dự án khi chưa kiểm tra provider/rate limit.
- Realtime authorization có cache quyền; không coi ngắt UI hoặc thu hồi Auth là đủ để bảo đảm khóa tức thì.

### Công cụ/skill

- Đã dùng filesystem/Git read-only, web tools, Atlassian MCP read-only và Supabase MCP read-only.
- Đã nạp brainstorming và UI UX Pro Max; không chạy bộ script nghiên cứu UX của skill.
- Writing-plans đã nạp khi bắt đầu viết tài liệu; **chưa lập kế hoạch triển khai**, không dùng skill này
  để bỏ qua duyệt thiết kế.
- Chưa xác minh/cài GitHub Spec Kit hoặc Supabase agent skills.
- Không cài package/công cụ, không thay cấu hình OpenCode, không chạy Supabase CLI/initializer.

## 4. Câu hỏi mở và đề xuất chờ duyệt

Không cần hỏi tất cả ngay; giải quyết theo nhóm trước khi thiết kế/triển khai phần liên quan.

| ID | Chưa xác định | Điểm cần chốt |
| --- | --- | --- |
| OQ-01 | Phiên bản Spring Boot, Node/package manager, thư viện và test tools | Nhóm 2; Java 21/Maven không hỏi lại |
| OQ-02 | Vite + SEO/preview, URL hai ngôn ngữ, fallback khi thiếu bản dịch | Nhóm 2; không tự đổi sang Next.js |
| OQ-03 | Tích hợp map miễn phí, nguồn tên/địa chỉ, điều kiện sử dụng | Trước thu thập dữ liệu/khởi tạo key; không mặc định scrape |
| OQ-04 | Nội dung trường quán/món, số lượng seed, nguồn/quyền ảnh | Trước chuẩn bị dataset; không tự suy ra từ Michelin |
| OQ-05 | Gán khu vực, trùng khu vực và taxonomy | Danh mục 3 nhóm do agent chọn là danh mục ban đầu, không địa giới |
| OQ-06 | Chọn một bộ khi random có còn là chế độ riêng? Xác suất và trường hợp mục bị gỡ đồng thời | Trước thiết kế random |
| OQ-07 | Đổi tên/xóa bộ, tên trùng/giới hạn tên, bỏ lưu | Gom đề xuất UI + business rules |
| OQ-08 | Xóa comment gốc có reply người khác, giới hạn chữ/số bình luận | Trước triển khai bình luận |
| OQ-09 | Thông báo: khử trùng/retry, tự reply, món mới đang ẩn, gửi mọi user gồm user khóa? | Trước schema/logic thông báo |
| OQ-10 | Đích thông báo đã xóa, retention, nhiều tab và mất kết nối | Nhóm thiết kế thông báo |
| OQ-11 | Tạo admin đầu, tự khóa/xóa, bảo vệ admin cuối; user tự xóa tài khoản? | Chưa tự thêm quyền; trước thiết kế quyền |
| OQ-12 | Xóa user: dữ liệu thông báo/reply người khác; cleanup Auth/Storage lỗi một phần | Trước workflow xóa |
| OQ-13 | Công khai lại quán/món; marker giữ trường gì, bao lâu | Trước schema vòng đời |
| OQ-14 | Account linking email/Google, OAuth config, provider SMTP/quota | Khảo sát không lộ secret; chỉ test khi duyệt target |
| OQ-15 | Môi trường dev/test, hosting miễn phí, backup/recovery, RPO/RTO và mục tiêu hiệu năng | Nhóm 3; chưa deploy |
| OQ-16 | Chi tiết Data API/RPC/Spring, schema RLS và quyền Realtime khi khóa user | Nhóm 2; không xem hướng đã duyệt là test đã đạt |
| OQ-17 | Jira hierarchy/transition graph/admin permission còn thiếu | Không tự tạo issue thử hoặc đổi project để kiểm chứng |
| OQ-18 | Có dùng Spec Kit không; có cài Supabase skill không | Trình nguồn/lệnh/phạm vi và xin phép trước |

Các trạng thái loading/error/empty trong APP-FLOWS là đề xuất thiết kế cần review; không tự chốt copy.
Wireframe, design tokens và acceptance UI chi tiết chưa có; không tuyên bố đã tái tạo giao diện Michelin.

## 5. Checklist và điểm dừng

- [x] Xác nhận repo và khảo sát Git/cấu trúc chỉ đọc.
- [x] Làm rõ phạm vi chính, ranh giới kiến trúc cấp cao và ngân sách.
- [x] Khảo sát Jira/Supabase tối thiểu; ghi rõ các giới hạn.
- [x] Chủ dự án duyệt danh sách tài liệu, nguồn chuẩn và thứ tự ba nhóm.
- [x] Soạn bản nháp nhóm 1: README, AGENTS, PRD, DOMAIN, APP-FLOWS, DECISIONS.
- [x] Kiểm tra tĩnh nhóm 1: 6 file có nhãn DRAFT, 10 link Markdown local hợp lệ,
  29 requirement ID và 35 rule ID không trùng; không thấy trailing whitespace hoặc mẫu credential
  trong phép quét đã chạy. Không thay cho kiểm toán secret đầy đủ hoặc duyệt nội dung của chủ dự án.
- [x] Kiểm tra Git: chỉ có các tài liệu mới chưa tracked; `git diff --check` không báo lỗi.
  Nội dung file untracked đã kiểm tra riêng, không suy ra từ lệnh diff.
- [ ] Chủ dự án review/duyệt nhóm 1.
- [ ] Viết và duyệt nhóm 2.
- [ ] Viết và duyệt nhóm 3; xác lập baseline.
- [ ] Trình kế hoạch và Jira để duyệt trước khi tạo issue.
- [ ] Duyệt target/phạm vi/tác động/cleanup của spike trước chạy.
- [ ] Chủ dự án chọn lát cắt đầu tiên.

Không có commit, push, deploy, migration, seed hay Jira write nào được cho phép bởi checklist này.
