# App flows — GrabMeFood

**Trạng thái:** Nhóm 1 được duyệt ngày 2026-11-23.
Các đoạn ghi “đề xuất”, OPEN QUESTION hoặc TBD chưa được coi là lựa chọn đã chốt.
Nguồn chuẩn cho luồng và trạng thái trải nghiệm; không là wireframe hoặc hợp đồng API đã duyệt.
Phạm vi: [PRD](PRD.md). Quy tắc: [DOMAIN](DOMAIN.md). Chi tiết chưa chốt: [DECISIONS](DECISIONS.md).
Kiến trúc mới là một backend Spring Boot và Supabase Data API; luồng nghiệp
vụ giữ nguyên. Copy/layout cụ thể còn cần review, không tự nới acceptance.

## 1. Sơ đồ điều hướng nghiệp vụ

```text
Khám phá quán ── tìm tên quán/món + lọc khu vực ──> Kết quả quán
                                                        │
                                                  Chi tiết quán
                                                   │         │
                                             Chi tiết món  Bản đồ + Google Maps

Bài viết / Danh sách tuyển chọn ──> Nội dung chi tiết

Đăng nhập ──> Đã lưu ──> Bộ sưu tập quán / Bộ sưu tập món
                    └─> Random từ mục đã lưu
          └─> Chuông thông báo ──> Nội dung liên quan

Quản trị (chỉ admin) ──> Nội dung / Bình luận / Tài khoản / Gửi thông báo
```

Đây là bản đồ chức năng, chưa quyết định menu, URL hoặc bố cục giống hệt tham chiếu.
Trang chính lấy quán làm trung tâm, không thay bằng trang danh sách món độc lập.

## 2. Khám phá công khai — REQ-EXP-01..04, REQ-CNT-01, REQ-UX-01..03

1. Khách mở nội dung công khai và chọn tiếng Việt/Anh.
2. Nhập tên quán hoặc món, tùy chọn khu vực.
3. Nhận kết quả là quán; thẻ chỉ ra món khớp nếu tìm theo món.
4. Mở chi tiết quán, xem giới thiệu, các món và bản đồ.
5. Bấm món để mở trang món của đúng quán; bấm nút góc bản đồ để mở Google Maps.
6. Xem bài viết hoặc tuyển chọn theo chủ đề.

Trạng thái cần thiết kế/kiểm chứng: đang tải; không có kết quả; lỗi tải và thử lại;
quán/món không còn khả dụng; ảnh thiếu; bản đồ không tải; link nội dung không tồn tại.
Cách hiển thị cụ thể là đề xuất thiết kế, chưa khóa copy/layout.
Chi tiết page SEO, URL ngôn ngữ và chia sẻ sẽ được duyệt ở nhóm 2.

## 3. Tài khoản — REQ-AUTH-01..02

```text
Đăng ký email ──> Chờ xác thực ──> Mở liên kết xác thực ──> Đăng nhập
Đăng nhập Google ──> OAuth callback ──> Phiên ứng dụng hợp lệ
Quên mật khẩu ──> Email khôi phục ──> Đặt mật khẩu mới
```

- Khách vẫn khám phá được; thao tác cá nhân yêu cầu đăng nhập.
- Google và email trùng địa chỉ, callback lỗi, link hết hạn và tài khoản chưa xác thực:
  cần luồng chi tiết, không tự quyết định cách liên kết tài khoản.
- Tài khoản bị khóa không được tiếp tục thao tác từ tab đang mở; dữ liệu không bị xóa.
- Không giả định SMTP đã test chỉ vì chủ dự án đã cấu hình.
- Sau khi đăng nhập từ thao tác cá nhân, quay lại trang trước; không tự thực hiện thao tác đang chờ, người dùng xác nhận lại (DEC-048). Cách đăng xuất vẫn cần đề xuất.

## 4. Lưu và bộ sưu tập — REQ-SAV-01..02

1. User chọn lưu quán hoặc món.
2. Chọn một hoặc nhiều bộ sưu tập phù hợp loại, hoặc tạo bộ mới.
3. Xem bộ sưu tập riêng của mình; một mục có thể có trong nhiều bộ.
4. Mục bị ẩn/xóa hiện “Không còn khả dụng”, không mở lại nội dung đã xóa.

Mỗi thao tác lưu chọn **một bộ sưu tập phù hợp loại**; muốn thêm cùng mục vào bộ khác thì thực hiện thao tác lưu riêng (DEC-045). Cùng mục vẫn có thể thuộc nhiều bộ.
Cần quyết định chi tiết đổi tên/xóa bộ, giới hạn tên và cách bỏ lưu.
Không có bộ sưu tập công khai/chia sẻ trong phạm vi đã xác nhận.

## 5. Random — REQ-RND-01..03

```text
Chọn quán hoặc món
    ├─ Toàn bộ đã lưu ──> Loại trùng + bỏ mục không khả dụng ──> Random
    └─ Chọn các mục ────> Chỉ mục đã lưu, hợp lệ ──────────────> Random
                                                               │
                                                         Xem kết quả
                                                               │
                                                        Random tiếp (có thể lặp)
```

