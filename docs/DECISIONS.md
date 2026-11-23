# Quyết định, câu hỏi mở và review

**Trạng thái:** Ba nhóm tài liệu đã được duyệt; baseline **B1 về phạm vi và hướng kiến trúc**
được tổng hợp theo các quyết định đã xác nhận ngày 2026-11-23.
Đây không phải baseline code/migration/deploy sẵn chạy. Kế hoạch B1 đã duyệt để tiếp tục preparation.
Các TBD không có câu trả lời và gate kỹ thuật chưa có bằng chứng vẫn mở.
**Bổ sung đã duyệt DEC-025:** 5 microservices; chủ dự án cho phép sửa cả nhóm 1 để nhất quán.
Không dùng lại bản nháp một backend như ràng buộc hiện tại.

## 1. Nguồn chuẩn

- Phạm vi/acceptance: PRD; thuật ngữ/business rules: DOMAIN; luồng: APP-FLOWS.
- File này giữ lịch sử, tình trạng phê duyệt, evidence và câu hỏi mở; không sao chép toàn bộ đặc tả.
- Ba nhóm đã có file và được duyệt; registry B1 bên dưới xác định phần đã chốt và các điều kiện còn mở.
- Thứ tự/dependency/task preparation theo kế hoạch liên kết tại README; chưa tạo Jira/task tracker thứ hai.
- Jira có thể đã thay đổi từ lần khảo sát; kiểm tra trạng thái hiện hành trước đề xuất issue; chưa có artifact Spec Kit.
- Chưa tạo `docs/adr/`; chỉ tách ADR khi cần ghi quyết định kiến trúc đủ lớn, tránh file lặp.

## 2. Quyết định đã xác nhận

Tất cả dưới đây được xác nhận trong cuộc trao đổi khởi tạo ngày 2026-11-23 theo ngày phiên làm việc.
Không giả định có phê duyệt độc lập cho các chi tiết triển khai chưa trình.

