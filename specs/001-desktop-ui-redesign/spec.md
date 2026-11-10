# Feature Specification: Thiết kế lại giao diện ưu tiên desktop

**Feature Branch**: Không tạo hoặc chuyển nhánh trong lần lập đặc tả này.

**Created**: 2026-11-10

**Status**: Clarified — đã xác nhận ba quyết định phạm vi; sẵn sàng lập kế hoạch, chưa triển khai code.

**Input**: User description:

> Thiết kế lại giao diện website đặt món ăn,
> ưu tiên trải nghiệm trên màn hình máy tính
> Mục tiêu:
> - Sắp xếp lại bố cục, phân cấp thông tin và điều hướng rõ ràng.
> - Chuẩn hóa card món ăn và quán ăn bằng dữ liệu hiện có.
> - Đồng bộ kích thước, khoảng cách, căn hàng và nút chính/phụ.
> - Sử dụng không gian hợp lý; không thêm nội dung hoặc nút
>   chỉ để lấp khoảng trống.
> - Phân biệt khoảng trống bố cục với trạng thái không có dữ liệu;
>   trạng thái rỗng cần giải thích và hướng dẫn phù hợp.
>
> Ràng buộc:
> - Giữ nguyên tính năng, nghiệp vụ, API, luồng đặt món
>   và bản sắc của sản phẩm.
> - Giữ bảng màu thương hiệu hiện có.
> - Không thêm tính năng, dữ liệu giả hoặc nút không hoạt động.
> - Không yêu cầu chuyển framework hay thay thư viện UI.
> - Bảo đảm responsive, khả năng dùng bàn phím, độ tương phản
>   và nội dung không bị tràn.
>
> Chưa triển khai code. Nêu rõ các điểm cần tôi xác nhận.

## Clarifications

### Session 2026-11-10

- Q: Đợt thiết kế này vẫn dành cho website khám phá món/quán, hay phải bảo toàn một luồng đặt món ở phiên bản khác? → A: Chỉ khám phá món/quán; “đặt món” là cách gọi chưa chính xác. Không bổ sung luồng đặt hàng, giỏ hàng, thanh toán hoặc giao hàng.
- Q: Đợt thiết kế lại này bao gồm những màn hình nào? → A: Toàn bộ màn hình hiện có, gồm nhóm khám phá chính, bản đồ, ngẫu nhiên, yêu thích, tài khoản, cài đặt và các trang phụ; không thêm màn hình hoặc nghiệp vụ mới.
- Q: Với các thao tác hiện chưa hoạt động, đợt thiết kế này được phép xử lý đến mức nào? → A: Cho sửa lỗi tìm kiếm/lọc, điều hướng và thao tác trên dữ liệu hiện có; không thêm dịch vụ, thay API hoặc mở rộng nghiệp vụ. Chức năng thiếu dịch vụ phải ghi rõ chưa khả dụng, không giả lập thành công.

## User Scenarios & Testing *(mandatory)*

Các kịch bản dưới đây mô tả kết quả mong muốn, không xác nhận chức năng hiện tại đã
hoạt động. Các mức ưu tiên là thứ tự nghiệm thu của đợt thiết kế, không phải kết luận
nghiên cứu về mức độ sử dụng từng tính năng. Phạm vi nghiệp vụ chỉ gồm khám phá món/quán;
toàn bộ màn hình hiện có thuộc đợt thiết kế. Cho phép sửa lỗi trên dữ liệu hiện có;
chức năng thiếu dịch vụ phải thể hiện chưa khả dụng theo FR-003.

### User Story 1 - Định hướng và duyệt món/quán trên desktop (Priority: P1)

Là người dùng tiếng Việt, tôi muốn hiểu ngay mình đang ở đâu, bắt đầu tìm hoặc duyệt
món/quán và mở thông tin chi tiết mà không phải dò qua các nhóm nội dung cạnh tranh.

**Why this priority**: Bố cục và điều hướng là nền tảng của mọi hành trình hiện có;
desktop cần sử dụng chiều ngang hợp lý thay vì phóng lớn bố cục điện thoại.

**Independent Test**: Mở trang khám phá trong phạm vi được duyệt trên desktop, tìm
điều hướng/tìm kiếm, duyệt một nhóm dữ liệu hiện có và mở đúng chi tiết của một mục.

