# SCRUM-64 — đang thực hiện, chưa nghiệm thu

**Current 2026-11-17:** owner-approved split S chuyển mandatory live Cloud TLS/
roles/grants/isolation gates tới65/67–70;64/21 giữ actual local +actual GitHub CI,
không gọi Cloud PASS. C đã chuẩn bị61-file staged snapshot, chờ owner review
trước commit/push; host T attempt1 DNS ENOTFOUND, container attempt2 chưa chạy.
Current [gate review](SCRUM-64-gate-review.md) ưu tiên hơn các AC lịch sử dưới.

**Latest:**5images build +6simultaneous healthy local scaffold/short stability/
stop-start/broker persistence đã actualPASS, containers hiện retained/stopped.
Cloud/GitHubCI/business readiness chưa verified, task chưaDone.
Xem [current runtime evidence](SCRUM-64-runtime-validation.md).
Các blocker RAM/disk và “chưa build/start” phía dưới là chronological history,
không thay current actual results.

## Assignment / authority / scope

Owner cho tiếp tục64 sau63 Done; yêu cầu `docker version`/`docker info`, **không
pull/start images trước duyệt exact version/digest**. Build image cũng chưa chạy.
Current Jira63 Done,21 In Progress,64 To Do trước kickoff; reread parent/subtask/
amendments/latest10041.64 chuyển In Progress bằng workflow21; không redo63.

Allowlist hiện tại: `v2/scripts/**`, `v2/tests/**`, `v2/infra/**`,
`v2/package.json`, `v2/README.md`, `.github/workflows/**`, root README,
architecture/feature-validation và evidence này. Không migration/schema/seed/Auth/
business/UI/assets/legacy source/lockfiles, permission/global changes hoặc Cloud.
Không cần UI skill; reuse approved Spec Kit plan, không rerun generation.
Git status/diff đã kiểm; giữ toàn bộ modified/untracked user work và `.vscode/`.

## Actual Docker checks — thay thế blocker Engine của63

- `docker version`: PASS client29.9.3/API1.56/windows-amd64,
  server Engine29.9.3/API1.56/linux-amd64, Desktop4.99.0(245822),
  context desktop-linux.
- `docker info`: PASS,20CPU,VM RAM7.609GiB,WSL2 kernel,
  **0images/0containers**, local logging driver, Linux DockerRootDir `/var/lib/docker`.
  Linux path này không chứng minh ổ/Windows data-location.
- Không start Desktop/WSL, sửa settings/limits, move VHD hoặc truy cập credentials.
  Engine available không có nghĩa full-stack preflight PASS.

## Image metadata — proposal lịch sử, owner approval ở cập nhật bên dưới

`docker buildx imagetools inspect` chỉ lấy registry manifests/index, không pull
image layers. Node exact tag PASS; RabbitMQ floating4-management lần đầu TLS
handshake timeout, retry thành công; exact4.4.0-management được kiểm riêng cùng
index digest. Official-images source metadata khớp tag4.4.0-management.

| Official reference | Index digest (proposed pin) |
| --- | --- |
| `docker.io/library/node:24.16.0-bookworm-slim` | `sha256:2c87ef9bd3c6a3bd4b472b4bec2ce9d16354b0c574f736c476489d09f560a203` |
| `docker.io/library/rabbitmq:4.4.0-management` | `sha256:753099a19b577c322117f793f864b3129cbba96d40317221a69d73976e3c843c` |

Explicit target platform linux/amd64, child manifests lần lượt:
`sha256:ca520832af80fa37a57c14077ed0fcdd83b5aefccc356059fdc3a9a05b78ae1f`,
`sha256:c4ed08f8dc5d65b773e38aee447c64c81a8d0a66bcb8fc390fc23601bfc91a12`.
Machine-readable proposal `v2/infra/image-proposal.json` pending-owner-approval.
Không install/tool update hoặc image pull/build/start; metadata không vulnerability
scan, package compatibility, TLS Cloud, broker/runtime or signal verification.

## Resource measurements — actual snapshots, not full-workload evidence

