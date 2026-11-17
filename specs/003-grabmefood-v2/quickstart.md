# Validation quickstart — design vs runtime

## Hiện tại: chỉ SCRUM-60

Chạy từ root repo; Node/dependencies legacy đã có. Không install hoặc start stack.

```powershell
npm test
npm run typecheck
npm run check:structure
node scripts/check-guardrails.mjs
node specs/003-grabmefood-v2/validate.mjs
node specs/003-grabmefood-v2/contracts/validate.mjs
git diff --check
```

Expected: commands exit0; feature validator31 FR mapped/16 quality checklist;
contract validator kiểm links/task IDs/C00–C20/coverage. Static checks không
execute HTTP/schema/BFF hoặc xác nhận Cloud TLS/Auth/SMTP.
Remediation regression guards mở rộng constraints lên C00–C23, separate approval,
media GET/cache, fresh-proof reauth/resume fields và không coarse parallel marker;
không thay thế security integration tests. Mốc21 constraints là snapshot ban đầu.

Spec Kit installed1.3.3/OpenCode-PowerShell:

```powershell
$env:SPECIFY_FEATURE_DIRECTORY='specs/003-grabmefood-v2'
$env:SPECIFY_FEATURE_NO_PERSIST='1'
& .\.specify\scripts\powershell\setup-plan.ps1 -Json
& .\.specify\scripts\powershell\setup-tasks.ps1 -Json
& .\.specify\scripts\powershell\check-prerequisites.ps1 -Json -RequireSpec -RequireTasks -IncludeTasks
```

Setup-plan preserves existing plan; tasks setup resolves template, does not generate
implementation. Agent follows installed command instructions to write artifacts,
then analyze read-only. `NO_PERSIST=1` prevents resolver feature.json writes.

## Sau scaffold: prerequisites, không chạy ở60

- Owner giao subtask kế tiếp và nghiệm thu predecessors thực tế.
- Docker/WSL/resources checked64; approved dependencies63; one process/service.
- Approved Cloud project provisioned qua67–74 với permission target-specific;
  service DB credentials riêng ngoài Git, migration principal tách runtime.
- DB Connect metadata thật, IPv4/IPv6 compatibility/TLS chain+hostname verified,
  pool4/4/2/H12 và capacity checks. Không disable cert, không synthesize pooler.
- Auth URL/callback/reset allowlist + SMTP theo owner configuration; kiểm delivery
  bằng2 mailbox owner kiểm soát, không secret trong guide/log.
- Visual direction77/78 trước UI79/80, không tái sử dụng legacy.
- Isolated destructive target **chưa có**;75/76 blocked, không dùng project chính.

Planned runnable interface do tasks tạo, **chưa phải lệnh đã tồn tại/chạy được**:
`pnpm --dir v2 test`, `pnpm --dir v2 test:contracts`,
`pnpm --dir v2 test:integration`, `pnpm --dir v2 test:e2e`,
`pnpm --dir v2 build`, `pnpm --dir v2 demo:up`, `pnpm --dir v2 demo:down`.
63/64/107/115 phải implement/document scripts trước dùng; integration explicit
opt-in target/allowlist, mặc định CI không secret/reset. `demo:up` chỉ preflight/
start apps/broker, không provisioning/migrate/seed/reset.

## Runtime validation matrix — expected, chưa PASS

| Story / Jira | Reproducible setup và action | Expected acceptance |
| --- | --- | --- |
| US1 /85–86/89–96 | New demo dish2 sellers; one seller matches area but not price, other price not area; accented/case variants; empty query; cursor while publish changes | Correct same-offering match, null-price not0, draft404, outage503 not empty; back/forward URL state; no rating/map |
| US2 /81–84 | A/B + admin; signup→email verify→fresh login; expired/reused state; two sessions A; logout S1; change/reset password; faults between ledger/Auth commits | S2 survives logout; all old A denied after epoch, B survives; recovery-only denied private;503 protected failure/no false success; profile isolation |
| US3 /97–100 | Saved dish/restaurant each0/1/n; duplicate PUT; hide target; fail Catalog; concurrent unsave/random | No duplicate/cross-user/type/fallback; n≥2 no immediate repeat; errors not empty; unsaved before finalization not returned |
| US4 /101–102 | A root/B reply and mentions duplicate names; malicious markup; invalid parent target/reply depth; author delete; admin hide/restore | Escaped plain text, immutable handle, ownership denial, one-level thread, deleted body never restored/revealed |
| US5 /103–106 | Duplicate/late events; disable reply/enable mention; stale projection; save before receipt; unsave after receipt; lose HTTP response; replay read item | Full authoritative recipient set, one combined item/no self, frozen empty/pages; after-receipt change doesn't cancel; read state retained; pause polling hidden/logout |
| US6 /87–88 | Admin create draft dish/restaurant/offering; invalid MIME/oversize/outage upload; normal user forged admin request | Published-only guests; actual price/null correct; no upload false success; reject direct owner/bucket bypass |
| US7 /115–116 | Clean-path folder after approved provisioning; startup→edit→stop→start | ≥20 dishes/8 restaurants/2users/admin, persistence; no hidden migrate/reset/absolute author path |

Fault/isolation gates:62/70/107/108/112; performance111 thu timestamp/window/
workload/sampling, tách P/U, không snapshot5/8 làm peak. UI109/110 kiểm keyboard/
mobile/desktop/loading/empty/error/reduced motion.75/76 rebuild2 vòng và restore
chỉ trên isolated target duyệt riêng; không claim blocked test là pass.

## Evidence capture

### Remediation acceptance cases — obligations sau implementation

- New account thấy4 nhóm reply/mention/restaurant_update/admin_broadcast đều bật;
  update riêng một nhóm giữ3 nhóm kia. Create reply+mention emits1 combined
  event; edit không event mới; delayed processing giữ creation refs, không lấy
  mentions từ edited row; current group preferences vẫn xét lúc receipt decision.
- Media: guest public published200, public draft404 kể cả admin; `/admin/media`
  ledger-valid Admin200, user403/revoked401/authority outage503. `/media/avatars`
  chỉ current attached sanitized avatar; owner-only `/me/avatar/{id}` cho ready
  unattached preview, other user/admin404. Unpublish/unattach trước GET mới phải
  deny; no conditional304/optimizer/shared cache/direct Storage/signed URL bypass.
- Password operations: expired context401; fresh password proof chỉ change,
  fresh recovery proof cho reset hoặc recovery-bound resume pending change cùng
  account khi quên mật khẩu, không tạo operation cạnh tranh; wrong subject/
  purpose/expired/reused proof deny.
  Consume one write proof, single CAS attempt/fencing, response loss cleanup
  retry/status cùng operation/epoch; expire context không mở blocked admission.
  Proof ciphertext erased khi hết use/expiry, no plaintext password/logs; không
  normal session cookie từ reauth/recovery hoặc phục hồi old sessions.
  Timeout sau provider dispatch + late response: lease expiry/fresh proof không
  authorize second password write; unresolved provider outcome giữ protected503,
  không fake-success hay admin/SQL override.
- Thực hiện từng Jira subtask sau predecessors; không dùng `[P]`/T-number để
  chạy sớm ticket sau. Không sửa Jira dependencies để các tests có thể chạy.

### Evidence format

Ghi exact command/exit code, target không bí mật, case/assertions và fault point;
redact cookies/tokens/email/password/DSN. Screenshot chỉ chứng minh render, không
DB/session/grants. Mỗi bug có fail-before/pass-after regression, không đổi test
để che lỗi. Runtime acceptance phải cập nhật Jira và validation bằng evidence thật.
