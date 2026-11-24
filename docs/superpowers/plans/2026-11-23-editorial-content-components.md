# Editorial Content Components Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add standalone, SSR-friendly article and curated-selection presentation components.

**Architecture:** Export `ArticleDetail` and `EditorialSelection` from `frontend/src/catalog/EditorialContent.tsx`. They consume already localized view models and supplied hrefs, render semantic React markup, and do not parse Markdown or load runtime content.

**Tech Stack:** React 19, TypeScript 5.9.3, CSS, Vitest 5.1.1, React Testing Library 16.3.3; no new dependencies.

**Spec:** `docs/superpowers/specs/2026-11-23-editorial-content-components-design.md`

## Global Constraints

- Use test-local fixtures only; do not add route resolution, fetch, API, persistence, or production content.
- Text is already localized by callers; do not select locale/fallback policy.
- Article body consists of display paragraphs rendered as escaped React text; no raw HTML or Markdown parser.
- Optional media requires `src`, localized `alt`, and visible `credit`; absent media is omitted.
- Selection order and hrefs are used as supplied; no route generation or availability checks.
- Do not add author/date, comments, likes, share SDK, newsletter, admin, or fabricated empty-state copy.
- Do not claim visual acceptance, browser viewport/contrast, or GRAB-6 completion; no commit/stage/Cloud/Jira writes.

## Review Focus

- Empty article paragraphs or selection items: omit empty content containers and do not invent copy — component tests.
- Long localized title/summary/body/item descriptions: constrain reading measure and allow wrapping — CSS review; browser verification remains pending.
- Selection ordering and navigation: preserve each supplied order and href exactly — component test.
- Article content containing markup-like text: render escaped text, never interpret it as HTML — component test.
- SSR: visible article and selection content appears before client JavaScript — static-render tests.

---

### Task 1: Article detail presentation

**Files:**
- Create: `frontend/src/catalog/EditorialContent.tsx`
- Create: `frontend/src/catalog/EditorialContent.test.tsx`
- Modify: `frontend/src/styles.css`

**Interfaces:**
- Produces `ArticleDetail({ article }: { article: ArticleDetailData })`.
- `ArticleDetailData`: `title: string`, optional `summary`, `paragraphs: readonly string[]`, optional `media: CatalogDetailMedia` imported as a type from `CatalogDetails.tsx`.
- Render a `<main>` with one `<h1>`, summary, ordered paragraph strings, and optional media `<figure>` with alt and visible credit. Omit body wrapper if there are no paragraphs; use a readable 65–75ch measure.

- [x] **Step 1: Write failing tests** for heading/summary/paragraph order, media alt+credit and omission, markup-like text escaping, long content preservation, and SSR markup.
- [x] **Step 2: Run** `npm test -- --reporter=verbose src/catalog/EditorialContent.test.tsx`; expected unresolved import because `EditorialContent.tsx` is absent; observed missing module.
- [x] **Step 3: Implement** `ArticleDetailData` and `ArticleDetail`; add responsive article reading styles using existing tokens.
- [x] **Step 4: Run** the focused test file; 6 tests pass.

### Task 2: Curated selection presentation

**Files:**
- Modify: `frontend/src/catalog/EditorialContent.tsx`
- Modify: `frontend/src/catalog/EditorialContent.test.tsx`
- Modify: `frontend/src/styles.css`

**Interfaces:**
- Produces `EditorialSelection({ selection }: { selection: EditorialSelectionData })`.
- `EditorialSelectionData`: `title: string`, optional `introduction`, `items: readonly { id: string; title: string; description?: string; href: string }[]`.
- Render one `<main>` and `<h1>`, optional introduction, ordered list preserving item order, item titles as native links using exact supplied hrefs, and optional descriptions. Omit the list when empty.

- [x] **Step 1: Write failing tests** for title/introduction, ordered links with exact hrefs, optional descriptions, omitted empty list, long text preservation, and SSR markup.
- [x] **Step 2: Run** the focused test file; expected failure because `EditorialSelection` is not exported; observed five missing-export failures.
- [x] **Step 3: Implement** `EditorialSelectionData` and `EditorialSelection`; add responsive selection-list styles with long-text wrapping.
- [x] **Step 4: Run** the focused test file; 11 article and selection tests pass.
- [x] **Step 5: Run full verification** from `frontend/`: `npm test -- --reporter=verbose` (28/28 after review fix), `npm run build` (TypeScript/client/SSR pass), `npm audit --audit-level=moderate` (0 vulnerabilities); `git diff --check` passes (line-ending warnings only).
- [x] **Step 6: Update progress evidence** in `DESIGN.md`, `docs/DECISIONS.md`, `docs/TEST-STRATEGY.md`, and the B1 plan without changing product acceptance or claiming route/integration completion.

**Stop boundary:** Do not wire components into `App`, create routes, add runtime data, select Markdown handling, or claim REQ-CNT-01/GRAB-6 acceptance. Browser viewport/zoom/contrast evidence remains pending.

**Progress/evidence:** `ArticleDetail` and `EditorialSelection` are standalone
presentation components. Article paragraphs render as escaped text; selection order and
hrefs are caller supplied. No route/API/Markdown renderer/runtime fixture was added.
Review fix filters whitespace-only article paragraphs before rendering; 28 tests pass.
Minor deferred: tighten the selection description assertion to target its containing list item.
