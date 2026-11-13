# Feature Specification: Cải thiện giao diện khám phá GRABMEFOOD

**Feature Branch**: `002-improve-discovery-ui` (nhánh hiện tại được xác minh khi làm rõ; không tạo/chuyển nhánh)

**Created**: 2026-11-11

**Status**: Implemented and verified — kết quả và giới hạn kiểm chứng tại [validation.md](validation.md)

**Input**: User description: "Cải thiện footer, nút lên đầu trang, avatar trong header và thẻ món/quán trên website GRABMEFOOD hiện có; đơn giản, nhất quán, tái sử dụng dữ liệu thật sự có trong dự án, không bịa thông tin; bước này chỉ tạo đặc tả."

**Scope update (2026-11-13)**: Chủ sản phẩm chọn cập nhật đặc tả này thay vì tạo tính năng mới: giữ yêu cầu footer/avatar và thẻ khám phá, bổ sung chỉ hỗ trợ giao diện desktop, bỏ giao diện mobile và thay chi tiết món độc lập bằng chi tiết món tại quán. Màn hình hẹp vẫn hiển thị bố cục desktop, cho phép cuộn ngang, không chặn truy cập. Món chưa có quan hệ quán hợp lệ không được hiển thị, nhưng giữ dữ liệu nguồn. URL món độc lập cũ chỉ chuyển hướng khi nguồn xác định duy nhất một món tại quán; nếu không, hiển thị trạng thái không xác định được món tại quán kèm liên kết tìm kiếm.

## Clarifications

### Session 2026-11-13

- Q: Bạn muốn cập nhật đặc tả hiện tại để bao gồm yêu cầu chỉ hỗ trợ desktop và thay chi tiết món bằng chi tiết món tại quán, hay tách thành tính năng mới? → A: Cập nhật đặc tả 002 hiện tại, giữ yêu cầu footer/avatar và bổ sung thay đổi desktop, món tại quán.
- Q: Khi mở website ở cửa sổ hẹp hoặc trên điện thoại, bạn muốn website hiển thị thế nào? → A: Luôn hiển thị bố cục desktop; cho phép cuộn ngang ở cửa sổ hẹp, không có giao diện mobile riêng và không chặn truy cập.
- Q: Với món chưa có thông tin liên kết tới quán cụ thể, bạn muốn xử lý thế nào? → A: Không hiển thị món chưa liên kết quán; giữ dữ liệu nguồn để bổ sung sau, không tự gán quán.
- Q: Khi người dùng mở liên kết chi tiết món cũ dạng `/dish/:id`, bạn muốn website xử lý thế nào? → A: Chỉ chuyển tới chi tiết món tại quán nếu dữ liệu xác định duy nhất một quan hệ hợp lệ; nếu thiếu hoặc có nhiều lựa chọn, báo không xác định được món tại quán và có liên kết tìm kiếm.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Khám phá món và so sánh quán (Priority: P1)

Người xem chỉ thấy món có quan hệ quán hợp lệ trong nguồn, biết món thuộc quán nào và mở đúng chi tiết món tại quán để lựa chọn nơi ăn.

**Why this priority**: Đây là nhu cầu chính của website khám phá; thông tin rõ ràng quan trọng hơn số lượng thẻ.

**Independent Test**: Mở trang chủ, đối chiếu từng thẻ mới với nguồn có sẵn, mở chi tiết và quay lại. Có thể nghiệm thu mà chưa thay footer hoặc avatar.

**Acceptance Scenarios**:

