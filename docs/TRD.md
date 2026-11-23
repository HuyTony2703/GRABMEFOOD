# Technical requirements — GrabMeFood

> Nhóm 2 đã được duyệt để tiếp tục nhóm 3; phiên bản/thông số có nhiều phương án hoặc TBD
> chưa tự trở thành lựa chọn đã chốt. B1 chọn SSR, shared schema/role, Data API/RPC priority,
> HTTP outbox/HMAC và private staging→public; version/library pin vẫn là gate.

**Trạng thái:** DRAFT nhóm 2 — các phiên bản/thông số đề xuất chưa được duyệt.
Nguồn thành phần/đường gọi: [ARCHITECTURE](ARCHITECTURE.md).
Nguồn contract: [API](API.md); quyền: [SECURITY](SECURITY.md).
Không lặp sơ đồ kiến trúc; tài liệu này quy định cách thực hiện và kiểm tra kỹ thuật.
**Bản chỉnh 5 service:** DEC-025 đã duyệt; deployment, connection, delivery và service identity
theo trạng thái hiện hành trong DECISIONS, không một backend dùng secret toàn cục.

## 1. Phiên bản và evidence

Khảo sát toolchain ban đầu ngày 2026-11-23 không cài dependency/initializer.
Sau đó chủ dự án duyệt riêng scaffold và dependency cho lát cắt frontend Catalog discovery.

| Thành phần | Đã xác nhận hoặc quan sát | Đề xuất chờ duyệt |
| --- | --- | --- |
| Java | User duyệt 21 LTS; local OpenJDK Microsoft 21.0.11 | Giữ Java 21 |
| Maven | User duyệt Maven; không tìm thấy `mvn` trên PATH qua Get-Command | Maven Wrapper 3.9.x, patch/checksum pin khi lập kế hoạch; chưa tải wrapper |
| Spring Boot | Trang system requirements hiện hiển thị 4.2.0, Java 17..27, Maven >=3.6.3 | 4.2.0 là candidate tương thích Java 21 về tài liệu; kiểm tra release/artifact trước pin |
| Node | Local v24.16.0 | Node 24 LTS, khóa patch cho môi trường đã chọn |
| npm | Local npm 11.13.0; frontend lockfile exact | Chưa chốt package manager policy cho backend/monorepo |
| React | Frontend exact React/ReactDOM 19.3.1 trong lockfile; build/test slice pass | Chưa là baseline app đầy đủ |
| TypeScript | Frontend exact 5.9.3 trong lockfile; `tsc -b` pass | Không dùng TypeScript latest 7.0.2 candidate lịch sử |
| Vite | Frontend exact 8.3.8; client/SSR build pass | Chưa kiểm chứng deployment/host |
| React plugin | Frontend exact plugin-react 6.3.0; build pass | Chỉ xác nhận frontend slice |
| supabase-js | Registry 2.119.2, engine Node >=22 | Candidate trên Node 24 |
| Vitest | Frontend exact 5.1.1; 4 files/29 tests pass trên Node 24.16.0 | Không chứng minh integration/E2E |
| React Testing Library | Frontend exact 16.3.3 + DOM 10.4.2; component tests pass | Chỉ xác nhận current frontend tests |
| PostgreSQL | Đọc project trả 17.11 | Không nâng/hạ phiên bản Cloud |

Spring Framework/Security đi theo BOM Spring Boot đã chọn, không pin chồng ngẫu nhiên.
Vitest 5.1.1 và React Testing Library 16.3.3 là ứng viên nghiên cứu mới; metadata registry
không thay cho chọn/pin phiên bản hay kiểm tra dependency resolution. Các package routing, i18n,
styling, SSR chưa chốt. Đề xuất thư viện tối thiểu, không cài cả bộ UI
chỉ vì skill nêu tên. Cài package và wrapper cần quyền task cụ thể sau baseline.

### Frontend slice đã cài theo phê duyệt riêng

