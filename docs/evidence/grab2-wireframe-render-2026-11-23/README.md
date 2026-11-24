# GRAB-2 wireframe render evidence

**Artifact:** `index.html`, a static low-fidelity review atlas derived from the approved text wireframes.
**Browser:** Chrome 158.0.8127.38, headless with DevTools Protocol; no browser package/tool installed. The earlier evidence pass used Chrome 157.0.8103.79; the current captures were regenerated with 158.0.8127.38.
**Runtime:** Node 24.16.0 used only with built-in `WebSocket`/`fetch` APIs for local CDP capture.

## Captures

| File | Capture size | Purpose |
| --- | ---: | --- |
| `desktop-1280x900.png` | 1280×900 | Desktop first viewport |
| `desktop-full.png` | 1280×6722 | Full static atlas at desktop width (prior capture; regenerate after current low-fi edits) |
| `mobile-390x844.png` | 390×844 | Mobile first viewport |
| `mobile-full.png` | 390×12299 | Full static atlas at mobile width (prior capture; regenerate after current low-fi edits) |

## Observed checks

- Browser-emulated layout sweep requested at 195, 320, 360, 390, 480, 640, 720, 721, 768, 1024, 1280, and 1440 px. At each width, document scroll width did not exceed the effective layout viewport width; Chrome reports `clientWidth` smaller where the vertical scrollbar occupies space. After the new states, the repeat sweep covered 320–1440 px; the prior 195 px observation remains from the preceding atlas render. The 195 px device-metric request produced a 204 px `innerWidth` and 195 px client area in this headless mobile emulation, so it is not a browser-level 200% zoom test.
- Keyboard Tab traversed all six focusable in-page links (five section anchors plus the checklist example) at desktop and mobile widths; every target had a computed `solid 3px` focus outline and was visible immediately after removing whole-document smooth scrolling. This verifies atlas navigation only, not product acceptance.
- Browser-computed contrast ratios for sampled text: lowest sampled group labels/annotations 5.70:1, `.review-label` 6.53:1, `.scope-note` 14.62:1, `.wire-status` text 12.26:1. The added panels use existing wireframe text/boundary styles; the boundary threshold assertion was rerun after insertion.
- Browser-computed boundary contrast for sampled categories: control/screen border 4.03:1; status/placeholder and admin-table border on gray 3.18:1; `.viewport` on wash 3.17:1; card/list-item border on white 3.38:1; navigation link border on wash 3.17:1; focus color against white 15.57:1. A first pass found secondary borders at 1.74:1–2.21:1; `--line-soft` was darkened and admin rows now use the primary line on their gray surface. The corrected values were rerun in Chrome.
- Structural check parsed the static atlas; confirmed all five screen-group anchors, semantic landmarks, viewport metadata, and no scripts/external resources. The atlas now includes illustrative save-one-collection and admin-confirmation/progress examples (DEC-052/053); these are static labels, not working controls or backend contracts. Chrome 158 render heights: desktop 6722 px and mobile 12299 px.
- Static checks pass; `git diff --check` reports only existing LF→CRLF warnings in other modified docs.
- Removed the atlas-only `body` minimum width after the 200%-equivalent narrow viewport check exposed its forced 320px canvas; subsequent emulated sweep did not show document content wider than the effective layout viewport.
- Impeccable mechanical detector reported `cramped-padding` on `.viewport` wrappers and `overused-font` for Arial. Visual inspection confirms wrapper padding is explicitly set (`clamp(.7rem, 1.5vw, 1.2rem)`); the neutral system font is intentional for a grayscale wireframe, not a product typography decision. These detector heuristics do not indicate an observed clipped/flush layout in the captures.

## Coverage against approved wireframe traceability

