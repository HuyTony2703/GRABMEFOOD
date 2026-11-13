---
version: alpha
name: GrabMeFood
description: "Hệ thống thiết kế GrabMeFood: desktop-only theo xác nhận 2026-11-13, giữ màu thương hiệu, dùng token và UI hiện có."
colors:
  primary: "#DC2626"
  primary-hover: "#B91C1C"
  primary-foreground: "#FFFFFF"
  background: "#FFFFFF"
  card: "#FFFFFF"
  foreground: "#000000"
  secondary: "#F5F5F5"
  muted: "#F5F5F5"
  muted-foreground: "#6B7280"
  accent: "#FEF2F2"
  accent-foreground: "#000000"
  destructive: "#DC2626"
  destructive-foreground: "#FFFFFF"
  border: "rgba(0, 0, 0, 0.1)"
  input: "#6B7280"
  input-background: "#F9FAFB"
  ring: "#DC2626"
  background-dark: "oklch(0.145 0 0)"
  card-dark: "oklch(0.145 0 0)"
  foreground-dark: "oklch(0.985 0 0)"
  secondary-dark: "oklch(0.269 0 0)"
  muted-dark: "oklch(0.269 0 0)"
  muted-foreground-dark: "oklch(0.708 0 0)"
  accent-dark: "oklch(0.269 0 0)"
  accent-foreground-dark: "oklch(0.985 0 0)"
  border-dark: "oklch(0.269 0 0)"
  input-dark: "oklch(0.708 0 0)"
  input-background-dark: "oklch(0.269 0 0)"
typography:
  page-title:
    fontFamily: "Roboto, Arial, sans-serif"
    fontSize: 2rem
    fontWeight: 700
    lineHeight: 1.25
  page-title-compact:
    fontFamily: "Roboto, Arial, sans-serif"
    fontSize: 1.5rem
    fontWeight: 700
    lineHeight: 1.35
  section-title:
    fontFamily: "Roboto, Arial, sans-serif"
    fontSize: 1.25rem
    fontWeight: 700
    lineHeight: 1.4
  item-title:
    fontFamily: "Roboto, Arial, sans-serif"
    fontSize: 1rem
    fontWeight: 500
    lineHeight: 1.5
  body:
    fontFamily: "Roboto, Arial, sans-serif"
    fontSize: 1rem
    fontWeight: 400
    lineHeight: 1.5
  body-small:
    fontFamily: "Roboto, Arial, sans-serif"
    fontSize: 0.875rem
    fontWeight: 400
    lineHeight: 1.5
  label:
    fontFamily: "Roboto, Arial, sans-serif"
    fontSize: 0.875rem
    fontWeight: 500
    lineHeight: 1.5
  caption:
    fontFamily: "Roboto, Arial, sans-serif"
    fontSize: 0.75rem
    fontWeight: 400
    lineHeight: 1.5
rounded:
  sm: 6px
  md: 8px
  lg: 10px
  xl: 14px
  full: 9999px
spacing:
  xs: 4px
  sm: 8px
  compact: 12px
  md: 16px
  lg: 24px
  xl: 32px
  section: 48px
components:
  page:
    backgroundColor: "{colors.background}"
    textColor: "{colors.foreground}"
    typography: "{typography.body}"
  card:
    backgroundColor: "{colors.card}"
    textColor: "{colors.foreground}"
    rounded: "{rounded.xl}"
    padding: "{spacing.md}"
  metadata:
    backgroundColor: "{colors.card}"
    textColor: "{colors.muted-foreground}"
    typography: "{typography.body-small}"
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.primary-foreground}"
    typography: "{typography.label}"
    rounded: "{rounded.md}"
    height: 44px
  button-primary-hover:
    backgroundColor: "{colors.primary-hover}"
    textColor: "{colors.primary-foreground}"
  button-secondary:
    backgroundColor: "{colors.secondary}"
    textColor: "{colors.foreground}"
    rounded: "{rounded.md}"
    height: 44px
  input:
    backgroundColor: "{colors.input-background}"
    textColor: "{colors.foreground}"
    typography: "{typography.body}"
    rounded: "{rounded.md}"
    height: 48px
  chip-selected:
    backgroundColor: "{colors.accent}"
    textColor: "{colors.accent-foreground}"
    rounded: "{rounded.full}"
    height: 44px
  error-message:
    backgroundColor: "{colors.card}"
    textColor: "{colors.destructive}"
    typography: "{typography.body-small}"
  page-dark:
    backgroundColor: "{colors.background-dark}"
    textColor: "{colors.foreground-dark}"
    typography: "{typography.body}"
  card-dark:
    backgroundColor: "{colors.card-dark}"
    textColor: "{colors.foreground-dark}"
    rounded: "{rounded.xl}"
    padding: "{spacing.md}"
  metadata-dark:
    backgroundColor: "{colors.card-dark}"
    textColor: "{colors.muted-foreground-dark}"
    typography: "{typography.body-small}"
  button-primary-dark:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.primary-foreground}"
    typography: "{typography.label}"
    rounded: "{rounded.md}"
    height: 44px
  button-primary-hover-dark:
    backgroundColor: "{colors.primary-hover}"
    textColor: "{colors.primary-foreground}"
  button-secondary-dark:
    backgroundColor: "{colors.secondary-dark}"
    textColor: "{colors.foreground-dark}"
    rounded: "{rounded.md}"
    height: 44px
  input-dark:
    backgroundColor: "{colors.input-background-dark}"
    textColor: "{colors.foreground-dark}"
    typography: "{typography.body}"
    rounded: "{rounded.md}"
    height: 48px
  chip-selected-dark:
    backgroundColor: "{colors.accent-dark}"
    textColor: "{colors.accent-foreground-dark}"
    rounded: "{rounded.full}"
    height: 44px
  error-message-dark:
    backgroundColor: "{colors.card-dark}"
    textColor: "{colors.foreground-dark}"
    typography: "{typography.body-small}"
  muted-panel:
    backgroundColor: "{colors.muted}"
    textColor: "{colors.foreground}"
  muted-panel-dark:
    backgroundColor: "{colors.muted-dark}"
    textColor: "{colors.foreground-dark}"
  button-destructive:
    backgroundColor: "{colors.destructive}"
    textColor: "{colors.destructive-foreground}"
    rounded: "{rounded.md}"
    height: 44px
