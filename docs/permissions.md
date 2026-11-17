# Quyền agent và giới hạn enforcement — SCRUM-46/57

## Phạm vi và phê duyệt

Đây là **matrix thao tác của agent**, không phải bảng quyền người dùng/DB/RLS.
Nghiệp vụ vẫn ở [spec V2](../specs/003-grabmefood-v2/spec.md);
AGENTS dẫn về nguồn đó, không sao chép spec vào matrix.

Chủ dự án đã:

- Giao SCRUM-46/57 → 58 sau khi duyệt SCRUM-18/56.
- Chọn **A**, cho phép tạo `D:\Projects\GRABMEFOOD\opencode.jsonc` chỉ cho repo,
  yêu cầu hỏi khi ngoài allowlist và thử gate bằng canary vô hại.
- Không cho phép sửa config global, quyền tài khoản/GitHub hoặc deploy/remote mutation/reset.
- Bổ sung SCRUM-59: cho phép đồng bộ Cloud/Jira và MCP project-only, read-only
  cho project `bdhavbwmxbttymerizvx`; OAuth qua `/mcps`, không lưu secrets trong repo.

Phê duyệt này cho cấu hình project và quy trình đã nêu; không phải cho phép mọi
thao tác `ask` tự động được duyệt hoặc thay đổi quyền tài khoản.

### Owner bổ sung 2026-11-16 — đã reconcile MCP theo phê duyệt tiếp theo

Owner báo đã cấp Supabase MCP read/write và đề nghị không isolated target.
Trước phê duyệt tiếp theo, `opencode.jsonc` do owner thay đổi dùng `mcp.supabase`, URL broad features
không `read_only=true`; permissions vẫn deny ngoài 5 metadata tools, canary giữ
deny. Cấu hình mới khác approved read-only profile/test; chưa tự sửa user work,
giảm assertions hoặc chuyển mutation thành allow. Không dùng tool khác để vượt deny.
Owner sau đó đồng ý chuẩn hóa về V2 và giữ metadata-only trong SCRUM-59.
Hiện `mcp.servers.supabase` có project ref cố định, `read_only=true`, features
docs/database/development. Chỉ đổi khối MCP; permissions/policies, hard canary
deny và tests giữ nguyên. Không bật account/branching/functions/notebooks hoặc
quyền ghi. Mở write ở task sau cần approval cụ thể, không blanket.
`npm test` sau sửa PASS47/47; `opencode mcp list` báo connected.
Không kiểm live mutation gate bằng thao tác ghi thật.

Scope SCRUM-59 chỉ dùng metadata/thiết kế/budget/Jira, không cần tool write.
Muốn thay config/policy phải chốt allowlist tool/approval gate cùng tests phù hợp.
Mọi destructive action vẫn cần exact target/allowlist/impact/backup và confirmation
riêng; đề nghị bỏ isolated còn cần amendment governance trước khi áp dụng.

## Matrix quyết định

### Owner approval SCRUM-64 — 2026-11-17, publication scope hiện hành

Owner duyệt commit theo ba cụm spec/architecture, governance/guardrails và V2/CI,
push trực tiếp `main` **một lần** sau final checks; thay thế proposal chỉ push
`scrum-64-ci`. Trước commit: exact file manifests, secret scan, branch/repo/auth/
fetch xác nhận main không diverged hoặc có remote mới. Chỉ stage path cụ thể;
`.vscode/settings.json` giữ local, không stage/xóa/revert. Không force/bypass
protection/merge/rebase/reset/checkout hoặc đổi settings/deploy/remote mutation.
Existing staged worktree CI giữ nguyên, không tạo nhánh thêm. Đây là authorization
riêng của buổi này, không sửa `opencode.jsonc`, không blanket future push.
TLS T vẫn tối đa2attempts không auth/SQL; host1 DNS blocked, container2 chỉ khi
owner mở Docker. S chuyển mandatory live checks sang65/67–70, không miễn tests.
Matrix lịch sử bên dưới không thay authorization cụ thể này.

