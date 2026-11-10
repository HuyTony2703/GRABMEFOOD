# Validation guide

## Prerequisites

Use the existing `node_modules` and Node runtime; do not install packages or browsers.
From `D:\Projects\GRABMEFOOD`:

```powershell
npm run build
npm test
npm run typecheck
npm run typecheck:all
npm run check:structure
npm run dev
```

The repository was reorganised after this plan was written. Current commands and paths live
in the root `README.md`; the equivalent raw commands are `node --test tests/unit/*.test.mjs
tests/contracts/*.test.mjs`, `node scripts/typecheck-app.mjs` and
`node scripts/check-structure.mjs`.

The existing Vite config defaults to `http://localhost:8443`. If a server already runs,
reuse it; otherwise start one in the background. Do not stop unrelated processes.

The full-project TypeScript command currently reports the existing wrapper-config error
TS2349 at `vite.figma.config.ts:86`. The application-only command uses the same compiler
options and checks `src` separately; it does not hide or repair the tooling error.

```powershell
npm run test:browser
npm run test:browser:full
```

Raw equivalent: `node tests/browser/browser-check.mjs --quick --strict` and
`node tests/browser/browser-check.mjs --strict`.

The browser harness uses installed Chrome/Edge plus Node built-ins, never downloads software.
Run only one instance at a time (isolated profile, local CDP port 19333). Quick mode checks
31 route/state variants × 2 themes at 390px. Full mode adds 320/768/1024/1440px.
Both modes also exercise 30 functional/keyboard/text-reflow assertions. Evidence is saved in
`C:\Users\HUY\AppData\Local\Temp\opencode\grabmefood-verification`.
The harness closes only its own browser; temporary evidence and profiles are retained.

## Functional scenarios

1. Open home; verify familiar navigation and canonical card name/data/target.
2. Search with Vietnamese accents and without accents; change dish/restaurant tab.
3. Apply supported budget/type/distance filters; verify real counts and no-results state.
4. Open a result then back; verify query/tab/filter restoration. Cancel draft vs Apply.
5. Open all existing route families, valid and unknown detail IDs; no invented fallback record.
6. Exercise existing random/favorite/edit/delete/settings local behavior without claiming sync.
7. Login/register/review/support actions without services explain unavailable and do not submit
   credentials, erase drafts or report fake success.
8. Theme settings apply light/dark/system through the same `.dark` token system.

## Browser matrix if tooling is already available

Widths 320, 390, 768, 1024, 1440; light/dark; short viewport; 200% text and 320px reflow.
Check document scroll width, card alignment, header/nav occlusion, long text and image errors.
Keyboard: skip link, all visible controls, tab selection, modal opening/Escape/focus return.
Check actual text/background and control/focus contrast, not just token values.

## Evidence

Record commands, counts, screenshots/findings, corrections and unavailable checks in
`verification.md`. Automated checks do not substitute for SC-001/SC-002 with five real people,
manual screen-reader review or unexecuted browser checks. Run the installed Impeccable audit
workflow and its detector after UI work, not as a substitute for functional verification.