Ngày 2026-11-23, tại `frontend/`, đã cài các phiên bản exact trong `package.json`/lockfile:
React/ReactDOM 19.3.1, Vite 8.3.8, plugin-react 6.3.0, TypeScript 5.9.3,
Vitest 5.1.1, React Testing Library 16.3.3, DOM Testing Library 10.4.2,
jsdom 31.0.1 và React type definitions 19.3.0.
Build client + SSR và UI tests local đã chạy thành công (xem evidence implementation tại
[DECISIONS](DECISIONS.md)); điều này chỉ xác nhận lát cắt frontend hiện tại, không là
baseline pin cho các service Java hay bằng chứng tích hợp/Auth/Data API/RLS.

Production server local tại `PORT=4174 npm run start`: GET `/` SSR và asset JS đều HTTP 200
ngày 2026-11-23. Port mặc định 4173 đã có dev server đang nghe; không dừng tiến trình đó.

## 2. Cấu trúc repo đề xuất

```text
frontend/           React/TS/Vite UI + SSR slice đã scaffold; không đồng nghĩa toàn ứng dụng hoàn tất
services/
  catalog/          Spring Boot/Maven độc lập
  collection/       Spring Boot/Maven độc lập
  community/        Spring Boot/Maven độc lập
  notification/     Spring Boot/Maven độc lập
  account-administration/ Spring Boot/Maven độc lập
supabase/           Chỉ nền tảng/shared contract nếu được duyệt; không migration ứng dụng dùng chung tùy ý
docs/               Thiết kế và vận hành
DESIGN.md           Tokens/component và responsive
```

Đây là monorepo đề xuất, không là một Maven application chứa năm module runtime phụ thuộc nhau.
Mỗi service có build/test/artifact/config và migration ownership độc lập; shared thư viện kỹ thuật tối thiểu
chỉ khi duyệt, không share entities/JPA persistence hoặc một transaction manager xuyên miền.
Migration có thể đặt dưới từng service; một nguồn chuẩn/owner, không đồng thời Flyway và Supabase SQL trùng nhau.
Tooling/thứ tự replay chưa chốt G2-P13/G2-P18; năm service chưa scaffold.
Renderer SSR đã chọn và có local entry/server slice; deployment chưa chốt, không là service nghiệp vụ thứ sáu.

## 3. Tích hợp, credentials và cấu hình

### Frontend

- Chỉ URL Supabase, publishable key và public API base từng owner phù hợp được dùng qua biến `VITE_*`.
  Chưa có Gateway; frontend mapping năm service phải là config, không hardcode runtime domain/port.
- Không đưa secret/JWT signing secret/DB password vào bundle hay biến prefix public.
- PKCE/OAuth redirect allowlist phải bám môi trường được duyệt, không wildcard rộng.
- Renderer SSR public dùng client anon riêng; không chia sẻ session global giữa request.
- Session browser do Supabase SDK quản lý; mô hình lưu token/cookie và CSP cần review.

### Năm Spring service

- Đề xuất HTTP client chuẩn Spring cho Auth Admin/Data API; không giả vờ có official Java Supabase SDK.
- Auth Admin chỉ Account Administration; các service khác dùng owner API, không Auth Admin key chung.
- Runtime ưu tiên Data API/RPC. Trước pin adapter phải chứng minh owner role/EXECUTE và actor context
  qua API thật (GATE-01); không mặc định JDBC hoặc dùng global service_role để vượt lỗi.
- Nếu cần thay runtime sang JDBC, trình lý do và xin duyệt lại; migration/admin có thể cần DB credential
  riêng. Không xin password chat hoặc tự tạo Auth machine users/JWT issuer.
- Base URL cố định theo config, không nhận URL tùy ý từ browser.
- Secret chỉ từ kênh secret/môi trường được duyệt, không có `.env` thật trong repo.
- Caller/privileged/internal-service client riêng; không log Authorization/apikey hoặc gửi user JWT nhầm sang admin.
  Secret keys riêng nhưng cùng service_role không chứng minh schema isolation.