1. **Given** dữ liệu thực đơn hiện có, **When** xem trang chủ, **Then** có một nhóm “Món từ thực đơn quán” sau “Món ngon hôm nay” nếu nhóm hôm nay còn món hợp lệ, hoặc ở vị trí ngay sau nhóm quán phía trước nếu nhóm hôm nay bị ẩn; hiển thị tối đa 3 món chưa xuất hiện trên trang, có tên quán và giá từ đúng bản ghi; nhóm nêu rõ dữ liệu minh họa.
2. **Given** một thẻ món hoặc quán, **When** mở thẻ bằng chuột hoặc bàn phím, **Then** thẻ món tới đúng chi tiết món tại quán, thẻ quán tới đúng chi tiết quán, không sang bản ghi khác; quay lại vẫn về đúng ngữ cảnh khám phá theo hành vi hiện có.
3. **Given** các quán mẫu đã xuất hiện hết ở trang chủ, **When** bổ sung nhóm món, **Then** các nhóm quán và liên kết “Xem thêm” hiện có vẫn dùng được; không tạo thêm quán hay nhân bản thẻ quán để lấp hàng.
4. **Given** nguồn chỉ có dữ liệu mẫu, **When** đọc thông tin giá, điểm, khoảng cách hoặc ưu đãi, **Then** nhận biết được chúng chưa được xác minh, không thấy lời hứa giao hàng hoặc dữ liệu mới tự suy diễn.
5. **Given** nguồn có món chưa liên kết quán hoặc tham chiếu tới quán/món không tồn tại, **When** xem trang chủ, kết quả tìm kiếm, gợi ý ngẫu nhiên, yêu thích hoặc danh sách món khác, **Then** các món đó không xuất hiện, không được tính vào số kết quả hoặc được chọn ngẫu nhiên; dữ liệu nguồn không bị xóa hoặc tự gán quán.
6. **Given** sau khi loại món không hợp lệ một nhóm món hoặc danh sách không còn mục, **When** xem trang, **Then** nhóm món trang chủ không còn mục được ẩn, danh sách tìm kiếm/yêu thích/ngẫu nhiên có trạng thái rỗng phù hợp và đích khám phá còn hoạt động; không bổ sung món giả để lấp chỗ.
7. **Given** URL cũ `/dish/:id` có đúng một quan hệ món–quán hợp lệ được nguồn xác định, **When** mở trực tiếp, **Then** chuyển tới `/restaurant/:restaurantId/dish/:dishId` tương ứng và hiển thị đúng món, quán; không giữ giao diện chi tiết món độc lập.
8. **Given** URL cũ không có quan hệ hợp lệ, có nhiều quan hệ hợp lệ hoặc ID không tồn tại, **When** mở trực tiếp, **Then** thấy thông báo không xác định được món tại quán và liên kết `/search`, không chuyển tới món/quán bất kỳ. URL món tại quán có quán hoặc món không tồn tại hiển thị trạng thái không tìm thấy với liên kết tìm kiếm.
9. **Given** hai quán có món trùng ID, **When** lưu hoặc bỏ lưu một món tại quán, **Then** chỉ trạng thái của cặp quán–món đó thay đổi; mở món yêu thích luôn tới đúng quán.

---

### User Story 2 - Tìm thông tin và kênh hỗ trợ ở cuối trang (Priority: P2)

Người dùng đi tới cuối trang để hiểu GrabMeFood, tìm hướng dẫn, điều khoản và nhận biết thông tin liên hệ nào chưa được chủ website cung cấp.

**Why this priority**: Footer giúp tìm thông tin đáng tin cậy nhưng không được tạo cảm giác có dịch vụ hoặc thông tin pháp lý đã xác minh khi chưa có.

**Independent Test**: Từ một trang khám phá, đi tới footer, đọc đủ các nhóm và kiểm tra từng liên kết, không cần thẻ mới hoặc avatar.

**Acceptance Scenarios**:

1. **Given** một trang có footer trong phạm vi, **When** cuộn cuối trang, **Then** thấy các nhóm Giới thiệu, Liên hệ, Hỗ trợ khách hàng, Điều khoản, Quyền riêng tư, Mạng xã hội và dòng bản quyền.
2. **Given** các đích đã có, **When** mở “Hướng dẫn”, “Trung tâm hỗ trợ” hoặc “Điều khoản sử dụng”, **Then** tới lần lượt `/settings/guide`, `/settings/support`, `/settings/terms`; nhãn hỗ trợ nói rõ chưa kết nối dịch vụ gửi tin.
3. **Given** chưa có địa chỉ liên hệ, email, điện thoại, tài khoản mạng xã hội hoặc chính sách riêng tư độc lập được xác nhận, **When** đọc footer, **Then** thấy từng mục “Cần bổ sung”, không có liên kết giả, liên kết trống hoặc thao tác gửi không hoạt động.
4. **Given** phần quyền riêng tư hiện nằm trong điều khoản, **When** mở “Quyền riêng tư — trong điều khoản”, **Then** tới `/settings/terms`; không được gọi đây là chính sách riêng tư độc lập đã hoàn thiện.

---

### User Story 3 - Quay lại đầu trang thuận tiện (Priority: P2)

Người dùng đã cuộn trang dài có thể trở lại đầu trang mà không phải kéo thủ công, kể cả khi dùng bàn phím hoặc cần giảm chuyển động.

