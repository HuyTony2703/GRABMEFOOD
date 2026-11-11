# GrabMeFood

Website khám phá món ăn và quán ăn, dùng React + TypeScript + Vite + Tailwind CSS.
Dữ liệu hiện là minh họa; không có luồng đặt hàng, thanh toán hoặc giao hàng.

## Chạy trên máy

Dùng Node.js **22.18+ hoặc 24+** để chạy cả ứng dụng và các test TypeScript trực tiếp.
Phiên bản toolchain của môi trường Figma được khai báo trong `.mise.toml`.

```powershell
cd D:\Projects\GRABMEFOOD
npm run dev
```


Mở **http://localhost:8443**. Dừng bằng `Ctrl+C`. Nếu server đã chạy, không mở thêm
một server trên cùng cổng. Repo hiện có `node_modules`, không cần cài lại.

Nếu clone mới và chưa có dependencies: dùng **một** package manager, `npm ci` với
`package-lock.json`, hoặc `pnpm install --frozen-lockfile` với `pnpm-lock.yaml`.
Không trộn hai lệnh cài trong cùng một working copy. Hai lockfile được giữ nguyên
trong lần dọn này để không tự ý chuyển quy trình npm/Figma-pnpm đang có.

## Lệnh thường dùng

| Lệnh | Mục đích |
| --- | --- |
| `npm run dev` | Chạy development server |
| `npm run build` | Build vào `dist/` |
| `npm run preview` | Xem bản build; dừng dev trước vì dùng cùng cổng 8443 |
| `npm test` | Unit test và kiểm tra hợp đồng mã nguồn |
| `npm run typecheck` | Kiểm tra TypeScript trong `src/` |
| `npm run typecheck:all` | Kiểm tra cả cấu hình; hiện còn lỗi có sẵn tại `vite.figma.config.ts:86` |
| `npm run check:structure` | Tìm import nội bộ bị hỏng và file nguồn không được sử dụng |
| `npm run test:browser` | Kiểm tra nhanh bằng Chrome/Edge đã cài, cần dev server |
| `npm run test:browser:full` | Ma trận trình duyệt 5 độ rộng × 2 theme, cần dev server |

Chỉ chạy một browser test tại một thời điểm vì harness dùng cổng CDP cục bộ 19333.
Không cài thêm trình duyệt/package tự động. `npm run format` là formatter hiện có;
nên giới hạn file cần định dạng và luôn kiểm tra build/test sau đó.

## Cấu trúc

```text
src/
  main.tsx                    # Entry trình duyệt
  app/
    App.tsx                   # Providers toàn ứng dụng
    routes.tsx                # 26 nhóm route, URL không thay đổi
    pages/                    # Trang, chia theo chức năng
      auth/                   # Đăng nhập, đăng ký
      discovery/              # Trang chủ, tìm kiếm, danh sách, bản đồ, ngẫu nhiên
      details/                # Chi tiết món/quán/món tại quán
      favorites/              # Yêu thích
      notifications/          # Thông báo
      onboarding/             # Chào mừng, hướng dẫn ban đầu
      profile/                # Hồ sơ, đánh giá
      settings/               # Cài đặt, hỗ trợ, điều khoản, hướng dẫn
      errors/                 # Trang lỗi
    components/
      layout/                 # Khung trang, điều hướng, tiêu đề, quay lại
      discovery/              # Card món/quán và bộ lọc
      details/                # Chi tiết dùng chung, nháp đánh giá, chia sẻ
      feedback/               # Trạng thái rỗng/chưa khả dụng, xác nhận
      media/                  # Ảnh có fallback
      profile/                # Danh sách đánh giá mẫu
      insights/               # Thẻ phân tích và hàm tính toán
      ui/                     # Chỉ các primitive hiện đang dùng
    contexts/                 # State dùng chung giữa các trang
    data/                     # Dữ liệu gốc
    lib/                      # Hàm/adapters dữ liệu và tìm kiếm
  assets/
    branding/logo.jpg         # Một logo dùng chung, không giữ bản trùng
    images/com-tam.jpg        # Ảnh món đang dùng
  styles/                     # Font, Tailwind, token theme, layout
tests/
  unit/                       # Kiểm thử hàm thuần
  contracts/                  # Ràng buộc route/theme/dữ liệu/chức năng
  browser/                    # Harness Chrome DevTools Protocol
scripts/                      # Kiểm tra TypeScript và cấu trúc
docs/
  audits/                     # Báo cáo lịch sử
  maintenance/                # Biên bản dọn và sắp xếp repo
specs/                        # Đặc tả, kế hoạch, task và bằng chứng redesign
```

Import trong ứng dụng dùng alias **`@/` → `src/`**, đã có trong Vite và TypeScript.
Không tạo barrel `index.ts` cho từng nhóm: import trực tiếp giúp nhìn rõ phụ thuộc.
Test Node dùng đường dẫn tương đối tới file `.ts`, không cần loader alias.

## Những thư mục không được coi là rác

- `.git/`: lịch sử và trạng thái Git; không xóa khi dọn source.
- `.figma/`, `vite.figma.config.ts`, `vite.config.ts`: quy trình Figma Make; cả hai
  cấu hình Vite đều cần vì wrapper import cấu hình nền. `vite.figma.config.ts` đọc
  trực tiếp `.figma/make/site.json` và `.figma/make/migrated-package-aliases.json`,
  nên xóa thư mục này sẽ làm hỏng `npm run dev` và `npm run build`.
- `.specify/`, `.opencode/`, `.impeccable/`, `specs/`: công cụ, đặc tả và bằng chứng
  phát triển được giữ theo phương án dọn an toàn.
- `node_modules/`: dependencies cài cục bộ, đã được Git ignore; không chỉnh file bên trong.
- `dist/`: kết quả build, được tạo lại và Git ignore; không sửa tay.

Các file cấu hình cần ở root được giữ tại root thay vì gom vào một thư mục khiến
công cụ không tự tìm thấy: `tsconfig.json`, hai cấu hình Vite, `.mise.toml`,
`index.html`, `package.json` và các file khóa package. `PRODUCT.md`, `DESIGN.md`,
`AGENTS.md` và `ATTRIBUTIONS.md` giữ vị trí phục vụ hướng dẫn và ghi công thư viện.

Chi tiết lần dọn: [docs/maintenance/REPOSITORY_CLEANUP.md](docs/maintenance/REPOSITORY_CLEANUP.md).
