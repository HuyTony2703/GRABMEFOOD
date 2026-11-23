# GrabMeFood Baseline and Delivery Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `executing-plans` for approved preparation tasks;
> use `subagent-driven-development` only if that execution method is chosen by the owner.
> Steps use checkboxes. This file does not authorize implementation or Cloud writes.

**Goal:** Chuẩn bị khả năng triển khai và thực hiện đầy đủ các luồng GrabMeFood theo dependency, không giảm scope.

**Architecture:** Năm service Spring Boot độc lập, schema/role riêng cùng Supabase PostgreSQL,
runtime ưu tiên Data API/RPC, shared read-only Account permission helper. React/Vite SSR public,
CSR private; HTTP outbox/inbox trong owner, HTTPS/HMAC theo cặp, Supabase Auth/Storage/Realtime.

**Tech Stack:** React + TypeScript + Vite; Spring Boot + Java 21 LTS + Maven; PostgreSQL Supabase Cloud.
Version/library/SSR integration cụ thể chưa pin; không dùng candidate registry như bằng chứng build.

**Spec:** [PRD](../../PRD.md), [DOMAIN](../../DOMAIN.md), [ARCHITECTURE](../../ARCHITECTURE.md),
[API](../../API.md), [DATABASE](../../DATABASE.md), [SECURITY](../../SECURITY.md),
[TEST-STRATEGY](../../TEST-STRATEGY.md), [OPERATIONS](../../OPERATIONS.md).

**Status:** Chủ dự án đã duyệt kế hoạch để tiếp tục preparation (DEC-041).
B1 chốt scope/hướng, **chưa implementation-ready toàn bộ**.
P01–P03 là task chuẩn bị có đầu ra cụ thể; M1–M6 là work package/dependency, không giả là kế hoạch
code từng bước. Sau gate, mở rộng task test-first của milestone tiếp theo trong cùng file hoặc artifact
được user duyệt; không viết endpoint/migration/types chưa chốt thành lệnh chạy.

## Global Constraints

- Chỉ miễn phí; không tự tạo tài nguyên tính phí, bật billing, deploy hoặc thay Cloud.
- Không tự commit/push/merge hoặc thay Jira status. Bỏ bước commit mặc định của skill.
- Không cài package/skill/CLI hoặc scaffold khi chưa được phép trong task.
- Giữ đầy đủ scope, 5 owner; không tự thêm Gateway/broker/Redis/Kubernetes/Edge Functions.
- Supabase Auth/Storage/Realtime không tự xây lại; không mọi request qua Spring.
- Không cross-owner writes/FK/join/cascade nghiệp vụ; helper quyền read-only là ngoại lệ đã duyệt.
- Ưu tiên Data API/RPC; không dùng service_role chung để giả scoped isolation hoặc tự fallback JDBC.
- Secret không frontend/chat/log; HTTPS khi triển khai; HMAC không thay Supabase role authorization.
- Không sao chép ảnh/nội dung chưa có quyền; dữ liệu/giá minh họa có nhãn demo.
- Mọi Cloud permission chỉ đúng target/resources/operation đã duyệt, không kéo dài sang task khác.

## Review Focus

1. Credential A không truy cập schema/RPC B; browser không bypass command owner.
2. JWT cũ sau khóa bị chặn dữ liệu riêng, kể cả RLS trực tiếp và phiên đang mở.
3. Producer crash/retry/consumer commit→ack không mất sự kiện hoặc nhân inbox.
4. Event trễ/save sau event/unsave trước gửi/delete user không gửi sai hoặc tái tạo dữ liệu.
5. Hidden vs deleted, ảnh public và cleanup partial không lẫn nhau hoặc báo hoàn tất giả.

Các lớp này nằm trong acceptance M1/M3/M4/M5, không bị thay bằng happy-path/mock.

---

## 1. Nguồn trạng thái và thứ tự

DECISIONS giữ quyết định/gate B1; tài liệu chuyên biệt là spec; file này giữ dependency và kế hoạch.
Jira GRAB-3..GRAB-10 đã được tạo sau khi chủ dự án duyệt timeline; Jira là nguồn trạng thái thực hiện.
Kế hoạch giữ milestone/dependency và issue key, không duy trì hai bộ checkbox task mâu thuẫn.
Spec Kit chưa chọn/cài, không có task set thứ ba.