**Why this priority**: Giảm thao tác trên trang dài mà không cản nội dung hay điều hướng.

**Independent Test**: Với một trang dài trong phạm vi, kiểm tra trước/sau ngưỡng cuộn, kích hoạt bằng bàn phím và bật thiết lập giảm chuyển động.

**Acceptance Scenarios**:

1. **Given** vị trí cuộn không quá 400 CSS px, **When** xem hoặc dùng Tab, **Then** nút chưa xuất hiện và không nhận focus; khi vượt 400 CSS px nút mũi tên lên xuất hiện ở góc dưới bên phải.
2. **Given** nút đang hiện, **When** kích hoạt bằng Enter hoặc Space, **Then** trở lại đầu trang; focus chuyển tới điểm bắt đầu nội dung chính nhìn thấy được, không rơi vào nút vừa ẩn hoặc mất dấu vị trí.
3. **Given** người dùng chọn giảm chuyển động, **When** kích hoạt nút, **Then** trở về đầu trang ngay, không có hoạt ảnh cuộn hoặc chuyển động xuất hiện/biến mất không thiết yếu.
4. **Given** footer, hộp thoại hoặc thao tác cố định khác đang hiện, **When** cuộn hay thao tác, **Then** nút không che nội dung hoặc điều khiển; nếu không đủ chỗ an toàn, nút tạm ẩn và trở lại khi hết xung đột.

---

### User Story 4 - Truy cập khu vực tài khoản từ header (Priority: P2)

Người dùng nhận biết điểm vào tài khoản ở góc trên bên phải header, không nhầm hồ sơ mẫu thành tài khoản đã đăng nhập.

**Why this priority**: Tạo điểm truy cập dễ nhận biết tới hồ sơ minh họa, đồng thời phân biệt rõ trạng thái khách với tài khoản đã xác thực.

**Independent Test**: Kiểm tra avatar ở desktop và đối chiếu hành vi với hai quyết định được xác nhận trong FR-011, FR-012; không cần triển khai xác thực mới.

**Acceptance Scenarios**:

1. **Given** avatar trong header, **When** kích hoạt bằng chuột hoặc bàn phím, **Then** tới `/profile`, nơi vẫn ghi rõ hồ sơ minh họa và chưa có tài khoản xác thực; không tự tạo dashboard hoặc chuyển sang đăng nhập.
2. **Given** chưa có tài khoản xác thực, **When** xem header, **Then** thấy biểu tượng người dùng trung tính với nhãn truy cập “Tài khoản — chưa xác thực; xem hồ sơ minh họa”, kèm chữ “Chưa xác thực” nhìn thấy được; không dùng ảnh và tên người trong hồ sơ mẫu làm danh tính hiện tại.
3. **Given** màn hình desktop hoặc phóng chữ 200% trên desktop, **When** dùng header, **Then** avatar còn thấy và dùng được, tìm kiếm và điều hướng hiện có không mất hoặc bị cắt.
4. **Given** cửa sổ hẹp hoặc điện thoại, **When** mở website, **Then** vẫn thấy bố cục desktop, không có thanh điều hướng dưới hoặc màn hình chặn truy cập; có thể cuộn ngang và dùng bàn phím để tới những điều khiển ngoài vùng đang thấy.

### Edge Cases

