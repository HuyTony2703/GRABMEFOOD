# HTTP v1 — transport và operation dictionary

Áp dụng [quy tắc chung](README.md). Browser chỉ gọi cùng origin Next BFF
`http://localhost:3000/api/v1`; BFF chuyển qua Gateway, Gateway route owner.
Internal paths không exposed qua BFF/Gateway public router.

## Common types và transport

- `Target={type:"dish"|"restaurant",id:UUID}`.
- `Page<T>={items:T[],nextCursor:string|null}`; không fabricated total.
- `Ack={requestId:UUID}`; response201 có resource DTO; 204 không body.
- `Profile={id:UUID,displayName:string,handle:string|null,avatar:Media|null}`.
- `Media={id:UUID,url:string,source?:string,license?:string}` chỉ bytes đã kiểm,
  không arbitrary external URL do user gửi. Catalog DTO bắt buộc source/license
  attribution; avatar DTO không chứa private upload metadata.
- `Dish={id,name,description,categoryIds:UUID[],images:Media[],isDemo:true,revision}`.
- `Restaurant={id,name,description,address,areaId:UUID,images:Media[],isDemo:true,revision}`.
- `Offering={id,dishId,restaurantId,priceVnd:integer|null,available:boolean,revision}`.
  Public offering chỉ khi offering available và cả dish/restaurant published.
- `Comment={id,target,parentId:UUID|null,author:Profile,state:"visible"|"deleted"|"hidden",
  body:string|null,mentions:Profile[],revision,createdAt,updatedAt}`.
  Deleted/hidden DTO không body/mentions; tombstone không chứa snapshot text.
- `InboxItem={id,sourceId:UUID,groups:Group[],target:Target|null,commentId:UUID|null,
  broadcastId:UUID|null,readAt:timestamp|null,createdAt}`. Không copy hidden comment
  vào inbox; resolve deep link bằng quyền/public check hiện tại.
- `Group="reply"|"mention"|"restaurant_update"|"admin_broadcast"`.
- `Preferences={theme:"light"|"dark"|"system",notifications:{reply:boolean,
  mention:boolean,restaurantUpdate:boolean,adminBroadcast:boolean}}`.
- `Onboarding={state:"not_started"|"in_progress"|"skipped"|"completed",step:string|null}`.
  Step là định danh bước UI đã duyệt tại84, không tự dựng UI ở60.

Mọi JSON mutation `Content-Type: application/json`; upload multipart riêng. BFF
kiểm exact Origin và CSRF token gắn phiên/context, không cho wildcard credentials
CORS. Server dựng actor từ opaque cookie, xóa browser identity/internal headers.
Unknown fields422. JSON malformed400; invalid value422; authz ở
[authorization](authorization.md), không dựa vào việc nút UI có hiển thị.

## Pagination/search

`limit` integer1..50, default20; `cursor` opaque authenticated owner-generated
gắn endpoint/filters/sort/owner và last sort tuple. Không chứa PII/raw SQL.
Sai/chỉnh cursor hoặc đổi query dùng cursor cũ →400 `INVALID_CURSOR`.
Cursor không phải credential và không bỏ qua authorization.

| Collection | Thứ tự |
| --- | --- |
| Catalog/search | relevance desc/name asc/price asc, tie UUID asc |
| Offering lists | UUID asc |
| Saved | savedAt desc, targetId desc |
| Root comments/replies | createdAt asc, id asc |
| Inbox | createdAt desc, id desc |
| Admin lists/broadcasts/reports | createdAt desc, id desc |
| Mention suggestions | handle asc, id asc |

Search `GET /search?q=&type=dish|restaurant&categoryId=&areaId=&minPriceVnd=&maxPriceVnd=&sort=relevance|name|price`.
Omit type →cả2; category/area là UUID đơn; giá nguyên≥0, min≤max. Chuẩn hóa
Unicode/case/diacritics gồm đ/Đ cho matching, không sửa tên lưu. Empty q được
duyệt theo filter. Category món; với restaurant, category khớp món của offering.
Area và price/category cùng khớp **một offering public**; không ghép hai quán.
Price sort dùng min giá hợp lệ của các offering thỏa filter; null cuối, không0.
Relevance empty q fallback name normalized asc. Tie cuối type rồi UUID cho search
mixed; cursor giữ full tuple. Không hứa snapshot: concurrent edits có thể di chuyển
kết quả giữa trang; client dedup ID và cho refresh, mỗi trang kiểm publication mới.
Back/forward giữ q/filter/sort/cursor trong URL, restore scroll ở UI task.

