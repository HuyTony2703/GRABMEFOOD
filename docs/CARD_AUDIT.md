# GRABMEFOOD — kiểm kê và mở rộng thẻ

## 1. Phạm vi và mục đích

Đã đọc 26 page component, router, App, dữ liệu quán/món, các component nghiệp vụ,
stylesheet, cấu hình và hướng dẫn dự án; rà soát API/export của thư viện UI dùng chung.
Ứng dụng React/Vite mobile-first phục vụ khám phá quán/món, đọc và viết đánh giá,
xem vị trí, chọn món ngẫu nhiên và quản lý yêu thích. Không phải một hệ thống đặt món,
giao hàng, thanh toán hay đặt bàn.

Hiện không có API/backend được kết nối. Danh sách, đánh giá, hồ sơ và đăng nhập đều
là dữ liệu/giao diện mẫu. Vì vậy, không thêm quán, món, số lượt đánh giá, địa chỉ,
ưu đãi hoặc khả năng lưu dữ liệu mới.

## 2. Quy ước đếm

**128 thẻ/vị trí nội dung ban đầu theo kịch bản kiểm kê dưới đây; 6 thẻ mới;
134 sau bổ sung trong cùng kịch bản.**

Đây là số thẻ giao diện theo trang, **không phải 128 nội dung duy nhất**:

- Một nội dung xuất hiện trên hai trang được tính hai lần.
- Danh sách của các tab được kiểm kê cả khi tab chưa mở. Cùng một phần tử được
  lặp lại ở nhiều bộ lọc của cùng trang chỉ tính một lần.
- Route chi tiết dùng `/restaurant/1`, `/dish/1`, `/restaurant/1/dish/1`
  làm đại diện; không nhân với mọi tổ hợp tham số.
- Bản đồ tính một thẻ quán được chọn, một thẻ vị trí và hai lựa chọn lớp bản đồ.
  Quay tính năm thẻ chọn món và một thẻ kết quả đại diện.
- Thẻ có thể là khối thông tin, đánh giá, biểu mẫu được đóng khung, nhóm cài đặt,
  hoặc ô danh mục/thống kê. Không đếm từng hàng bên trong một thẻ nhóm.
- Không tính header, bottom nav, input, filter chip, nút thông thường, modal,
  marker bản đồ, bong bóng chat hoặc trạng thái trống là thẻ.
- `components/ui/card.tsx` và các primitive chưa được dùng không phải thẻ nội dung.

## 3. Kiểm kê ban đầu theo trang

| Trang | Số lượng | Phân loại/nội dung |
| --- | ---: | --- |
| Trang chủ `/` | 20 | 6 ô danh mục + 6 quán gần + 3 món hôm nay + 5 quán giảm giá |
| `/all-restaurants` | 11 | 6 quán gần + 5 quán giảm giá; tab today đang dùng lại danh sách quán gần |
| `/search` | 10 | 5 kết quả món + 5 kết quả quán, gồm cả hai tab |
| `/map` | 4 | Vị trí hiện tại, quán được chọn, Bản đồ mặc định, Vệ tinh |
| `/random` | 6 | 5 món tự chọn từ danh sách mẫu đã lưu + một thẻ kết quả quay |
| `/favorites` | 14 | 7 món yêu thích + 7 quán yêu thích, gồm cả hai tab |
| `/profile` | 8 | 4 thống kê + 3 đánh giá gần đây + tiến độ Elite Reviewer |
| `/profile/reviews` | 5 | 5 đánh giá cá nhân |
| `/restaurant/1` | 12 | Giờ mở cửa, liên hệ, địa chỉ, 6 món thực đơn, biểu mẫu đánh giá, 2 đánh giá khách hàng |
| `/dish/1` | 7 | 3 quán phục vụ, biểu mẫu đánh giá, 3 đánh giá khách hàng |
| `/restaurant/1/dish/1` | 4 | Địa chỉ nhà hàng, biểu mẫu đánh giá, 2 đánh giá khách hàng |
| `/notifications` | 6 | 3 ưu đãi + 2 phản hồi đánh giá + 1 thông báo lượt thích |
| `/settings/guide` | 7 | Tìm kiếm, bộ lọc, bản đồ, ngẫu nhiên, viết đánh giá, yêu thích, tài khoản |
| `/settings/address` | 3 | Nhà riêng, Văn phòng, Địa chỉ khác |
| `/settings` | 4 | Nhóm Tài khoản, Cài đặt, Hỗ trợ, hành động tài khoản |
| `/settings/account` | 1 | Nhóm thông tin tài khoản và bảo mật |
| `/settings/notifications` | 2 | Nhóm thông báo đẩy và các kênh khác |
| `/settings/language` | 1 | Nhóm lựa chọn ngôn ngữ |
| `/settings/theme` | 1 | Nhóm lựa chọn giao diện |
| `/settings/terms` | 1 | Điều khoản sử dụng |
| `/login` | 1 | Khối đăng nhập |
| Welcome, Onboarding, Register, Support, Error | 0 | Không có thẻ đóng khung theo quy ước này |
| **Tổng** | **128** | Không đồng nghĩa tất cả cùng hiển thị trên một màn hình |

