# GRAB-2 wireframe render evidence

**Current acceptance boundary:** DEC-063 clarified by the owner: GRAB-2 accepts the approved design deliverables, not full runtime acceptance. See wireframe §7a A for the per-criterion review and §7a B for runtime traceability to GRAB-7/8/9 and GRAB-10. Historical capture/test statements below retain their original scope; no outstanding runtime or Narrator result is converted to passed.

**Final design review:** checked all four Jira acceptance criteria against wireframe §2/§8/§9 and DESIGN §1–7. Python filesystem checks verified local Markdown targets, PRD coverage groups, token/accessibility/provenance guidance, all five atlas group anchors, no script/external image/font/iframe resources, and the four PNG dimensions listed below. `git diff --check` found no whitespace errors (LF→CRLF warnings only). No new runtime test or Realtime patch was run for design closure. GitHub main links remain prospective: local uncommitted files were not pushed.

**Artifact:** `index.html`, a static low-fidelity review atlas derived from the approved text wireframes.
**Browser:** Chrome 158.0.8127.38, headless with DevTools Protocol; no browser package/tool installed. The earlier evidence pass used Chrome 157.0.8103.79; the current captures were regenerated with 158.0.8127.38.
**Runtime:** Node 24.16.0 used only with built-in `WebSocket`/`fetch` APIs for local CDP capture.
**Capture workflow:** Chrome launched with `--headless --disable-gpu --remote-debugging-port=<port> --user-data-dir=<temporary-profile> about:blank`; a one-off Node CDP client used `GET /json/version`, `PUT /json/new?about:blank`, `Emulation.setDeviceMetricsOverride`, `Page.navigate`, `Page.getLayoutMetrics`, and `Page.captureScreenshot` with viewport/full-page clips. No project script or dependency was added.

## Captures

| File | Capture size | Purpose |
| --- | ---: | --- |
| `desktop-1280x900.png` | 1280×900 | Desktop first viewport |
| `desktop-full.png` | 1280×7470 | Full static atlas at desktop width |
| `mobile-390x844.png` | 390×844 | Mobile first viewport |
| `mobile-full.png` | 390×13780 | Full static atlas at mobile width |

## Observed checks

- Final Chrome 158 headless/CDP viewport sweep at 320, 360, 390, 480, 640, 720, 721, 768, 1024, 1280, and 1440 CSS px. At every width `scrollWidth` did not exceed `innerWidth`; desktop `clientWidth` is 15 px narrower because the vertical scrollbar occupies space. This is emulation, not browser zoom or device testing.
- Session-observed CDP width results (raw protocol logs were not saved):

  | Requested px | `innerWidth` | `scrollWidth` | `clientWidth` |
  | ---: | ---: | ---: | ---: |
  | 320 | 320 | 320 | 320 |
  | 360 | 360 | 360 | 360 |
  | 390 | 390 | 390 | 390 |
  | 480 | 480 | 480 | 480 |
  | 640 | 640 | 640 | 640 |
  | 720 | 720 | 720 | 720 |
  | 721 | 721 | 706 | 706 |
  | 768 | 768 | 753 | 753 |
  | 1024 | 1024 | 1009 | 1009 |
  | 1280 | 1280 | 1265 | 1265 |
  | 1440 | 1440 | 1425 | 1425 |
- Keyboard Tab traversed all six in-page links (five section anchors plus the checklist example) at 1280×900 and 390×844. Every target had a computed solid 3 px green focus outline and intersected the viewport. Atlas navigation only; not product acceptance.
- Focus targets observed in order: Công khai, Cá nhân, Bình luận & thông báo, Quản trị, Trạng thái & kiểm tra, Ví dụ liên kết nội bộ có focus. All six passed the same computed outline/visible check at each viewport.
- Browser-computed text contrast samples: muted copy on white 8.34:1, primary action white on green 7.41:1, status text on placeholder 13.30:1, unread red on white 6.57:1, focus green on white 10.15:1.
- Browser-computed boundary samples: primary screen/control border on white 4.98:1; secondary viewport/card border on white 3.19:1. These are representative categories, not an exhaustive WCAG audit.
- Structural check confirms five screen-group anchors, viewport metadata, review-only label, no scripts and no external assets. Save/dialog/admin examples remain static labels, not working controls or backend contracts.
- PNG dimensions verified: 1280×900, 1280×7470, 390×844, and 390×13780. All four captures were visually inspected; no blank/cropped capture or horizontal overflow observed. The responsive admin example keeps its column-heading row visible on mobile.
- Structural/assertion command: Python 3.12.10 read `index.html` and verified the five anchors, review-only label, candidate token values, viewport metadata, and absence of `<script>`, external `<img src>` or `<link href>` resources. CDP `Runtime.evaluate` measured widths/colors; `Input.dispatchKeyEvent` sent Tab for focus checks.
- `git diff --check` ran at repository scope, not only on these files; it reports no whitespace errors and emits LF→CRLF warnings for modified documentation files.
- Atlas has no forced minimum body width. The 320–1440px emulated sweep did not show document content wider than `innerWidth`.
- Impeccable detector initially reported `cramped-padding` for `.viewport`; padding is now explicit 12px and the final detector result is `[]`. System sans is the selected DESIGN.md candidate; this render does not approve product typography beyond that candidate.

