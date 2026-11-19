# Cloud V2 — target verification và reset/rebuild boundary

## SCRUM-66 — owner audit và no-op trong phạm vi được duyệt

Owner cung cấp hai ảnh Dashboard, xác nhận project
`bdhavbwmxbttymerizvx` và nói **vừa chụp ở hiện tại**. Agent ghi nhận nhận ảnh
`2026-11-17T06:55:28.9239289Z` UTC; timestamp và timezone chụp chính xác chưa
xác nhận, không coi receipt time là capture time. Tên project hiển thị trong
ảnh, project ref là owner report, không tự nhận ảnh chứng minh ref độc lập.

- Auth → Users: search trống, All users; “No users in your project” và footer
  **“Total: 0 users”**. Ảnh cũ footer “10 users (estimated)” giữ lịch sử;
  không bịa nguyên nhân thay đổi hoặc đồng nhất hai thời điểm.
- Storage → Files → Buckets: không liệt kê bucket, empty state
  “Create a file bucket”; không có bucket hiển thị để kiểm public/private hay
  objects. Không suy toàn Storage/mọi object loại khác được enumerate.
- Owner chấp nhận hai ảnh làm evidence kiểm kê Auth Users và Storage Files/
  Buckets cho **SCRUM-66**, thay yêu cầu source API/SQL cho hai hạng mục này.
  AI chưa enumerate độc lập bằng API/SQL. Proposal API cũ bên dưới là lịch sử,
  không được phê duyệt và không chạy.
- Metadata MCP06:49UTC: URL đúng; `list_tables` public/catalog/community/
  notification → `tables:[]`, `list_migrations` → `migrations:[]`, chi tiết
  inputs/timestamps ở section partial audit bên dưới. Không chứng minh schemas
  tồn tại hay mọi database/project object rỗng. No-op chỉ trong phạm vi tables/
  migration metadata đã hỏi và Auth/Storage Files Dashboard owner chấp nhận.
- Kết luận **no-op trong phạm vi trên**: không có thao tác xóa/reset cần thực hiện
  dựa trên evidence này; không phải blanket project-clean, không backup/restore
  proof, không xóa dữ liệu hay Cloud mutation. Legacy backup waiver SCRUM-54 vẫn
  không cấp quyền xóa. Nếu sau này phát hiện dữ liệu khác, dừng và hỏi owner.

Jira SCRUM-66 đã Done; parent47 được review sau khi cả65/66 Done và cũng Done.
TLS transport chain+hostname PASS của65 không phải
DB login/SQL PASS. DB-driver/role/grants/Auth/Storage/session runtime tests thuộc
task đích, chưa chạy. Không tự thực hiện67, migration/seed hoặc commit/push.

**2026-11-17, SCRUM-65 Done theo phương án A; KHÔNG phải runbook cho phép reset.**

## SCRUM-66 — partial read-only audit, 2026-11-17T06:49 UTC

**Evidence tại mốc06:49: chưa đủ no-op; cập nhật owner audit mới ở đầu file.**
User giao kiểm đúng target, chỉ metadata
read-only; chưa duyệt Auth/Storage API, SQL, xóa/reset hoặc Cloud mutation.
SCRUM-65 Done, parent47 In Progress. `opencode.jsonc` project-only Supabase MCP:
`project_ref=bdhavbwmxbttymerizvx`, `read_only=true`; scope
`docs,database,development`, chỉ metadata tools trong permission matrix.

| Call thực chạy | Thời điểm UTC | Input / kết quả | Giới hạn |
| --- | --- | --- | --- |
| `supabase.get_project_url()` | bắt đầu06:49:08.451Z | `https://bdhavbwmxbttymerizvx.supabase.co` | Xác minh identity API của MCP, không login DB |
| `supabase.list_tables({schemas:["public","catalog","community","notification"],verbose:false})` | batch06:49:13.881Z→06:49:14.490Z | `{"tables":[]}` | Không thấy tables trong scope tool/schema hỏi; không chứng minh schema tồn tại, mọi objects hay mọi schema rỗng |
| `supabase.list_migrations()` | cùng batch | `{"migrations":[]}` | Không thấy applied migration history qua tool; không chứng minh không có object tạo ngoài migrations |

