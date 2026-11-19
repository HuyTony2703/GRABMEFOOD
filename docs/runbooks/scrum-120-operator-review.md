# SCRUM-120 Cloud operator package — review only

**Not approved to execute.** No Cloud connection, preflight, DDL or Jira change
was performed while preparing this package. SCRUM-120 remains To Do. This package
does not certify Cloud readiness and does not close SCRUM-49/75/76.

## Current Jira gates (read-only snapshot)

SCRUM-120 is To Do; assignee is empty. Its inbound `blocks` dependencies are
SCRUM-67, SCRUM-68 and SCRUM-119, all Done. SCRUM-120 itself blocks SCRUM-22,
which is currently Done. There are no direct Jira links from SCRUM-120 to
SCRUM-49/75/76.

Thus **no recorded Jira dependency blocks starting the target-specific
feasibility/read-only planning phase**. The bootstrap mutation phase is still
blocked by its own acceptance gates: target-specific approval of exact target,
principal/capability and mutation scope; managed PostgreSQL compatibility and
role/object/ownership collision findings; TLS chain and hostname verification;
safe, verified secret transport to the JDBC client; successful read-only
preflight; then a separate explicit owner approval to mutate. Current evidence
does not establish these. Local Flyway runs and completed authoring/runner
tasks do not substitute.

SCRUM-49/75/76 remain separate isolated-target rebuild/restore gates before
demo. SCRUM-49 is To Do; SCRUM-75 and SCRUM-76 are To Do. No isolated Cloud test
target is approved. The main project is not an allowed substitute.

## Bootstrap source and allowlist review

The only reviewed bootstrap files are:

| File | Effect |
| --- | --- |
| `v2/infra/migrations/bootstrap/V001__catalog_roles.sql` | Creates `gmf_migrator` NOLOGIN and `gmf_catalog_runtime` NOLOGIN with restrictive attributes. |
| `v2/infra/migrations/bootstrap/V002__community_roles.sql` | Creates `gmf_community_runtime` NOLOGIN with restrictive attributes. |
| `v2/infra/migrations/bootstrap/V003__notification_roles.sql` | Creates `gmf_notification_runtime` NOLOGIN with restrictive attributes. |

These files do not activate logins, grant memberships, grant privileges, or
configure credentials. Existing role names deliberately fail; do not drop,
alter, or adopt them without a separately reviewed plan. Flyway alone creates
`h_boot` as its history schema under the configured bootstrap principal; no
manual schema SQL is added. Exact allowlist is `v2/infra/migrations/bootstrap/`
only, never `schema/`, grants, seed, Auth, Storage, or reset.

## Secret-channel finding — hard stop

This Windows session does **not** provide a verified secure interactive prompt
or a demonstrated end-to-end path for a terminal-entered password to Flyway's
PostgreSQL JDBC driver without command-line arguments, environment, DSN,
logs, or host files. `psql`, Supabase CLI and Flyway are not installed here.
No secret was entered or tested. Therefore no runnable authenticated
PowerShell/Flyway wrapper is supplied: a wrapper that reads a hidden password
but then passes it to JDBC has not met the requested boundary unless the final
handoff mechanism is itself verified.

For any future operator-side review, the operator must first identify the
exact locally approved terminal and a supported client integration that
accepts the secret through a protected interactive prompt or an approved
OS-native in-memory credential channel, without materializing it in argv,
environment, DSN, logs, or a file. Confirm its behavior from that tool's
documentation/source and a non-secret inert test. If the tool only accepts
password arguments, `PGPASSWORD`, JDBC URL credentials, config files, or
unverified stdin forwarding, **stop**. Do not weaken this boundary to make
Flyway run. Do not send a password or secret-bearing output to this agent.

## Conditional two-phase plan (not an instruction to run now)

### Phase 1 — read-only feasibility and preflight

Only after a separate review confirms target-specific authorization to connect:

1. Confirm Dashboard target identity, exact endpoint/database/principal,
   PostgreSQL version/managed role capabilities and the designated bootstrap
   principal. Do not infer host/user/port from project ref.
2. Obtain CA provenance through the owner-approved local path. Verify the
   certificate chain **and hostname** against the exact Connect hostname
   (`verify-full`/driver equivalent). Never disable verification. Existing
   diagnostic evidence reports default trust failed with
   `SELF_SIGNED_CERT_IN_CHAIN`; hostname was not verified. Do not proceed until
   the owner-reviewed trust material and actual verification succeed.
3. Use a proven safe credential channel to make an authenticated connection.
   Run only reviewed SELECT/catalog inspection and Flyway `info`/`validate`
   equivalent read-only checks. Inspect database identity/version, existing
   `h_boot`, bootstrap and schema histories, all target role names/attributes,
   relevant ownership, file manifest/hashes and known active runners.
4. If any target mismatch, existing role/schema/history, unexpected object,
   missing capability, unexplained history/checksum, active runner, TLS failure,
   or inability to verify credential channel appears: stop and capture only
   redacted facts. Do not repair/drop/reassign.
5. Return a sanitized Phase 1 report to the owner. No DDL or migration in this
   phase.

### Phase 2 — mutation only after review and explicit approval

Not authorized by this package. It may be planned only after the owner reviews
the Phase 1 result and separately approves the exact project/endpoint, principal,
bootstrap allowlist, command, impact, backup/recovery boundary and execution.
Then a single designated operator may run Flyway only against
`v2/infra/migrations/bootstrap/`, creating `h_boot` and applying exactly
V001–V003 in order. No `schema/` migrations, grants, runtime login/membership,
seed, Auth/Storage, reset, or automatic startup migration. Stop on any warning,
failure, disconnect or unexpected state; verify the old process/query stopped
and reconcile history and objects before requesting reviewed recovery. Never
repair history automatically.

## Operator actions required before any execution request

1. On your personal machine, review this file, `migration-workflow.md`, ADR-0001,
   SCRUM-120 and the exact V001–V003 contents.
2. Select and verify your interactive terminal and client secret-input path.
   If you cannot establish that the secret reaches JDBC only through protected
   memory and is absent from process listings, environment, DSN, logs and host
   files, stop; ask for a different approved mechanism. Do not provide secrets
   here.
3. Separately approve the exact Cloud target and Phase 1 read-only connection
   scope. Do not connect under this review package.
4. After Phase 1, review sanitized evidence. Only then separately approve or
   decline Phase 2. Do not run bootstrap before that approval.
5. Preserve local terminal/session policy. If an approved client keeps secret
   material in memory, close that client/session after use; clear only temporary
   non-secret artifacts you created. No password file is created by this
   package. Do not echo, transcript, redirect, or screenshot any secret-bearing
   prompt/output; do not share raw logs.

Status remains **blocked before Phase 1 execution** pending target-specific
authorization and a verified safe connection/secret channel. No bootstrap
allowlist, risk acceptance, or SCRUM-49/75/76 gate is changed here.
