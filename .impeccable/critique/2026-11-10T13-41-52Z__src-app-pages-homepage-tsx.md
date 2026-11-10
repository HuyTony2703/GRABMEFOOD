---
target: main discovery screen
total_score: 16
max_score: 40
na_heuristics: 
p0_count: 0
p1_count: 3
target_identity: "file:D:\\Projects\\GRABMEFOOD\\src\\app\\pages\\HomePage.tsx"
target_fingerprint: "sha256:72bd50956a76a883a07cb58f2ee526dd977ccfa85112e7de56d601a70f4f96fc"
target_path: "D:\\Projects\\GRABMEFOOD\\src\\app\\pages\\HomePage.tsx"
timestamp: 2026-11-10T13-41-52Z
slug: src-app-pages-homepage-tsx
---
⚠️ DEGRADED: single-context (nested subagents rejected by the session depth limit)

# Critique: main discovery screen
Target: src/app/pages/HomePage.tsx and its cards, navigation, filters, and search destination. Mode: Operate. Source-only review: no browser tool exposed and Playwright/Puppeteer unavailable. Rendered layout, contrast, and responsiveness are unverified. No UI edits or servers started.

## Design specificity
Vietnamese categories and price/distance metadata suit local discovery, but red tiles, repeated card rails, and promotions remain category-interchangeable with delivery marketplaces. Make the interface reliably answer what to eat near a chosen location before adding decoration.
Deterministic scan: 0 findings ([]) across HomePage.tsx, FilterModal.tsx, RestaurantCard.tsx, BottomNav.tsx, SearchResultsPage.tsx. This does not validate accessibility or behavior. No overlay injected.

## Design health
Provisional source-based scores.
| Heuristic | /4 | Issue |
|---|---:|---|
| System status | 1 | Filters imply application without changing results |
| Real-world match | 2 | Familiar language, mixed English filters, assumed locality |
| Control and freedom | 2 | Reset and close exist; no modal Escape handling |
| Consistency | 2 | Vietnamese home categories become English filters |
| Error prevention | 1 | Unsupported location/filter assumptions appear authoritative |
| Recognition over recall | 3 | Labeled navigation and comparison metadata |
| Efficiency | 2 | Direct paths exist; category shortcuts lose intent |
| Minimalist design | 2 | Equal-weight rails and dense filters |
| Error recovery | 0 | No truthful search no-results/recovery path |
| Help | 1 | Location/recommendation basis unexplained |
| Total | 16/40 | Poor |

## What works
- Cards combine price, rating, and distance for comparison.
- Bottom navigation includes readable labels.
- Filter sheet keeps reset/apply actions separate from scrolling content.

## Priority issues
1. [P1] Search and filters promise results they do not produce. HomePage.tsx:68-70 discards category; SearchResultsPage.tsx:31-45 presets Phở and logs filters; 251-325 renders static arrays. Coffee selection returns noodle results. Carry category/query in URL, derive results from criteria, expose active filters and truthful empty/reset state. Command: /impeccable harden.
2. [P1] Near-me results lack an established location basis. HomePage.tsx:10,29-35,83 uses fixed Quận 1 without location control. Let diners choose an area, label results relative to it, and distinguish sample from verified data. Do not invent live geolocation. Command: /impeccable clarify.
3. [P1] Keyboard/assistive barriers. HomePage.tsx:46-54 uses click-only search div and unnamed icon buttons; FilterModal.tsx:93-106,119-199 lacks dialog semantics, focus management, Escape and announced selection state. Use semantic search, accessible names, existing accessible dialog primitives, focus restoration and pressed/checked states. Command: /impeccable audit.
4. [P2] Filters front-load too many choices. FilterModal.tsx:17-58 has five distances, twelve food types and ten cuisines, with English food labels. Prioritize distance/budget, progressively disclose secondary choices, translate and summarize selections. Preserve brand. Command: /impeccable distill.

## Cognitive load and emotional journey
Moderate: minimal choices, <=4-item chunking and progressive disclosure fail. Filter groups exceed four options; six home categories and five nav destinations are counts, not automatic defects. Appetizing discovery promise leads to a confidence valley when category/filter intent is ignored. Detail browsing works but narrowing does not yield a trustworthy ending.

## Persona red flags
- Jordan: selecting Cà phê opens a search preset to Phở.
- Sam: home search is not tabbable; icon buttons and filter sheet lack semantics.
- Casey: displayed area cannot be changed from home; 95vh filter sheet requires excessive scanning.

## Minor observations
- Check truncated long Vietnamese names in 160px cards when rendered.
- Active navigation lacks aria-current.
- Images have alt text but lack explicit lazy loading; measure before prescribing optimization.

## Questions to consider
Would verified area-based discovery be more useful than a prominent discount rail? Can a useful restaurant choice be reached without the full filter sheet?