```text
P01 research ─┬→ P02 toolchain + conditional spike manifest (spike bỏ theo DEC-044)
              └→ P03 Jira timeline (đã tạo GRAB-3..GRAB-10)
P02/P03 song song: UX, content provenance, contract/error/UI review có thể tiếp tục
M1 proof → phần persistence/authorization phụ thuộc của M2..M5
  → M2 Catalog/public SSR/admin content
  → M3 Auth hoàn chỉnh + Collection/random
  → M4 Community/Notification + HTTP/HMAC delivery
  → M5 lifecycle/admin/cleanup đa owner
  → M6 nghiệm thu/recovery/deploy được duyệt riêng
```

M2 vẫn chứa tối thiểu Account gate/admin authentication cần cho Catalog admin; M3 hoàn thiện các luồng
Auth/user. Hạ tầng bảo mật/event được bổ sung ngay khi slice đầu cần, không dồn cuối.
Xóa thật chưa được báo full completion ở slice trước M5; không ship destructive action nửa vời.

## 2. Baseline/gate trước implementation

| Gate | Phải có trước | Đầu ra |
| --- | --- | --- |
| GATE-01 | Chỉ persistence/grants/RPC authorization dùng owner credential | Proof Data API/RPC role scoping được duyệt; không đạt thì trình lại architecture. Không chặn P02/P03, UX, contract review độc lập |
| GATE-02 | Cài/chạy spike | Toolchain pin, package/tool permissions và target/resource manifest được duyệt |
| GATE-03 | Event/HMAC/recipient persistence | Wire contract, temporal membership/replay/retention semantics rõ |
| GATE-04 | Mỗi slice | Validation/UI/rule còn mở được chốt, exact tests/interfaces/files |
| GATE-05 | Deploy/restore | Free host/môi trường/backup/secret channel và release quyền riêng |

P01 chỉ khảo sát read-only. Proof execution có tạo role/schema/user kể cả local phải nằm P02/M1
được duyệt; tài liệu đọc không đủ đánh dấu GATE-01 pass.

## 3. Tasks chuẩn bị — đã duyệt trong phạm vi DEC-041

### P01 — Đóng các lựa chọn và xác định phương án scope Data API/RPC

**Files:** cập nhật `docs/SECURITY.md`, `docs/API.md`, `docs/TRD.md`, `docs/DECISIONS.md`.
**Consumes:** DEC-028/029/031, tài liệu Supabase chính thức; không đọc giá trị secret.
**Produces:** một phương án credential có owner/actor trust model, hoặc blocker có evidence.

- [x] Đọc tài liệu API key/JWT/custom-role/function privileges hiện hành; ghi URL, ngày đọc và giới hạn.
- [x] Lập bảng caller: browser anon, user A/B/admin/blocked, Catalog/Collection/Community/Notification/Account.
  Với mỗi caller, ghi key type/token issuer/DB role/allowed tables/RPC và ai có quyền cấp/thu hồi.
- [x] Kiểm tra từng candidate ở mức tài liệu có cho service gọi RPC owner khác, giả actor/mint quyền khác không.
  Không chọn secret key khác tên nhưng cùng service_role làm giải pháp.
- [x] Ghi proposal helper read-only: caller browser chỉ chính mình; service có verified actor context,
  không raw account SELECT/UPDATE. Không cấp quyền schema/service trên Cloud để “thử nhanh”.
- [x] Ghi các quyền bổ sung nếu cần service accounts/JWT issuer/signing key hoặc platform config.
  Nếu không có phương án phù hợp, báo blocker và đề xuất trade-off, không tự đổi JDBC.
- [x] Gom remaining decisions theo slice: version/package/test, collection naming, locale/fallback,
  marker/history retention, re-save semantics, latency và bootstrap. Không hỏi lại quyết định đã chốt.

**Verification:** bảng phải có tất cả caller và cả allow/deny, nguồn chính thức và rủi ro còn lại;
kiểm tra static/link/ID, diff không có code/config. Chỉ “proposal ready”, không “isolation proven”.

