# ADR-0003 — Owner-approved Vite SPA and Spring Boot service stack

- Status: Accepted — owner-approved direction; exact Spring Boot patch
  3.5.16 selected after owner authorized changing the requested 3.3.x branch
  on 2026-11-19.
- Date: 2026-11-19.
- Scope: stack, implementation boundaries, HTTP contract publication and codegen.
  No runtime implementation, dependency installation, Cloud operation or UI work.
- Business authority: approved [V2 spec](../../specs/003-grabmefood-v2/spec.md).
  Normative behavior remains in [contracts](../../specs/003-grabmefood-v2/contracts/README.md).

## Decision

1. Frontend is a Vite + React + TypeScript single-page application. Next.js is
   not the target frontend. The existing legacy removal task is gated: do not
   remove Next.js/Node until the Spring Gateway auth/session path works and the
   SPA production build passes.
2. Backend uses Java 21 LTS, Spring Boot 3.5.16, and a Maven multi-module
   repository. The modules/processes are one edge Gateway/BFF and three
   independently owned services: Catalog, Community, Notification. Do not add
   another framework. RabbitMQ and Supabase Cloud topology remain unchanged.
3. Spring Boot 3.5.16 is selected because Spring's official announcement dated
   2026-06-25 identifies it as the latest 3.5 patch available from Maven
   Central on the decision date. It is the last OSS release of the 3.5
   generation; this is an explicit support risk and requires a version/support
   review before implementation or release. Source:
   [Spring Boot 3.5.16 announcement](https://spring.io/blog/2026/06/25/spring-boot-3-5-16-available-now).
   The requested 3.3 line is not selected: Spring's official 3.3.13
   announcement (2025-06-19) says it is the final 3.3.x OSS release and asks
   users to upgrade:
   [Spring Boot 3.3.13 announcement](https://spring.io/blog/2025/06/19/spring-boot-3-3-13-available-now).
4. Gateway is the only browser-facing business/API edge. Supabase Auth owns
   credentials and account/session behavior; Gateway validates Supabase Auth
   JWTs and maintains the approved browser edge/cookie flow, CSRF and CORS
   protections, and callback routing. Keep provider credentials out of SPA code
   and server configuration/secrets out of the browser. Community owns profile
   and business data, not a custom session ledger or provider-token custody.
   Owner services enforce basic authorization on protected actions; internal
   service credentials prove service identity only.
5. **Owner-approved security simplification (2026-11-19):** use Supabase Auth's
   supported session, logout, expiry, verification and recovery behavior. Do not
   build custom session ledger/token custody, refresh fencing, or durable global
   revocation. Do not claim immediate invalidation beyond Supabase Auth guarantees.
   Retain TLS chain+hostname verification, server-side secrets, input validation,
   basic least privilege/RLS, essential cross-user denial tests, secure
   HttpOnly/Secure/SameSite cookie protections when the cookie flow is used,
   and CSRF protection for cookie-authenticated mutations. No added
   production-hardening infrastructure is required.
6. `specs/003-grabmefood-v2/contracts/openapi.yaml` is the published OpenAPI
   representation of the existing public `/api/v1` HTTP contract, not a new
   business specification. Java DTOs are authoritative implementation types;
   CI verifies their compatibility with OpenAPI, and generates TypeScript
   frontend types from the OpenAPI artifact. Contract tests run on both Java
   provider and TypeScript consumer sides. Changes must preserve the Markdown
   normative contract and its compatibility/versioning rules.
7. Flyway is the sole schema owner. JPA/Hibernate must use
   `spring.jpa.hibernate.ddl-auto=none`; schema generation/update is forbidden.
   Do not edit or reinterpret V001–V015, seed, RLS, grants, data contracts, or
   their acceptance evidence. A future schema change is forward-only and
   separately reviewed.
8. Use Spring Security and Spring Boot facilities for Gateway HTTP security,
   MVC/validation, persistence and service wiring. Do not introduce an
   additional application framework. Framework-specific implementation choices
   may be made later only if they preserve the normative behavior above.

## Contracted API scope

The OpenAPI document covers the existing operations and schemas, grouped as:
public home/catalog/search, restaurant and dish detail/offerings; comments and
replies; saved/favorites; signup/login/logout/session/verification/password
operations/callback; profile/preferences/onboarding/avatar; and inbox/admin
operations where already present in the HTTP contract. It does not create
unlisted operations or change request/response/auth/error behavior. Internal
service endpoints remain non-browser contracts and are identified as such.

## Consequences and gates

- Existing SCRUM-21 scaffold work must be amended before a Java/Maven
  implementation starts; its historic Node CI evidence remains historical and
  is not proof of the target stack.
- OpenAPI/codegen and dual-sided contract tests become implementation/CI
  obligations. No generated types or runtime code are created in this ADR
  package.
- SCRUM-120 remains To Do/blocked. No Cloud connection, preflight or apply is
  authorized here. Flyway V001–V015, seed, RLS/grants and local data evidence
  remain unchanged.
- UI direction approval (SCRUM-77/78) still precedes user-facing UI work.
  No UI implementation is authorized by this ADR.
- Legacy cleanup can complete only after both Gateway auth/session operation
  and SPA production build pass; existing other AC/dependencies remain intact.
