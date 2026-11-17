# SCRUM-6 — Kiểm chứng và đồng bộ Jira

> Evidence lịch sử trước Cloud, không sửa kết quả đã chạy. Local-only trong
> snapshot này đã được thay bởi [ADR Cloud](../adr/0001-supabase-cloud.md)
> ở SCRUM-59; không phải bằng chứng kết nối Cloud hoặc SMTP hiện tại.

## Phạm vi thực thi

Ngày 2026-11-15; SCRUM-53 kiểm kê, sau đó SCRUM-54 ghi miễn backup/restore legacy theo quyết định chủ dự án. Không triển khai bất kỳ task V2 tiếp theo nào.

Các file mới:

- `docs/legacy-inventory.md`
- `docs/runbooks/legacy-backup-restore.md`
- `docs/maintenance/SCRUM-6-validation.md`

Không migration, không application/config/test change, không package install. Không deploy, gọi Supabase remote, khởi tạo local stack, backup, restore, xóa hoặc reset. Không commit/push trong phiên này.

## Bằng chứng nguồn đã thực chạy

Tại `D:\Projects\GRABMEFOOD`:

| Kiểm tra | Kết quả thực tế |
| --- | --- |
| `git status --short --branch` trước sửa | `main...origin/main`, sạch |
| `git remote -v` | Origin GitHub `HuyTony2703/GRABMEFOOD.git` |
| `git rev-parse HEAD`, `git ls-files` qua Node | HEAD và 165 tracked files tại inventory; 73 src files, 8 test files |
| Import `src/app/data/restaurants.ts` bằng Node, đếm arrays và nested dishes | 6 nearby/8 nested dishes; 5 sale/0 nested; 3 todaysFoods |
| Đếm kích thước hai file local assets bằng `fs.statSync` | 134331 và 209412 bytes |
| Tìm infrastructure files trong tracked paths, `.env*` và tên file supabase trong repo | Không có kết quả phù hợp |
| Regex source/config/scripts/tests lấy **tên** env, không lấy giá trị | FIGMA_PUBLIC_URL, LOCALAPPDATA, PORT, TEMP |
| Tìm source cho storage/fetch/Supabase/env references | Chỉ thấy localStorage ghi lựa chọn confirm; không thấy Supabase client/business fetch |
| Kiểm thư mục tooling/skills | Spec Kit metadata 1.3.3 và command files; UI UX Pro Max/Impeccable có SKILL.md tại paths trong inventory |

Shell probe `Get-Command docker,supabase,node,pnpm` đi cùng kiểm thư mục skills trả exit 1 và bảng không thể hiện đủ kết quả executable. **Không dùng probe này để khẳng định Docker/CLI đã cài hoặc chưa cài.** Resource/toolchain readiness sẽ kiểm đúng ở SCRUM-21/64 trước setup. Node/npm được kiểm chứng bằng các lệnh kiểm thử thành công dưới đây.

Không query DB/Auth/Storage do không có target legacy và chủ dự án đã xác nhận chưa từng có backend. Counts là N/A, không phải query trả 0. Không đọc browser profile hay secret values.

## Baseline tests

| Lệnh | Kết quả |
| --- | --- |
| `npm test` | PASS, 38 tests; fail 0, skipped 0 |
| `npm run typecheck` | PASS, 0 diagnostics trong 66 app source files |
| `npm run check:structure` | PASS, sourceFiles 73 / reachableFiles 73, missingImports `[]`, unusedFiles `[]` |
| Node inline kiểm tra ba tài liệu mới | PASS, relative Markdown links tồn tại, có newline cuối, không có credential-pattern bị phát hiện, Git chỉ có đúng ba file docs mới |
| `git diff --check` | PASS, exit 0; lệnh này không kiểm nội dung file untracked, đã có kiểm tra Node riêng ở trên |

Không chạy build/browser/screenshot: không sửa UI, không có thiết kế mới để render. Không chạy database constraints/permissions/restore tests: chưa có instance; không tuyên bố chúng đã pass. Không có bug fix nên không tạo regression test giả.

## Jira — thay đổi định hướng, không thực thi task sau

Đã đọc SCRUM-5, Epic SCRUM-32, SCRUM-6/53/54; tìm toàn bộ backlog có label `grabmefood-v2` trong project SCRUM qua JQL, phân trang đầy đủ: **114 issues**.

Cập nhật description/AC ở **38 issues**:

| Nhóm | Tickets |
| --- | --- |
| Roadmap, kiểm kê, nguồn Spec Kit | SCRUM-5, 6, 18, 32, 53, 54 |
| Kiến trúc/hạ tầng | SCRUM-19, 21, 33, 34, 63, 64 |
| Database/Auth/Storage/seed/reliability | SCRUM-14, 22, 23, 35, 47, 48, 49, 65, 66, 71, 72, 75, 76 |
| Auth local | SCRUM-26, 37, 81 |
| Audit/vận hành | SCRUM-31, 44 |
| Đóng gói/nghiệm thu/dọn legacy | SCRUM-7, 8, 11, 45, 114, 115, 116, 117 |

Nội dung đồng bộ:

- Supabase CLI local là đích mới, không cloud project/account/credential bắt buộc.
- SCRUM-54 đổi từ backup/restore sang ghi nhận miễn legacy; không nhận có backup phục hồi được.
- SCRUM-47/65/66 đổi từ bắt buộc xóa legacy sang định danh/kiểm chứng instance local sạch, no-op có evidence nếu không có legacy. Những task này vẫn phải thực thi khi có local instance, không đóng trước.
- Bỏ các gate backup legacy bắt buộc tại dựng workspace/dọn legacy; giữ xác nhận riêng trước xóa/reset.
- SCRUM-49/76 vẫn thử reset–rebuild hai vòng và độ tin cậy/restore fixture **V2 local** tạm, không dựa vào backup legacy đã miễn.
- SCRUM-8/45/64/115/116 thêm AC một root folder, startup một lệnh sau prerequisites, không secrets/volumes/node_modules, startup không reset; thử bản giải nén ở đường dẫn khác.
- Không thay service boundaries, contracts, thứ tự/dependencies, sprint, assignee hoặc status của task sau.

Đã đọc lại toàn bộ 114 issues sau cập nhật: xác nhận 38 descriptions có quyết định mới; không còn các gate cũ `Không xóa workspace cũ khi chưa backup`, `Backup legacy rồi`, `Sau backup và demo`, `Inventory+backup đã có`, `inventory + backup manifest + evidence restore`, `snapshot manifest+restore rehearsal`. Tất cả issues ngoài SCRUM-5/6/53/54 vẫn To Do.

## Gate bàn giao

- SCRUM-53: đạt kiểm kê theo target thật và xác nhận không có backend legacy.
- SCRUM-54: đạt **phạm vi điều chỉnh là biên bản miễn**; backup/restore không thực hiện.
- SCRUM-6: đạt theo AC đã điều chỉnh, không phải AC backup/restore ban đầu.
- Jira có workflow Done nhưng không có transition Skipped/Cancelled trong các transition được trả cho ba ticket trên; lý do miễn được giữ rõ trong title/description/comment của SCRUM-54.
- Đã thêm comment bàn giao rồi chuyển lần lượt SCRUM-53 → SCRUM-54 → SCRUM-6 bằng transition `41`; cả ba trả về `statusName: Done`. Không chuyển status task sau.

Điểm tiếp tục: chờ giao SCRUM-18 (55 → 56). Khi đến hạ tầng, kiểm tài nguyên/Docker/CLI và định danh local instance trước mọi thao tác dữ liệu; không mặc định máy đã sẵn sàng.
