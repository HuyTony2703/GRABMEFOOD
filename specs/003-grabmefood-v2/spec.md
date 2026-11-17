# Feature Specification: GrabMeFood V2 — khám phá và cộng đồng ẩm thực

**Feature Branch**: `main` (chỉ ghi nhánh hiện tại; không tạo/chuyển nhánh)

**Created**: 2026-11-15

**Status**: Approved — chủ dự án duyệt toàn bộ spec và amendment constitution tại SCRUM-56

**Approval**: 2026-11-15 — chủ dự án xác nhận “Tôi duyệt toàn bộ để tiếp tục”.
Phê duyệt nghiệp vụ không cấp quyền tự sửa cấu hình công cụ, tài khoản/GitHub,
xóa/reset hoặc triển khai tính năng ngoài gói được giao.

**Input**: Xây mới GrabMeFood V2 theo SCRUM-5; chỉ giữ yêu cầu chức năng đã chốt,
không tái sử dụng giao diện hoặc dữ liệu legacy. SCRUM-18/55 → 56 chốt nghiệp vụ;
SCRUM-46/57 → 58 chốt quy tắc agent và regression, chưa viết ứng dụng.

## Clarifications

### Session 2026-11-15

- Q: V2 dùng cách đăng nhập nào? → A: Email/mật khẩu, bắt buộc xác minh email;
  xác minh và khôi phục qua email Cloud Auth (thay inbox local theo amendment bên dưới).
  Không Google/Facebook/OTP/2FA (chủ dự án chọn 1A).
- Q: Hồ sơ và settings cần phạm vi nào? → A: Tên hiển thị, handle duy nhất để
  @mention, avatar; onboarding bỏ qua/tiếp tục; theme sáng/tối/hệ thống; bật/tắt từng
  nhóm thông báo trong website; đổi mật khẩu; giao diện tiếng Việt, favorites riêng tư.
  Không thêm đổi email hoặc xóa tài khoản ở gói nghiệp vụ này (chọn 2A).
- Q: V2 có chấm sao/đánh giá hay chỉ bình luận? → A: Bình luận/trả lời/@mention cho
  món và quán; không chấm sao và không hiển thị rating giả (chọn 3A).
- Q: Tìm kiếm và bộ lọc hoạt động thế nào? → A: Từ khóa, loại món/quán, danh mục,
  khu vực và khoảng giá; truy vấn rỗng duyệt nội dung công khai theo bộ lọc; sắp xếp
  liên quan/tên/giá tăng, không GPS/khoảng cách. Lọc giá/khu vực cần ít nhất một nơi bán
  công khai cùng thỏa các điều kiện, không ghép giá và khu vực từ hai quán khác nhau
  (chủ dự án chọn 1A trong lượt tiếp theo).
- Q: Quyền cộng đồng và xử lý bình luận thế nào? → A: Khách đọc; tài khoản đã xác minh
  mới lưu/random/đăng tương tác. Handle chọn một lần, không đổi trong V2. Một tầng reply
  dưới comment gốc. Chủ nội dung sửa/xóa của mình, xóa giữ dấu “đã xóa” và giữ các reply
  khác. Có báo cáo; admin ẩn/khôi phục, không sửa lời tác giả (chọn 2A lượt tiếp theo).
- Q: Khi nào gửi thông báo quán và áp dụng tùy chọn? → A: Khi quán đã lưu thay đổi giá
  hoặc thêm/bỏ món đã xuất bản; sửa riêng ảnh/tên/mô tả không gửi. Tính người nhận theo
  trạng thái lưu và bật nhóm lúc xử lý tạo thông báo. Bỏ lưu/tắt nhóm không xóa inbox cũ
  (chọn 3A lượt tiếp theo).
- Q: Đăng xuất, đổi mật khẩu và khôi phục mật khẩu sẽ kết thúc những phiên đăng nhập nào?
  → A: Đăng xuất chỉ kết thúc phiên hiện tại; đổi hoặc khôi phục mật khẩu kết thúc mọi
  phiên của tài khoản và yêu cầu đăng nhập lại (chủ dự án chọn A trong lượt clarify).

Các câu trả lời trên được chủ dự án xác nhận trực tiếp, không phải suy luận từ UI cũ.
Những đề xuất còn chờ trả lời không được coi là đã duyệt.

### Amendment Cloud và session A — 2026-11-15

- Q: Dữ liệu/Auth/ảnh V2 chạy ở đâu? → A: Supabase Cloud project
  `bdhavbwmxbttymerizvx`; web/Gateway/services/RabbitMQ vẫn localhost, giữ Docker.
  Không yêu cầu Supabase Local; không cấp quyền remote mutation hoặc phí.
