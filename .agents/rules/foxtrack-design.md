# FoxTrack Design Rule

## 1. Design Philosophy

- **Usability over decoration:** FoxTrack is a fast, personal task management tool inspired by Things 3 and Linear. Every pixel serves clarity and focus.
- **Task list as primary hero:** No hero banners, no decorative dashboard metrics. The user opens the app to immediately see and manage tasks.
- **Quiet confidence:** Keep the surrounding chrome minimal so user content stands out.

## 2. Anti-AI-Slop (Strict Bans)

- **No decorative gradients:** Do not use gradient backgrounds on buttons, headers, cards, or logos.
- **No oversized border-radius:** Maximum radius `rounded-xl` (10–12px) for cards, `rounded-lg` (6–8px) for inputs/buttons. No `rounded-3xl` pills on everything.
- **No nested cards:** Avoid cards inside cards. Use clean dividers or subtle spacing.
- **No glassmorphism or blur:** No frosted glass panels without a strict functional overlay reason.
- **No decorative badges:** Avoid cluttered pill badges for priorities; use subtle, elegant indicator dots or refined typography.
- **No generic AI metrics:** Do not add fake completion charts, productivity scores, or decorative analytics grids.

## 3. Visual Quality

- **Color Discipline:** Warm, crisp neutral palette (light: `#F8F9FA` / `#FFFFFF`, dark: `#09090B` / `#18181B`). Fox orange (`#F97316` / `#EA580C`) is strictly an **accent** (used on active states, primary action, checkmark), never splashed across large surfaces.
- **Typography:** 14px–15px base size for tasks, 12px for meta info, tight line heights, consistent tracking.
- **Subtle borders & shadows:** 1px subtle border (`border-neutral-200 dark:border-neutral-800`), minimal shadow (`shadow-[0_1px_2px_rgba(0,0,0,0.04)]`).

## 4. UX Quality

- **Zero-friction task entry:** Single clean input, press Enter to submit, inline priority/due date without multi-step modals.
- **Checkmark feedback:** Ultra-responsive toggle state with clear, accessible strikethrough that remains fully legible.
- **Hover & Focus states:** Subtle background tint on hover, clear 2px focus ring (`focus-visible:ring-orange-500/30`).
- **Touch targets:** Minimum 44px hit areas on mobile without bloating visual density.
