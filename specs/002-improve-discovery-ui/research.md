# Phase 0 Research — 2026-11-13

## 1. Danh mục món có quán

- Decision: Dựng danh mục từ 8 món lồng trong quán 5/14 và 6 món mẫu đã khai báo riêng cho quán 1. Giữ thứ tự thực đơn lồng hiện có trước, sau đó thực đơn mẫu; ba thẻ bổ sung đầu trang vẫn thuộc quán 5.
- Rationale: Không mất nguồn hiện có, không bịa liên kết hoặc thay giá; cùng danh mục phục vụ mọi trang và lookup chi tiết.
- Alternatives considered: Ghép tên món/ID với quán bị loại vì món độc lập 1 là cơm tấm nhưng món 1 tại quán 1 là phở; chỉ dùng thực đơn lồng sẽ bỏ sáu món mẫu đã có.

## 2. URL cũ

- Decision: Dùng resolver thuần nhận danh sách ID món độc lập, quan hệ tường minh `{legacyDishId, restaurantId, dishId}` và danh mục hợp lệ. Kết quả unique/missing/ambiguous; chỉ unique chuyển hướng thay thế history entry.
- Rationale: `restaurantIds` hiện chỉ là kiểu khai báo, không được điền và không chỉ định món thực đơn. Không có ánh xạ hợp lệ hiện tại; resolver trả missing cho fixtures cũ. Có unit tests cho unique/ambiguous bằng fixtures kiểm thử, không thêm dữ liệu ứng dụng.
- Alternatives considered: Ghép theo tên/ID, chọn quán đầu tiên hoặc gán quán giả đều trái spec. Xóa route cũ gây đứt liên kết không cần thiết.

## 3. Identity và yêu thích

- Decision: Giữ ID món nguồn, thêm `restaurantId`, `favoriteKey` mã hóa cặp bằng JSON và `href` chuẩn. Tất cả toggle/selection/removal/React keys dùng cùng khóa cặp. Giữ seed yêu thích cũ nhưng không tự chuyển bare ID sang cặp.
- Rationale: Seed cũ không có mối quan hệ món–quán được xác minh; favorites ban đầu có thể rỗng ở tab món. Không làm món trùng ID ở quán khác đổi trạng thái cùng nhau.
- Alternatives considered: Tiếp tục `menu:1:id` riêng cho quán 1 hoặc bare ID cho các quán khác gây collision; đổi source ID gây lẫn dữ liệu và storage identity.

## 4. Desktop-only

- Decision: Chuyển desktop rules thành CSS mặc định; khung tối thiểu 1024 CSS px, nội dung tối đa 1280 px, gutter 24 px; còn breakpoint desktop 1280 px để thay 3/4 cột. Xóa BottomNav và mọi import, safe-area/nav compensation, nhánh mobile/compact.
- Rationale: Cùng desktop ở vùng hẹp, cuộn ngang có chủ ý; vẫn giữ form 480/720 px và khung đọc 75ch. Dialog portal vẫn giới hạn theo viewport để không mất nút đóng hoặc trap focus.
- Alternatives considered: Chặn theo độ rộng bị từ chối; giữ responsive mobile trái yêu cầu; xóa reduced-motion không liên quan và không được phép.

## 5. Tái sử dụng và kiểm chứng

- Decision: Tái sử dụng DishAtRestaurantPage cho thông tin chi tiết mẫu hiện có và RecordDetail cho món còn lại. Thông tin phở đặc biệt không gán sang món khác. Bỏ trang độc lập; giữ fixture độc lập trong data module không được render. Nếu insight component hết consumer, xóa cùng kiểm thử chỉ dành riêng cho nó sau khi xác minh.
- Rationale: Giữ chức năng liên quan, không xóa dữ liệu nguồn chỉ để source tree nhỏ hơn. Helper runtime import-free cho Node test trực tiếp `.ts`.
- Alternatives considered: Đổi stack/library hoặc viết backend mới ngoài phạm vi. Không bỏ các browser audits chỉ vì horizontal overflow được phép; thay check reflow bằng desktop persistence và khả năng cuộn/focus.

## Kết luận

Không còn NEEDS CLARIFICATION về sản phẩm hoặc kỹ thuật. Khảo sát read-only bằng research agent đã đối chiếu các consumer, dữ liệu, khóa và tests. Gates trước/sau thiết kế nằm trong `plan.md`. Dịch vụ auth/review/live map vẫn ngoài phạm vi và không được trình bày là hoạt động.
