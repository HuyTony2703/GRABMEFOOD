# Data model — SCRUM-60 design, no applied migration

Nguồn [spec](spec.md), [contracts](contracts/README.md), ADR-0001/0002.
Schema boundaries là ràng buộc bắt buộc; bảng dưới là thiết kế không phải kết quả
`list_tables` mới. Cloud Auth giữ email/password/verification primitives; app
không tạo FK vào `auth.users`, không SQL `auth.sessions`/Storage internals.

## Field conventions / constraints để chuyển nguyên văn sang tasks

Mỗi block Cxx là normative migration/validation constraint. Fields không ghi `?`
đều NOT NULL; `?` nullable. UUID PK `id`, timestamps UTC `created_at/updated_at`
áp dụng mọi domain row trừ composite PK được ghi rõ. Revisions bắt đầu1, tăng
trong owner transaction. Metadata/hashes không được chứa password/raw handle.

**C00**: Fields không ghi `?` đều NOT NULL; `?` nullable. UUID PK `id`, timestamps UTC `created_at/updated_at` áp dụng mọi domain row trừ composite PK được ghi rõ. Revisions bắt đầu1, tăng trong owner transaction. Metadata/hashes không được chứa password/raw handle.

## Catalog — owner/runtime role Catalog

| Entity | Fields ngoài C00 | Quan hệ/index |
| --- | --- | --- |
| dishes | name:text, description:text, status:publication, is_demo:boolean, revision:int | status/name/id; category links |
| restaurants | name:text, description:text, address:text, area_id:UUID, status:publication, is_demo:boolean, revision:int | FK areas; status/area/name/id |
| offerings | dish_id:UUID, restaurant_id:UUID, price_vnd?:bigint, available:boolean, revision:int | FK dishes/restaurants; pair unique; dish/restaurant/available/price |
| categories / areas | name:text, normalized_name:text | normalized_name/id search |
| dish_categories | dish_id:UUID, category_id:UUID | composite PK; both local FK |
| media | object_key:text, owner_entity_id?:UUID, state:media_state, mime:text, byte_size:bigint, source:text, license:text | object_key unique; pending state |
| dish_media / restaurant_media | entity_id:UUID, media_id:UUID, position:int | composite PK; local FK; position≥0 |
| outbox | xem shared reliability dictionary | producer=Catalog |

**C01**: publication ∈ {draft,published}; name/address khi có phải nonempty sau trim; is_demo=true cho demo content; không giá/vị trí/rating tự suy ra.

**C02**: price_vnd nullable hoặc integer≥0; UNIQUE(dish_id,restaurant_id); public offering cần available=true và cả dish/restaurant published; filter area/price/category cùng một offering.

**C03**: media_state ∈ {pending,ready,failed}; byte_size≤5242880 và >0; mime ∈ {image/jpeg,image/png,image/webp}; object_key unique; catalog source/license nonempty; chỉ attach media ready thuộc đúng owner.

Publication chỉ expose validated ready media; draft bytes không public bypass.
Catalog/Community media đọc qua owner-authorized proxy routes; storage bucket private,
không public raw object URL/signed private URL giao browser bypass ledger.
`Media.url` là owner proxy URL qua BFF/Gateway, public content recheck publication;
avatar public DTO chỉ expose sanitized avatar, không session-private bytes.
Storage policy/bootstrap chi tiết được test ở69/71, không mutate ở60.

Search normalized Vietnamese expression/index thuộc Catalog; search index chỉ
published/available paths, bigint numeric sorting null-last. Không cross-schema join.

## Community — owner/runtime role Community

