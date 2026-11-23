# Technical requirements — GrabMeFood

**Trạng thái:** DRAFT nhóm 2 — các phiên bản/thông số đề xuất chưa được duyệt.
Nguồn thành phần/đường gọi: [ARCHITECTURE](ARCHITECTURE.md).
Nguồn contract: [API](API.md); quyền: [SECURITY](SECURITY.md).
Không lặp sơ đồ kiến trúc; tài liệu này quy định cách thực hiện và kiểm tra kỹ thuật.

## 1. Phiên bản và evidence

Khảo sát ngày 2026-11-23, không cài dependency và không chạy initializer.

| Thành phần | Đã xác nhận hoặc quan sát | Đề xuất chờ duyệt |
| --- | --- | --- |
| Java | User duyệt 21 LTS; local OpenJDK Microsoft 21.0.11 | Giữ Java 21 |
| Maven | User duyệt Maven; không tìm thấy `mvn` trên PATH qua Get-Command | Maven Wrapper 3.9.x, patch/checksum pin khi lập kế hoạch; chưa tải wrapper |
| Spring Boot | Trang system requirements hiện hiển thị 4.2.0, Java 17..27, Maven >=3.6.3 | 4.2.0 là candidate tương thích Java 21 về tài liệu; kiểm tra release/artifact trước pin |
| Node | Local v24.16.0 | Node 24 LTS, khóa patch cho môi trường đã chọn |
| npm | Có executable, chưa kiểm tra version | npm với lockfile; không tạo workspace monorepo tool riêng |
| React | Registry `latest` trả 19.3.1 | React/ReactDOM cùng patch; chưa install |
| TypeScript | Registry `latest` trả 7.0.2 | Cần kiểm tra plugin/lint/test hỗ trợ trước chọn, không lấy latest làm bảo đảm tương thích |
| Vite | Registry trả 8.3.8; guide hiển thị 8.3.7; engine ^20.19 hoặc >=22.12 | 8.3.8 candidate, không coi khác biệt docs/registry là build evidence |
| React plugin | Registry 6.3.0, peer Vite ^8 | Candidate cùng Vite 8, cần kiểm chứng optional peer/toolchain |
| supabase-js | Registry 2.119.2, engine Node >=22 | Candidate trên Node 24 |
| PostgreSQL | Đọc project trả 17.11 | Không nâng/hạ phiên bản Cloud |

Spring Framework/Security đi theo BOM Spring Boot đã chọn, không pin chồng ngẫu nhiên.
Các package test, routing, i18n, styling, SSR chưa chốt. Đề xuất thư viện tối thiểu, không cài cả bộ UI
chỉ vì skill nêu tên. Cài package và wrapper cần quyền task cụ thể sau baseline.

## 2. Cấu trúc repo đề xuất

```text
frontend/           React/TS/Vite và test UI (chưa tạo)
backend/            Spring Boot/Maven và test server (chưa tạo)
supabase/migrations/ SQL executable có version (chưa tạo)
supabase/tests/      Kiểm thử DB/grants/RLS (chưa tạo)
docs/               Thiết kế và vận hành
DESIGN.md           Tokens/component và responsive
```

Không có file/package của cấu trúc trên ở hiện tại. Renderer SSR nếu được chọn cần thiết kế entry
và deployment riêng trong frontend, không tự thêm một service scaffold.

## 3. Tích hợp, credentials và cấu hình

### Frontend

- Chỉ URL Supabase, publishable key và public API base phù hợp được dùng qua biến `VITE_*`.
- Không đưa secret/JWT signing secret/DB password vào bundle hay biến prefix public.
- PKCE/OAuth redirect allowlist phải bám môi trường được duyệt, không wildcard rộng.
- Nếu SSR được chọn, renderer public dùng client anon riêng; không chia sẻ session global giữa request.
- Session browser do Supabase SDK quản lý; mô hình lưu token/cookie và CSP cần review.

### Spring

- Đề xuất HTTP client chuẩn Spring cho Auth Admin/Data API; không giả vờ có official Java Supabase SDK.
- Base URL cố định theo config, không nhận URL tùy ý từ browser.
- Secret chỉ từ kênh secret/môi trường được duyệt, không có `.env` thật trong repo.
- Caller/privileged client riêng; không log Authorization/apikey hoặc gửi user JWT nhầm sang admin request.
- JWT asymmetric: Spring Security Resource Server + JWKS, kiểm tra issuer/expiry/audience/algorithm.
  Nếu project dùng HS256: Auth server `/user` để xác minh, chưa xin/lưu shared JWT secret.
- Không tắt TLS verification.

### SMTP và Google

- Giữ cấu hình SMTP hiện có; chưa xác minh provider, quota, sender domain hoặc email delivery.
- Test xác thực/khôi phục bằng user/email đã duyệt trong spike, không gửi thử tùy ý.
- OAuth Google có thể cần consent/test-user/redirect config; chưa xác minh các cấu hình đó.
- Maps: ưu tiên iframe do luồng Share/Embed chính thức sinh cho dataset nhỏ; không nạp raw HTML admin nhập.
  Chỉ lưu URL host/path allowlist, server/UI tự tạo iframe; nút Maps là link độc lập.
- Không bật Maps Embed API chỉ vì SKU hiện không tính phí: nó vẫn yêu cầu key và cần kiểm tra billing setup.
- Upload byte validation chưa chốt: xem SECURITY G2-P12. Không coi MIME từ browser là kiểm tra
  signature/pixel, không tự thêm endpoint/bucket staging khi chưa duyệt phương án.

## 4. Lỗi và phân trang

