# API / Data API / RPC contracts

> Nhóm 2 đã được duyệt để tiếp tục nhóm 3; contract candidate và nhánh TBD vẫn cần
> chốt trước implementation. Không có endpoint hoặc OpenAPI executable được phê duyệt bởi việc này.

> B1 bổ sung: ưu tiên Data API/RPC; shared permission helper, HTTP outbox/HMAC và upload staging→public
> đã chọn. Contract signatures dưới đây còn candidate cho đến khi vượt gate/validation review.

**Trạng thái:** DRAFT nhóm 2; đây là **catalog hợp đồng đề xuất**, không là endpoint tồn tại.
Chưa tạo OpenAPI, controller, function hoặc client.
Chỉ sau khi chốt thiết kế mới viết OpenAPI cho Spring và sinh types/schema tương ứng.
Nguồn entities: [DATABASE](DATABASE.md); quyền: [SECURITY](SECURITY.md).
**Bản chỉnh 5 service:** command thuộc owner API, không còn browser gọi thẳng các mutation RPC
của bản nháp một backend. Tên/path/signature mới vẫn cần duyệt, không là OpenAPI đã chốt.

## 1. Quy ước chung

- Tên snake_case cho Data API/RPC; JSON Spring camelCase. Adapter frontend ánh xạ có kiểm soát.
- UUID là opaque ID; locale vi/en; timestamp UTC; cursor opaque và có kiểm tra.
- Page<T> đề xuất: `{items: T[], next_cursor: string|null}`; không áp envelope này cho mọi Supabase raw response.
- WriteResult: `{id: UUID, version: integer, operation_id: UUID}`.
- Chỉ server sinh owner/author/recipient/event key; caller không tự chọn người nhận thông báo.
- Caller-context: `apikey` publishable và `Authorization` là user access token khi đăng nhập,
  không gửi publishable key như JWT.
- Server context phải có credential scope theo owner; không dùng global service_role chung cho cả năm.
  Auth Admin context chỉ Account Administration, không trộn caller Authorization.
- P01: machine identity/actor trust còn cần duyệt theo SECURITY mục 10. Một Authorization chỉ chứa
  một bearer; truyền actor ID từ service không tương đương token delegation được DB verify.
- Nội dung Markdown không raw HTML; notification chỉ đích có kiểu, không URL tùy ý.

## 2. Đọc trực tiếp qua Supabase Data API

Browser dùng Supabase SDK trên façade được owner cho phép; không expose nguyên schema nội bộ.
Tên surface dưới đây là đề xuất, không tự đổi exposed schemas/publication trên Cloud.
Raw REST có `/rest/v1/...`; projection explicit, không `select *`.

| Resource | Projection/luồng | Quyền và giới hạn |
| --- | --- | --- |
| Catalog-owned `catalog_areas` | code, tên vi/en | Public SELECT |
| Catalog-owned `catalog_restaurants`, `catalog_dishes` | Nội dung khả dụng, giá demo, vị trí, media hợp lệ | Public SELECT; policy kiểm tra availability trong Catalog |
| Catalog-owned `catalog_articles`, `catalog_selections` | Nội dung public và liên kết | Public SELECT, không hidden payload |
| Catalog-owned `search_restaurants` RPC | Tên quán/món, vùng, cursor | Public search, dữ liệu một owner |
| Notification-owned `my_notifications`, `my_unread` | Inbox/read state/count riêng | SELECT recipient+current active; không direct UPDATE/INSERT |
| Notification-owned `notification.notification_signals` | user_id, revision | Bảng nguồn Realtime SELECT có RLS, không nội dung; không phải event trên view public |

Collection/Community commands và reads nhạy tính khả dụng đi qua API owner; không expose comment table
cho browser rồi dựa event chậm để giấu target. Collection read-only façade là tùy chọn chưa duyệt,
không được thêm direct writes.
Profiles thuộc Account Administration; nhãn tác giả qua contract tối thiểu, không join schema Account.
Admin không được đọc mọi bộ riêng. Invoker view cần grants/RLS underlying được kiểm chứng.

## 3. RPC/transaction nội bộ theo owner

Tất cả input/body bên dưới cần schema validation trước khi implementation.
`operation_id` dùng cho mutation replay; `expected_version` dùng phát hiện stale update.
Ngoại trừ search public, các tên dưới đây là transaction contract của service, **không browser RPC API**.
Runtime ưu tiên Data API/RPC, một RPC cho local transaction mutation+outbox/receipt.
Phải chứng minh credential/EXECUTE scope; không tự mint user JWT hoặc dùng secret toàn cục
để lách ranh giới. Input auth lấy từ context đã xác minh.

