# GrabMeFood — hướng thiết kế

**Trạng thái:** DRAFT nhóm 2 — đề xuất, chưa duyệt visual baseline.
Chưa có mockup render, screenshot, component code hoặc bộ asset được tạo.
Nguồn nghiệp vụ: [PRD](docs/PRD.md), [APP-FLOWS](docs/APP-FLOWS.md).

## 1. Brief và mức độ tham chiếu

Sinh viên mở web trên máy tính để tìm quán quen thuộc quanh Làng Đại học, xem món và lưu lựa chọn.
Michelin Guide Việt Nam là tham chiếu **cấu trúc trải nghiệm**: navigation gọn, ảnh nội dung lớn,
grid quán, phân cấp tiêu đề rõ, chi tiết quán giàu ảnh và nội dung biên tập.
Không biến thành dashboard giao đồ ăn, không nút đặt bàn/khách sạn, không huy hiệu sao.

Yêu cầu “giống Michelin” không phải quyền sao chép logo, mascot, font riêng, ảnh, wording hoặc pixel layout.
Chỉ mới đọc nội dung index tham chiếu, chưa kiểm chứng UI trong browser; không gọi bản này là bản tái tạo
giao diện đã đối chiếu. Cần review visual thật trước implementation UI.

### Phương án trình bày

- **Editorial guide, quán làm trung tâm:** ảnh/quán và nội dung dẫn đường; phù hợp hướng user đã chọn.
- Directory thuần bảng/danh sách: dễ scan nhưng thiếu trải nghiệm biên tập tham chiếu.
- Marketplace đặt món: sai phạm vi, không chọn.

Hướng đầu là đề xuất khuyến nghị; palette/type cụ thể dưới đây vẫn chờ duyệt, không áp đặt thương hiệu.

## 2. Hướng thị giác đề xuất

- Nền sáng: sinh viên thường duyệt thông tin/ảnh đồ ăn trên laptop và điện thoại trong điều kiện sáng;
  dùng nền trung tính, chữ đậm rõ, không dùng dark mode như một tính năng chưa được yêu cầu.
- Brand accent xanh lá đậm, khác đỏ thương hiệu Michelin; chấm thông báo vẫn đỏ theo quyết định user.
- Tên GrabMeFood là wordmark chữ tạm; chưa tạo logo hoặc mượn nhận diện Grab/Michelin.
- Ảnh quyết định nhịp trang; không dùng gradient/glass/animation phức tạp để thay ảnh thật.
- Controls và admin dùng chuẩn web quen thuộc, không “trang trí” làm khó nhận biết trạng thái.

## 3. Tokens khởi điểm (đề xuất, chưa kiểm chứng render)

Ba lớp primitive → semantic → component; CSS variables sẽ tạo trong task implementation đã duyệt.

| Lớp | Token | Giá trị / sử dụng |
| --- | --- | --- |
| Primitive | neutral-0 / neutral-50 / neutral-900 | #FFFFFF / #F6F7F5 / #18231C |
| Primitive | green-700 / green-800 | #256044 / #194A33 |
| Primitive | red-700 | #B42318 |
| Semantic | surface / canvas / text-primary | neutral-0 / neutral-50 / neutral-900 |
| Semantic | action / action-hover | green-700 / green-800 |
| Semantic | unread / destructive | red-700; phân biệt bằng chữ/ngữ cảnh, không chỉ màu |
| Component | button-primary-bg / notification-dot-bg | action / unread |
| Component | card-image-ratio / card-radius | 4:3 / 8px |

- Type UI: system sans hỗ trợ tiếng Việt; không cần tải font để đạt demo.
  Display heading ban đầu cùng family, weight 650–700; nếu chọn font khác phải kiểm tra dấu/giấy phép.
- Type scale đề xuất 14/16/20/28/40/56 px; body >=16 px; line-height body 1.5–1.65.
- Spacing 4/8/12/16/24/32/48/64 px; content max 1280 px, gutter desktop 32 px/mobile 16 px.
- Border 1 px, shadow hạn chế; mọi màu text/focus/state phải đo contrast khi render,
  không tuyên bố đạt WCAG chỉ nhờ chọn hex.

## 4. Bố cục theo surface

### Khám phá quán — Operate

```text
GrabMeFood | Quán ăn | Bài viết | Tuyển chọn     Đã lưu | Chuông | VI/EN | Tài khoản
--------------------------------------------------------------------------------
Khám phá quanh Làng Đại học
[Tìm tên quán hoặc món...................................] [Khu vực v]
Kết quả / trạng thái bộ lọc
[Ảnh quán + Lưu]   [Ảnh quán + Lưu]   [Ảnh quán + Lưu]
Tên quán          Tên quán          Tên quán
Khu vực           Món khớp tìm kiếm ...
--------------------------------------------------------------------------------
Nội dung biên tập / tuyển chọn (không làm chìm thao tác tìm quán)
Nhãn dữ liệu demo + nguồn/credit phù hợp
```

Đề xuất grid 3 cột desktop, 2 cột trung bình, 1 cột màn nhỏ; không thêm bộ lọc chưa duyệt.
Card không có điểm sao, CTA đặt hàng, giá khuyến mại hoặc thời gian giao.
Khi query khớp món, nêu món khớp dưới quán thay vì đổi kết quả thành danh sách món.

### Chi tiết quán / món — Read + thao tác lưu

- Breadcrumb, tên, khu vực/địa chỉ, lưu; ảnh lớn, mô tả, menu món, bình luận.
- Món có trang riêng, tên quán cha và link quay lại; giá có nhãn demo.
- Bản đồ ở trang quán, nút “Xem trên Google Maps” góc trên phải của container.
  Không che nhãn/attribution/controls có sẵn trong iframe; lỗi embed vẫn còn link và địa chỉ.
