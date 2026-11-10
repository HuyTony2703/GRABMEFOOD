# Dọn và sắp xếp repository — 2026-11-10

## Phạm vi đã chọn

Người dùng chọn phương án **an toàn**: sao lưu trước khi xóa, nhóm lại source,
giữ Git/Figma/Spec Kit/Impeccable/tài liệu và dependency hiện có. Không đổi giao diện,
nghiệp vụ, route, dữ liệu, version package hoặc lockfile; không commit/push/deploy.

## Sao lưu có kiểm tra SHA-256

`C:\Users\HUY\AppData\Local\Temp\opencode\grabmefood-cleanup-2026-11-10T15-46-22-251Z`

140 file nguồn/test/tài liệu/cấu hình liên quan đã được sao lưu và đối chiếu hash
trước thay đổi, bao gồm ảnh có thay đổi chưa commit. Trong thư mục sao lưu:

- `backup-manifest.json`: đường dẫn, dung lượng và SHA-256 của từng file.
- `organization-map.json`: bảng đường dẫn cũ → mới, danh sách file không dùng.
- Các file gốc giữ nguyên nội dung để có thể phục hồi từng file.

Đây là bản sao trong thư mục tạm cục bộ, không phải backup bền vững. Hãy chép thư
mục này ra nơi lưu trữ của bạn nếu muốn giữ lâu. Không dùng `git reset --hard` để
hoàn tác vì working copy có nhiều thay đổi chưa commit từ trước lần dọn.

## Kiểm kê và quyết định

- Đọc hướng dẫn, cấu hình, package scripts, dữ liệu và các tài liệu liên quan;
  phân tích import/export của toàn bộ mã nguồn bằng TypeScript AST và CSS imports.
- `src/` ban đầu có 123 file; 71 file thuộc đồ thị entry/declaration/test được dùng.
  Không coi thiếu import là lý do xóa tài liệu, file cấu hình hay công cụ phát triển.
- Bỏ **39 component/hook mẫu không dùng** (38 file UI, 1 helper ảnh Figma cũ).
  Không có file nào trong nhóm này mang thay đổi ứng dụng từ lần redesign.
- Bỏ **13 ảnh không được tham chiếu**, sau khi sao lưu byte gốc. Gộp thêm một logo
  đang dùng nhưng trùng byte với logo chung; tổng cộng bỏ 14 bản ảnh dư.
- Năm file ảnh logo có SHA-256 giống nhau. Hai trang cần logo nay cùng import
  `src/assets/branding/logo.jpg`. Ảnh cơm tấm chuyển sang tên mô tả `com-tam.jpg`.
- Bỏ `default_shadcn_theme.css`: template theme không được import; theme thực tế
  vẫn là `src/styles/theme.css`. Bản gốc đã được sao lưu.
- `src/` sau dọn còn **70 file**, chỉ còn 2 asset cục bộ đang dùng. Những ảnh từ URL
  bên ngoài trong dữ liệu không bị thay thế hoặc tải thêm.

## Quy ước mới

- Trang nhóm theo chức năng trong `src/app/pages/`; component nhóm theo vai trò trong
  `src/app/components/`; state dùng chung trong `src/app/contexts/`.
- Giữ nguyên tên component và URL; chỉ thay vị trí file và import.
- App dùng alias `@/` đã cấu hình sẵn. Không thêm dependency để resolve alias.
- Test chia `unit/`, `contracts/`, `browser/`; script kiểm tra đặt ở `scripts/`.
- Báo cáo thẻ cũ chuyển vào `docs/audits/`, có nhãn tài liệu lịch sử. Spec/audit cũ
  giữ đường dẫn trong bằng chứng tại thời điểm thực hiện; dùng README cho cấu trúc hiện tại.
- Không xóa `node_modules`, khóa package, metadata Git hoặc công cụ chỉ để giảm số
  folder. Không đổi package manager vì môi trường local dùng npm còn Figma dùng pnpm.

## Kiểm chứng sau sắp xếp

Chạy trên Node hiện có, không cài thêm package hay trình duyệt:

| Lệnh | Kết quả |
| --- | --- |
| `npm run check:structure` | PASS — 70 file nguồn, 70 file tới được từ entry, 0 import hỏng, 0 file không dùng |
| `npm test` | PASS — 20/20 (6 unit + 6 hợp đồng + 8 insight) |
| `npm run typecheck` | PASS — 0 lỗi trong 63 file `.ts`/`.tsx` của `src/` |
| `npm run build` | PASS — 1737 module, JS 434,74 kB (gzip 134,22 kB), CSS 40,12 kB |
| `npm run test:browser` | PASS — 62 check nhanh, 0 lỗi, toàn bộ interaction đạt |
| `npm run test:browser:full` | PASS — 310 check, 0 lỗi, 30/30 interaction đạt |

Kiểm tra thêm: so sánh từng file nguồn với bản sao lưu, bỏ qua đúng phần đường dẫn
import, cho thấy 63 file chỉ đổi vị trí/import, không đổi nội dung. `src/app/data/`,
`src/styles/theme.css`, hai file cấu hình Vite và hai lockfile trùng hash tuyệt đối.
Nhánh `dependencies` của `package.json` không đổi.

## Còn lại và giới hạn

- `npm run typecheck:all` vẫn báo lỗi có sẵn `vite.figma.config.ts:86` (TS2349).
  Lỗi này tồn tại trước lần dọn, không liên quan tới cấu trúc mới và không được sửa
  trong phạm vi này. `npm run typecheck` kiểm tra riêng `src/` và đang sạch.
- Hai lockfile (`package-lock.json` cho npm, `pnpm-lock.yaml` cho Figma) vẫn cùng tồn tại.
  Chỉ dùng một package manager cho mỗi lần cài; chưa chuyển đổi quy trình.
- Bản sao lưu nằm trong thư mục tạm cục bộ; nếu cần giữ lâu, hãy chép ra ngoài.
- Không commit, push hay deploy. Toàn bộ thay đổi vẫn ở working copy.
- Các kiểm tra con người (nghiệm thu 5 người, screen reader thật) vẫn chưa thực hiện,
  như ghi trong `specs/001-desktop-ui-redesign/verification.md`.
