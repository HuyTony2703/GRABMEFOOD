# SCRUM-64 — bounded resource experiment (chưa Done)

## Authority, scope và baseline

Owner mới cho đánh giá/điều chỉnh local Compose/scripts/preflight theo budget có
cơ sở, đo build/startup/smoke, không bỏ safety/pins/services/Cloud/acceptance.
Git/AGENTS/permissions/current64/latest10055 đã reread;64 In Progress.
Allowlist v2/infra/scripts/tests/preflight +technical Next build concurrency và
README/architecture/plan/validation/evidence/Jira. Không UI/business/Cloud schema/
credentials/SQL/global config/WSL/remote mutation/deploy/commit-push.

Read-only Engine29.9.3/Linux, VMcapacity8170352640bytes≈7.61GiB,20CPU,
0containers/0images trước experiment. Windows usable15.710GiB, five short idle
samplesavailable5.6810/5.6798/5.6792/5.6793/5.6776GiB; WSLWS≈960.62MiB.
WindowsNode.exe count0, no listeners3000–3004/5672/15672. Không service trùng.
DockerDesktop/backend WS và WSLWS đo riêng, không cộng tất cả shared WS thành
unique physical total. LinuxVMcapacity không là resident usage hoặc Windowsfree.

## Vì sao thay6GiB và budget mới

6GiB trước là owner-approved **provisional planning guard** từ service estimate
2.25GiB +runtime/build overhead, không measured peak hoặc official requirement.
Thay bằng workload được hard-cap và telemetry; không chỉ đổi số để vượt guard.

- Heavy build: một Node Linux container, memory2147483648bytes, memory+swap
  same2147483648 →swap.max0. 2CPU, heap768MiB, page worker1/Rayon1, pnpm
  workspace-concurrency1; no host Node copy/watch/build song song.
- Runtime vẫn đủ Web512/Gateway256/Catalog256/Community256/Notification256/
  Rabbit512MiB, total2048MiB, no added swap. Chưa actual runtime PASS.
- Initial trial allowance512MiB, Windows reserve1024MiB →budget3584MiB.
  Pilot đo VMWSpeak3649.27−baseline960.62−cgrouppeak1537.85≈1150.8MiB;
  nâng allowance lên1280MiB, không giảm. Đây là conservative planning residual
  từ peaks không đồng thời, không exact unique physical-memory decomposition.
- Final phase requirement2048cap+1280allowance+1024Windowsreserve=4352MiB
  =**4.25GiB Windows available** cho explicit demo-lite build/runtime.
  Baseline residentWSL đã được reflected trong available, không cộng trùng.
  Runtime chưa đo, dùng allowance này như hypothesis conservative cần validate.
  Full/unbounded fallback giữ legacy6, không được áp demo-lite budget cho build
  unbounded. Không đọc/chỉnh .wslconfig hoặc Docker VM limits.
- Linux MemAvailable phải≥3328MiB trong builder trước install; VMcapacity
  được preflight kiểm riêng≥3328MiB, không dùng nó thay Windows available.
  Host available
  monitor safety stop exact experimental container nếu<1024MiB hoặc timeout.
  Không dùng swap/pagefile như physical available, không auto hạ cap/guard/retry.
  Disk guard Docker-data15GiB/workspace10GiB giữ, targetD owner đã duyệt.

## Implementation

- `infra/demo-lite.json`, preflight policy: formula theo phase; explicit profile,
  missing/unsafe measurements fail closed; not Cloud readiness.
- `build-bounded.ps1` + `.sh`: refuse hostNode/running containers, readonly source
  allowlist (no .env/node_modules/outputs), approved Node index pin ONLY;
  install exact approved pnpm inside container, frozen lock/no lifecycle scripts.
  Native Linux artifacts tar export preserves symlinks, no Windows natives.
- `infra/Dockerfile` chỉ runtime ADD/COPY, no heavy RUN. Compose uses tar context/
  approved base/pins, caps/noSwap. Next technical build cpus1, no UI direction.
- `measure-local.ps1`: time samples Windows available, VMWS/dockerstats; selected
  state/OOM/restarts and cgrouppeak/events logs. Không credentials/global settings.
  Reports ignored; no auto container/volume/artifact removal.
- start-demo uses bounded builder when Build flag; no duplicate hostNode;
  full demo default remains blocked Cloud/business readiness, diagnostic mode
  explicit. Không infer “healthy liveness” là full functionality.

## Actual trial A — resource checks khác build success

`build-bounded.ps1 ... -RunId budget-20261116-a`:
Node24.16.0-bookworm-slim pull digest chính xác
`sha256:2c87ef9bd3c6a3bd4b472b4bec2ce9d16354b0c574f736c476489d09f560a203`.
Container `gmf64-build-budget-20261116-a` started with cap2GiB/noSwap/2CPU,
không chạy runtime services đồng thời.