Các call đọc song song sau khi URL đúng; không auth DB/SQL, probe, mutation hoặc
xóa. Không thấy unexpected **table/migration** trong phạm vi call; không kết luận
không có bất kỳ dữ liệu khác.

Evidence owner65 là input, không independent66: owner xác nhận0users sau kiểm tra;
footer ảnh cũ10estimated giữ lịch sử; ảnh Dashboard Storage không liệt kê bucket.
Thời điểm ghi nhận và thời gian chụp khác nhau, capture timestamp chưa biết.
Chưa independently enumerate Auth users/buckets/objects; không suy object count0.
AC66 yêu cầu chứng minh không có legacy/Auth users/Storage legacy và audit counts/
schema/buckets bằng supported read-only API/metadata; A được owner duyệt riêng65
không tự thay AC66. Evidence hiện tại chưa đủ audit count Auth/Storage độc lập;
không kết luận no-op hoặc Done.

### Đề xuất — CHƯA ĐƯỢC DUYỆT/CHƯA CHẠY

1. Auth: `GET https://bdhavbwmxbttymerizvx.supabase.co/auth/v1/admin/users?page=<n>&per_page=100`,
   page1 tăng dần đến trang rỗng, tối đa100 requests/10,000 records,
   10s/request, toàn bộ tối đa120s, không retry/redirect. Dùng Auth Admin
   server-side credential được provider hỗ trợ; có quyền rộng nên owner phải
   xác nhận principal/channel sau review, không gửi secret qua chat/Jira/args/
   log/Git hoặc tự lấy từ env/keyring. Chỉ count aggregate, PII/IDs in-memory,
   không lưu response; dedup IDs và chỉ PASS khi đầy đủ, malformed/error/cap/
   inconsistent metadata→UNKNOWN. Pagination không atomic: cần quiet window do
   owner xác nhận; không nhận snapshot nếu có concurrent writes.
   [Supabase listUsers](https://supabase.com/docs/reference/javascript/auth-admin-listusers)
   là supported server-only paginated API; exact raw route cần review contract/
   credential compatibility trước run.
2. Storage: đề xuất một `GET https://api.supabase.com/v1/projects/bdhavbwmxbttymerizvx/storage/buckets`,
   Management API [list all buckets](https://supabase.com/docs/reference/api/v1-list-all-buckets),
   OAuth `storage:read` hoặc fine-grained `storage_read`. Tài liệu operation
   mô tả trả danh sách, không mô tả pagination: **một request**, timeout10s,
   response size cap1MiB; truncated/limit/error/không đủ scope→UNKNOWN, không
   tự suy full enumeration. Chỉ báo count, không lưu raw bucket names/response.
   Nếu count>0: dừng, không tự liệt kê objects, trình owner target/scope/impact;
   object audit/API, pagination và quyền cần review/approval mới. List buckets
   không chứng minh objects nếu có bucket hoặc nếu danh sách không đầy đủ.
3. Cả hai request là remote read của data nhạy cảm vượt metadata allowlist hiện
   hành và không được lách bằng shell/Code Mode/MCP khác. Cần business approval
   riêng **và** cơ chế/policy được owner duyệt hợp lệ trước khi chạy; quyền tool
   không thay authorization. Không tự sửa `opencode.jsonc` hoặc retrieve keys.
   Đường thay thế ít quyền: owner tự cung cấp supported read-only audit/count
   hoàn chỉnh, thời điểm/phạm vi/pagination và source; cần owner xác nhận liệu
   evidence đó đáp ứng AC66, không suy từ lựa chọn A của65.

No-op chỉ sau audit đủ, xác định không legacy và acceptance; nếu dữ liệu ngoài dự
kiến thì dừng, không xóa/reset. Không yêu cầu owner gửi credential vào hội thoại.

Owner duyệt Dashboard/owner report làm inventory Auth/Storage ở riêng65:
owner xác nhận 0 users sau kiểm tra; Dashboard không liệt kê bucket; AI chưa
kiểm độc lập API/SQL. Footer “10 users estimated” giữ lịch sử. Evidence này không
chứng minh toàn project/Storage sạch hoặc thay AC66. TLS chain+hostname transport
PASS với CA duyệt không phải DB login/SQL PASS. SCRUM-65/66 và parent47 Jira Done.
Các blocker/không-Done65 và partial audit bên dưới phản ánh mốc lịch sử.

## Target và thứ tự

- Target inventory duy nhất: Supabase Cloud `bdhavbwmxbttymerizvx`.
- Evidence/counts/connection gaps: [target inventory](../../v2/docs/target-inventory.md).
- Thứ tự owner giao:47(65→66)→22(67→68)→23(69→70)→48(71→72)→14(73→74).
  65/66 đã Done theo evidence giới hạn ở trên. Không tự thực hiện67 hoặc soạn
  migration/seed trong lượt audit; không coi inventory65 một mình là clean-target.
- Spec/contracts/ADR hiện có là source of truth; không Supabase Local default.

## Owner evidence bổ sung — ghi nhận 2026-11-17T02:30:14.0962790Z

Nguồn:5ảnh Dashboard do owner cung cấp trong phiên và owner screenshot report
về URL Configuration. Đây là thời điểm agent ghi nhận nhận evidence theoUTC,
**không** timestamp chụp; timestamp/timezone chụp chưa xác nhận.
Chi tiết từng nguồn/số liệu ở inventory, không copy secrets/PII vào runbook.

- Target ref/API đúng; screenshot Healthy/Free/Nano/Singapore/mainPRODUCTION.
  PRODUCTION không destructive grant hoặc isolated-target designation.
- Usage/resource snapshot chỉ displayed values, không peak/capacity/headroom PASS.
  No backups trênDashboard không chứng minh backup ngoài hệ thống không có;
  legacy backup/restore waiver không đổi.
- Auth list “No users in your project” mâu thuẫn footer
  “Total: 10 users (estimated)”: tổng **UNKNOWN**, không0/10 verified.
  Owner refresh/check filters trước; nếu vẫn lệch mới review/approve count-only
  paginated Auth Admin GET plan trong inventory. Không SQL Auth internals/xóa users.
- Storage UI không liệt kê bucket, flags/objects-per-bucket N/A theoUI; không
  nhận đã enumerate bằngAPI hoặc suy objectcount0 từ usage.
- Reported Site URL localhost3000, No Redirect URLs: ghi callback/reset
  allowlist gap thuộc71, giữ PKCE/state/purpose/recovery-only theo contracts;
  actual callback/reset routes chưa implemented. Không thêm URL ở65.
- SMTP screenshot enabled/gmail465/senderconfigured và personal-provider warning;
  masked password không validation; app-password chỉ owner report lịch sử.
  Delivery/authentication/verify/reset/limits chưa kiểm, không gửi mail/đổiconfig.
- Overview25requests/92.0%success/2Postgreserrors chỉ observation Last60minutes;
  không nguyên nhân, không tự mởlogs/đổiCloud. Log reads ngoàiquyền cần duyệt riêng.

Tại mốc nhận screenshot này vẫn thiếu Auth total/actual Connect+usable mode/CA/TLS và quota ceilings;
không Done65/no-op66 hoặc triển khai67. Role creation/grants/session/bootstrap/
SMTPdelivery vẫn ở task đích, không kéo sớm vào65 để vượt dependency.

## Owner report bổ sung — ghi nhận 2026-11-17T02:39:05.3933758Z UTC

- **Owner xác nhận0users sau kiểm tra**, không AI/API độc lập. Ảnh footer10estimated
  phía trên giữ lịch sử; không tự lặp APIcount/tạo/xóa user. Nếu AC cần evidence
  mạnh hơn phải trình source/approved read-only count step riêng.
- Dashboard owner report Shared pooler:
  `aws-1-ap-southeast-1.pooler.supabase.com:5432`,database `postgres`,
  adminusername `postgres.bdhavbwmxbttymerizvx`,ref cố định. Session mode mapping
  đã đối chiếu [official connection docs](https://supabase.com/docs/guides/database/connecting-to-postgres#pooler-session-mode)
  ngày2026-11-17 theo host+pooledusername+port/type, không từ port đơn lẻ.
  Không runtime credential chung, không connection/TLS/login PASS.
- Docker hiện chưa kiểm lại; chỉ owner mở/báo ready. CA exact public path/read
  permission chưa có; default verified trust hoặc approved CA, không tắt chain/
  hostname validation. Diagnostic pooler host là **target khác T direct cũ**:
  trình/duyệt1attempt≤10s PGSSLRequest→TLS→close trướcauth, noPassword/noSQL;
  không tự chạy từ metadata mới. Negativecases còn cần review/evidence riêng.
- Transport probe không cần secret. Nếu authenticated diagnostic riêng về sau,
  chỉ owner-managed server-side processenv/secretstore ngoàiGit đã duyệt; không
  xin password vàochat, đọcexistingcredentials hoặc logURI. Password component
  percent-encode đúng1lần nếuURI, không encode cảstring/không double-encode.
- Không tìm thấy Supabase skill trong catalog/cácvịtríđãkiểm (inventory ghi scope);
  không tựnpx/install. Skill khôngDBconfig/runtimeprerequisite.65 chưa cầninstall;
  nếu cần task67 phải trình files/scope/version/installer và xin approval trước.

AC65 hiện còn app-environment TLS/CA/diagnosticnegativecases và relevant quota
ceilings chưa verified. Roles/grants/runtimecredentials,applicationDBlogin và
SMTPdelivery/AuthE2E chưaPASS, giữ task đích. Không close65/sang66 từ report này.

## Diagnostic +quota documentation — 2026-11-17, current update

Owner duyệt **một** pooler probe≤10s và offline verifier negatives.
Actual pooler `aws-1-ap-southeast-1.pooler.supabase.com:5432`, session-mode
metadata; existingCatalogimage sha256:6b73d41251d155ca5fff01a583a4082f8464990c16c75be1d8b5a82a07ba90ef,
Node24.16.0/OpenSSL3.5.6/Linuxamd64/usernode, đúng existing appbridge
`gmf64-runtime-20261116-a_local`; không start app/DBdriver hoặc mountscredentials.

- DNSIPv4 PASS6results, chọn1IP3.1.167.181; TCP5432 PASS; PG SSLRequest trảS.
- Một remote socket,02:51:17.712Z→02:51:19.128Z (1416ms).
- Default verified trust **FAIL `SELF_SIGNED_CERT_IN_CHAIN`**.
  Hostname verification chưa hoàn tất/PASS; không auth/StartupMessage/username/
  password/SQL; không kết luận nguyên nhân ngoài verification error.
- Offline container networknone, cert/keysynthetic memoryonly:
  matchinghost+trustedCAcontrolPASS; wronghostname bịERR_TLS_CERT_ALTNAME_INVALID,
  untrustedCA bịUNABLE_TO_VERIFY_LEAF_SIGNATURE.0remoteconnections.
- Hai diagnostic giữ Exited0/1,noOOM/restarts0,cap256MiB/no-added-swap; sáuapp/broker
  cũ vẫnstopped/dataretained. Không pull/build/install/CAread/Dockerrestart.

Exactcommands/sourcehash/rawresults và representation limits ở
[target inventory diagnostic section](../../v2/docs/target-inventory.md#diagnostic-thực-chạy--2026-11-17t025117712z).
Không coi syntheticnegativePASS hoặc TCP/S reply thành transportTLS/authenticated
connectivity/projecttenant/Cloud-ready PASS.

**Dừng:** cần owner exact public-CA path/provenance +quyền read/mountreadonly,
sau đó review/approve **một probe bổ sung** cùngfixedhost/noauth/≤10s.
Không tìm privatekeys/envsecret, downloadCA, retry hoặc disableverify để vượt lỗi.
CA mới không tự chứng minh hostname hợp lệ; chỉ actualvalidation mới quyết định.

Official quota docs truy cập2026-11-17, fullsources Q1–Q6 tronginventory:
FreeDB500MB/project,Storage1GB,uncached/cachedEgress5GB/5GB riêng,50kMAU;
Nano documentedDB60/poolerclients200/defaultpool15. Phân biệt orgallowance/
perprojectlimit/defaultsetting; không overwrite ownerreports hoặc measuredsnapshot.
Freeuploadglobalceiling50MB khác app5MiB và actualproject/bucketconfiguredlimit.
CustomSMTPAuth currentrate settings vẫnUNKNOWN; builtin2emails/hour không
áp mặc định cho GmailcustomSMTP. OwnerRateLimitsnon-secret values còn thiếu;
không tựGETconfig/SQL hoặc thayCloudlimits. Không coi quota doc là enforcement/
headroom/fullcapacityPASS; fullworkload111,providerdelivery/AuthE2Etaskđích.
UnusedRealtime/Edge/SSO/thirdparty/image-transformationmetrics không tạo AC mới.

65 vẫn In Progress vì chain+hostname chưa đạt và Authcurrentlimits chưa inventory;
negativeoffline và documentedquotaceilings đã bổ sung. Không đề nghị nghiệm thu/
transitionDone, không sang66/67, không commit/push từ diagnostic này.

## Approved CA transport probe — 2026-11-17T06:30UTC

Một approved socket tới session pooler trong Catalog image/app bridge: DNS/TCP/
SSLRequest PASS, **TLS chain+hostname PASS** với owner public CA read-only và
`rejectUnauthorized=true`, TLS1.3,352ms, exit0; không StartupMessage/auth/SQL.
Default-trust `SELF_SIGNED_CERT_IN_CHAIN` cũ vẫn giữ trong lịch sử bên dưới.
Exact command/source hash/CA+peer fingerprints và limitations ở
[inventory](../../v2/docs/target-inventory.md). Đây không DB driver/tenant login
hoặc authenticated connectivity PASS; chưa đổi app/global trust/Cloud.
Không tự close65/sang66; review đầy đủ AC và owner acceptance trước.

## Owner Rate Limits và offline CA — ghi nhận 2026-11-17T06:15:17.0104855Z UTC

- Screenshot project `bdhavbwmxbttymerizvx`: emails100/hour/project; SMS30/hour/
  project (ô mờ); refresh150/5phút/IP; OTP/magic-link verification30/5phút/IP;
  anonymous30/hour/IP; signup/signin30/5phút/IP không gồm anonymous; Web3
  30/5phút/IP; same-user email interval60giây khi custom SMTP; IP forwarding OFF.
  Chi tiết và source ở [inventory](../../v2/docs/target-inventory.md); receipt UTC
  không phải capture time, chưa API verified. Burst chưa rõ; không suy SMS/
  anonymous/Web3 enabled, Gmail cap, email delivery hoặc enforcement PASS.
- BFF Auth task cần đánh giá source IP Supabase thấy và trusted proxy boundary;
  không tự bật forwarding hoặc tin browser IP headers.
- Owner cho đọc đúng `C:\Users\HUY\Downloads\prod-ca-2021.crt`: PEM một root CA,
  SHA256 `807025AD50D4ED219D2C9C7D299C004F824EB00CF7F65AFEF607D07B72E6CAFA`,
  self-signature PASS, validity2021-04-28→2031-04-26 UTC, CA=true.
  Không leaf/intermediate, không xác minh được pooler chain; nguồn tải UNKNOWN.
  Supabase docs có hướng dẫn Dashboard root certificate cho session pooler,
  không chứng minh file cụ thể này là file đã tải từ Dashboard hoặc phù hợp live.
- Hỏi owner nguồn tải/project. Chỉ sau review provenance và suitability trình
  exact diagnostic command +reviewed CA mount/script và xin approval probe mới.
  Chưa mount/cài trust/sửa app/Cloud hoặc chạy probe. Live chain vẫn FAIL,
  hostname/auth/SQL/SMTP delivery chưa verified. Không Done65/sang66.

## Làm rõ blocker — 2026-11-17T02:57:40.5394529Z UTC

- Pooler đã tới TLS: chain verification FAIL `SELF_SIGNED_CERT_IN_CHAIN`;
  hostname chưa verified, không evidence mismatch. Khác direct-host failure
  trước TLS trong lịch sử. Host/SNI/source/result khớp Connect pooler metadata.
- Error log chỉ lưu code, không raw message/stack/failed peer chain; không bịa
  issuer/expiry/root cause. Exact command/image/network/layer results ở inventory.
- Local read-only `w32tm /query /status`: Leap3/not synchronized,Stratum0,
  LastSuccessfulSync unspecified,Source Local CMOS Clock. Host UTC02:57:40.5394529Z,
  timezoneUTC+07; không independently verified offset/container paired sample.
  Chưa biết clock sai hay gây lỗi; không resync/đổi giờ hoặc chạy container mới.
- Proposed CA adjustment chỉ trong diagnostic, sau exact public path/provenance/
  read-only permission +offline review CA phù hợp **pooler**, không global/app/
  Cloud trust change. Một probe≤10s bổ sung cần approval mới; chưa được chạy.
- Chờ ảnh Authentication→Rate Limits. Ghi từng nhãn/value/unit/window/scope/
  source; phần không rõ UNKNOWN và xin crop/tooltip có lý do. Không lấy defaults
  thay settings, sửa SMTP hoặc tạo enforcement/email tests ở65.
- Missing evidence không app defect. Approved S giữ transport65 khác login/
  role tests67–70. Proposal S2 (provider72,application/session82/107–108,
  DB-role negatives70) vẫn chờ owner, không tự đổi AC/dependency hoặc waive.

Chi tiết error/time limitation, evidence-table format và smallest next step
ở [inventory](../../v2/docs/target-inventory.md). Chưa đủ nghiệm thu65/no66;
nhận ảnh và review CA offline trước, không tự thay cấu hình để close task.

## Clean-target gate — thuộc66, chưa thực thi

1. Định danh project/API URL và actual Connect metadata tại65, không guess pooler.
2. Inventory permitted metadata business schemas/migrations và supported Auth/
   Storage counts; timestamps, scope và pagination completeness phải rõ.
3. Tables/migrations rỗng KHÔNG chứng minh Auth users, buckets/objects hoặc roles rỗng.
4. Khi evidence đầy đủ xác nhận không legacy: ghi **no-op**, không DELETE/DROP/
   reset để hợp tên task. Hiện chưa đủ evidence để ghi kết luận no-op hoàn tất.
5. Có dữ liệu bất ngờ: dừng, trình exact target/allowlist/impact/backup status;
   chờ owner target-specific confirmation trước mọi destructive operation.

## Legacy waiver không là destructive grant

Owner đã xác nhận không có backend legacy và miễn backup/restore legacy tại54.
Không tạo lại gate backup/restore legacy, không báo đã backup/restore thành công.
Nguồn lịch sử: [legacy inventory](../legacy-inventory.md),
[waiver](legacy-backup-restore.md).

V2 isolated reset/rebuild tests75–76 vẫn cần isolated target được định danh và
duyệt riêng; hiện không có. Project chính dù được mô tả rỗng không thay target đó.
Runbook này không chứa executable destructive/reset commands.

## Remote apply/config/seed gate — task đích, chưa được cấp

Trước mỗi thao tác phải trình: project ref/endpoint, file/script hash+exact reviewed
statements/API methods, object/schema/bucket/role allowlist, tác động và idempotence/
failure behavior, credential channel không secret logs, verification/evidence.
Owner approve exact target/scope rồi mới apply; không gộp bootstrap vào startup.

Runtime roles từng service, migration principal riêng; không postgres/service_role
chung. Không SQL Auth/Storage internals, cross-service business reads/writes/joins/
FK hoặc seed bypass Community/session/Storage authorization boundaries.
SMTP đã có owner-configured report: inspect non-secret current status trước mọi
đề xuất config; không đọc app password, không delivery PASS trước actual tests.

65 không apply/seed/config/SQL; đã có một transport attempt thất bại như trên,
không thêm TLS probe hoặc mở Docker Desktop/rebuild/replay/commit/push/deploy.
