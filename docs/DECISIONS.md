# Quyết định, câu hỏi mở và review

**Trạng thái:** Nhóm 1 đã được chủ dự án duyệt ngày 2026-11-23.
Sổ quyết định đang cập nhật cho **nhóm 2 DRAFT, chờ duyệt**; chưa có baseline triển khai toàn dự án.
Việc duyệt nhóm 1 không tự đóng các TBD hoặc phê duyệt chi tiết nhóm 2.

## 1. Nguồn chuẩn

- Phạm vi/acceptance: PRD; thuật ngữ/business rules: DOMAIN; luồng: APP-FLOWS.
- File này giữ lịch sử, tình trạng phê duyệt, evidence và câu hỏi mở; không sao chép toàn bộ đặc tả.
- Tài liệu kiến trúc/kỹ thuật là nhóm 2, hiện đã có bản nháp; test/vận hành là nhóm 3, chưa viết.
- Chưa có Jira issue hoặc artifact Spec Kit được tạo trong công việc này.
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
| DEC-019 | Browser dùng Supabase trực tiếp; RPC cho transaction; Spring đặc quyền | Ưu tiên capability có sẵn; chưa cần Edge Functions/JDBC runtime |
| DEC-020 | Công khai/ẩn/xóa, không nháp | Thay đề xuất workflow nháp chưa được duyệt vì user thấy rườm rà |
| DEC-021 | Ẩn quán kéo theo tính không khả dụng của món | Giữ marker; loại khỏi tìm kiếm/random |
| DEC-022 | Xóa quán kéo theo món, comment/reply; xóa món kéo theo comment/reply | Giữ dấu “Không còn khả dụng” trong bộ sưu tập |
| DEC-023 | Duyệt đề cương 3 nhóm và bắt đầu nhóm 1 | Chưa duyệt baseline, Jira, spike hoặc triển khai |
| DEC-024 | Chủ dự án duyệt nhóm 1 và yêu cầu thực hiện nhóm 2 | Chỉ cập nhật trạng thái nhóm 1 và viết bản nháp nhóm 2; không có quyền code/Cloud |

### Hướng kiến trúc đã duyệt, chưa là thiết kế chi tiết

- Browser → Auth cho đăng ký/đăng nhập/khôi phục.
- Browser → Data API cho đọc công khai, tìm kiếm, bộ sưu tập/mục lưu, đọc và đánh dấu thông báo.
- Browser → Storage theo policy; Browser → Realtime cho thông báo riêng.
- RPC xử lý thao tác nguyên tử gắn thay đổi dữ liệu với thông báo, ví dụ reply, gỡ nội dung, công bố món.
- Spring xác thực quyền admin, gọi Auth Admin API cho quản lý tài khoản và điều phối dữ liệu ứng dụng;
  gửi thông báo quản trị riêng/toàn bộ.
- Hướng runtime: Auth Admin API + Data API/RPC; không ghép nhiều HTTP request rồi gọi là transaction.
- Auth Admin API và transaction dữ liệu ứng dụng không nguyên tử chung; cần retry/xử lý thất bại một phần.
- Migration/admin có thể dùng đường kết nối/secret khác; không hứa không cần DB password.

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

### Khảo sát bổ sung cho nhóm 2

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

## 4. Câu hỏi mở và đề xuất chờ duyệt

Không cần hỏi tất cả ngay; giải quyết theo nhóm trước khi thiết kế/triển khai phần liên quan.

| ID | Chưa xác định | Điểm cần chốt |
| --- | --- | --- |
| OQ-01 | Phiên bản Spring Boot, Node/package manager, thư viện và test tools | Nhóm 2; Java 21/Maven không hỏi lại |
| OQ-02 | Vite + SEO/preview, URL hai ngôn ngữ, fallback khi thiếu bản dịch | Nhóm 2; không tự đổi sang Next.js |
| OQ-03 | Tích hợp map miễn phí, nguồn tên/địa chỉ, điều kiện sử dụng | Trước thu thập dữ liệu/khởi tạo key; không mặc định scrape |
| OQ-04 | Nội dung trường quán/món, số lượng seed, nguồn/quyền ảnh | Trước chuẩn bị dataset; không tự suy ra từ Michelin |
| OQ-05 | Gán khu vực, trùng khu vực và taxonomy | Danh mục 3 nhóm do agent chọn là danh mục ban đầu, không địa giới |
| OQ-06 | Chọn một bộ khi random có còn là chế độ riêng? Xác suất và trường hợp mục bị gỡ đồng thời | Trước thiết kế random |
| OQ-07 | Đổi tên/xóa bộ, tên trùng/giới hạn tên, bỏ lưu | Gom đề xuất UI + business rules |
| OQ-08 | Xóa comment gốc có reply người khác, giới hạn chữ/số bình luận | Trước triển khai bình luận |
| OQ-09 | Thông báo: khử trùng/retry, tự reply, món mới đang ẩn, gửi mọi user gồm user khóa? | Trước schema/logic thông báo |
| OQ-10 | Đích thông báo đã xóa, retention, nhiều tab và mất kết nối | Nhóm thiết kế thông báo |
| OQ-11 | Tạo admin đầu, tự khóa/xóa, bảo vệ admin cuối; user tự xóa tài khoản? | Chưa tự thêm quyền; trước thiết kế quyền |
| OQ-12 | Xóa user: dữ liệu thông báo/reply người khác; cleanup Auth/Storage lỗi một phần | Trước workflow xóa |
| OQ-13 | Công khai lại quán/món; marker giữ trường gì, bao lâu | Trước schema vòng đời |
| OQ-14 | Account linking email/Google, OAuth config, provider SMTP/quota | Khảo sát không lộ secret; chỉ test khi duyệt target |
| OQ-15 | Môi trường dev/test, hosting miễn phí, backup/recovery, RPO/RTO và mục tiêu hiệu năng | Nhóm 3; chưa deploy |
| OQ-16 | Chi tiết Data API/RPC/Spring, schema RLS và quyền Realtime khi khóa user | Nhóm 2; không xem hướng đã duyệt là test đã đạt |
| OQ-17 | Jira hierarchy/transition graph/admin permission còn thiếu | Không tự tạo issue thử hoặc đổi project để kiểm chứng |
| OQ-18 | Có dùng Spec Kit không; có cài Supabase skill không | Trình nguồn/lệnh/phạm vi và xin phép trước |

