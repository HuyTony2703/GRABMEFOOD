# GrabMeFood V2 — scaffold độc lập

**Acceptance hiện hành (owner-approved S, 2026-11-17):**64/21 giữ local scaffold/
resource/shutdown/persistence/config-negative guards và actual GitHub CI.
Formal live network/Connect/chain+hostname/quota inventory→65, roles→67–68,
grants/authenticated TLS/isolation→69–70 vẫn bắt buộc; Cloud chưa verified.
Các gate Cloud chưa đạt ở phần lịch sử không còn precondition đóng64.
Source/image không đổi trong lần publication này, không rebuild local.

SCRUM-63: Next/Nest skeletons, contracts/config và env/ports. Không giao diện sản
phẩm, business APIs, session/Auth implementation, DB migrations hoặc Cloud probes.
Không import source/CSS/ảnh/data legacy. Root Vite và lockfiles legacy giữ nguyên.

## Prerequisites và commands

Node24.16.0, pnpm11.5.0 (v2/.mise.toml riêng; không sửa .mise.toml root).
Dependencies đã được owner duyệt theo metadata engines/peers; lockfile riêng.
Từ thư mục `v2/`:

```powershell
pnpm install --frozen-lockfile
pnpm lint
pnpm typecheck
pnpm test
pnpm build
pnpm test:smoke
```

Không dùng root `npm install` cho V2, không generator/global install. Workspace
`allowBuilds: {}` không cho blanket lifecycle scripts. Review riêng nếu dependency
thực sự cần build. Registry/install/build không chứng minh compatibility trước
khi commands thật đạt; không claim CI remote chạy khi chưa có run evidence.

## Processes / ports

| Process | Port mặc định | Start riêng sau build |
| --- | --- | --- |
| Web diagnostic only |3000|`pnpm --filter @grabmefood/web start`|
| Gateway |3001|`pnpm --filter @grabmefood/gateway start`|
| Catalog |3002|`pnpm --filter @grabmefood/catalog start`|
| Community |3003|`pnpm --filter @grabmefood/community start`|
| Notification |3004|`pnpm --filter @grabmefood/notification start`|

Nest binds127.0.0.1; PORT override1024..65535 cho mỗi process. Web start pins
localhost3000; smoke dùng ephemeral port riêng. Không share domain ORM; contracts
chỉ transport types/constants, config chỉ env validation. DB pool budgets4/4/2,
Web/Gateway0, chưa tạo pool/driver hoặc gọi Cloud.

Nest `/health/live`, Web `/api/health/live`200 chỉ chứng minh process alive.
`/health/ready` (Web `/api/health/ready`) **503 not-implemented** cho dependencies
nghiệp vụ/Cloud chưa có probe. Không fake readiness200 vì startup thành công.
Đây là unavailable state có nhãn, không business response thành công giả.
Private/business routes chưa được tạo, không browser tokens/JWT-only shortcut.

Env example không có secrets và không tự load/copy. Config fail trước Nest bind
khi wrong project/unsafe pool/TLS/port; không in DSN/password/provider response.
Database-configured chỉ là validation, không DB/TLS verified. Không đọc credentials
thật hoặc CA thật để chạy tests; fixtures canary inert. Mỗi service phải được cấp
runtime role/env riêng ở task sau. Startup không provisioning/migrate/seed/reset.

Request log Nest: requestId mới từ server, service/method/status/duration; không
query/body/cookie/Authorization hoặc browser identity headers. CORS chỉ exact Web
origin cho health GET, không thay internal auth ở task61. SIGINT/SIGTERM shutdown
hook; smoke Windows dùng test-only IPC app.close, không giả POSIX/Docker signal test.

## SCRUM-64 — đang thực hiện, chưa nghiệm thu

Default CI ở `../.github/workflows/v2-ci.yml`: pinned action SHAs, Node24.16.0/
pnpm11.5.0, frozen install không lifecycle scripts; lint/typecheck/Jest + infra
policy tests/build/local-process smoke. Không Cloud secrets, Docker pulls/builds,
remote integration hoặc deployment. Workflow chưa được push/chạy trên GitHub;
local `pnpm verify` không phải evidence GitHub Actions run.

`pnpm test:infra` kiểm policy/Compose parser với inert fixtures, không Cloud/
Docker mutation. Không chạy đồng thời tests Node trên host với build experiment.
Host Windows preflight chỉ đọc Engine/Compose metadata, RAM/disk và bind thử ports:

