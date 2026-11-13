# Implementation Plan: Desktop-only và chi tiết món tại quán

**Branch**: `002-improve-discovery-ui` | **Date**: 2026-11-13 | **Spec**: [spec.md](spec.md)

**Input**: Bốn câu trả lời trong spec; chủ sản phẩm yêu cầu lập kế hoạch xong triển khai luôn.

## Summary

Giữ footer/avatar/nút lên đầu trang đang có trong working tree. Bỏ giao diện mobile, dùng desktop làm mặc định và cho phép cuộn ngang ở vùng hẹp. Chỉ hiển thị món có quan hệ quán và đích thực đơn hợp lệ; không sửa dữ liệu nguồn để bịa quan hệ. Khóa yêu thích dùng cặp quán–món. Bỏ giao diện chi tiết món độc lập; URL cũ chỉ chuyển hướng khi quan hệ duy nhất được nguồn xác định, còn lại có thông báo và liên kết tìm kiếm.

## Technical Context

**Language/Version**: TypeScript ~5.7, React 18, Node.js 22.18+ hoặc 24+.
**Primary Dependencies**: React Router 7.13, Vite 6.3.5, Tailwind 4.1, Radix và Lucide; không đổi package/lockfile.
**Storage**: Fixtures TypeScript; yêu thích trong React context theo phiên, không có backend mới.
**Testing**: Node test runner, scripts typecheck/structure, browser CDP harness với Chrome/Edge đã cài, Vite build.
**Target Platform**: Desktop web; vùng hẹp/điện thoại vẫn dùng desktop và cuộn ngang.
**Project Type**: React SPA trong Figma Make.
**Performance Goals**: Không thêm request, độ trễ giả, dependency hoặc tác vụ nền; dựng danh mục một lần từ fixtures nhỏ. Không đặt SLA production khi chưa có dịch vụ được xác minh.
**Constraints**: Giữ tiếng Việt, theme, focus, bàn phím, reduced-motion và dữ liệu mẫu; bảo toàn thay đổi người dùng. Không tuyên bố đạt reflow khi cho phép cuộn ngang.
**Scale/Scope**: Toàn bộ khung/route hiện có và các danh sách món, yêu thích, ngẫu nhiên, thực đơn, chi tiết. Không thêm giao dịch, xác thực, geolocation hoặc backend.

## Constitution Check

| Nguyên tắc | Trước Phase 0 | Sau Phase 1 |
| --- | --- | --- |
| I. Discovery-only | PASS | PASS — chỉ khám phá, điều hướng, đánh giá mẫu |
| II. Vietnamese/accessibility | PASS với ngoại lệ đã duyệt | PASS với ngoại lệ — cùng bố cục desktop, vẫn giữ focus/bàn phím/tương phản |
| III. Evidence before claims | PASS | PASS — không bịa quan hệ/giá/đánh giá hoặc dịch vụ |
| IV. Functional integrity | PASS | PASS — kiểm thử URL, identity, rỗng/lỗi, ma trận browser |
| V. Simple implementation | PASS | PASS — giữ stack/working tree, helper thuần và component hiện có |

Ngoại lệ responsive/mobile được chủ sản phẩm xác nhận ngày 2026-11-13 trong spec: toàn website chỉ có desktop, vẫn truy cập bằng cuộn ngang trên màn hình hẹp. Rủi ro: trải nghiệm hẹp và reflow giảm. Kiểm thử độ rộng hẹp, zoom và khả năng tới điều khiển vẫn bắt buộc. Ngoại lệ hết khi chủ sản phẩm đổi phạm vi thiết bị; không tự sửa constitution. Không có gate thất bại chưa giải trình hoặc quyết định sản phẩm còn chặn.

## Project Structure

### Documentation (this feature)

```text
specs/002-improve-discovery-ui/
├── spec.md
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/ui-contract.md
└── tasks.md                 # Triển khai tiếp sau Phase 1 theo yêu cầu làm luôn
```

### Source Code (repository root)

```text
src/app/
├── components/layout/      # AppFrame, SiteFooter, BackToTop; bỏ BottomNav
├── components/discovery/   # Card và bộ lọc hiện có
├── components/details/     # Tái dùng chi tiết, chia sẻ và nháp đánh giá
├── contexts/               # Yêu thích dùng khóa quán–món
├── data/                   # Giữ nguyên nguồn
├── lib/                    # Danh mục và helper thuần cho resolver/identity
├── pages/                  # Discovery, favorites, details và các trang phụ
└── routes.tsx              # URL cũ dùng trang tương thích
src/styles/app.css          # Desktop mặc định, không còn nhánh mobile
tests/{unit,contracts,browser}/
```

**Structure Decision**: Giữ nhóm feature và alias `@/`; helper thuần không import alias để Node test trực tiếp. Contracts mô tả UI/URL, không bịa API backend.

## Execution and Validation

1. Hoàn tất nghiên cứu, data model, UI contract, quickstart và kiểm tra lại gates.
2. Chuẩn hóa danh mục món tại quán và resolver URL cũ; unit tests cho quan hệ, đích không tồn tại, mơ hồ, ID trùng và bất biến dữ liệu nguồn.
3. Cập nhật mọi consumer và khóa yêu thích; bỏ trang chi tiết độc lập, chỉ xóa component không còn consumer sau khi kiểm tra.
4. Bỏ BottomNav/CSS/logic mobile; dùng layout desktop mặc định. Dialog vẫn vừa viewport để Escape/focus luôn sử dụng được.
5. Cập nhật hợp đồng test cũ theo yêu cầu mới, không bỏ kiểm tra tương phản/tên truy cập/bàn phím. Kiểm thử 5 độ rộng × 2 theme × zoom chữ 100/200%.
6. Chạy `npm test`, `npm run typecheck`, `npm run check:structure`, `npm run build`, browser checks và UI detector; xem ảnh desktop sáng/tối và vùng hẹp. Ghi rõ kiểm tra thực thi và hạn chế.

## Complexity Tracking

| Violation | Why Needed | Simpler Alternative Rejected Because |
| --- | --- | --- |
| Bỏ bố cục mobile/reflow riêng | Chủ sản phẩm chỉ muốn desktop, đã chọn truy cập bằng cuộn ngang | Giữ mobile trái yêu cầu; chặn theo độ rộng cũng bị từ chối |