Các giá trị sau là **đề xuất kỹ thuật**, review trước khi biến thành acceptance.

- JSON UTF-8; ID UUID; timestamp UTC ISO-8601; tiền VND integer, không dùng float.
- Ngôn ngữ chỉ `vi` hoặc `en`; route tách locale; không dịch tên thật của quán như tên thương hiệu.
- Page size mặc định 24, tối đa 48 cho discovery; notification/comment 20, tối đa 50.
- Keyset cursor theo cặp khóa ổn định, không chỉ timestamp; offset chỉ nếu dataset/demo chứng minh đủ và được duyệt.
- HTTP/DB errors được chuẩn hóa ở lớp adapter frontend, không giả Supabase trả cùng envelope với Spring.
- Spring dùng ProblemDetail, có mã nghiệp vụ và request ID; không lộ stack trace/SQL/email/secret.
- RLS có thể trả 0 rows thay vì 403; đọc 0 row không chứng minh không tồn tại hoặc test deny thành công.
- RPC thay đổi dữ liệu nhận operation ID cho replay an toàn; version kiểm soát cập nhật đồng thời.
- Không retry mutation mù; timeout chưa rõ kết quả phải tra operation hoặc retry đúng ID.
- Đề xuất timeout HTTP 10 giây cho API ngoài, tối đa 2 retry có backoff cho read/lỗi tạm;
  giá trị thực chờ test. Ban/delete/send chỉ retry theo state machine và idempotency.

## 5. Tìm kiếm và song ngữ

- RPC tìm quán và tên món khả dụng; trả quán distinct và một số món khớp, không N+1 toàn bộ menu.
- Không tự thêm fuzzy search, tìm không dấu, autocomplete hoặc semantic search như tính năng đã duyệt.
  Có thể đề xuất tìm không dấu khi kiểm tra dữ liệu Việt; hiện `unaccent`/`pg_trgm` chưa cài trên project.
- Dataset nhỏ có thể dùng tham số ILIKE được escape `%`/`_`, không ghép SQL từ client.
  Index tên dạng B-tree không tối ưu `%substring%`; cần đo, không tuyên bố index giải quyết sẵn.
- Mỗi nội dung công khai có cả vi/en trước publish là **đề xuất chờ duyệt** để tránh trang SEO thiếu bản dịch.
- Trước chốt SEO phải quyết định canonical/hreflang, status 404/410, sitemap và robots;
  không index admin/collection/notification/auth callback, không cache HTML cá nhân.
- Không dùng structured data sao/điểm hoặc giá demo như thông tin thương mại đã xác thực.

## 6. Logging và chất lượng

- Spring log request ID, operation ID, hành động, mã kết quả và thời lượng; không log body/token.
- DB function lỗi trả mã nghiệp vụ, không nuốt lỗi notification rồi báo mutation thành công.
- Không thêm nền tảng log tính phí; log platform Free có retention giới hạn.
- Build riêng frontend/backend; DB replay và RLS test tách khỏi unit test.
- Đề xuất tests: frontend unit/component + E2E; Spring JUnit/HTTP mocks; SQL pgTAP và Data API thật.
  Framework/versions và lệnh executable chưa chốt, sẽ viết kế hoạch sau baseline.
- TDD khi triển khai; không yêu cầu test chạy cho endpoint chưa tồn tại.

## 7. Ngân sách và phi chức năng

- Chỉ miễn phí; trước chọn host xác minh điều khoản Free, sleep/cold-start, hạn mức build/bandwidth.
- Không tự dùng credit trial làm phương án “miễn phí lâu dài”.
- Supabase Free theo bảng giá đã đọc: DB 500 MB, Storage 1 GB, Realtime 200 peak connections/
  2 triệu messages tháng; API requests không giới hạn không đồng nghĩa egress/compute vô hạn.
- Chưa xác nhận plan/quota project; không cam kết đủ cho traffic công khai.
- Ảnh chuẩn bị resize/nén sẵn vì Image Transformations không có trên Free.
- Số user đồng thời, latency percentile, RPO/RTO, dung lượng dataset và SLA: TBD, không tự đặt như đã duyệt.
- Do chưa chốt host/SEO, chưa có cam kết thời gian cập nhật metadata hoặc quyền thu hồi ảnh qua CDN.

## 8. Nguồn kiểm tra

- [Spring requirements](https://docs.spring.io/spring-boot/system-requirements.html)
- [Vite guide](https://vite.dev/guide/), [SSR/SSG](https://vite.dev/guide/ssr)
- Registry metadata: [React](https://registry.npmjs.org/react/latest),
  [TypeScript](https://registry.npmjs.org/typescript/latest), [Vite](https://registry.npmjs.org/vite/latest),
  [React plugin](https://registry.npmjs.org/@vitejs%2Fplugin-react/latest),
  [supabase-js](https://registry.npmjs.org/@supabase%2Fsupabase-js/latest).
- [Maps Share/Embed](https://support.google.com/maps/answer/7101463?hl=en),
  [Embed API pricing](https://developers.google.com/maps/documentation/embed/usage-and-billing)
- [Supabase pricing](https://supabase.com/pricing), [SMTP](https://supabase.com/docs/guides/auth/auth-smtp)
- [API key types và headers](https://supabase.com/docs/guides/api/api-keys):
  publishable/secret gửi qua apikey, không tự dùng làm Bearer JWT.

Nguồn web chứng minh tài liệu/metadata trả về trong phiên, không chứng minh dependency resolution,
build local, dịch vụ được cấu hình hoặc không có advisory cho version candidate.
