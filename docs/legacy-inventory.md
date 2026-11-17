# Kiểm kê legacy — SCRUM-6 / SCRUM-53

> Snapshot lịch sử Gói 1, không phải topology hiện tại. Sau đó owner duyệt
> [Cloud ADR](adr/0001-supabase-cloud.md) tại SCRUM-59: Cloud PostgreSQL/Auth/Storage,
> apps/broker localhost. Các dòng Local dưới đây ghi đúng quyết định lúc kiểm kê,
> đã bị thay thế; inventory/waiver legacy vẫn còn hiệu lực, không có quyền xóa.

## Mốc và phạm vi

- Kiểm kê ngày 2026-11-15; repo `D:\Projects\GRABMEFOOD`.
- Origin: `https://github.com/HuyTony2703/GRABMEFOOD.git`; branch `main`.
- HEAD trước thay đổi: `0bba883db9bcbca6a01de2e5d38b4cb57cec1746`.
- `git status --short --branch`: working tree sạch trước khi tạo tài liệu.
- 165 tracked files, trong đó 73 dưới `src/`, 8 dưới `tests/`.
- Nguồn yêu cầu V2: Jira SCRUM-5, SCRUM-32, SCRUM-6 và quyết định của chủ dự án trong phiên này. Đây là kiểm kê hiện trạng, không phải spec/plan V2 mới.

## Quyết định đã xác nhận trong phiên

1. Chủ dự án xác nhận chưa từng có backend/database, không có repo backend hoặc nguồn dữ liệu ngoài repo.
2. Không tạo/lưu backup; đồng ý miễn backup và thử phục hồi legacy ở SCRUM-54. Không có backup manifest hay bằng chứng restore thành công.
3. V2 dùng **Supabase CLI local** cho PostgreSQL/Auth/Storage; không tạo/link project cloud. Hạ tầng mới chỉ triển khai ở gói được chỉ định sau.
4. Nộp bài bằng một folder root tái lập: source/config/migrations/bootstrap/seed/ảnh demo mới và hướng dẫn; một lệnh khởi động sau prerequisites. Không hứa giải nén chạy ngay trên máy chưa có Docker/toolchain.
5. Miễn backup legacy không cấp quyền xóa/reset. Mọi thao tác phá hủy sau này vẫn phải trình đúng target/phạm vi/ảnh hưởng và chờ xác nhận.

## Code và công nghệ hiện có

| Nhóm | Đường dẫn thật / bằng chứng |
| --- | --- |
| Entry, providers, routes | `src/main.tsx`, `src/app/App.tsx`, `src/app/routes.tsx` |
| Stack legacy | `package.json`: React/React DOM 18.3.1, React Router 7.13.0, Vite 6.3.5, Tailwind 4.1.12, TypeScript ^5.7, Radix UI, lucide-react, motion; còn khai báo MUI/Emotion và các thư viện UI khác |
| Build/Figma | `vite.config.ts`, `vite.figma.config.ts`, `.figma/make/`, `.mise.toml`, `index.html`, `tsconfig.json` |
| Dependencies | `package-lock.json`, `pnpm-lock.yaml`, `pnpm-workspace.yaml`, `node_modules/`; giữ nguyên, không cài thêm |
| Shared UI | `src/app/components/{layout,discovery,details,feedback,media,profile,insights,ui}/` |
| Data/state | `src/app/data/`, `src/app/lib/`, `src/app/contexts/FavoritesContext.tsx` |
| Styles | `src/styles/`: CSS/fonts/theme/layout cũ; không phải design system V2 |
| Tests | `tests/unit/`, `tests/contracts/`, `tests/browser/`; scripts kiểm TypeScript/structure trong `scripts/` |
| Output local | `dist/`, `node_modules/` không phải source/backup, không đưa vào gói nộp |

Stack V2 đã duyệt khác legacy: Next.js/TypeScript/Tailwind, NestJS Gateway/Catalog/Community/Notification, pnpm monorepo, RabbitMQ, Supabase local, Docker Compose + CLI orchestration, Jest/Playwright/Actions. Gói này không chuyển stack.

