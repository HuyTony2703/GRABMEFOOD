# API / Data API / RPC contracts

**Trạng thái:** DRAFT nhóm 2; đây là **catalog hợp đồng đề xuất**, không là endpoint tồn tại.
Chưa tạo OpenAPI, controller, function hoặc client.
Chỉ sau khi chốt thiết kế mới viết OpenAPI cho Spring và sinh types/schema tương ứng.
Nguồn entities: [DATABASE](DATABASE.md); quyền: [SECURITY](SECURITY.md).

## 1. Quy ước chung

- Tên snake_case cho Data API/RPC; JSON Spring camelCase. Adapter frontend ánh xạ có kiểm soát.
- UUID là opaque ID; locale vi/en; timestamp UTC; cursor opaque và có kiểm tra.
- Page<T> đề xuất: `{items: T[], next_cursor: string|null}`; không áp envelope này cho mọi Supabase raw response.
- WriteResult: `{id: UUID, version: integer, operation_id: UUID}`.
- Chỉ server sinh owner/author/recipient/event key; caller không tự chọn người nhận thông báo.
- Caller-context: `apikey` publishable và `Authorization` là user access token khi đăng nhập,
  không gửi publishable key như JWT.
- Server-only context: secret theo API-key docs; không trộn user Authorization vào client đặc quyền.
- Nội dung Markdown không raw HTML; notification chỉ đích có kiểu, không URL tùy ý.

## 2. Đọc trực tiếp qua Supabase Data API

Browser dùng Supabase SDK `.from(...)`, không định nghĩa Spring endpoint tương đương.
Raw REST dưới base Supabase có `/rest/v1/...`; query fields phải explicit, không `select *`.

| Resource | Projection/luồng | Quyền và giới hạn |
| --- | --- | --- |
| `areas` | code, tên vi/en | Public read |
| `restaurants` + registry/media | ID, name, mô tả, address, area, map links, ảnh hợp lệ | Chỉ quán khả dụng; metadata nguồn không tự expose toàn bộ |
| `dishes` + registry/media | ID, quán, tên/mô tả vi/en, giá demo, ảnh | Món và cha khả dụng |
| `articles`, `editorial_selections`, `selection_items` | Nội dung public và liên kết | Không đưa hidden payload vào public result |
| `collections` | Bộ của caller, loại và tên | Owner active; create/rename/delete chỉ khi OQ-07 được duyệt |
| `saved_items` + registry | Item ID, kind, ngày lưu, marker | Owner active; không lấy hidden payload qua join |
| `comments` | Nội dung public, edited_at, parent, public author label | Target phải khả dụng; không join công khai email/profile riêng |
| `notifications` | Mục riêng và trạng thái đọc | Recipient active; chỉ UPDATE read_at, không chỉnh recipient/body/type |

Profiles owner-only; nhãn tác giả public phải qua projection chỉ trả tên của tác giả có comment
khả dụng. Admin không mặc định được đọc các bộ sưu tập riêng của user.
Views nếu có phải invoker hoặc được review quyền tương đương, không mặc định bypass RLS.

## 3. RPC đề xuất

Tất cả input/body bên dưới cần schema validation trước khi implementation.
`operation_id` dùng cho mutation replay; `expected_version` dùng phát hiện stale update.
Các wrapper exposed là invoker; logic definer nếu cần đặt private với caller checks.

| RPC / caller | Input chính | Output / hiệu ứng |
| --- | --- | --- |
| `search_restaurants` / public | locale, query, area_code nullable, cursor nullable, page_size | Page<RestaurantCard>; distinct quán; matched_dishes chỉ tên/ID món khả dụng; không điểm/ranking thương mại |
| `get_actor_context` / user | Không nhận actor ID | user_id, role, state từ quyền hiện tại; không tự coi JWT role claim là admin |
| `save_item` / user | collection_id, item_id, operation_id | WriteResult; owner/loại/khả dụng hợp lệ, duplicate save idempotent |
| `pick_saved_item` / user | kind, mode all/selected, selected_ids nullable | `{item: ItemSummary|null, reason: null|"EMPTY"|"NO_AVAILABLE_ITEMS"}`; chỉ saved distinct; selected_ids không phải saved thì từ chối |
| `create_comment` / user | target_item_id, parent_id nullable, body, operation_id | WriteResult; parent gốc cùng target; reply tạo notification cùng transaction |
| `edit_comment` / owner | comment_id, body, expected_version, operation_id | WriteResult; không đổi target/author/parent |
| `delete_comment` / owner hoặc admin | comment_id, expected_version, operation_id | WriteResult/tombstone result; notification khi admin xóa; hành vi reply của người khác chờ G2-P05 |
| `mark_notifications_read` / user | cutoff_created_at, cutoff_id, operation_id | `{updated_count}`; chỉ unread thuộc caller đến cutoff; thông báo mới hơn vẫn unread |
| `admin_save_content` / admin JWT | item_id nullable, kind, payload theo loại, visibility, expected_version nullable, operation_id | WriteResult; transaction registry/payload; validation hai ngôn ngữ; món mới public phát sự kiện theo quy tắc cần duyệt |
| `admin_set_visibility` / admin JWT | item_id, visibility public/hidden, expected_version, operation_id | WriteResult; effective availability cha/con và thông báo cùng transaction |
| `admin_delete_content` / admin JWT | item_id, expected_version, operation_id | `{operation_id, deleted_item_ids}`; payload/comments xóa, marker giữ; không trả nội dung đã xóa |

