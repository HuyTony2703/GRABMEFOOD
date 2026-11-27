# Yêu cầu kỹ thuật — hướng monolith

React/TypeScript/Vite frontend được giữ; Java 21, Maven, một Spring Boot
backend và một Supabase project. Backend kết nối Data API. Backend/SQL cũ
không được tái sử dụng; không có năm build hoặc năm runtime.

Chưa pin bản triển khai monolith, host hay contract/credentials mới. Chỉ dùng
giải pháp miễn phí sau khi kiểm điều kiện sử dụng. Build/test frontend hiện
có không chứng minh tích hợp sản phẩm với database mới.

Một nguồn migration cho schema ứng dụng mới; giữ migration history đã chạy
trên Cloud để có thể giải thích trạng thái cũ và migration chuyển đổi.
Không khởi tạo/reset project Supabase hay thay secret/config ngoài phạm vi duyệt.
