# Data model: unchanged records and presentation state

No database, API payload, or persisted record schema changes.

## Existing entities

- **Restaurant**: existing `id`, `name`, `rating`, `reviews`, `distance`, `price`, `cuisine`,
  `image`, optional sale metadata and `dishes` from `src/app/data/restaurants.ts`.
- **Dish**: existing `id`, `name`, price/rating/review/image/cuisine fields and optional
  restaurant references. Embedded menu dishes are scoped to their containing restaurant.
- **Page-local records**: retain their original identity and values. Coincident IDs across
  page-local and canonical collections do not establish a relationship.

## Validation invariants

- IDs are non-empty and unique within their source/scope, not globally inferred.
- "Missing is not zero": absent/unparseable price, rating or distance must not become 0.
- "Do not infer a live location": distances refer only to existing sample context.
- "Do not invent a relationship": a menu item's link must include the owning restaurant.
- "Do not overwrite conflicting records": mismatches require safe UI treatment, not schema edits.
- Price formatting changes presentation only. Range filters use overlap with an existing
  parseable price range, never fabricate an exact price from a range.

## Discovery state (existing route query parameters)

`q`, `category`, `distance`, `price`, `types`, `cuisines`, `tab`, `sort` describe the current
view. Unknown values are ignored safely or explained, never converted into phantom matches.
Draft filter state is distinct from applied URL state. Apply updates criteria, close cancels
draft, reset clears only filter fields; query and navigation context are retained.

## UI state transitions

- Ready with records → no matches when real criteria exclude all records → ready after clearing.
- Image loading → ready or image-unavailable fallback; never replace with another dish's image.
- No service → unavailable with explanation; cannot transition to fake submitted/authenticated.
- Valid dialog open → draft edits → apply or cancel → focus returns to opener.
- Theme light/dark/system uses existing `.dark` and local device preference only.