- Trang ngắn hoặc vừa thay đổi độ rộng: nút lên đầu trang chỉ hiện nếu vị trí cuộn thực vượt ngưỡng; không dựa vào trạng thái cũ của trang trước.
- Footer tiến vào vùng nút nổi: ưu tiên nội dung/footer; ẩn nút trong lúc có nguy cơ che phủ, không chỉ tăng lớp hiển thị của nút.
- Menu/hộp thoại đang mở: nút lên đầu trang không nhận focus ngoài vùng tương tác được phép; không vượt lên trên hộp thoại.
- Thiếu/lỗi ảnh: giữ vùng ảnh ổn định, mô tả đúng món/quán và có trạng thái ảnh chưa khả dụng; không thay bằng ảnh món khác.
- Thiếu giá: ghi “Chưa có giá”; thiếu loại món: bỏ trường đó, không đoán từ tên hay ảnh. Món thiếu quan hệ quán hợp lệ hoặc không xác định được tên quán không được hiển thị. Không thay điểm đánh giá thiếu bằng 0.
- Tên món/quán dài, thông tin nhiều dòng: giữ thứ bậc và nội dung đọc được; tên đầy đủ có ở trang chi tiết, không chỉ qua hover.
- Không còn món hợp lệ để bổ sung: không lặp món hay tạo dữ liệu; ẩn nhóm món trang chủ không còn mục. Có 1–2 món thì chỉ hiện số đó, không lấp đủ 3. Danh sách tìm kiếm/yêu thích/ngẫu nhiên không còn món hiển thị trạng thái rỗng phù hợp, không giả lỗi dịch vụ.
- Món từng nằm trong yêu thích nhưng không có quan hệ quán hợp lệ: không hiển thị hoặc tính vào số món yêu thích; không xóa bản ghi nguồn hay tự chuyển sang món khác.
- URL cũ có nhiều quán hợp lệ: không tự chọn quán đầu tiên. Chỉ chuyển hướng khi nguồn xác định duy nhất một cặp quán–món hợp lệ; không ánh xạ bằng ID trùng giữa hai loại bản ghi, tên hoặc ảnh tương tự. URL đích không tồn tại hoặc quan hệ sai hiển thị không tìm thấy, không lặp chuyển hướng.
- Giá hoặc đánh giá giữa các bản ghi cũ không đồng nhất: thẻ dùng đúng bản ghi đích, không tự hợp nhất số liệu để tạo vẻ thống nhất; ghi nhận chênh lệch để xử lý riêng.
- Không có kênh liên hệ thật: footer giữ nhãn bổ sung rõ ràng; không dùng địa chỉ quán ăn trong danh mục làm địa chỉ doanh nghiệp GrabMeFood.
- Chưa có xác thực thật: chỉ nghiệm thu trạng thái khách và điều hướng đã duyệt; trường hợp tài khoản xác thực là phụ thuộc tương lai, không mô phỏng đăng nhập thành công.
- Cửa sổ hẹp hoặc zoom làm giảm vùng hiển thị: giữ bố cục desktop và cho phép cuộn ngang để đọc nội dung, tới điều khiển; không cắt nội dung để che tràn, không chặn bằng thông báo dùng máy tính. Khi Tab tới điều khiển ngoài vùng đang thấy, điều khiển và focus phải cuộn vào vùng nhìn thấy, không bị lớp cố định che.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Phải giữ phạm vi khám phá món/quán và đánh giá, tiếng Việt, thương hiệu và các tác vụ không bị thay thế bởi phạm vi mới. Giữ URL hiện có; URL `/dish/:id` chỉ là điểm vào tương thích theo FR-019, không còn giao diện chi tiết món độc lập. Không thêm đặt món, giỏ hàng, thanh toán, giao hàng, tích hợp xác thực hay dịch vụ mới. Giữ nhận diện hiện có; phạm vi mở rộng gồm bỏ giao diện mobile và thay chi tiết món độc lập bằng chi tiết món tại quán, không thiết kế lại các chức năng không liên quan.
- **FR-002**: Footer phải nằm sau nội dung trên các trang hiện có thuộc khám phá, chi tiết, yêu thích, hồ sơ/đánh giá, thông báo và cài đặt. Không bổ sung vào `/welcome`, `/onboarding`, `/login`, `/register` hoặc trang lỗi trong đợt này. Footer không cố định đè lên nội dung, có đủ 7 nhóm/dòng trong Story 2, đọc được trong bố cục desktop.
- **FR-003**: Giới thiệu phải mô tả đúng GrabMeFood là website khám phá món và quán, không quảng cáo đặt/giao món. Chỉ dùng các đích thật `/settings/guide`, `/settings/support`, `/settings/terms` cho nhóm phù hợp. Đường dẫn mở trang hỗ trợ được phép hoạt động, nhưng thao tác gửi tin chưa có dịch vụ phải tiếp tục vô hiệu hóa và giải thích lý do.
- **FR-004**: Liên hệ phải đánh dấu riêng “Email — Cần bổ sung”, “Số điện thoại — Cần bổ sung”, “Địa chỉ đơn vị vận hành — Cần bổ sung”. Mạng xã hội ghi “Liên kết mạng xã hội chính thức — Cần bổ sung”. Quyền riêng tư ghi “Chính sách riêng tư độc lập — Cần bổ sung” kèm liên kết rõ nghĩa tới phần điều khoản đang có. Không bịa địa chỉ, số điện thoại, giấy phép, email, mạng xã hội hoặc URL. Mục thiếu không phải liên kết bấm được.
- **FR-005**: Dòng bản quyền được dùng tên GrabMeFood và năm hiện tại, không tự ghi năm thành lập, pháp nhân, số đăng ký hoặc giấy phép; kèm “Chủ thể sở hữu/đơn vị vận hành — Cần xác nhận”. Không coi nội dung pháp lý mẫu hiện có là bằng chứng đã phê duyệt pháp lý.
- **FR-006**: Nút lên đầu trang phải dùng mũi tên hướng lên, tên truy cập tiếng Việt “Lên đầu trang”, vùng bấm ít nhất 44 × 44 CSS px và focus rõ; dùng được bằng Tab, Enter và Space. Ẩn hoàn toàn khỏi tương tác khi chưa vượt ngưỡng cuộn 400 CSS px.
- **FR-007**: Khi hiện, nút phải cố định ở góc dưới bên phải, cách rìa vùng an toàn và điều khiển cố định khác ít nhất 16 CSS px. Không che nội dung đọc, footer hoặc phần tử đang focus. Phải dành chỗ hoặc tạm ẩn khi xung đột; tạm ẩn trong lúc footer hiển thị nếu không bảo đảm khoảng trống. Áp dụng cho các trang cùng phạm vi footer.
- **FR-008**: Kích hoạt nút phải đưa người dùng về đầu trang và focus tới đầu nội dung chính nhìn thấy được; không xóa trạng thái tìm kiếm, lọc hay yêu thích. Giảm chuyển động phải tắt hoạt ảnh cuộn; sau khi về đầu, nút ẩn và không giữ focus vô hình.
- **FR-009**: Header hiện có phải có điểm vào tài khoản dạng avatar ở phía trên bên phải trên các trang cùng phạm vi footer. Avatar có tên truy cập thể hiện đích/trạng thái, vùng bấm ít nhất 44 × 44 CSS px, focus rõ và phương án dự phòng khi thiếu/lỗi ảnh. Không suy ra ảnh, tên hoặc phiên đăng nhập từ hồ sơ minh họa.
- **FR-010**: Chỉ duy trì giao diện desktop, bỏ giao diện mobile và thanh điều hướng dưới. Điều hướng desktop phải giữ khả năng truy cập logo, tìm kiếm, thông tin khu vực và các đích Trang chủ, Bản đồ, Ngẫu nhiên, Yêu thích, Tôi; không bỏ tác vụ sẵn có không liên quan. Trên cửa sổ hẹp và điện thoại vẫn hiển thị bố cục desktop, cho phép cuộn ngang nếu thiếu chỗ; không có màn hình chặn truy cập hoặc tự chuyển sang giao diện mobile.
- **FR-011**: Avatar phải dẫn tới `/profile`, trang hồ sơ minh họa hiện có, theo xác nhận Q1: A của chủ sản phẩm. Không tạo dashboard riêng và không chuyển điểm truy cập này sang `/settings/account` hoặc `/login`.
- **FR-012**: Khi chưa có tài khoản xác thực, avatar phải dùng biểu tượng người dùng trung tính, vẫn cho phép mở `/profile`, theo xác nhận Q2: A. Nhãn truy cập là “Tài khoản — chưa xác thực; xem hồ sơ minh họa”; chữ “Chưa xác thực” phải nhìn thấy được trong cụm tài khoản desktop. Trang đích tiếp tục nêu rõ hồ sơ minh họa. Không dùng ảnh/tên mẫu như danh tính hiện tại, không giả lập đăng nhập thành công và không thêm xác thực trong tính năng này.
- **FR-013**: Trang chủ phải giữ các nhóm quán và nhóm món còn bản ghi hợp lệ, đồng thời thêm tối đa 3 món từ thực đơn quán hiện có trong nhóm riêng sau “Món ngon hôm nay” nếu nhóm đó còn mục, hoặc ngay sau nhóm quán phía trước nếu nhóm hôm nay bị ẩn. Chọn theo thứ tự nguồn ổn định, bỏ trùng theo đích chi tiết, chỉ dùng quan hệ món–quán được khai báo. Ẩn nhóm món không còn mục; không suy ra quán cho món độc lập.
- **FR-014**: Vì trang chủ đã hiển thị toàn bộ quán của nguồn hiện tại, phải cải thiện/giữ nhất quán các thẻ quán đó, không thêm bản ghi hay lặp thẻ để tăng số lượng. Bổ sung thẻ quán mới chỉ khi chủ website cung cấp bản ghi có nguồn và đích chi tiết hợp lệ; đây là phụ thuộc nội dung, không phải quyền tạo dữ liệu mới trong đợt này.
- **FR-015**: Thẻ món phải có vùng ảnh, tên, giá hoặc khoảng giá đúng nguồn (hoặc “Chưa có giá”), tên quán và đích chi tiết món tại quán hợp lệ; thẻ quán có vùng ảnh, tên, loại món và thông tin lựa chọn sẵn có. Không thêm điểm, số đánh giá, khoảng cách, thời gian giao hoặc ưu đãi không có nguồn. Số liệu mẫu nếu giữ phải được nhận biết là mẫu ngay trong nhóm liên quan, không chỉ ở footer; không chuyển thành tuyên bố dữ liệu thật.
- **FR-016**: Thẻ cùng loại phải đồng nhất về tỷ lệ ảnh 4:3, thứ tự thông tin, khoảng cách, kiểu chữ và cách mở chi tiết, theo nhận diện hiện có ở cả sáng/tối. Giá dùng định dạng tiếng Việt, không biến giá thường thành khuyến mãi; không thêm hiệu ứng trang trí, tự chạy hoặc thư viện mới để đạt yêu cầu.
- **FR-017**: Mỗi thẻ có một điểm điều hướng chính rõ ràng, dùng được bằng bàn phím, không tạo các điểm Tab trùng đích; hành động phụ hiện có phải độc lập và không kích hoạt nhầm chi tiết. Ảnh có mô tả đúng nội dung và xử lý lỗi như Edge Cases.
- **FR-018**: Các phần thay đổi phải được kiểm tra tại 1024 và 1440 CSS px cho desktop, 320, 390 và 768 CSS px để xác minh vẫn giữ bố cục desktop ở vùng hẹp, ở cả sáng/tối và khi phóng chữ 100%/200%. Cho phép cuộn ngang khi thiếu chỗ, nhưng mọi nội dung và điều khiển phải truy cập được, không bị cắt hoặc lớp cố định che; focus phải cuộn vào vùng nhìn thấy. Không yêu cầu bố cục mobile riêng. Chữ thường đạt tương phản 4.5:1; chữ lớn, ranh giới điều khiển và dấu focus đạt 3:1. Không phụ thuộc hover hoặc màu đơn độc để hiểu thao tác.
- **FR-019**: Thay giao diện chi tiết món độc lập bằng chi tiết món tại quán ở `/restaurant/:restaurantId/dish/:dishId`; chỉ mở bản ghi khi quan hệ món–quán được nguồn xác định và quán, món đích tồn tại. Mọi liên kết món mới phải dùng đích món tại quán. Giữ `/dish/:id` làm điểm vào tương thích: chỉ chuyển hướng nếu dữ liệu xác định duy nhất một cặp quán–món hợp lệ; nếu không có quan hệ, có nhiều quan hệ hoặc ID không tồn tại, hiển thị thông báo không xác định được món tại quán kèm liên kết `/search`. Đích món tại quán không tồn tại hiển thị không tìm thấy kèm liên kết tìm kiếm. Không tự gán quán dựa trên tên, ảnh, ID trùng hoặc chọn kết quả đầu tiên; không có vòng lặp chuyển hướng.
- **FR-020**: Món không có quan hệ quán hợp lệ hoặc không xác định được tên quán phải bị loại khỏi mọi danh sách hiển thị, kết quả tìm kiếm, tập gợi ý ngẫu nhiên, yêu thích và số lượng tương ứng. Giữ dữ liệu nguồn, không xóa bản ghi hoặc tự gán quán. Chỉ hiển thị món có thể mở đúng chi tiết món tại quán; áp dụng trạng thái rỗng theo Story 1 khi không còn mục.