- Ẩn/xóa: không render lại nội dung đã gỡ từ cache; marker không là card ảnh/tên đầy đủ đã xóa.
- Không tự thêm giờ mở cửa, hotline hoặc tọa độ vào brief khi chưa có dữ liệu được duyệt.

### Bài viết và tuyển chọn — Read

- Tên, summary, ảnh có provenance; bài viết có measure khoảng 65–75 ký tự một dòng.
- Tuyển chọn có lời dẫn và liên kết nội dung khả dụng; không liên kết tới hidden payload.
- Comment bài viết, like/share social SDK hoặc newsletter chưa nằm trong phạm vi.
  Chia sẻ URL/preview là yêu cầu kỹ thuật, không mặc định cần widget social.

### Đã lưu / random — Operate

- Tách tab Quán và Món; danh sách bộ sưu tập riêng, loại bộ hiển thị rõ.
- Random nằm trong khu đã lưu: “Toàn bộ đã lưu” hoặc “Tự chọn các mục”.
- Kết quả cho phép mở chi tiết và random tiếp; không vòng quay gây chờ, không tuyên bố tránh lặp.
- Không mục hợp lệ: giải thích “Chưa có mục khả dụng để chọn”, gợi ý lưu thêm/chọn lại.
- Marker hiển thị “Không còn khả dụng”; thao tác bỏ marker chờ chốt OQ-07/G2-P04.

### Thông báo — Operate

- Chuông là button có accessible name và trạng thái expanded; chấm đỏ không là thông tin duy nhất:
  screen reader nhận “Thông báo, có mục chưa đọc”.
- Panel/list có empty/loading/error, thời gian, phân biệt unread bằng ký hiệu và text weight.
- Đọc một mục điều hướng có kiểm tra đích; không còn đích thì giải thích thay vì link chết.
- Mark all dùng cutoff snapshot, không vô tình đọc luôn thông báo vừa đến.
- Dùng native button/link; keyboard focus rõ, Esc đóng panel và trả focus chuông.

### Quản trị — Operate

- Navigation riêng; bảng/list dữ liệu, form vi/en, trạng thái Công khai/Ẩn và thao tác Xóa.
- Không có Nháp/Chờ duyệt.
- Xóa/khóa có bước xác nhận và tóm tắt tác động là đề xuất UX chờ duyệt.
- Lỗi Auth/DB một phần phải hiện trạng thái pending/partial và nút thử lại hợp lệ,
  không toast “thành công” khi chỉ hoàn tất một bước.
- Không tự thêm dashboard analytics, báo cáo kinh doanh hoặc quản trị role đầy đủ.

## 5. Component inventory đề xuất

Shell/header, locale switcher, search field, area filter, restaurant card, dish card, media gallery,
save-to-collection dialog, collection list, unavailable marker, random picker/result,
comment thread one-level, notification bell/panel, pagination, admin content form,
account row, destructive confirm, inline error/empty/loading.
Không chọn component library trước khi kiểm tra nhu cầu; không dùng native mobile rules làm chuẩn web.

## 6. Responsive và accessibility

- Desktop là ưu tiên: kiểm tra 1280 và 1440 px; điện thoại kiểm tra 390 px và zoom 200%.
  Đây là đề xuất kích thước nghiệm thu, chưa thay yêu cầu “điện thoại dùng được”.
- Navigation co lại nhưng mọi chức năng vẫn truy cập được; không ép app mobile riêng.
- Grid reflow; ảnh có width/height hoặc aspect-ratio tránh layout shift; lazy-load dưới fold.
- Semantic landmarks/headings, label thật cho input, thông báo lỗi gắn field; không chỉ placeholder.
- Mọi thao tác có keyboard, focus visible/không bị sticky header che; modal focus trap/restore đúng.
- Touch target đề xuất 44 CSS px cho controls quan trọng; không nhầm px web với pt/dp native.
- Contrast mục tiêu: text thường 4.5:1, large text và control có nghĩa 3:1 theo vai trò.
- Reduced motion; không animation bắt buộc để xem nội dung; không dùng màu làm dấu unread duy nhất.
- Chuỗi tiếng Anh dài, tên tiếng Việt có dấu, giá/địa chỉ dài phải wrap mà không phá button/card.
- Iframe có title; ảnh alt theo locale; ảnh trang trí không tạo noise cho screen reader.

## 7. Asset và nội dung

Mỗi asset có provenance nguồn/giấy phép hoặc AI, credit và alt.
Không fetch ảnh từ Maps/Michelin như placeholder; không giả ảnh AI là ảnh quán thật.
Nhãn đề xuất: “Dữ liệu demo: món, giá và mô tả có thể không phản ánh thực tế.”
English copy và vị trí nhãn chờ review; thông tin bắt buộc không bị giấu ở footer duy nhất.
Không tạo/gọi dịch vụ AI trong công việc thiết kế tài liệu này.

## 8. Evidence và review còn thiếu

- UI UX Pro Max: chạy tìm UX cho thông báo; kết quả đầu quá rộng, đã thu hẹp truy vấn.
  Dùng guidance web về button semantics, accessible name/state/focus; không áp kết quả native back-button.
- Impeccable: đọc shape/new-work/mode-operate để phân biệt guide/read và admin/operate.
  Không chạy context launcher vì có thể tải binary; không có screenshot critique hoặc detector result.
- Cần review mockup/render và font/contrast thực trước chốt visual baseline.
- Nếu chủ dự án muốn, có thể mở visual companion ở bước review UI; chưa chạy server hoặc tạo mockup.
