# Thiết kế: Editorial Discovery

- **Ý định:** Làm trang khám phá hiện tại giàu tính biên tập hơn, có nhịp bố cục gần trải nghiệm cẩm nang ẩm thực kiểu Michelin Guide để giúp sinh viên khám phá quán; chỉ tham khảo cấu trúc, không sao chép nhận diện/tài sản.
- **Phạm vi:** Header điều hướng tĩnh, hero biên tập, form search/filter hiện có, một editorial feature minh họa, phần kết quả/empty state, footer; responsive và accessible.
- **Không mục tiêu:** Không thêm tính năng nghiệp vụ, route, dữ liệu runtime, quán/món thật, ảnh bên ngoài, API, Supabase hay backend. Không thêm thương hiệu/logo/font/copy/ảnh Michelin hoặc pixel-perfect clone.
- **Ràng buộc:** React + TypeScript + Vite hiện có; không cài dependency. Tiếp tục dùng semantic landmarks, label thật, focus visible, responsive layout. Màu xanh lá/neutral của GrabMeFood giữ riêng.
- **Approaches:**
  1. Chỉ restyle form và danh sách hiện có: rủi ro thấp nhưng thiếu nhịp editorial rõ rệt.
  2. Mở rộng cùng trang thành editorial discovery composition với hero, search, CSS-only visual feature và results — **được chọn theo ủy quyền tự quyết của chủ dự án**, cân bằng giống cấu trúc guide và không đòi dữ liệu/ảnh chưa được duyệt.
  3. Homepage nhiều khu nội dung/collection thật: không chọn vì cần dữ liệu và nội dung chưa có.
- **Calls của implementer:** CSS illustration abstract không gợi địa điểm/ảnh thật; navigation là anchor nội trang/placeholder không tạo route mới; nội dung ghi rõ mang tính minh họa nếu có khả năng bị hiểu là quán thật.
- **Còn mở:** Visual baseline tổng thể vẫn cần chủ dự án review sau khi xem render; đây không đóng TBD sản phẩm hoặc GATE-01.