## Coverage against approved wireframe traceability

| Wireframe group | Atlas coverage | Evidence status |
| --- | --- | --- |
| Navigation/discovery/search/area (REQ-EXP-01..03, REQ-UX-01..02) | Discovery/search card and area control; low-fi 3-column/1-column reflow and editorial below results (DEC-059/064/065) | Screen skeleton present; no functional search/filter or bilingual content tested |
| Restaurant/dish/map (REQ-EXP-01, REQ-EXP-04, REQ-COM-01, REQ-UX-03) | Restaurant, dish, map placeholder and Google Maps action label; selected low-fi order/unavailable placeholder (DEC-072/073/079) | Layout represented; map provider/destination, SEO/share metadata not tested |
| Articles/selections/demo/assets (REQ-CNT-01..03, REQ-UX-01, REQ-UX-03) | Shared list with type labels and type-specific detail placeholders (DEC-074) | Structure represented; no real bilingual copy, asset provenance, unavailable-link behavior or metadata tested |
| Account entry (REQ-AUTH-01..02) | Login, email/Google, verify/recovery and return-after-login states | Flow labels represented; locked-session, callback/error/expiry/linking and actual Auth not tested |
| Saved/collections (REQ-SAV-01..02) | Quán/Món tabs and per-collection management affordance placeholders; one-collection-per-save illustrative dialog (DEC-045/052/069/078) | Structure/rule labels represented; private ownership, save failure, collection creation/removal and A/B authorization not tested |
| Random (REQ-RND-01..03) | All/selected choices, result actions and empty-set state; DEC-046 note | Rule labels represented; probability, concurrent removal and actual random behavior not tested |
| Comments (REQ-COM-01..03) | One-level thread, owner actions and pending/failure/saved examples | State examples represented; actual submit, authorization, parent cascade and retained draft behavior not tested |
| Notifications (REQ-NOT-01..04) | Bell/list/read states with preview/time placeholders; admin-send scope-confirmation dialog (DEC-068/077) | Structure represented; realtime, recipient rules, target navigation, delivery/retry and retention not tested |
| Admin (REQ-ADM-01..05) | Content list/editor, comment/account actions, impact dialog and progress examples (DEC-071/076/077) | Safety presentation represented; authorization denial, locked old session, race protection, receipts and cleanup not tested |

This capture pass applies the light editorial design from `DESIGN.md` using its neutral/green/red token values, system sans, 1280px content cap and low-fi card treatment. DEC-081 authorized the review render; DEC-082 records the owner's approval of its visual direction. The captures preserve the candidate label as it appeared at review time. The approval does not settle final copy, URLs, result ordering, notification fallback, provider choice, or delivery contracts.

## Remaining design-review and accessibility checks

- The approved wireframe and captures satisfy the design-artifact format in the Jira description without duplicating them in a high-fidelity mockup. GRAB-1 is Done in Jira. The approved artifacts show the main flows and separate public browsing from private collections and admin; they use no Michelin branding or assets.
- Runtime acceptance remains open under DEC-063 and the current [test strategy](../../TEST-STRATEGY.md). Neither additional mockups nor visual approval supplies product/test-environment evidence.
- Atlas provides a responsive static composition, not a separate full-screen mockup for every desktop/mobile flow. No long-name/long-copy stress or bilingual layout was recorded. Responsive width sweep is viewport emulation only; browser zoom/text scaling and physical devices were not tested. The owner selected reflow as the presentation approach; this is not evidence of mobile usability or feature parity acceptance.
- Keyboard evidence covers forward Tab through all six focusable links only; reverse Tab, anchor activation, browser zoom, or assistive technology were not tested.
- Contrast figures cover selected text and boundary categories only, not every individual element/state or every focus/background combination.
- Explicit render states such as map unavailable, locked account, content link unavailable, save failure, notification target fallback, and unauthorized admin are not all shown as distinct screen examples; their detailed copy/behavior remains governed by the approved wireframe and open questions, not this atlas.
- The source wireframe covers UX only; the atlas does not satisfy runtime acceptance. Backend/database verification must be rerun for the current architecture.

## Limits

This proves only the static HTML atlas was rendered at the listed emulated viewport sizes and the documented static checks were observed. It is not real-device or production-app verification, not an exhaustive WCAG audit, and does not verify product interaction or accessibility acceptance. DEC-082 approves the visual baseline, not runtime acceptance or GRAB-2 Done.