**Acceptance Scenarios**:

1. **Given** trang có dữ liệu hiện có và màn hình 1440px, **When** người dùng mở trang,
   **Then** có tiêu đề/phân cấp rõ, nhóm nội dung cùng cạnh căn chỉnh, tìm kiếm và
   điều hướng chính nhận biết được mà không cần cuộn để tìm chúng.
2. **Given** một card hiện có, **When** người dùng mở card bằng chuột hoặc bàn phím,
   **Then** tới đúng món/quán đang hiển thị, không đổi sang một bản ghi thay thế.
3. **Given** danh sách chỉ có một hoặc hai mục, **When** trang được hiển thị,
   **Then** kích thước card vẫn theo quy tắc chung; không thêm card, banner hoặc
   hành động để lấp chỗ trống còn lại.
4. **Given** người dùng đang ở một đích điều hướng, **When** chuyển trang,
   **Then** tên/ý nghĩa các đích giữ nhất quán, vị trí hiện tại có dấu hiệu ngoài màu,
   và không có đích mới hoặc đích cũ bị bỏ ngoài danh sách phạm vi được xác nhận.
5. **Given** người dùng mở bản đồ, ngẫu nhiên, yêu thích, tài khoản, cài đặt hoặc
   trang phụ hiện có, **When** sử dụng màn hình đó, **Then** màn hình tuân theo cùng
   hệ phân cấp, khoảng cách, điều hướng và hành động; không bị bỏ khỏi đợt thiết kế.
   Các hành vi chưa hoạt động được xử lý theo quyết định FR-003, không tự bổ sung chức năng.
6. **Given** người dùng nhập truy vấn hoặc chọn điều kiện được dữ liệu hiện có hỗ trợ,
   **When** tìm kiếm hoặc áp dụng bộ lọc, **Then** kết quả và số lượng phản ánh đúng
   truy vấn/điều kiện, lựa chọn không bị mất khi mở lại bộ lọc hoặc quay lại từ chi tiết;
   không có kết quả phải hiển thị trạng thái rỗng đúng ngữ cảnh.

---

### User Story 2 - So sánh thông tin và thao tác nhất quán (Priority: P1)

Là người đang cân nhắc món/quán, tôi muốn các card và trang chi tiết trình bày cùng
loại thông tin theo thứ tự ổn định để đọc giá, điểm đánh giá và vị trí khi dữ liệu có sẵn.

**Why this priority**: Card không đồng nhất khiến người dùng phải học lại cách đọc
ở mỗi trang và dễ hiểu sai giá hoặc dữ liệu bị thiếu.

**Independent Test**: Đối chiếu cùng một bản ghi trên hai màn hình được duyệt, mở
chi tiết và kiểm tra giá trị, nhãn, ảnh, đích đến và thứ bậc nút không mâu thuẫn.

**Acceptance Scenarios**:

1. **Given** hai card cùng loại có đủ dữ liệu, **When** xem cạnh nhau,
   **Then** ảnh, tên, giá, điểm/số đánh giá và vị trí có thứ tự/định dạng nhất quán;
   tên/giá dài không làm nút hoặc metadata chồng lên nhau.
2. **Given** bản ghi thiếu ảnh, giá, điểm hoặc khoảng cách, **When** xem card,
   **Then** hiển thị dự phòng hoặc bỏ thông tin không có theo quy tắc chung;
   không tự tạo ảnh đại diện cho một món khác, giá, điểm hay khoảng cách giả.
3. **Given** một vùng có nhiều hành động hiện có, **When** xem vùng đó,
   **Then** có tối đa một nút chính cho quyết định hiện tại; nút phụ giữ nhãn, ý nghĩa
   và kết quả nghiệp vụ, không thêm nút chỉ để cân hàng.
4. **Given** thông tin mẫu hoặc chưa xác minh, **When** hiển thị lại theo bố cục mới,
   **Then** không gỡ cảnh báo hiện có hoặc nâng thành tuyên bố live/đã kiểm chứng.

---

### User Story 3 - Hiểu trạng thái rỗng và tiếp tục đúng cách (Priority: P2)

