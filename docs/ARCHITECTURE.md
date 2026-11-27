# Kiến trúc GrabMeFood — mục tiêu mới

**Quyết định của nhóm:** một ứng dụng Spring Boot, một frontend React/Vite, một
project Supabase. Năm miền Catalog, Collection, Community, Notification và
Account Administration là các module nghiệp vụ, không phải microservices.

```text
React/Vite (SSR public, CSR private)
    ├── Supabase Auth / Data API / Storage / Realtime (đường được cấp quyền)
    └── Spring Boot monolith (các thao tác cần xác minh/đặc quyền)
            └── Supabase Data API
```

Không tái sử dụng mã hoặc SQL backend năm service cũ. Database nghiệp vụ và
ranh giới browser/backend phải thiết kế lại; **chưa có backend monolith, migration
mới hoặc kiểm thử quyền mới được nghiệm thu**. Các module trong một process không
cần HTTP nội bộ, HMAC theo cặp, machine identity hay proof cô lập năm process.

Vẫn giữ nguyên yêu cầu sản phẩm tại PRD/DOMAIN: dữ liệu riêng phải có quyền sở
hữu thực, admin được kiểm tra ở phía server, tài khoản bị khóa không thao tác
được với phiên cũ, dữ liệu ẩn không lộ và dữ liệu xóa được xử lý đầy đủ.
Publishable key không phải bí mật; secret không đặt ở frontend. Với thao tác
multi-step qua Data API không được tuyên bố nguyên tử nếu chưa có một RPC được
thiết kế và kiểm chứng. Realtime là tín hiệu, không phải nguồn dữ liệu bền vững.

Tài liệu và evidence trước quyết định đổi kiến trúc là lịch sử, không được dùng
làm acceptance cho hệ thống monolith. Phạm vi và quy tắc sản phẩm: [PRD](PRD.md),
[DOMAIN](DOMAIN.md).