### Danh mục nội dung đã có để đối chiếu trùng lặp

- **Danh mục:** Cà phê, Phở, Món thịt, Món nướng, Kem, Rau xanh.
- **Quán gần:** Phở Hà Nội, Highlands Coffee, Gogi House, Bánh Mì 37,
  Hủ Tiếu Bé Bơ, Cơm Gà Nguyên Ký Prime.
- **Quán giảm giá:** KFC Discount, Pizza 4P's, Trà Sữa Bobapop, Sushi World,
  Cơm Tấm Sườn.
- **Món hôm nay/chi tiết món:** Cơm Tấm Sườn Nướng, Bún Chả Hà Nội,
  Gỏi Cuốn Tôm Thịt.
- **Các biến thể phở:** Phở Gà, Phở Bò Tái, Phở Bò Chín, Phở Chay, Phở Hải Sản.
- **Thực đơn riêng trong dữ liệu:** Hủ Tiếu Nam Vang, Bún Riêu Cua, Bún Mọc,
  Bún Chả, Bánh Canh Cua, Cơm Gà Xối Mỡ, Cơm Gà Luộc, Cơm Gà Rô Ti.
- **Thực đơn mặc định:** Phở Bò Tái, Phở Gà, Bún Chả, Bánh Cuốn, Gỏi Cuốn,
  Chả Giò.
- **Món khác trong tập quay:** Bánh Mì Thịt.
- **Quán trong kết quả tìm kiếm:** Phở Hà Nội, Phở Lệ, Phở Bà Dũng,
  Phở Thìn Bờ Hồ, Phở Quyền.
- **Quán trong trang chi tiết món:** Phở Hà Nội, Quán Ngon Sài Gòn,
  Món Việt Truyền Thống.
- **Món yêu thích:** Cơm Tấm Sườn Nướng, Bún Chả Hà Nội, Gỏi Cuốn Tôm Thịt,
  Hủ Tiếu Nam Vang, Cơm Gà Xối Mỡ, Phở Gà, Phở Bò Tái.
- **Quán yêu thích:** Phở Hà Nội, Highlands Coffee, Hủ Tiếu Bé Bơ,
  Cơm Gà Nguyên Ký Prime, Bánh Mì 37, KFC Discount, Trà Sữa Bobapop.
- **Thống kê cá nhân:** Đánh giá, Ảnh, Địa điểm, Huy hiệu; Elite Reviewer.
- **Đánh giá cá nhân:** 3 đánh giá gần đây; danh sách đầy đủ có 5 đánh giá,
  gắn với Phở Hà Nội (2), Highlands Coffee, Bánh Mì 37, Gogi House.