| ID | Quyết định | Lý do/bối cảnh |
| --- | --- | --- |
| DEC-001 | Dự án mới, không kế thừa sản phẩm/kiến trúc/Jira cũ | Chủ dự án yêu cầu thiết lập lại phạm vi |
| DEC-002 | Repo local `D:\Projects\GRABMEFOOD` | Chủ dự án xác nhận đường dẫn |
| DEC-003 | Sinh viên quanh Làng Đại học ĐHQG TP.HCM; đồ án trước, công khai sau | Không có deadline; nhanh nhưng không ẩu; chỉ miễn phí |
| DEC-004 | Quán là điểm khám phá chính, món thuộc một quán và có trang riêng | User điều chỉnh luồng theo tham chiếu Michelin |
| DEC-005 | Không khách sạn/đặt bàn; các chức năng khác theo danh sách đã chốt | Không dùng “giống Michelin” thay đặc tả; nhận diện riêng |
| DEC-006 | Nhiều bộ sưu tập riêng tư, tách quán/món; cùng mục có thể ở nhiều bộ | Không chia sẻ công khai |
| DEC-007 | Random đã lưu, toàn bộ hoặc tự chọn mục; có thể lặp; toàn bộ khử trùng | Bỏ mục không khả dụng; tập rỗng báo và gợi ý chọn lại |
| DEC-008 | Email/mật khẩu + Google; xác thực email và khôi phục mật khẩu | Khách vẫn đọc nội dung; thao tác cá nhân cần tài khoản |
| DEC-009 | Tìm tên quán/món trả quán, có lọc khu vực | Không duyệt lọc giá/nhóm món |
| DEC-010 | Có bài viết, danh sách tuyển chọn; chỉ admin quản lý nội dung | Dữ liệu chuẩn bị trước |
| DEC-011 | Bình luận chữ quán/món, không điểm; công khai ngay, reply một cấp | Chủ sửa/xóa của mình; admin xóa mọi bình luận |
| DEC-012 | Việt/Anh cho giao diện/nội dung biên tập; không tự dịch bình luận | Ưu tiên máy tính, điện thoại dùng được; cần SEO/preview chia sẻ |
| DEC-013 | Tên/địa chỉ quán thật tham chiếu Maps; mô tả/món/giá có thể giả lập | Thay quyết định quán hoàn toàn hư cấu; giữ nhãn demo |
| DEC-014 | Ảnh có quyền phù hợp, không có thì ảnh AI; AI không tích hợp runtime | Không mặc định được lấy ảnh từ Maps/Michelin |
| DEC-015 | Bản đồ trong trang quán, nút mở Google Maps ở góc | Cách tích hợp miễn phí chưa chốt |
| DEC-016 | Có khu quản trị; khóa/mở/xóa user | Khóa giữ dữ liệu, chặn cả phiên đang mở; xóa cả dữ liệu riêng/bình luận |
| DEC-017 | Chuông realtime, chấm đỏ chưa đọc, mở một mục đánh dấu đọc; có đọc tất cả | Năm loại sự kiện theo DOMAIN; admin gửi riêng/toàn bộ; chỉ trong web |
| DEC-018 | React + TS + Vite; Spring Boot; Java 21 LTS + Maven; PostgreSQL Supabase | Không bỏ Spring hoặc tự thêm hạ tầng lớn |
| DEC-019 | **Lịch sử, được DEC-025 thay thế một phần:** browser dùng Supabase trực tiếp; RPC cho transaction; Spring đặc quyền | Vẫn tận dụng Supabase; không còn giới hạn Spring chỉ quản trị hoặc RPC transaction xuyên miền |
| DEC-020 | Công khai/ẩn/xóa, không nháp | Thay đề xuất workflow nháp chưa được duyệt vì user thấy rườm rà |
| DEC-021 | Ẩn quán kéo theo tính không khả dụng của món | Giữ marker; loại khỏi tìm kiếm/random |
| DEC-022 | Xóa quán kéo theo món, comment/reply; xóa món kéo theo comment/reply | Giữ dấu “Không còn khả dụng” trong bộ sưu tập |
| DEC-023 | Duyệt đề cương 3 nhóm và bắt đầu nhóm 1 | Chưa duyệt baseline, Jira, spike hoặc triển khai |
| DEC-024 | Chủ dự án duyệt nhóm 1 và yêu cầu thực hiện nhóm 2 | Chỉ cập nhật trạng thái nhóm 1 và viết bản nháp nhóm 2; không có quyền code/Cloud |
| DEC-025 | **Duyệt 5 microservices:** Catalog, Collection, Community, Notification, Account Administration | Mục tiêu học hệ thống phân tán trong đồ án; mỗi service build/chạy/deploy độc lập; giữ Supabase Auth/Storage/Realtime/PostgreSQL |
| DEC-026 | Cho phép cập nhật nhóm 2 và sửa nhóm 1 nếu cần theo DEC-025 | Không đổi tính năng/29 requirement; schema, routing, transport, credentials và hosting chưa duyệt |
| DEC-027 | Duyệt nhóm 3 để xác lập baseline và lập kế hoạch | Không cấp quyền cài package, chạy spike, Jira write hoặc Cloud/release |
| DEC-028 | Schema và role riêng từng service trong cùng Supabase PostgreSQL | Chung compute/backup, không gọi là DB-per-service vật lý hoàn toàn |
| DEC-029 | Ưu tiên Data API/RPC cho runtime, không chốt JDBC mặc định | Phải chứng minh credential scope thật; nếu không đạt thì dừng trình phương án, không tự đổi JDBC |
| DEC-030 | Local outbox/inbox + HTTP xác thực; poller trong từng owner; chưa broker | At-least-once/dedup/retry; không service worker thứ sáu |
| DEC-031 | Account Administration sở hữu function chỉ đọc current-state quyền | Ngoại lệ coupling DB có chủ đích; RLS/service được gọi tối thiểu, không quyền sửa/enumerate account |
| DEC-032 | React/Vite SSR trang public, CSR phần cá nhân | Node runtime frontend bổ sung, không service nghiệp vụ thứ sáu; host còn cần khảo sát free |
| DEC-033 | Ảnh đích public; upload trực tiếp private staging → Catalog kiểm tra byte/pixel → public | URL ảnh cũ có thể truy cập sau khi ẩn nội dung; không tạo bucket hoặc hứa thu hồi cache |
| DEC-034 | Xóa comment gốc xóa toàn replies kể cả người khác; xóa user áp dụng tương tự | Community thực hiện cascade nội bộ, không cross-owner FK |
| DEC-035 | Không self-reply notification; dedup nhiều bộ; món+quán public mới báo; admin broadcast chỉ active users | Quy tắc nghiệp vụ, không evidence delivery |
| DEC-036 | Thông báo saved-target/món mới chỉ cho user đã lưu lúc sự kiện và vẫn lưu lúc xử lý gửi | Phải thiết kế kiểm chứng hai mốc thời gian; không gửi sự kiện cũ cho người lưu sau |
| DEC-037 | Chặn hiển thị/sử dụng trước, báo đang xóa; đủ receipts mới báo hoàn tất; lỗi retry an toàn | Không thêm trạng thái Nháp; không hứa transaction phân tán |
| DEC-038 | Không tự khóa/xóa admin; bảo vệ admin active cuối; bootstrap admin do chủ dự án chỉ định/phê duyệt riêng | Danh tính admin đầu và cách cấp thực tế còn cần quyền riêng |
| DEC-039 | HTTPS khi triển khai + HMAC secret riêng theo cặp service, ký đích/thời gian/nội dung, chống replay/lặp | Không dùng Supabase service_role làm danh tính; không tự xây Auth Service |
| DEC-040 | Chủ dự án giao agent tự sắp xếp các lát cắt, thực hiện đầy đủ mọi luồng | Thứ tự theo dependency; không tự giảm scope hoặc nhận quyền triển khai Cloud |
| DEC-041 | Chủ dự án duyệt kế hoạch B1 để tiếp tục việc tiếp theo | Cho phép preparation P01–P03 trong phạm vi kế hoạch; không tự cấp quyền install, spike, Cloud, Jira write hoặc commit |
| DEC-042 | Duyệt hướng khảo sát danh tính máy riêng do Supabase Auth cấp để hoàn thiện P02 | Chỉ duyệt hướng nghiên cứu/đề xuất; không duyệt tạo user/role, bật Auth hook, cài tool hoặc chạy spike |
| DEC-043 | Tiếp tục preparation P02/P03 không phụ thuộc GATE-01; chỉ chặn persistence/phân quyền cần proof | Project có JWT signing key ECC P-256 nhưng không tương đương PostgreSQL role service; không tạo/xoay key; role/schema ứng viên chưa có theo khảo sát chỉ đọc do chủ dự án cung cấp |
| DEC-044 | Bỏ spike M1 trước implementation; tiếp tục các lát cắt độc lập và dừng phần persistence/phân quyền khi cần kết quả GATE-01 | Chủ dự án chấp nhận rủi ro role/Data API/RPC chỉ lộ ra trong implementation; không coi là proof, không đổi quyền Cloud hoặc cho phép tự chọn phương án thay thế |