- JWT asymmetric: Spring Security Resource Server + JWKS, kiểm tra issuer/expiry/audience/algorithm.
  Nếu project dùng HS256: Auth server `/user` để xác minh, chưa xin/lưu shared JWT secret.
- Không tắt TLS verification.
- P01 chưa chứng minh hosted Auth hook cấp arbitrary DB role. Không pin adapter dựa giả định này;
  xem candidate/trust matrix SECURITY mục 10. Chưa cài SDK, tạo machine users hoặc import signing key.
- Khảo sát P02 chỉ đọc: Node 24.16.0, npm 11.13.0, Java 21.0.11; có `docker.exe`
  nhưng chưa kiểm tra daemon; không thấy `mvn`/`supabase` trên PATH. Candidate tối thiểu
  để trình duyệt sau: Node/npm hiện có; Spring Boot 4.2.0 + Java 21, Maven Wrapper 3.9.x
  cần pin patch/checksum; Supabase CLI pin version cần xác minh. Không có lệnh cài được duyệt.

### SMTP và Google

- Giữ cấu hình SMTP hiện có; chưa xác minh provider, quota, sender domain hoặc email delivery.
- Test xác thực/khôi phục bằng user/email đã duyệt trong spike, không gửi thử tùy ý.
- OAuth Google có thể cần consent/test-user/redirect config; chưa xác minh các cấu hình đó.
- Maps: ưu tiên iframe do luồng Share/Embed chính thức sinh cho dataset nhỏ; không nạp raw HTML admin nhập.
  Chỉ lưu URL host/path allowlist, server/UI tự tạo iframe; nút Maps là link độc lập.
- Không bật Maps Embed API chỉ vì SKU hiện không tính phí: nó vẫn yêu cầu key và cần kiểm tra billing setup.
- Upload direct private staging → Catalog byte/pixel validation → public đã chọn.
  Không coi MIME khai báo là đủ; bucket names/limits/finalize DTO vẫn cần contract review và Cloud approval.

## 4. Lỗi và phân trang

Các giá trị sau là **đề xuất kỹ thuật**, review trước khi biến thành acceptance.

- JSON UTF-8; ID UUID; timestamp UTC ISO-8601; tiền VND integer, không dùng float.
- Ngôn ngữ chỉ `vi` hoặc `en`; route tách locale; không dịch tên thật của quán như tên thương hiệu.
- Page size mặc định 24, tối đa 48 cho discovery; notification/comment 20, tối đa 50.
- Keyset cursor theo cặp khóa ổn định, không chỉ timestamp; offset chỉ nếu dataset/demo chứng minh đủ và được duyệt.
- HTTP/DB errors được chuẩn hóa ở lớp adapter frontend, không giả Supabase trả cùng envelope với Spring.
- Spring dùng ProblemDetail, có mã nghiệp vụ và request ID; không lộ stack trace/SQL/email/secret.
- RLS có thể trả 0 rows thay vì 403; đọc 0 row không chứng minh không tồn tại hoặc test deny thành công.
- Command/API và owned RPC nếu có nhận operation ID để replay; version kiểm soát cập nhật đồng thời.
- Không retry mutation mù; timeout chưa rõ kết quả phải tra operation hoặc retry đúng ID.
- Đề xuất timeout HTTP 10 giây cho API ngoài, tối đa 2 retry có backoff cho read/lỗi tạm;
  giá trị thực chờ test. Ban/delete/send chỉ retry theo state machine và idempotency.
- HTTP outbox/inbox và HMAC đã chọn: mỗi producer quản lý delivery theo consumer,
  lease và backoff; inbox receipt + owned mutation atomic; claim quá hạn/poison event/manual replay phải thiết kế.
  Không có service worker thứ sáu hoặc broker/cron platform được tự cấp quyền bởi quyết định này.
- HTTPS khi triển khai; request HMAC theo cặp service, fresh request timestamp/nonce cho mỗi attempt,
  eventId ổn định qua retry. Wire format/algorithm/skew/key rotation còn review; không tự chế crypto primitive.

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
- DB transaction lỗi trả mã nghiệp vụ. Phân biệt local command committed với delivery notification còn pending;
  không tuyên bố inbox được ghi cùng transaction producer hoặc báo full cleanup khi thiếu receipts.