---

# Design System: GrabMeFood

## Overview

**Trạng thái: thiết kế đích đã được người dùng duyệt, chưa triển khai vào giao diện.**
Ngày duyệt: 2026-11-10. Khảo sát mã nguồn, chưa kiểm chứng bố cục bằng trình duyệt.
Định dạng theo `google-labs-code/design.md/docs/spec.md`, phiên bản `alpha`.
YAML là giá trị chuẩn của thiết kế đích, không phải khẳng định CSS hiện tại đã đáp ứng.

**Creative North Star: “Chọn món và quán rõ ràng, dễ so sánh”.**
Gần gũi nhờ ảnh đồ ăn và tiếng Việt, đáng tin nhờ thông tin có ngữ cảnh, dễ dùng nhờ
thao tác ổn định. Tìm kiếm, nội dung và hành động quan trọng có thứ bậc rõ ràng;
không lấy hiệu ứng hay khuyến mãi làm trung tâm.

Áp dụng cho toàn bộ màn hình hiện có theo
`specs/001-desktop-ui-redesign/spec.md`: khám phá, bản đồ, ngẫu nhiên, yêu thích,
chi tiết, tài khoản, cài đặt, hướng dẫn, hỗ trợ, điều khoản, thông báo và trạng thái lỗi.
Phạm vi thiết bị được cập nhật ngày 2026-11-13 theo `specs/002-improve-discovery-ui/spec.md`:
chỉ có bố cục desktop, màn hình hẹp vẫn truy cập bằng cuộn ngang, không có giao diện
mobile riêng hoặc màn hình chặn. Không bỏ màn hình phụ khỏi nghiệm thu.

Người dùng là người dùng tiếng Việt đang chọn món/quán. Không suy diễn độ tuổi,
nghề nghiệp hoặc persona chưa nghiên cứu. Không bắt đăng nhập để tìm kiếm/xem chi tiết.

**Key Characteristics:**
- Desktop-only, hỗ trợ sáng/tối, bàn phím và focus; không tuyên bố đạt reflow khi cuộn ngang.
- Giữ tên, logo, Roboto, bảng màu thương hiệu và nghiệp vụ khám phá.
- Giữ ảnh món/quán, giá–đánh giá–vị trí và insight ngân sách hữu ích.
- Tái sử dụng token và bộ UI hiện có; không tạo hệ theme song song.
- Không thêm dữ liệu, card, nội dung hoặc nút chỉ để lấp khoảng trống.

Cho phép sửa lỗi tìm kiếm/lọc, điều hướng và thao tác trên dữ liệu hiện có; nghiệm thu
riêng với thay đổi trình bày. Chức năng thiếu dịch vụ phải giải thích chưa khả dụng,
không giả lập thành công. Không thêm đặt hàng, thanh toán, giao hàng, dịch vụ xác thực,
geolocation, đồng bộ hoặc chức năng hoàn tác chưa có để làm giao diện có vẻ hoàn chỉnh.

Nguồn đối chiếu: đặc tả đã duyệt, `PRODUCT.md`, constitution, `src/styles/theme.css`,
`src/styles/fonts.css`, `src/app/routes.tsx`, `src/app/components/ui/` và các trang hiện có.
Tài liệu không xác nhận production readiness, quyền dùng ảnh/logo hoặc độ chính xác
của dữ liệu mẫu, và không phải ủy quyền sửa code ứng dụng trong bước lưu tài liệu.

## Colors

### Nhận diện và chức năng

