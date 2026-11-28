# GrabMeFood backend — GRAB-3 toolchain

Một ứng dụng Spring Boot 4.2.0, Java 21 và Maven Wrapper 3.10.2 được tạo mới
từ Spring Initializr; không sử dụng mã backend/SQL của phương án cũ.
Mốc GRAB-3 ban đầu chỉ có shell. GRAB-7 hiện đã có API collections/random,
Auth caller verification và Data API client dùng JWT user; chưa nghiệm thu
Auth/RLS Cloud qua các route này. Không có credential hardcode hoặc JDBC.

## Chạy local trên Windows

Yêu cầu Java 21 và kết nối tới Maven Central khi tải dependency lần đầu.
Không cần cài Maven trên máy; Maven Wrapper chỉ tải bản Maven đã pin vào
cache local. Chạy trong `backend/`:

```powershell
.\mvnw.cmd test
.\mvnw.cmd package
java -jar target/grabmefood-backend-0.0.1-SNAPSHOT.jar --server.port=8080
```

Mở `http://127.0.0.1:8080/`: **404 là kết quả dự kiến** cho root không có route,
không phải lỗi build hay proof rằng API nghiệp vụ đã chạy. Test hiện chỉ
kiểm Spring context và các ca GRAB-7 local. Để dừng ứng dụng, dùng Ctrl+C.

Frontend chạy riêng tại `frontend/` bằng `npm test` và `npm run build`.
Frontend public SSR đọc Supabase trực tiếp (GRAB-6 Done), không gọi Catalog
cũ cổng 8086. Private frontend chuyển `/api/collections...` và `/api/random`
qua proxy cùng origin tới Spring cổng 8080; xem contract GRAB-7 trong docs/API.md.
Không đặt secret, service_role hoặc password trong repo.

## GRAB-4: request chỉ đọc, chưa tích hợp sản phẩm

`DataApiSmokeTest` gửi **GET** trực tiếp từ Java HTTP client tới Data API.
Đặt `GMF_SUPABASE_URL` và `GMF_SUPABASE_PUBLISHABLE_KEY` trong môi trường
process được phép, sau đó chạy `.\mvnw.cmd test` ở `backend/`. Nếu hai biến
vắng mặt, test live được **skip**, không được coi là đã kiểm Cloud. Test chỉ
chấp nhận HTTP 200 từ bảng `restaurants` hiện hành; không còn chấp nhận 404; nó
không xác minh schema, nội dung, Auth, RLS hay quyền của user thật.
Không đưa giá trị key, secret hoặc response dữ liệu cá nhân vào báo cáo.