| Thao tác | Quyền trong gói hiện tại | Gate / bằng chứng cần có |
| --- | --- | --- |
| Đọc source/spec/docs/config không có secret, kiểm Git | Được làm trong phạm vi task | Không in token/provider credentials hoặc đọc lộ env |
| Sửa file tài liệu/tooling thuộc allowlist 57/58 | Được làm | Diff nhỏ, kiểm tài liệu và tests, giữ user work |
| Sửa app/UI/database hoặc spec đã duyệt về nghiệp vụ | Ngoài gói | Hỏi chủ dự án trước, không coi tool allow là được giao |
| Đổi stack/contracts/dependency/phạm vi | Cần duyệt riêng | Nêu lý do và tác động; ADR không tự phê duyệt thay chủ dự án |
| Chạy routine tests/kiểm cấu trúc/Git read-only | Được làm | Chỉ lệnh cụ thể trong config; không chạy script chưa đọc |
| Shell/Node/PowerShell khác, thay allowlist/config bảo vệ | Phải hỏi | Dùng one-time approval nếu được duyệt; không vòng qua shell |
| Đọc/ghi ngoài repo | Phải hỏi trừ temp đã được harness cho phép | Không tự mở quyền global để tiện chạy |
| Đọc env thật/credentials | Phải hỏi, chỉ khi cần task | Không dùng làm canary, không xuất secrets vào báo cáo |
| Xóa/reset kể cả local | Chưa được cấp | Trình target/allowlist/impact/backup, chờ xác nhận đích cụ thể |
| Supabase MCP metadata chỉ đọc | Được duyệt trong SCRUM-59 | Project ref cố định, `read_only=true`, features docs/database/development; chỉ search_docs/get_project_url/list_tables/list_extensions/list_migrations được allow |
| Remote SQL/DDL/migrations/seed/Auth/Storage/config/deploy | Chưa được cấp | Giữ deny mọi Supabase tool khác, gồm execute_sql và key retrieval; không lấy read-only MCP làm quyền mutation |
| Rebuild/destructive tests | Bị chặn hiện tại | Chưa có isolated target được duyệt; không reset project chính kể cả owner nói đang rỗng |
| Deploy, tài khoản, GitHub settings/branch protection, commit/push | Chưa được cấp | Cần yêu cầu/phê duyệt riêng, không tạo CI hoặc sửa protection ở gói này |
| Jira CRUD liên quan task đang làm | Được giao về mặt nghiệp vụ | MCP gate vẫn có thể hỏi; chỉ cập nhật evidence thật và Done đúng AC |
| Dùng subagent/đổi model/skill không liên quan | Không mặc định được giao | Không dùng để né scope hoặc permission; theo yêu cầu và harness |

## Allowlist SCRUM-57/58

Đây là allowlist lịch sử của gói guardrail. Bổ sung đã duyệt cho Cloud SCRUM-59:
README, AGENTS, constitution, architecture, ADR `docs/adr/0001-supabase-cloud.md`,
các artifacts hiện có bị ảnh hưởng trong `specs/003-grabmefood-v2/`, permissions,
opencode.jsonc và validator/tests guardrails. Không tạo scaffold, env/DB config,
Compose/migrations/seed/Auth implementation khi chúng chưa tồn tại.

- `AGENTS.md`, `docs/permissions.md`.
- `docs/workflows/bug-regression.md`, `docs/workflows/adr.md`.
- `docs/templates/bug-record.md`, `docs/templates/adr.md`.
- `docs/maintenance/SCRUM-46-validation.md`.
- `opencode.jsonc`.
- `scripts/check-guardrails.mjs`, `tests/contracts/guardrails.test.mjs`.
- Cập nhật trạng thái/approval/evidence tại
  `.specify/memory/constitution.md`, `specs/003-grabmefood-v2/spec.md`,
  `specs/003-grabmefood-v2/validation.md` và traceability khi cần liên kết.