Là người dùng, tôi muốn biết vì sao một vùng không có dữ liệu và có thể làm gì tiếp,
không nhầm khoảng trắng của bố cục với kết quả tìm kiếm rỗng hay lỗi tải dữ liệu.

**Why this priority**: Trạng thái thiếu nội dung cần giải thích, trong khi khoảng
trắng bình thường giúp đọc dễ hơn và không phải lỗi cần lấp đầy.

**Independent Test**: Xem các trạng thái không có kết quả, chưa có mục lưu, thiếu một
trường thông tin và lỗi tải được hệ thống hiện có hỗ trợ; đối chiếu thông điệp và
hướng dẫn với nguyên nhân thật. Dữ liệu kiểm thử không trở thành dữ liệu sản phẩm mới.

**Acceptance Scenarios**:

1. **Given** kết quả thực sự rỗng, **When** trang kết thúc tải,
   **Then** thông báo nói rõ không có kết quả trong ngữ cảnh hiện tại, không để vùng
   trắng không giải thích; hướng dẫn chỉ trỏ tới thao tác đang có và hoạt động.
2. **Given** người dùng chưa có mục yêu thích và màn này thuộc phạm vi,
   **When** mở danh sách, **Then** thấy thông điệp “chưa có mục lưu”, không bị nói
   là lỗi mạng hoặc không có quán trong khu vực.
3. **Given** chỉ còn khoảng trống ở hàng cuối nhưng danh sách có dữ liệu,
   **When** xem trang, **Then** không xuất hiện thông báo rỗng hoặc nội dung bổ sung.
4. **Given** nguồn dữ liệu báo lỗi hoặc đang tải, **When** hiển thị trạng thái,
   **Then** không hiển thị “không có kết quả”; chỉ có “Thử lại” nếu thao tác đó thực sự
   được hỗ trợ. Nếu không, dùng hướng dẫn bằng văn bản phù hợp, không thêm nút giả.
5. **Given** thao tác hiện có cần dịch vụ chưa được tích hợp, **When** người dùng xem
   vùng liên quan, **Then** thấy giải thích chưa khả dụng; không có nút khả dụng hứa
   thực hiện tác vụ đó, không báo đăng nhập/gửi đánh giá/đồng bộ thành công giả và
   không xóa nội dung đã nhập để tạo cảm giác đã gửi.

---

### User Story 4 - Sử dụng được trên màn hình nhỏ và bằng bàn phím (Priority: P1)

Là người dùng không dùng chuột hoặc đang dùng màn hình nhỏ, tôi muốn hoàn thành các
thao tác trong phạm vi mà không mất nội dung, lạc focus hoặc bị thanh cố định che.

**Why this priority**: Desktop-first không được đánh đổi khả năng truy cập hoặc làm
mất các tính năng đang có trên thiết bị khác.

**Independent Test**: Đi qua điều hướng, card, trường nhập và hộp thoại liên quan
chỉ bằng bàn phím; lặp lại tại các kích thước nghiệm thu và hai chế độ hiển thị.

**Acceptance Scenarios**:

1. **Given** trang có các thao tác tương tác, **When** chỉ dùng bàn phím,
   **Then** mọi thao tác trong phạm vi đều tới được, có focus rõ, thứ tự hợp lý và
   không bị kẹt; hộp thoại đang mở được phép giữ focus cho tới khi đóng.
2. **Given** hộp thoại hoặc bảng lọc được mở, **When** đóng bằng thao tác hỗ trợ,
   **Then** focus trở về vị trí mở hoặc đích hợp lý nếu vị trí đó không còn.
3. **Given** vùng hiển thị hẹp hoặc nội dung dài, **When** bố cục chuyển cỡ,
   **Then** không mất thông tin thiết yếu/hành động hiện có, không tràn toàn trang,
   và thanh cố định không che nội dung hoặc phần tử đang focus.
4. **Given** chế độ sáng hoặc tối, **When** xem chữ, lỗi, nút và focus,
   **Then** đạt ngưỡng tương phản quy định và trạng thái không chỉ được phân biệt bằng màu.

### Edge Cases

