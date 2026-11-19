# Migration workflow — SCRUM-119 decision and safety boundary

This document records the owner's approved concurrency boundary and the
locally tested SCRUM-119 workflow using Flyway OSS 13.12.2. It is not permission
to migrate Cloud or evidence of SCRUM-120, managed compatibility or Cloud TLS.
Target-specific commands, principal mapping and credential provisioning require
review and separate approval before any Cloud execution.

## Owner confirmation and migration history boundary

The owner confirms to the best of their knowledge that the ten original migration
files were never applied to Supabase Cloud or another shared environment, including
manual execution in Supabase SQL Editor. Known local PostgreSQL executions were
temporary test sandboxes; the owner knows of no other shared target using them.
This is an owner report, not an exhaustive independent audit of all environments.
Stop and ask if contrary evidence or an unresolved relevant target appears.
Prior local results and hashes remain historical and do not validate new files.

## Approved operating boundary

- A single designated operator runs bootstrap then schema sequentially, using
  explicit commands only. No automatic migration in service startup or CI.
- Technical locking and concurrent-invocation tests remain required **within
  each phase**. There is no required continuous technical lock between phases.
- Before and between phases, the operator checks the approved target, known
  runners, both histories and relevant objects, and records timestamp and result.
  Another runner or manual DDL can still intervene; this is risk reduction, not
  proof of exclusive access.
- On failure, interruption, a lost connection or unexpected state: stop. Verify
  old processes and server queries have stopped; compare histories, file
  checksums and actual objects. Escalate for a reviewed recovery/forward-fix.
  Never automatically repair history, reset the database, or silently rewrite
  applied migrations. Checksums of files do not detect all database drift.
- Bootstrap and migration principals remain separate from runtime service
  credentials. TLS chain/hostname validation and secret redaction remain
  mandatory. Actual role switching, managed capabilities and credentials are
  not established by local PostgreSQL tests.
- The provisional Cloud migration budget stays **m=1**. Local spikes with two
  connections do not approve a Cloud budget increase.

## Required evidence and remaining gates

SCRUM-119 requires local first run, replay, checksum mismatch, ordering,
per-phase concurrent invocation, failure/rollback, interruption and reviewed
recovery evidence on the final workflow. Distinguish each environment and do not
claim unrun tests passed. SCRUM-120 retains managed feasibility, target-specific
approval, apply/history and ownership verification; SCRUM-69/70 retain grants
and authenticated TLS/isolation. SCRUM-49/75/76 retain the isolated Cloud
two-cycle rebuild/restore gate before demo. No project becomes an isolated
destructive target without separate owner approval.

## Locally tested manual sequence — not approved for Cloud execution

1. Identify the target, operator and separately approved principals. Confirm no
   known migration runner is active, the versioned source inventory is complete
   and unchanged, and prior history/objects match the expected starting state.
   Never use a runtime credential or put a secret in a command line or log.
2. With bootstrap principal run Flyway against only `bootstrap/`, using the
   reviewed history schema and `postgresql.transactional.lock=false`. Keep
   validation enabled and out-of-order execution disabled. Record exit status,
   history and results; any error, unexpected warning or mismatch stops the run.
   On a verified fresh local database Flyway 13.12.2 standalone `validate`
   fails for pending migrations; the tested fresh-target preflight uses
   `-ignoreMigrationPatterns=*:pending` only for `validate`. The subsequent
   `migrate` used default validation, not that option. Never ignore missing,
   ignored or failed migrations; perform the inventory and history checks.
   This setting has not been approved as a Cloud execution plan.
3. Before schema, independently check bootstrap history has successful
   V001–V003 in order, no missing/extra/failed entries, and verify relevant
   roles/attributes and expected objects. Check schema history is appropriate
   for the target and all required schema files are present. Do not infer
   cross-phase ordering from separate Flyway history tables. Stop if uncertain.
   The local candidate `v2/tests/integration/migration-handoff-check.sql` can
   check the selected database name and `h_boot.flyway_schema_history`: run
   `psql -X -v ON_ERROR_STOP=1 -v expected_db=<approved-db> -f v2/tests/integration/migration-handoff-check.sql`
   on the intended connection and require exit 0. It rejects missing history,
   failed rows and any version sequence other than 001, 002, 003. It does not
   establish host/project identity, check file checksums, inspect roles/objects,
   or prevent a concurrent change; those remain operator responsibilities.
   The operator must also validate the exact bootstrap files against history
   with Flyway, verify target endpoint/TLS and roles/objects, and stop if any
   check is unavailable or fails. Do not place passwords in the command line.
4. With the separate approved migration principal, run Flyway against only
   `schema/` and its reviewed history schema, with the same locking/validation
   settings. Verify successful V004–V010 and expected object ownership.
5. On interruption or failure stop both phases. Verify the old client process
   and server query have stopped, check both histories and actual objects, and
   obtain owner review of recovery before retrying. Do not repair or rewrite
   history automatically. These manual checks cannot fence another operator or
   manual DDL between phases.

The local commands and results are recorded in the migration evidence README.
Target-specific principal mapping, TLS/credential channel and managed history
access remain unverified; this is not permission to apply. Cloud budget remains
m=1 and single-invocation sampled maxima do not prove an absolute peak.

The owner's decision is synchronized to SCRUM-119 with references in SCRUM-22/120.
Historical evidence of the earlier cross-phase-lock spikes is not removed or
retroactively changed.