- CIM usableRAM15.71GiB/free2.93GiB snapshot đầu; workspace Dfree60.68GiB,
  Cfree12.96GiB. Không tự đóng app, dọn disk hoặc đổi resource guard.
- Actual `v2/scripts/preflight.ps1` sau đó: usable15.710075GiB PASS,
  free4.307209GiB **BLOCKED** (<6); workspace60.677872GiB PASS;
  Docker-data disk **UNKNOWN** (owner chưa cung cấp existing Windows directory).
  C/D là snapshot không suy data nằm C hoặc D.
- Engine/Linux/Compose PASS, bind probes3000–3004/5672/15672 PASS tại thời điểm kiểm;
  sockets đóng sau probe, không đảm bảo ports còn rảnh khi start sau này.
- Script xuất `status: blocked`, native policy exit2; shell wrapper báo exit1.
  Không lấy successful probe từng mục thành tổng PASS; không Cloud network call.

## Independent static work delivered

- Read-only `preflight.ps1` + pure `preflight-policy.mjs`: fail closed cho thiếu/
  invalid RAM/disk/Engine/Compose/ports, sanitized report; no .env/settings reads,
  Cloud calls hoặc startup. Host PASS không đồng nghĩa permission/start readiness.
- CI workflow: Ubuntu24.04, exact approved Node24.16.0/pnpm11.5.0, action SHAs
  resolve từ GitHub refs/action.yml; checkout persist-credentials=false,
  permissions contents:read. pnpm cài trong runner temp, không global trên máy owner.
  Frozen dependencies --ignore-scripts; pnpm verify bao gồm infra tests. No Cloud
  secrets/Docker pulls/builds/integration/deploy hoặc cache trust boundary mới.
- Infra tests dùng Node built-in, không thêm dependency/tool local.
- Compose/Dockerfiles/start-demo chưa tạo: chờ owner exact image approval.
  Full demo readiness vẫn phải fail khi Cloud/runtime probes chưa tồn tại; không
  rename liveness thành readiness để fake demo success.

## Gate còn thiếu

**CHƯA ĐẠT:** GitHub Actions run (chưa commit/push), Compose build/start,
RabbitMQ readiness/persistence, Docker SIGTERM/shutdown và full-stack resource checks.
**BỊ CHẶN:** exact image approval, free RAM≥6GiB và Docker data-location/disk check;
Cloud runtime roles/CA/usable target/credential permission còn thiếu. Không dùng
admin postgres hoặc tự provision để gỡ blocker. TLS/quota/SMTP/DB authentication/
pool-capacity remain unverified; no remote SQL/mutation, Supabase Local,
startup migration/seed/reset hoặc commit/push.

## Verification

Initial `pnpm test:infra`: **12/12 PASS** (policy/negative/CLI/safe-collector),
trước bổ sung delivery/CI static assertions. Final results được ghi sau actual run.

Final local checks sau implementation:

- `NEXT_TELEMETRY_DISABLED=1` + `pnpm verify`: **PASS** lint/typecheck7packages,
  Jest24/24, infra **14/14**, build7packages, smoke5 actual host processes.
  Health live200/ready503/business404; không phải Docker/Cloud verification.
- Root `npm test`: **47/47 PASS**; `npm run typecheck`: **0diagnostics/66files**;
  `npm run check:structure`: **73/73**. Legacy baseline riêng, không V2 runtime.
- `git diff --check`: exit0, LF→CRLF warnings only; không bao gồm untracked files.
- `docker image ls` / `docker container ls --all`: cả hai exit0, không dòng,
  xác nhận sau local verification vẫn không images/containers.
- No installed YAML/actionlint tool added; workflow tests are **static assertions**,
  không gọi đó là full workflow syntax validation hoặc GitHub Actions execution.
- Git status giữ earlier user work; new `.github/` và64 artifacts uncommitted.

## Owner duyệt pins / kiểm tài nguyên và process (lượt tiếp)