- Danh sách có 0, 1 hoặc ít mục hơn số cột; không nhân bản mục để đủ hàng.
- Tên món/quán tiếng Việt dài, địa chỉ dài, giá nhiều chữ số, ảnh lỗi hoặc thiếu ảnh.
- Thiếu trường không đồng nghĩa thiếu bản ghi; không biến cả card thành trạng thái rỗng.
- Các trang đang hiển thị giá trị khác nhau cho cùng món/quán: ghi nhận sai lệch;
  không tự chọn số mới hoặc hợp nhất dữ liệu ngoài quyết định được duyệt.
- Tìm kiếm/lọc hiện không thay đổi kết quả: áp dụng quyết định FR-003;
  không viết thông báo kết quả thành công cho hành vi chưa hoạt động.
- Link chi tiết trực tiếp không có ngữ cảnh trang trước; dùng đường quay lại/dự phòng
  hiện có, không tự thêm luồng điều hướng hoặc thay đích dữ liệu.
- Kết nối chậm, lỗi tải ảnh/nguồn ngoài và bản đồ không sẵn sàng: chỉ thể hiện trạng thái
  có thể xác định, không suy đoán lỗi là kết quả rỗng.
- Viewport thấp, zoom, bàn phím ảo và các lớp nổi cùng xuất hiện; thao tác vẫn tới được.
- Chế độ tối có màu hoặc logo không đủ tương phản: dùng cách phối/nền phù hợp trong
  bảng màu được giữ; nếu không thể đạt, phải xin duyệt điều chỉnh, không âm thầm đổi màu.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001 — Ranh giới nghiệp vụ**: Đợt thiết kế MUST chỉ phục vụ khám phá món/quán.
  MUST NOT bổ sung luồng đặt hàng, giỏ hàng, thanh toán hoặc giao hàng. Cụm từ “đặt món”
  trong nguyên văn yêu cầu là cách gọi chưa chính xác, không phải yêu cầu giao dịch.
- **FR-002 — Phạm vi màn hình**: Đợt thiết kế MUST bao gồm toàn bộ màn hình hiện có:
  chào mừng/hướng dẫn ban đầu; trang chủ; tìm kiếm; danh sách quán; bản đồ; ngẫu nhiên;
  yêu thích; hồ sơ; đăng nhập/đăng ký; chi tiết quán, món và món tại quán; thông báo;
  danh sách đánh giá; cài đặt chung, tài khoản, địa chỉ, thông báo, ngôn ngữ và giao diện;
  hỗ trợ, điều khoản, hướng dẫn sử dụng và trang lỗi. MUST bao gồm các trạng thái và
  hộp thoại liên quan, không thêm màn hình hoặc nghiệp vụ mới. Mọi màn hình hiện có
  MUST được liệt kê trong danh mục nghiệm thu; không được bỏ qua nhóm trang phụ.
- **FR-003 — Hành vi chưa hoạt động**: Cho phép sửa lỗi tìm kiếm/lọc, điều hướng và
  thao tác hiện có trên dữ liệu sẵn có; MUST không thêm dịch vụ, thay hợp đồng tích hợp
  hoặc mở rộng nghiệp vụ. Tìm kiếm/lọc MUST thực sự tác động kết quả, giữ lựa chọn khi
  mở lại bộ lọc và khi quay lại từ chi tiết. Điều kiện không được dữ liệu hỗ trợ và
  chức năng thiếu dịch vụ MUST ghi rõ chưa khả dụng, không hiển thị như thao tác
  đang hoạt động, không giả lập thành công hoặc xóa dữ liệu nhập để giả vờ đã gửi.
  Việc sửa lỗi MUST được liệt kê và nghiệm thu riêng với thay đổi trình bày.
- **FR-004 — Bảo toàn**: Các hành vi đang hoạt động, quyền truy cập, dữ liệu, đích
  điều hướng và kết quả nghiệp vụ trong phạm vi được duyệt MUST giữ nguyên, trừ thay
  đổi bố cục/trình bày hoặc xử lý lỗi được phê duyệt riêng theo FR-003.
- **FR-005 — Desktop-first**: Màn hình desktop MUST có phân cấp tiêu đề/nội dung,
  vùng điều hướng và vùng thao tác rõ; không kéo giãn nguyên bố cục mobile hoặc kéo
  card hẹp qua toàn màn hình. Nội dung có liên quan MUST có cạnh căn chỉnh chung.