Giữ bảng màu thương hiệu, tên biến và vai trò hiện có trong `src/styles/theme.css`.
Không tạo palette riêng cho từng màn. `primary-hover` dùng sắc đỏ hover đã xuất hiện
trong các trang; không phải bổ sung màu thương hiệu mới.

| Token | Vai trò |
| --- | --- |
| `primary`, `primary-foreground` | Hành động chính và chữ/icon trên nút đỏ |
| `background`, `foreground` | Nền trang, chữ chính, tên món/quán và giá |
| `card`, `popover` | Bề mặt nội dung và lớp nổi; popover dùng giá trị card tương ứng |
| `secondary`, `muted` | Hành động phụ và nền phân vùng |
| `muted-foreground` | Chữ phụ trên nền có tương phản đạt chuẩn |
| `accent`, `accent-foreground` | Lựa chọn nhẹ; không tô nền đỏ đặc mọi danh mục |
| `destructive`, `destructive-foreground` | Lỗi/xóa có nhãn và biểu tượng, không chỉ có màu |
| `border` | Phân cách trang trí, không phải dấu hiệu duy nhất của input |
| `input` | Đường viền điều khiển cần nhận biết |
| `input-background` | Nền trường nhập |
| `ring` | Focus rõ nét, không tự giảm opacity |

Ảnh món là phần giàu màu sắc. Không tô đỏ mọi giá tiền, icon và danh mục cùng lúc.
Giá thông thường dùng chữ chính; không mặc định mỗi mức giá là ưu đãi.

**Quy tắc cặp màu.** Giá trị tính trên màu tĩnh: chữ trắng trên nút đỏ đạt 4.83:1;
`muted-foreground` trên nền trắng đạt 4.83:1 nhưng trên `muted` chỉ đạt 4.43:1.
Trên `muted` dùng `foreground` cho nội dung cần đọc. Placeholder trong input sáng
cũng dùng `foreground` để tránh tự giả định chữ phụ đạt chuẩn trên mọi nền.
Không dùng một semantic token trên mọi nền mà bỏ qua việc kiểm tra cặp màu.

Đỏ thương hiệu trên nền accent nhạt chỉ đạt 4.41:1. Vì vậy `accent-foreground` sáng
được ánh xạ sang màu chữ chính đang có trong palette, thay vì giữ cặp chữ đỏ không
đạt chuẩn. Chip dùng dấu chọn/viền để thể hiện lựa chọn; không thêm một sắc màu mới.

Đề xuất đã duyệt ánh xạ lại `input` từ trong suốt thành màu trung tính đang có trong
palette; theme tối dùng màu từ `muted-foreground` tối. `border` vẫn giữ chức năng phân
cách nhẹ, không thay mọi card bằng viền đậm. Không tự giảm opacity nút đỏ khi hover
làm mất tương phản chữ; dùng `primary-hover`.

### Sáng và tối

Tiếp tục dùng cùng biến semantic qua `:root` và `.dark`, giữ các nền/chữ trung tính tối
hiện có khi đạt tương phản. Các khóa kết thúc `-dark` trong YAML chỉ biểu diễn giá trị
override của cùng token để tài liệu có thể đọc bằng máy; MUST NOT sinh ra hệ CSS
`--*-dark`, bộ theme provider hoặc stylesheet màu thứ hai. Ví dụ `background-dark`
ánh xạ vào chính `--background` trong `.dark`; `card-dark` vào `--card` trong `.dark`.

**Nút chính đỏ–trắng trong cả sáng và tối.** `primary`, `primary-foreground`,
`primary-hover`, `destructive`, `destructive-foreground` và `ring` dùng các giá trị
chung trong YAML. Đây là điều chỉnh semantic đã duyệt, thay cho primary trắng của
`.dark` hiện tại và cặp destructive tối chưa đủ tương phản. Nội dung lỗi trên nền
tối dùng `foreground` cùng nhãn/icon, không ép chữ đỏ nhỏ lên nền tối.

Chữ liên kết trong theme tối dùng `foreground` tương ứng với gạch chân/dấu hiệu chọn;
không dùng đỏ thương hiệu cho chữ nhỏ khi không đạt tương phản. Focus trên nền accent
tối cần chọn `foreground` tương ứng nếu `ring` không đạt 3:1. Dùng màu đang có, không
tự thêm màu. Ảnh giữ màu tự nhiên; logo đặt trên nền đọc rõ, không tự đảo màu.

Component MUST dùng token semantic, không tự chọn `red-*`, `gray-*`, `bg-white` hoặc
`text-black` ở từng trang. Mọi cặp màu không đạt bằng cách phối màu trong palette
được giữ phải trình người dùng trước khi thay giá trị thương hiệu.

**Quy tắc tương phản:** chữ thông thường đạt WCAG AA 4.5:1; chữ lớn đạt 3:1;
điều khiển, dấu chọn và focus indicator đạt 3:1 với nền kề. Kiểm tra cả placeholder,
hover, focus, lỗi và nội dung phủ trên ảnh ở mỗi theme. Không suy ra tương phản trên
ảnh từ một màu nền cố định. Không dùng màu đơn độc để thể hiện lựa chọn hay lỗi.