| Entity | Fields ngoài C00 | Quan hệ/index |
| --- | --- | --- |
| profiles | auth_user_id:UUID, display_name:text, handle?:text, avatar_media_id?:UUID, verified:boolean, role:app_role, generation:int, admission_blocked:boolean, revision:int | auth_user_id unique external ref; handle unique nonnull; local media FK |
| preferences | profile_id:UUID, theme:theme, reply:boolean, mention:boolean, restaurant_update:boolean, admin_broadcast:boolean, revision:int | profile_id unique local FK |
| onboarding | profile_id:UUID, state:onboarding_state, step?:text | profile_id unique local FK |
| avatar_media | object_key:text, profile_id:UUID, state:media_state, mime:text, byte_size:bigint | object_key unique; local profiles FK |
| saved | profile_id:UUID, target_type:target_type, target_id:UUID, revision:int | unique(profile_id,target_type,target_id); listing/profile/type/created_at |
| saved_sets | profile_id:UUID, target_type:target_type, revision:int, previous_target_id?:UUID | composite PK; serializes random/unsave CAS |
| comments | author_id:UUID, target_type:target_type, target_id:UUID, parent_id?:UUID, body?:text, author_deleted:boolean, moderator_hidden:boolean, revision:int | local profile/self FK; target/parent/created_at/id |
| mentions | comment_id:UUID, mentioned_profile_id:UUID | composite PK; local FKs |
| reports | comment_id:UUID, reporter_id:UUID, reason:text, state:report_state | local FKs; state/created_at/id |
| moderation_audit | comment_id:UUID, actor_id:UUID, action:text, reason:text, previous_hidden:boolean, new_hidden:boolean | local FKs; append-only |
| app_sessions | profile_id:UUID, handle_digest:bytes, generation:int, state:session_state, last_authorized_at:timestamp, absolute_expires_at:timestamp, revoked_at?:timestamp, token_ciphertext?:bytes, token_version:int | digest unique; profile/state/expiry; local profile FK |
| auth_contexts | handle_digest:bytes, purpose:context_purpose, profile_id?:UUID, operation_id?:UUID, generation?:int, pkce_ciphertext?:bytes, state_digest:bytes, expires_at:timestamp, consumed_at?:timestamp, provider_proof_ciphertext?:bytes, encryption_key_id?:text, proof_subject?:UUID, proof_kind?:text, proof_verified_at?:timestamp, proof_expires_at?:timestamp | digest unique; expiry; profile/operation local FK; encrypted proof, no plaintext password |
| credential_operations | profile_id:UUID, operation_id:UUID, kind:credential_kind, state:credential_state, generation:int, provider_update_confirmed:boolean, cleanup_confirmed:boolean, failure_code?:text, attempt_version:int, lease_until?:timestamp, provider_attempt_state:remote_attempt_state, dispatched_at?:timestamp | operation_id unique; one active/profile; CAS/attempt fencing; no password |
| recipient_decisions | producer:text, event_id:UUID, input_hash:bytes, decided_at:timestamp, recipient_count:int | unique(producer,event_id); immutable including count0 |
| decision_recipients | decision_id:UUID, profile_id:UUID, groups:text[] | composite PK; local FKs; immutable |
| idempotency_keys | profile_id:UUID, operation:text, request_id:UUID, input_hash:bytes, resource_id:UUID | unique(profile_id,operation,request_id) |
| outbox | shared reliability dictionary | producer=Community |

**C04**: display_name trim2..60 Unicode code points; handle nullable trước chọn, sau chọn phải ^[a-z0-9_]{3,30}$, UNIQUE và immutable.

**C05**: theme ∈ {light,dark,system}; app_role ∈ {user,admin}; onboarding_state ∈ {not_started,in_progress,skipped,completed}; notification groups là bốn boolean độc lập; step nullable được giữ khi skipped.

**C06**: target_type ∈ {dish,restaurant}; UNIQUE(profile_id,target_type,target_id) cho saved; target_id external UUID không cross-service FK; random previous per(profile_id,target_type), CAS saved_set revision, không filters/fallback.

**C07**: visible comment body trim1..2000 code points, ≤10 unique mentions theo profile ID có handle; parent chỉ root cùng target; không reply dưới reply; author_deleted xóa body/mentions, giữ tombstone và replies khác; moderator_hidden không được restore body author_deleted.

**C08**: report_state ∈ {open,resolved}; reason nonempty plain text; moderation audit append-only; admin chỉ hide/restore, không sửa body; reply creation cần parent visible.

**C09**: session_state ∈ {active,revoked}; handle_digest unique, raw handle không lưu; idle≤24h và absolute≤7d; token_ciphertext chỉ server-side encrypted; session generation phải bằng profile generation và admission_blocked=false khi authorize.