- **FR-006 — Không gian**: Khoảng cách và chiều rộng nhóm nội dung MUST tuân theo
  quy tắc chung; danh sách ngắn được phép để khoảng trắng, không thêm dữ liệu, mục
  trùng, banner, tính năng hoặc nút nhằm lấp khoảng trống.
- **FR-007 — Card nhất quán**: Card cùng loại MUST dùng một thứ tự trường, cách
  định dạng và phân cấp thông tin; card món và card quán MUST phân biệt đúng loại
  đối tượng và mở đúng bản ghi. Không bắt hai loại có các trường dữ liệu không tồn tại.
- **FR-008 — Dữ liệu**: Chỉ dùng dữ liệu sản phẩm hiện có; MUST không bổ sung bản ghi,
  con số, đánh giá, ưu đãi hay tuyên bố live giả. Thiếu trường MUST được xử lý bằng
  quy tắc dự phòng thống nhất, không thay bằng thông tin của đối tượng khác.
- **FR-009 — Hành động**: Mỗi vùng quyết định MUST có tối đa một hành động chính;
  hành động phụ được phân biệt bằng trình bày, không đổi ý nghĩa. Nhãn MUST mô tả
  được kết quả, mọi nút hiển thị khả dụng MUST có hành vi hoạt động và kiểm chứng được.
- **FR-010 — Trạng thái rỗng**: Vùng dữ liệu thực sự rỗng MUST giải thích đúng nguyên
  nhân/ngữ cảnh và hướng dẫn bước tiếp phù hợp. Hướng dẫn được phép là văn bản;
  chỉ có nút nếu dùng được hành vi hiện có hoặc đã được duyệt theo FR-003.
- **FR-011 — Phân biệt trạng thái**: MUST phân biệt khoảng trắng bố cục, thiếu trường,
  chưa có dữ liệu, không có kết quả, đang tải và lỗi khi các trạng thái đó áp dụng;
  không suy ra “rỗng” từ lỗi hoặc giả lập thời gian tải cho dữ liệu sẵn có.
- **FR-012 — Responsive**: Nội dung/điều hướng trong phạm vi MUST dùng được ở 320,
  390, 768, 1024 và 1440 CSS px, cả viewport cao và thấp, không có cuộn ngang toàn
  trang, chữ đè nhau hoặc hành động bị cắt. Bản đồ được phép cuộn hai chiều trong
  vùng của nó nếu thuộc phạm vi, không làm toàn trang bị tràn.
- **FR-013 — Bàn phím**: Mọi thao tác trong phạm vi MUST dùng được bằng bàn phím,
  có tên truy cập, focus rõ, thứ tự đọc/thao tác hợp lý; overlay MUST không làm mất
  focus hoặc tạo bẫy không thể thoát. Trạng thái chọn MUST được truyền đạt ngoài màu.
- **FR-014 — Tương phản**: Chữ thường MUST đạt 4.5:1; chữ lớn, ranh giới điều khiển
  cần nhận biết và focus MUST đạt 3:1 với nền kề. Không đặt thông tin thiết yếu chỉ
  trong hover hoặc dùng màu làm dấu hiệu duy nhất của lỗi/lựa chọn.
- **FR-015 — Bản sắc và theme**: MUST giữ tên, logo, ngôn ngữ tiếng Việt và bảng màu
  thương hiệu hiện có; được phân bổ lại màu theo vai trò để đạt tương phản. Giữ yêu
  cầu sáng/tối đã xác nhận; không mặc định bảng màu mới trong tài liệu đề xuất đã
  được phê duyệt để thay bảng màu hiện có. Mâu thuẫn không giải quyết được bằng cách
  phối màu MUST trình người dùng duyệt trước khi triển khai.
- **FR-016 — Kích thước và reflow**: Điều khiển độc lập MUST có vùng thao tác tối
  thiểu 44×44 CSS px; chữ phóng 200% vẫn đọc/thao tác được; ở độ rộng tương đương
  320 CSS px, nội dung văn bản MUST reflow không mất thông tin. Link trong đoạn văn
  không bắt buộc có hộp 44×44px nhưng phải nhận biết và thao tác được.
