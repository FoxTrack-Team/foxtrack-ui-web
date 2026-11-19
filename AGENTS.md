# Agents (FoxTrack)

Adopted from [next-style-guide](https://github.com/alidanial7/next-style-guide).

## Maintenance

Stack-wide rules live here. Feature details live in `.cursor/rules/*.mdc` (glob-scoped — only load when editing matching files).

When you change an app convention, **update the matching `.cursor/rules/*.mdc`** in the same change so agents do not follow stale guidance.

## Stack

App Router · TS strict · Tailwind CSS · pnpm · Dexie.js (IndexedDB) · Capacitor (Android) · Vitest.

## Do

- Thin `page.tsx` / `layout.tsx` — UI in folder-per-component `<name>/index.tsx`.
- **Reuse before redesign**: search existing shared/UI/`_components` first; reuse or extend with props — never rebuild the same chrome per page (see `.cursor/rules/components.mdc`).
- Route-only → `src/app/<route>/_components/<name>/index.tsx`.
- Layout / home → `src/app/_components/<name>/index.tsx`.
- Shared (≥2 routes/features) → `src/components/<name>/index.tsx` (`ui/` flat for shadcn).
- Infra → `src/lib/`; Database → `src/db/`; Features → `src/features/<feature>/`; Providers → `src/providers/`.
- Named exports `function Foo()`; default only for Next route files (`page.tsx`, `layout.tsx`, `not-found.tsx`).
- Keep UI components focused (≈150 lines soft cap) — split rather than grow mega-components.
- Single `<main>` in root layout — never nest `<main>` in pages/components.
- Text direction: use `useDirection()` from `@/hooks/use-direction` and logical CSS (`margin-inline`, `padding-inline`) — do not hardcode `dir` ad hoc.
- Icons: always and strictly use `@tabler/icons-react` (never `lucide-react`).
- Colocated tests: `<name>.test.tsx` next to `index.tsx`.

## Don't

- Redesign page-local copies of existing buttons, fields, cards, headers, dialogs, or layout chrome — extend the shared component instead.
- Park single-route UI in `src/components/`.
- Flat files in `_components/` (use `<name>/index.tsx`).
- Dump unrelated UI/state/fetch into one component file.
- Auto `git commit` / `git push` — leave that to the developer.
