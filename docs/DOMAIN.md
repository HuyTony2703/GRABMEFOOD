# Domain — GrabMeFood

**Trạng thái:** Baseline nghiệp vụ B1, tổng hợp các xác nhận ngày 2026-11-23; chưa là SQL.
Các OPEN QUESTION/TBD giữ nguyên trạng thái mở.
Nguồn chuẩn cho thuật ngữ và business rules; phạm vi tính năng ở [PRD.md](PRD.md).

## 1. Thuật ngữ

| Khái niệm | Ý nghĩa |
| --- | --- |
| Quán (Restaurant) | Đơn vị khám phá chính, có trang chi tiết, thông tin tham chiếu vị trí và nhiều món |
| Món (Dish) | Món cụ thể của một quán; không phải danh mục món chung dùng chung giữa nhiều quán |
| Khu vực (Area) | Nhóm địa điểm phục vụ bộ lọc, không mặc định là ranh giới hành chính |
| Bài viết (Article) | Nội dung biên tập khám phá ẩm thực do admin quản lý |
| Danh sách tuyển chọn (Editorial selection) | Danh sách nội dung theo chủ đề do admin quản lý; không phải bộ sưu tập riêng của user |
| Bộ sưu tập (Collection) | Danh sách riêng tư của một người dùng, chỉ chứa quán hoặc chỉ chứa món |
| Mục đã lưu (Saved item) | Quan hệ lưu một quán/món vào bộ sưu tập; không tạo bản sao của quán/món |
| Dấu không khả dụng (Unavailable marker) | Dấu còn lại trong bộ sưu tập khi mục gốc bị ẩn/xóa; không có nghĩa được giữ toàn bộ nội dung đã xóa |
| Bình luận (Comment) | Nhận xét bằng chữ trên trang quán hoặc món; không điểm số |
| Trả lời (Reply) | Phản hồi một cấp dưới bình luận |
| Thông báo (Notification) | Mục trong hộp thông báo riêng của tài khoản, có trạng thái đã/chưa đọc |
| Công khai / Ẩn | Trạng thái hiển thị nội dung; “xóa” là thao tác riêng, không tự coi là một giá trị status DB |
| Khóa tài khoản | Ngưng quyền sử dụng tài khoản nhưng không xóa dữ liệu |

## 2. Quan hệ nghiệp vụ

```text
Quán ── có nhiều ──> Món
Quán ── được nhóm theo ──> Khu vực (số lượng quan hệ chờ thiết kế)

Người dùng ── sở hữu ──> Bộ sưu tập loại quán ── lưu ──> Quán
Người dùng ── sở hữu ──> Bộ sưu tập loại món  ── lưu ──> Món

Quán hoặc Món ── có ──> Bình luận ── có ──> Trả lời (một cấp)
Người dùng ── nhận ──> Thông báo cá nhân
Admin ── quản lý ──> Quán / Món / Bài viết / Danh sách tuyển chọn
```

Đây không phải ERD vật lý. Kiểu ID, FK, bảng, cardinality chưa chốt phải để thiết kế database quyết định.
“Cơm tấm — Quán A” và “Cơm tấm — Quán B” là hai món độc lập.

### Ranh giới nghiệp vụ đã duyệt bổ sung

| Service | Nguồn chuẩn nghiệp vụ |
| --- | --- |
| Catalog | Quán, món, khu vực, bài viết, danh sách tuyển chọn và tính khả dụng của nội dung |
| Collection | Bộ sưu tập, mục đã lưu và random |
| Community | Bình luận, trả lời và quyền tác giả |
| Notification | Inbox, trạng thái đọc và gửi thông báo |
| Account Administration | Quyền ứng dụng, khóa/mở/xóa tài khoản; điều phối Supabase Auth Admin |