```powershell
# Từ v2/. Không truyền DockerDataPath thì disk gate là unknown, không tự đoán.
.\scripts\preflight.ps1
# Khi owner xác nhận thư mục Windows đang chứa Docker data:
.\scripts\preflight.ps1 -DockerDataPath 'OWNER_CONFIRMED_EXISTING_DIRECTORY'
# Explicit budget-based demo-lite (không tự chọn profile theo available RAM):
.\scripts\preflight.ps1 -Profile demo-lite -Phase runtime -DockerDataPath 'OWNER_CONFIRMED_EXISTING_DIRECTORY'
```

Preflight không đọc `.env`/credentials hoặc Docker Desktop settings, không đổi
WSL/data location, không pull/build/start/stop. Thresholds theo approved plan:
usableRAM≥15GiB; demo-lite build/runtime dùng budget **4.25GiB**:
2GiB hard workload cap +1.25GiB incrementalVM/cache allowance +1GiB Windows
reserve. Baseline residentWSL đã phản ánh trong Windows available, không cộng
lại capacityVM7.61GiB; không dùng swap như RAM. Old6GiB là planning guard chưa
đo, không Docker/microservices requirement. Full/unbounded fallback vẫn giữ
legacy guard6, không được lấy budgetdemo-lite áp cho build unbounded. Disk giữ
Docker-data free≥15GiB/workspace≥10GiB ở mọi profile. Các ports
3000–3004/5672/15672 kiểm point-in-time; không giữ port reservation sau kiểm.
PASS host vẫn không chứng minh Cloud, runtime readiness hoặc có quyền dùng images.

Docker Engine đã kiểm truy cập được sau owner bật Desktop; số đo mới và blocker
ở [evidence64](../docs/maintenance/SCRUM-64-validation.md). Không coi historical
missing pipe bên dưới là current Engine status. Image proposal trong
`infra/image-proposal.json` **owner-approved** cho hai exact pins; không cấp
resource override. Docker data location owner đã di chuyển bằng Desktop sang
`D:\DockerDesktopWSL`; truyền path thực tế này, không pathC lịch sử. Disk15GiB
đo trên volume chứa supplied path; script không hardcode C. Windows/tempC được
đo riêng, không áp nhầm Docker-data guard lên C. Disk/RAM luôn
phải kiểm lại guard trước startup. Profile `demo-lite` đã owner duyệt,
record `infra/demo-lite.json`: production/no watch, build tách runtime,
Web512/Gateway256/Catalog256/Community256/Notification256/RabbitMQ512MiB,
tổng2048MiB. Caps đã actual inspect/measure trong6containers ở bài scaffold test;
không coi đó là full-feature/Cloud capacity verification.
Compose/Dockerfile và entrypoint đã có; resource/Cloud gates còn thiếu;
không vượt gate bằng liveness hoặc health giả.

### Orchestration (đã kiểm local scaffold; Cloud/CI còn thiếu)

`infra/compose.yaml` có đúng6services local, loopback published ports, named
RabbitMQ volume, pins/caps đã duyệt và no automatic restart để không che OOM.
Heavy Linux build nằm trong **một container2GiB/no swap/2CPU**, readonly source
mount, Node old-space768MiB, Next cpus1; frozen dependencies/no lifecycle scripts.
Không Windows node_modules/native artifacts hoặc host builds trùng.
`scripts/build-bounded.ps1` kiểm preflight/Node duplicates/no running containers,
sample Windows available/WSL WS/dockerstats, safety stop riêng test container nếu
available<1GiB hoặc timeout. Logs/metrics ở ignored `reports/<RunId>/`.
Không tự remove container/volume/artifacts. Linux-generated tar artifacts preserve
symlinks; Dockerfile chỉ ADD/COPY runtime, không heavy Node RUN ngoài cap.
Context là `reports/runtime-artifacts-<RunId>`, truyền qua `GMF_ARTIFACT_DIR`.
Image/cache/writable builder nằm Docker-dataD, Windows/temp vẫnC.

```powershell
.\scripts\build-bounded.ps1 -DockerDataPath 'D:\DockerDesktopWSL' -RunId 'budget-yyyymmdd-a'
```

