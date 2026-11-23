# PRD — GrabMeFood

**Trạng thái:** Nhóm 1 được chủ sản phẩm duyệt ngày 2026-11-23.
Phần đã xác nhận thuộc baseline B1; các gate/TBD vẫn cần quyết định hoặc evidence riêng.
**Bổ sung đã duyệt:** mục tiêu kiến trúc 5 microservices để học hệ thống phân tán.
Giữ 29 requirement ID; bổ sung acceptance đã được xác nhận cho comment, notification, admin và progress xóa.
**Ngày soạn:** 2026-11-23.
**Nguồn:** các quyết định trong cuộc trao đổi khởi tạo; xem [DECISIONS.md](DECISIONS.md).
Requirement ID là mã tổ chức bản nháp, không phải issue Jira đã tạo.

## 1. Mục tiêu và người dùng

Giúp sinh viên quanh Làng Đại học ĐHQG TP.HCM khám phá quán và món dân dã, lưu lựa chọn riêng,
và chọn ngẫu nhiên từ các mục đã lưu khi chưa biết ăn gì.
Bản đầu phục vụ đồ án/test khả năng làm website; triển khai công khai sau là bước xin duyệt riêng.
Không có deadline cố định; ưu tiên nhanh nhưng không bỏ kiểm chứng. Ngân sách chỉ miễn phí.

Michelin Guide là tham chiếu bố cục, trải nghiệm và loại nội dung. Phạm vi là các yêu cầu cụ thể
bên dưới, không phải mọi tính năng hiện tại hoặc tương lai của Michelin.

## 2. Actors

| Actor | Phạm vi nghiệp vụ đã xác nhận |
| --- | --- |
| Khách | Xem và tìm nội dung công khai, xem bản đồ/liên kết quán |
| Người dùng | Quyền của khách; lưu, bộ sưu tập riêng, random, bình luận/trả lời, thông báo cá nhân |
| Quản trị viên | Quản lý nội dung, xóa bình luận; khóa/mở/xóa tài khoản; gửi thông báo |

Admin không tự khóa/xóa mình hoặc admin active cuối cùng. Chủ dự án chỉ định admin đầu và duyệt
thao tác cấp riêng; danh tính/cách bootstrap thực tế còn cần xác nhận.

## 3. Yêu cầu và acceptance nghiệp vụ

### Khám phá và nội dung

| ID | Yêu cầu | Acceptance cần chứng minh |
| --- | --- | --- |
| REQ-EXP-01 | Khám phá lấy quán làm trung tâm | Từ danh sách mở được quán, từ quán mở được món thuộc quán đó; quán/món có trang riêng |
| REQ-EXP-02 | Tìm theo tên quán hoặc tên món | Kết quả chính là quán; nếu khớp món thì thẻ quán thể hiện món phù hợp; không có kết quả phải có trạng thái rõ |
| REQ-EXP-03 | Lọc khu vực | Người dùng chọn khu vực và chỉ thấy quán phù hợp; không tự thêm lọc giá/nhóm món |
| REQ-EXP-04 | Bản đồ ở chi tiết quán | Có bản đồ hiển thị vị trí và nút “Xem trên Google Maps” ở góc, mở đúng quán; provider/cách nhúng miễn phí chờ thiết kế |
| REQ-CNT-01 | Bài viết ẩm thực và danh sách tuyển chọn | Khách xem được nội dung công khai do quản trị viên đăng; có các danh sách theo chủ đề |
| REQ-CNT-02 | Nội dung demo chuẩn bị sẵn | Có nhãn demo; mô tả/món/giá tạo sẵn không bị trình bày như dữ kiện đã kiểm chứng của quán thật |
| REQ-CNT-03 | Nguồn ảnh phù hợp | Mỗi ảnh có nguồn/quyền sử dụng hoặc nguồn AI; ảnh minh họa không ngụ ý ảnh thực tế; không cần tích hợp AI runtime |
| REQ-UX-01 | Tiếng Việt và tiếng Anh | Menu/nút và nội dung quán/món/bài viết có hai bản; bình luận giữ nguyên ngôn ngữ người viết, không tự dịch |
| REQ-UX-02 | Ưu tiên máy tính, điện thoại dùng được | Các luồng chính không bị chặn bởi bố cục trên điện thoại; kích thước nghiệm thu cụ thể chờ DESIGN |
| REQ-UX-03 | SEO và chia sẻ | Trang quán/món/bài viết công khai có tiêu đề, mô tả, ảnh xem trước đúng nội dung khi đọc link; không cam kết Google index ngay |