- **FR-017 — Không mở rộng kỹ thuật**: Đợt thiết kế MUST không thay nền tảng, bộ UI,
  cách tích hợp dữ liệu, cơ chế tài khoản hoặc quyền truy cập. Tái sử dụng thành phần
  và quy tắc thiết kế hiện có khi phù hợp; việc chúng tồn tại không có nghĩa là đạt chuẩn.
- **FR-018 — Bảo toàn trạng thái**: Thay đổi bố cục MUST không làm mất truy vấn,
  điều kiện, mục đang chọn hoặc dữ liệu đã nhập mà hành vi đang hoạt động trước đó
  giữ được. Truy vấn/điều kiện và ngữ cảnh điều hướng thuộc phạm vi sửa lỗi FR-003;
  MUST không suy rộng thành dịch vụ đồng bộ hoặc thay cơ chế lưu trữ/tài khoản.
- **FR-019 — Không triển khai ở bước này**: Đầu ra lần này MUST chỉ là đặc tả,
  checklist và câu hỏi xác nhận; không thay mã ứng dụng, dữ liệu hoặc tài liệu
  quản trị để tự giải quyết mâu thuẫn phạm vi.

### Key Entities *(include if feature involves data)*

- **Món ăn**: Bản ghi hiện có gồm định danh, tên, ảnh và các thông tin giá/đánh giá/
  mối liên hệ quán khi có; không giả định mọi món đều có đầy đủ trường.
- **Quán ăn**: Bản ghi hiện có gồm định danh, tên, ảnh, địa chỉ/khu vực và giá/điểm/
  khoảng cách khi có. Khoảng cách và đánh giá không mặc nhiên là thông tin live.
- **Nhóm nội dung/kết quả**: Tập bản ghi theo ngữ cảnh hiện có; số lượng thực tế quyết
  định hiển thị bình thường, thưa hoặc rỗng, không phải số cột của bố cục.
- **Hành động/đích điều hướng hiện có**: Nhãn, điều kiện khả dụng, điểm đến/kết quả
  và trạng thái hoạt động; dùng để kiểm tra bảo toàn, không phải danh mục tính năng mới.
- **Trạng thái hiển thị**: Có dữ liệu, thiếu trường, chưa có mục, không có kết quả,
  đang tải hoặc lỗi; chỉ áp dụng trạng thái có căn cứ từ nguồn hiện có.

## Success Criteria *(mandatory)*

### Measurable Outcomes

Các tiêu chí là mục tiêu nghiệm thu cho phạm vi đã xác nhận, chưa phải kết quả
đã đo. Không đặt mục tiêu chuyển đổi đặt hàng vì nghiệp vụ giao dịch nằm ngoài phạm vi.

- **SC-001**: Trong kiểm thử có hướng dẫn nhiệm vụ nhưng không chỉ vị trí nút với
  ít nhất 5 người dùng tiếng Việt, ít nhất 4/5 người tìm được điểm bắt đầu tìm/duyệt
  và mở đúng một chi tiết trong 60 giây trên desktop bằng dữ liệu hiện có.
- **SC-002**: Ít nhất 4/5 người trong cùng đợt kiểm thử phân biệt được điều hướng
  chính, hành động chính/phụ và nguyên nhân của hai trạng thái “không có kết quả”/
  “chưa có mục lưu” được áp dụng, không cần người điều phối giải thích giao diện.
- **SC-003**: 100% card cùng loại trong phạm vi đạt cùng thứ tự trường/định dạng;
  100% thông tin và đích chi tiết được đối chiếu khớp bản ghi nguồn, không có bản
  ghi/con số/CTA mới dùng để lấp không gian.
- **SC-004**: 100% hành trình đang hoạt động thuộc phạm vi được duyệt giữ được
  kết quả nghiệp vụ và đường đi truy cập; 100% nút hiển thị khả dụng có hành vi
  kiểm chứng được. Các lỗi tồn tại từ trước được ghi riêng và chỉ được tính là đã sửa
  khi có kiểm chứng; chức năng thiếu dịch vụ không được tính là hoàn thiện nghiệp vụ
  chỉ vì đã có trạng thái chưa khả dụng.
- **SC-005**: Không có trường hợp tràn toàn trang, chồng chữ, focus hoặc thao tác
  thiết yếu bị che trong ma trận FR-012, kể cả chữ dài, thiếu ảnh, 0/1/nhiều mục,
  zoom chữ 200% và reflow tương đương 320 CSS px.
