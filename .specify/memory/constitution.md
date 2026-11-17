# GRABMEFOOD Constitution

## Core Principles

### I. Discovery-Only Product Scope

Features MUST help diners decide what and where to eat through restaurant and dish discovery.
Ordering, checkout, payment, and delivery workflows MUST NOT be introduced without an approved
scope amendment. The GrabMeFood name MUST be preserved. This boundary prevents a discovery
product from implicitly acquiring unapproved transaction and fulfillment responsibilities.

### II. Vietnamese-First, Accessible Discovery

New or changed user-facing content MUST use Vietnamese and present prices, distances, categories,
and locations consistently for that audience. Interactive controls MUST support keyboard use,
visible focus, and accessible names. Dialogs MUST manage focus, support dismissal, and expose
their role and selected states to assistive technology. Changed screens MUST be checked at
mobile and desktop widths so primary discovery actions remain usable without clipped controls.

### III. Evidence Before Capability Claims

Sample restaurant records, ratings, distances, locations, and reviews MUST NOT be represented
as verified live information. Claims about nearby results MUST disclose the location basis;
a fixed sample area MUST NOT imply device geolocation. Authentication, live data, review
services, and production readiness MUST remain explicitly unverified until supported by
integration and validation evidence. Customer counts, testimonials, coverage, and operational
guarantees MUST NOT be invented. This distinction protects decisions based on trust-sensitive data.

### IV. Functional Integrity and Verifiable Changes

Changed search, category, and filter controls MUST preserve the user's selections and apply them
to displayed results; a control that only logs a selection MUST NOT be presented as working.
Affected flows MUST define applicable loading, empty, and error behavior, with an actionable
recovery path. Behavior changes MUST include reproducible verification of the primary path and
relevant edge cases. Pure filtering and calculation logic MUST have automated regression tests
when changed. Verification reports MUST distinguish executed checks from unavailable checks;
passing a static scan alone MUST NOT be treated as proof of usable behavior.

### V. Simple, Consistent Implementation

V2 work MUST follow the approved SCRUM-5 architecture: Next.js/TypeScript/Tailwind,
NestJS Gateway/Catalog/Community/Notification, pnpm monorepo, RabbitMQ, and Supabase Cloud
for Postgres/Auth/Storage. Frontend/services/RabbitMQ remain localhost; Supabase Local
MUST NOT be a prerequisite of the default run/demo. Each service MUST own its schema and DB role; business
cross-schema reads/writes/joins/foreign keys MUST NOT substitute for HTTP/events.
Frontend business requests MUST go through Gateway. Layout, CSS, components, assets and
content from the legacy application MUST NOT be reused for V2. Library primitives remain
subject to the approved stack and design, not permission to retain legacy UI.
New dependencies or abstractions MUST have a documented need and owner approval before
installation. Work MUST preserve unrelated user changes and stay in the assigned task.
No new integration, deployment or destructive cleanup is authorized by this principle.

## Product and Technical Constraints

- Spec Kit is the source of product requirements/plans/tasks; Jira tracks assignments and
  acceptance. PRODUCT.md MUST follow accepted specs, not override them. Contracts/ADR govern
  technical boundaries; approved direction/design artifacts govern UI. Draft proposals MUST
  remain distinguishable from owner-approved decisions.
- `src/main.tsx`, `src/app/routes.tsx`, `vite.figma.config.ts` and current npm commands
  describe the legacy runtime, not an approved V2 foundation. Until the infrastructure task,
  that runtime MUST remain unchanged outside explicitly assigned work.
- Project work MUST follow `AGENTS.md`; conflicts MUST be surfaced before dependent work.
- V2 uses Supabase Cloud, reproducible migrations/bootstrap/seed, and newly created demo content.
  Migration credentials MUST be separate from each service's limited runtime credentials.
  Direct PostgreSQL connections MUST enforce backend authorization, not assume `auth.uid()`.
  TLS/pool limits/plan quotas and Internet availability MUST be checked before demo.
  Remote migrations/seed/config/deploy require separate target-specific approval.
  There is no legacy backend/database/Storage to migrate, per owner confirmation in SCRUM-6.
  Legacy backup/restore was explicitly waived; this MUST NOT be described as successful restore
  or generalized into permission to erase data or waive future V2 reliability tests.
