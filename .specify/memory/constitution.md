<!--
Sync Impact Report (temporary review material; remove before committing)
Version change: unversioned scaffold -> 1.0.0 (initial project constitution)
Modified principles: unnamed scaffold slots replaced by:
- I. Discovery-Only Product Scope
- II. Vietnamese-First, Accessible Discovery
- III. Evidence Before Capability Claims
- IV. Functional Integrity and Verifiable Changes
- V. Simple, Consistent Implementation
Added sections: Product and Technical Constraints; Development Workflow and Quality Gates;
populated Governance.
Removed sections: none; illustrative scaffold comments removed.
Deferred items: TODO(RATIFICATION_DATE): project owner must confirm the original adoption date.
Scope: constitution only; dependent templates and commands were not modified.
-->
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

Changes MUST follow the existing React, TypeScript, Vite, and Tailwind CSS structure and reuse
existing components and accessible primitives when suitable. New dependencies or abstractions
MUST have a documented need that existing code cannot reasonably satisfy. Work MUST remain
within the requested scope and MUST preserve unrelated user changes. Refactoring MUST NOT
silently expand into redesign, new integrations, or production deployment.

## Product and Technical Constraints

- `PRODUCT.md` records the discovery-only audience, purpose, and undecided production facts.
  Specifications MUST distinguish confirmed requirements from assumptions and open decisions.
- `src/main.tsx` is the browser entry; `src/app/routes.tsx` defines screen boundaries.
  Development and build commands use `vite.figma.config.ts` through `package.json`.
- Project work MUST follow `AGENTS.md` and applicable rules in `guidelines/Guidelines.md`.
  Commented examples in the guidelines MUST NOT be treated as adopted requirements.
- Live data, geolocation, authentication, reviews, privacy, and deployment requirements remain
  open decisions. A feature introducing any of these MUST document its data sources, permissions,
  failure behavior, and applicable privacy requirements before claiming production support.
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

## Governance

This constitution governs project scope and engineering decisions. Conflicting project guidance
MUST be identified and resolved explicitly rather than silently bypassing these principles.
`PRODUCT.md`, `AGENTS.md`, and `guidelines/Guidelines.md` supply supporting context and operating
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

**Version**: 1.0.0 | **Ratified**: TODO(RATIFICATION_DATE): confirm original adoption date with project owner | **Last Amended**: 2026-11-10