## Routes và tính năng cũ

Nguồn chính xác: `src/app/routes.tsx` (25 path cụ thể + wildcard).

| Feature folder dưới `src/app/pages/` | Routes hiện có | Trạng thái hiện trạng |
| --- | --- | --- |
| `onboarding/` | `/welcome`, `/onboarding` | Nội dung và bước hướng dẫn frontend |
| `discovery/` | `/`, `/search`, `/all-restaurants`, `/map`, `/random` | Catalog/search/filter/random từ fixtures, không API dữ liệu thật; map là legacy, không giữ trang map trong V2 |
| `details/` | `/restaurant/:id`, `/restaurant/:restaurantId/dish/:dishId`, `/dish/:id` | Món theo quán; URL món cũ xử lý bằng mapping tường minh, không suy đoán |
| `favorites/` | `/favorites` | React state seeded, không phải bản ghi người dùng đã lưu ở DB |
| `auth/` | `/login`, `/register` | Form xem trước, submit/provider/recovery chưa có dịch vụ, bị disabled |
| `profile/` | `/profile`, `/profile/reviews` | Hồ sơ/đánh giá mẫu, không danh tính Auth thật |
| `notifications/` | `/notifications` | Danh sách mẫu và thao tác state trong trang, không event/inbox backend |
| `settings/` | `/settings`, `/settings/account`, `/settings/addresses`, `/settings/notifications`, `/settings/language`, `/settings/theme`, `/settings/support`, `/settings/terms`, `/settings/guide` | Nội dung mẫu/tùy chọn UI; chỉnh tài khoản/hỗ trợ và tính năng chưa nối service phải phân biệt với chức năng thật |
| `errors/` | `*`, error elements | Trạng thái lỗi/không tìm thấy frontend |

Không có ordering/payment/delivery backend. Trang và label hiện có không phải xác nhận chức năng V2.

## Dữ liệu và trạng thái trình duyệt

- `src/app/data/restaurants.ts`: import module và đếm thực tế bằng Node:
  - `nearbyRestaurants`: 6 quán, 8 món nhúng;
  - `saleRestaurants`: 5 quán, không có món nhúng;
  - `todaysFoods`: 3 món nguồn.
- `src/app/lib/catalog.ts`: `allRestaurants` ghép 11 bản ghi nguồn; có `phoSampleMenu` 6 món bổ sung cho quán `1`, `phoDishes` và mapping món/quán; số nguồn không đồng nghĩa số món hiển thị hoặc số quán thật đã xác minh.
- `src/app/data/legacyDishes.ts`: chi tiết món legacy; `src/app/lib/dishCatalog.ts` và `discovery.ts`: quan hệ món và xử lý tìm kiếm.
- `FavoritesContext.tsx`: 7 dish seed IDs + 7 restaurant seed IDs; danh sách và thay đổi chỉ nằm trong React state, mất khi tải lại; không tự coi ID món legacy là cặp quán–món hợp lệ.
- `NotificationsPage.tsx`, `AllReviewsPage.tsx`, `AccountSettingsPage.tsx` và các trang settings chứa fixtures/UI data, không phải dữ liệu lấy từ database.
- Tìm trong `src/` cho `localStorage|sessionStorage|fetch\(|supabase|import.meta.env|process.env`: chỉ thấy `localStorage.setItem` tại `components/feedback/ConfirmDialog.tsx`, khóa `confirm-${title}`. Không đọc/xóa browser profile; không kiểm đếm dữ liệu thực trong từng trình duyệt.
- Không xuất cookies, mật khẩu, token hoặc dữ liệu cá nhân từ trình duyệt.

## UI/assets và tài liệu