## Typography

Giữ Roboto đang được nạp trong `src/styles/fonts.css`, dùng các weight thực có
400, 500 và 700. Không thêm font trang trí. Kiểm tra dấu tiếng Việt và fallback khi
Google Fonts bị chặn; không chặn nội dung vì font chưa tải.

- `page-title`: tiêu đề trang desktop, không phải hero marketing khổng lồ.
- `page-title-compact`: tiêu đề khi vùng hiển thị hẹp.
- `section-title`: nhóm nội dung và tiêu đề bộ lọc.
- `item-title`: tên món/quán, được xuống dòng thay vì cắt một dòng mặc định.
- `body`: mô tả, nội dung đọc và giá trị ô nhập.
- `body-small`: metadata phụ và đoạn chú thích ngắn.
- `label`: nút, tab, nhãn trường và điều hướng.
- `caption`: thông tin phụ không thiết yếu; không dùng cho giá, địa chỉ hay thao tác chính.

Các kích thước/weight/line-height nằm trong YAML; `page-title-compact` được giữ như
token lịch sử, không dùng để chuyển sang giao diện mobile. Cỡ chữ được
diễn đạt bằng rem để tôn trọng cài đặt người dùng; root mặc định hiện tại là 16px.

Dùng sentence case; không viết hoa toàn bộ nhãn tiếng Việt. Nội dung dài giới hạn
khoảng 65–75 ký tự mỗi dòng. Không cố định chiều cao khối chữ có thể xuống dòng.
Tên quán trên card được tối đa hai dòng; tên đầy đủ và địa chỉ đầy đủ phải đọc được
ở trang chi tiết, không chỉ qua tooltip hoặc hover.

Giá hiển thị thống nhất theo `vi-VN`, có đơn vị đồng; nêu rõ giá mỗi món hoặc khoảng
giá tham khảo. Khoảng cách dùng m/km nhất quán và có cơ sở vị trí. Điểm số luôn đi kèm
thang điểm và số đánh giá khi có, không chỉ có hình sao. Không thêm dấu “+” vào số
đánh giá chính xác chỉ để làm con số có vẻ lớn hơn.

## Layout

### Desktop-only, không phải giao diện mobile kéo giãn

Các kích thước sau là đề xuất mới, không phải breakpoint đã có trong các trang.
Khung trang tối thiểu 1024 CSS px, nội dung tối đa 1280px căn giữa, gutter 24px.
Màn hình hẹp cuộn ngang để truy cập cùng bố cục desktop. Nhịp khoảng cách dựa trên 4px.

| Thành phần | Quy tắc |
| --- | --- |
| Icon và nhãn | Gap 8px |
| Nội dung card | Padding 16px |
| Nhóm form | Gap 16–24px |
| Lưới card | Gap 24px |
| Các section | Cách nhau 32–48px |
| Nút độc lập | Cao tối thiểu 44px |
| Icon button | Vùng bấm tối thiểu 44×44px |
| Input/select | Cao tối thiểu 48px |

Kích thước điều khiển trong YAML là mức cơ sở, MUST được triển khai như chiều cao
tối thiểu, không cắt nhãn khi xuống dòng hoặc phóng chữ. Tiêu đề, toolbar, card và
phân trang hiện có MUST cùng cạnh căn chỉnh. Form cùng hàng căn label và vùng nhập;
lỗi nhiều dòng không được chồng lên hàng kế tiếp.

| Vùng hiển thị | Bố cục đích |
| --- | --- |
| Từ 1024px | Header desktop, nội dung nhiều cột; lưới card 3 cột, từ 1280px dùng 4 cột. |
| Dưới 1024px | Giữ nguyên bố cục desktop tối thiểu 1024px, cho phép cuộn ngang. |

Desktop: logo ở đầu header; tìm kiếm là vùng trung tâm dễ thấy; tài khoản là đích có
nhãn. Khu vực hiện có được trình bày đúng cơ sở dữ liệu, không tự biến thành tính năng
chọn vị trí mới. Điều hướng chính dùng cùng tên và thứ tự giữa các trang. Không đưa
màn hình đăng nhập lên trước nội dung khám phá.

Trang có nhiều kết quả dùng bộ lọc cạnh trái khoảng 240px khi đủ chỗ; phần còn lại
là danh sách/lưới. Giữ card tối thiểu khoảng 240px trước khi thêm cột; không cố ép
bốn cột khi đang mở bộ lọc. Header, bộ lọc và kết quả dùng cùng cạnh căn chỉnh.
Không kéo ngang dãy card làm cơ chế duy nhất để xem kết quả trên desktop.

Lưới thường có 2–4 cột theo diện tích thực, không theo số lượng mục. Một hoặc hai kết
quả vẫn giữ kích thước hợp lý, được để trống phần còn lại; không phóng card kín màn,
thêm mục trùng, banner hoặc thông báo rỗng chỉ vì chưa đủ một hàng.