- Không thêm nền tảng log tính phí; log platform Free có retention giới hạn.
- Build/test/artifact riêng frontend và **từng service**; integration contract/event/DB replay/RLS test riêng.
- Đề xuất tests: frontend unit/component + E2E; Spring JUnit/HTTP mocks; SQL pgTAP và Data API thật.
  Framework/versions và lệnh executable chưa chốt, sẽ viết kế hoạch sau baseline.
- TDD khi triển khai; không yêu cầu test chạy cho endpoint chưa tồn tại.
- Log thêm service name, producer/event ID, consumer/delivery attempt và correlation ID qua các hop;
  không biến log thành kho lưu comment/email đã xóa.
- Test bắt buộc: một service down; crash commit→send→ack; duplicate/out-of-order; role không ghi được schema khác;
  user khóa token cũ; cleanup nhiều owner thất bại một phần. Một backend build không chứng minh microservices.

## 7. Ngân sách và phi chức năng

- Chỉ miễn phí; trước chọn host xác minh điều khoản Free, sleep/cold-start, hạn mức build/bandwidth.
- Không tự dùng credit trial làm phương án “miễn phí lâu dài”.
- Supabase Free theo bảng giá đã đọc: DB 500 MB, Storage 1 GB, Realtime 200 peak connections/
  2 triệu messages tháng; API requests không giới hạn không đồng nghĩa egress/compute vô hạn.
- Chưa xác nhận plan/quota project; không cam kết đủ cho traffic công khai.
- Ảnh chuẩn bị resize/nén sẵn vì Image Transformations không có trên Free.
- Số user đồng thời, latency percentile, RPO/RTO, dung lượng dataset và SLA: TBD, không tự đặt như đã duyệt.
- SSR đã chọn nhưng host chưa chốt; không cam kết cache invalidation latency. URL ảnh public cũ
  có thể đọc sau hide theo quyết định user, không hứa thu hồi byte đã tải.
- Năm service làm tăng RAM/connection và rủi ro free hosting sleep; chưa cam kết public deployment miễn phí
  đủ năm runtime. Có thể nghiên cứu chạy local riêng process cho đồ án, nhưng chưa chốt môi trường/release.
- Nếu chỉ bật event-based cache thì phải đo propagation lag, không tự coi đáp ứng random/ẩn/khóa.
  Consistency/completion và latency budget là G2-P16, chưa có con số được duyệt.

## 8. Nguồn kiểm tra

- [Spring requirements](https://docs.spring.io/spring-boot/system-requirements.html)
- [Vite guide](https://vite.dev/guide/), [SSR/SSG](https://vite.dev/guide/ssr)
- Registry metadata: [React](https://registry.npmjs.org/react/latest),
  [TypeScript](https://registry.npmjs.org/typescript/latest), [Vite](https://registry.npmjs.org/vite/latest),
  [React plugin](https://registry.npmjs.org/@vitejs%2Fplugin-react/latest),
  [supabase-js](https://registry.npmjs.org/@supabase%2Fsupabase-js/latest),
  [Vitest](https://registry.npmjs.org/vitest/latest),
  [React Testing Library](https://registry.npmjs.org/@testing-library%2Freact/latest).
- [Maps Share/Embed](https://support.google.com/maps/answer/7101463?hl=en),
  [Embed API pricing](https://developers.google.com/maps/documentation/embed/usage-and-billing)
- [Supabase pricing](https://supabase.com/pricing), [SMTP](https://supabase.com/docs/guides/auth/auth-smtp)
- [API key types và headers](https://supabase.com/docs/guides/api/api-keys):
  publishable/secret gửi qua apikey, không tự dùng làm Bearer JWT.

Nguồn web chứng minh tài liệu/metadata trả về trong phiên, không chứng minh dependency resolution,
build local, dịch vụ được cấu hình hoặc không có advisory cho version candidate.