### Key Entities *(include if feature involves data)*

- **Mục thông tin footer**: Nhóm, nhãn tiếng Việt, nội dung có căn cứ, đích có thật nếu có, trạng thái cần bổ sung/xác nhận; không mang thông tin pháp nhân chưa được cung cấp.
- **Món tại quán**: Danh tính gồm cặp quán–món và đích chi tiết tương ứng, tên món, ảnh, giá/khoảng giá, tên quán, các trường lựa chọn được nguồn cung cấp và trạng thái dữ liệu mẫu/chưa xác minh. Quan hệ quán phải được khai báo và đích quán/món phải tồn tại để được hiển thị; không hợp nhất hai món chỉ vì trùng ID hoặc tên ở hai quán. Lưu/bỏ lưu yêu thích phải phân biệt đúng cặp quán–món.
- **Quán ăn khám phá**: Danh tính và đích chi tiết, tên, ảnh, loại món, khoảng giá và metadata có nguồn; không đồng nhất sự hiện diện trong dự án với tính chính xác ngoài thực tế.
- **Điểm vào tài khoản**: Đích đã duyệt, nhãn truy cập, trạng thái khách hoặc tài khoản được xác thực nếu thực sự có; không tạo bản sao danh tính người dùng.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% footer trong phạm vi có đủ 7 nhóm/dòng quy định; 100% liên kết bấm được tới đích hiện có; không có email, điện thoại, địa chỉ, giấy phép hoặc mạng xã hội tự tạo. Mọi thông tin còn thiếu có nhãn bổ sung/xác nhận.
- **SC-002**: Trong toàn bộ ca thử đầu trang, cuộn trên/dưới 400 CSS px, cuối trang và mở hộp thoại, nút lên đầu trang có trạng thái hiện/ẩn đúng; mỗi lần kích hoạt bằng chuột/Enter/Space đều đưa tới đầu trang và vị trí focus nhìn thấy. Khi chọn giảm chuyển động, không có hoạt ảnh cuộn.
- **SC-003**: Tại 320, 390, 768, 1024 và 1440 CSS px, ở 2 theme và mức phóng chữ 100%/200%, website chỉ hiển thị bố cục desktop, không có thanh điều hướng dưới hoặc màn hình chặn truy cập. Cho phép cuộn ngang nếu thiếu chỗ; 100% nội dung và điều khiển vẫn truy cập được, focus ngoài vùng đang thấy cuộn vào vùng nhìn thấy và không bị avatar, nút lên đầu hoặc lớp cố định che. Không mất tác vụ điều hướng sẵn có không bị thay thế bởi phạm vi mới.
- **SC-004**: Với nguồn hiện có đủ món hợp lệ, trang chủ có đúng 3 thẻ món bổ sung, không trùng đích với món đã hiện; 100% thẻ mới có đích chi tiết món tại quán đúng và giá/tên quán khớp nguồn. Số thẻ quán không tăng bằng cách nhân bản hoặc bịa bản ghi.
- **SC-005**: 100% ca kiểm tra avatar ở trạng thái khách hiển thị biểu tượng trung tính, chữ “Chưa xác thực” và nhãn truy cập đã quy định; kích hoạt luôn mở `/profile`, nơi ghi rõ hồ sơ minh họa. Không ca nào thể hiện đăng nhập thành công hoặc chuyển sang đích khác.
- **SC-006**: Một người kiểm thử chỉ dùng bàn phím có thể hoàn thành cả 4 hành trình độc lập mà không bị bẫy focus; các nhãn đọc bằng công nghệ hỗ trợ phân biệt được tài khoản, lên đầu trang và đích thẻ. Người kiểm thử nhận biết rõ nguồn mẫu và dịch vụ chưa khả dụng mà không phải tìm thông tin ở footer.
- **SC-007**: Trong toàn bộ danh sách món hiển thị, tìm kiếm, gợi ý ngẫu nhiên và yêu thích, 100% món có quan hệ quán hợp lệ và mở đúng chi tiết món tại quán; món thiếu quan hệ không xuất hiện hoặc được tính vào số lượng. Khi không còn món, các trạng thái rỗng/ẩn nhóm theo Story 1 hoạt động; dữ liệu nguồn của món bị loại vẫn nguyên vẹn. Lưu/bỏ lưu một món tại quán không thay đổi trạng thái món khác có ID trùng ở quán khác.
- **SC-008**: 100% ca URL cũ có đúng một quan hệ hợp lệ chuyển tới đúng món tại quán; các ca thiếu quan hệ, nhiều quan hệ và ID không tồn tại đều có thông báo cùng liên kết tìm kiếm và không chuyển sai bản ghi. URL món tại quán sai quan hệ hoặc không tồn tại không hiển thị món thay thế. Không còn giao diện chi tiết món độc lập hoặc liên kết món mới tới `/dish/:id`, không có vòng lặp chuyển hướng.