Trang đăng nhập/đăng ký dùng khung khoảng 480px; cài đặt/form dài khoảng 720px, không
ép chiều cao để lấp viewport. Điều khoản/hướng dẫn dùng khung đọc theo Typography.
Hồ sơ, thông báo và đánh giá dùng danh sách/nhóm phù hợp, không bắt mọi nội dung thành
card ảnh. Trang hỗ trợ giữ vùng hội thoại và ô nhập trong không gian đọc được;
không tự giả phản hồi từ dịch vụ hỗ trợ chưa có.

Không có thanh điều hướng dưới, header mobile hoặc khoảng bù safe-area dành riêng cho
mobile. Tác vụ lưu/chỉ đường ở gần thông tin món/quán. Vùng cố định không được che
focus hoặc nội dung; nếu vùng hẹp không đủ chỗ cho nút lên đầu thì tạm ẩn nút.

Sheet bộ lọc giữ tiêu đề/đóng ở trên, nội dung cuộn ở giữa, “Đặt lại” và “Áp dụng” ở
dưới. Trên desktop không mở một sheet rộng toàn màn hình. Không cố định cả danh mục,
filter, tab và header thành một khối chiếm phần lớn chiều cao viewport.

Trang chi tiết dùng hai cột cho nội dung món và thông tin quán khi có dữ liệu;
giữ nguyên bố cục đó ở vùng hẹp bằng cuộn ngang. Bản đồ có danh sách cạnh bản đồ,
cho truy cập thông tin mà không bắt buộc thao tác pin. Không bổ sung một
chức năng bản đồ hay vị trí mới để hoàn thiện bố cục. Không che thông tin quán bằng
navigation hoặc các lớp nổi.

**Tiêu chí kiểm tra:** tại 320, 390, 768, 1024 và 1440px, sáng/tối và chữ 100/200%,
cùng bố cục desktop và mọi nội dung/điều khiển truy cập được. Cho phép cuộn ngang khi
thiếu chỗ; focus ngoài vùng nhìn thấy phải cuộn vào vùng thấy được. Không cắt/ẩn nội
dung để che tràn. Không coi cuộn ngang là bằng chứng đạt tiêu chí WCAG reflow.

## Elevation & Depth

Ưu tiên phân nhóm bằng khoảng cách, nền và đường phân cách. Card ở trạng thái nghỉ
dùng viền nhẹ, không cần shadow để chứng minh rằng có thể bấm; tên/link và focus phải rõ.
Shadow chỉ giúp phân biệt lớp nổi: header sticky, menu, sheet và dialog.

- Header nổi: `0 1px 3px rgb(0 0 0 / 0.08)` khi cần tách với nội dung cuộn.
- Menu/dialog: `0 8px 24px rgb(0 0 0 / 0.16)`; không dùng cho từng card trong list.
- Overlay: `rgb(0 0 0 / 0.50)`; dialog tối vẫn cần nền và đường viền để phân biệt lớp.
- Thứ tự lớp: nội dung → header/nav sticky → popover → overlay và dialog trên cùng.
  Dùng portal từ primitive sẵn có, tránh tự tăng `z-index` ở từng màn.

Không dùng gradient trang trí, hover nâng/phóng card, pin nhấp nháy liên tục hoặc
hoạt ảnh quay kéo dài để tạo cảm giác đang xử lý. Chuyển màu/opacity khoảng 150ms
chỉ để phản hồi trạng thái; không có thông tin nào phụ thuộc animation. Tôn trọng
`prefers-reduced-motion`, bỏ chuyển động không thiết yếu và tự động cuộn có hoạt ảnh.

## Shapes

Giữ hệ radius dựa trên `--radius` hiện có: `sm`/`md` cho điều khiển nhỏ, `lg` cho
container chuẩn, `xl` cho card lớn, `full` chỉ cho chip/avatar. Các giá trị YAML
tương ứng thang 6/8/10/14px của theme hiện tại ở root 16px, thay vì trộn nhiều mức
bo tròn tùy ý trong từng trang.

Không biến mọi button thành pill hoặc mọi section thành card lồng card. Ảnh trong
card có crop ổn định, đề xuất 4:3 cho món/quán và thumbnail vuông cho list. Dành sẵn
tỷ lệ ảnh để tránh nhảy bố cục. Crop không được làm mất món chính.

Icon dùng Lucide hiện có, thông thường 20–24px, cùng độ dày nét. Không trộn emoji,
icon nhiều phong cách và icon font cho cùng loại metadata. Icon trang trí ẩn khỏi
screen reader; icon mang chức năng cần tên truy cập rõ ràng.

## Components

### Nguồn tái sử dụng