- Approved V2 authentication is email/password with verification and recovery through Cloud
  Auth email, not social login/OTP/2FA. Gmail custom SMTP is owner-configured but delivery
  remains unverified. Product notifications are in-app only.
- Approved community interaction is comments/replies/mentions, not star ratings or a separate
  scored review feature. V2 MUST NOT display fabricated ratings.
- A feature MUST document its sources, permissions, failure behavior and privacy before
  claiming operational support. No map page/SDK, booking, hotels, payment or delivery is in scope.
- Existing image assets and external records MUST NOT be assumed licensed, accurate, or approved
  for production solely because they are present in the repository.

## Development Workflow and Quality Gates

1. Specifications MUST state the user outcome, discovery-only scope, acceptance criteria,
   assumptions, and open integration decisions before implementation planning.
2. Plans MUST include a constitution compliance check, affected screens or logic, verification
   strategy, and any proposed exceptions before implementation begins.
3. Changes MUST remain focused on the accepted scope. Behavioral fixes and visual changes MUST
   be separately identified so review can assess each outcome.
4. Before completion, application changes MUST pass `npm run build` and relevant automated tests.
   UI changes MUST additionally be checked for keyboard access, responsive layout, and affected
   empty or failure states. Documentation-only changes require document validation, not a build.
5. A missing tool or blocked check MUST be reported with its impact; the change MUST NOT be
   described as fully verified. Production readiness MUST NOT be claimed while a required
   integration decision or relevant validation remains unresolved.
6. Reviews MUST record compliance, verification results, remaining risks, and approved exceptions.
   Existing noncompliance MUST be recorded when relevant; it is not permission to reproduce it.
7. Before each task, requirements MUST be compared with actual code/configuration/schema.
   Business, security, architecture, data, design or acceptance ambiguity MUST be raised to
   the owner before dependent work; if clear, state the scope and continue without invented
   questions. Do not rerun Spec Kit workflows when suitable artifacts already exist.
8. Each bug fix MUST have a reproducible record and an appropriate regression test that
   fails before and passes after the fix. Tests MUST NOT be weakened to hide a defect.
9. Before delete/reset, the exact target, allowlist, impact and backup status MUST be
    presented and owner confirmation obtained. Destructive/rebuild tests MUST use an isolated,
    identified, separately approved target; absent that target, report blocked. Main-project
    emptiness is not approval. No remote mutation or deploy is authorized by Cloud adoption.
    Documentation MUST NOT be claimed to enforce tool permissions.

## Governance

This constitution governs project scope and engineering decisions. Conflicting project guidance
MUST be identified and resolved explicitly rather than silently bypassing these principles.
`PRODUCT.md` and `AGENTS.md` supply supporting context and operating
guidance; they do not implicitly amend this constitution.

Amendments MUST document the proposed change, rationale, affected principles, and any migration
or follow-up work. The project owner MUST approve an amendment before it is treated as ratified.
Unknown adoption dates MUST remain explicit TODOs rather than being fabricated. The temporary
Sync Impact Report MUST be removed after review and before the amendment is committed.

Versions MUST follow semantic versioning: MAJOR for incompatible principle removals or
redefinitions, MINOR for added principles or materially expanded guidance, and PATCH for
non-semantic clarifications. The original ratification date MUST remain unchanged once known;
the last-amended date MUST reflect the latest substantive constitution edit.

Every specification, plan, and change review MUST check compliance with the current constitution.
Any exception MUST state its scope, rationale, risk, owner approval, and resolution condition.
Dependent templates and commands MUST read this constitution at runtime; updating it does not
authorize changes to those files or implementation of deferred features.

**Version**: 3.0.0 | **Ratified**: TODO(RATIFICATION_DATE): confirm original adoption date with project owner | **Last Amended**: 2026-11-15
