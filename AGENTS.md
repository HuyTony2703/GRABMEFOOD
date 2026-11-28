# Hướng dẫn agent — GrabMeFood

> Nhóm 1 được chủ dự án duyệt ngày 2026-11-23. Không phải quyền triển khai sản phẩm.
> Chủ dự án đã duyệt nhóm 2 để soạn nhóm 3. Các phương án/TBD chưa có đáp án vẫn mở.
> Quyết định mới của nhóm: bỏ năm microservices, không tái sử dụng backend/SQL cũ;
> giữ frontend, làm lại database và kết nối Supabase bằng Data API. Các tài liệu
> lịch sử về microservices không còn là chỉ dẫn thực hiện.

## 1. Đọc và xác định phạm vi trước khi làm

1. Đọc `README.md` và file này.
2. Đọc `docs/DECISIONS.md`, sau đó tài liệu nguồn chuẩn liên quan theo bản đồ README.
3. Kiểm tra `git status`, cấu trúc hiện tại và hướng dẫn lồng trong thư mục sắp sửa.
4. Phân biệt: đã được chủ sản phẩm xác nhận; đề xuất chờ duyệt; chưa xác định.
5. Chỉ đọc/ghi các tài nguyên đúng target và phạm vi công việc đã duyệt.

Đây là dự án mới. Không suy ra yêu cầu, kiến trúc, cấu hình hoặc Jira từ GrabMeFood cũ.
Không coi repo sạch hay dự án mới là quyền reset tài nguyên.
Không coi việc nêu một công cụ/skill là bằng chứng công cụ đó đã được dùng thành công.

## 2. Quyền quyết định

Chủ dự án quyết định sản phẩm, kiến trúc quan trọng, quyền dữ liệu, chi phí, Cloud và release.
Agent nghiên cứu, đề xuất, thực hiện công việc đã duyệt và cung cấp evidence.
Im lặng không phải đồng ý. Duyệt hướng không đồng nghĩa duyệt thiết kế chi tiết hay triển khai.

### Có thể tự làm trong task đã duyệt

- Khảo sát chỉ đọc đúng phạm vi và tài nguyên đã được cho phép.
- Công việc thường lệ không đổi sản phẩm, kiến trúc, quyền dữ liệu hoặc chi phí.
- Viết bản nháp nhóm tài liệu đã được duyệt, ghi rõ TBD và dừng tại mốc review.
- Chạy kiểm tra local không có tác dụng phụ Cloud và đúng phạm vi task.

### Phải hỏi trước

- Thêm/bớt tính năng, thay đổi business rules, ranh giới Spring/Supabase hoặc quyền dữ liệu.
- Cài package, skill, công cụ hoặc chạy scaffold/initializer ngoài quyền task cụ thể.
- Tạo/sửa Jira: phải trình nội dung và dependency để duyệt trước.
- Mọi migration, seed, reset, upload, tạo user/bucket/function hay đổi Auth/SMTP trên Cloud.
- Tạo tài nguyên tính phí, bật billing, deploy, release, commit/push/merge.
- Ghi đè hoặc xóa thay đổi chưa commit không do agent tạo.
- Dùng provider/map/email/ảnh mới nếu chưa kiểm chứng điều kiện miễn phí và quyền sử dụng.

Không tự thay đổi `.env`, cấu hình OpenCode hoặc MCP. Nếu cần: đọc cấu hình liên quan mà không
lộ secret, kiểm tra tài liệu đúng phiên bản, đề xuất diff tối thiểu và xin phép.
Không chạy lệnh khởi tạo có thể ghi đè repo. Không tự chạy `npx skills add supabase/agent-skills`.
Nêu nguồn, lệnh và phạm vi thay đổi để chủ dự án duyệt việc cài trước.

## 3. Kỷ luật sản phẩm và tài liệu