| Wireframe group | Atlas coverage | Evidence status |
| --- | --- | --- |
| Navigation/discovery/search/area (REQ-EXP-01..03, REQ-UX-01..02) | Discovery/search card and area control; global nav, locale and search behavior explicitly marked tentative | Screen skeleton present; no functional search/filter or bilingual content tested |
| Restaurant/dish/map (REQ-EXP-01, REQ-EXP-04, REQ-COM-01, REQ-UX-03) | Restaurant, dish, map placeholder and Google Maps action label, comments entry | Layout represented; map unavailable/failure, correct destination, SEO/share metadata not tested |
| Articles/selections/demo/assets (REQ-CNT-01..03, REQ-UX-01, REQ-UX-03) | Listing/detail placeholders and demo/provenance note | Structure represented; no real bilingual copy, asset provenance, unavailable-link behavior or metadata tested |
| Account entry (REQ-AUTH-01..02) | Login, email/Google, verify/recovery and return-after-login states | Flow labels represented; locked-session, callback/error/expiry/linking and actual Auth not tested |
| Saved/collections (REQ-SAV-01..02) | Separate types, collections, unavailable marker, one-collection-per-save illustrative dialog (DEC-045/052) | Structure/rule labels represented; private ownership, save failure, collection creation/removal and A/B authorization not tested |
| Random (REQ-RND-01..03) | All/selected choices, result actions and empty-set state; DEC-046 note | Rule labels represented; probability, concurrent removal and actual random behavior not tested |
| Comments (REQ-COM-01..03) | One-level thread, owner actions and pending/failure/saved examples | State examples represented; actual submit, authorization, parent cascade and retained draft behavior not tested |
| Notifications (REQ-NOT-01..04) | Bell/list/read states, admin-send form, loading/empty/error/unavailable examples | Structure represented; realtime, recipient rules, target navigation, delivery/retry and retention not tested |
| Admin (REQ-ADM-01..05) | Content list/editor, comment/account actions, illustrative impact placeholder and confirmation/progress examples | Safety copy represented; authorization denial, locked old session, race protection, receipts and cleanup not tested |

The current low-fi HTML reflects presentation directions recorded in DEC-059..080, including discovery/detail layouts, placeholder copy/states, collection/comment/admin controls and notification rows. The PNG captures listed above predate these latest HTML edits and must not be treated as a render of the current atlas until regenerated. Selections do not settle final copy, URLs, result ordering, notification fallback, provider choice, or delivery contracts.

## Remaining design-review and accessibility checks

- Owner selected low-fi directions in DEC-050..080. Per DEC-057, keep the current atlas/layout as the starting point, leave VI/EN copy as placeholders, add states only when grounded in requirements/open decisions, and wait for separate visual-baseline approval before high-fidelity mockups. This does not approve visual baseline or close OQs.
- Atlas provides a responsive static composition, not a separate full-screen mockup for every desktop/mobile flow. No long-name/long-copy stress or bilingual layout was recorded. Responsive width sweep is viewport emulation only; browser zoom/text scaling and physical devices were not tested. The owner selected reflow as the presentation approach; this is not evidence of mobile usability or feature parity acceptance.
- Keyboard evidence covers forward Tab through all six focusable links only; reverse Tab, anchor activation, browser zoom, or assistive technology were not tested.
- Contrast figures cover selected text and boundary categories only, not every individual element/state or focus ring against every background.
- Explicit render states such as map unavailable, locked account, content link unavailable, save failure, notification target fallback, and unauthorized admin are not all shown as distinct screen examples; their detailed copy/behavior remains governed by the approved wireframe and open questions, not this atlas.
- Acceptance work still outstanding is itemized in the source wireframe §7a (DEC-061), to be run when product flows and target test environment are available (DEC-063); OQs remain open and should be reviewed before their related flows are implemented (DEC-062). The checklist is not yet executed and this atlas does not satisfy it.

## Limits

This proves only the static HTML atlas was rendered at the listed emulated viewport sizes and the documented static checks were observed. It is not real-device or production-app verification, not an exhaustive WCAG audit, and does not verify product interaction or accessibility acceptance. It provides no evidence for API, Auth/RLS, backend services, data, migration, release, owner approval of the atlas, or GRAB-2 Done.