## Assumptions

- **Phạm vi sản phẩm đã xác nhận**: Cụm “website đặt món” trong mô tả footer được hiểu là nhóm thông tin quen thuộc của website ẩm thực, không thay đổi phạm vi khám phá/đánh giá đã ghi trong README, PRODUCT và constitution. Không bổ sung nghiệp vụ giao dịch.
- **Mức thay đổi**: Giữ thế giới thị giác; tác vụ chính là tìm, đọc và lựa chọn món/quán. Giữ footer/avatar đã duyệt, mở rộng sang bỏ giao diện mobile và thay chi tiết món độc lập bằng chi tiết món tại quán theo xác nhận ngày 2026-11-13. Không sửa lại nội dung pháp lý hoặc chức năng không liên quan.
- **Dữ liệu có sẵn không đồng nghĩa dữ liệu thật**: Nguồn hiện tại được đánh dấu minh họa. Có thể tái sử dụng nguyên bản và công khai tính chất mẫu; không tạo/xác nhận giá hoặc số liệu mới. Muốn xuất bản như dữ liệu thực phải có nguồn kiểm chứng do chủ website cung cấp.
- **Nguồn đối chiếu cho kế hoạch**: `src/app/routes.tsx`, `src/app/components/layout/AppFrame.tsx`, `src/app/pages/discovery/HomePage.tsx`, thẻ món/quán hiện có, `src/app/data/restaurants.ts` và `src/app/lib/catalog.ts`. Danh mục hiện có món thực đơn gắn quán, đủ để bổ sung nhóm món mà không tạo dữ liệu. Các đường dẫn này chỉ là bằng chứng khảo sát, không áp đặt cấu trúc triển khai.
- **Phụ thuộc nội dung footer**: Chủ website bổ sung email, điện thoại, địa chỉ đơn vị vận hành, chủ thể bản quyền, chính sách riêng tư độc lập và liên kết mạng xã hội chính thức. Trước đó giữ nhãn bổ sung, không tạo trang hoặc dịch vụ mới. Mục quyền riêng tư trong `/settings/terms` chỉ là nội dung sẵn có, chưa chứng minh tuân thủ pháp lý.
- **Quyết định avatar đã xác nhận**: Chủ sản phẩm chọn Q1: A và Q2: A: mở `/profile`, dùng biểu tượng người dùng trung tính ở trạng thái khách và báo chưa xác thực. `/profile` hiện là hồ sơ minh họa; không xây dashboard, dịch vụ đăng nhập hoặc giả lập phiên đăng nhập. Không còn quyết định avatar chặn `/speckit.plan`.
- **Phụ thuộc thẻ quán**: Danh sách quán đã được trang chủ hiển thị hết. Mặc định không tăng số thẻ quán; yêu cầu tăng số lượng chờ thêm nội dung do chủ website cung cấp. Đây không phải cam kết sẽ có quán mới trong bản triển khai hiện tại.
- **Mặc định hành vi**: Ngưỡng cuộn 400 CSS px, vùng bấm 44 CSS px, khoảng an toàn 16 CSS px và phạm vi trang quy định ở FR-002/FR-007/FR-009 là các mặc định kiểm thử được của đợt này; không yêu cầu người dùng quyết định chi tiết trình bày nhỏ.
- **Quản trị và kiểm chứng**: Ngoại lệ với yêu cầu responsive/mobile của `.specify/memory/constitution.md` phiên bản 1.0.0 được chủ sản phẩm xác nhận ngày 2026-11-13: chỉ duy trì bố cục desktop trên toàn website, kể cả điện thoại; cho phép cuộn ngang, không chặn truy cập. Lý do: sản phẩm chỉ nhắm tới desktop. Rủi ro: trải nghiệm màn hình hẹp và khả năng reflow bị giảm; không tuyên bố đáp ứng tiêu chí reflow chỉ từ việc có cuộn ngang. Vẫn giữ kiểm thử độ rộng hẹp, bàn phím, focus và truy cập toàn bộ nội dung theo FR-018/SC-003. Ngoại lệ duy trì tới khi chủ sản phẩm thay đổi phạm vi thiết bị; không tự sửa constitution hoặc bỏ các yêu cầu truy cập còn lại. `guidelines/Guidelines.md` được constitution tham chiếu nhưng không tồn tại tại thời điểm khảo sát; không suy diễn quy tắc từ tài liệu thiếu. Bước này chỉ cập nhật đặc tả và checklist, không sửa code ứng dụng hoặc khẳng định đã nghiệm thu giao diện.