| RPC / caller | Input chính | Output / hiệu ứng |
| --- | --- | --- |
| `search_restaurants` / public | locale, query, area_code nullable, cursor nullable, page_size | Page<RestaurantCard>; distinct quán; matched_dishes chỉ tên/ID món khả dụng; không điểm/ranking thương mại |
| Account `get_actor_context` | Caller đã xác minh | user_id, role, state/version hiện tại; không tin JWT role cũ |
| Collection `save_item` | collection_id, item_id, operation_id | Owner/type hợp lệ; Catalog batch availability check bên ngoài local transaction, TOCTOU ở G2-P16 |
| Collection `pick_saved_item` | kind, mode all/selected, selected_ids nullable | ItemSummary hoặc EMPTY/NO_AVAILABLE_ITEMS; lọc saved distinct và Catalog validate, không join Catalog tables |
| Community `create_comment` | target_item_id/kind, parent_id nullable, body, operation_id | Comment + local outbox event trong cùng transaction; **không** ghi inbox |
| Community `edit_comment` | comment_id, body, expected_version, operation_id | Không đổi target/author/parent; kiểm tra quyền hiện tại |
| Community `delete_comment` | comment_id, expected_version, operation_id | Xóa parent cascade tất cả replies, kể cả khác author; local event khi admin xóa |
| Notification `mark_notifications_read` | cutoff_created_at, cutoff_id, operation_id | Chỉ unread own đến cutoff; thông báo mới hơn vẫn unread |
| Catalog `admin_save_content` | item_id nullable, kind, payload, visibility, expected_version nullable, operation_id | Registry/payload + local event; không biết saved audience |
| Catalog `admin_set_visibility` | item_id, visibility, expected_version, operation_id | Local availability/version + event, không mutate Collection/Community |
| Catalog `admin_delete_content` | item_id, expected_version, operation_id | Local payload xóa/registry marker + cleanup workflow; chưa trả full completion khi Community chưa receipt |

`pick_saved_item` không nhận seed do user điều khiển để đổi nguồn. Đề xuất chọn đều trên các ID hợp lệ;
thuật toán/quy mô và cách lọc một bộ chưa chốt. Không thêm collection_id trước khi rõ OQ-06.
Random là read, kết quả chỉ hợp lệ tại snapshot truy vấn; trang detail phải kiểm tra lại nếu bị gỡ sau đó.
Không tuyên bố transaction chặn được mọi thay đổi xảy ra sau khi response đã gửi.

### Account/Notification server contracts

Tên đề xuất, chỉ credential owner tương ứng; không grant chung mọi service. Không cho anon/authenticated gọi.

| RPC | Input | Vai trò |
| --- | --- | --- |
| `server_begin_account_operation` | operation_id, verified_actor_id, target_user_id, kind, input_hash | Active/admin+guard; ID khác cùng target trả conflict; chặn tự khóa/xóa hoặc admin active cuối; đặt blocked/deletion_pending |
| `server_finish_account_operation` | operation_id, stage, result_code | Kiểm tra state transition và guard còn đúng ID; không set active trước Auth unban; không giải phóng guard nếu chưa rõ kết quả Auth |
| `server_get_operation` | operation_id, verified_actor_id | Trạng thái retry/partial cho admin hợp lệ; không đưa secret/raw provider error |
| Notification `send_notification` | operation_id, verified_actor_id, audience, message_vi/en | Validate actor và recipient qua owner contract; local inbox/revisions + receipts |
| `server_list_accounts` | verified_actor_id, cursor, page_size | Trả account admin projection; Auth email lấy qua server khi thực sự cần, không table public |

Các contract `server_begin/finish/get_operation/list_accounts` thuộc Account Administration.
`verified_actor_id` chỉ do service lấy từ token đã xác minh; truyền ID không thay xác minh.
Mỗi owner vẫn kiểm tra actor/trạng thái; credential service không thay quyền user hoặc producer.
Operation idempotency phải so input_hash: cùng ID nhưng khác target/body trả conflict, không nhận nhầm replay.
Row lock của một RPC không kéo dài qua Auth HTTP. Guard bền vững theo target ở DATABASE/
ARCHITECTURE là đề xuất xử lý operation cạnh tranh; retry sau timeout không được chạy lệnh đối nghịch.