Ưu tiên `src/app/components/ui/`: `Button`, `Input`, `Card`, `Tabs`, `Sheet`,
`Dialog`, `AlertDialog`, `Checkbox`, `RadioGroup`, `Select`, `Skeleton`, `Tooltip`.
Radix là nền tảng hành vi cho focus, bàn phím và ARIA; vẫn phải cung cấp tên/mô tả
đúng và kiểm thử thực tế. Không thêm MUI hoặc bộ component thứ hai chỉ vì dependency
đã được cài sẵn. Các component nghiệp vụ tiếp tục nằm ngoài thư mục primitive.

Các trang hiện tại chủ yếu tự viết điều khiển. Khi triển khai theo tài liệu này,
chuẩn hóa qua primitive/wrapper thay vì sao chép class. Default `Button` và `Input`
hiện cao 36px: phải bổ sung kích thước phù hợp trước khi coi là tuân thủ đề xuất.
Không gọi đây là công việc đã hoàn thành chỉ vì primitive tồn tại.

### Buttons và liên kết

Mỗi vùng quyết định có một hành động chính rõ ràng; hành động phụ dùng outline/ghost.
Nút thường tối thiểu 44px cao; icon button có vùng bấm tối thiểu 44×44px. Dùng padding
ngang 16px, gap icon/nhãn 8px. Không ép label dài vào `whitespace-nowrap` khi gây tràn.
Link nằm trong đoạn văn được gạch chân hoặc có dấu hiệu nhận biết ngoài màu.

Mọi loại nút có trạng thái default, hover, focus, pressed, disabled và busy khi áp dụng.
Hover không phải phản hồi duy nhất. Focus dùng outline tối thiểu 2px, offset 2px với
`ring`, hoặc `foreground` của theme khi nền thực tế yêu cầu tương phản cao hơn.
Đang xử lý giữ nhãn/ngữ cảnh và báo trạng thái; khóa gửi trùng nhưng không xóa dữ liệu.
Disabled phải có lý do đọc được khi cần. Chức năng chưa tích hợp phải thể hiện chưa
khả dụng; không gắn loading giả hoặc thông báo thành công vào một thao tác không hoạt động.
Nút icon có tên tiếng Việt; dùng `aria-pressed` cho lưu/bỏ lưu. Link để điều hướng,
button để thay đổi trạng thái; không dùng `div onClick` thay cho cả hai.

### Form, tìm kiếm và thông tin khu vực

Label thật đặt trên trường, không bị thay thế bởi placeholder. Label và điều khiển
cùng hàng căn theo quy tắc Layout. Lỗi gắn đúng trường bằng `aria-describedby`, có
`aria-invalid`, không đẩy chồng nội dung hoặc xóa dữ liệu nhập. Giữ khả năng đọc khi
label dài, dịch tiếng Việt và zoom chữ. Input/select dùng chiều cao tối thiểu trong
Layout; textarea có chiều cao theo nội dung và mục đích, không ép về một dòng.

Ô tìm kiếm có label, form submit bằng Enter, nút xóa có tên, và placeholder chỉ là gợi ý.
Không khởi tạo “Phở” như ý định của mọi người dùng. Truy vấn/danh mục được truyền tới
kết quả; URL lưu trạng thái có thể chia sẻ và khôi phục khi quay lại.

Khu vực hiện có phải nêu đúng cơ sở dữ liệu. Khoảng cách mẫu ghi “Khoảng cách minh họa”;
khu vực cố định ghi “Khu vực đang xem”, không ghi “Vị trí hiện tại” hoặc “Gần tôi”.
Không thêm chọn khu vực, geolocation, đồng bộ hoặc dịch vụ xác thực mới để hoàn thiện
form/giao diện. Nơi đang thiếu dịch vụ phải hiển thị chưa khả dụng, không báo đăng nhập,
gửi đánh giá hoặc đồng bộ thành công khi chỉ ghi console hay thay state cục bộ.

### Bộ lọc, chip và tab

Nhóm khoảng cách/ngân sách xuất hiện trước; loại món và ẩm thực mở thêm khi cần.
Việt hóa nhãn. Radio cho chọn một, checkbox cho chọn nhiều; chip lựa chọn có dấu chọn
và trạng thái chương trình đọc được. Tab dùng `Tabs` với điều hướng bàn phím chuẩn.

Phân biệt sắp xếp với lọc: “Giá tăng dần”, “Đánh giá cao” là thứ tự; khoảng giá/khoảng
cách là điều kiện. Hiển thị điều kiện đang áp dụng, số kết quả và cách xóa từng điều kiện.
Nếu dữ liệu không hỗ trợ điều kiện, không trình bày như bộ lọc đang hoạt động.

Trong sheet, thay đổi là bản nháp tới khi “Áp dụng”; đóng/hủy giữ bộ lọc đã áp dụng,
mở lại khôi phục chúng. “Đặt lại” chỉ đặt lại bộ lọc trong phạm vi này, không xóa truy
vấn/khu vực ngoài ý muốn. Desktop có thể dùng cùng mô hình nháp/áp dụng, không tự đổi
ngữ nghĩa vì khác breakpoint.

### Card món/quán và thông tin hỗ trợ quyết định