- **Đánh giá khách hàng:** mẫu của Nguyễn Văn A, Trần Thị B ở chi tiết quán
  và món tại quán; thêm Lê Văn C ở chi tiết món.
- **Thông báo:** ưu đãi KFC, phản hồi Phở Hà Nội, ưu đãi Pizza 4P's,
  phản hồi Highlands Coffee, lượt thích đánh giá Bánh Mì 37, ưu đãi Bobapop.
- **Nội dung hỗ trợ/cài đặt:** các nhóm tài khoản, địa chỉ, thông báo,
  ngôn ngữ, giao diện, hỗ trợ chat, điều khoản và 7 hướng dẫn đã liệt kê trên.
  Không biến mỗi đường dẫn cài đặt sẵn có thành một “thẻ mới”.

## 4. Thiếu gì có thể bổ sung an toàn?

Các trường `tasteRating`, `priceRating`, `presentationRating` đã tồn tại cho 8 món
chi tiết nhưng chưa được render. Giá từng món đã có trong thực đơn nhưng chưa có
công cụ kiểm tra ngân sách. Điểm `service` đã có trong đánh giá quán nhưng bị bỏ
qua. Điểm đánh giá lẻ như 4,5 đã có nhưng chưa có bảng phân bố.

Không đủ cơ sở để tạo 20–30 nội dung mới không trùng. Tạo thêm danh sách “giá rẻ”,
“quán đánh giá cao”, “quán gần hơn”, “món đề xuất” sẽ lặp nội dung hoặc bộ lọc cũ.
Không thêm tính năng đặt món, voucher, tích điểm hay sự kiện.

## 5. Sáu thẻ mới đã triển khai

| Thẻ | Mục đích riêng biệt | Nguồn | Vị trí |
| --- | --- | --- | --- |
| Hương vị | Xem điểm chất lượng vị của món, thay vì chỉ điểm tổng | `dish.tasteRating` | `/dish/:id`, dưới mô tả |
| Mức giá | Xem đánh giá về giá cả, không nhầm với giá bán | `dish.priceRating` | Cùng nhóm Điểm theo tiêu chí |
| Trình bày | Xem điểm cách bày biện món ăn | `dish.presentationRating` | Cùng nhóm Điểm theo tiêu chí |
| Ngân sách thực đơn | Chỉnh giá tối đa mỗi món, đếm món phù hợp và đến món đầu tiên | `menuItems[].price` | `/restaurant/:id`, đầu tab Thực đơn |
| Phục vụ tại quán | Xem điểm phục vụ trung bình từ các đánh giá đang hiển thị | `reviews[].service` | `/restaurant/:id`, đầu tab Đánh giá |
| Phân bố điểm đánh giá | Xem phân bố sao; không gộp 4,5 sao thành 5 sao | `reviews[].rating` | `/restaurant/:restaurantId/dish/:dishId`, trước các nhận xét khách hàng |

**Đã đối chiếu tên, nội dung và mục đích với toàn bộ nhóm thẻ cũ và sáu thẻ mới.**
Đây là sáu vai trò thẻ, không đếm việc tái sử dụng một component trên nhiều ID là
nhiều nội dung mới. Không tạo thêm thực thể món/quán hay đánh giá mẫu.

Các thẻ tái sử dụng `Card`, `Progress`, icon Lucide, typography đang kế thừa
Roboto, nền trắng/xám nhạt, đỏ thương hiệu, radius và spacing của các trang chi tiết.
Không dùng ảnh mới. Nhóm ba điểm thành lưới ba cột từ 360px, một cột ở màn hình
hẹp hơn. Các thẻ còn lại co giãn theo chiều rộng có sẵn.

Ngân sách tính từ hai định dạng giá thực tế `65,000đ` và `45k`; bỏ qua giá không
đọc được hoặc khoảng giá thay vì tự đoán. Slider chỉ tác động phần thống kê mới;
không lọc mất, sắp xếp lại hay thay đổi thực đơn cũ. Liên kết nhảy đến thẻ món cũ.