| Target | Kết quả |
| --- | --- |
| `src/assets/branding/logo.jpg` | 134331 bytes, logo legacy |
| `src/assets/images/com-tam.jpg` | 209412 bytes, ảnh legacy |
| Ảnh/font ngoài | Source có host `images.unsplash.com`, `i.pravatar.cc`, `fonts.googleapis.com`; link ngoài còn có `maps.google.com`, `www.google.com` |
| `src/styles/fonts.css` | Google Fonts Roboto 300/400/500/700, cần mạng khi chưa cache |
| Provenance | `ATTRIBUTIONS.md`, `PRODUCT.md`; không suy ra mọi ảnh đã có license chỉ vì tồn tại trong source |
| Tài liệu hiện trạng | `README.md`, `PRODUCT.md`, `DESIGN.md`, `docs/audits/`, `docs/maintenance/` |
| Spec Kit legacy | `specs/001-desktop-ui-redesign/`, `specs/002-improve-discovery-ui/`: spec/plan/tasks/research/data-model/contracts/checklists và verification/validation |
| Spec Kit tooling | `.specify/init-options.json`: `speckit_version` 1.3.3, integration OpenCode/PowerShell; `.specify/feature.json` trỏ `specs/002-improve-discovery-ui`; `.opencode/commands/speckit.*.md` có constitution/specify/clarify/plan/tasks/analyze/implement/checklist/converge |
| UI skills đã cài | `C:\Users\HUY\.agents\skills\ui-ux-pro-max\SKILL.md`, `C:\Users\HUY\.config\opencode\skills\impeccable\SKILL.md`; thư mục `.impeccable/` trong repo là artifacts/config, không phải bằng chứng duy nhất về skill |

Đã kiểm tra sự hiện diện tooling, không chạy Spec Kit hoặc gọi skill UI vì kiểm kê không cần. Version Spec Kit là metadata cài trong repo, không phải xác nhận CLI toàn cục. Các spec desktop/layout cũ và PRODUCT/DESIGN không được mặc định coi là yêu cầu/thiết kế V2 đã duyệt.

## Target Supabase và env — không có instance legacy

| Mục | Kết quả / nguồn |
| --- | --- |
| Legacy local/remote project ID, API URL, DB host | **Không áp dụng**: chủ dự án xác nhận chưa có backend/database |
| Auth users/identities/sessions | Không có target để query; count **N/A**, không phải kết quả SQL `0` |
| Database/schema/tables/rows | Không có target để query; count **N/A** |
| Storage buckets/objects/bytes | Không có target để query; count **N/A**; hai ảnh trong source không phải Supabase Storage |
| Cấu hình repo | Không tìm thấy `.env*`, tên file chứa `supabase`; `git ls-files` không có Docker/Compose/Supabase/SQL/env infrastructure files |
| Env names trong tracked source/config/tests/scripts | `FIGMA_PUBLIC_URL`, `PORT`, `LOCALAPPDATA`, `TEMP`; không đọc/in giá trị. Không tìm thấy Supabase env references |
| Target V2 | Supabase CLI **local mới**; project_id, ports, container/volume/buckets/DB roles thực tế chưa được tạo/chốt, ghi ở SCRUM-21/64 và các task database sau |

Không gọi Supabase MCP tới một project đang kết nối ngầm để suy ra đó là đích dự án. Không scan máy để đọc credential. Không cài CLI/Docker, không start stack, không tạo cloud project ở gói này.

## Nghiệm thu và điểm tiếp tục

- SCRUM-53: kiểm kê paths/routes/stack/assets/data sources/env names và trạng thái không có target đã có bằng chứng source + xác nhận chủ dự án.
- SCRUM-54: miễn backup/restore legacy theo quyết định đã duyệt; chi tiết tại [runbooks/legacy-backup-restore.md](runbooks/legacy-backup-restore.md). Không có bản sao để nghiệm thu phục hồi.
- Không sửa application/tests/config; không migration, xóa hoặc reset.
- Bằng chứng kiểm tra baseline và đồng bộ Jira: [maintenance/SCRUM-6-validation.md](maintenance/SCRUM-6-validation.md).
- Gói tiếp theo theo roadmap là SCRUM-18 (55 → 56), chỉ bắt đầu khi được giao. Không tái sử dụng UI/assets/content legacy làm V2.