- Q: Email/callback và phạm vi Auth? → A: Gmail custom SMTP `smtp.gmail.com:465`
  đã cấu hình Dashboard, gửi thư chưa kiểm. Origin `http://localhost:3000`,
  callback `/auth/callback`, reset page `/auth/reset-password`; thiết kế ở SCRUM-59,
  full Auth sau scaffold tại task Auth. Không có SMTP password trong ứng dụng.
- Q: Strict revocation và rebuild? → A: Duyệt session A server-only BFF/opaque
  HttpOnly cookie, Community ledger, synchronous fail-closed. Sau mốc thu hồi
  không cấp quyền mới; request được cấp quyền trước đó có thể hoàn tất. Lỗi
  password change/reset một phần không phục hồi phiên cũ hoặc báo thành công giả.
  Rebuild/destructive test cần isolated target duyệt riêng; hiện chưa có, ghi blocked.

### Amendment remediation SCRUM-60 — approval mới 2026-11-16

Owner xác nhận **“Tôi duyệt remediation cả 4 điểm”** sau analyze C1/U1/U2/I1.
Đây là approval tại lượt này, **không thuộc approval6/6 trước đó**.

- Bốn nhóm mặc định bật: **reply, mention, cập nhật quán đã lưu, broadcast quản trị**.
  Người dùng vẫn tắt/bật riêng từng nhóm; thư Auth không thuộc bốn nhóm này.
- Reply/mention chỉ phát khi tạo comment hoặc reply; **không phát lại khi chỉnh sửa**,
  kể cả edit thêm/thay mention. Sự kiện creation giữ danh tính recipients gốc,
  không lấy mentions mới từ bản edit để mở rộng người nhận của event đang chờ.
- Media public chỉ khi đang đủ điều kiện công khai; draft/private cần quyền
  tương ứng. Proxy/cache không được bypass quyền hoặc lộ ảnh chưa gắn/đã bỏ gắn.
- Resume đổi/khôi phục mật khẩu sau context hết hạn cần bằng chứng mới, còn hiệu
  lực và đúng mục đích; không khôi phục phiên cũ hoặc auto-login từ recovery.
- Details quyền đọc media/proof binding tại
  [contracts](contracts/README.md) và [ADR-0002](../../docs/adr/0002-v2-contracts.md).
  Giữ31 FR, không tạo spec cạnh tranh hay cấp permission runtime/remote.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Khám phá món và quán (Priority: P1)

Khách xem nội dung đã xuất bản, tìm món hoặc quán bằng tiếng Việt, xem thông tin
và biết nơi bán món cùng giá tương ứng trước khi quyết định đi ăn.

**Why this priority**: Khám phá là giá trị chính, không cần tài khoản để đọc catalog công khai.

**Independent Test**: Với catalog demo mới có nhận diện rõ, khách tìm món có nhiều
quán bán và mở đúng detail mà không cần dữ liệu cá nhân hoặc dịch vụ thông báo.

**Acceptance Scenarios**:

1. **Given** món đã xuất bản có hai quán đang bán, **When** khách mở món,
   **Then** thấy đúng hai nơi bán cùng thông tin giá của từng nơi, không trộn giá.
2. **Given** nội dung nháp/không tồn tại, **When** khách mở liên kết trực tiếp,
   **Then** không thấy dữ liệu nháp hoặc dữ liệu của một bản ghi khác thay thế.
3. **Given** giá chưa có, **When** xem món/quán, **Then** thể hiện chưa có thông tin
   thay vì giá 0, giá tự suy ra hoặc giá lấy từ nội dung legacy.
4. **Given** hai truy vấn tương đương về dấu/chữ hoa, **When** tìm kiếm,
   **Then** kết quả khớp cùng nội dung, không mất trạng thái khi quay lại trang.
5. **Given** không có từ khóa, **When** chọn loại/danh mục/khu vực/khoảng giá,
   **Then** duyệt được nội dung công khai thỏa các điều kiện đang chọn.
6. **Given** món có quán X đúng khu vực nhưng giá ngoài khoảng, quán Y đúng giá
   nhưng sai khu vực, **When** kết hợp hai bộ lọc, **Then** món không khớp;
   chỉ khớp khi một nơi bán công khai cùng thỏa.
7. **Given** có giá thiếu và giá hợp lệ, **When** lọc hoặc sắp xếp giá tăng,
   **Then** không coi giá thiếu là 0, không dùng nơi bán khác để làm sai điều kiện.

### User Story 2 - Tạo tài khoản và giữ tùy chọn (Priority: P1)

Người dùng đăng ký, xác minh email Cloud Auth khi demo ứng dụng localhost, đăng nhập,
khôi phục mật khẩu và giữ hồ sơ/tùy chọn của mình qua các lần truy cập.

**Why this priority**: Danh tính thật là điều kiện cho tương tác riêng tư và ownership.

**Independent Test**: Tạo hai tài khoản mới và kiểm tra xác minh/khôi phục/đổi mật khẩu,
onboarding và settings mà không cần comment hoặc notification fixture.

**Acceptance Scenarios**:

1. **Given** email chưa đăng ký, **When** đăng ký hợp lệ,
   **Then** có hướng dẫn xác minh và thư tới email qua Cloud Auth/SMTP; chưa được coi là tài khoản đã xác minh.
   Lỗi gửi/rate limit không giả thành công, có hướng dẫn thử lại mà không lộ account/secret.
2. **Given** liên kết xác minh/khôi phục đã hết hạn hoặc dùng lại không còn hợp lệ,
   **When** mở liên kết, **Then** hiển thị lỗi có đường phục hồi, không giả thành công.
3. **Given** người dùng đã đăng nhập, **When** đổi tên/avatar/theme hoặc tùy chọn thông báo
   và đăng nhập lại, **Then** giữ đúng giá trị đã lưu.
4. **Given** người dùng bỏ qua onboarding, **When** quay lại,
   **Then** có thể tiếp tục, không mất bước đã lưu hoặc bị coi nhầm là tài khoản mới.
5. **Given** phiên không còn hợp lệ hoặc đã đăng xuất, **When** thực hiện tác vụ riêng tư,
   **Then** cần đăng nhập lại, không dùng danh tính của người trước trên cùng trình duyệt.
6. **Given** A đang có phiên S1 và S2, **When** đăng xuất tại S1,
   **Then** S1 không tiếp tục tác vụ riêng tư, S2 vẫn sử dụng được; không ảnh hưởng tài khoản B.
7. **Given** A có nhiều phiên, **When** đổi hoặc khôi phục mật khẩu thành công,
   **Then** mọi phiên cũ của A mất quyền thực hiện tác vụ riêng tư và A phải đăng nhập lại;
   thông báo đổi mật khẩu thành công không thay bằng một phiên đăng nhập tự động.
8. **Given** settings của A và B khác nhau, **When** đổi theme/nhóm thông báo hoặc
   hồ sơ của A rồi refresh/đăng nhập lại, **Then** chỉ giá trị của A thay đổi.
9. **Given** yêu cầu sửa hồ sơ/avatar/settings của B, **When** A thực hiện trực tiếp,
    **Then** bị từ chối; email của B không được lộ qua hồ sơ công khai/gợi ý mention.
10. **Given** account mới chưa sửa preferences, **When** mở settings,
    **Then** cả bốn nhóm reply/mention/cập nhật quán đã lưu/broadcast quản trị bật;
    tắt riêng một nhóm không làm đổi các nhóm khác.
11. **Given** đổi/reset đang protected_pending và context đã hết hạn,
    **When** người dùng resume, **Then** cần proof mới đúng account/mục đích/còn
    hạn; stale/wrong-purpose proof bị từ chối, không restore phiên cũ hoặc auto-login.

### User Story 3 - Lưu và random trong danh sách riêng (Priority: P1)

Người dùng lưu riêng món và quán, sau đó nhờ random chọn từ loại mình đã lưu.

**Why this priority**: Giúp quyết định ăn gì mà không đưa bộ lọc vào random.

**Independent Test**: Tài khoản A/B có saved khác nhau; kiểm tra hai chế độ với 0/1/n
nội dung hợp lệ, không cần comment hoặc inbox.

**Acceptance Scenarios**:

1. **Given** A đã lưu một món và một quán, **When** refresh/đăng nhập lại,
   **Then** hai tab vẫn chứa đúng dữ liệu riêng của A; B không xem/sửa được.
2. **Given** đã lưu một target, **When** lưu lặp hoặc bấm hai lần,
   **Then** chỉ có một quan hệ saved, không có bản ghi trùng.
3. **Given** loại đang chọn có 0 nội dung hợp lệ, **When** random,
   **Then** hướng dẫn lưu thêm, không lấy ngẫu nhiên toàn catalog.
4. **Given** loại đang chọn có 1 nội dung hợp lệ, **When** random,
   **Then** trả đúng nội dung đó.
5. **Given** loại đang chọn có ít nhất 2 nội dung hợp lệ, **When** random tiếp,
   **Then** không lặp ngay kết quả trước nếu còn lựa chọn khác, không lẫn loại.
6. **Given** không thể xác minh nội dung hiện còn công khai do lỗi dịch vụ,
   **When** random, **Then** báo chưa thể chọn, không dùng nội dung cũ chưa xác minh làm kết quả.
7. **Given** target đã lưu trở thành nháp/bị ẩn/không tồn tại, **When** xem saved
   hoặc random, **Then** không lộ nội dung không còn công khai và target đó không được
   dùng làm kết quả; lỗi tải catalog không được giả là danh sách thật sự rỗng.
8. **Given** người dùng bỏ lưu trong lúc random, **When** trả kết quả,
   **Then** không coi target đã bỏ lưu là một lựa chọn saved hợp lệ.

### User Story 4 - Bình luận và trao đổi đúng người (Priority: P2)