Owner: “Tôi duyệt 2 image pins”, Docker Disk image location
`C:\Users\HUY\AppData\Local\Docker\wsl`; yêu cầu read-only process/disk/Node check,
giải thích6GiB và trình lighter demo proposal. Không kill/delete/prune/data move/
resource guard change/WSL config. Không có yêu cầu upload Artifacts.
Current Jira64 reread status In Progress/latest10044; không amendment mới trong
latest comments. Không sửa chồng lấn file khác; chỉ approval record/test/docs.

### Actual checks

- `Get-Item` xác nhận supplied Docker data directory tồn tại, ở C.
  CIM disk Csize200GiB, free12.948GiB snapshot đầu. Actual
  `preflight.ps1 -DockerDataPath <owner-supplied path>`:
  **Docker-data free12.947411GiB<15 → BLOCKED**; workspaceD60.681858GiB PASS.
  Đây là free space volume chứa data, không dung lượng còn bên trong ext4/VHD
  hoặc cam kết đủ space cho layers/build cache/growing VHD.
- Host usable15.710GiB; free3.163GiB snapshot đầu, preflight3.221798GiB,
  recheck timestamp2026-11-16T20:33:24+07:00 free3.830GiB. Không dùng snapshot
  cao nhất làm peak guarantee; tất cả<guard6. Không cộng WS/process/VM vào
  freeRAM lần nữa. Preflight tổng blocked, ports/Engine/Compose/Linux PASS.
- `docker ps --all`, `docker stats --no-stream`: không dòng. Sanitized
  `docker info`: Engine29.9.3,0containers/0running/0images,MemTotal8170340352
  (~7.609GiB) là capacity VM thấy được, KHÔNG RAM physical đang resident.
- CIM `Name='node.exe'`: **0 Windows Node processes**; Get-NetTCPConnection
  không listener Node/service ở3000–3004/5672/15672/8443. Không evidence
  chạy trùng V2 ngoài Docker trên Windows tại thời điểm đo; không suy cả máy
  không dùng JS (Electron apps không nhất thiết có tên node.exe).
- Top working sets, theo process group snapshot sau (MiB):
  Chrome18process≈2147.1; Code14≈1988.7; Zalo8≈910.6; OpenCode3≈852.6;
  Notion7≈802.5; vmmemWSL≈713.4; Docker Desktop5≈638.7.
  vmmemWSL trước đó≈984MiB; biến động, không static reservation.
  Group WS sums có shared pages/different sampling; không là unique physical
  consumption hoặc số RAM chắc chắn thu hồi nếu owner đóng app. Không đề nghị
  kill Windows/Defender/DWM/service hệ thống.
- `wsl --list --running --verbose` có output bất thường: docker-desktop báo
  Stopped dù docker info trước/sau thành công. Không dùng output này kết luận
  Engine down hoặc không có process Linux khác; không start/stop/restart WSL.
- Không in process command lines/env, đọc credentials/WSL config hoặc Docker
  account settings. Không pull/build/start images, host service hoặc container.

### Vì sao ngưỡng6GiB?