**Progress P01:** đầu ra khảo sát tại SECURITY mục 10; DEC-042 duyệt hướng khảo sát
machine identity do Supabase Auth cấp, không phê duyệt cơ chế cấp role cụ thể.
GATE-01 chưa vượt. P02 chuẩn bị manifest có điều kiện; chưa có manifest thực thi vì
mapping role/target chưa được chứng minh/chọn.
P03 có bản nháp mục 4a để review; không tạo issue.

**Execution adaptation ban đầu:** chỉ preparation tài liệu trong workspace hiện có; không triển khai
trên main và không tạo worktree bỏ sót tài liệu chưa commit. DEC-044 sau đó cho phép bắt đầu
implementation, nhưng không cấp quyền Cloud/Auth/migration/release; thao tác install/scaffold cần
phê duyệt đúng phạm vi. Giữ nguyên tài liệu chưa commit; không commit tự động. TDD áp dụng cho code.
P01 → P02 trust model vẫn có giá trị; user đã bỏ M1 spike, không có manifest spike executable
hoặc bằng chứng vượt GATE-01.

### P02 — Manifest spike lịch sử và toolchain tối thiểu

**Files:** mở rộng mục 4 của file này; cập nhật `docs/TRD.md`, `docs/OPERATIONS.md`, `docs/DECISIONS.md`.
**Consumes:** phương án P01, trạng thái local hiện có; target để ngỏ đến review.
**Produces:** toolchain và manifest có điều kiện; manifest executable chỉ sau khi target/role path
được chọn và phê chuẩn riêng, không quyền Cloud chung.

- [x] Kiểm tra tool versions chỉ đọc; không tự cài Maven wrapper/CLI/container runtime.
- [x] Đề xuất toolchain/test runners và version candidates theo mục 4; sau đó pin/cài frontend
  riêng theo phê duyệt cụ thể. Pin/checksum/lệnh cài Maven Wrapper/CLI và backend vẫn chưa chốt.
  Supabase agent skills nếu cần phải xin phép nguồn/lệnh/phạm vi; không tự chạy installer.
- [x] Lập danh sách resource *candidate* theo mục 4; exact file/table/function/role/user/fixture,
  setup/teardown commands và cleanup-failure plan còn phụ thuộc target/role, không phải manifest executable.
- [x] Chọn luồng spike đại diện: user A lưu một quán mẫu qua Collection/Spring→Data API RPC,
  Catalog availability check, user B không truy cập dữ liệu A; Account helper chặn JWT cũ sau khóa.
  Đây là recommendation của agent theo DEC-040, không tự cấp quyền chạy.
- [x] Liệt kê test expected/actual cần thu, cách che secret và rollback không đụng tài nguyên nền tảng hiện có.
- [ ] Nhận review *đề xuất có điều kiện*; chốt target/role path, exact commands/resources và xin
  quyền thực thi riêng trước probe tạo user/role.

**Verification:** every created resource có cleanup và owner; không có unknown target; không có secret
thật. Các lệnh test runtime chỉ được pin sau khi biết candidate/toolchain, không ghi lệnh giả “đã chạy”.

**Progress sau DEC-044:** chủ dự án bỏ spike M1 và chỉ đạo đi thẳng implementation; GATE-01
vẫn chặn persistence/phân quyền khi cần proof. Frontend Catalog discovery/SSR đã scaffold trong
`frontend/` sau phê duyệt package cụ thể; build và test local được ghi tại DECISIONS/TRD.
Không có resource Cloud/Auth hoặc migration nào được tạo. Spike và proof Data API/RPC chưa thực hiện.

### P03 — Timeline Jira đã duyệt/tạo; docs giữ traceability

**Files:** bổ sung candidate breakdown/dependencies trong file này, không tạo tracker/spec trùng.
**Consumes:** baseline B1, P01 và P02 ở mức proposal, actual Jira capabilities kiểm tra lại chỉ đọc.
**Produces:** timeline task ngắn trong Jira, dependency links; chi tiết và evidence giữ trong docs.

- [x] Kiểm tra lại project GRAB: Task/Sub-task; GRAB-1/2 tồn tại To Do. Chưa xác minh transitions
  hoặc quyền tạo hiện tại; không giả có Epic/Story/In Progress.