Người dùng bình luận về món/quán, trả lời và chọn @mention đúng tài khoản,
không lộ email của người khác.

**Why this priority**: Tạo trao đổi trong ngữ cảnh món/quán, không thêm chấm sao.

**Independent Test**: Hai tài khoản đã xác minh trao đổi trên một target công khai;
kiểm quyền sở hữu, mention và an toàn nội dung, không cần đo độ phổ biến hay rating.

**Acceptance Scenarios**:

1. **Given** A có thể bình luận trên target công khai, **When** gửi nội dung hợp lệ,
   **Then** nội dung gắn đúng tác giả và target, không báo đã lưu nếu thất bại.
2. **Given** A và B có cùng tên hiển thị, **When** chọn tài khoản từ gợi ý @mention,
   **Then** gắn đúng danh tính đã chọn, không đoán từ display name hoặc lộ email.
3. **Given** comment của B, **When** A cố sửa bằng yêu cầu trực tiếp,
   **Then** bị từ chối, kể cả khi A sửa đường dẫn hoặc dữ liệu gửi.
4. **Given** comment ở món X, **When** gửi reply với target quán Y,
   **Then** bị từ chối, không tạo thread sai ngữ cảnh.
5. **Given** nội dung chứa markup/script độc hại, **When** xem,
   **Then** không thực thi mã và không để lộ nội dung bị ẩn/xóa.
6. **Given** tài khoản chưa xác minh, **When** lưu/random/đăng tương tác,
   **Then** không thực hiện tác vụ và có hướng dẫn xác minh; vẫn đọc được nội dung công khai.
7. **Given** một comment gốc có reply của người khác, **When** chủ comment xóa,
   **Then** nội dung gốc không còn công khai, giữ dấu “đã xóa” và các reply còn khả dụng.
8. **Given** một reply, **When** cố tạo thêm tầng reply bên dưới,
   **Then** không tạo tầng thứ hai; chỉ được tạo reply trực tiếp dưới comment gốc.
9. **Given** nội dung bị báo cáo, **When** admin ẩn rồi khôi phục,
   **Then** trạng thái công khai đổi tương ứng; lời tác giả không bị admin sửa.
10. **Given** handle đã được chọn, **When** người dùng cố đổi,
     **Then** không đổi handle; đổi tên hiển thị/avatar không làm mention trỏ sai người.
11. **Given** comment đã tạo với mentions A và event còn chờ, **When** tác giả sửa
    thành mention B, **Then** không phát event reply/mention mới, event creation
    không dùng mention B của bản sửa để mở rộng người nhận; preferences vẫn xét
    tại recipient decision đã duyệt.

### User Story 5 - Nhận và quản lý thông báo trong website (Priority: P2)

Người dùng nhận thông báo trả lời/@mention, cập nhật quán đã lưu và thông báo
quản trị; đọc inbox và điều chỉnh từng nhóm thông báo.

**Why this priority**: Giúp tiếp tục cuộc trao đổi và theo dõi quán, không phụ thuộc email/push.

**Independent Test**: Hai users và admin tạo từng loại sự kiện; kiểm đúng người nhận,
đọc/chưa đọc và quyền gửi, có cả trường hợp sự kiện được gửi lại.

**Acceptance Scenarios**:

1. **Given** B trả lời và @mention A trong cùng một tương tác,
   **When** thông báo được xử lý nhiều lần, **Then** A không nhận bản sao trùng
   và B không tự nhận thông báo do chính hành động đó.
2. **Given** inbox riêng của A, **When** B cố xem hoặc đánh dấu đã đọc,
   **Then** bị từ chối; read state của A giữ nguyên.
3. **Given** A đọc một mục hoặc tất cả mục hiện có, **When** refresh,
   **Then** badge và trạng thái đã đọc được giữ đúng.
4. **Given** người thường, **When** cố gửi broadcast quản trị,
   **Then** bị từ chối dù gửi yêu cầu ngoài giao diện.
5. **Given** target không còn truy cập được, **When** mở thông báo,
   **Then** có thông báo không còn khả dụng, không lộ nội dung bị ẩn/xóa.
6. **Given** A đang lưu quán và bật nhóm cập nhật quán, **When** xử lý thay đổi giá
   hoặc thêm/bỏ món đã xuất bản, **Then** A nhận thông báo; sửa riêng ảnh/tên/mô tả không gửi.
7. **Given** sự kiện đang chờ xử lý, **When** A bỏ lưu hoặc tắt nhóm trước thời điểm
   xử lý tạo thông báo, **Then** không tạo mục mới cho A; không xóa mục inbox cũ.
8. **Given** A lưu quán hoặc bật nhóm trước lúc xử lý một sự kiện tới trễ,
   **When** tạo thông báo, **Then** dùng trạng thái tại thời điểm xử lý đã chốt,
   không suy ra trạng thái người nhận ở thời điểm phát sinh thay đổi.
