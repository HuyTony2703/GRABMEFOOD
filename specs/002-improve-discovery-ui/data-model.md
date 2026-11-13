# Phase 1 Data Model

## Restaurant / MenuRecord (nguồn giữ nguyên)

- Restaurant: `id`, `name`, metadata quán và `dishes?`.
- MenuRecord: `id`, `name`, `price`, `image`, `rating?`, `reviews?`, `cuisine?`.
- Thực đơn mẫu riêng: khóa restaurant ID → danh sách MenuRecord; chỉ có tác dụng khi quán tồn tại. Không tạo quán hoặc sửa record gốc.

## ScopedDish (adapter hiển thị)

- Giữ nguyên các trường MenuRecord; thêm `restaurantId`, `restaurantName`, `favoriteKey`, `href`.
- `favoriteKey = JSON.stringify([restaurantId, id])`; không dùng nối chuỗi thiếu escape hoặc sửa source ID.
- `href = /restaurant/{encoded restaurantId}/dish/{encoded dishId}`.
- Hợp lệ khi owner tồn tại, tên owner/món không rỗng, cặp món thuộc thực đơn được khai báo; cặp trùng chỉ hiển thị một lần theo thứ tự nguồn.
- Không hợp nhất giá/rating của món độc lập với thực đơn. Trường thiếu không được thay bằng số liệu giả.

## LegacyDish / ExplicitDishRelationship

- LegacyDish: ID và dữ liệu nguồn độc lập cũ, giữ lại nhưng không render nếu chưa có đích hợp lệ.
- ExplicitDishRelationship: `legacyDishId`, `restaurantId`, `dishId`; không suy ra từ tên, ảnh, ID trùng hoặc chỉ restaurantIds.
- Resolver yêu cầu legacy ID tồn tại; lọc quan hệ tới đúng ScopedDish; bỏ quan hệ đích thiếu; deduplicate theo cặp.
- 0 đích hợp lệ → missing; 1 đích → unique; từ 2 đích khác nhau → ambiguous. Chỉ unique cho phép redirect.
- Hiện không có relationship được xác minh trong nguồn, danh sách ánh xạ ứng dụng rỗng; kiểm thử unique/ambiguous dùng fixtures riêng.

## Favorite state

- State hiện có: set các khóa `dish:{favoriteKey}` / `restaurant:{restaurantId}`.
- Chưa lưu → toggle đúng cặp → đã lưu; toggle lại hoặc xác nhận remove → chưa lưu.
- Bare IDs cũ vẫn tồn tại trong state seed, nhưng không được tự ánh xạ thành cặp; không xuất hiện trong số lượng/danh sách hợp lệ.
- Chọn hàng, chọn tất cả, bỏ lưu, gợi ý ngẫu nhiên từ yêu thích và mở chi tiết đều dùng cùng favoriteKey.

## Danh sách hiển thị

- Menu danh mục: 8 món lồng hiện có theo thứ tự nguồn, tiếp theo 6 món mẫu quán 1.
- Discovery/favorite choices: cùng danh mục validated, không trùng cặp.
- Today: chỉ các đích unique đã xác định cho nguồn hôm nay; hiện rỗng. Không giữ nhóm trang chủ rỗng; URL danh sách hôm nay vẫn có trạng thái rỗng và liên kết khám phá.
- Tìm kiếm/lọc/count/random áp dụng sau validation, không tính món độc lập không hợp lệ.
