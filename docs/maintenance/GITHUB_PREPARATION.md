# Dọn và nhóm thay đổi để đưa lên GitHub — 2026-11-13

## Phạm vi được xác nhận

Chủ dự án chọn tạo các commit theo nhóm và push lên `origin/main` của
`HuyTony2703/GRABMEFOOD`, không force-push. Các thay đổi giao diện, dữ liệu và kiểm
thử đang có trong working tree được đưa lên cùng đợt này, không bỏ thay đổi có trước.

## Kết quả kiểm kê

- 73/73 file trong `src/` tới được từ entry/declarations; không import hỏng, không có
  file nguồn không dùng. Không xóa thêm source chỉ để giảm số file.
- 164 file tracked/untracked không bị ignore đã được kiểm tra trước thay đổi dọn
  lần này: không trùng byte, không file lớn hơn 10 MiB, không có ứng viên theo các
  mẫu khóa riêng/token/credential phổ biến được quét. Đây không phải chứng nhận
  không có bí mật; lượt quét chỉ kiểm tra nội dung hiện tại, không kiểm toàn lịch sử Git.
- `node_modules/`, `dist/`, `.impeccable/live/`, `.specify/feature.json` đã bị ignore,
  không đưa lên GitHub. Không xóa các thư mục output/dependencies đang phục vụ máy.
- Bổ sung ignore cho `.DS_Store`, `Thumbs.db`, `Desktop.ini`, swap và backup tạm của
  editor. Không ignore source hoặc dữ liệu mẫu đang cần giữ.
- `BottomNav.tsx`, `DishDetailPage.tsx`, `DishScoreCards.tsx` đã được bỏ trong đợt
  desktop/món tại quán; các lần xóa đó được ghi trong commit ứng dụng.
- Giữ dữ liệu món chưa liên kết quán như đã xác nhận, dù không render. Hai asset
  hiện có dùng Git LFS; không di chuyển hoặc xóa bản gốc.
- Giữ `.figma/` theo hướng dẫn chính thức tại `.figma/README.md`, hai cấu hình Vite,
  `.specify/`, `.opencode/`, `.impeccable/`, đặc tả, báo cáo lịch sử và hai lockfile
  phục vụ quy trình npm/Figma-pnpm. Không đổi stack hoặc thêm dependency.

## Bốn nhóm commit

| Nhóm | Nội dung | Thông điệp commit |
| --- | --- | --- |
| Cấu hình/dọn repo | Ignore rác cục bộ; giữ cấu hình dev server hiện có trên cổng 8443 | `chore(repo): ignore local clutter and stabilize the dev server` |
| Ứng dụng | Desktop-only, món tại quán, khóa yêu thích, footer/avatar và focus | `feat(app): unify desktop discovery around restaurant dishes` |
| Kiểm thử | Unit, source contracts và browser regression theo phạm vi mới | `test: cover scoped dishes and desktop discovery flows` |
| Tài liệu | Product/design, README, đặc tả, kế hoạch và bằng chứng kiểm chứng | `docs: record desktop scope and GitHub preparation` |

Không tạo thư mục thừa cho từng commit: source/tests/docs đã có các nhóm phù hợp.
Cấu hình phải giữ ở vị trí công cụ đang đọc. Các commit là nhóm review; trạng thái
được nghiệm thu là đầu nhánh sau đủ bốn nhóm.

## Đồng bộ và kiểm chứng

Khi fetch, `origin/main` có thêm commit `47f9fa2` chỉ chèn dòng trống trong README.
Giữ thay đổi remote đó; các commit mới chưa được công bố có thể rebase lên main mới
nhất sau khi working tree sạch. Nếu có xung đột không rõ cách giữ cả hai phía, dừng
để làm rõ; không reset/discard hoặc force-push để vượt qua.

Trước push chạy `npm test`, `npm run typecheck`, `npm run check:structure`,
`npm run build`, kiểm tra staged diff/ignore và quét lại mẫu bí mật. Thay đổi dọn lần
này không đổi UI; kết quả browser full 310 ca cùng toàn bộ tương tác đã đạt ở đợt
triển khai ngay trước đó, xem `specs/002-improve-discovery-ui/validation.md`.

Push dùng `git push origin main`. Kết quả remote/commit hash được báo trực tiếp khi
bàn giao; không ghi trước rằng push đã thành công.

## Kiểm tra thực thi trước khi tạo commit

| Kiểm tra | Kết quả |
| --- | --- |
| `npm test` | PASS — 38/38 |
| `npm run typecheck` | PASS — 0 diagnostics |
| `npm run check:structure` | PASS — 73/73 file reachable, không import hỏng/file nguồn thừa |
| `npm run build` | PASS — build production thành công |
| `git diff --check` | PASS — không lỗi whitespace |
| Ignore rác/build/dependencies/trạng thái cục bộ | PASS — các đường dẫn đại diện bị ignore và không nằm trong tracked files |