Nguồn [architecture budget](../architecture.md#localhost-resource-budget--owner-duyệt-provisional-chưa-đo-runtime)
và approved plan: 384MiB Web +256MiB Gateway +3×384MiB services +512MiB broker
=2304MiB=2.25GiB dự kiến; thêm VM/runtime/cache/build overhead → target steady
≤4GiB, peak≈6GiB. Owner duyệt **provisional freeRAM guard6GiB** trong Gói A
trước implementation. Không có measured decomposition của4/6GiB, không suy
“6 = công thức chính xác” hoặc requirement chính thức Node/Docker.
Build peak và steady-state không cùng profile. Host available RAM sau Engine
đã chạy đã phản ánh resident VM; không cần cộng toàn bộ7.609GiB capacity VM
hoặc ~0.7–1GiB WS baseline thêm lần nữa vào freeRAM requirement.
Đây là conservative planning guard; chỉ owner approval riêng mới đổi policy.

### Đề xuất `demo-lite` — CHƯA DUYỆT, CHƯA ÁP DỤNG

Giữ đủ Web/Gateway/Catalog/Community/Notification/RabbitMQ, same approved image
pins, Supabase Cloud và DB budgets4/4/2. Không đổi service ownership/Auth/session
hoặc bỏ Notification để làm số đo nhẹ giả. Production Node/Next standalone,
không dev/watch/HMR/ts-node/parallel build/E2E trong lúc demo.

| Container | Proposed hard cap | Proposed V8 old-space cap |
| --- | ---: | ---: |
| Web production |512MiB|256MiB|
| Gateway |256MiB|128MiB|
| Catalog |256MiB|128MiB|
| Community |256MiB|128MiB|
| Notification |256MiB|128MiB|
| RabbitMQ (giữ management image đã duyệt) |512MiB|N/A (BEAM, không V8)|
| Tổng hard caps |2048MiB =2GiB|Không phải tổng RSS|

Các cap là **starting experiment**, chưa đo Nest/Next/features/broker thực tế.
Old-space không giới hạn toàn bộ Node RSS/native/buffers/threads; luôn có khoảng
cách với cgroup cap. Với RabbitMQ đề xuất memory high watermark absolute256MiB,
phân biệt flow-control threshold với hard cap512MiB, chưa benchmark throughput.
Không áp các setting này hiện tại. Cgroup caps không reserve RAM, cũng không
chứng minh host đủ bộ nhớ; OOM phải fail/report, không restart loop để che.

Đề nghị tách gate sau **approval riêng**:

1. Build tuần tự bằng toolchain hiện có trên workspaceD, tách khỏi runtime;
   không đồng thời full-stack demo. Build phase vẫn giữ guard6GiB cho đến có
   measured evidence/approval khác. Ưu tiên đóng gói prebuilt production output
   vào runtime images thay vì npm/pnpm install+Next build trong DockerC.
   Build cache/image layers cuối vẫn chiếmC, không coi workspaceD giải quyếtC.
2. Runtime-only `demo-lite`: đề nghị host freeRAM≥**4GiB**, Engine đã chạy,
   tổng container caps2GiB +planning allowance cho incremental VM/cache/native
   và host buffer; target incremental whole-stack consumption≤3GiB so với
   idle-Engine baseline. Allowances chưa đo, không promise. Profile default/full
   giữ6GiB; KHÔNG hạ policy global hoặc tests để làm preflight hiện tại PASS.
3. Giữ Docker-data disk guard≥**15GiB** (C hiện thiếu≈2.05GiB để đạt guard,
   không có nghĩa chỉ thêm2.05GiB là đủ workload/updates/builds). Owner tự quyết
   định giải phóng thêm dung lượng ngoài Docker hoặc đề xuất di chuyển data
   sangD bằng Desktop trong approval riêng; agent không xóa/prune/move.
4. Controlled run sau khi gates đạt: ghi host available/VM WS/container memory/
   OOM/restarts theo thời gian; đề nghị dừng bài test bằng graceful stop khi
   host available<1GiB kéo dài30s, có OOM/restarts hoặc readiness regression.
   Đây cũng chỉ proposal, cần owner duyệt quyền start/stop exact stack, không
   cấp blanket permission kill process hay reset volume.
5. Runtime free4GiB hiện cũng chưa đạt ở snapshot3.83GiB; owner có thể chủ động
   đóng browser/IDE/app không cần rồi đo lại. Không chắc thu hồi theo WS sums.
   Không đổi `.wslconfig`/VM global cap7.609GiB; capcontainers trước, không
   cam kết an toàn workload đầy đủ chỉ bằng heap flags.

### Approval bookkeeping, không bug fix

`image-proposal.json` ghi owner-approved exact pins và `resourceGateOverride:false`.
Delivery test cập nhật theo yêu cầu mới (pending→approved), giữ kiểm immutable
digests và thêm exact hash/approval-scope assertions; không phải sửa expectation
để che defect. `preflight-policy.mjs` thresholds15/6/15/10 và tests giữ nguyên.
Runtime vẫn BLOCKED;64/21 không Done, không Cloud verification hoặc commit/push.

Checks thực chạy sau approval-record/docs/test update: `pnpm test:infra`
**14/14 PASS**, `pnpm lint` PASS; root `npm test` **47/47 PASS**,
`npm run typecheck` **0diagnostics/66files**, `npm run check:structure` **73/73**;
`git diff --check` exit0 (LF warnings). Không rerun build/smoke/Cloud/Docker
runtime trong lượt kiểm tài nguyên; không gọi historical verify là fresh run.

## Owner duyệt demo-lite — amendment và implementation preflight

Owner: “Tôi duyệt profile trên và nhớ bổ sung trên jira để đồng bộ”.
Chấp thuận profile ở final report trước: production/no watch, giữ6containers,
caps512/256/256/256/256/512MiB=2GiB, runtime-only freeRAM4/build+default6,
disk15/workspace10/usable15 không đổi. Không dùng approval profile như blanket
start/stop/kill/WSL/data-move/Cloud permission; không tự approve hidden V8/broker
watermark flags hoặc abort policy khác chưa nằm trong final profile được duyệt.

- Record `v2/infra/demo-lite.json`: owner-approved, declared targets,
  runtimeVerified:false, no watchers/buildDuringDemo/disk waiver.
- `preflight.ps1 -Profile demo-lite -Phase runtime` opt-in rõ ràng; mặc định vẫn
  full/build. `preflight-policy.mjs` giữ thresholds cũ, chỉ chọn4 cho đúng runtime
  profile; invalid profile/phase/CLI switches bị reject. No threshold auto-detect.
- Container caps hiện chỉ config declaration; Compose/Dockerfiles chưa tạo nên
  **chưa enforcement/cgroup/OOM/resource runtime verification**.
- Test-first cho requested capability mới, không bug existing approved default:
  RED `pnpm test:infra`15pass/3fail (runtime4 không pass, chưa reject unsupported
  selection/CLI); implementation giữ nguyên tests, GREEN19/19 (thêm exact caps/
  approval assertion). Existing default/negative/disk tests không weaken.
- Fresh `pnpm lint` PASS. Actual approved-profile preflight:
  RAM4.680862GiB≥4 **PASS**, Docker-dataC12.969654GiB<15 **BLOCKED**;
  workspaceD60.681843GiB, usable15.710075, Engine/Linux/Compose/ports PASS.
  Host total vẫn blocked, Cloud not-verified; shell nonzero. Đây là snapshot mới,
  không dùng RAM3.83 cũ làm current result hoặc suy build guard6 đã đạt.
- Chưa pull/build/start/kill/delete/prune hoặc chỉnh WSL. Không sửa unrelated user
  work, legacy source/locks/global permissions; không commit/push.64/21 chưa Done.

Jira: append approved amendment vào description64/21 sau fresh read, giữ toàn bộ
body cũ; read-back cả hai amendmentVerified=true/status In Progress. Evidence
comments64 **10047**,21 **10048** ghi tests/blockers/giới hạn approval.
Fresh checks: infra19/19,lint PASS; Jest24/24; root47/47,typecheck0/66,
structure73/73; feature31/31/16/10,contracts11docs/64tasks/24constraints/31FR;
diffcheck exit0(LF warnings). Không fresh full build/smoke/Cloud/CI run.
Plan chỉ thêm approved resource amendment64; hash mới
`783850dc7ca68424054e30369c189ebca6913a03e44ae4516ab1c4d07d538646`;
spec/tasks hashes không đổi, không claim rerun analyze.

## Rereview theo yêu cầu tiếp tục64 / chỉ Done khi đủ AC

Owner yêu cầu kiểm tiến độ, chưa xong tiếp tục, chỉ tự Done khi đã xong. Fresh
Jira64 description/latest10047: In Progress; amendment demo-lite đã có.
Git status và AGENTS/permissions/handoff/code đã reread; giữ user work.
Actual preflight runtime: freeRAM4.686214GiB≥4 PASS,
Docker-dataC12.970882GiB<15 BLOCKED, D60.681831GiB PASS; Engine/ports PASS.
Không pull/build/start. Thiếu space không chặn viết/parse orchestration files.

### Đầu ra bổ sung trong allowlist

- `v2/infra/compose.yaml`: đúng6local containers, memory limits512/256/256/256/
  256/512MiB, Node/Rabbit pins, local bridge/loopback ports/named broker data.
  Không local DB/Auth/Storage, bind mount/Docker socket/Cloud credentials,
  migrations/seed/reset. No automatic restart để không che OOM.
- `v2/infra/Dockerfile`: Linux build/deploy để tránh Windows native artifacts;
  exact Node base, approved pnpm11.5.0 installed trong image only, frozen deps/
  ignored lifecycle; Nest production deploy và Next standalone runtimes non-root.
  `.dockerignore` loại source env thật, host outputs/deps/cache.
  Docker build chưa chạy: packing/native/Linux/runtime compatibility chưa PASS.
- `v2/scripts/container-liveness.mjs`: localhost only/timeout/200+alive+scaffold;
  không Cloud call/logging. Health không business readiness.
- `v2/scripts/start-demo.ps1`: fail closed tại resource gate; full-demo mode còn
  blocked Cloud readiness trước Docker mutations. Explicit ScaffoldOnly cho
  diagnostics, explicit pullapproved/build flags; sequential image builds với
  build preflight6, runtime4 trước up; no build during running demo. `up` no-build/
  pullnever; no auto env file/secret print/reset/cleanup. Broker secret phải do
  owner cấp qua local channel, inert example chỉ config tests.
- App `up --wait` health là liveness, không assume Cloud/DB/broker consumers
  implemented; thiếu app dependency readiness vẫn503. Không fake full-demo success.

### Checks bổ sung thực chạy

- `pnpm test:infra` lần đầu:22pass/1fail vì Compose5 JSON byte limit là decimal
  string, harness ban đầu so numeric type. So sánh exact byte value bằng BigInt
  (expected caps không đổi, invalid bytes vẫn reject); sau bổ sung localhost
  probe positive/negative tests → **27/27 PASS**.
  Đây là test-adapter representation correction, không che runtime memory defect.
- Compose config được Docker Compose parser thật kiểm (YAML anchors/interpolation/
  schema), output JSON với inert canary; assertions kiểm đủ6services, exact byte
  caps/pins, loopback, volume, default env/pools, no host mounts.
  Không image build/runtime/Cloud verification.
- `pnpm lint` PASS trước thêm probe tests; final checks append sau actual run.
- Actual `start-demo.ps1 ... -ScaffoldOnly` **exit1 resource-blocked trước Docker
  mutation**. Không real env secret đọc vì fail trước password gate; không
  container/process startup. Đây là negative-entrypoint evidence, không startup PASS.

### Current acceptance

ĐÃ ĐẠT static scaffold/config/profile/CI file/preflight/Compose parsing/probe tests/
safe entrypoint negative path. CHƯA ĐẠT Docker image build/start, SIGTERM/resource
enforcement/Rabbit readiness+persistence/Cloud TLS+runtime roles+capacity/actual
GitHub Actions run. DiskC còn blocked, build RAM6 chưa verified đạt.64/21 giữ
In Progress; yêu cầu “nếu xong tự Done” không waive missing AC.

Final fresh checks bổ sung: pnpm lint PASS; pnpm test24/24; pnpm typecheck tất cả
7packages PASS; npm test47/47,typecheck0/66,structure73/73 PASS. Actual Docker
info cuối: Engine29.9.3,0images/0containers/0running, không side effect do tests/
negative entrypoint. Không chạy full Next/image build khi build guard chưa đạt.
Feature validator31/31/16/10 và contracts11docs/64tasks/24constraints/31FR PASS,
core hashes giữ từ approved profile amendment. Diffcheck exit0(LF warnings);
git check-ignore xác nhận infra/.env.example được exception, deps/Next output
vẫn ignored. Jira64 comment**10049**,21 comment**10050** đồng bộ progress và
blocker, không transition Done. Không commit/push hoặc Atlassian Artifacts upload.

## Owner chuyển Docker data sangD — read-only recheck

Owner báo tự chuyển bằng Docker Desktop sang `D:\DockerDesktopWSL`, giao kiểm
Engine/disk data/CWindows-temp/context, không pull/build/start khi chưa đủ và
không xóa data cũ. Đã reread Git/AGENTS/permissions/code và Jira64 latest10049.
Preflight hiện tại **đã đo Get-ExistingPathFreeGiB $DockerDataPath**, không
hardcode C; không cần sửa collector/policy hoặc hạ guard15.
Allowlist lượt này: thêm tests khẳng định volume-selection, README/architecture/
validation/evidence và Jira; không global/Docker/WSL/credentials/data mutations.

### Actual metadata

- `docker version`: client/server29.9.3, Desktop4.99.0, desktop-linux/linux-amd64.
  Sanitized info Engine29.9.3/0images/0containers/0running; LinuxRootDir
  `/var/lib/docker` không tự chứng minh Windows host path.
- Owner-reported target `Get-Item` xác nhận directoryD, free59.129GiB.
  Chỉ VHD file metadata: `disk/docker_data.vhdx` length1.459GiB,
  `main/ext4.vhdx` length0.094GiB. Không đọc nội dung/credentials, không exclusive
  open hoặc sửa VHD để chứng minh active use. Owner báo migration qua Desktop +
  folder/VHD tồn tại + Engine usable; không giả independent settings audit.
  VHD logical file lengths không bằng physical allocation/ext4 free capacity.
- Windows system driveC, TEMP `C:\Users\HUY\AppData\Local\Temp\`; Cfree14.818GiB
  snapshot đầu,14.837GiB metadata recheck. Không còn là Docker-data volume.
  Không áp Docker guard15 lên C; chưa có Windows/temp peak requirement riêng
  được duyệt/benchmark, không claim Windows updates/temp capacity guaranteed.
- Compose config parser resolved cả5app build contexts:
  `D:\Projects\GRABMEFOOD\v2`, Dockerfile `infra/Dockerfile`.
  Git-visible source inventory54files≈0.232MiB (không generated outputs/deps);
  đây là source estimate, KHÔNG exact Docker context transfer/temp hoặc image/
  build cache peak. Build layers/cache thuộc Docker dataD theo owner config;
  hostC vẫn cần space cho Windows/temp/tooling.

### Actual preflight với pathD

Initial runtime/build probes đã bị gọi song song; runtime port3000 báo blocked
nhưng build báo pass. Hai bind probes có thể tự xung đột; không quy kết app chạy
trùng hoặc port owner. Đã sửa cách chạy, rerun **tuần tự**, không sửa assertions:

- Runtime `-Profile demo-lite -Phase runtime -DockerDataPath D:\DockerDesktopWSL`:
  RAM2.806854GiB<4 BLOCKED; Docker-data59.128883≥15 PASS;
  workspace59.128883≥10 PASS; usable15.710075/Engine/Linux/Compose/allports PASS.
- Build cùng path, chạy sau runtime hoàn tất: RAM2.786564GiB<6 BLOCKED;
  data/workspace59.128883 PASS, Engine/Linux/Compose/allports PASS.
- Tổng cả2phase **blocked vì RAM**, không vì C<15 hoặc vì Docker data.
  Native preflight policy exit2/shell wrapper exit1. Cloud not-verified.
- Không pull/build/start, kill/cleanup/delete/prune hoặc đổiWSL/settings.
  Không đụng thư mục DockerC cũ.64/21 giữ In Progress, không waive runtime gates.

Thêm2tests path/volume selection (không bug fix vì collector đã dynamic):
DockerD59.129/C14.818 vẫn pass numeric disk guard; DockerD14.999/C100 vẫn fail.
Collector source phải lấy supplied path, không fixedC literal. Existing default/
disk/phase assertions giữ; final executed checks ghi sau actual run.

Final actual checks: infra**29/29**,lint PASS; root npm test**47/47**,
typecheck**0diagnostics/66files**,structure**73/73**,diffcheck exit0(LFwarnings).
Không app-source/UI/collector/policy edits, không fresh full build hoặc Cloud/CI
run. Jira description64/21 đã append current relocation/read-back verified;
comments64**10051**,21**10052** đồng bộ disk PASS/RAM BLOCKED, status In Progress.

## Audit tiếp theo — không có đủ điều kiện runtime để đóng64

Owner lặp yêu cầu kiểm tiến độ/tiếp tục nếu chưa xong/tự Done nếu xong.
Fresh Jira63 Done,64 In Progress/latest10051; Git/AGENTS/permissions/handoff và
current Dockerfile/entrypoint đã đối chiếu, không có approval bỏ missing AC.
Không sửa app/tooling chỉ để tạo thêm diff khi phần còn lại cần runtime evidence.

Preflight pathD chạy tuần tự:
- Runtime: RAM3.988968GiB<4 BLOCKED (không làm tròn lên4);
- Build: RAM4.042351GiB<6 BLOCKED;
- Cả hai: Docker data/workspaceD59.159153GiB PASS, usable15.710075/
  Engine/Linux/Compose/ports PASS. Dao động RAM giữa2snapshot không bằng
  runtime PASS hoặc workload stability.

Fresh checks: infra29/29,root47/47,typecheck0/66,structure73/73,diffcheck0
(LFwarnings). Docker info cuối Engine29.9.3/0images/0containers/0running.
Không fresh build/smoke/Jest/Cloud/CI run trong audit; không lấy historical
checks thay kết quả mới. Chưa pull/build/start/kill/delete/prune/WSL/Cloud/
commit-push. Lượt này chỉ evidence/Jira, không code changes.

| Acceptance còn lại | Vì sao chưa nghiệm thu / bước cần tiếp |
| --- | --- |
| Linux images build/start | Build guard freeRAM6 chưa đạt; owner tự đóng app không cần rồi recheck. Không hạ guard/tự kill. |
| Shutdown/cgroup caps/broker readiness+persistence | Cần actual approved local stack chạy; không chứng minh bằng Compose parser/HTTP fixtures. |
| Cloud TLS/runtime roles/preflight | Target/role/CA/credential-access scope còn thiếu; không tự provision/grants/SQL hoặc dùng admin postgres. |
| GitHub Actions run | Workflow có, chưa commit/push hoặc run evidence; request tiếp tục/Done không cấp quyền push/deploy. |

Stop tại verified boundary,64/21 giữ In Progress. Permission tự Done đã nhận
nhưng chỉ dùng sau đủ acceptance; không miễn blockers bằng đổi status.

## Superseding budget experiment do owner cho phép

Owner sau đó cho điều chỉnh local profile/preflight theo measured budget thay
6GiB fixed, bounded sequential build, no service/pin/Cloud/acceptance changes.
Đã pull exact approvedNode và chạy capped2GiB/noSwap build thật, không OOM nhưng
packagingFAIL. Regression RED29/3→GREEN32; actual fix rerun bị hostload guard
chặn. New derived budget4.25GiB (cap2048+allowance1280+reserve1024MiB);
final Windowsavailable0.634GiB nên dừng, chưa final33test run/full runtime/CI/Cloud.
Xem [budget evidence/runbook](SCRUM-64-budget-validation.md) cho baseline,
metrics/retained stopped container/script regressions và scope authorization.
Earlier6/4GiB notes là lịch sử, không current demo-lite guard.64/21 chưa Done.

Cached retry sau owner đóng apps: actual Linux all7packages compile/packaging
exit0 (builderA/cache reuse, cap2GiB/noSwap), fixed real deploy-directory collision
without deletion; focused RED3/1→GREEN4/4. Docker runtime images4/5 assembled
(Gateway/Catalog/Community/Notification); Web gate RAM blocked before assembly,
không app/broker runtime start/healthy/whole6concurrent smoke. Fresh infra34/34,
lint/Jest24/24/root47/47+typecheck0/66+structure73/73. Chi tiết
[cached retry evidence](SCRUM-64-budget-validation.md#owner-đóng-apps--cached-retry-và-kết-quả-docker-build-riêng).