Các file tồn tại từ Gói 1 không được dọn/di chuyển/ghi đè. File app/config
toolchain/lockfile/CI không thuộc allowlist. `opencode.jsonc` được tạo theo quyền A,
không biến thành đường mở rộng chính sách tùy ý.

## Cấu hình thực tế và mô hình gate

- OpenCode **v2.3.0**; Spec Kit **1.3.3**, OpenCode/PowerShell.
- Không có project config trước gói này. Config global được kiểm có chọn lọc ở phiên
  trước, không có permission overrides được liệt kê; không suy rằng runtime không
  có agent rules, managed policy hoặc saved approvals.
- V2 dùng `permissions` array, `action/resource/effect`; rule cuối khớp thắng,
  effect là `allow`, `ask`, `deny`. Không dùng cú pháp V1 `permission`/`bash`.
- Project profile cho phép đọc thông thường và các lệnh kiểm cụ thể; mặc định hỏi
  khi sửa/chạy shell ngoài danh sách. Giữ Code Mode hoạt động nhưng nested MCP
  vẫn được kiểm. Supabase MCP chỉ metadata read trên project Cloud đã chọn;
  không SQL tùy ý, không bật account/branching/functions/notebooks/debugging.
- Không thêm `allow` cho shell tổng quát (`node *`, `powershell *`, `git *`) hoặc
  toàn bộ `atlassian_*` writes. Config không đổi models/providers/MCP credentials.
- Một canary **edit** bị deny dùng target riêng `.opencode/permission-canary.txt`,
  không có dữ liệu thật và không cần tạo trước. Test gọi edit phải bị từ chối;
  một kiểm pattern tự viết chỉ là unit test, chưa đủ chứng minh runtime enforce.
- Một canary shell `Write-Output GRABMEFOOD_PERMISSION_CANARY` không có side effect
  phải gặp `ask` nếu kiểm live; không thử reset, delete, push hoặc remote API.

## Giới hạn phải công khai

- AGENTS/matrix không tự enforce và không phải sandbox. Shell chạy bằng quyền OS
  của người dùng; scanner/directory inference chỉ best effort.
- `grep`/`glob` được kiểm theo query/pattern chứ không phải mọi nội dung file được
  đọc. Không hứa rằng chỉ đặt rule `read *.env` đã ngăn mọi đường lấy secret.
- Saved approval hoặc agent rules có thể ảnh hưởng `ask`. Không tự xóa saved
  approvals/đổi global để làm test xanh. `deny` được cấu hình phải giữ hiệu lực
  theo khả năng harness; nếu canary không bị chặn, báo lỗi/chặn nghiệm thu.
- Cấu hình tool không phân biệt được mọi business target của MCP vì resource có
  thể chỉ là `*`; quyền Jira còn cần agent tuân scope và hệ thống bên ngoài enforce.
- Repo admin có thể sửa file config; đây là gate cộng tác, không chống chủ máy.
- Chưa cấu hình CI/branch protection/GitHub permissions; không tuyên bố đã enforce.

## Gate nghiệm thu

SCRUM-57: merge instructions/matrix theo nguồn đã duyệt, kiểm links/scope.
SCRUM-58: workflow/templates, config hỗ trợ và ít nhất một canary ngoài quyền
được hỏi/chặn thực tế. Chỉ báo PASS live khi có tool result thật.
Nếu thiếu capability/phê duyệt, giữ Bị chặn, không đổi AC thành documentation-only.

Evidence và kết quả test:
[docs/maintenance/SCRUM-46-validation.md](maintenance/SCRUM-46-validation.md).
Live edit canary đã bị harness từ chối `permission.rejected`; file không được tạo.
Đó là bằng chứng nhánh deny, không phải tuyên bố nhánh ask hay CI đã kiểm live.
File evidence không phải nguồn nghiệp vụ mới.