Tập rỗng hoặc không còn mục hợp lệ: giải thích và gợi ý chọn lại; không lấy quán/món bên ngoài đã lưu.
Nếu mục vừa bị gỡ trong lúc thao tác, không trả nó như kết quả khả dụng.
Không có chế độ random riêng từ một bộ sưu tập; người dùng chọn toàn bộ mục đã lưu hoặc tự chọn các mục đã lưu (DEC-046). Thuật toán xác suất và xử lý mục bị gỡ đồng thời vẫn là OPEN QUESTION.

## 6. Bình luận — REQ-COM-01..03

1. User hợp lệ mở trang quán/món.
2. Gửi bình luận chữ; hiển thị ngay.
3. User/admin trả lời một cấp; chủ bình luận nhận thông báo theo quy tắc sẽ chi tiết hóa.
4. Chủ nội dung sửa/xóa bình luận hoặc reply của mình.
5. Admin được xóa bình luận/reply; không có quyền sửa lời người khác được xác nhận.

Chưa có đánh giá điểm, upload ảnh bình luận, like, báo cáo vi phạm hoặc kiểm duyệt trước.
Xóa bình luận gốc xóa toàn bộ reply bên dưới, kể cả người khác; xóa user áp dụng cùng quy tắc.
Lỗi quyền, phiên bị khóa, gửi thất bại và nội dung đích bị gỡ phải được xử lý mà không tuyên bố đã gửi.

## 7. Thông báo — REQ-NOT-01..04

```text
Sự kiện hợp lệ ──> Thông báo riêng của người nhận ──> Chuông tự cập nhật chấm đỏ
                                                        │
                                                  Mở danh sách
                                                   │         │
                                           Chọn một mục    Đánh dấu tất cả đã đọc
                                                   │         │
                                             Đã đọc + điều hướng
```

- Hết chưa đọc thì chấm đỏ biến mất.
- Không chỉ dựa vào tải lại trang để nhận thông báo mới.
- Khi đích đã xóa, không điều hướng sang lỗi khó hiểu; cách fallback là TBD.
- Mất kết nối Realtime, đồng bộ nhiều tab, thứ tự/phân trang và lưu giữ thông báo cần thiết kế.
- Không có email/push thông báo sản phẩm.

## 8. Quản trị — REQ-ADM-01..05

- Truy cập khu quản trị: xác thực quyền, không chỉ ẩn menu với user thường.
- Quản lý quán/món/bài viết/tuyển chọn: công khai, ẩn hoặc xóa; không có nháp.
- Ẩn quán làm các món của quán không khả dụng.
- Xóa quán xóa món và bình luận/reply liên quan, nhưng giữ marker ở bộ sưu tập.
- Xóa món cũng xóa bình luận/reply liên quan và giữ marker.
- Khóa/mở tài khoản; xóa tài khoản kéo theo dữ liệu riêng và bình luận/reply của người đó.
- Gửi thông báo riêng hoặc toàn bộ.

**Nguyên tắc UX đã duyệt (DEC-047):** xác nhận trước thao tác xóa/khóa và nêu tác động; chỉ báo hoàn tất bước khi đã có xác nhận tương ứng. Nếu chưa đủ xác nhận thì thể hiện đang/chưa hoàn tất, không báo thành công sớm.
Đã chốt không tự khóa/xóa admin, bảo vệ admin active cuối; admin đầu do chủ dự án chỉ định.
Danh tính/admin bootstrap thực tế và kiểm tra race còn phải hoàn thiện trước implementation.

## 9. Trạng thái nghiệp vụ khi nhiều bước chưa hoàn tất

- Bình luận đã lưu không đồng nghĩa thông báo đã hiển thị; nếu quy trình có
  bước bất đồng bộ phải có cách kiểm chứng/trình bày trạng thái trung thực.
- Xóa quán: nội dung không khả dụng trước; xóa comments/replies và giữ marker
  theo yêu cầu. Chưa đủ xác nhận cleanup thì không báo “xóa toàn bộ hoàn tất”.
- Xóa user: chặn thao tác tài khoản trước; cleanup dữ liệu riêng, bình luận và Auth có thể lỗi từng bước.
  UI phân biệt đang xử lý, cần thử lại và hoàn tất; backend mới phải chứng
  minh các bước thực tế trước khi báo thành công.
- Không xác nhận được tính khả dụng/quyền: thao tác nhạy cảm báo chưa kiểm tra
  được và cho thử lại, không coi lỗi nguồn dữ liệu là danh sách rỗng.
- Đổi kiến trúc không cho phép dữ liệu ẩn xuất hiện qua cache hoặc view chậm.
- Thông báo lưu quán/món kiểm tra hai mốc save; món mới phải public cùng quán.
  Không self-reply notification, không nhân recipient vì nhiều bộ, broadcast chỉ active users.