## Public Catalog — owner Catalog, US1/US6

Tất cả paths dưới prefix `/api/v1`; auth `Public` không personalization.

| Method/path | Request | Success | Auth |
| --- | --- | --- | --- |
| GET `/dishes` | q/categoryId/areaId/minPriceVnd/maxPriceVnd/sort + page | 200 Page<Dish> | Public |
| GET `/restaurants` | như search, type cố định | 200 Page<Restaurant> | Public |
| GET `/search` | filters ở trên + page | 200 Page<{type,resource:Dish|Restaurant}> | Public |
| GET `/dishes/{id}` | UUID | 200 Dish | Public |
| GET `/restaurants/{id}` | UUID | 200 Restaurant | Public |
| GET `/dishes/{id}/offerings` | page | 200 Page<Offering + Restaurant> | Public |
| GET `/restaurants/{id}/offerings` | page | 200 Page<Offering + Dish> | Public |
| GET `/categories` | page, name asc/id asc | 200 Page<{id,name}> | Public |
| GET `/areas` | page, name asc/id asc | 200 Page<{id,name}> | Public |

Nonpublic/missing target404 `NOT_FOUND`, kể cả direct URL. Dependency outage503
`DEPENDENCY_UNAVAILABLE`, không empty200. Không coordinates/distance/rating.

## Auth/BFF — owner Community, US2

Private `Session` là session thường hợp lệ; `Verified` thêm verified;
`Admin` thêm role admin; `Recovery` không dùng cho Session/Verified/Admin.

| Method/path | Body/query | Success | Auth |
| --- | --- | --- | --- |
| POST `/auth/signup` | {email,password} | 202 {next:"verify_email"} | Anonymous + CSRF context |
| POST `/auth/login` | {email,password} | 200 {profile,verified,expiresAt}; Set-Cookie | Anonymous + CSRF context |
| POST `/auth/verification/resend` | {email} | 202 Ack | Anonymous/context or Session |
| POST `/auth/password/forgot` | {email} | 202 Ack | Anonymous + CSRF context |
| POST `/auth/logout` | {} | 204; clear cookie | Session; invalid cookie also clears |
| GET `/auth/session` | none | 200 {profile,verified,role,expiresAt} | Session |
| POST `/auth/password/change` | {currentPassword,newPassword,operationId:UUID} | 204; clear cookie, fresh login | Session |
| POST `/auth/password/reset` | {newPassword,operationId:UUID} | 204; clear recovery cookie | Recovery |
| GET `/auth/operations/{id}` | UUID | 200 {state:"pending"|"succeeded"|"failed_protected",next:"retry"|"login"} | bound operation context |
| POST `/auth/operations/{id}/reauth` | {proofKind:"password"|"recovery",currentPassword?:string} | 204; new opaque operation cookie | fresh purpose-bound proof, CSRF context |
| POST `/auth/operations/{id}/resume` | {newPassword?:string} | 204 succeeded/clear operation cookie; otherwise503 protected | fresh bound operation context, write-use proof |