## 6. Các yêu cầu tồn đọng trong phạm vi

- Ẩn scrollbar dọc của tài liệu ở trang món tại quán bằng class gắn trên `html`,
  không chỉ `overflow-x-hidden` trên component. Giữ cuộn dọc; gỡ class khi rời trang.
- Giữ nguyên địa chỉ và liên kết bản đồ hiện có ở trang món tại quán.
- Bổ sung liên kết Google Maps cạnh từng quán đã có địa chỉ ở trang chi tiết món;
  tìm theo tên và địa chỉ có sẵn, không tự suy ra tọa độ.
- Không thay đổi tab bản đồ, quy trình xác nhận xóa yêu thích, cấu trúc dữ liệu,
  API, router hay luồng nghiệp vụ hiện có.

## 7. Giới hạn hiện có, không mở rộng trong lần này

- Gửi đánh giá/đăng nhập/đăng ký mới chỉ log, chưa lưu lên server.
- Nút chia sẻ đang thiếu handler; yêu thích ở chi tiết chỉ giữ state riêng.
- Bộ lọc và ô tìm kiếm chưa thực sự lọc dữ liệu.
- ID/tên món và quán giữa các trang chưa đồng nhất; chi tiết món tại quán luôn
  dùng cùng dữ liệu Phở Bò Tái mẫu, dù tham số route khác.
- Một số nút bản đồ, tài khoản, địa chỉ và liên kết pháp lý chưa nối đầy đủ.
- Nhiều header hiện vẫn nền trắng, khác mong muốn header đỏ nêu trong bối cảnh.
  Không đổi toàn bộ header khi yêu cầu chính là bổ sung thẻ, giữ thiết kế.
- Thẻ phục vụ và phân bố sao ghi rõ chỉ tính các đánh giá mẫu đang hiển thị,
  không lấy số tổng 245/234 làm mẫu số.
- Kiểm tra TypeScript toàn dự án có lỗi **đã xuất hiện trước thay đổi** tại
  `vite.figma.config.ts:86` (`never` không callable). Không sửa wrapper ngoài phạm vi.

Chạy kiểm thử tính toán:
`node --experimental-strip-types --test tests/insightCalculations.test.mjs`.
Build đúng entry point dự án: `pnpm build`.

## 8. Kết quả kiểm tra

- 8/8 test tính toán qua: hai định dạng giá cũ, giá không xác định, ngân sách,
  thực đơn trống/một mức giá, điểm phục vụ, phân bố sao lẻ và định dạng tiền.
- Đã kiểm thử trên Chromium ở 320px, 390px và 1440px: ba thẻ điểm nằm trong
  viewport; slider đổi số món, liên kết đến đúng thẻ món, thực đơn cũ vẫn đủ món.
- Thực đơn quán 5 dùng giá `k` cũng cập nhật đúng.
- Điểm phục vụ mẫu là 4,75/5; phân bố hai đánh giá 5 và 4,5 là 50% mỗi nhóm.
- Scrollbar dọc ẩn đúng trên món tại quán; wheel vẫn cuộn; chuyển về quán thì
  class ẩn scrollbar được gỡ.
- Xóa yêu thích vẫn hỏi xác nhận; Hủy giữ nguyên 7 món mẫu.
- Smoke test Trang chủ, Bản đồ, Quay, Tôi, danh sách quán, tìm kiếm, thông báo,
  cài đặt và hướng dẫn không gặp lỗi JavaScript trên trình duyệt.
- Đã kiểm tra ảnh chụp màn hình; một số URL ảnh cũ không tải trong môi trường
  kiểm thử. Không thay nguồn ảnh ngoài phạm vi lần này.
- Bổ sung truyền `value` xuống primitive `Progress` đang có để thẻ mới cung cấp
  đúng `aria-valuenow`, thay vì thanh tiến độ ở trạng thái không xác định.
