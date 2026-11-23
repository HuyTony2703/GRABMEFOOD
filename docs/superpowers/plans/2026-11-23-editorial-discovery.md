# Editorial Discovery Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Nâng trang Catalog discovery thành một trang editorial guide riêng của GrabMeFood, lấy nhịp nội dung/cấu trúc cẩm nang ẩm thực làm cảm hứng.

**Architecture:** Mở rộng composition React hiện có tại App và CatalogDiscovery; chỉ dữ liệu rỗng như hiện nay. CSS tạo visual feature trừu tượng không dùng ảnh hoặc nội dung bên ngoài; CSS hiện có được mở rộng cho responsive.

**Tech Stack:** React 19, TypeScript, Vite, CSS, Vitest, React Testing Library hiện cài; không dependency mới.

**Spec:** `docs/superpowers/specs/2026-11-23-editorial-discovery-design.md`

## Global Constraints

- Tham khảo cấu trúc trải nghiệm editorial guide; không sao chép logo, mascot, font riêng, ảnh, wording hay pixel layout Michelin Guide.
- Không dùng dữ liệu/quán thật, fixture runtime, API/Data API, Supabase, Auth/RLS hoặc backend.
- Không thêm tính năng nghiệp vụ, route hay dependency.
- Giữ semantic landmarks, accessible names, focus visible và responsive ở 320px trở lên.
- Hình minh họa phải CSS-only, trừu tượng và không ngụ ý là ảnh quán thực tế.

## Review Focus

- Viewport nhỏ 320–390px: header, search và feature không tràn ngang; kiểm tra trong responsive CSS và test markup không bắt buộc browser.
- Empty catalog: editorial feature không được giả như có kết quả quán; SSR vẫn có empty state.
- Accessibility: search landmark có tên, input labels, nav landmark/name, headings theo thứ tự; assertions trong component/SSR tests.
- Nội dung/tài sản: không nhúng ảnh, external URL, logo hay copy từ Michelin; rà diff/tĩnh.
- Desktop: hero/editorial feature/results có phân cấp rõ bằng layout CSS; kiểm tra production SSR/HTTP, browser screenshot chưa có công cụ.

---

### Task 1: Editorial page structure

**Files:**
- Modify: `frontend/src/App.tsx`
- Modify: `frontend/src/catalog/CatalogDiscovery.tsx`
- Test: `frontend/src/App.test.tsx`
- Test: `frontend/src/catalog/CatalogDiscovery.test.tsx`

**Interfaces:**
- `App` tiếp tục dùng `CatalogDiscovery` với `restaurants` rỗng.
- `CatalogDiscovery` giữ prop `restaurants: CatalogRestaurant[]` và search/filter behavior.

- [x] **Step 1: Viết test fail-first** cho nav landmark tên “Điều hướng chính”, hero/editorial heading, feature có nhãn “Gợi ý biên tập · minh họa”, named search landmark và SSR empty state.
- [x] **Step 2: Chạy** `npm test -- --reporter=verbose`; assertion mới fail đúng vì nav landmark chưa có.
- [x] **Step 3: Cập nhật JSX** tạo header/nav, editorial hero, search hiện hữu, CSS illustration feature có nhãn minh họa, kết quả; không thêm mock quán.
- [x] **Step 4: Chạy tests**; 5 tests pass, search/filter/empty behavior giữ nguyên.

### Task 2: Responsive editorial visual system

**Files:**
- Modify: `frontend/src/styles.css`
- Test: static/SSR assertions của Task 1

- [x] **Step 1: Xác nhận test contract** từ Task 1 và test hiện hành.
- [x] **Step 2: Chạy tests** trước chỉnh CSS; 5 tests pass.
- [x] **Step 3: Tạo CSS hierarchy** cho masthead/nav, hero, search panel, editorial feature và results; bố cục 3→2→1 cột, reflow mobile; giữ palette riêng GrabMeFood, không dùng ảnh/gradient phụ thuộc asset.
- [x] **Step 4: Chạy test và build** `npm test -- --reporter=verbose`, `npm run build`; pass 5/5, TypeScript/client/SSR pass.
- [x] **Step 5: Rà tĩnh** search landmark/label, các h-level, nội dung/tài sản; `git diff --check` không có lỗi (chỉ cảnh báo line ending).

### Task 3: Runtime verification

**Files:** không sửa thêm nếu kiểm tra pass.

- [x] **Step 1:** Chạy `PORT=4174 npm run start` do port 4173 đang được dev server sử dụng; `GET /` production SSR và JS asset HTTP 200, có nav/hero/feature/search/empty state.
- [x] **Step 2:** Dừng production process do task khởi chạy; không dừng dev server có trước trên 4173. Browser visual review chưa thực hiện vì không có browser tool.
- [x] **Step 3:** Rà `git status`/diff; không tuyên bố API/Auth/backend acceptance. Mọi thay đổi staged/chưa commit ban đầu được giữ; không commit.

**Progress/evidence:** `npm --prefix frontend test -- --reporter=verbose` 5/5;
`npm --prefix frontend run build` pass; production SSR and asset HTTP 200.
Ban đầu `task-done` thử npm từ repo root nên lỗi không tìm thấy package.json; chạy lại bằng
`--prefix frontend` pass. Port 4173 đã có tiến trình `node server.mjs` trước task; không dừng
tiến trình không thuộc production verification này. Không browser screenshot, API, Cloud, Auth/RLS,
service, migration/replay hoặc GRAB-6 acceptance.

**Final review:** independent reviewer found no Critical/Important issues. Deferred minor:
heading-order/feature-results regression assertions could be stronger; browser viewport/
overflow review at 320/390/desktop remains unavailable. Impeccable detector returned `[]`.