Danh mục khu vực ban đầu do agent chọn theo quyền nghiên cứu được giao:
**Quanh KTX khu A; Quanh KTX khu B; Quanh chợ đêm Làng Đại học.**
Đây là nhóm khám phá, không phải địa giới hành chính hay ranh giới bán kính đã kiểm chứng.
Quy tắc gán quán vào nhóm và xử lý chồng lấn còn TBD.

### Tài khoản và dữ liệu riêng

| ID | Yêu cầu | Acceptance cần chứng minh |
| --- | --- | --- |
| REQ-AUTH-01 | Email/mật khẩu và Google | Hai cách đăng nhập hoạt động; đăng ký email phải xác thực trước đăng nhập; có khôi phục mật khẩu |
| REQ-AUTH-02 | Nội dung công khai không cần đăng nhập | Khách khám phá được; lưu/bộ sưu tập/random/bình luận yêu cầu tài khoản |
| REQ-SAV-01 | Nhiều bộ sưu tập riêng tư, tách loại | Mỗi bộ chỉ chứa quán hoặc chỉ chứa món; user A không xem/sửa bộ sưu tập của B |
| REQ-SAV-02 | Một mục có thể ở nhiều bộ | Cùng quán/món lưu được vào nhiều bộ phù hợp; không nhân bản chính quán/món |
| REQ-RND-01 | Chỉ random dữ liệu đã lưu | Tách quán/món; chọn toàn bộ mục đã lưu hoặc tự chọn các mục tham gia; không lấy mục chưa lưu |
| REQ-RND-02 | Random được lặp, không tăng trọng số vì nhiều bộ | Lượt sau có thể trả lại mục trước; cùng mục trong nhiều bộ chỉ tính một lần khi random toàn bộ |
| REQ-RND-03 | Bỏ qua mục không khả dụng | Mục bị ẩn/xóa không xuất hiện trong kết quả; rỗng hoặc không còn mục hợp lệ phải thông báo và gợi ý chọn lại |

### Bình luận và thông báo

| ID | Yêu cầu | Acceptance cần chứng minh |
| --- | --- | --- |
| REQ-COM-01 | Bình luận chữ trên cả quán và món | Người đăng nhập gửi được, công khai ngay, không điểm số và không duyệt trước |
| REQ-COM-02 | Trả lời một cấp | User/admin trả lời được; không tạo cây trả lời nhiều tầng |
| REQ-COM-03 | Quyền sửa/xóa | User chỉ sửa/xóa của mình; admin xóa mọi bình luận, không sửa lời người khác; xóa parent cascade replies kể cả người khác |
| REQ-NOT-01 | Năm loại thông báo trong website | Năm loại theo DOMAIN; không self-reply, dedup nhiều bộ, món/quán public; thông báo saved-target/món mới cần save ở cả hai mốc sự kiện và gửi |
| REQ-NOT-02 | Realtime và chuông | Thông báo mới tự cập nhật khi đang mở web; có chưa đọc thì chấm đỏ, hết chưa đọc thì bỏ chấm |
| REQ-NOT-03 | Đọc thông báo | Bấm chuông thấy danh sách; bấm một mục đánh dấu đã đọc và mở nội dung liên quan; có “Đánh dấu tất cả đã đọc”; chỉ xem/sửa trạng thái thông báo của mình |
| REQ-NOT-04 | Admin gửi thông báo | Gửi riêng hoặc toàn bộ; broadcast chỉ active users; user thường không tự gửi thông báo hệ thống |