LinuxMemAvailable đầu7104792KiB, cgroupmax2147483648/swapmax0.
Actual frozen Linux install474packages (platform optional differs hostWindows,
pins/lockfile unchanged), TS shared/gateway build chạy. Packaging deployFAIL:
`ERR_PNPM_ABORTED_REMOVE_MODULES_DIR_NO_TTY`, exit1, not OOM. Không build hoàn tất.

15telemetry samples: Windowsavailablemin2825.84375MiB (~2.760GiB),
VMWSmax3649.265625MiB. Cgrouppeak1612550144bytes (~1537.85MiB),
memory.events max0/oom0/oom_kill0/oom_group_kill0. Docker stateexited1/
OOMKilledfalse/RestartCount0; cap/MemorySwap2147483648 verified.
Các số này chỉ pilotpartial build, không Next/full-workload peak proof.

Raw local evidence:
`v2/reports/budget-20261116-a/{preflight,measurements,summary,state}.json`,
`build.stdout.log`, `build.stderr.log`. Không logs với credential; no broker secret.
Container retained stopped, image/data retained; không delete/prune.

## Regression fixes và rerun boundary

Actual script còn gặp PowerShell5 `NativeCommandError` khi `docker logs` chứa
npm notice trên stderr dù notice không phải statuscontainer. Đã capture stdout/
stderr riêng bằng Start-Process; actual log collection của stoppedA thành công.
pnpmfix: CI=true +npm_config_ignore_scripts=true, build toàn bộ trước deploy
có thể prune devdeps của temporary workspace (không host/source data).

Test-first new regressions `bounded-build.test.mjs`: **29pass/3fail RED**,
sau fix **32/32 GREEN**; existing cap/disk/phase negatives giữ. Đây là static
guards +actual RED/log-collector evidence; actual pnpmGREEN chưa chạy lại.

AttemptB: guard chặn **trước start/pull**, không containerB. New host available
1.594GiB rồi1.238GiB; vmmemWSL≈1163–1164MiB. Top process snapshot:
ZenlessZoneZero≈3463.6MiB và StarRail≈1249.6MiB working set. Không suy whole
usage tăng doDocker/cache; hostload đã đổi. Không kill/đóng app của owner.
Final budget tăng4.25GiB, không tiếp tục hạ để vượt. Dừng ở verified boundary.

## Chưa kiểm chứng / next step

- Actual rerun sau packagingfix, Next/Linux tar artifacts/full images;
- từng runtime/startup +whole6simultaneous smoke/health/readiness503 expectations,
  OOM/restarts/time-series/stability và graceful shutdown/persistence;
- CloudTLS/runtime roles/quotas/Auth/SMTP; GitHub Actions run.

Không đổi acceptance/dependency, không Done64/21. Không Rabbit pin pull/start
hoặc Cloud operations. Next step: owner giữ host workload ổn định/đóng app nặng
nếu muốn, cần≥4.25GiB theo budget rồi chạy lại **cùng cap**, không sửaWSL hay
lowerguard. Nếu vẫn OOM hoặc host reserve breached, báo fail/capacity limit;
không auto tune vô hạn. Default local build-container timeout900s.

Final preflight với revised4352MiB budget actual:
Windowsavailable**0.634468GiB**<4.25 BLOCKED, Docker-data/workspaceD57.958324GiB
PASS, VMcapacity7791.8515625MiB≥3328 PASS, Engine/Compose/ports PASS.
Capacity VM check không thay Linux MemAvailable hoặc Windowsfree check.
Host available dưới1GiB safety reserve, nên **không chạy thêm build/tests Node
nặng/Next/Jest/typecheck** trong lượt này. Root47/47/typecheck/structure ở
historical evidence không được gọi là fresh PASS. Final revised-budget/VMcapacity
test case đã thêm (expected33tests) nhưng chưa rerun;32/32 là trước revision này.
Không hạ guard để chạy nốt hoặc auto restartWSL/drop caches/kill host apps.

## Owner đóng apps — cached retry và kết quả Docker build riêng

Owner mới giao recheck/build lại phần packaging với cache, chỉ chạy Compose/
smoke nếu build+preflight đạt; không config theo phỏng đoán/Cloud/scope expansion.
Git status/old build state/mount/pins đã kiểm: exact Node image, stopped builderA,
cap/swap2147483648, readonly source, no Node.exe hoặc running service duplicate.
Không đổi resource caps/budget/WSL/architecture trong lượt này.

### Preflight và actual cached Linux build

Initial build preflight **PASS**: available7.565880GiB≥4.25, data/workspaceD
57.957031GiB,VMcapacity7791.863MiB,Engine/ports PASS.
Resume đúng `gmf64-build-budget-20261116-a`, không recreate/delete. Install
Already up-to-date1s, tất cả7workspace packages (Next +4Nest +2shared) build.