`pick_saved_item` không nhận seed do user điều khiển để đổi nguồn. Đề xuất chọn đều trên các ID hợp lệ;
thuật toán/quy mô và cách lọc một bộ chưa chốt. Không thêm collection_id trước khi rõ OQ-06.
Random là read, kết quả chỉ hợp lệ tại snapshot truy vấn; trang detail phải kiểm tra lại nếu bị gỡ sau đó.
Không tuyên bố transaction chặn được mọi thay đổi xảy ra sau khi response đã gửi.

### RPC chỉ Spring được gọi bằng privileged context

Tên đề xuất; revoke EXECUTE khỏi PUBLIC/anon/authenticated. Schema exposed không đồng nghĩa public access.

| RPC | Input | Vai trò |
| --- | --- | --- |
| `server_begin_account_operation` | operation_id, verified_actor_id, target_user_id, kind, input_hash | Kiểm tra actor active/admin và guard bền vững active_operation_id; ID khác đang xử lý target trả conflict; chống tự thao tác/admin cuối nếu duyệt; đặt blocked/deletion_pending |
| `server_finish_account_operation` | operation_id, stage, result_code | Kiểm tra state transition và guard còn đúng ID; không set active trước Auth unban; không giải phóng guard nếu chưa rõ kết quả Auth |
| `server_get_operation` | operation_id, verified_actor_id | Trạng thái retry/partial cho admin hợp lệ; không đưa secret/raw provider error |
| `server_send_notification` | operation_id, verified_actor_id, audience, message_vi/en | Validate actor/recipient set; idempotent, tạo notifications và revisions |
| `server_list_accounts` | verified_actor_id, cursor, page_size | Trả account admin projection; Auth email lấy qua server khi thực sự cần, không table public |

`verified_actor_id` chỉ do Spring lấy từ token đã xác minh; truyền ID không thay xác minh.
Mỗi server-only function vẫn kiểm tra actor/trạng thái; secret không thay authorization.
Operation idempotency phải so input_hash: cùng ID nhưng khác target/body trả conflict, không nhận nhầm replay.
Row lock của một RPC không kéo dài qua Auth HTTP. Guard bền vững theo target ở DATABASE/
ARCHITECTURE là đề xuất xử lý operation cạnh tranh; retry sau timeout không được chạy lệnh đối nghịch.

## 4. Spring API đề xuất

Chưa có endpoint ngoài các trách nhiệm đã duyệt. Đây là catalog review, **không OpenAPI giả**.

| Method + path đề xuất | Input | Kết quả | Trace |
| --- | --- | --- | --- |
| GET `/api/admin/accounts` | cursor, pageSize | Page<AccountAdminSummary>, không password/token | REQ-ADM-04/05, phục vụ màn quản trị |
| POST `/api/admin/accounts/{id}/lock` | operationId | AccountOperation | REQ-ADM-04 |
| POST `/api/admin/accounts/{id}/unlock` | operationId | AccountOperation | REQ-ADM-04 |
| DELETE `/api/admin/accounts/{id}` | operation ID trong header `Idempotency-Key` | AccountOperation | REQ-ADM-05 |
| GET `/api/admin/operations/{id}` | Không body | AccountOperation có stage/result | Hỗ trợ retry đúng trạng thái |
| POST `/api/admin/notifications` | operationId, audience single/all, recipientId nếu single, messageVi/En | `{operationId, recipientCount, state}` | REQ-NOT-04 |

AccountOperation: `{operationId, state, stage, errorCode?, retryable}`.
Hoàn tất đồng bộ trả 200; xử lý dở/lỗi upstream trả ProblemDetail với operationId và trạng thái partial.
Không trả 202 với lời hứa tự chạy nền khi chưa có worker/recovery được thiết kế.
Không cần queue chỉ để dùng status 202.

Proposed error codes: UNAUTHENTICATED, FORBIDDEN, ACCOUNT_BLOCKED, VALIDATION_FAILED,
NOT_FOUND, CONTENT_UNAVAILABLE, VERSION_CONFLICT, OPERATION_CONFLICT, UPSTREAM_FAILURE.
Status 401/403/404/409/422/502/503 theo trường hợp; raw PostgREST errors được adapter ánh xạ,
không giả mọi RPC sẽ trả cùng HTTP codes khi chưa thiết kế SQL exception.
List/read không side effect; mutation Auth thất bại không được báo xóa thành công.

## 5. Storage, Realtime, map và SEO

- Storage chưa có upload proxy Spring mặc định; policy/path/MIME/ownership ở SECURITY.
  G2-P12 còn phải chọn direct staging + Spring finalize hoặc Spring upload.
  Chưa định nghĩa endpoint finalize khi lựa chọn/trạng thái validation chưa được duyệt.
- Đề xuất Realtime chỉ `notification_signals` INSERT/UPDATE lọc user_id. Payload không chứa nội dung;
  khi nhận tín hiệu, đọc lại inbox/unread bằng Data API có RLS.
- Subscribe thành công rồi refetch snapshot, refetch sau reconnect/tab focus; dedup và không dựa riêng
  event để tính unread. Không subscribe DELETE riêng tư làm nguồn dữ liệu.
- Map dùng validated embed URL và Maps URL; không nhận nguyên `<iframe>` HTML từ admin.
- SEO document/OG image route **chưa định nghĩa** vì renderer/Storage exposure còn chờ duyệt.
  Không bịa API cho lựa chọn chưa chốt.

## 6. Điều kiện trước khi contract thành baseline

1. Chốt G2-P về schema, quyền và những hành vi tác động dữ liệu.
2. Chốt field validation, page limits, cursor format và enum errors.
3. Lập ma trận contract test allow/deny/replay/concurrency.
4. Chỉ sau đó tạo SQL migrations/types/OpenAPI thật trong task được duyệt.
