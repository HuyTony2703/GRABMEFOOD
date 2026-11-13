# User Interface and URL Contract

## Desktop shell

- Tất cả trang dùng chung bố cục desktop kể cả 320/390/768 px; khung desktop tối thiểu 1024 px, cuộn ngang khi thiếu chỗ, không mobile bottom navigation hoặc chặn truy cập.
- Header desktop có các đích hiện có; avatar tới `/profile`, hiện chữ “Chưa xác thực”. Footer và nút lên đầu giữ exclusions đã duyệt.
- Dialog không vượt viewport, đóng bằng Escape, trap focus và trả về trigger. Focus tới điều khiển ngoài viewport phải cuộn vào vùng nhìn thấy.
- 1024/1440 px dùng bố cục desktop; theme sáng/tối, zoom chữ 100/200%, tên tiếng Việt dài, ảnh lỗi phải truy cập được.

## Dish navigation

| Điểm vào | Kết quả |
| --- | --- |
| Thẻ món ở mọi danh sách | `/restaurant/:restaurantId/dish/:dishId`, có tên quán và thông tin đúng nguồn |
| Chi tiết món tại quán hợp lệ | Đúng món/owner, lưu/bỏ lưu đúng cặp, backlink giữ ngữ cảnh |
| Cặp món/quán không tồn tại | “Không tìm thấy món tại quán”, liên kết `/search`, không fallback |
| `/dish/:id`, có đúng một quan hệ hợp lệ tường minh | Redirect thay thế URL hiện tại tới scoped detail, không vòng lặp |
| `/dish/:id`, không có quan hệ hoặc mơ hồ hoặc ID lạ | “Không xác định được món tại quán”, liên kết `/search`, không tự chọn |

Không có API mới. Không tạo link `/dish/:id` mới hoặc giữ giao diện độc lập. Dữ liệu mẫu được ghi rõ; gửi đánh giá/tệp vẫn disabled khi chưa có backend.

## Catalog / favorite / random

- Chỉ món valid xuất hiện và được tính; today empty thì ẩn nhóm trang chủ, route danh sách vẫn có thông báo rỗng.
- Ba món bổ sung đầu vẫn thuộc nguồn quán 5 theo thứ tự hiện có; không lặp cặp hoặc thêm món để lấp hàng.
- Yêu thích ban đầu không tự chuyển seed bare ID thành cặp; tab món có thể rỗng. Lưu món từ scoped detail phải xuất hiện đúng một lần và đúng owner.
- Ngẫu nhiên chỉ chọn từ danh mục valid hoặc tập yêu thích được chọn; pool rỗng thì nút chọn disabled và có hướng dẫn phục hồi.
- Hai món trùng ID ở hai quán có khóa và trạng thái lưu riêng. Bulk remove ảnh hưởng đúng loại/cặp, có xác nhận như hiện tại.
