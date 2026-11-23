# Operations — GrabMeFood

**Trạng thái:** Nhóm 3 đã duyệt, phần quy trình thuộc B1; không là quyền thực thi Cloud.
Nguồn chuẩn: [ARCHITECTURE](ARCHITECTURE.md), [TRD](TRD.md), [DATABASE](DATABASE.md),
[SECURITY](SECURITY.md), [TEST-STRATEGY](TEST-STRATEGY.md), [DECISIONS](DECISIONS.md).

## 1. Môi trường và ngân sách

| Môi trường | Mục đích / điều kiện |
| --- | --- |
| Local dev/test — đề xuất | Frontend và năm Spring process độc lập; DB/Auth/Storage local nếu toolchain được duyệt |
| Cloud spike — chưa được phép chạy | Target dự kiến Supabase ref bdhavbwmxbttymerizvx; phải duyệt chính xác resources, user, thao tác, thời hạn, cleanup trước ghi |
| Demo công khai / production | Chưa chọn host/domain/topology; release cần quyền riêng, không tự tạo resource |

Chỉ miễn phí; không bật billing, dùng trial credit như miễn phí dài hạn hoặc tạo branching tính phí.
Chưa chứng minh host miễn phí đủ năm service và SSR đã chọn. Kiểm tra sleep/cold start, RAM, connection,
egress/build quota và email limits trước đề xuất host. Local độc lập không đồng nghĩa đã deploy Cloud.
Không mặc định có staging project riêng, Gateway/broker/Redis/Kubernetes.

## 2. Cấu hình và secrets

- Config riêng từng service: endpoint/port, owner DB role hoặc Data API path được duyệt, service identity,
  timeout và delivery parameters. Giá trị thật không nằm docs/repo.
- Browser chỉ publishable key và public config. Auth Admin secret chỉ Account Administration;
  credential Storage theo quyền Catalog đã chọn, không share service_role rồi gọi là isolation.
- Migration/admin credential tách runtime Data API/RPC ưu tiên; scoped role qua API còn GATE-01.
  Không âm thầm chuyển JDBC nếu spike không đạt.
- HMAC keys riêng theo cặp service, HTTPS khi triển khai; cung cấp/đổi khóa qua secret channel,
  không log/share key trong chat. Rotation overlap/replay window phải được review trước chạy.
- Chỉ dùng secret store/kênh được duyệt; không yêu cầu người dùng gửi password/token trong chat.
- `.env.example`, `.gitignore`, `.gitattributes` chưa tự tạo bởi tài liệu này.
- SMTP đã được chủ dự án cấu hình: giữ nguyên; provider/quota/sender và delivery vẫn cần kiểm chứng.
  Google OAuth redirect/consent/test-user theo môi trường, không wildcard rộng.

## 3. Quy trình migration và seed đề xuất

1. Chốt schema/role/connection và nguồn migration từng owner; không có hai bộ SQL cạnh tranh.
2. Khảo sát target hiện tại, migrations/drift/grants và resources; không suy từ khảo sát cũ là DB disposable.
3. Review change, backward compatibility và backup/recovery khả thi trước thao tác.
4. Replay local sạch + upgrade local, kiểm thử constraints/RLS và tương thích contract.
5. Xin duyệt target, SQL/resources bị ảnh hưởng, downtime nếu có, cleanup/rollback và quyền thực thi.
6. Chạy chỉ phạm vi được duyệt, kiểm tra migration history và smoke từng tầng; lưu evidence không secret.

Seed có version/provenance và số lượng được duyệt; không dùng ID Cloud hardcode hay dữ liệu cá nhân thật.
Không sửa function/trigger `rls_auto_enable`/`ensure_rls` tồn tại chỉ để làm migration thuận tiện.
Không tự chạy reset/seed hoặc xóa resource ngoài fixture. Rollback dữ liệu không bảo đảm chỉ bằng down migration;
thay đổi phá hủy cần kế hoạch restore/forward fix đã review.

## 4. Spike kết nối có giới hạn

Trước chạy phải trình danh sách file/bảng/function/user/bucket tạo, quyền, test emails, dữ liệu,
tác động và cleanup; xin duyệt target cụ thể. Không mặc định được ghi Cloud vì có MCP read access.
Manifest *có điều kiện* ở kế hoạch B1 mục 4 chưa phải lệnh triển khai: local/Cloud target,
machine-role feasibility, Auth user/e-mail fixtures và tool installs còn cần duyệt riêng.
GATE-01 không dừng toolchain proposal, Jira proposal, UX/contract review hoặc manifest có điều kiện;
chỉ chặn bước persistence/phân quyền phụ thuộc owner-role proof.

