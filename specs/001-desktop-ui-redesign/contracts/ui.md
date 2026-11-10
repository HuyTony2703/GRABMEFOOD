# UI contracts

## Route preservation

All paths in `src/app/routes.tsx` remain navigable: welcome, onboarding, home, map, random,
favorites, profile, login, register, restaurant, dish, restaurant-specific dish, search,
notifications, all-restaurants, profile reviews, settings and its account/address/notification/
language/theme/support/terms/guide children, and fallback error. Existing working transitions
must not be replaced by an unrelated record or generic home redirect.

## Interaction guarantees

- Link navigates, button changes state; no nested interactive controls.
- All enabled controls have a verified effect. Missing API/service actions remain unavailable
  with nearby explanation; do not erase forms, print secrets or simulate success.
- Search/filter change actual results; applied query/filter/tab/sort survives detail/back.
- Filter reset does not clear unrelated query; dismissing a draft does not apply it.
- Card identity, price and metadata refer to its source record. Unknown detail IDs show
  not-found/unavailable, not a fallback restaurant or invented menu.
- Dialogs use existing Radix primitives, accessible title/description, Escape and focus return.
- Existing local favorite/edit/delete/toggle behaviors remain local; no new synchronization.

## Layout/theme/a11y guarantees

One semantic token system in `theme.css` and `.dark`; red/white primary action in both themes.
Desktop frame max 1280px; compact form/read variants; fluid reflow at approved widths.
Minimum standalone target 44px and field height 48px. Fixed UI must not cover focus/content.
Text 4.5:1, large text/non-text 3:1; selected/error states have non-color indicators.
Main/skip link, labels, image failure states and explicit sample-data disclosure are shared.
No blanket overflow hiding or one-off global opacity to conceal failing contrast/layout.

## Integration boundary

No public endpoint, payload, authentication, geolocation, review backend or schema is added.
Existing external image/maps links remain external and their failure must not masquerade
as empty search results. Document browser limitations separately from source/unit evidence.