Từ 2026-11-13 chỉ hiển thị món có quan hệ thực đơn–quán hợp lệ. Thẻ món phải nêu tên
quán và dẫn tới chi tiết món tại quán; giữ dữ liệu món độc lập chưa liên kết nhưng
không render/count. URL món cũ chỉ chuyển hướng qua quan hệ tường minh duy nhất;
không suy ra từ tên hoặc ID. Yêu thích phân biệt theo cặp quán–món.

| Card món | Card quán |
| --- | --- |
| Ảnh → tên món → giá → điểm/số đánh giá | Ảnh → tên quán → khoảng giá → điểm/số đánh giá |
| Thông tin quán bán món nếu có | Địa chỉ/khu vực và khoảng cách nếu có |
| Không ép thêm khoảng cách khi nguồn không có | Không tự suy ra vị trí hay khoảng cách live |

Card cùng loại MUST có thứ tự và định dạng ổn định. Mở đúng bản ghi; không ánh xạ
thay sang một món/quán khác. Dữ liệu thiếu được bỏ hoặc giải thích theo quy tắc chung,
không thay bằng số 0 như dữ liệu thật, số đánh giá giả hay ảnh món khác. Không hy sinh
giá, tên hoặc địa chỉ để hiển thị badge khuyến mãi.
Ảnh có alt phù hợp, kích thước dự phòng và fallback khi lỗi; lazy-load ảnh ngoài màn
đầu, không lazy-load ảnh quan trọng đang nhìn thấy.

Card có link chính rõ; nút lưu tách khỏi link, không lồng button trong anchor và không
tạo nhiều tab stop trùng đích. Badge giảm giá chỉ xuất hiện khi có căn cứ dữ liệu;
không mặc định đẩy “Giảm giá” thành trọng tâm của website khám phá.

Giữ các insight có ích như `MenuBudgetCard`, `ServiceScoreCard` và phân bố đánh giá
khi chúng hỗ trợ lựa chọn. Mỗi insight phải có tóm tắt chữ, đơn vị, nguồn/phạm vi mẫu;
biểu đồ không dùng màu làm kênh duy nhất. Ngân sách mỗi món không được gọi là tổng
chi phí bữa ăn. Không tăng diện tích biểu đồ chỉ để làm trang giống dashboard.

### Điều hướng và hành động theo ngữ cảnh

Giữ các đích Trang chủ, Bản đồ, Ngẫu nhiên, Yêu thích, Tôi ở giai đoạn đề xuất; chưa có
dữ liệu để khẳng định một đích phải được loại bỏ hoặc trở thành quan trọng nhất.
Mọi độ rộng đều dùng header/navigation desktop; không còn navigation mobile/tablet riêng.

Đích đang mở có dấu hiệu ngoài màu và `aria-current="page"`. Chi tiết có nút quay lại
giữ ngữ cảnh kết quả khi có, và đích dự phòng hợp lý khi mở link trực tiếp. Không
đưa mọi nút quay lại về trang chủ làm mất truy vấn/bộ lọc.

Ở chi tiết quán, “Chỉ đường” hiện có nằm cạnh địa chỉ khi hoạt động; “Lưu quán” hiện có
nằm cạnh tên hoặc vùng hành động. Không thêm nút lưu trên mọi card chỉ để cân bố cục.
Không thêm thanh hành động mobile cuối màn.
Chỉ cho phép thao tác được tích hợp thực sự; trạng thái demo phải được nói rõ.

### Dialog, xác nhận và phản hồi

Dùng `Sheet`/`Dialog` cho bộ lọc và hộp thoại hiện có, có tiêu đề, tên nút đóng tiếng Việt,
Escape, focus trap, khóa cuộn nền và trả focus về trigger. Nội dung dài chỉ cuộn phần
thân; thao tác không khuất. Không mở dialog chồng dialog cho tác vụ đơn giản.

Xóa hàng loạt hoặc không thể hoàn tác cần xác nhận cụ thể đối tượng/số lượng bằng
`AlertDialog`, bảo toàn hành vi xác nhận hiện có. Không thêm chức năng “Hoàn tác” nếu
sản phẩm chưa có. Toast bổ sung thông tin, không thay thế thông báo lỗi tại chỗ.

### Trạng thái, khả năng truy cập và theme

| Trường hợp | Cách thể hiện |
| --- | --- |
| Khoảng trắng do ít mục | Giữ khoảng trắng, không thêm thông báo rỗng |
| Thiếu một trường | Xử lý tại trường đó, không biến cả danh sách thành rỗng |
| Không có kết quả | Nêu truy vấn/điều kiện, hướng dẫn sửa hoặc xóa điều kiện đang có |
| Chưa có mục lưu | Giải thích cách lưu bằng thao tác hiện có |
| Đang tải thật | Skeleton giữ cấu trúc, không tạo độ trễ giả |
| Lỗi tải | Giải thích lỗi, giữ dữ liệu nhập; chỉ có “Thử lại” nếu hoạt động |
| Thiếu dịch vụ | Nêu rõ chưa khả dụng, không gọi là lỗi mạng hay kết quả rỗng |