9. **Given** nhóm reply tắt nhưng nhóm mention bật, **When** một tương tác vừa reply
   vừa mention A, **Then** xét riêng điều kiện mỗi nhóm rồi chống trùng; A nhận một mục
   hợp lệ do mention, không bị tắt nhầm cả hai và không nhận hai mục.
10. **Given** nhóm thông báo bị tắt khi xử lý tạo mục mới,
    **When** xảy ra đúng loại tương tác đó, **Then** không tạo mục mới cho nhóm đã tắt;
    thư xác minh/khôi phục mật khẩu không bị coi là nhóm thông báo sản phẩm có thể tắt.

### User Story 6 - Tự quản trị catalog demo mới (Priority: P2)

Quản trị viên tạo món/quán, ảnh và nơi bán/giá, xem nháp rồi xuất bản mà không sửa code.

**Why this priority**: Nguồn dữ liệu mới có thể được phát triển và demo độc lập.

**Independent Test**: Admin tạo món, quán và nơi bán; khách chỉ thấy sau xuất bản;
tài khoản thường không được thực hiện cùng yêu cầu.

**Acceptance Scenarios**:

1. **Given** nội dung nháp mới, **When** admin xuất bản hợp lệ,
   **Then** khách thấy đúng nội dung và không cần đổi source.
2. **Given** người không có quyền admin, **When** thử tạo/sửa/xuất bản hoặc upload
   dưới quyền admin, **Then** bị từ chối ngoài cả UI.
3. **Given** ảnh không upload được, **When** lưu nội dung,
   **Then** không báo upload thành công hoặc gắn ảnh khác thay thế.
4. **Given** admin mới tạo một offering, **When** xuất bản,
    **Then** giá và quán/món liên kết đúng danh tính, không bịa giá từ dữ liệu thiếu;
    danh sách công khai không hiển thị điểm sao hoặc số đánh giá mẫu.
5. **Given** media Catalog chuyển từ published sang draft hoặc admin bị revoke,
   **When** có GET mới kể cả conditional/cache/optimizer path,
   **Then** không trả bytes trái quyền; avatar chưa gắn chỉ chủ sở hữu xem được,
   avatar công khai chỉ bản sanitized đang gắn, không URL bypass Storage.

### User Story 7 - Dựng và dùng bộ demo tái lập (Priority: P2)

Người chấm nhận một folder root, làm theo prerequisites rồi khởi động demo local
với dữ liệu mới có nhận diện, không phụ thuộc dữ liệu riêng của người phát triển.

**Why this priority**: Đảm bảo có thể kiểm chứng tính năng khi nộp bài.

**Independent Test**: Giải nén bộ nộp ở đường dẫn khác trên môi trường sạch đã có
prerequisites; khởi động rồi dừng/mở lại, kiểm số lượng dữ liệu và tài khoản demo.

**Acceptance Scenarios**:

1. **Given** môi trường sạch đã đáp ứng prerequisites và folder nộp bài,
   **When** chạy lệnh khởi động được hướng dẫn, **Then** có dữ liệu demo mới ít nhất
    20 món/8 quán/hai users/admin và URL sử dụng; không cần SQL tay hoặc đường dẫn máy tác giả.
    Cloud project/quyền truy cập/Internet là prerequisites được nêu rõ; migration/seed
    là bước provisioning được duyệt riêng, không ngầm chạy khi startup.
2. **Given** người dùng đã lưu nội dung và settings, **When** stop rồi khởi động bình thường,
   **Then** dữ liệu được giữ; startup không tự reset.
3. **Given** một môi trường thử nghiệm tách biệt đã được xác nhận đích để reset,
   **When** chạy quy trình reset–dựng lại hai vòng, **Then** cùng bộ cấu hình tạo được
   demo hợp lệ, không bản ghi trùng/mất bucket/tài khoản không đăng nhập được.
    Kịch bản này không cấp quyền reset ở gói đặc tả hiện tại. Chưa có target phù hợp
    thì ghi blocked, không chạy trên project chính để chứng minh tái lập.
4. **Given** màn hình chính hoặc trạng thái loading/empty/error,
   **When** dùng trên mobile/desktop, bằng bàn phím và chế độ giảm chuyển động,
   **Then** không mất tác vụ chính/focus, có nhãn và đường phục hồi phù hợp;
   evidence render được thu ở gói UI, không dùng screenshot legacy làm bằng chứng V2.

### Edge Cases

- Email sai định dạng/trùng; mật khẩu hoặc phiên không hợp lệ; xác minh/khôi phục hết hạn;
  lỗi SMTP/rate limit/mất mạng/project paused; không có mật khẩu/token thật trong log hoặc thông báo lỗi.
- Hai người cùng chọn một handle; đổi tên hiển thị không làm mention trỏ sang người khác;
  handle không được đổi sau khi đã chọn.