- Dùng requirement ID trong PRD và rule ID trong DOMAIN để liên kết test/task.
- Không viết đề xuất như quyết định đã duyệt; chỗ chưa rõ ghi OPEN QUESTION/TBD.
- Không tự suy ra tính năng từ câu “giống Michelin Guide”.
- Không duy trì spec/task trùng nhau giữa docs, Jira và Spec Kit.
- Nếu quyết định thay đổi: nêu các tài liệu/task bị ảnh hưởng trước khi sửa.
- Không tự đổi trạng thái tài liệu sang baseline hoặc Jira sang Done.
- Review theo nhóm đã duyệt; không vượt điểm dừng.
- Dùng skills đúng loại công việc và báo thiếu khả năng thật, không tạo thêm quy trình vô ích.

## 4. Nguyên tắc kiến trúc đã xác nhận

- React + TypeScript + Vite; Spring Boot, Java 21 LTS + Maven; PostgreSQL Supabase Cloud.
- Ưu tiên Auth, Data API, Storage, Realtime và capability Supabase phù hợp.
- Một ứng dụng Spring Boot duy nhất; Catalog, Collection, Community, Notification và
  Account Administration là các miền nghiệp vụ trong monolith, không phải service riêng.
- Kết nối Supabase qua Data API. Thiết kế lại schema và contract; không tái sử dụng
  SQL/backend của phương án năm service.
- Không tự thêm Gateway, broker, Redis hay Kubernetes; Supabase Auth không là service tự xây thứ sáu.
- Không cần HTTP/HMAC, runtime role riêng hay proof isolation giữa năm process cũ.
  Vẫn bảo vệ dữ liệu riêng và quyền admin bằng Auth, grants/RLS và kiểm tra người gọi thật.
- Runtime Data API/RPC và đường migration/admin là những quyết định riêng.
- Không hứa không bao giờ cần mật khẩu DB; không mặc định JDBC runtime.
- Hiện chưa cần Edge Functions; muốn thêm phải chứng minh vai trò không trùng Spring.
- Chỉ miễn phí; giới hạn miễn phí phải kiểm chứng, không lách bằng billing tự động.

## 5. Bảo mật và nội dung

- Không hỏi token/password/secret trong chat; dùng kênh secret được hỗ trợ và được duyệt.
- Publishable key có thể ở frontend; không mặc định nó là JWT.
- Secret/service_role/password chỉ ở server hoặc công cụ quản trị được phép.
- RLS + grants phải bảo vệ quyền thật; quyền server-side vẫn cần kiểm tra người gọi.
- Khóa tài khoản phải chặn thao tác từ phiên đang mở, không chỉ đổi UI.
- Storage có policy, ownership và kiểm tra upload; không tắt TLS verification.
- Không ghi secret, email người dùng hoặc dữ liệu cá nhân vào tài liệu/evidence.
- Không sao chép thương hiệu, bài viết, ảnh hoặc dữ liệu Michelin/Google khi chưa có quyền.
- Dữ liệu demo gắn quán thật cần nhãn phân biệt; ảnh minh họa không được ngụ ý là ảnh thực tế.

## 6. Kiểm chứng và báo cáo

Luôn tách các tầng:

1. Kiểm tra tĩnh/tài liệu.
2. Build/test local.
3. Data API thực tế.
4. Auth/RLS thực tế, gồm user A không đọc/sửa dữ liệu riêng user B.
5. Một backend Spring Boot thực tế và luồng frontend → backend/Data API.
6. Migration/replay thực tế.

Không lấy một tầng để tuyên bố cả hệ thống hoạt động.
Không coi build thành công hoặc có file là đạt acceptance.
Báo lệnh/công cụ, target, kết quả, giới hạn và phần chưa test; không bịa evidence.
Test truy cập âm, quyền quản trị, tài khoản bị khóa và tác động xóa/ẩn theo luồng thật.
Khi báo hoàn tất, kiểm tra diff, tính nhất quán tài liệu, trạng thái Git và không có secret.
Không tự sửa cảnh báo Cloud chỉ vì vừa phát hiện.

## 7. Cách phối hợp

