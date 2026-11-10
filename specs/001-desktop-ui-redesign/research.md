# Research: desktop-first redesign

## Decisions

1. **Retain the installed stack and data.** React/Vite/Tailwind and Radix primitives already
   satisfy this task. Rejected replacing the framework, using installed MUI alongside Radix,
   adding a testing dependency, or generating sample restaurant records.
2. **One shared application frame.** A root route layout can supply navigation, main/skip
   link, route-specific widths and sample-data context without duplicating headers on
   every page. Existing route paths and detail parameters remain unchanged.
3. **One semantic theme.** Update existing `theme.css` and use the already installed
   next-themes package. Approved red/white CTA in both themes, no parallel `--*-dark` API.
4. **Preserve identity over convenience.** Restaurant IDs in local search mocks can collide
   with canonical restaurant IDs while naming different restaurants. Do not merge by ID,
   silently replace numbers, or link one record to another. Use existing canonical records
   where identity is established and visibly unavailable destinations where it is not.
5. **URL-backed discovery.** Query/category/filter/tab/sort are navigation state, not new
   persisted data. Restore applied criteria on opening the filter and returning from detail.
   Distance remains sample-based; unsupported cuisine/country/live-location controls cannot
   pretend to filter live data. Missing service actions are disabled with explanation.
6. **Verification must not install tooling.** Baseline Vite build and Node TypeScript tests
   work in the existing environment. Inspect available browser tooling; if absent, retain
   browser/manual checks as pending instead of silently downloading Playwright/browsers.
7. **Stage-specific approval language.** Earlier spec-only restrictions were fulfilled in
   that phase. The latest explicit user instruction authorizes implementation and removes
   intermediate approval pauses, not safety/API/brand boundaries.

## Baseline evidence

- `npm run build`: PASS, 2070 modules; pre-existing >500kB bundle warning (562.74kB JS).
- `node --test tests/insightCalculations.test.mjs`: PASS, 8 tests.
- Git status contains pre-existing LFS image modifications and untracked project documents/
  package lock. No reset, cleanup, dependency installation or asset replacement is permitted.
- No `.specify/extensions.yml`: no extension hooks are registered for this workflow.

## Research scope and limitations

Installed command definitions were read before execution. A read-only research agent surveys
placeholder actions and existing verification tools; findings are incorporated before tasks
and implementation. Production provenance, licensing and integration choices remain explicitly
outside this redesign; they are not technical unknowns to resolve by adding services.

## Completed research inventory

Read-only research inspected 26 page components (26 route definitions including fallback).
Login/register/reviews log credentials or discard drafts; support fabricates delayed replies;
account/address/delivery controls lack services. These must become unavailable with explanation.
Map pins are percentage positions over a pannable iframe, not geographic coordinates.
Search-local restaurant IDs collide with different canonical restaurants; dish detail has
valid named phở IDs while search uses unrelated numeric IDs. Unknown detail IDs silently
substitute a default record. Fix identity guards without editing source record values.

Existing local favorites and random choices have selection/reset bugs; preserve their local
semantics without adding account sync. No configured Playwright/Puppeteer package exists.
Chrome and Edge executables already exist; Node v24 supports WebSocket/fetch. A dependency-free
Chrome DevTools Protocol harness is feasible without installing software. If launching is
blocked, fall back to source/unit evidence and explicitly defer browser validation.