- **SC-006**: 100% thao tác tương tác trong phạm vi hoàn thành được chỉ bằng bàn
  phím, có tên và focus nhận biết; không có bẫy bàn phím ngoài cơ chế modal hợp lệ,
  và đóng modal luôn trả focus hợp lý.
- **SC-007**: 100% cặp chữ/nền và điều khiển thiết yếu được kiểm tra ở sáng/tối đạt
  FR-014; 100% trạng thái lỗi/chọn không phụ thuộc duy nhất vào màu sắc.
- **SC-008**: Với mỗi trạng thái rỗng/lỗi áp dụng trong phạm vi, có nguyên nhân/ngữ
  cảnh đọc được và bước tiếp hợp lệ; không có thông báo rỗng chỉ do hàng lưới chưa
  đủ mục và không có nút phục hồi chưa hoạt động.
- **SC-009**: 100% màn hình hiện có trong danh mục FR-002 và các hộp thoại liên quan
  được đối chiếu với tiêu chí bố cục, hành vi, responsive và accessibility áp dụng;
  không có màn hình bị loại khỏi nghiệm thu chỉ vì không thuộc luồng khám phá chính.
- **SC-010**: 100% trường hợp tìm kiếm/lọc được dữ liệu hiện có hỗ trợ trả đúng tập
  kết quả và số lượng, giữ đúng truy vấn/điều kiện khi quay lại; 100% chức năng thiếu
  dịch vụ được nhận biết là chưa khả dụng và không phát thông báo thành công giả.

## Assumptions

- Đây là đặc tả cho một đợt thiết kế lại, không phải ủy quyền triển khai. Không tạo
  nhánh do không có hook đăng ký; thư mục đặc tả độc lập với tên nhánh.
- Người dùng đã xác nhận chỉ khám phá món/quán, phù hợp `PRODUCT.md` và constitution;
  không đặt hàng hoặc giao hàng. Nguyên văn Input được giữ để truy vết, không phải
  căn cứ bổ sung nghiệp vụ giao dịch.
- Người dùng tiếng Việt, desktop-first và khám phá không bắt buộc đăng nhập là các
  quyết định đã xác nhận. Không suy diễn độ tuổi, nghề nghiệp hoặc persona mới.
- `DESIGN.md` là đề xuất tham khảo, không phải bằng chứng giao diện đã đạt chuẩn.
  Ràng buộc giữ bảng màu hiện có trong yêu cầu này ưu tiên hơn các thay đổi màu mới
  chưa được phê duyệt trong đề xuất. Không sửa `DESIGN.md` trong bước lập đặc tả.
- Người dùng đã xác nhận thiết kế lại toàn bộ màn hình hiện có, không chỉ nhóm
  khám phá chính. Cho phép sửa lỗi hành vi trên dữ liệu hiện có theo FR-003, không
  đồng nghĩa cho phép bổ sung dịch vụ hoặc hoàn thiện mọi tính năng production.
- Đợt nghiệm thu dùng đúng dữ liệu hiện có. Bộ dữ liệu rỗng/thiếu trường dùng cho
  kiểm tra là điều kiện kiểm thử được kiểm soát, không phải bản ghi giả được thêm
  vào sản phẩm. Không giả định có nguồn dữ liệu, dịch vụ hay production integration mới.
- Việc triển khai sau này phụ thuộc danh mục màn hình/hành động được duyệt, ghi nhận
  hành vi đang hoạt động để đối chiếu và nguồn màu thương hiệu hiện tại. Sai lệch
  dữ liệu hoặc giới hạn hiện có phải được ghi nhận, không âm thầm sửa nghiệp vụ.
- Hỗ trợ sáng/tối giữ theo xác nhận trước; cách triển khai và mức độ tích hợp theme
  hiện có cần khảo sát ở giai đoạn kế hoạch, không được tuyên bố đang hoạt động.
- Các mục tiêu kiểm thử 5 người là tiêu chí đề xuất, không phải nghiên cứu đã tiến
  hành. Chưa có kết quả dùng thử, đo tương phản hoặc kiểm tra trình duyệt cho đợt này.