## 4. Spring APIs đề xuất theo service

Mỗi service có base URL riêng, frontend config ánh xạ theo owner; không giả định có Gateway.
Path prefix là namespace API, không là cam kết reverse proxy đã tồn tại.
Đây là catalog review, **không OpenAPI giả**; các chi tiết mới vẫn chờ duyệt.

| Owner | Endpoint candidate / capability | Requirement |
| --- | --- | --- |
| Catalog | GET public search/detail nếu không dùng Data API façade; POST/PATCH/DELETE `/api/catalog/admin/items` và `/{id}` | REQ-EXP-01..04, REQ-CNT-01..03, REQ-ADM-01..03 |
| Collection | GET/POST/PATCH/DELETE `/api/collections` và `/{id}`; POST/DELETE `/{id}/items`; POST `/api/collections/random` | REQ-SAV-01/02, REQ-RND-01..03; OQ-07 vẫn mở |
| Community | GET/POST `/api/community/comments`; PATCH/DELETE `/{id}`; POST reply dùng parentId | REQ-COM-01..03 |
| Notification | POST `/api/notifications/{id}/read`, `/api/notifications/read-all`; POST `/api/admin/notifications` | REQ-NOT-01..04 |
| Account Administration | Bảng account API bên dưới; GET `/api/accounts/me/access` | REQ-AUTH-02, REQ-ADM-04/05 |

Signatures transaction ở mục 3 là capability input/output, không chốt toàn bộ REST DTO/validation.
Không tạo OpenAPI hay UI integration trước khi schema/contract được duyệt.

| Method + path đề xuất | Input | Kết quả | Trace |
| --- | --- | --- | --- |
| GET `/api/admin/accounts` | cursor, pageSize | Page<AccountAdminSummary>, không password/token | REQ-ADM-04/05, phục vụ màn quản trị |
| POST `/api/admin/accounts/{id}/lock` | operationId | AccountOperation | REQ-ADM-04 |
| POST `/api/admin/accounts/{id}/unlock` | operationId | AccountOperation | REQ-ADM-04 |
| DELETE `/api/admin/accounts/{id}` | operation ID trong header `Idempotency-Key` | AccountOperation | REQ-ADM-05 |
| GET `/api/admin/operations/{id}` | Không body | AccountOperation có stage/result | Hỗ trợ retry đúng trạng thái |

AccountOperation: `{operationId, state, stage, errorCode?, retryable}`.
Hoàn tất đồng bộ trả 200; xử lý dở/lỗi upstream trả ProblemDetail với operationId và trạng thái partial.
Progress đã chọn: local block/hide trước, pending/partial trong lúc cleanup, completed chỉ khi đủ receipt.
HTTP 202/status URL và retry contract còn candidate; không trả completed nếu worker chưa xử lý xong.
Outbox poller trong owner đã chọn; không suy ra generic worker/takeover cho mọi operation.

Proposed error codes: UNAUTHENTICATED, FORBIDDEN, ACCOUNT_BLOCKED, VALIDATION_FAILED,
NOT_FOUND, CONTENT_UNAVAILABLE, VERSION_CONFLICT, OPERATION_CONFLICT, UPSTREAM_FAILURE.
Status 401/403/404/409/422/502/503 theo trường hợp; raw PostgREST errors được adapter ánh xạ,
không giả mọi RPC sẽ trả cùng HTTP codes khi chưa thiết kế SQL exception.
List/read không side effect; mutation Auth thất bại không được báo xóa thành công.

## 5. Storage, Realtime, map và SEO

- Upload direct private staging đã chọn, Catalog validate/promote ảnh hợp lệ sang public.
  Endpoint finalize DTO/policy/object immutability còn contract review, không dùng bucket public để bypass validation.
- Đề xuất Realtime chỉ Notification-owned `notification_signals` INSERT/UPDATE lọc user_id. Payload không chứa nội dung;
  khi nhận tín hiệu, đọc lại inbox/unread bằng Data API có RLS.
- Subscription trỏ bảng thật `notification.notification_signals`, không subscription vào façade view.
  SELECT/USAGE grants và publication cho custom schema cần kiểm chứng; không tự expose schema nội bộ
  qua Data API chỉ để bật Realtime. Hiện chưa tạo bảng hoặc đổi publication.
- Subscribe thành công rồi refetch snapshot, refetch sau reconnect/tab focus; dedup và không dựa riêng
  event để tính unread. Không subscribe DELETE riêng tư làm nguồn dữ liệu.