Quan hệ nghiệp vụ trong sơ đồ không mặc định là FK, join hoặc cascade database giữa các service.
Supabase Auth là nguồn danh tính được tận dụng, không tự xây thêm Auth Service.
Schema/role riêng cùng Supabase DB, HTTP outbox/inbox, helper quyền chỉ đọc và HMAC đã được duyệt.
Chi tiết thực thi/proof vẫn chịu gate trong DECISIONS. Các BR dưới bao gồm bổ sung đã xác nhận,
không tự biến phương án kỹ thuật chưa chứng minh thành nghiệp vụ.

## 3. Business rules đã xác nhận

### Nội dung và quyền

- **BR-CNT-01:** Chỉ admin tạo/sửa/gỡ nội dung biên tập; user không đóng góp quán/món.
- **BR-CNT-02:** Nội dung có công khai/ẩn và thao tác xóa; không có nháp hoặc quy trình duyệt nội dung.
- **BR-CNT-03:** Khách đọc được nội dung công khai; dữ liệu riêng cần tài khoản hợp lệ.
- **BR-CNT-04:** Quán/món/bài viết có nội dung Việt/Anh; bình luận không tự dịch.
- **BR-CNT-05:** Mô tả/món/giá có thể là dữ liệu demo gắn tên/địa chỉ quán tham chiếu thật.
  Phải phân biệt nội dung giả lập và ảnh minh họa với thông tin thực tế.

### Bộ sưu tập và random

- **BR-SAV-01:** Một user có thể tạo nhiều bộ sưu tập riêng tư; mỗi bộ chỉ chứa một loại.
- **BR-SAV-02:** User khác không được xem hoặc sửa bộ sưu tập/mục đã lưu của chủ sở hữu.
- **BR-SAV-03:** Một quán/món có thể được lưu trong nhiều bộ của cùng user.
- **BR-RND-01:** Chỉ lấy từ dữ liệu đã lưu của user hiện tại; random quán và món tách riêng.
- **BR-RND-02:** Hai chế độ đã chốt gần nhất: toàn bộ mục đã lưu thuộc loại chọn;
  hoặc tập các mục đã lưu do user tự chọn.
- **BR-RND-03:** Không có cơ chế tránh lặp giữa các lượt.
- **BR-RND-04:** Random toàn bộ loại trừ trùng ID quán/món xuất hiện ở nhiều bộ.
- **BR-RND-05:** Mục không khả dụng không được tham gia; tập rỗng phải báo rõ và gợi ý chọn lại.

Trao đổi trước từng nêu chọn một bộ hoặc tất cả; sau đó user mô tả hai chế độ trên.
Việc chọn bộ là một nguồn/lối tắt riêng hay chỉ là cách lọc trước khi chọn mục vẫn là OPEN QUESTION;
không tự tạo thêm chế độ.
Phân phối xác suất chính xác chưa chốt; không diễn giải “ngẫu nhiên” thành cam kết fairness đã kiểm thử.

### Ẩn và xóa

- **BR-LIFE-01:** Ẩn quán không xóa quán/món; quán và các món thuộc nó không còn khả dụng công khai.
- **BR-LIFE-02:** Ẩn/xóa quán hoặc món vẫn giữ dấu trong các bộ sưu tập và thông báo không khả dụng.
- **BR-LIFE-03:** Xóa món xóa bình luận và trả lời liên quan.
- **BR-LIFE-04:** Xóa quán xóa các món thuộc quán và toàn bộ bình luận/trả lời liên quan.
- **BR-LIFE-05:** Không dùng marker làm lý do giữ nguyên nội dung đã xóa; trường dữ liệu tối thiểu cần giữ là TBD.
- **BR-LIFE-06:** Hành vi công khai lại quán, quyền khả dụng của món từng bị ẩn riêng và thời hạn marker: TBD.
- **BR-LIFE-07:** Xóa liên dịch vụ chặn hiển thị/sử dụng trước; UI hiện đang xử lý,
  chỉ báo hoàn tất khi đủ xác nhận cleanup, lỗi giữ chưa hoàn tất và retry an toàn.

### Bình luận

