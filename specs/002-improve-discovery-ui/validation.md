# Implementation Validation — 2026-11-13

## Delivered scope

- Desktop shell tối thiểu 1024 CSS px; bỏ BottomNav và toàn bộ nhánh giao diện mobile. Vùng hẹp vẫn truy cập bằng cuộn ngang.
- Danh mục gồm 14 món tại quán từ nguồn hiện có: 8 món lồng và 6 món thực đơn mẫu quán 1. Mọi danh sách/count/random chỉ dùng món hợp lệ.
- Món độc lập không còn trang chi tiết riêng; source fixtures được giữ, không ghép quán theo tên/ID. URL cũ chỉ redirect qua quan hệ tường minh duy nhất; hiện chưa có mapping được xác minh.
- Yêu thích, chọn hàng, bỏ lưu và ngẫu nhiên dùng cùng identity cặp quán–món. Seed bare IDs cũ không tự chuyển thành món tại quán.
- Bảo toàn footer/avatar/nút lên đầu trang và thay đổi không liên quan có trước. Không đổi dependencies, lockfile, toolchain hoặc thêm dịch vụ.

## Executed checks

| Check | Result |
| --- | --- |
| `npm test` | PASS — 38/38 unit/source-contract tests |
| `npm run typecheck` | PASS — 0 diagnostics trong 66 file ứng dụng |
| `npm run check:structure` | PASS — 73/73 file reachable; không import thiếu hoặc file nguồn thừa |
| `npm run build` | PASS — Vite production build |
| UI detector trên các target đã đổi | PASS — không có findings; kiểm tra lại các target sửa lỗi focus |
| So sánh fixture món độc lập với Git HEAD trước thay đổi | PASS — 8 bản ghi giữ nguyên mọi trường/giá trị; ảnh local được giữ |
| Browser baseline trước thay đổi | PASS — 4 ca smoke sau khi khởi động server đang thiếu |
| Browser quick trước ca mở rộng focus | PASS — 124 ca trang và các hành trình khi đó |
| Browser interactions sau sửa lỗi focus | PASS — bao gồm shell 5 độ rộng × 2 theme × chữ 100/200%, dialog hẹp, yêu thích, random, xác nhận bỏ lưu |
| `npm run test:browser:full` sau sửa lỗi | PASS — 310 ca trang/độ rộng/theme, 0 lỗi; toàn bộ ca tương tác đều đạt |

## Discovered and fixed

Lượt browser full đầu kiểm tra xong 310 ca trang/độ rộng/theme mà không có lỗi trang,
nhưng phát hiện ca Escape sau dialog ở 390 px/chữ 200% chưa khôi phục focus ngay:
dialog vẫn đang chạy exit animation dù giảm chuyển động được yêu cầu. Bổ sung giảm
chuyển động cho portal dialog/overlay, ghi nhận opener trước autofocus và đưa focus
vào trigger trước khi mở. Ca hồi quy mới xác minh dialog đóng, focus trở lại trigger
nhìn thấy được; toàn bộ lượt interactions riêng đã đạt sau sửa lỗi.

## Visual review and evidence

Đã xem ảnh desktop trang chủ sáng/tối, tìm kiếm desktop tối, footer và focus tài khoản
trên viewport hẹp. Cùng nhận diện và nội dung tiếng Việt; ảnh fallback giữ đúng vùng,
không thay bằng món khác. JSON/PNG do CDP harness ghi tại:
`%LOCALAPPDATA%/Temp/opencode/grabmefood-verification`.

## Limits and approved tradeoffs

- Browser evidence dùng Chromium/Chrome hoặc Edge đã cài với viewport giả lập, không phải thiết bị điện thoại thật hoặc Safari/Firefox.
- Ma trận trang ở 100% chữ; shell trang chủ có đầy đủ 5 độ rộng × 2 theme × chữ 100/200%, thêm kiểm tra focus tới mọi điều khiển tại chữ 200% trên năm trang đại diện ở 390 px. Không tuyên bố đã kiểm tra mọi route ở mọi mức zoom.
- Cho phép cuộn ngang là lựa chọn được chủ sản phẩm duyệt, không phải chứng nhận WCAG reflow.
- Nhánh redirect unique/ambiguous kiểm thử bằng fixture unit; dữ liệu ứng dụng chưa có mapping hợp lệ nên link cũ hiện thông báo/recovery. Không thêm quan hệ giả để làm demo redirect.
- Dữ liệu quán/giá/đánh giá vẫn minh họa; auth, upload và gửi đánh giá vẫn chưa tích hợp. Không khẳng định production readiness, độ chính xác nguồn hoặc quyền sử dụng ảnh.
- Không chạy `typecheck:all` trong phạm vi này; README đã ghi lỗi tooling có trước. App typecheck và build nêu trên đều được thực thi.