- Tìm kiếm rỗng, không có kết quả, thay đổi truy vấn nhanh, back/forward, lọc kết hợp,
  phân trang trong lúc nội dung được thay đổi; không đưa nội dung nháp vào kết quả.
- Nội dung saved bị ẩn/xóa; concurrent unsave trong khi random; lỗi kiểm tra catalog:
  không dùng target không hợp lệ hoặc rơi về toàn bộ catalog.
- Reply/mention trùng người nhận; self-action; event lặp hoặc tới trễ; đổi preferences
  hoặc bỏ lưu quán trong thời gian chờ; recipient dùng trạng thái lúc xử lý tạo thông báo,
  không thay đổi hoặc xóa inbox cũ theo thay đổi preferences.
- Bình luận trống/quá giới hạn; reply parent không còn công khai; tài khoản khác cố sửa;
  upload sai định dạng/dung lượng hoặc sửa/xóa ảnh người khác.
- Mọi luồng có loading/empty/error và cách thử lại phù hợp; yêu cầu thất bại không được
  hiển thị như đã lưu. Không có placeholder giả làm phản hồi thành công của dịch vụ.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Sản phẩm MUST phục vụ khám phá món/quán bằng tiếng Việt và hiển thị
  rõ nội dung demo, không đặt hàng/thanh toán/giao hàng/booking/hotel/trang bản đồ.
- **FR-002**: Khách MUST xem được catalog/detail công khai; nội dung nháp, bị ẩn hoặc
  không tồn tại MUST NOT được thay bằng nội dung khác hay rò rỉ qua liên kết trực tiếp.
- **FR-003**: Món MUST có danh tính độc lập với quán; nơi bán liên kết món với quán
  và thông tin giá tương ứng. Không giữ khóa cặp quán–món legacy làm danh tính món V2.
- **FR-004**: Catalog MUST NOT bịa giá, khoảng cách, vị trí, rating hoặc thông tin quán thật.
  Quán/món demo MUST có nhận diện demo; ảnh mới MUST có nguồn và quyền sử dụng phù hợp.
- **FR-005**: Tìm kiếm MUST hỗ trợ món/quán, tiếng Việt có/không dấu và không phân biệt
  hoa/thường; giữ truy vấn và trạng thái kết quả khi quay lại.
- **FR-006**: Search MUST hỗ trợ loại món/quán, danh mục, khu vực và khoảng giá,
  sắp xếp liên quan/tên/giá tăng; truy vấn rỗng duyệt nội dung công khai theo bộ lọc.
  Không GPS, khoảng cách hoặc geolocation. Lọc khu vực và giá MUST cùng khớp trên ít
  nhất một nơi bán công khai hợp lệ; MUST NOT ghép điều kiện từ hai nơi bán khác nhau.
- **FR-007**: Người dùng MUST đăng ký/đăng nhập bằng email và mật khẩu, xác minh email,
  khôi phục/đổi mật khẩu và đăng xuất; dùng Cloud Auth/SMTP cho thư xác minh/khôi phục.
  Social login, OTP, 2FA, đổi email và xóa tài khoản không thuộc phạm vi đã chọn.
- **FR-008**: Hệ thống MUST phân biệt khách, tài khoản chưa xác minh, tài khoản đã xác minh
  và admin; khách đọc nội dung công khai, tài khoản chưa xác minh không được lưu/random/đăng
  tương tác. Không coi đăng ký là đã xác minh; quyền admin không được tự sửa từ hồ sơ.
- **FR-009**: Hồ sơ MUST có tên hiển thị, handle duy nhất để chọn @mention và avatar.
  Mention MUST giữ danh tính người được chọn, không định danh bằng email/display name.
- **FR-010**: Onboarding MUST hỗ trợ bỏ qua/tiếp tục và phân biệt lần đầu với quay lại;
  cập nhật hồ sơ, theme sáng/tối/hệ thống và tùy chọn thông báo MUST được lưu bền.
- **FR-011**: Tùy chọn thông báo MUST cho phép bật/tắt riêng các nhóm reply, mention,
  cập nhật quán đã lưu và broadcast quản trị; thời điểm tác động theo FR-025.
- **FR-012**: Email và dữ liệu tài khoản riêng MUST NOT xuất hiện trong gợi ý mention
  công khai; người dùng khác MUST NOT sửa hồ sơ, ảnh, settings, saved hoặc inbox.
- **FR-013**: Người dùng MUST lưu/bỏ lưu cả món và quán ở hai danh sách riêng tư,
  không trùng cùng target và giữ đúng sau refresh/đăng nhập lại.
- **FR-014**: Lưu target MUST chỉ chấp nhận nội dung công khai hợp lệ;
  không trả nội dung nháp qua danh sách saved.
- **FR-015**: Random MUST có hai chế độ món/quán, chỉ dùng saved hợp lệ của chính người
  dùng và loại đang chọn. MUST NOT có bộ lọc giá/khu vực hoặc fallback toàn catalog.