### Hướng trước DEC-025 — lưu lịch sử, không dùng như ràng buộc hiện tại

- Browser → Auth cho đăng ký/đăng nhập/khôi phục.
- Browser → Data API từng đề xuất cho cả bộ sưu tập/mục lưu và đánh dấu thông báo;
  các mutation này phải rà lại theo owner API, không tự giữ đường bypass.
- Browser → Storage theo policy; Browser → Realtime cho thông báo riêng.
- RPC từng đề xuất nguyên tử thay đổi + inbox; **không còn áp dụng xuyên các service**.
- Phạm vi Spring chỉ quản trị trước đây đã được mở rộng thành năm owner.
- Hướng runtime Auth Admin API + Data API/RPC trước đây phải rà lại; JDBC scoped-role là candidate mới,
  không tự duyệt và không ghép nhiều HTTP request rồi gọi là transaction.
- Auth Admin API và transaction dữ liệu ứng dụng không nguyên tử chung; cần retry/xử lý thất bại một phần.
- Migration/admin có thể dùng đường kết nối/secret khác; không hứa không cần DB password.

### Hướng hiện tại sau DEC-025

- Năm miền/service đã duyệt theo bảng DOMAIN; không tự tách thêm Auth/Search/Media service.
- Supabase là capability nền tảng, không tên khác cho năm module trong một ứng dụng.
- Commands qua owner service; read façade Data API là proposal tận dụng Supabase, không arbitrary table access.
- Mỗi owner chỉ ghi dữ liệu mình; cross-owner API/event thay FK/cascade/join/transaction dùng chung.
- Schema/role riêng cùng DB, outbox/HTTP và read-only security gate đã duyệt DEC-028/030/031.
  Runtime ưu tiên Data API/RPC theo DEC-029; JDBC chỉ là phương án thay thế phải trình lại nếu cần.
- Ngân sách vẫn chỉ miễn phí. Chưa chốt public hosting năm service, Gateway hoặc broker.

## 3. Điều đã kiểm chứng và giới hạn bằng chứng

Đây là ảnh chụp trạng thái lúc khảo sát, không là cam kết tài nguyên không thay đổi.

| Hạng mục | Evidence chỉ đọc trong phiên | Chưa chứng minh |
| --- | --- | --- |
| Repo | Remote đúng `https://github.com/HuyTony2703/GRABMEFOOD.git`; lúc bắt đầu chỉ `.git`, không tracked file; Git sạch trên `main` | Không có code/build/test sản phẩm |
| Jira | Site `huyngocto12356.atlassian.net`; project `GRAB`, ID `10066`, business/next-gen; issue count 0 theo insight | Không thử ghi issue |
| Jira types/status | Task `10067`, Sub-task `10068`; To Do `10066`, Done `10067` | Không suy ra transition graph đầy đủ hoặc có Epic/Story |
| Jira permissions | Project xuất hiện khi lọc action `create` và `edit` | Chưa xác minh quyền admin, đổi workflow/types, delete/transition |
| Supabase target | API URL trả `https://bdhavbwmxbttymerizvx.supabase.co` | Không phải test Data API qua browser |
| Supabase dữ liệu | `public` không có bảng theo list_tables; aggregate Auth users 0, buckets 0, objects 0 | Không khẳng định toàn DB trống hoặc disposable |
| Supabase function | Có `public.rls_auto_enable()`, SECURITY DEFINER, returns event_trigger, gắn `ensure_rls` | Chưa xác định nguồn tạo/lịch sử migration hoặc khả năng gọi qua Data API |
| SMTP | Chủ dự án báo đã cấu hình và sẽ sử dụng | Không đọc/đổi secret, chưa gửi email kiểm chứng |
| Auth/RLS/Spring | Chưa có test thực tế | Không tuyên bố hệ thống hoạt động |

