# Quickstart and Validation

## Prerequisites

Node.js 22.18+ hoặc 24+, dependencies hiện có, Chrome/Edge đã cài. Không tự cài package/browser. Kiểm tra server 8443; chỉ chạy `npm run dev` nếu chưa có listener.

## Automated checks

Từ repository root:

```powershell
npm test
npm run typecheck
npm run check:structure
npm run build
npm run test:browser:full
```

Để chỉ chạy các hành trình tương tác khi chẩn đoán (không thay thế ma trận trang):
`node tests/browser/browser-check.mjs --interactions-only --strict`.

Chỉ chạy một browser harness tại một thời điểm (CDP 19333). Harness ghi JSON/ảnh trong `%LOCALAPPDATA%/Temp/opencode/grabmefood-verification`. UI detector chạy một lần sau khi các UI edits kết thúc; không thay thế browser evidence.

## Scenarios

1. Trang chủ: không có món độc lập/nhóm today rỗng; nhóm “Món từ thực đơn quán” có tối đa ba thẻ đúng nguồn, giá và tên quán. Mở từng thẻ → đúng scoped detail → quay lại giữ ngữ cảnh.
2. Tìm `pho`: kết quả chỉ từ thực đơn quán 1; filter giá vẫn áp dụng và được khôi phục khi quay lại. Truy vấn không khớp có recovery. `/all-restaurants?section=today` có 0 kết quả và đích khám phá.
3. Mở `/dish/1`, `/dish/11`, `/dish/pho-ga`, ID lạ: hiện thông báo không xác định được món tại quán và liên kết tìm kiếm. Hiện nguồn chưa có ánh xạ unique; unit tests kiểm tra unique và ambiguous không thêm mapping giả vào ứng dụng.
4. Mở `/restaurant/5/dish/d1`: đúng Hủ Tiếu Nam Vang, giá 45.000 ₫ và Hủ Tiếu Bé Bơ. Sai cặp `/restaurant/5/dish/1` không hiển thị món khác.
5. Lưu món từ scoped detail, đi qua navigation tới yêu thích: đúng món/owner và một bản ghi. Bỏ lưu/bulk remove có xác nhận; random từ yêu thích chỉ chọn đúng các cặp đã chọn. Unit tests chứng minh ID trùng khác quán tách biệt.
6. Kiểm tra shell tại 320/390/768/1024/1440 px, sáng/tối, chữ 100/200%: cùng desktop, header/nav không biến mất, cuộn ngang truy cập được avatar và điều khiển. Dialog giữ nút đóng/focus trong viewport; Escape trả đúng trigger.
7. Footer đủ nhóm, không bịa liên hệ. Nút lên đầu ẩn tại ≤400 px, hiện khi >400 px nếu không che nội dung, ẩn khi footer/dialog xuất hiện; Enter/Space/click về đầu và focus main. Giảm chuyển động không cuộn có hoạt ảnh.

Chi tiết hợp đồng: [contracts/ui-contract.md](contracts/ui-contract.md). Identity/validation: [data-model.md](data-model.md). Ghi rõ kết quả thực thi và gap, không coi test pass là xác nhận dữ liệu/dịch vụ production.