- **BR-COM-01:** Người đăng nhập hợp lệ bình luận được cả quán và món; hiển thị ngay, không chấm điểm.
- **BR-COM-02:** User sửa/xóa bình luận và trả lời của mình; admin có quyền xóa nội dung của mọi người.
- **BR-COM-03:** Có trả lời một cấp, không có cây reply lồng nhiều tầng.
- **BR-COM-04:** Xóa bình luận gốc xóa toàn bộ replies bên dưới, kể cả của người khác; không giữ thread marker.
- **BR-COM-05:** Giới hạn số lượng/độ dài bình luận còn TBD; không tự bổ sung chấm điểm hoặc ảnh.

### Tài khoản

- **BR-ACC-01:** Email/mật khẩu và Google; đăng ký email phải xác thực; có khôi phục mật khẩu.
- **BR-ACC-02:** Khóa giữ dữ liệu, chặn đăng nhập và thao tác cần tài khoản kể cả phiên hiện hữu.
- **BR-ACC-03:** Người bị khóa vẫn có thể xem nội dung công khai như khách.
- **BR-ACC-04:** Mở khóa cho sử dụng lại tài khoản; không tự phục hồi phiên đăng nhập cũ như một yêu cầu ngầm.
- **BR-ACC-05:** Xóa user xóa bộ sưu tập, mục lưu và bình luận/trả lời của user, không giữ bình luận ẩn danh.
- **BR-ACC-06:** Xóa tài khoản xóa bình luận của user cùng toàn bộ replies bên dưới, kể cả người khác;
  retention của notification/receipts/tombstone còn cần chốt, không tự giữ dữ liệu cá nhân vô hạn.
- **BR-ACC-07:** Admin không tự khóa/xóa chính mình.
- **BR-ACC-08:** Không được khóa/xóa admin hoạt động cuối cùng; phải kiểm tra cả operation cạnh tranh.
- **BR-ACC-09:** Admin đầu do chủ dự án chỉ định và cấp bằng thao tác được duyệt riêng; đăng ký không tự chọn role.

### Thông báo

- **BR-NOT-01:** Chỉ trong website; hộp thông báo riêng, tự cập nhật khi web đang mở.
- **BR-NOT-02:** Có chưa đọc thì chuông có chấm đỏ; hết chưa đọc thì bỏ chấm.
- **BR-NOT-03:** Mở chuông xem danh sách; chọn một thông báo đánh dấu đã đọc và mở nội dung liên quan.
- **BR-NOT-04:** Có “Đánh dấu tất cả đã đọc”.
- **BR-NOT-05:** User chỉ được đọc và thay đổi trạng thái đọc thông báo của mình.
- **BR-NOT-06:** Admin gửi riêng một user hoặc gửi toàn bộ; không mặc định user được gửi hệ thống.

| Sự kiện đã xác nhận | Người nhận nghiệp vụ |
| --- | --- |
| Quán/món đã lưu không còn khả dụng | Người lưu mục đó |
| Bình luận bị admin xóa | Người viết bình luận |
| Bình luận được trả lời | Người viết bình luận gốc |
| Quán đã lưu thêm món mới | Người lưu quán |
| Admin gửi | Tài khoản được chọn hoặc toàn bộ theo phạm vi gửi |

- **BR-NOT-07:** Không gửi thông báo khi user tự reply bình luận của mình.
- **BR-NOT-08:** Một user lưu cùng mục nhiều bộ chỉ nhận một thông báo cho một sự kiện nghiệp vụ.
- **BR-NOT-09:** Chỉ báo món mới nếu món và quán đều công khai.
- **BR-NOT-10:** Admin gửi toàn bộ chỉ tới tài khoản đang hoạt động.
- **BR-NOT-11:** Với saved-target không khả dụng/món mới, user phải đã lưu lúc sự kiện xảy ra
  và vẫn lưu khi xử lý gửi. Không gửi sự kiện cũ cho user chỉ lưu sau sự kiện.

Hai mốc là quy tắc đã chốt; cách chứng minh historical membership, re-save qua khoảng trống,
timestamp/version, thời điểm delivery và retention là GATE-03, chưa tự chọn kỹ thuật lưu history.
