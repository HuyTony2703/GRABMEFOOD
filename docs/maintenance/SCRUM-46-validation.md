# SCRUM-46 — guardrails và regression evidence

## Quyền và tiền nhiệm

- SCRUM-18/55/56 đã Done sau phê duyệt toàn bộ spec/constitution của chủ dự án.
- Chủ dự án chọn A cho project-only `opencode.jsonc` và canary vô hại.
- Repo `D:\Projects\GRABMEFOOD`, branch `main`; kiểm Git trước sửa, giữ nguyên
  modifications/untracked docs/spec từ các mốc trước.
- Chưa sửa config global, account/GitHub, CI, app, Supabase hoặc deploy/reset.

## SCRUM-57

Đã merge `AGENTS.md` để tách legacy runtime khỏi V2; thêm `docs/permissions.md`
theo các quy tắc và quyền đã chốt. Không tạo spec/plan mới hoặc thiết kế contracts.
Các đường dẫn workflow/config/test trong matrix là đầu ra SCRUM-58 kế tiếp,
không giả chúng đã được tạo trước khi thực hiện.

Kiểm nghiệm mốc 57 đã chạy:

- Node inline: 3 tài liệu, Markdown links hiện có đều tồn tại — PASS.
- `npm test`: PASS 38/38 legacy tests, không skip.
- `npm run typecheck`: PASS 0 diagnostics/66 files.
- `npm run check:structure`: PASS 73/73 reachable, không missing/unused imports.
- Scope/approval đối chiếu: các rule trong AGENTS/matrix là merge yêu cầu chủ dự án
  và quyền A cho project config/canary, không thêm business/architecture decision.

## SCRUM-58

Đã triển khai đúng allowlist:

- `docs/workflows/bug-regression.md`, `docs/templates/bug-record.md`: real record,
  nguyên nhân và regression RED→GREEN, cấm nới test/giả lịch sử.
- `docs/workflows/adr.md`, `docs/templates/adr.md`: Proposed khác Accepted, chỉ
  owner approval thật mới chốt; không tự tạo ADR/contract V2 đã duyệt.
- `opencode.jsonc`: JSON subset của JSONC, đúng V2 `permissions` array và
  `policies`; 40 permission rules, 1 hard-deny policy cho canary.
- `scripts/check-guardrails.mjs`: static validator/matcher phục vụ kiểm thử,
  không implementation app hoặc runtime evaluator chính thức của OpenCode.
- `tests/contracts/guardrails.test.mjs`: 8 tests mới về config/docs/allowlist,
  ordering, Windows path, env/external/shell/MCP và regression/ADR templates.

Không có bug extension cài trong `.specify/` đã kiểm nên không tạo workflow trùng.
Không chạy lại constitution/specify/plan/tasks; dùng artifacts hiện có.

### Canary LIVE — Đã đạt

Sau khi tạo project config (không restart hoặc sửa global), đã gọi **tool patch
thật** để thêm file inert:

```text
Target: D:\Projects\GRABMEFOOD\.opencode\permission-canary.txt
Requested content: GRABMEFOOD_PERMISSION_CANARY — inert test only; this write must be denied.
Observed error type: permission.rejected
Observed message: Permission denied: edit
```

Đây là thử đúng target canary được phép, không phải lệnh xóa/reset hoặc remote call.
Tool glob tiếp theo với pattern `.opencode/permission-canary.txt` trả
**No files found**: file không được tạo, không cần xóa hay phục hồi.

Harness còn thông báo namespace `supabase` không còn available sau config.
Đó là quan sát catalog, không giả thành một test remote API; không gọi Supabase
để thử permission, không thay cloud project.

### Tests bản 58

| Lệnh / kiểm | Kết quả thực chạy |
| --- | --- |
| `node scripts/check-guardrails.mjs` | PASS, 7 documents/40 rules, `staticOnly: true` |
| `npm test` | PASS 46/46, 38 legacy + 8 guardrail, fail 0/skip 0 |
| `npm run typecheck` | PASS, 0 diagnostics/66 app files |
| `npm run check:structure` | PASS 73/73, missingImports/unusedFiles rỗng |
| `node specs/003-grabmefood-v2/validate.mjs` | PASS 31 FR/31 mapped/16 checklist/7 decisions |
| `git diff --check` | PASS; chỉ warnings LF→CRLF theo Git config |
| `git diff --stat` + `git status --short --untracked-files=all` | Tracked diff chỉ constitution/AGENTS; các file mới đúng docs/spec/tooling/tests/config allowlist, không có canary |
| Patch canary live | Bị deny bởi harness như mong đợi — PASS |
| Glob xác minh canary | Không có file — PASS |

Các tests pattern về `ask`, env/shell/MCP và outside allowlist là unit/config tests.
**Chưa thực hiện live ask prompt hoặc kiểm UI phản hồi once/always/reject.**
Không tự duyệt permission request, không xóa saved approvals để làm test xanh.
AC yêu cầu một thao tác ngoài quyền bị hỏi/**chặn** đã có live deny ở trên.

## File scope và kiểm còn lại

Ngoài file tại 57/58, chỉ cập nhật trạng thái/evidence tại feature Spec Kit đã
được duyệt. Không sửa `src/`, package scripts/dependencies/lockfiles, UI, schema,
CI/GitHub/branch protection hoặc config global. Không migration/reset/deploy.
Ba tài liệu kiểm kê và feature artifacts có sẵn được giữ nguyên, không dọn untracked.

Đã đối chiếu scope/Git và validator sau khi viết evidence; không sửa file ứng dụng.
Không chạy build/browser/screenshot/database tests: không có thay đổi UI/app/schema
và chưa có backend V2 để kiểm. Không dùng legacy tests làm bằng chứng runtime V2.

## Gate bàn giao

- SCRUM-57: đạt merge AGENTS/matrix, baseline và document links; đã Done.
- SCRUM-58: đạt workflow/templates, project config và canary **live deny** theo AC;
  đã chuyển Done bằng transition `41`.
- SCRUM-46: đủ bằng chứng theo phạm vi đã được chủ dự án duyệt; đã ghi comment
  bàn giao và chuyển Done bằng transition `41`, không đóng task sau.
- SCRUM-18/55/56 đã Done; không thay đổi nghiệp vụ đã duyệt khi làm guardrails.
- Còn giới hạn được công khai, không phải test bị bỏ để báo xanh: chưa live-test
  ask prompt, không có CI/GitHub protection, shell không phải sandbox.
- Không commit/push; không upload Artifacts khi chưa được yêu cầu rõ.
- Điểm tiếp tục: chờ giao SCRUM-19 (59 → 60), dùng spec đã duyệt để thiết kế
  contracts/ADR/plan; không tự thực hiện tại gói này.

## Hạn chế

AGENTS không tự chặn công cụ; unit matcher/config scan không thay canary live.
Không có bug thực được sửa trong gói này nên không tạo lịch sử fail-before giả.
CI/branch protection chưa được cấu hình, không tuyên bố đã chặn GitHub. OpenCode
project profile là gate theo task hiện tại, không là sandbox chống chủ máy hoặc
mọi cách sử dụng shell; các giới hạn đã nêu tại `docs/permissions.md`.