Hướng dẫn phục hồi được phép chỉ là văn bản khi không có hành động thật. Không tự
thêm nút đổi khu vực, thử lại hoặc tính năng mới để đáp ứng một empty state.
Dữ liệu mẫu/chưa tích hợp có nhãn gần nội dung liên quan, không chỉ ở footer.

- Thông báo kết quả/lưu bằng vùng `aria-live="polite"`, không đọc lại toàn trang.
- Form có label thật, lỗi gắn trường bằng `aria-describedby`, dùng `aria-invalid`;
  không báo gửi thành công khi chỉ ghi console hoặc xóa nội dung local.
- Có skip link tới `main`, thứ tự heading hợp lý, DOM theo thứ tự đọc; không sửa
  thứ tự tab bằng `tabindex` dương. Hover tooltip không chứa thông tin thiết yếu.
- Tất cả thao tác phải dùng được bằng bàn phím, có tên truy cập và focus không bị
  header/nav che. Overlay quản lý focus hợp lệ, không tạo bẫy không thể thoát.
- Mỗi trạng thái lỗi/chọn cần nhãn, biểu tượng hoặc cấu trúc ngoài màu; cả chữ thường,
  chữ lớn, ranh giới điều khiển và focus phải đạt ngưỡng tương phản trong Colors.
- Theme gồm Sáng/Tối/Theo hệ thống; chỉ lựa chọn cuối theo `prefers-color-scheme`.
  Lựa chọn thủ công được ghi nhớ trên thiết bị; tránh chớp theme sai lúc khởi động.
  Các component và trang đều phải đổi theme, không chỉ màn cài đặt.
- Bản đồ bên thứ ba không hỗ trợ theme phải được đóng khung và ghi đúng khả năng;
  không dùng CSS invert làm sai màu/nhãn. Pin cần tên, selection và danh sách thay
  thế; không đặt pin bằng tọa độ phần trăm để giả vờ gắn với tọa độ địa lý thật.

## Do's and Don'ts

### Do

- Dùng YAML làm giá trị đích; khi triển khai ánh xạ vào token và primitive hiện có.
- Ưu tiên tìm kiếm, thông tin so sánh và khả năng phục hồi trước hiệu ứng.
- Giữ nhận diện đỏ, ảnh món và tiếng Việt; dùng màu có tiết chế và có ý nghĩa.
- Thiết kế đầy đủ sáng/tối và kiểm tra riêng từng theme, kể cả lỗi và overlay.
- Kiểm thử bàn phím, screen reader, zoom, cuộn ngang truy cập được, focus và tiếng Việt dài.
- Ghi rõ kiểm tra nào đã chạy. Lint tài liệu không chứng minh UI đạt WCAG hoặc responsive.
- Khi thiếu dữ liệu ưu tiên, đo/kiểm chứng giả định thay vì tạo persona hoặc mục tiêu giả.
- Tách nghiệm thu sửa lỗi hành vi với thay đổi trình bày trên toàn bộ màn hình hiện có.

### Don't

- Không coi code hiện tại, default thư viện hoặc bảng dark có sẵn là chuẩn đúng mặc định.
- Không thêm giỏ hàng, thanh toán, phí giao hàng hoặc CTA đặt món vào sản phẩm khám phá.
- Không bắt đăng nhập để xem món/quán; không hứa đồng bộ tài khoản khi chưa có tích hợp.
- Không gọi mock map, khoảng cách mẫu, đánh giá hoặc lưu local là dịch vụ live đã kiểm chứng.
- Không dùng chữ 12px/xám nhạt cho nội dung quyết định, hoặc màu đỏ làm dấu hiệu duy nhất.
- Không cố nhét desktop vào một cột mobile hẹp hay kéo giãn card 160px khắp màn hình lớn.
- Không thêm animation nổi bật, confetti, auto-carousel, gradient trang trí hoặc pin nhấp nháy.
- Không thêm một thư viện UI mới, token một lần dùng hoặc class màu hardcode khi đã có vai trò tương ứng.
- Không tạo hệ theme song song hoặc đổi framework để thực hiện thiết kế này.
- Không thêm nội dung/nút để cân hàng, giả thành công, hoặc dùng `overflow-x-hidden`
  trên toàn trang để che nguyên nhân gây tràn và làm mất nội dung/focus.

**Ngoài phạm vi đợt thiết kế:** nguồn dữ liệu hoặc khu vực hỗ trợ mới, dịch vụ đồng bộ,
xác thực/gửi đánh giá production và bổ sung tính năng. Quyền dùng ảnh/logo và yêu cầu
production không được suy ra từ việc duyệt tài liệu. Thay đổi giao diện cần bước lập
kế hoạch và triển khai riêng theo đặc tả đã duyệt; tài liệu này chưa chứng minh UI đạt chuẩn.