Không gửi email/push cho thông báo sản phẩm. Email xác thực và khôi phục là luồng Auth riêng.
Đích mở khi nội dung liên quan đã xóa, retention và chi tiết xử lý thời gian vẫn TBD;
không hỏi lại các quy tắc recipient đã chốt trong DOMAIN.

### Quản trị và vòng đời dữ liệu

| ID | Yêu cầu | Acceptance cần chứng minh |
| --- | --- | --- |
| REQ-ADM-01 | Trang quản trị trong website | Chỉ admin quản lý quán, món, bài viết, danh sách tuyển chọn và xóa bình luận; user thường bị từ chối cả qua API |
| REQ-ADM-02 | Công khai / ẩn / xóa, không nháp | Không nháp; ẩn giữ dữ liệu; xóa quán kéo theo món/comments; chặn đọc trước, báo đang xử lý và chỉ hoàn tất khi đủ receipts |
| REQ-ADM-03 | Dấu mục không khả dụng | Ẩn/xóa quán/món không làm mất dấu trong bộ sưu tập; hiển thị “Không còn khả dụng”; ẩn quán làm các món của quán không khả dụng |
| REQ-ADM-04 | Khóa/mở khóa tài khoản | Khóa giữ dữ liệu và chặn cả phiên cũ; vẫn đọc public; mở cho dùng lại; không tự khóa hoặc vô hiệu hóa admin active cuối |
| REQ-ADM-05 | Xóa tài khoản | Xóa dữ liệu riêng/comment và replies dưới comment gốc kể cả người khác; không ẩn danh giữ lại; tiến trình partial không báo thành công |

## 4. Ràng buộc đã xác nhận

- Công nghệ và hướng phân chia: xem README và DECISIONS; thiết kế chi tiết ở nhóm 2.
- 5 service: Catalog, Collection, Community, Notification, Account Administration; Supabase Auth giữ nguyên.
  Mỗi service triển khai độc lập; schema/role riêng cùng DB đã chọn, không tự thêm Gateway/broker.
- Ưu tiên Data API/RPC; shared read-only permission function; HTTP outbox/inbox + HTTPS/HMAC.
  Scope credential cần evidence, không tự fallback JDBC. Public SSR React/Vite; private CSR.
- Ảnh đích public, URL cũ có thể tồn tại khi hide; upload private staging, Catalog validate rồi public.
- Tên/địa chỉ quán thật tham chiếu từ Google Maps; không đồng nghĩa quyền scrape hoặc tái sử dụng mọi dữ liệu.
- Nội dung và ảnh chuẩn bị trước; không có nút tích hợp AI trong quản trị.
- SMTP do chủ dự án cho biết đã cấu hình; chưa kiểm chứng gửi email.
- Không chi phí; không tự thay đổi Cloud hay phát hành.

## 5. Ngoài phạm vi

- Khách sạn, đặt bàn, đặt món, giao hàng, thanh toán.
- Chấm điểm cộng đồng, hệ thống sao/chứng nhận, sao chép phân hạng Michelin.
- Ứng dụng mobile riêng, AI runtime, email/push thông báo sản phẩm.
- Lọc giá/nhóm món và tính năng Michelin khác chưa được xác nhận.
- Tự động thu thập ảnh/review Google Maps, tự dịch bình luận.

## 6. Những việc chưa được quyết định

Danh sách câu hỏi mở được quản lý tập trung tại DECISIONS, không biến thành acceptance ngầm.
Progress xóa đã chốt; còn độ trễ, recovery/retention và wire contracts cần kiểm chứng/chốt.
Chọn microservices không có nghĩa chấp nhận payload ẩn còn đọc được (không tính URL ảnh public đã chấp thuận), random
ra mục đã gỡ, hoặc báo “đã xóa hoàn tất” khi service khác chưa cleanup.
Các acceptance trên là mục tiêu kiểm chứng đã duyệt, **chưa phải kết quả test đã đạt**.