Reauth không yêu cầu normal session đã bị thu hồi. `password` chỉ cho operation
kind=change, kiểm bằng supported Auth password API ngay request; `recovery` cho
reset hoặc khôi phục operation change đang pending khi không biết mật khẩu hiện
tại, lấy proof từ recovery cookie mới sau callback/state/PKCE, không token
do browser tự gửi. Bind verified provider subject → profile → operation cùng
account; UUID/email hoặc context hết hạn không là bằng chứng. Khi context hết
hạn trả401 `AUTH_CONTEXT_EXPIRED`, giữ operation/generation protected; người dùng
đi forgot→recovery callback mới, hoặc nhập mật khẩu hiện tại lại cho change.
Recovery proof chỉ cấp quyền tiếp tục đúng password operation của cùng account,
không thay đổi kind đã audit hoặc tạo operation thứ hai khi đang có active one.
Sai purpose403 `PROOF_PURPOSE_MISMATCH`, foreign operation404 **sau**
kiểm proof. Reauth response không tiết lộ account, không issue `gmf_session`.
Resume retries dùng cùng operationId, không tạo operation/generation mới.
Fresh proof/lease expiry không cho redispatch khi provider write trước còn
uncertain; return503 protected tới definitive outcome, không success giả.
Nếu provider update chưa được xác nhận, yêu cầu explicit newPassword và live
provider authority; không tự phát lại password cũ đã mất/không được persist.
Nếu đã confirmed update thì resume chỉ cleanup/reconcile, không đổi password
lần nữa. Chi tiết consumption/concurrency/custody ở authorization.md.

Auth provider password policy được kiểm bằng supported API; app không tự đặt
mật khẩu yếu hơn provider. Email/password chỉ đi server-only request, không log.
Enumeration-safe signup/resend/forgot có cùng accepted response cho account không
tồn tại/đã tồn tại; 202 chỉ xác nhận yêu cầu được nhận, **không khẳng định thư tới**.
Provider/network failure503; rate limit429 có Retry-After; không giả success.
Sai credentials401 generic, unverified có Session hạn quyền, private Verified
actions403 `EMAIL_VERIFICATION_REQUIRED`. Không auto-login sau signup/verify/reset.

`GET /auth/callback` là Next route ngoài API prefix: code/state/context cookie,
bind PKCE/purpose, một lần; verification → hướng fresh login; recovery → recovery
cookie + `/auth/reset-password`, không normal cookie. Callback lỗi400/410 có đường
forgot/resend; allowlisted relative return path, không arbitrary redirect. Chi tiết
state machine/fault contract ở authorization.md.

## Profile/settings — owner Community, US2

| Method/path | Body/query | Success | Auth |
| --- | --- | --- | --- |
| GET `/me/profile` | none | 200 Profile + Onboarding | Session |
| PATCH `/me/profile` | {displayName?,handle?,avatarId?} | 200 Profile | Session |
| GET `/me/preferences` | none | 200 Preferences | Session |
| PATCH `/me/preferences` | partial theme/notification booleans | 200 Preferences | Session |
| PATCH `/me/onboarding` | {state,step} | 200 Onboarding | Session |
| POST `/me/avatar` | multipart file | 201 Media | Session |
| DELETE `/me/avatar` | none | 204, clear reference | Session |
| GET `/profiles/suggestions` | q + page | 200 Page<Profile> | Public |

DisplayName trim then2..60 Unicode code points; handle `^[a-z0-9_]{3,30}$`,
unique, immutable after first assignment. Existing same handle no-op; change409
`HANDLE_IMMUTABLE`; collision409 `HANDLE_TAKEN`. Null handle profile không được
mention qua suggestions; suggestions chỉ công khai tên/handle/avatar/UUID.
AvatarId phải là media của actor; không nhận userId/role/email trong profile.
Onboarding skipped giữ step để tiếp tục, không đồng nghĩa completed.
Bốn nhóm default=true theo **remediation approval mới**, không approval6/6:
reply, mention, restaurantUpdate (cập nhật quán đã lưu), adminBroadcast
(broadcast quản trị); API/storage mapping tại events/data-model.

## Saved/random — owner Community, US3

| Method/path | Body/query | Success | Auth |
| --- | --- | --- | --- |
| PUT `/me/saved/{type}/{id}` | none | 204 | Verified |
| DELETE `/me/saved/{type}/{id}` | none | 204, kể cả absent | Verified |
| GET `/me/saved` | type=dish|restaurant + page | 200 Page<{target,resource,savedAt}> | Verified |
| POST `/me/random` | {type:"dish"|"restaurant"} | 200 {result:{target,resource}|null,reason:"empty"|null} | Verified |

