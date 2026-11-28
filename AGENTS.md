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
- Database backward-compatibility: migrations must strictly preserve user data using Dexie versioning (`db.version(n).stores(...).upgrade(...)`). Never drop or overwrite existing tables or fields without migration; offline user data must persist across app updates.
- **Full-backup rule (Export/Import)**: whenever a new table or entity is added to `FoxTrackDatabase` (`src/db/database.ts`), it **must** also be included in both Export and Import in `src/app/settings/_components/data-section/index.tsx` so user backups always contain all app data.
- **Strict Apple HIG UI/UX rule**: every new or modified UI component, page, layout, interaction, animation, navigation flow, and feedback pattern **must** strictly follow Apple Human Interface Guidelines (iOS/iPadOS design language) across every detail — layout, spacing, typography, touch targets, gestures, transitions, colors, and ergonomics — with zero exceptions.

## Don't

- Redesign page-local copies of existing buttons, fields, cards, headers, dialogs, or layout chrome — extend the shared component instead.
- Park single-route UI in `src/components/`.
- Flat files in `_components/` (use `<name>/index.tsx`).
- Dump unrelated UI/state/fetch into one component file.
- Break database schemas or wipe user data in updates — offline-first data must never be lost.
- Auto `git commit` / `git push` — leave that to the developer.