**C10**: context_purpose ∈ {verification,recovery,credential_operation,csrf}; context expiry≤10m và không vượt provider expiry khi có; purpose/state/PKCE bound và one-use; recovery không normal session admission.

**C11**: credential_kind ∈ {change,reset}; credential_state ∈ {protected_pending,provider_updated,succeeded,failed_protected}; operation_id unique, tối đa một active operation/profile; durable generation bump/revoke trước provider update; partial failure không hạ generation hoặc restore session; succeeded cần provider_update_confirmed và cleanup_confirmed.

**C12**: recipient receipt UNIQUE(producer,event_id), input_hash immutable, recipient_count≥0; decision_recipients PK(decision_id,profile_id), groups nonempty subset{reply,mention,restaurant_update,admin_broadcast}; snapshot đầy đủ saved/preferences bền vững trước HTTP response; retry reuse cả empty decision.

**C13**: idempotency UNIQUE(profile_id,operation,request_id); same key different input hash là conflict, không duplicate mutation/event; không persist password hoặc password-derived retry hash.

Default preferences new profile: theme=system; bốn nhóm reply, mention,
restaurant_update (cập nhật quán đã lưu), admin_broadcast (broadcast quản trị)
enabled theo **remediation approval mới**, không thuộc approval6/6 trước.
Onboarding not_started/step null, handle null đến owner chọn, role user qua
supported bootstrap. Test own-user persistence, không tự trao admin.
Email không nằm public profile; verified mirrored only from provider
proof, admission refresh synchronizes status; admin granted only approved bootstrap.
All-session revocation mechanism ở authorization.md; not SQL Auth internals.

## Notification — owner/runtime role Notification

| Entity | Fields ngoài C00 | Quan hệ/index |
| --- | --- | --- |
| broadcasts | actor_id:UUID, title:text, body:text, state:broadcast_state, revision:int, queued_at?:timestamp | external actor ref; state/created_at/id |
| inbox | source_kind:text, source_id:UUID, recipient_id:UUID, groups:text[], target_type?:target_type, target_id?:UUID, comment_id?:UUID, broadcast_id?:UUID, read_at?:timestamp | unique(source_kind,source_id,recipient_id); recipient/created_at/id + unread partial |
| event_intake | producer:text, event_id:UUID, input_hash:bytes, envelope?:json, state:intake_state, attempt:int, lease_until?:timestamp, next_attempt_at?:timestamp, error_code?:text | unique(producer,event_id); pending/next_attempt |
| delivery_decisions | producer:text, event_id:UUID, receipt_id:UUID, input_hash:bytes, decided_at:timestamp, import_complete:boolean | unique(producer,event_id); immutable authority fields |
| delivery_recipients | decision_id:UUID, user_id:UUID, groups:text[] | composite PK, local decision FK |
| follow_projection | user_id:UUID, restaurant_id:UUID, saved:boolean, revision:int | composite PK; restaurant/saved; advisory only |
| preference_projection | user_id:UUID, groups:json, revision:int | user_id PK; advisory only |
| processed_events | producer:text, event_id:UUID, input_hash:bytes, completed_at:timestamp | composite PK; never payload-TTL-purged |
| replay_audit | event_id:UUID, producer:text, operator_ref:text, reason:text, outcome:text | append-only, no tokens/PII payload |
| outbox | shared reliability dictionary | producer=Notification (broadcast) |

**C14**: broadcast_state ∈ {draft,queued,sent}; title trim1..120/body trim1..2000 code points plain text; queued revision immutable; send idempotent by requestId; admin checked at send.

**C15**: inbox UNIQUE(source_kind,source_id,recipient_id); groups union reply+mention; self-recipient excluded; read_at nullable, once set not reset by replay; all-read only rows in transaction snapshot; no automatic inbox purge.

**C16**: intake_state ∈ {pending,processing,completed,dead}; attempt≥0; event identity/hash immutable; ACK after durable intake commit; processed_events/delivery_decisions retained without automatic purge; importing recipient pages must finish before completion.

**C17**: projections accept only newer revision; external IDs no cross-service FK; authoritative Community enumeration cannot be restricted by projection; Community unavailable means pending, not empty/fallback.

## Shared owner-local reliability dictionary

