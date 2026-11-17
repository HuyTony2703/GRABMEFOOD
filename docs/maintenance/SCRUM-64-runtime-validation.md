# SCRUM-64 — local Docker scaffold runtime verified, task chưa Done

**2026-11-17 approved split S:** local evidence dưới đây giữ nguyên; live Cloud
integration không còn closure prerequisite64/21, chuyển bắt buộc65/67–70 theo
[gate review](SCRUM-64-gate-review.md). Actual GitHub CI vẫn chưa đạt; chưa Done.
Các câu “còn Cloud gate tại64” phía dưới là lịch sử trước amendment, không current AC.

## Authority / scope

Tiếp tục phần bị ngắt theo owner; giữ approved image pins, budgets và6services.
Không compile lại: dùng successful Linux tar artifacts `runtime-artifacts-resume-b`
và4images đã có. Git status/preflight/code đã reread, user work giữ nguyên.
Đầu lượt: builderA Exited0, không app containers/Node.exe host chạy trùng.
Không Cloud/WSL/global config, acceptance/dependency changes hoặc commit/push.

## Actual build và preflight

- Runtime preflight path `D:\DockerDesktopWSL`: Windowsavailable7.816471GiB≥4.25,
  data/workspaceD57.072487GiB, VMcapacity7791.8515625MiB≥3328, ports/Engine PASS.
- Chỉ `docker compose ... build web` từ Linux-generated tar, approved base
  Node24.16.0-bookworm-slim index pin unchanged: **exit0**.
- Cả5Docker runtime images nay build thành công; Web image index
  `sha256:1644f10b1b684c6f341421460961b898911a2266c0d8411b11695f7432429732`.
- Heavy Linux compile/packaging success đã ở ResumeB; không làm lại ở lượt này.
- Runtime harness `v2/scripts/runtime-smoke.ps1`: parser PowerShell actual PASS,
  explicit fresh project `gmf64-runtime-20261116-a`, actual script **exit0**.
  Chỉ kéo RabbitMQ4.4.0-management đúng approved index pin, không latest/upgrade.

## Actual Compose / smoke

Fresh6containers local, no duplicate hostNode. Broker dùng password ngẫu nhiên
mới trong process memory, không đọc existing credentials hoặc ghi secret vào
repo/Jira/report. No .env auto-load, no Cloud bootstrap/schema/Auth/Storage calls.
Không expose ngoài127.0.0.1. Existing containers/volumes khác không đụng.

- Positive `start-demo.ps1 -ScaffoldOnly` actual PASS (gọi từ harness), no build/
  implicit pull ở up, no migration/seed/reset. Healthy là liveness, không business.
- **6/6 chạy đồng thời, healthy** qua window60giây: Web/Gateway/Catalog/Community/
  Notification/RabbitMQ. Không tự tắt/bỏ service để đạt số đo.
- HTTP mỗi app: live200/service-name đúng; ready503/check not-implemented;
  `/api/v1/me`404. Diagnostic Web200/body identity đúng. Không fake Auth/business.
- Stop rồi start lại cùng project, không recreate/delete containers/volume;
  HTTP smoke lặp lại PASS. Durable queue +persistent canary message tạo trong
  broker test local, message còn sau restart; get `ack_requeue_true`, không purge/
  destructive consume. Đây là local broker persistence, không Cloud restore test.

## Resource results — scoped to this scaffold run

37samples gồm pull/startup/all-six-stability/stop/restart:
minWindowsavailable**4964.417969MiB (~4.848GiB)**,
peakVMworking-set**2993.074219MiB (~2.923GiB)**.
Đây là observed resident WS và available, không VM capacity hoặc swap credits.
Windows1GiB reserve không bị breach; no safety abort. No host app kill.

| Container | Actual memory cap MiB | Cgroup peak trước stop MiB | Peak sau restart MiB |
| --- | ---: | ---: | ---: |
| Web |512|169.47|62.23|
| Gateway |256|86.86|57.47|
| Catalog |256|69.02|57.05|
| Community |256|68.32|57.55|
| Notification |256|69.89|57.64|
| RabbitMQ |512|255.51|255.71|

Actual inspect: cap đúng Compose, MemorySwap==Memory (no added swap),
OOMKilled=false, RestartCount=0 (không restart bất thường) cho cả6.
Cgroup peaks đo riêng trước stop và sau restart, không cộng các maxima này như
actual simultaneous total peak. Không dùng60giây scaffold chứng minh full-feature
capacity/U_peak/SMTP/Cloud/long-duration stability.

## Shutdown / current state / data retained

Harness graceful-stop đúng project sau test, không để services ngốn RAM ngoài
ý muốn. Cuối lượt **0running app containers**; retained definitions:
Rabbit exited0;5Node apps exited143 (SIGTERM), không137/OOM/forcekill evidence.
BuilderA vẫn Exited0. Stop/start thực tế đã kiểm trên Docker Linux, không lấy
WindowsIPC test cũ thay POSIX evidence. Không delete/prune/down-v/reset.
Test broker volume/queue/message và images/artifacts giữ nguyên.

## Evidence local

Ignored `v2/reports/runtime-20261116-a/`:
`preflight.json`, `result.json`, `measurements.json`, `http-checks.json`,
`containers-before-stop.json`, `containers.json`, phase stdout/stderr logs,
final-stop logs. Không report Config.Env/password.
Build artifacts/logs giữ ở previous resume directories; source evidence này
tóm tắt actual results, không cạnh tranh business spec.

## Current gate

**Đã đạt local scaffold:**5images build,6simultaneous healthy, sampled resources,
200/503/404,60s window, stop/start +durable broker persistence, positive entrypoint.
**Chưa đạt task Done:** Cloud network/TLS+roles/quotas/preflight integration và
actual GitHub Actions run vẫn chưa verified; readiness503 là unavailable thực.
Full Auth/business/journeys/full-load capacity không implemented và không được
claim PASS. Không đổi AC/dependencies để close64;64/21 giữ In Progress.

## Final checks / Jira sync

`pnpm lint`, `pnpm test:infra` **36/36**, `pnpm test` **24/24**,
`pnpm typecheck` **7packages PASS**. Legacy baseline riêng: `npm test`
**47/47**,typecheck**0diagnostics/66files**,structure**73/73**. Feature validator
31/31/16/10,contracts11docs/64tasks/24constraints/31FR PASS; diffcheck exit0
(LFwarnings). Root tests không proofV2; actual Docker evidence phía trên là riêng.
Jira64 comment**10058**,parent21 comment**10059**, cả hai descriptions đã thêm
latest actual boundary, không thay status/assignee/dependencies/acceptance.
Không commit/push hoặc Atlassian Artifacts upload.

2026-11-17: owner yêu cầu ưu tiên CI/Cloud dependency audit, không replay6containers.
Current [gate review/proposal](SCRUM-64-gate-review.md) ghi CI auth/write approval
và TLS permission cần thiết, roles live UNKNOWN và acceptance-induced cycle.
Proposal chưa approved/applied; current acceptance/status vẫn giữ. Owner chưa
cần Artifacts upload, chỉ link repo evidence tại Jira.