PUT kiểm Catalog public qua HTTP trước lưu, unique actor/type/id. DELETE không
cần Catalog để bỏ target đã biến mất. List/random validate public hiện tại, không
expose stale snapshots. Catalog lỗi503, không result empty. List pagination scan
raw saved cho tới đủ valid results hoặc hết; nextCursor dựa scanned tuple, không
dùng discarded content như target cursor public.
Random previous result giữ per(actor,type), server serializes random/unsave qua
actor/type revision để target bỏ lưu trước result-finalization không được chọn;
không DB transaction qua Catalog HTTP. Recheck membership/version sau HTTP,
retry bounded khi conflict, exhausted409 `SAVED_SET_CHANGED`, không chọn stale.
0 valid → result null/empty;1 →nó;≥2 → loại previous nếu nó còn valid. Không
nhận filters/previousId browser để override server state.

## Comments/moderation — owner Community, US4

| Method/path | Body/query | Success | Auth |
| --- | --- | --- | --- |
| GET `/comments` | targetType,targetId + page | 200 Page<Comment> root | Public |
| GET `/comments/{id}/replies` | page | 200 Page<Comment> | Public |
| POST `/comments` | {target,parentId:null|UUID,body,mentionIds:UUID[],requestId:UUID} | 201 Comment | Verified |
| PATCH `/comments/{id}` | {body,mentionIds,revision} | 200 Comment | Verified owner |
| DELETE `/comments/{id}` | none | 204 tombstone | Verified owner |
| POST `/comments/{id}/reports` | {reason:string,requestId:UUID} | 201 {id,state:"open"} | Verified |
| GET `/admin/reports` | page | 200 Page<{id,commentId,reason,state}> | Admin |
| POST `/admin/comments/{id}/moderation` | {action:"hide"|"restore",reason,revision} | 200 Comment | Admin |

Body plain text trim1..2000 code points; max10 unique mention IDs cho profile có
handle, không parse displayName làm identity. Render escape text, không HTML.
Parent phải root cùng target và visible khi tạo reply; không reply-to-reply.
Deleted root giữ replies còn valid; hidden parent không lộ thread khi hidden,
restore không phục hồi author-deleted body. Owner không edit hidden/deleted để
bypass moderation; conflict409. Catalog target phải public khi đọc/tạo, lỗi503
không fallback. Theo **remediation approval mới**, edit cập nhật mentions nhưng
không tạo sự kiện notification mới cho cùng interaction; creation event là nguồn
reply+mention duy nhất. Event đang chờ dùng creation recipient refs bất biến,
không dùng mentions mới của comment đã edit để gửi thêm người.
Revision mismatch409 `REVISION_CONFLICT`; foreign ownership404 tránh enumeration.
Report reason nonempty plain text; admin không có DTO sửa lời tác giả.

## Inbox/broadcast — owner Notification, US5

| Method/path | Body/query | Success | Auth |
| --- | --- | --- | --- |
| GET `/me/inbox` | unreadOnly? boolean + page | 200 Page<InboxItem> | Verified |
| GET `/me/inbox/unread-count` | none | 200 {count:integer≥0} | Verified |
| PUT `/me/inbox/{id}/read` | none | 204 idempotent | Verified owner |
| POST `/me/inbox/read-all` | {} | 200 {readThrough:timestamp} | Verified |
| POST `/admin/broadcasts` | {title,body,requestId:UUID} | 201 {id,state:"draft",title,body,revision} | Admin |
| PATCH `/admin/broadcasts/{id}` | {title,body,revision} | 200 draft | Admin |
| POST `/admin/broadcasts/{id}/preview` | {revision} | 200 {title,body,audience:"verified_users",preferenceGroup:"admin_broadcast"} | Admin |
| POST `/admin/broadcasts/{id}/send` | {revision,requestId:UUID} | 202 {id,state:"queued"} | Admin |
| GET `/admin/broadcasts` | page | 200 Page<broadcast metadata> | Admin |

