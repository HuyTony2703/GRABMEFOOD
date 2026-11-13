# GrabMeFood

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Vietnamese-language diners choosing nearby restaurants and dishes.

## Product Purpose

Help people decide what and where to eat through nearby restaurant and dish discovery. The user confirmed discovery-only scope: food ordering and delivery are not part of the product.

## Operating Context

The existing web interface supports browsing restaurants and dishes, searching and filtering, map exploration, random suggestions, favorites, and reviews. These are implementation evidence, not confirmation of production service readiness.

## Capabilities and Constraints

- Desktop-only presentation is confirmed as of 2026-11-13: narrow windows and phones
  retain the desktop layout with horizontal scrolling, not a mobile UI or access block.
- Display dishes only when an existing restaurant/menu relationship is valid. Preserve
  unlinked source records without displaying them. Standalone dish URLs are compatibility
  entries only; redirect solely through a unique explicit relationship to a menu item.
- Preserve the discovery-only purpose and Vietnamese content.
- Production use is intended, but production requirements and verified integrations are not yet decided.
- Live restaurant data, geolocation, authentication, review services, privacy requirements, and deployment requirements remain open decisions. Do not describe them as verified or operational without evidence.
- The existing project uses React, Vite, and Tailwind CSS within a Figma Make environment. The development entry is `src/main.tsx`; `npm run dev` uses `vite.figma.config.ts`.
- Routes and implemented screen boundaries are recorded in `src/app/routes.tsx`.

## Brand Commitments

- Preserve the GrabMeFood name.
- Preserve Vietnamese-language product content.
- Init does not establish or replace the visual identity.

## Evidence on Hand

- `src/app/data/restaurants.ts` contains restaurant and dish records, image URLs, prices, distances, ratings, and review counts. Their production accuracy and provenance are unverified.
- `src/assets/` contains the local logo and dish image currently in use; their presence does not establish licensing or production approval.
- Existing onboarding describes nearby discovery, food search, and reading or sharing reviews.
- No production integrations or verified claims were supplied during init. Do not invent customer counts, testimonials, service coverage, or operational guarantees.

## Product Principles

- Help diners choose what and where to eat rather than introducing ordering or delivery workflows.
- Preserve the Vietnamese-language audience and GrabMeFood identity.
- Distinguish implemented interface behavior from verified production capabilities.
- Keep undecided production facts explicit rather than converting assumptions into claims.