Each service's own `outbox`: id/event_id UUID unique, aggregate_type text,
aggregate_id UUID, aggregate_version integer, event_type text, schema_version
integer, payload JSON, occurred_at timestamp, correlation_id UUID, causation_id?
UUID, sent_at? timestamp, attempts integer, next_attempt_at? timestamp,
last_error_code? text. No cross-schema shared table. Canonical envelope in events.md.

**C18**: domain change+outbox atomic; aggregate_version≥1, schema_version=1, attempts≥0; publisher confirm không consumer commit; sent payload giữ30d từ sent_at, unsent không age-purge như sent.

**C19**: failed payload/DLQ giữ30d; dedup keys/recipient receipts/inbox/tombstone/moderation audit không automatic purge; replay giữ event ID và read state, quá hạn payload cần quy trình riêng.

**C20**: runtime roles riêng chỉ own schema DML/sequence cần thiết, không DDL/owner/superuser; migration principal riêng≤1 khi duyệt; không cross-service SQL/joins/FK hoặc FK Auth/Storage internals; DB TLS chain+hostname; pool caps Catalog4/Community4/Notification2.

## Remediation constraints — authority mới, không hồi tố approval6/6

**C21**: defaults reply/mention/restaurant_update/admin_broadcast=true; reply/mention chỉ phát khi tạo comment/reply, không phát lại khi edit; creation recipient refs bất biến, preferences vẫn xét tại recipient decision.

**C22**: media GET phải recheck ready/publication/attachment hoặc ledger+ownership mỗi request; draft Catalog chỉ Admin, unattached avatar chỉ chính chủ; private Storage, no signed URL tới browser; Cache-Control private,no-store; không304/shared cache.

**C23**: operation reauth cần fresh proof đúng subject/purpose và expiry; operation context bind profile_id/operation_id/generation, expiry≤10m và≤proof expiry; provider_proof_ciphertext encrypted server-only, erase sau use/expiry; attempt_version≥1 CAS, lease/fencing chống concurrent resume; không restore phiên cũ hoặc recovery auto-login.

Auth context field constraints: credential_operation context có profile_id,
operation_id,generation và proof subject/kind/verified_at/expires_at/encryption key
trước write admission; proof_kind ∈ {password,recovery}, subject=profile.auth_user_id;
expires_at≤proof_expires_at. Provider proof ciphertext chỉ nullable trước acquisition
hoặc sau secure erasure; status-only metadata không cấp lại write authority.
Initial verification/CSRF contexts có nullable operation/proof fields vì chưa bind
account/operation; không được dùng chúng cho resume. Operation generation không
thay đổi khi renew proof; terminal success immutable; lease timeout chỉ claim lại
coordination, không mở admission. remote_attempt_state ∈ {not_dispatched,dispatched,
confirmed,rejected,uncertain}; dispatched_at nullable trước dispatch. Persist
dispatched trước remote call; timeout/crash→uncertain, không redispatch tới definitive
outcome. Fresh proof không là bằng chứng attempt cũ đã kết thúc; không có supported
reconciliation thì protected503/escalation, không SQL/admin override. T006/T030
implement/test state guard này, không assume DB fencing fence được provider.
No cross-service FK vì toàn bộ authority ở Community.

## ERD bổ sung cho delivery/session

```mermaid
erDiagram
  COMMUNITY_PROFILES ||--o{ COMMUNITY_APP_SESSIONS : owns
  COMMUNITY_PROFILES ||--o{ COMMUNITY_CREDENTIAL_OPERATIONS : protects
  COMMUNITY_RECIPIENT_DECISIONS ||--o{ COMMUNITY_DECISION_RECIPIENTS : freezes
  NOTIFICATION_EVENT_INTAKE ||--o| NOTIFICATION_DELIVERY_DECISIONS : imports
  NOTIFICATION_DELIVERY_DECISIONS ||--o{ NOTIFICATION_DELIVERY_RECIPIENTS : stages
```

Đường HTTP receipt không là FK trong diagram. Data tests phải chứng minh local
FK/CHECK/unique/partial index/triggers hoặc transaction invariants tương ứng;
app validation không thay DB uniqueness. Không tạo migration ở60.