Broadcast title trim1..120/body trim1..2000 plain code points. Preview không
claim recipient count/email delivery; send authz lại, freeze revision, immutable
queued/sent payload; retry cùng requestId không gửi hai lần.
Read-all updates rows hiện có trong owner transaction, không đánh dấu arrivals
sau snapshot; concurrent read không reset readAt. Foreign inbox ID404.
Polling UI: chỉ visible+signed-in, một request đang bay, interval15s local default,
pause hidden/logout/offline, resume immediate khi visible, backoff429/503 theo
Retry-After, không retry storm. Đây là target để đo tại111, không quota claim.
Deep link unavailable → fallback tiếng Việt, không render content từ stale event.

## Admin Catalog/media — US6

| Method/path | Body/query | Success | Auth |
| --- | --- | --- | --- |
| POST `/admin/dishes` | {name,description,categoryIds,mediaIds,isDemo:true} | 201 Dish + status:"draft" | Admin |
| PATCH `/admin/dishes/{id}` | partial same fields + revision | 200 draft/current | Admin |
| POST `/admin/restaurants` | {name,description,address,areaId,mediaIds,isDemo:true} | 201 Restaurant + status:"draft" | Admin |
| PATCH `/admin/restaurants/{id}` | partial same fields + revision | 200 draft/current | Admin |
| POST `/admin/offerings` | {dishId,restaurantId,priceVnd:null|integer≥0,available:boolean} | 201 Offering | Admin |
| PATCH `/admin/offerings/{id}` | priceVnd?/available? + revision | 200 Offering | Admin |
| POST `/admin/{dishes|restaurants}/{id}/publication` | {status:"draft"|"published",revision} | 200 resource | Admin |
| GET `/admin/{dishes|restaurants}` | status? + page | 200 Page<resource + status> | Admin |
| POST `/admin/media` | multipart file + source/license | 201 Media | Admin |

Name/address khi có nonempty trimmed plain text; no guessed price/location.
Publications validate local relations/media ready/demo marker. Price/add/remove
published offering emits event, mere name/photo/description edits do not.
Upload for avatar/catalog: ≤5 MiB, JPEG/PNG/WebP verified decoded MIME/signature,
reject SVG/HTML/polyglot/oversize413/415/422, random owner-generated object key,
no overwrite arbitrary path; clear EXIF, source/license required catalog.
Return201 chỉ sau Storage write và owner metadata commit; partial failure không
attach fake image, track orphan để cleanup task được duyệt riêng. Buckets/policies
public/private phải tuân publication/revocation, không expose drafts bằng raw URL.

## Media GET proxy — Catalog/Community own bytes authorization

Tất cả paths có prefix `/api/v1`, qua Next BFF→Gateway→owner→private Storage.
`Media.url` do owner tạo theo loại DTO; browser không nhận object_key/Storage
credential/signed private URL. Không nhận URL/path upstream từ user (no open proxy).

| Method/path | Actor / owner check mỗi request | Success |
| --- | --- | --- |
| GET `/media/catalog/{id}` | Guest/user/admin như nhau: Catalog media ready đang gắn ít nhất một dish/restaurant published | 200 sanitized bytes |
| GET `/admin/media/{id}` | Normal verified Admin, Community ledger đồng bộ + Catalog media ready; được đọc draft hoặc uploaded chưa gắn thuộc Catalog | 200 sanitized bytes |
| GET `/media/avatars/{profileId}` | Guest/user/admin: Community chỉ lấy sanitized ready avatar **đang gắn** profile công khai, không nhận mediaId tùy ý | 200 sanitized avatar bytes |
| GET `/me/avatar/{id}` | Normal Session, Community ledger + avatar_media.profile_id=actorId, media ready; có thể preview chưa gắn | 200 sanitized avatar bytes |

Draft Catalog qua public route404 kể cả actor admin; dùng admin route với quyền
hiện tại. User thường không có quyền Catalog draft; recovery-only không private
media. Avatar chưa gắn hoặc đã bỏ gắn không đọc qua public profile route; private
preview chỉ chính chủ, **không admin override** để đọc avatar riêng của người khác.
Public profile/avatar chỉ chứa tên/handle/avatar đã public, không email/token/
original upload/EXIF. Avatar pending/failed, không có avatar, foreign preview/
missing media trả404; sai admin role403; invalid session401; authority/Storage
unavailable503, không trả bytes cũ hoặc placeholder giả200.

