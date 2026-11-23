# PRD — GrabMeFood

**Trạng thái:** DRAFT nhóm 1, chờ chủ sản phẩm review; chưa là baseline.
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

Cách cấp quản trị viên đầu tiên và giới hạn thao tác giữa các quản trị viên: TBD.

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
| REQ-COM-03 | Quyền sửa/xóa | User chỉ sửa/xóa nội dung của mình; admin xóa được mọi bình luận; không mặc định admin được sửa lời người khác |
| REQ-NOT-01 | Năm loại thông báo trong website | Có thông báo mục đã lưu không khả dụng, bình luận bị admin xóa, admin gửi, bình luận được reply, quán đã lưu thêm món |
| REQ-NOT-02 | Realtime và chuông | Thông báo mới tự cập nhật khi đang mở web; có chưa đọc thì chấm đỏ, hết chưa đọc thì bỏ chấm |
| REQ-NOT-03 | Đọc thông báo | Bấm chuông thấy danh sách; bấm một mục đánh dấu đã đọc và mở nội dung liên quan; có “Đánh dấu tất cả đã đọc”; chỉ xem/sửa trạng thái thông báo của mình |
| REQ-NOT-04 | Admin gửi thông báo | Gửi riêng một tài khoản hoặc toàn bộ người dùng; người dùng thường không tự gửi thông báo hệ thống |

Không gửi email/push cho thông báo sản phẩm. Email xác thực và khôi phục là luồng Auth riêng.
Đích mở khi nội dung liên quan đã xóa và phạm vi người nhận cho các trường hợp biên: TBD.

### Quản trị và vòng đời dữ liệu

| ID | Yêu cầu | Acceptance cần chứng minh |
| --- | --- | --- |
| REQ-ADM-01 | Trang quản trị trong website | Chỉ admin quản lý quán, món, bài viết, danh sách tuyển chọn và xóa bình luận; user thường bị từ chối cả qua API |
| REQ-ADM-02 | Công khai / ẩn / xóa, không nháp | Không có bước duyệt/nháp; ẩn không xóa dữ liệu; xóa quán kéo theo món và bình luận/trả lời liên quan |
| REQ-ADM-03 | Dấu mục không khả dụng | Ẩn/xóa quán/món không làm mất dấu trong bộ sưu tập; hiển thị “Không còn khả dụng”; ẩn quán làm các món của quán không khả dụng |
| REQ-ADM-04 | Khóa/mở khóa tài khoản | Khóa giữ dữ liệu, chặn đăng nhập và thao tác cần tài khoản từ cả phiên đang mở; vẫn xem như khách; mở khóa cho sử dụng lại |
| REQ-ADM-05 | Xóa tài khoản | Xóa tài khoản, bộ sưu tập, mục đã lưu và bình luận/trả lời của người đó; không giữ bình luận dưới tên ẩn danh |

## 4. Ràng buộc đã xác nhận

- Công nghệ và hướng phân chia: xem README và DECISIONS; thiết kế chi tiết ở nhóm 2.
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
Các acceptance trên là mục tiêu kiểm chứng của bản nháp, **chưa phải kết quả test đã đạt**.