Security Advisor ghi nhận cảnh báo quyền EXECUTE của function trên cho anon/authenticated:
[anon](https://supabase.com/docs/guides/database/database-linter?lint=0028_anon_security_definer_function_executable),
[authenticated](https://supabase.com/docs/guides/database/database-linter?lint=0029_authenticated_security_definer_function_executable).
Do function trả event_trigger, không suy ra ngay cảnh báo đồng nghĩa endpoint khai thác được.
Chưa sửa grants/function/trigger; cần đánh giá riêng và xin quyền nếu phải thay đổi.

### Tài liệu ngoài đã tham khảo

- [Michelin Vietnam restaurants](https://guide.michelin.com/en/vn/restaurants):
  nội dung search index cho thấy các nhóm lọc; công cụ đọc trực tiếp chưa trả nội dung hữu ích.
  **Chưa kiểm thử tương tác UI/gợi ý tìm kiếm thực tế**.
- [Trung tâm quản lý KTX](https://ktxhcm.edu.vn): tham chiếu KTX A/B.
- [Thanh Niên — chợ đêm Làng Đại học](https://thanhnien.vn/thien-duong-mua-sam-o-lang-dai-hoc-bong-dung-diu-hiu-185230816194331647.htm):
  tham chiếu địa danh, không chứng minh hiện trạng từng quán.
- [Supabase pricing](https://supabase.com/pricing), [SMTP](https://supabase.com/docs/guides/auth/auth-smtp),
  [Realtime authorization](https://supabase.com/docs/guides/realtime/authorization): đã đọc tài liệu trong phiên.
  Không thay cho kiểm tra plan/quota hoặc cấu hình thực của project.
- SMTP mặc định được tài liệu mô tả giới hạn địa chỉ và 2 email/giờ; không áp giới hạn này như kết luận
  cho SMTP riêng của chủ dự án khi chưa kiểm tra provider/rate limit.
- Realtime authorization có cache quyền; không coi ngắt UI hoặc thu hồi Auth là đủ để bảo đảm khóa tức thì.

### Công cụ/skill

- Đã dùng filesystem/Git read-only, web tools, Atlassian MCP read-only và Supabase MCP read-only.
- Đã nạp brainstorming và UI UX Pro Max; không chạy bộ script nghiên cứu UX của skill.
- Writing-plans đã nạp khi bắt đầu viết tài liệu; **chưa lập kế hoạch triển khai**, không dùng skill này
  để bỏ qua duyệt thiết kế.
- Chưa xác minh/cài GitHub Spec Kit hoặc Supabase agent skills.
- Không cài package/công cụ, không thay cấu hình OpenCode, không chạy Supabase CLI/initializer.

### Khảo sát bổ sung cho nhóm 2 — trước chỉnh microservices

- Kiểm tra lại Git trước khi ghi: sáu file nhóm 1 vẫn untracked, chưa thấy code hoặc tài liệu nhóm 2.
- Đọc lại schema `public`: chưa có bảng. SQL metadata chỉ đọc trả PostgreSQL **17.11**,
  publication `supabase_realtime`, extensions pg_stat_statements/pgcrypto/plpgsql/supabase_vault/uuid-ossp.
  Chưa bật publication cho bảng mới, chưa cài extension.
- Local: Node **24.16.0**, Java Microsoft **21.0.11**, Python **3.12.10**.
  Có npm executable nhưng chưa kiểm tra version; `Get-Command` không tìm Maven/Supabase trên PATH,
  không chứng minh máy hoàn toàn chưa cài các công cụ đó.
- Registry npm `latest` trả React 19.3.1, TypeScript 7.0.2, Vite 8.3.8,
  plugin-react 6.3.0, supabase-js 2.119.2. Trang requirements Spring trả 4.2.0.
  Chỉ là metadata/version candidate, chưa resolve dependencies/build; xem nguồn ở TRD.
- Đã đọc tài liệu chính thức RLS/grants/functions/JWT/Postgres Changes/Storage/User management,
  Vite SSR/SSG và Google Share/Embed. Không dùng đọc tài liệu làm bằng chứng tích hợp thật.
- UI UX Pro Max: Python search không persist, truy vấn đầu rộng, đã thu hẹp;
  dùng guidance semantics/accessibility cho web, không dùng native-only result.
- Impeccable: đọc playbook và fallback context bằng tài liệu dự án; không chạy launcher có khả năng
  tải binary, không tạo PRODUCT.md hoặc artifact ngoài đề cương, không có visual render evidence.
- Không xác minh plan/quota/SMTP/OAuth bằng cách thử ghi hoặc gửi email; chưa có quyền test Cloud.
- Khi kiểm tra cuối lượt, Git đã có commit `8fd454a` (Add initial documentation for GrabMeFood project).
  Agent không chạy commit; chỉ ghi nhận trạng thái mới và kiểm tra diff để bảo toàn nội dung đã duyệt.
- Reviewer độc lập chỉ đọc đã nêu ba khoảng trống: admin SELECT registry hidden, thành phần kiểm tra byte ảnh,
  và operation tài khoản cạnh tranh qua HTTP. Đã đối chiếu và sửa rõ draft: thêm ngoại lệ admin hiện tại,
  đề xuất guard theo target, và G2-P12 buộc chọn cơ chế upload validation. Đây không phải evidence runtime.
- Reviewer kiểm tra lại đúng ba điểm và xác nhận đã làm rõ ở mức draft; không kết luận
  toàn bộ thiết kế hết câu hỏi hoặc hệ thống đã an toàn/chạy được.
- Kiểm tra tĩnh nhóm 2: 12 file Markdown, 32 link local hợp lệ, sáu nhãn DRAFT nhóm 2;
  29 requirement ID và 35 rule ID không trùng/không có reference ID lạ; fences cân bằng;
  không thấy trailing whitespace hay mẫu credential trong phép quét. `git diff --check` không có lỗi,
  có cảnh báo Git LF→CRLF; không thay cấu hình Git hoặc tự tạo .gitattributes.
  Đây không phải Markdown/Mermaid render test, full secret audit, dependency build hoặc kiểm thử API/RLS.

### Cập nhật thiết kế theo DEC-025

- Bắt đầu lượt với Git sạch trên main, ahead origin/main 2 commits; HEAD quan sát `c9f6d64`.
  Bảo toàn các commit có sẵn; agent không commit/reset/stage.
- Đã đọc cả 12 file trước sửa; cập nhật ràng buộc nhóm 1 và bản nháp nhóm 2, không đổi nội dung
  29 requirement/35 business rule đã duyệt.
- Bỏ các coupling trong thiết kế cũ: browser mutation RPC bỏ owner, producer ghi inbox service khác,
  FK từ saved/comments/notifications đến Catalog/Auth để cascade, một Spring backend quản trị duy nhất.
- Bổ sung ownership, candidate API/event, cleanup receipts, scoped credentials và consistency blockers.
  Không tạo SQL, user, schema, role, bucket, service code hoặc cấu hình Cloud.
- Nguồn đã đọc thêm: [Data sovereignty](https://learn.microsoft.com/en-us/dotnet/architecture/microservices/architect-microservice-container-applications/data-sovereignty-per-microservice)
  và [Transactional outbox](https://docs.aws.amazon.com/prescriptive-guidance/latest/cloud-design-patterns/transactional-outbox.html).
  Chỉ lấy nguyên tắc ownership/local transaction/delivery; không áp .NET/AWS/broker của ví dụ vào dự án.
- Reviewer chỉ đọc phát hiện hidden/deleted event chưa phân biệt, có nguy cơ xóa comment khi chỉ ẩn.
  Đã đối chiếu BR-LIFE-01 và tách Hidden/Deleted/Restored trong API, ARCHITECTURE, DATABASE.
  Reviewer kiểm tra lại đúng điểm này xác nhận đã rõ ở mức draft, không kết luận toàn bộ thiết kế đã pass.
- Làm rõ Realtime dùng bảng thật `notification.notification_signals`, không nhận Postgres Changes từ view;
  custom-schema grants/publication vẫn cần test và xin quyền trước thay Cloud.
- Kiểm tra tĩnh bản chỉnh: 12 Markdown file, 33 link local hợp lệ, ID references đều có nguồn;
  29 requirement rows và toàn bộ phần 35 business rules giữ nguyên so với HEAD, sáu nhãn DRAFT nhóm 2 còn nguyên.
  So sánh đầu bằng PowerShell bị false positive do native-output IBM437; đã xác minh bằng diff và chạy lại
  đọc bytes Git/file UTF-8 với Python, không đổi cấu hình máy.
- Quét fences/whitespace/mẫu credential và scope file; không có file mới ngoài 12 tài liệu hiện có.
  Không có build/test local sản phẩm, API/Auth/RLS/Spring/inter-service/migration replay hoặc render Mermaid.
  Các kết quả trên không thay phê duyệt G2-P13..18 hay chứng minh dịch vụ đã triển khai.

## 4. Câu hỏi mở và đề xuất chờ duyệt

Không cần hỏi tất cả ngay; giải quyết theo nhóm trước khi thiết kế/triển khai phần liên quan.

| ID | Chưa xác định | Điểm cần chốt |
| --- | --- | --- |
| OQ-01 | Phiên bản Spring Boot, Node/package manager, thư viện và test tools | Nhóm 2; Java 21/Maven không hỏi lại |
| OQ-02 | SSR React/Vite đã chọn; còn URL/canonical/hreflang, plugin và fallback bản dịch | DEC-032; không tự đổi Next.js |
| OQ-03 | Tích hợp map miễn phí, nguồn tên/địa chỉ, điều kiện sử dụng | Trước thu thập dữ liệu/khởi tạo key; không mặc định scrape |
| OQ-04 | Nội dung trường quán/món, số lượng seed, nguồn/quyền ảnh | Trước chuẩn bị dataset; không tự suy ra từ Michelin |
| OQ-05 | Gán khu vực, trùng khu vực và taxonomy | Danh mục 3 nhóm do agent chọn là danh mục ban đầu, không địa giới |
| OQ-06 | Chọn một bộ khi random có còn là chế độ riêng? Xác suất và trường hợp mục bị gỡ đồng thời | Trước thiết kế random |
| OQ-07 | Đổi tên/xóa bộ, tên trùng/giới hạn tên, bỏ lưu | Gom đề xuất UI + business rules |
| OQ-08 | Xóa comment/reply đã chốt cascade; còn giới hạn chữ/số bình luận | DEC-034, không hỏi lại cascade |
| OQ-09 | Quy tắc recipient đã chốt; còn thuật toán dedup/retry và hai mốc save | DEC-035/036; không lưu lịch sử cá nhân vô hạn mặc định |
| OQ-10 | Đích thông báo đã xóa, retention, nhiều tab và mất kết nối | Nhóm thiết kế thông báo |
| OQ-11 | Admin safety đã chốt; còn danh tính/bootstrap, user tự xóa chưa thuộc scope | DEC-038; quyền cấp admin cần duyệt riêng |
| OQ-12 | Reply người khác và progress đã chốt; còn retention thông báo/receipts và recovery kỹ thuật | DEC-034/037; không đổi cascade đã chọn |
| OQ-13 | Công khai lại quán/món; marker giữ trường gì, bao lâu | Trước schema vòng đời |
| OQ-14 | Account linking email/Google, OAuth config, provider SMTP/quota | Khảo sát không lộ secret; chỉ test khi duyệt target |
| OQ-15 | Môi trường dev/test, hosting miễn phí, backup/recovery, RPO/RTO và mục tiêu hiệu năng | Nhóm 3; chưa deploy |
| OQ-16 | Chi tiết Data API/RPC/Spring, schema RLS và quyền Realtime khi khóa user | Nhóm 2; không xem hướng đã duyệt là test đã đạt |
| OQ-17 | Jira hierarchy/transition graph/admin permission còn thiếu | Không tự tạo issue thử hoặc đổi project để kiểm chứng |
| OQ-18 | Có dùng Spec Kit không; có cài Supabase skill không | Trình nguồn/lệnh/phạm vi và xin phép trước |
| OQ-19 | Shared DB schema/role đã chọn; còn proof role qua Data API/RPC và migration tooling | DEC-028/029; đây là gate GATE-01 |
| OQ-20 | HTTP/outbox/HMAC và recipient hai mốc đã chọn; còn canonical signing, rotation, replay/ordering/history | DEC-030/036/039; không mặc định broker |
| OQ-21 | Current-state lock/visibility, cleanup completion và consistency window liên dịch vụ | G2-P16/G2-P17; không tự nới acceptance hoặc giữ dữ liệu riêng sau xóa |

Các trạng thái loading/error/empty trong APP-FLOWS là đề xuất thiết kế cần review; không tự chốt copy.
Nhóm 2 hiện có sketch text và token candidate; chưa có wireframe render hoặc acceptance UI được duyệt,
không tuyên bố đã tái tạo giao diện Michelin.

## 5. Tình trạng lựa chọn nhóm 2 sau các xác nhận bổ sung

Các dòng dưới phân biệt lựa chọn đã chốt với phần thiết kế chưa kiểm chứng.
Thông số/names không được xác nhận riêng vẫn là candidate; không suy việc duyệt nhóm thành chọn mọi nhánh.

| ID | Đề xuất / phương án cần duyệt | Tài liệu nguồn |
| --- | --- | --- |
| G2-P01 | Đã chọn SSR React/Vite public + CSR private | DEC-032; framework/host và URL policy còn mở |
| G2-P02 | Version candidates, npm/lockfile, Maven Wrapper và cấu trúc frontend/services theo năm owner | TRD mục 1–2; chưa install |
| G2-P03 | Map iframe lấy từ luồng Share/Embed chính thức, validate URL; không tự bật API/key/billing | TRD mục 3 |
| G2-P04 | Registry Catalog và reference marker Collection riêng, không cross-FK; hide cha không ghi đè state món; một vùng/quán | DATABASE mục 1, 4–5; retention marker TBD |
| G2-P05 | Đã chọn xóa parent/user cascade replies | DEC-034; không giữ thread ẩn danh |
| G2-P06 | Account-owned current-state gate/operation guard + owner cleanup receipts; Realtime tín hiệu không nội dung | ARCHITECTURE, SECURITY; isolation/consistency G2-P16/17 bổ sung, chưa test |
| G2-P07 | Đã chọn public ảnh đích; không thu hồi URL cũ khi hide | DEC-033; lifecycle xóa asset/shared asset còn cần thiết kế |
| G2-P08 | Visual direction sáng/editorial, accent xanh, token/layout và accessibility candidate | DESIGN; chưa render/mockup |
| G2-P09 | Publication yêu cầu đủ vi/en; giới hạn tên/chữ/trang, selected mode random xác suất đều | TRD/API; giá trị và quy tắc còn chờ duyệt |
| G2-P10 | Đã chốt bốn recipient rules và điều kiện save hai mốc | DEC-035/036; history/delivery implementation chưa có |
| G2-P11 | Đã chốt admin safety; bootstrap identity/quyền thực hiện riêng | DEC-038; cần test race admin cuối |
| G2-P12 | Đã chọn direct private staging + Catalog validate/finalize → public | DEC-033; chưa tạo bucket/API |
| G2-P13 | Đã chọn schema/role riêng cùng một Supabase DB | DEC-028; không DB physical isolation |
| G2-P14 | Owner APIs cho commands; Data API chỉ owner-approved reads/search; frontend mapping service URL, Gateway chưa cần mặc định | ARCHITECTURE mục 3; API mục 2–4; chưa duyệt route cụ thể |
| G2-P15 | Đã chọn local outbox/inbox + HTTP poller trong owner, chưa broker | DEC-030; delivery/recovery tham số còn mở |
| G2-P16 | Đã chốt progress xóa và save hai mốc; TOCTOU/latency/retention còn mở | DEC-036/037; không transaction phân tán |
| G2-P17 | Đã chọn shared read-only helper và HTTPS/HMAC theo cặp | DEC-031/039; permission/signing wire contract cần proof |
| G2-P18 | Đã chọn ưu tiên Data API/RPC, không tự fallback JDBC | DEC-029; GATE-01 role isolation chưa vượt |

Các lựa chọn chưa chốt vẫn ngăn implementation/migration phần liên quan.
Không ghi đáp án giả chỉ để đủ một bộ thiết kế “hoàn chỉnh”.

## 6. Baseline B1 và thẩm quyền

Chủ dự án xác nhận “duyệt nhóm 2 để tiếp tục nhóm 3”. Ghi nhận quyền soạn
TEST-STRATEGY và OPERATIONS, không là quyền code/Jira/Cloud/release.
Các nhánh thay thế chưa có câu trả lời không được coi là chọn đồng thời hoặc tự chọn nhánh khuyến nghị.
Nhóm 3 dùng các điều kiện “nếu chọn” và BLOCKED/TBD tương ứng, không tự sửa acceptance nghiệp vụ.
Nhóm 3 sau đó đã được chủ dự án duyệt để tiếp tục baseline/kế hoạch (DEC-027).
Không có test sản phẩm hoặc runbook Cloud nào đã chạy.

### B1 — phần nguồn chuẩn đã xác nhận

- PRD: phạm vi/29 requirement; DOMAIN: quy tắc, bao gồm các xác nhận DEC-034..038.
- ARCHITECTURE/SECURITY: năm owner, shared DB, Data API/RPC ưu tiên, helper chỉ đọc,
  HTTP outbox/HMAC, SSR và upload private staging→public.
- TEST-STRATEGY/OPERATIONS: chiến lược kiểm chứng và quyền vận hành; không là evidence đã pass.
- Candidate version, wire contracts, indexes, retention, visual render và hosting không tự đóng.
- Kế hoạch có review riêng tại README; chỉ task không bị gate và đúng quyền mới được thực hiện.

### Gate kỹ thuật và quyết định còn chặn

| ID | Điều kiện vượt gate | Tác động nếu chưa vượt |
| --- | --- | --- |
| GATE-01 | Data API/RPC xác thực được owner role, chặn cross-owner table/RPC, browser bypass và actor spoof | Chỉ chặn implementation persistence/phân quyền phụ thuộc cơ chế này; P02/P03, thiết kế UX/contract và chuẩn bị độc lập tiếp tục; nếu spike không đạt thì trình lại phương án, không tự đổi JDBC |
| GATE-02 | Pin toolchain/test/SSR libraries và manifests spike, target, resources, secrets channel, cleanup được duyệt | Không scaffold/install hoặc chạy local/Cloud spike |
| GATE-03 | Wire HMAC/canonicalization/rotation, replay/lease/receipts; recipient history hai mốc và retention rõ | Không giả event pipeline sẵn chạy; không giữ lịch sử user vô hạn |
| GATE-04 | Contract validation/UI và rule còn mở được chốt theo lát cắt | Không đoán random theo bộ, giới hạn chữ, translation fallback, marker retention |
| GATE-05 | Host free/môi trường, backup/restore và release target được duyệt | Không public deploy, tạo resource hoặc cam kết free đủ năm service + SSR |

GATE-01 chưa được giải quyết chỉ bởi HMAC hoặc JWT signing key ECC P-256 sẵn có:
chữ ký JWT không tạo PostgreSQL role/grants service. Khảo sát trực tiếp chỉ đọc do chủ dự án
cung cấp thấy role/schema ứng viên năm owner chưa được tạo; do đó chưa kết luận machine-role
hoạt động **hoặc không hoạt động**. API secret thường dùng service_role rộng.
Tài liệu [API keys](https://supabase.com/docs/guides/api/api-keys) đã đọc lại trong lượt này;
không thử credential, tạo Auth service accounts hoặc sửa JWT signing settings.

## 7. Checklist và điểm dừng

- [x] Xác nhận repo và khảo sát Git/cấu trúc chỉ đọc.
- [x] Làm rõ phạm vi chính, ranh giới kiến trúc cấp cao và ngân sách.
- [x] Khảo sát Jira/Supabase tối thiểu; ghi rõ các giới hạn.
- [x] Chủ dự án duyệt danh sách tài liệu, nguồn chuẩn và thứ tự ba nhóm.
- [x] Soạn bản nháp nhóm 1: README, AGENTS, PRD, DOMAIN, APP-FLOWS, DECISIONS.
- [x] Kiểm tra tĩnh nhóm 1: 6 file có nhãn DRAFT, 10 link Markdown local hợp lệ,
  29 requirement ID và 35 rule ID không trùng; không thấy trailing whitespace hoặc mẫu credential
  trong phép quét đã chạy. Không thay cho kiểm toán secret đầy đủ hoặc duyệt nội dung của chủ dự án.
- [x] Kiểm tra Git: chỉ có các tài liệu mới chưa tracked; `git diff --check` không báo lỗi.
  Nội dung file untracked đã kiểm tra riêng, không suy ra từ lệnh diff.
- [x] Chủ dự án review/duyệt nhóm 1.
- [x] Soạn sáu bản nháp nhóm 2; cập nhật link và trạng thái nhóm 1, không đổi các rule đã duyệt.
- [x] Review builder-readiness và kiểm tra tĩnh nhóm 2; ghi rõ các lựa chọn còn chặn triển khai.
- [x] Chủ dự án duyệt mục tiêu 5 microservices và cho phép sửa nhóm 1/2.
- [x] Chỉnh bản nháp theo DEC-025; không tự chốt G2-P13..18.
- [x] Review độc lập và kiểm tra tĩnh lại bản chỉnh 5 service; ghi evidence mới và giới hạn.
- [x] Chủ dự án duyệt nhóm 2 để tiếp tục tài liệu; lựa chọn chưa có đáp án vẫn mở.
- [x] Soạn bản nháp TEST-STRATEGY và OPERATIONS, không chạy test/migration/deploy.
- [x] Chủ dự án duyệt nhóm 3 và các quyết định bổ sung DEC-028..039.
- [x] Tổng hợp baseline B1 cho phần đã chốt, không đánh dấu gate kỹ thuật đã pass.
- [x] Chủ dự án giao thứ tự lát cắt cho agent; toàn bộ scope vẫn giữ.
- [x] Chủ dự án duyệt kế hoạch B1; tiếp tục preparation theo DEC-041.
- [x] Chủ dự án duyệt timeline T1–T8 và thao tác tạo; tạo GRAB-3..GRAB-10, xác minh To Do.
- [ ] Spike không chạy: chủ dự án bỏ spike theo DEC-044; target/resource/cleanup không được suy ra.
- [x] Agent sắp thứ tự theo DEC-040; không cần hỏi lại thứ tự, không đổi quyền triển khai.

Không có commit, push, deploy, migration, seed hay Jira write nào được cho phép bởi checklist này.

### P01 — khảo sát credential sau duyệt B1

Ngày 2026-11-23: đã đọc lại API keys, JWT, RBAC, Custom Access Token Hook,
Database functions và custom schemas chính thức; kết quả/trust matrix tại SECURITY mục 10.
Chỉ đọc web và sửa tài liệu; không gọi API Cloud, đọc secret hoặc tạo tài nguyên.
PostgREST auth reference bị HTTP 429 cả URL docs.postgrest.org và postgrest.org;
chưa dùng nguồn đó để xác nhận role membership/configuration thực tế.

Kết luận hiện tại: API key thường không đủ scope theo owner; user JWT không chứng minh service.
Custom JWT hoặc machine account/claim là candidate cần phê duyệt security riêng và proof.
GATE-01 còn mở; manifest spike chỉ là proposal lịch sử vì user sau đó bỏ spike theo DEC-044.
Chỉ thao tác persistence/quyền thực tế cần proof và quyền target riêng.

### P02 — khảo sát hướng DEC-042

Local ban đầu chỉ đọc: Node 24.16.0, npm 11.13.0, Java 21.0.11; có `docker.exe` trên PATH
nhưng chưa xác minh daemon; không thấy `mvn` hay `supabase` qua Get-Command.
Đọc lại docs chính thức Supabase Auth hook/Postgres roles/CLI, Spring Boot và Vite;
Auth hook minh họa `role` enum anon/authenticated còn khả năng mapping machine account
thành Postgres role riêng **chưa được tài liệu chứng minh**. P02 là manifest *có điều kiện*
trong kế hoạch B1; spike sau đó đã bỏ. GATE-01/02 vẫn mở cho các việc cần proof hoặc quyền riêng.

### P02/P03 — rà soát tiếp theo DEC-043 và Jira timeline

Kiểm tra Jira chỉ đọc ngày 2026-11-23 ban đầu thấy `GRAB-1` và `GRAB-2` ở To Do.
Sau khi chủ dự án duyệt timeline T1–T8 và thao tác ghi, đã tạo `GRAB-3`–`GRAB-10`,
xác minh cả tám ở To Do; `GRAB-1/2` không sửa. Không có Jira issue nào được chuyển Done.

Chủ dự án xác nhận Jira chỉ cần timeline công việc. Không dùng Jira làm bản sao
spec/acceptance/gate/test; nội dung chi tiết ở docs. Timeline T1–T8 trong kế hoạch
B1 đã được duyệt và tạo thành GRAB-3..GRAB-10; Jira chỉ giữ timeline/dependency.
Không tự đổi nội dung hoặc status issue khi chưa có phê duyệt riêng.

### Triển khai theo chỉ đạo DEC-044

Chủ dự án chỉ đạo bỏ bước spike và bắt đầu implementation; chấp nhận khả năng
phát hiện rủi ro Data API/RPC trong lúc làm. GATE-01 vẫn là điểm dừng cho phần
persistence/phân quyền phụ thuộc proof: không tự giả định role isolation đã đạt,
không chuyển JDBC hoặc dùng `service_role` để lách. Thao tác install/scaffold
frontend được duyệt riêng trong phạm vi lát cắt UI; không có thao tác Cloud,
Auth, migration, Jira status hay release.

Ngày 2026-11-23 đã tạo lát cắt frontend Catalog discovery/SSR với test-only
fixtures. Đây mới là UI/search/filter và SSR framework proof local; chưa có
Catalog API, dữ liệu thật/demo được publish, Auth/RLS/Data API, backend service
hoặc kiểm chứng quyền. Không đánh dấu T4 hoàn tất hay Jira issue Done.