ResumeA `reports/budget-20261116-resume-a`: Next compile/typecheck/page-generation
thật với1worker thành công, rồi packaging exit1 vì `/deploy/gateway` tồn tại từ
failure cũ (`ERR_PNPM_DEPLOY_DIR_NOT_EMPTY`), không OOM.
12samples: minWindowsavailable3651.550781MiB, maxVMWS2919.324219MiB,
cgrouppeak1230274560bytes, memory.events oom/oom_kill0.

Fix đúng lỗi actual: mỗi retry deploy vào `/deploy/attempt-<UTC-nanoseconds>/...`,
không xóa output cũ. Focused regression RED3pass/1fail trước fix →GREEN4/4;
existing assertions giữ. No resource/config changes theo phỏng đoán.
Guard có chặn một retry khi available3.570187<4.25; không bypass.

Sau focused/fullinfra tests, preflight retry đạt và ResumeB chạy:
`reports/budget-20261116-resume-b` state **exit0/OOMKilledfalse**, log
`BOUNDED_BUILD_COMPLETE`, deploy cả4Nest +Next standalone tar thành công.
Cgrouppeak1130512384bytes (~1078.14MiB), events max/oom/oom_kill0.
16samples: Windowsavailablemin4398.480469MiB (~4.295GiB),
maxVMWS2223.886719MiB; no reserve safety stop.

Linux compile/packaging **PASS**, không đồng nghĩa runtime Docker images đầy đủ.
Export mới `reports/runtime-artifacts-resume-b`: Gateway/Catalog/Community/
Notification mỗi tar≈20.43MiB, Web≈38.98MiB +liveness script.
Linux symlinks preserved trong tar, không Windows node_modules.

### Runtime image assembly / containers / simultaneous runtime

Compose build tuần tự từ các tar, giữ exact base pin:
- Gateway **exit0**, image `grabmefood-v2-gateway:scaffold`;
- Catalog **exit0**, image `grabmefood-v2-catalog:scaffold`;
- Community **exit0**, image `grabmefood-v2-community:scaffold`;
- Notification **exit0**, image `grabmefood-v2-notification:scaffold`;
- Web **chưa chạy Docker image assembly** vì preflight trước bước này blocked.

PowerShell inline first collector đọc ExitCode null sau process exit dù Docker
logs/image-inspect chứng minh Gateway built; rerun cached collector giữ process
Handle trước wait, lấy explicit exit0 cho4images. Không coi null là Docker failure
hoặc sửa Dockerfile để che lỗi collector. Raw assembly stdout/stderr logs retained.
First Gateway assembly telemetry saved `image-measurements.json`; later inline
loop ended at guard before final aggregate write, nên **không claim complete
assembly peak time-series** cho tất cảimages.

Runtime preflight sau4images: available4.240234GiB<4.25 BLOCKED, D57.077377GiB
PASS. Final Web-gate recheck sau fresh regressions: available3.763187GiB<4.25
BLOCKED, không đổi/ngầm làm tròn guard. Không tiếp tục poll vô hạn để bắt PASS.

**0 app containers chạy/healthy**, broker chưa pull/start, builderA retained
**Exited(0)**; không đồng nghĩa app Healthy. Không tạo broker secret/volume test
vì chưa tới gate Compose. **Whole6 simultaneous runtime chưa kiểm**; Docker
app image build đạt4/5, không tuyên bố5/5. Cloud/GitHubCI vẫn chưa verified.

### Fresh checks và handoff boundary

- Full infra **34/34 PASS**, includes revised4.25/VMcapacity negatives và new
  resume regression (supersedes earlier pending33).
- `pnpm lint`, `pnpm test` **24/24 PASS**.
- Root baseline riêng: `npm test` **47/47**,typecheck**0/66**,structure**73/73 PASS**.
- Full production Next/Nest builds là actual Linux ResumeB evidence; không chạy
  bản Node tương ứng trên host khi đo builder/assembly.
- Không auto close process/delete/reset/prune/WSL/global/Cloud changes/commit-push.
  Docker data/images/cache và stopped builder được giữ.
-64/21 giữ In Progress: lỗi packaging actual đã fix+verified; blocker hiện là
  host available RAM tại Web/Compose gate. Cần giữ workload ổn định≥4.25GiB,
  sau đó chỉ assembleWeb từ cached tar rồi full6Compose/smoke. Không rebuild/
repackage lại khi artifacts đã thành công trừ khi source thay đổi.

## Latest continuation — previous blockers superseded for local scaffold

Owner yêu cầu tiếp tục đoạn dở. Đã assembleWeb duy nhất,5/5images hoàn tất và
actual6simultaneous scaffold runtime/stability/stop-start/persistence PASS.
Không compile lại/pin hoặc resource retune. Final health/usage/retained-stopped
state và missingCloud/CI gates:
[current runtime validation](SCRUM-64-runtime-validation.md).
Historical “Web blocked/no runtime” phía trên giữ provenance, không current state.
