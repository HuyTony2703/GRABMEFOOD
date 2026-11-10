# Tasks: Desktop-first GrabMeFood

**Input**: `specs/001-desktop-ui-redesign/` plan, spec, research, data-model, contracts and quickstart.
**Tests**: Required by user and constitution. Pure regression tests precede implementation.
**Organization**: Shared foundations then US1, US2, US4 (P1), US3 (P2), cross-cutting verification.

## Format: `[ID] [P?] [Story] Description`

`[P]` only marks independent files. All paths are project-relative. Every checkpoint validates,
then continues autonomously per user instruction; no commit, deployment or approval pause.

## Phase 1: Setup

- [x] T001 Record baseline build/tests, existing modifications, route inventory and tooling in specs/001-desktop-ui-redesign/verification.md (FR-002, FR-017, FR-019).
- [x] T002 Verify .gitignore and installed tool availability without adding dependencies; document tool limits in specs/001-desktop-ui-redesign/quickstart.md (FR-017).

## Phase 2: Foundational

- [x] T003 Align approved semantic light/dark values, type scale and responsive layout rules in src/styles/theme.css and src/styles/index.css; no parallel theme (FR-005, FR-006, FR-012, FR-014–017).
- [x] T004 Add shared route frame in src/app/components/AppFrame.tsx and integrate src/app/routes.tsx, src/app/App.tsx with existing next-themes; preserve all routes (FR-002, FR-004, FR-012–018).
- [x] T005 Update existing src/app/components/ui/button.tsx, input.tsx, textarea.tsx and dialog.tsx for minimum targets, wrapping, semantic states and Vietnamese accessible labels (FR-009, FR-013, FR-014, FR-016).
- [x] T006 Build and run existing tests; record foundational checkpoint in specs/001-desktop-ui-redesign/verification.md.

## Phase 3: US1 — Desktop discovery (P1)

**Goal**: Navigate and filter real existing records without losing context.
**Independent test**: home → query/category → filtered results → detail → back; counts and criteria agree.

- [x] T007 [US1] Write failing pure tests in tests/discovery.test.mjs for accented query, range overlap, sample distance, invalid/missing fields, sort and URL reset (FR-003, FR-008, FR-018).
- [x] T008 [US1] Implement pure helpers in src/app/lib/discovery.ts; enforce “Missing is not zero” and “Do not infer a live location” from data-model.md (FR-003, FR-008).
- [x] T009 [US1] Replace static non-filtering results with canonical-data discovery and applied URL state in src/app/pages/SearchResultsPage.tsx (FR-003, FR-018).
- [x] T010 [US1] Reuse Radix dialog for accessible draft/apply/reset filters in src/app/components/FilterModal.tsx; unsupported criteria explained (FR-003, FR-009, FR-013, FR-018).
- [x] T011 [US1] Recompose desktop home and correct category links in src/app/pages/HomePage.tsx; preserve existing section records (FR-005, FR-006, FR-008).
- [x] T012 [US1] Apply shared navigation semantics in src/app/components/BottomNav.tsx and correct today-section identity in src/app/pages/AllRestaurantsPage.tsx (FR-004, FR-013).
- [x] T013 [US1] Run build/discovery regression checkpoint and record result in specs/001-desktop-ui-redesign/verification.md.

## Phase 4: US2 — Consistent cards and identity (P1)

**Goal**: Stable card hierarchy, honest values and correct detail destinations.
**Independent test**: compare same record across views; unknown IDs never show another entity.

- [x] T014 [US2] Standardize src/app/components/RestaurantCard.tsx and add src/app/components/DishCard.tsx with image failure, metadata and correct link handling (FR-007, FR-008, FR-009).
- [x] T015 [US2] Guard unknown restaurant/dish IDs and scope menus in src/app/pages/RestaurantDetailPage.tsx, DishDetailPage.tsx and DishAtRestaurantPage.tsx; enforce “Do not invent a relationship” (FR-004, FR-007, FR-008).
- [x] T016 [US2] Correct local favorite selection/delete and random candidate identity in src/app/pages/FavoritesPage.tsx and RandomPage.tsx without persistence/schema changes (FR-003, FR-004, FR-018).
- [x] T017 [US2] Remove fabricated geographic pins and wire only valid local destinations in src/app/pages/MapPage.tsx; preserve external map and sample disclosure (FR-004, FR-008, FR-009).
- [x] T018 [US2] Build and execute card/identity regression checks in tests/ui-contracts.test.mjs; record checkpoint in specs/001-desktop-ui-redesign/verification.md.

## Phase 5: US4 — Responsive and accessible all-screen presentation (P1)