Evidence tối thiểu: Data API route thực, Auth đã chọn, A không đọc/sửa dữ liệu riêng B,
một luồng UI→owner service→database; nếu luồng có Spring phải chứng minh Spring.
Nếu có event thì kiểm tra producer/consumer và retry, không dùng kết quả DB thay chứng minh event delivery.
Email/OAuth dùng tài khoản người thử được duyệt, không spam email hoặc đổi SMTP để vượt lỗi.
Cleanup theo manifest và owner APIs; xác minh không còn fixture/privilege tạm, không broad delete.

## 5. Deployment/release — thiết kế quy trình, chưa được phép chạy

- Mỗi service build/test/artifact/version độc lập; lập compatibility matrix consumer/provider trước rollout.
- Migrations owner-local theo expand/contract nếu cần; chưa chọn CI/CD hoặc nhà cung cấp.
- Deploy dependency/consumer theo contract, không giả deploy tất cả cùng lúc là độc lập.
- Public reads/SSR/OG, CORS, Auth redirects, map links, ảnh và private access phải smoke đúng URL thật.
- Sau deploy kiểm tra năm service, user A/B, JWT cũ khi khóa, notification realtime và cleanup operation.
- Release chỉ sau chủ dự án duyệt, có rollback/forward-fix và evidence; không auto commit/push/merge.

Không pin lệnh deploy, health URL hoặc DNS chưa được quyết định thành runbook executable.

## 6. Theo dõi và phục hồi lỗi phân tán

- Mỗi log có service/request/correlation/operation ID; event thêm producer/event/destination/attempt.
  Không log body comment đã xóa, email, JWT, apikey hoặc password.
- Outbox HTTP đã chọn: theo dõi backlog/age, retry, poison event, receipt và từng destination.
  Claim/lease/retry budget/replay authority còn TBD, không tự thêm queue thứ sáu.
- Service sleep/down: báo dependency unavailable, không stale-authorize hoặc dùng dữ liệu ẩn làm fallback.
- Account operation lỗi: giữ fail-closed và durable guard, xác minh request Auth cũ trước retry đối nghịch;
  không tự hết TTL rồi mở khóa.
- Cleanup chưa đủ receipts: không đánh dấu xóa hoàn tất. Event trễ không được tái tạo dữ liệu đã xóa.
- Hidden giữ comment; deleted mới cleanup. Replay phải giữ lifecycle/version, không replay bừa toàn bộ events.
- Realtime disconnect: subscribe/refetch/reconcile inbox theo quyền hiện tại, không dựa socket như durable queue.
- Incident có thay quyền/Cloud/chi phí vẫn phải xin phép; được phép quan sát không đồng nghĩa quyền tự sửa.

## 7. Backup, restore và dữ liệu xóa

Chưa xác nhận project plan hoặc backup hiện có. Không hứa automatic backup/PITR trong ngân sách Free.
Đề xuất nghiên cứu backup logical DB có mã hóa và backup Storage riêng; dump DB không chứa byte ảnh.
Auth/config/secrets recovery phải theo workflow chính thức và quyền đã duyệt, không export secret vào chat.

Trước chốt cần chọn: nơi lưu miễn phí, lịch backup, retention, RPO/RTO, chủ thể giữ khóa và quyền restore.
Test restore vào môi trường tách biệt được duyệt, không ghi đè Cloud hiện tại; chạy lại grants/RLS và smoke.
Khôi phục backup có thể làm sống lại account/content đã xóa hoặc phát lại outbox:
phải có deletion reconciliation/delivery pause theo quyết định retention, không tự đưa bản restore lên public.

## 8. Điểm dừng trước triển khai

- Nhóm 3 được duyệt; B1 không đồng nghĩa môi trường/credential/pipeline đã được kiểm chứng.
- SSR/public ảnh/staging upload/schema-role/HTTP outbox/HMAC/helper đã chọn; không hỏi lại.
  GATE-01..05 trong DECISIONS giữ các proof/chi tiết chưa chốt như role, retention, wire, host.
- Môi trường/host/toolchain, backup/recovery và admin identity/cách cấp còn mở.
  Admin safety và thứ tự lát cắt đã xác nhận; thứ tự do agent sắp theo quyền user giao.
- Sau khi đủ rõ: trình baseline/kế hoạch và Jira để duyệt; spike/release có quyền riêng.
  Không coi việc tài liệu tồn tại là bằng chứng hệ thống chạy hoặc quyền triển khai.