Pilot ban đầu `budget-20261116-a` đã pull exact Node pin và chạy thật: cgrouppeak1.50GiB/
cap2GiB/noOOM/restarts0, Windowsavailablemin2.76GiB. Build **FAIL packaging/
noninteractive pnpm**, không runtimePASS. Regression fixes có RED29/3→GREEN32/32;
actual rerun bị chặn bởi availableRAM mới1.24–1.59GiB, không tiếp tục hạ budget.
VM WS delta pilot≈2.63GiB; residual so cgrouppeak làm allowance làm tròn lên
1.25GiB (không exact physical decomposition, xem evidence64).

Cached retry sau owner đóng apps: Linux compile+packaging **exit0** trong
builderA/cache cũ, sau fix actual deploy-dir-not-empty bằng fresh attempt path
(không delete). Artifacts thành công ở `reports/runtime-artifacts-resume-b`.
Lượt tiếp tục đã assembleWeb từ tar, **5/5images PASS**; không compile lại.
Project `gmf64-runtime-20261116-a` đã **6/6healthy đồng thời60giây**, HTTP
live200/ready503/business404, stop/start và durable broker message PASS,
OOMfalse/restarts0. Sau test graceful-stop đúng project, không delete data;
hiện containers retained/stopped, không mặc định đang chạy.
Cloud/GitHubCI vẫn unverified; overall runtimeVerified flag giữfalse, riêng
localScaffoldVerification ghi scopedPASS. Chi tiết/raw logs:
[budget evidence](../docs/maintenance/SCRUM-64-budget-validation.md).
[current runtime evidence](../docs/maintenance/SCRUM-64-runtime-validation.md).

`scripts/start-demo.ps1 -DockerDataPath <owner-confirmed path>` mặc định **không
start full demo** khi Cloud/business readiness chưa verified. Thêm
`-ScaffoldOnly` là opt-in diagnostics, không proof product journeys/Cloud.
`-PullApprovedImages` chỉ kéo hai pins đã duyệt; `-Build` gọi capped builder rồi
assemble5runtime images tuần tự;
mọi thao tác đều sau preflight, không auto pull ở `up`, không reset/prune/down.
Node/Rabbit exact pins đã pull; controlled build và short local scaffold runtime
đã kiểm thật. Full business/Cloud/CI/long-duration workload vẫn chưa verified.

`scripts/runtime-smoke.ps1 -DockerDataPath <path> -ArtifactDirectory <successful
Linux tar folder> -RunId <unique-lowercase-id>` chạy project test mới, generates
local broker password trong memory (không đọc existing secrets), refuses existing
project/duplicate hostNode, giữ guard; tự graceful-stop đúng test project khi
kết thúc, giữ containers/volume/canary message. Không dùng thay product demo.

Broker cần owner cung cấp local-only `RABBITMQ_DEMO_PASSWORD` qua approved local
secret channel, không chat/Jira. Script không tự load `.env`; `infra/.env.example`
chỉ inert canary cho **config tests**, không startup. Không đổi password trong
volume đang có bằng cách reset: credential initial bootstrap và restart phải
được owner quản lý nhất quán. Script không xóa volume khi lỗi.

Compose app health dùng **liveness**; readiness503 vẫn giữ. `up --wait` chỉ chờ
process/broker health, **không** Cloud/business readiness. Full demo không được
báo thành công bằng health này. Start error có thể để lại containers thuộc stack;
không tự cleanup/delete. Khi được owner cho phép stop/restart: dùng Compose
`stop`/`start` đúng project, không `down -v`; cần xác minh persistence thực tế.
`pnpm test:infra` giờ cần Docker Compose CLI để parse config (không cần Engine/
image/Cloud); probe tests dùng ephemeral localhost HTTP fixtures.
Không chạy hai host preflight song song: bind probes cùng ports có thể tự xung
đột. Chạy phase runtime/build tuần tự, ports chỉ được kiểm point-in-time.

## Boundary của63 (lịch sử bàn giao)

SCRUM-64 sau nghiệm thu63 mới làm Compose local apps/RabbitMQ, readiness
dependency checks, CI và runtime resource/preflight evidence. Supabase Cloud
không là container, không start Supabase Local hoặc implicit remote bootstrap.
Docker CLI/Compose đã có lúc kiểm nhưng Engine pipe không khả dụng; không pull/
start Docker ở63. Không thay Docker settings/data location hoặc cài WSL ngầm.

Nguồn: [plan](../specs/003-grabmefood-v2/plan.md),
[contracts](../specs/003-grabmefood-v2/contracts/README.md),
[architecture](../docs/architecture.md). Hành vi product/UI theo các task đã duyệt sau,
không coi diagnostic HTML là UI direction hoặc chứng minh journeys đã hoạt động.