- **FR-016**: Random MUST xử lý 0 → hướng dẫn lưu thêm, 1 → trả chính nó,
  n ≥ 2 → không lặp tức thì khi còn lựa chọn hợp lệ; lỗi xác minh target MUST được báo rõ.
- **FR-017**: Người dùng MUST bình luận/trả lời/@mention trên món/quán đúng target.
  V2 MUST NOT có chấm sao, điểm trung bình hoặc một hệ thống scored review riêng.
- **FR-018**: Người dùng MUST NOT sửa nội dung người khác; reply MUST cùng target với
  parent, mention MUST chọn đúng danh tính và không thực thi mã độc.
- **FR-019**: Handle MUST được chọn một lần, không đổi trong V2. Reply MUST chỉ có một
  tầng trực tiếp dưới comment gốc, không tạo reply dưới reply. Chủ nội dung MUST được
  sửa/xóa nội dung của mình; xóa MUST giữ dấu “đã xóa” và giữ các reply khác còn khả dụng,
  không hiển thị lại nội dung đã xóa. Có chức năng báo cáo; admin MUST được ẩn/khôi phục
  nội dung theo báo cáo/moderation nhưng MUST NOT sửa lời tác giả hoặc khôi phục nội dung
  đã bị chính tác giả xóa để hiển thị lại công khai.
- **FR-020**: Hệ thống MUST tạo thông báo in-app cho reply, mention, cập nhật quán
  đang lưu và broadcast admin theo chính sách recipient được duyệt; MUST NOT tạo email
  hoặc push cho thông báo sản phẩm.
- **FR-021**: Thông báo MUST NOT self-notify hoặc nhân bản khi cùng sự kiện được xử lý lại;
  cùng người nhận của reply+mention trong cùng tương tác MUST không nhận mục trùng.
- **FR-022**: Inbox MUST có badge chưa đọc, phân trang, đọc từng mục/all-read và deep link;
  trạng thái MUST giữ sau refresh; không đọc/đánh dấu inbox người khác.
- **FR-023**: Chỉ admin MUST được compose/preview/send broadcast, quyền phải được kiểm
  tra khi thực hiện hành động, không chỉ ẩn nút trên UI.
- **FR-024**: Inbox MUST tự cập nhật nhẹ khi đang sử dụng, không chạy cập nhật nền khi
  tab bị ẩn hoặc đã đăng xuất; target mất quyền truy cập MUST có fallback không lộ nội dung.
- **FR-025**: Thông báo quán MUST chỉ phát khi thay đổi giá hoặc thêm/bỏ món đã xuất bản;
  sửa riêng ảnh/tên/mô tả MUST NOT phát. Người nhận MUST đang lưu quán và bật nhóm tại lúc
  xử lý tạo thông báo, kể cả sự kiện tới trễ. Tùy chọn nhóm reply/mention/broadcast cũng
  MUST được xét lúc tạo mục cho người nhận; bỏ lưu/tắt nhóm MUST NOT xóa inbox cũ.
- **FR-026**: Admin MUST tự tạo/sửa/xuất bản món/quán/nơi bán/giá/ảnh mới;
  người không có quyền MUST bị từ chối kể cả thực hiện hành động ngoài giao diện.
- **FR-027**: Hệ thống MUST dùng nội dung/tài khoản/ảnh mới, không migrate legacy;
  có ít nhất 20 món, 8 quán demo và hai tài khoản người dùng cùng một admin để nghiệm thu.
- **FR-028**: Bài demo MUST tái lập từ rỗng bằng bộ cấu hình/dữ liệu mới trong một
  folder root; khởi động một lệnh sau prerequisites được ghi rõ. Khởi động bình thường
  MUST NOT tự reset; stop/restart MUST giữ dữ liệu.
- **FR-029**: UI MUST được xây mới hoàn toàn, dùng được trên mobile/desktop, bàn phím,
  có focus/nhãn rõ và hỗ trợ giảm chuyển động; không lấy thiết kế/layout/assets legacy làm mẫu giữ lại.
- **FR-030**: Tác vụ thất bại MUST có trạng thái lỗi/phục hồi; hệ thống MUST NOT bịa
  kết quả thành công hoặc để lộ credential/email riêng qua lỗi, logs hoặc nội dung công khai.
- **FR-031**: Đăng xuất MUST kết thúc chỉ phiên hiện tại, không kết thúc phiên khác
  của tài khoản. Đổi hoặc khôi phục mật khẩu thành công MUST kết thúc mọi phiên cũ của
  tài khoản và yêu cầu đăng nhập lại; phiên cũ MUST NOT tiếp tục tác vụ riêng tư.
  Không kết thúc phiên của tài khoản khác.

### Key Entities *(include if feature involves data)*