- Map dùng validated embed URL và Maps URL; không nhận nguyên `<iframe>` HTML từ admin.
- SSR public và ảnh public đã chọn; URL/canonical/locale routing còn review, không bịa endpoint đang tồn tại.

## 6. Internal API và event contracts — HTTP/outbox/HMAC đã chọn, wire format còn review

Không có anonymous internal endpoint. Supabase user JWT chỉ chứng minh user, không tự chứng minh service gửi.

| Owner cung cấp | Consumer / capability đề xuất |
| --- | --- |
| Catalog | Collection/Community gọi batch availability: ID/kind/version + available; không full content ẩn |
| Account Administration | Shared DB helper chỉ đọc current actor state, không enumerate/mutate; ngoại lệ đã duyệt DEC-031 |
| Collection | Xử lý Catalog lifecycle event, xác định audience và phát event người nhận; cleanup user riêng |
| Community | Cleanup targets/user với operation ID, scope/version và receipt; không gọi SQL Catalog |
| Notification | Ingest event đã authenticate/dedup, cleanup user; không nhận recipient giả từ browser |
| Tất cả owner có consumer | Endpoint ingest/status riêng; HTTPS/HMAC theo cặp đã chọn, exact URI/canonicalization/versioning còn review |

Envelope đề xuất:
`{eventId, eventType, schemaVersion, producer, aggregateId, aggregateVersion, occurredAt, operationId, correlationId, payload}`.
Producer lấy từ credential đã xác thực, không tin trường producer tự khai.
Consumer receipt unique(producer,eventId); nếu cùng ID nhưng payload khác thì conflict/quarantine, không ghi đè.
Chỉ ack sau durable local commit. Mỗi destination có delivery receipt riêng; duplicate không nhân inbox.

| Sự kiện candidate | Producer → consumer | Payload tối thiểu / kết quả |
| --- | --- | --- |
| `CatalogTargetHidden` | Catalog → Collection | IDs/kind/version, operationId, reason hidden/parent_hidden; giữ marker/audience, **không xóa comment** |
| `CatalogTargetDeleted` | Catalog → Collection, Community | IDs/kind/version, operationId, lifecycle deleted; Collection giữ marker/audience, Community mới cleanup và receipt |
| `CatalogTargetRestored` | Catalog → Collection | IDs/kind/version và effective availability; chỉ cập nhật projection nếu lifecycle rule được duyệt; không phục hồi payload đã xóa |
| `DishPublished` | Catalog → Collection | Dish/restaurant IDs/version; Collection xác định người lưu, không Catalog query saved |
| `SavedTargetUnavailable`, `SavedRestaurantDishAdded` | Collection → Notification | Event nguồn, recipient ID hoặc audience batch, đích có kiểu; Notification dedup theo recipient+sự kiện nghiệp vụ |
| `CommentReplied`, `CommentRemovedByAdmin` | Community → Notification | Recipient, target/comment IDs, không quote nội dung đã xóa |
| `UserCleanupRequested` hoặc owner cleanup API | Account Administration → các owner | User opaque ID, operation ID và scope; không passwords/email |

Recipient rules đã chọn: không self-reply, dedup nhiều bộ, món/quán public, broadcast active.
Saved-target/món mới phải save ở event và còn save khi xử lý gửi. Collection cung cấp evidence eligibility
cho hai mốc, không chỉ Notification tin audience đã tính từ lâu.
Boundary save/unsave/re-save, membership proof/retention, clock/version và final eligibility check→inbox commit
không nguyên tử xuyên owner: còn GATE-03, không hứa chính xác tuyệt đối khi chưa chốt semantics.
Ordering, partial batch, gap/replay, late event sau delete và receipt retention vẫn cần contract test.
Không suy “unavailable ⇒ delete comments”. Community chỉ xóa theo deletion command/event đã xác thực,
không xóa vì hidden event hoặc timeout Catalog. Event cũ không được ghi đè deletion watermark.
Notification dữ liệu riêng không broadcast ra browser qua event transport; Realtime là đường riêng mục 5.

## 7. Điều kiện trước khi contract thành baseline

1. Chốt G2-P về schema/connection, routing/transport, service identity và những hành vi tác động dữ liệu.
2. Chốt field validation, page limits, cursor format và enum errors.
3. Lập ma trận contract test allow/deny/replay/concurrency.
4. Chỉ sau đó tạo SQL migrations/types/OpenAPI thật trong task được duyệt.
