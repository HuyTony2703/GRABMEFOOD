# GRABMEFOOD

React + Vite + Tailwind CSS project running inside Figma Make.

## Development Server

A Vite development server is always running on `$PORT` (default 8443). Source changes
are reflected through hot reload.

## Key Files

- `src/main.tsx` - Browser entry point
- `vite.figma.config.ts` - Figma Make wrapper configuration
- `.mise.toml` - Toolchain versions

## Project Guidelines

- Keep pages and components grouped by feature under `src/app/`; put shared data
  logic in `src/app/lib/` and cross-page state in `src/app/contexts/`.
- Import internal modules with the `@/` alias instead of deep relative paths.
- Reuse the existing React/Vite/Tailwind/Radix stack. Do not add dependencies or
  swap the toolchain without an explicit request.
- Never invent data, prices, ratings or successful service responses. Actions that
  have no backend must say so and stay disabled.
- Keep URLs, existing Vietnamese content and the current business scope (discovery
  and reviews, not ordering or delivery).
- Before handing work off, run `npm test`, `npm run typecheck`,
  `npm run check:structure` and, for UI changes, `npm run build`.
- Read `README.md` for the current layout and commands.