- Trao đổi tiếng Việt, ngắn gọn; câu hỏi từng nhóm nhỏ cùng chủ đề, cho trả lời tự do.
- Không hỏi lại câu còn hiệu lực. Gom chi tiết nhỏ thành đề xuất chờ duyệt.
- Theo dõi checklist công việc trong tài liệu đã được phép, không tạo file kế hoạch thừa.
- Quyết định monolith mới thay các chỉ dẫn triển khai nhiều service trước đây.
  Các TBD nghiệp vụ và quyền dữ liệu mới không tự trở thành quyết định đã duyệt.

<a id="skill-workflow"></a>
## 8. Phân vai công cụ và skills

**Owner duyệt 2026-11-28:** đồng bộ hướng dẫn vào Jira và plan, không đổi
phạm vi, dependency, acceptance hoặc trạng thái nghiệm thu.

| Công cụ/skill | Khi dùng | Đầu ra và giới hạn |
| --- | --- | --- |
| GitHub Spec Kit | Làm rõ yêu cầu, chuẩn hóa spec/plan/task và đối chiếu tính nhất quán khi công cụ hoạt động trở lại | Không tạo một bản spec/task song song với docs/Jira; chỉ chọn một nguồn chuẩn cho mỗi nội dung. Khôi phục công cụ/template phải được duyệt riêng. |
| Superpowers | Chọn skill quy trình theo việc: brainstorming, writing-plans, executing-plans, TDD, systematic-debugging, review, verification | Theo dõi kế hoạch hiện hành, test và evidence; không tạo plan trùng chỉ để đủ mẫu, không hỏi lại thiết kế đã duyệt. |
| UI UX Pro Max (`ui-ux-pro-max`) | Tra cứu vấn đề UX/accessibility, form, navigation, responsive hoặc hướng dẫn React cụ thể khi có quyết định cần giải quyết | Dùng kết quả đã kiểm tra là phù hợp web/React; không tự thay visual baseline, sinh design system thứ hai hoặc áp quy tắc native vào web. |
| Impeccable (`impeccable`) | Triển khai/rà frontend, hierarchy, trạng thái lỗi/rỗng/loading, responsive, accessibility và polish | Bám `DESIGN.md` và UI đã duyệt; có kiểm rendered/browser theo phạm vi, không chỉ nêu tên skill. |

**Nguồn chuẩn:** PRD/DOMAIN giữ requirement/rule; DESIGN/APP-FLOWS giữ hướng UI.
Jira theo dõi phạm vi, dependency, acceptance và liên kết tới plan/evidence;
plan hiện hành giữ bước triển khai/checklist. Quy ước dùng skill nằm ở mục
này; các plan/Jira chỉ thêm áp dụng theo task và liên kết, không sao chép spec.

**Tình trạng Spec Kit đã xác minh:** Git history có `.specify/` và `specs/`,
init options ghi `speckit_version: 1.3.3`, integration `opencode`; các artifact
đó bị xóa tại commit `ed7f345`. Ngày 2026-11-28 tìm thấy `specify.exe` nhưng
`specify --help` bị Application Control chặn. Đây là **đã có artifact lịch sử,
hiện chưa vận hành được**, không phải chưa từng dùng và không phải đang active.
Không tự khôi phục spec kiến trúc cũ, chạy initializer, cài lại, đổi cấu hình
hoặc lách Application Control. Trong lúc bị chặn, tiếp tục nguồn docs/plan
hiện hành; không ghi một bước Spec Kit đã chạy thành công.

Mỗi task phân biệt **yêu cầu dùng**, **đã nạp hướng dẫn**, **đã chạy
CLI/script** và **kết quả kiểm chứng**. Có tên skill, artifact cũ, hoặc đã
nạp hướng dẫn không chứng minh CLI/detector đã chạy hay acceptance đạt.
Nếu thiếu công cụ/quyền, ghi giới hạn và cách kiểm thay thế, không bịa evidence.
Plan lịch sử giữ nguyên phạm vi và kết quả cũ; bổ sung liên kết quy ước chỉ áp
dụng khi tiếp tục/sửa công việc, không xác nhận hồi tố công cụ đã được dùng.