- [x] Đề xuất issue cho baseline closure, UI/design review, connection scope spike, migration/RLS,
  từng slice, release/recovery và nghiệm thu. Không thêm tính năng.
- [x] Mỗi candidate có goal/value, in/out, requirement/rule/docs links, acceptance, dependency, output,
  test/evidence, warning Cloud/permission/cost và gate cần vượt.
- [x] Chủ dự án duyệt timeline T1–T8 và thao tác ghi trước khi tạo.
- [x] Tạo GRAB-3..GRAB-10, xác minh cả tám To Do; GRAB-1/2 không sửa.

**Verification:** coverage mục 6 đủ 29 requirement; GRAB-1/2 giữ nguyên;
Jira chỉ có timeline/dependency, không là bản sao spec/acceptance/test.
Không dùng artifact count/build success thay acceptance; không tự chuyển issue sang Done.

## 4. Manifest spike — proposal có điều kiện P02, không được thực thi theo DEC-044

Chưa chọn target local/cloud và chưa có scoped-role proof. Vì vậy không bịa danh sách resource executable.
Chủ dự án sau đó đã bỏ spike trước implementation theo DEC-044; phần dưới chỉ lưu proposal lịch sử,
không phải task đang chờ target và không được chạy nếu chưa có quyết định mới.

| Trường bắt buộc | Điều kiện hợp lệ |
| --- | --- |
| Target/environment | Project ref/URL hoặc local stack chính xác; không dùng project mới tính phí |
| File paths/commands | Version/pin, resource setup/teardown và test commands được review |
| Resources | Table/function/roles, Auth users/test emails, Storage nếu thực sự cần; không wildcard delete |
| Trust model | User token vs service token vs API key; ai cấp/thu hồi, scopes và negative tests |
| Tests | Data API route thật; A/B access; old-JWT lock; UI→Spring→DB; replay nếu có event |
| Cleanup | Resource-specific manifest, kiểm tra tồn dư, không reset/broad schema drop |
| Evidence | Static/local/Data API/Auth-RLS/Spring/migration tách riêng, có actual output |

Không cần Storage, ảnh, Google Maps hay broadcast hàng loạt để chứng minh lưu quán.
Cloud SMTP/OAuth tests có quota/tài khoản riêng được duyệt, không gửi email tùy ý.
Scoped-role prototype hai owner chỉ chứng minh hai owner đã test, không tuyên bố đủ cả năm.

### Đề xuất ưu tiên local, chờ quyết định target và role feasibility

**Target đề xuất, chưa được chọn:** Supabase local stack cô lập, không link project Cloud; Docker CLI có trên
PATH nhưng daemon chưa kiểm tra. Nếu chọn Cloud ref `bdhavbwmxbttymerizvx` thay local
thì cần manifest Cloud riêng, không chuyển nguyên permission local thành quyền ghi Cloud.

**Minimal proof trước khi scaffold cả frontend/năm service:** hai owner Catalog/Collection,
machine identity khác nhau do Auth cấp nếu khả thi. Dùng publishable `apikey` + bearer
machine JWT; user A/B dùng JWT riêng. Auth hook chỉ nếu thật sự cần, chỉ local trước.
Không đặt password/email, refresh token, JWT signing secret trong file hoặc chat.

| Resource candidate (local only) | Purpose / boundary | Cleanup riêng, chờ duyệt |
| --- | --- | --- |
| `catalog` và `collection` schemas; `catalog_runtime`, `collection_runtime` NOLOGIN roles | Test role/grants tách hai owner | Gỡ grants và role/schema chỉ sau xác nhận không dùng ngoài fixture; không DROP CASCADE bừa |
| Một Catalog restaurant fixture và một Collection saved-item fixture | Một quán mẫu/saved relation; không dữ liệu người thật | Delete đúng ID fixture; kiểm chứng bảng khác không đổi |
| Account-owned gate function/state fixture tối thiểu, role/helper riêng nếu cần | Test JWT cũ sau lock; không grant raw account SELECT | Remove function/state/role chỉ đúng tên tạo mới; không đụng Auth hệ thống |
| Hai machine Auth principals và hai test user A/B **chỉ nếu Auth role mapping được chứng minh** | Test tokens, A/B, role switch, browser bypass | Revoke sessions rồi xóa đúng principals sau duyệt, không xóa user đã có |
| Hook Auth local nếu cần và được chấp thuận | Issuance role theo allowlist server-controlled | Disable hook và restore config đã lưu; fail-closed nếu không thể rollback |
| Bucket/Storage, SMTP/OAuth, Maps | Không cần cho minimal permission proof | Không tạo |