Các trạng thái loading/error/empty trong APP-FLOWS là đề xuất thiết kế cần review; không tự chốt copy.
Nhóm 2 hiện có sketch text và token candidate; chưa có wireframe render hoặc acceptance UI được duyệt,
không tuyên bố đã tái tạo giao diện Michelin.

## 5. Nhóm 2 — các đề xuất chờ duyệt

Đây không phải quyết định sản phẩm mới đã được chấp thuận.
Mọi thông số/tên bảng/RPC/path mới trong nhóm 2 mặc định là proposal cho đến review.

| ID | Đề xuất / phương án cần duyệt | Tài liệu nguồn |
| --- | --- | --- |
| G2-P01 | SEO: khuyên React/Vite SSR public + CSR private, thêm Node runtime; so với SSG và Spring HTML | ARCHITECTURE mục 5; host vẫn TBD |
| G2-P02 | Version candidates, npm/lockfile, Maven Wrapper và cấu trúc frontend/backend/supabase | TRD mục 1–2; chưa install |
| G2-P03 | Map iframe lấy từ luồng Share/Embed chính thức, validate URL; không tự bật API/key/billing | TRD mục 3 |
| G2-P04 | Registry ID tối thiểu giữ marker khi xóa payload; hide cha không ghi đè state món; một vùng/quán | DATABASE mục 1, 4–5; retention marker TBD |
| G2-P05 | Xóa bình luận gốc/user có reply người khác: cần chủ dự án chọn cascade hay giữ thread với marker | DOMAIN OQ-08/OQ-12; chưa chọn FK xóa |
| G2-P06 | App gate current-state + Spring operation retry; Realtime tín hiệu không chứa nội dung, refetch RLS | ARCHITECTURE, SECURITY; chưa test |
| G2-P07 | Chọn Storage public/private và quyền truy cập ảnh sau hide; OG/cache và upload constraints | SECURITY mục 6; chưa chọn |
| G2-P08 | Visual direction sáng/editorial, accent xanh, token/layout và accessibility candidate | DESIGN; chưa render/mockup |
| G2-P09 | Publication yêu cầu đủ vi/en; giới hạn tên/chữ/trang, selected mode random xác suất đều | TRD/API; giá trị và quy tắc còn chờ duyệt |
| G2-P10 | Không tự nhận lại thông báo reply của mình; khử trùng người nhận; món mới phải public và cha public; broadcast gửi active users | Đề xuất xử lý OQ-09, chưa áp vào rule/contract baseline |
| G2-P11 | Ngăn admin tự khóa/xóa và admin cuối bị vô hiệu hóa; cấp admin đầu bằng thao tác được duyệt riêng | OQ-11; cách kiểm tra đồng thời chưa duyệt |
| G2-P12 | Upload trực tiếp staging private + Spring kiểm tra byte/finalize, hoặc Spring nhận file rồi upload | SECURITY mục 6; thay đổi trách nhiệm phải duyệt trước; không có bucket/API finalize đã tạo |

Các lựa chọn chưa chốt vẫn ngăn implementation/migration phần liên quan.
Không ghi đáp án giả chỉ để đủ một bộ thiết kế “hoàn chỉnh”.

## 6. Checklist và điểm dừng

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
- [ ] Chủ dự án review/duyệt nhóm 2 và giải quyết các lựa chọn ngăn triển khai.
- [ ] Viết và duyệt nhóm 3; xác lập baseline.
- [ ] Trình kế hoạch và Jira để duyệt trước khi tạo issue.
- [ ] Duyệt target/phạm vi/tác động/cleanup của spike trước chạy.
- [ ] Chủ dự án chọn lát cắt đầu tiên.

Không có commit, push, deploy, migration, seed hay Jira write nào được cho phép bởi checklist này.