**Goal**: Every existing screen supports the same readable semantic presentation and keyboard operation.
**Independent test**: route matrix at approved widths and both themes; keyboard dialog and navigation.

- [x] T019 [US4] Apply compact auth/welcome layouts and correct terms destinations in src/app/pages/LoginPage.tsx, RegisterPage.tsx, WelcomePage.tsx and OnboardingPage.tsx (FR-002, FR-005, FR-012–016).
- [x] T020 [US4] Apply semantic profile/list layouts in src/app/pages/ProfilePage.tsx, NotificationsPage.tsx and AllReviewsPage.tsx (FR-002, FR-005, FR-007, FR-012–016).
- [x] T021 [US4] Apply settings/form layouts and actual existing theme choice in src/app/pages/SettingsPage.tsx, AccountSettingsPage.tsx, AddressSettingsPage.tsx, NotificationSettingsPage.tsx, LanguageSettingsPage.tsx and ThemeSettingsPage.tsx (FR-002, FR-005, FR-012–017).
- [x] T022 [US4] Apply readable support/legal/help/error layouts in src/app/pages/SupportChatPage.tsx, TermsPage.tsx, GuidePage.tsx and ErrorPage.tsx (FR-002, FR-005, FR-012–016).
- [x] T023 [US4] Create dependency-free Chrome CDP harness in tests/browser-check.mjs if executable launch is available; cover route matrix, theme, overflow and keyboard (FR-012–016, SC-005–009).
- [x] T024 [US4] Run build/tests and browser checkpoint; record exact executed matrix and limitations in specs/001-desktop-ui-redesign/verification.md.

## Phase 6: US3 — Empty/error/unavailable honesty (P2)

**Goal**: Distinguish sparse layouts, empty results, missing fields and missing services.
**Independent test**: no-match query, empty local selection and unavailable auth/review/support never fake success.

- [x] T025 [US3] Add shared empty/unavailable states in src/app/components/ContentState.tsx and integrate search/list/detail/favorites views (FR-008, FR-010, FR-011).
- [x] T026 [US3] Remove credential logs, fake replies and false submissions; explain unavailable services across src/app/pages/LoginPage.tsx, RegisterPage.tsx, SupportChatPage.tsx and detail review forms (FR-003, FR-009–011, SC-010).
- [x] T027 [US3] Explain and disable service-only account/address/language/delivery/session controls in src/app/pages/AccountSettingsPage.tsx, AddressSettingsPage.tsx, LanguageSettingsPage.tsx, NotificationSettingsPage.tsx and SettingsPage.tsx; preserve working local controls (FR-003, FR-004, FR-009–011).
- [x] T028 [US3] Validate empty/error/no-service cases in tests/ui-contracts.test.mjs and tests/browser-check.mjs; record checkpoint in specs/001-desktop-ui-redesign/verification.md.

## Phase 7: Polish and cross-cutting validation

- [x] T029 Run final build, Node tests and TypeScript check; record executed results in specs/001-desktop-ui-redesign/verification.md (SC-003–010).
- [x] T030 Execute installed Impeccable audit and detector on changed UI, fix in-scope findings and archive report under .impeccable/audit/ (FR-012–016).
- [x] T031 Finish all-route/theme/viewport verification, document unresolved external/tool/human-study limits and final task states in specs/001-desktop-ui-redesign/verification.md (SC-001–010).

**Delivery status:** 31/31 execution tasks completed. Required human study and manual/device
acceptance subchecks remain unverified as explicitly recorded in verification.md; task
completion means implementation and available-tool verification, not full acceptance certification.

## Dependencies & Execution Order

Setup → foundation → US1 → US2 → US4 → US3 → final verification. US3 states can be authored
with their host page group to prevent temporarily fake UI, but their task remains open until
the complete integration/checkpoint. Shared files are sequential. Verification evidence may
show blocked subchecks without claiming they passed; leave a task open if its primary check is blocked.

## Parallel Examples

- US1: pure query test review and home navigation review after foundation, before integration.
- US2: card component and detail identity review affect separate files, then integrate.
- US4: auth, settings and legal page presentation are independent after the shared frame.
- US3: auth unavailable wording and review unavailable wording are independent, then test together.

These are safe scheduling opportunities, not authorization to run conflicting edits in parallel.

## Implementation Strategy

MVP is US1 after shared foundations; validate it, then continue to every approved route.
No commits/deployment at milestones. Maintain existing data values, route paths and UI stack.
Use incremental build/test checkpoints; only add tooling if already available. SC-001/SC-002
require a real five-person study and cannot be marked empirically passed by automation.