- **Tài khoản**: Danh tính ổn định, email riêng, trạng thái xác minh và quyền.
- **Hồ sơ/tùy chọn**: Tên hiển thị, handle duy nhất, avatar, onboarding, theme,
  lựa chọn các nhóm thông báo; thuộc một tài khoản.
- **Món**: Nội dung món độc lập, trạng thái công khai, ảnh có nguồn.
- **Quán**: Nội dung quán, thông tin địa điểm để xem trên detail, trạng thái công khai,
  ảnh và danh sách nơi bán món; không phải dịch vụ giao hàng.
- **Nơi bán**: Quan hệ món–quán, thông tin giá và khả dụng tương ứng.
- **Saved**: Quan hệ riêng tư của một người với một món hoặc một quán.
- **Bình luận/trả lời**: Tác giả, nội dung, target món/quán, parent cùng target và
  trạng thái khả dụng; một tầng reply, dấu đã xóa giữ liên kết thread, trạng thái
  ẩn/khôi phục do moderation khác với xóa của tác giả.
- **Mention**: Người được chọn theo danh tính ổn định trong một tương tác.
- **Thông báo**: Nguồn, người nhận, target, trạng thái đọc và nhận diện chống trùng.
- **Broadcast**: Nội dung do admin gửi tới người nhận theo chính sách đã duyệt.

## Success Criteria *(mandatory)*

### Measurable Outcomes

Đây là tiêu chí sẽ kiểm khi triển khai, không phải kết quả đã chạy trên ứng dụng hiện tại.

- **SC-001**: 100% kịch bản catalog/search đã chốt trả đúng nội dung công khai,
  không có trường hợp dùng giá giả hoặc nội dung nháp thay thế.
- **SC-002**: Hai tài khoản mới hoàn tất đăng ký/xác minh/khôi phục và giữ đúng
  hồ sơ/settings sau refresh, logout/login; 100% ca truy cập chéo bị từ chối.
- **SC-003**: Cả hai loại saved đạt các ca 0/1/n random; không kết quả nào thuộc người
  khác, sai loại, ngoài saved hợp lệ hoặc lặp tức thì khi vẫn có lựa chọn khác.
- **SC-004**: Hai users trao đổi comment/reply/mention đúng người và target; không
  có ca sửa trái quyền hoặc rò email, nội dung hidden/deleted theo chính sách được duyệt.
- **SC-005**: Mỗi nhóm thông báo được kiểm với hai users và admin: đúng recipient,
  không self/duplicate, đúng read state sau refresh và đúng quyền broadcast/preferences.
- **SC-006**: 100% luồng chính và trạng thái lỗi/empty được duyệt dùng được bằng bàn phím
  trên cả mobile và desktop; thay đổi hình thức giảm chuyển động không làm mất chức năng.
- **SC-007**: Bộ demo mới đủ 20 món/8 quán/hai users/admin; dựng lại hai vòng từ rỗng
  và khởi động từ folder nộp bài trên môi trường sạch sau prerequisites, không SQL tay
  hoặc phụ thuộc dữ liệu/đường dẫn máy tác giả.

## Assumptions

- Demo chạy local trên máy có prerequisites được tài liệu hạ tầng xác định; không
  cam kết giải nén chạy trên máy bất kỳ chưa cài công cụ. Supabase Cloud và Internet
  bắt buộc; không bắt trả phí hoặc deploy ứng dụng lên hosting.
- Chưa có backend/schema V2 để chứng minh chức năng; source hiện tại chỉ là legacy
  fixtures và UI, không phải bằng chứng đăng nhập, quyền hoặc persistence đã hoạt động.
- Không có legacy backend/database/Storage theo xác nhận chủ dự án. Backup/restore
  legacy được miễn ở SCRUM-54; không miễn kiểm thử tái lập/độ tin cậy V2.
- Thiết kế chi tiết, resource budgets, contract kỹ thuật, policy giới hạn input/upload
  và thông số vận hành phải được xét tại task phụ trách, không tự coi UI cũ là quyết định.
- FR-006/019/025/031 đã được chủ dự án xác nhận. Không còn câu hỏi nghiệp vụ chặn bản
  review này; các thông số kỹ thuật/giới hạn định dạng cụ thể phải theo contracts/ADR
  sau, không được tự mở rộng quyền hoặc thay đổi chính sách đã chốt.
- Các scenario mô tả hành vi cần đạt, không chứng minh ứng dụng đã có tính năng.
  Toàn bộ spec và amendment constitution đã qua gate duyệt SCRUM-56; SCRUM-46 vẫn
  phải clarify quyền/capability thực tế trước phần việc phụ thuộc.

Nguồn: SCRUM-5, SCRUM-18/55/56, các task chức năng 12/16/26/27/28/29/51/52,
constitution và các câu trả lời trực tiếp trong phiên.
[Traceability](traceability.md) chỉ ánh xạ yêu cầu/nghiệm thu về Jira, không phải
kế hoạch triển khai hoặc bản sao nghiệp vụ.
