# Task 1.0: General configuration (design tokens, fonts & reusable Button)

## Overview

Lay the visual and typographic foundation that every onboarding piece depends on:
introduce the Check.it design tokens (green/yellow palette from DESIGN.md) into
NativeWind, load **Plus Jakarta Sans** with a non-blocking fallback, and build the
reusable `Btn` with the variants the screen needs (`accent`, `onPrimary`, `ghost`).
This is the foundational step in the techspec build order — nothing visual can be
assembled before it exists.

<skills>
### Skills compliance

- **execute-task** — implement following project rules + pinned Expo v56 docs.
- **execute-review** — `git diff` review; full test suite must pass.
- **create-github-commit** / **create-github-pull-request** — Conventional Commit + PR targeting `dev`.
</skills>

<requirements>
- Add Check.it color tokens (Herbal Leaf Green `#58AB6A`, Honey Mustard Yellow accent, OnPrimary translucent white) to `global.css` and `tailwind.config.js` as **additive** tokens; drop only the dark-mode variants the PRD removes, keep existing `cn` usage.
- Load **Plus Jakarta Sans** via `@expo-google-fonts/plus-jakarta-sans` through a `lib/fonts.ts` font map + `useAppFonts` wrapper; on load failure fall back to `system-ui` (non-blocking, `console.warn`).
- Build `src/components/ui/button.tsx` (`Btn`) with `accent` / `onPrimary` / `ghost` variants, `scale(0.97)` tap feedback, and accessible labels.
- Install new dependencies via `expo install`: `@expo-google-fonts/plus-jakarta-sans`, `lucide-react-native` (pin `>= 1.14`), and peer `react-native-svg` (SDK-56 `~15.x`).
- `pnpm typecheck` and existing tests must still pass (token-introduction regression guard).
</requirements>

## Subtasks

- [x] 1.1 Install font / Lucide / `react-native-svg` deps via `expo install` (respecting the `>= 1.14` Lucide pin).
- [x] 1.2 Add Check.it color tokens to `global.css` + `tailwind.config.js`; remove dark-mode variants only.
- [x] 1.3 Create `src/lib/fonts.ts` with the Plus Jakarta Sans font map and `useAppFonts` (system-ui fallback, warn on failure).
- [x] 1.4 Create `src/components/ui/button.tsx` (`Btn`) with `accent` / `onPrimary` / `ghost` variants and tap squeeze.
- [x] 1.5 Unit-test `Btn` variants and accessible labels; verify `pnpm typecheck` + existing tests green.

## Implementation details

See `techspec.md`:
- "System architecture → Shared / cross-cutting" (`button.tsx`, `lib/fonts.ts`, token files).
- "Integration points → New dependencies to add" (exact pins and `expo install` rationale).
- "Development sequencing → Build order" step 1.
- "Technical considerations → Known risks → Token introduction regressions / Font load failure".
- DESIGN.md for palette, typography (`Plus Jakarta Sans`, tight tracking) and button styling.

## Success criteria

- Check.it tokens are available to NativeWind `className`s; no dark-mode tokens remain; existing placeholder screen still renders.
- Plus Jakarta Sans loads; a forced load failure falls back to system font without blocking first paint and emits a single `console.warn`.
- `Btn` renders all three variants with correct accessible labels and tap feedback.
- `pnpm typecheck` passes and the pre-existing test suite remains green.

## Task tests

- [x] Unit tests — `Btn` renders `accent` / `onPrimary` / `ghost` variants with correct accessible labels (techspec "Unit tests → button").
- [x] Integration tests — n/a at this layer (covered in Task 3.0).
- [x] E2E tests — n/a (covered in Task 3.0).

## Relevant files

- `src/global.css` (modify — Check.it tokens)
- `tailwind.config.js` (modify — Check.it tokens)
- `src/lib/fonts.ts` (new — font map + `useAppFonts`)
- `src/components/ui/button.tsx` (new — `Btn`)
- `package.json` (add font / lucide / react-native-svg)
- `__tests__/*` (new — button unit test)
- References: `DESIGN.md`, `tasks/prd-onboarding/techspec.md`