Owner kiểm publication/attachment/ownership **trước** Storage fetch và trước
response admission; image ID không là capability. Cùng revocation semantics:
request được authorize trước mốc revoke có thể xong, request mới phải kiểm lại.
Public attachment/publication state là điều kiện đọc, không positive cache.

Tất cả media success/error dùng `Cache-Control: private, no-store`,
`Vary: Cookie, Authorization`, `X-Content-Type-Options: nosniff`; content-type
chỉ decoded JPEG/PNG/WebP, content-disposition inline filename owner-generated.
Next image optimizer/CDN/service-worker không shared cache hoặc fetch upstream
bỏ qua owner check; render proxy URL trực tiếp, không automatic optimizer cache.
Không trả304 từ If-None-Match/If-Modified-Since; mỗi GET kiểm lại rồi200 bytes
hoặc error. Không hỗ trợ Range ởv1, bỏ qua Range và trả full200 sau authorization;
không HEAD route riêng bypass. No redirect/signed URL hoặc Storage error body tới
browser. Private buckets reject raw direct reads; signed privileged reads chỉ
owner server gọi, không chuyển URL cho client. Cache không thu hồi được bytes
đã tải trước đó; contract chỉ bảo vệ authorization mới, không hứa xóa ảnh khỏi máy.

## Internal HTTP — credential-bound, không browser access

| Owner/method/path | Input | Output / policy |
| --- | --- | --- |
| Community POST `/internal/v1/authorize` | {sessionHandle,action,resource?,requestId} | {actorId,verified,role,generation,authorizedAt}; fresh DB decision only |
| Catalog POST `/internal/v1/targets/resolve` | {targets:Target[]} | {items:[{target,public:boolean,resource:null|DTO}]} |
| Community PUT `/internal/v1/recipient-decisions/{eventId}` | immutable envelope/input hash | persisted {id,decidedAt,recipients:[{userId,groups}],inputHash}; event protocol |
| Community GET `/internal/v1/recipient-decisions/{eventId}` | receipt page cursor | immutable paged receipt,404 if absent |

Only Notification can request/read recipient receipts; only allowlisted services
authorize/resolve. Session handle server transport only, redact headers/bodies.
Missing target public=false is distinct from whole-call503. Internal batch uses
same limit50; larger candidate decisions persisted completely then paginated.
No DB transaction spans any HTTP/RabbitMQ/Auth/Storage await.

## Error dictionary

`application/problem+json`:
`{type:"urn:grabmefood:problem:<code>",title:string,status:number,code:string,
requestId:UUID,detail?:string,errors?:[{field,code}]}`.
No raw provider/DB message/stack/token/email. Detail tiếng Việt an toàn.

| Status | Stable codes |
| --- | --- |
| 400 | MALFORMED_REQUEST, INVALID_CURSOR, CALLBACK_INVALID |
| 401 | SESSION_INVALID, INVALID_CREDENTIALS, AUTH_CONTEXT_EXPIRED |
| 403 | FORBIDDEN, EMAIL_VERIFICATION_REQUIRED, CSRF_REJECTED, PROOF_PURPOSE_MISMATCH |
| 404 | NOT_FOUND |
| 409 | HANDLE_TAKEN, HANDLE_IMMUTABLE, REVISION_CONFLICT, SAVED_SET_CHANGED, IDEMPOTENCY_CONFLICT |
| 410 | CALLBACK_EXPIRED |
| 413 / 415 | UPLOAD_TOO_LARGE / UNSUPPORTED_MEDIA_TYPE |
| 422 | VALIDATION_FAILED, INVALID_THREAD |
| 429 | RATE_LIMITED (Retry-After integer seconds) |
| 503 | DEPENDENCY_UNAVAILABLE, CREDENTIAL_OPERATION_PENDING |

Service/timeouts fail closed503, no private side effects after failed authz.
Unexpected500 INTERNAL_ERROR with safe requestId. No blind write retry: requestId/
operationId scoped actor+operation with input hash, same key different payload409.
PUT/DELETE/read idempotent; create/send/comment require requestId as above.
Auth credential operations use operationId + protected recovery state, not generic
replay of password bodies; never persist/log plaintext password for idempotency.