**Stop condition cho spike và persistence phụ thuộc:** Auth JWT của machine không nhận custom DB role,
`authenticator` không đổi được role, hoặc caller giả role/actor/vượt RPC owner khác ⇒ dừng phần này;
P02/P03/UX/contract review độc lập vẫn tiếp tục. Không tự
chọn JDBC, imported signing key hay `service_role` để làm pass. Nếu email verification
ngăn machine login, không tự tắt xác thực email production; test local setup riêng
chỉ sau khi duyệt chi tiết.

**Evidence phân tầng:** (1) migration/replay local sạch và upgrade; (2) Data API
`current_role`/allowed owner RPC và negative cross-owner table/function/profile;
(3) JWT A/B + old JWT bị gate chặn và unchanged-row proof; (4) Spring Collection→RPC
và Catalog availability check; (5) UI representative chỉ nếu scaffold/tooling đã duyệt.
Không lấy local proof thay Cloud proof, không đánh dấu năm role đã test từ hai role mẫu.

**Toolchain đề xuất:** backend/CLI vẫn chưa cài hoặc kiểm chứng; frontend có phần đã cài/kiểm chứng riêng:
Java 21.0.11 và Node 24.16.0/npm 11.13.0 đã quan sát; Spring Boot 4.2.0 candidate
(official requirements Java 17–27/Maven ≥3.6.3), Maven Wrapper 3.9.x candidate cần
patch/checksum. Vite 8.3.8, plugin-react 6.3.0, React/ReactDOM 19.3.1,
TypeScript 7.0.2 và supabase-js 2.119.2 là registry metadata lịch sử ở TRD.
Đề xuất JUnit qua Spring Boot test BOM cho Spring, Vitest/Testing Library cho frontend
và Node/Python stdlib để kiểm tra static. Metadata registry đọc lại ngày 2026-11-23:
Vitest 5.1.1 khai báo peer Vite ^6.4/^7/^8 và Node ^22.12/^24/>=26; React Testing Library
16.3.3 khai báo peer React/ReactDOM ^18 hoặc ^19 cùng `@testing-library/dom` >=10.
Frontend được cài theo phê duyệt riêng với TypeScript 5.9.3; build client/SSR và test UI đã chạy.
Đây không xác nhận dependency set cho các service khác. CLI/test bổ trợ backend và Maven Wrapper
patch/checksum/lệnh cài vẫn chưa pin hoặc được duyệt.
Supabase CLI cân nhắc npm dev dependency pin version sau metadata/compatibility;
không chạy `npx` tự tải, `supabase init`,
`supabase start`, Docker engine hoặc initializer lúc này. Trước khi xin quyền cài,
P02 phải nêu exact package version, command, working directory, generated files và
cleanup. Nguồn: Supabase [CLI](https://supabase.com/docs/guides/local-development/cli/getting-started),
[roles](https://supabase.com/docs/guides/database/postgres/roles),
[hook](https://supabase.com/docs/guides/auth/auth-hooks/custom-access-token-hook),
[Spring requirements](https://docs.spring.io/spring-boot/system-requirements.html),
[Vite](https://vite.dev/guide/).

**Signing key ECC P-256 đã có** (thông tin chủ dự án) chỉ là phần verify JWT,
không phải DB role; không tạo/xoay key hiện tại. Khảo sát chỉ đọc của chủ dự án
cho biết năm role/schema candidate chưa được tạo: không suy kết luận machine-role
hoạt động hay không. Candidate Auth machine identity cần test sau permission.

**Spike đã được bỏ theo DEC-044:** không xác nhận role mapping qua Supabase Auth,
Docker daemon, setup/teardown hay target; không chạy manifest này. Nếu chủ dự án đổi
quyết định, phải trình manifest tài nguyên/lệnh/cleanup và xin quyền target cụ thể;
không coi DEC-042/044 là quyền Cloud write.

### P02 completion boundary

Phần không phụ thuộc spike đã đủ để **review đề xuất**, không phải manifest thực thi:
target đề xuất local, candidate resource và cleanup, toolchain/version candidate,
expected allow/deny và điểm dừng. Cần chủ dự án chọn target; sau đó mới viết danh
sách file/SQL/function/role/fixture ID và lệnh setup/test/teardown *đúng target*
để xin phép riêng. Không tự thay target Cloud. Không dùng ECC signing key thay role.

## 4a. P03 — timeline Jira đã duyệt và issue keys

Khảo sát trực tiếp chỉ đọc project `GRAB`: `GRAB-1` (nhóm 1) và `GRAB-2`
(UX/UI) hiện To Do; Task `10067`, Sub-task `10068`. Ghi chú cũ “0 issues”
là snapshot lịch sử. Không tạo lại hai issue; không sửa mô tả/status của chúng.
Transition graph chưa kiểm chứng.
Jira chỉ cần tên mốc và liên kết dependency; chi tiết spec, acceptance, REQ/BR,
test, tài nguyên và quyền thao tác tiếp tục nằm trong tài liệu dự án, không chép vào Jira.

| Thứ tự | Jira | Timeline công việc | Phụ thuộc |
| --- | --- | --- | --- |
| Có sẵn | `GRAB-1` | Tài liệu sản phẩm nhóm 1 | — |
| Có sẵn | `GRAB-2` | Thiết kế UX/UI | GRAB-1 |
| T1 | `GRAB-3` | Hoàn thiện baseline và chuẩn bị toolchain | GRAB-1 |
| T2 | `GRAB-4` | Chốt target và thực hiện spike kết nối | T1; spike được bỏ theo DEC-044, Jira status không tự đổi |
| T3 | `GRAB-5` | Nền tảng dữ liệu và phân quyền | T2 theo timeline; persistence vẫn phụ thuộc GATE-01 |
| T4 | `GRAB-6` | Catalog, khám phá và trang công khai | T3; UI độc lập có thể làm song song |
| T5 | `GRAB-7` | Đăng nhập, bộ sưu tập và random | T3–T4 |
| T6 | `GRAB-8` | Bình luận và thông báo | T5 |
| T7 | `GRAB-9` | Quản trị vòng đời và cleanup liên service | T6 |
| T8 | `GRAB-10` | Nghiệm thu và chuẩn bị phát hành | T4–T7 |

GATE-01 chỉ chặn persistence/phân quyền phụ thuộc kết quả; không chặn UI/contract review độc lập.
T2 spike đã được chủ dự án bỏ; không target/resource/cleanup nào được suy ra hoặc triển khai.
Không đặt deadline, assignee, priority hay status mới; không tự sửa `GRAB-1/2`, transition issue
sang Done hoặc ghi Jira khác khi chưa được duyệt rõ thao tác.

### Progress frontend theo DEC-044

Lát cắt `frontend/` hiện thực UI discovery với search/filter/empty state, responsive
layout, search landmark có tên, SSR ban đầu và hydration entry. Component nhận danh sách
qua props; không có fixture runtime, fetch API, dữ liệu quán thật hoặc nối Supabase.
Tìm kiếm hiện khớp chuỗi tên quán/món và khu vực; chưa phải mọi bộ lọc/route/content trong
acceptance M2. M2 không hoàn tất: không có Catalog service/API, admin, storage, auth/RLS,
HTML/OG route nội dung hay permission proof.

Kiểm chứng local: `npm test -- --reporter=verbose` (5 tests pass, 2 files);
`npm run build` (TypeScript, client và SSR bundles pass); `npm audit --audit-level=moderate`
(0 vulnerabilities). Production server thử local: `GET /` và client asset đều HTTP 200,
SSR chứa landmark/search. Không có browser automation/screenshot; đây không thay cho browser,
Data API, Auth/RLS, năm Spring service hay migration/replay verification.

## 5. Milestones triển khai đầy đủ — chưa là task code có thể chạy

Mỗi milestone cần kế hoạch test-first chi tiết bổ sung sau các gate liên quan: exact files,
signatures/DTO/constraints, failing tests, lệnh và expected failures, minimal implementation, rerun, evidence.
Không tự suy chữ “triển khai” trong roadmap thành quyền cài/Cloud/commit.

### M1 — Spike nền tảng

**Depends:** P01/P02/P03 được review, quyền target và setup/test/cleanup cụ thể được duyệt.
**Proposed paths:** `frontend/`, `services/account-administration/`, `services/catalog/`,
`services/collection/`; spike fixtures/migrations theo P02 chưa tạo.
**Deliverable:** UI đại diện + Spring trách nhiệm thật + Supabase Data API/Auth/RLS proof.
**Acceptance:** allow own/deny B, owner role deny cross-owner table/RPC, user không giả actor,
old token bị gate chặn, invalid issuer/expiry rejected; teardown không mất dữ liệu ngoài fixture.
**Exit:** review evidence và cập nhật trust/contracts; không tự giữ throwaway như product đã hoàn thành.

### M2 — Catalog/public SSR/admin nội dung

**Depends:** M1 proof cho persistence/phân quyền; SSR/toolchain/map/data/visual review, GATE-04
cho publish/lifecycle. Theo DEC-044, UI discovery độc lập đã bắt đầu trước proof; phần nối Catalog
API/data và quyền vẫn dừng tại GATE-01.
**Proposed paths:** `frontend/src/` public pages/SSR/admin content,
`services/catalog/`, Catalog-owned migrations/tests; Account admin/gate tối thiểu cần từ M1.
**Deliverable:** danh sách/search/vùng, quán→món, bài viết/tuyển chọn, vi/en, map, ảnh/provenance,
admin content publish/hide và upload private staging→Catalog validate→public.
**Acceptance:** HTML/OG đúng trước JS; payload hidden không qua SSR/Data API;
URL ảnh public cũ được phép đọc; byte sai không promote, pending không public/không TOCTOU overwrite;
user thường không admin mutation, renderer không nhận secret; dùng được keyboard/mobile.
Xóa đa owner chỉ được bật full khi M5; không ship nút delete báo thành công giả.

**Progress:** UI discovery local có tìm tên quán/món trên dữ liệu được truyền vào, lọc theo khu vực,
empty state, SSR + hydrate; không có fixture runtime hoặc Catalog API. Đây là lát cắt đang làm,
không phải hoàn thành M2/T4 và chưa chứng minh HTML/OG theo route nội dung, public Data API hay quyền.

### M3 — Auth hoàn chỉnh và Collection/random

**Depends:** M1, nội dung M2; collection UX/naming/random bộ hoặc all/selected chi tiết đã chốt.
**Proposed paths:** `frontend/src/` auth/collections/random, `services/collection/`,
`services/account-administration/`, owned migrations và tests.
**Deliverable:** email/Google, verification/recovery, private collections tách loại, lưu/bỏ lưu/random.
**Acceptance:** A/B isolation, duplicate multi-collection dedup random; all/selected chỉ saved,
hidden/deleted bị loại tại authoritative check; dependency failure là retryable error, không empty giả;
phiên khóa không đọc/ghi private; callback/account-link behavior theo contract được duyệt.

### M4 — Community và Notification/event delivery

**Depends:** M1–M3, GATE-03 wire/HMAC/history/retention và migration owner ready.
**Proposed paths:** `services/community/`, `services/notification/`,
producer outbox adapters của Catalog/Collection, frontend comment/bell/admin-send.
**Deliverable:** bình luận/reply một cấp, moderation, năm thông báo, đọc/mark-all và realtime.
**Acceptance:** owner-only edit/delete; cascade parent replies; no-self-reply, stable business dedup,
public món/quán, broadcast active; save-after-event/unsave-before-send bị loại; no cross-owner writes.
Test HMAC wrong body/destination/signature/expiry/replay và new attempt cùng event ID.
Test crash commit/send/consume/ack, một destination down, out-of-order; pending delivery không mất dữ liệu.
Một event bắt buộc đi qua producer→HTTP HMAC→consumer commit→Realtime→UI, không mock toàn pipeline.

### M5 — Vòng đời và admin/cleanup nhiều owner

**Depends:** M4; tombstone/retention/receipt/recovery semantics GATE-03/04.
**Proposed paths:** Account/Catalog operation orchestration, owner cleanup endpoints,
frontend admin progress, owned migrations/tests từng service.
**Deliverable:** hide/delete quán/món, account lock/unlock/delete, admin safety, retry/status.
**Acceptance:** hidden giữ comments; deleted mới cleanup, marker vẫn giữ; xóa user xóa comments
và replies người khác dưới parent; không báo completed trước đủ receipts/Auth confirmation.
Concurrent self/admin-last actions bị chặn; crash/restart/timeout guard không bị tự mở;
late events không tái tạo dữ liệu; asset dùng chung không xóa nhầm; không giữ PII/history vô hạn.

### M6 — Nghiệm thu, phục hồi và phương án deploy

**Depends:** M2–M5 evidence, GATE-05 và toàn bộ gate ảnh hưởng release đã đóng.
**Proposed paths:** E2E/security/restore tests, configs/docs được duyệt riêng;
không có deployment manifest/provider đã được chọn.
**Deliverable:** toàn bộ flows, accessibility/responsive/i18n/SEO review, free-host proposal và recovery evidence.
**Acceptance:** từng service build/run độc lập; role grants toàn bộ năm owner được test;
recovery không resurrect deleted hoặc resend outbox sai; exact free quota/sleep/secret/deploy plan đã duyệt.
**Release:** xin quyền riêng trước deploy/commit/push, backup/restore hoặc Cloud configuration.

## 6. Traceability coverage và outputs

| Milestone | Requirement ID | Evidence ưu tiên |
| --- | --- | --- |
| M1, M3 | REQ-AUTH-01, REQ-AUTH-02 | Auth thật, A/B access, gate current-state |
| M2 | REQ-EXP-01, REQ-EXP-02, REQ-EXP-03, REQ-EXP-04 | Search/detail/map/negative public reads |
| M2 | REQ-CNT-01, REQ-CNT-02, REQ-CNT-03 | Editorial/admin/provenance/upload policies |
| M2, M6 | REQ-UX-01, REQ-UX-02, REQ-UX-03 | vi/en/render/viewports/HTML-OG trước JS |
| M3 | REQ-SAV-01, REQ-SAV-02 | Collections owner/type/multi-save và deny B |
| M3 | REQ-RND-01, REQ-RND-02, REQ-RND-03 | All/selected/dedup/empty/unavailable/dependency |
| M4 | REQ-COM-01, REQ-COM-02, REQ-COM-03 | Thread rights/cascade và XSS |
| M4 | REQ-NOT-01, REQ-NOT-02, REQ-NOT-03, REQ-NOT-04 | Event/HMAC/dedup/temporal audience/realtime |
| M2, M5 | REQ-ADM-01, REQ-ADM-02, REQ-ADM-03 | Admin content, hide vs delete, marker/full cleanup |
| M5 | REQ-ADM-04, REQ-ADM-05 | Old JWT/admin safety/account cascade/receipts |

## 7. Self-review trước bàn giao

- [ ] Coverage: đối chiếu toàn bộ requirement với mục 6; không thêm tính năng ngoài PRD.
- [ ] Readiness: P01–P03 có input/output/file/verification; M1–M6 không bị ngụy trang thành runnable code plan.
- [ ] Consistency: owner names, decisions/gates và signatures không mâu thuẫn spec.
- [ ] Review Focus: mỗi lớp input/failure ở đầu file có acceptance milestone tương ứng.
- [ ] Proportion: không tạo SQL/OpenAPI/code giả; không sao chép toàn bộ spec vào task.

Sau review kế hoạch, chọn cách thực hiện preparation (agent tự làm trong session hoặc delegation được duyệt).
Việc user giao thứ tự đã được đáp ứng, không hỏi lại chọn luồng đầu; việc duyệt kế hoạch không tự cấp
quyền Cloud/install/release. Các execution plans code chi tiết cần quyền và spec đã sẵn sàng trước bắt đầu.
