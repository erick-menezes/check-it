# Task 5.0: Screen composition, route replacement, and end-to-end validation

## Overview

Compose `DocumentContent`, replace the `terms.tsx` stub with the real route (state, fade transition, scroll reset), and close the feature with the screen-level integration test, the Detox E2E test, and the full validation pass.

<skills>
### Skills compliance

- `execute-task` — drives the implementation of this task from the techspec.
- `execute-review` — code review of the diff after completion.
- `execute-qa` — final PRD/techspec validation pass (visual + accessibility checks; note the project's E2E runner is Detox, not Playwright — techspec testing approach).
</skills>

<requirements>
- `document-content.tsx`: last-updated line, summary card, section list, contact footer in a Reanimated view with `entering={FadeIn.duration(250)}`; remounted via `key={activeTab}` so scroll resets natively (PRD 2.4; techspec key decision).
- `terms.tsx`: owns `activeTab: 'terms' | 'privacy'` local `useState` defaulting to `'terms'` (PRD 2.2); composes `TermsHeader`, fixed `SegmentedControl` (PRD 2.5), and the scrollable content; `Stack.Screen` options exactly like `help.tsx` (`simple_push`, 240 ms, gesture enabled).
- Layout per PRD UI requirements: 22 px gutters, white background, comfortable bottom padding; summary card and last-updated line per PRD 3.1–3.2.
- Settings entry point untouched — `settings-content.ts` already routes `/terms` (techspec integration points). Keep `src/lib/stub-screen.tsx` (still used by other routes).
- All quality gates green: `pnpm typecheck`, `pnpm lint`, `pnpm test`.
</requirements>

## Subtasks

- [x] 5.1 Implement `document-content.tsx` composing metadata line, summary card, `DocumentSection` list, and `ContactFooter`.
- [x] 5.2 Replace the `terms.tsx` stub: state, `SegmentedControl` wiring, keyed remount + fade.
- [x] 5.3 Write `__tests__/terms-screen.test.tsx` (screen-level integration).
- [x] 5.4 Write `e2e/terms.test.js` (Detox, skeleton from `e2e/settings.test.js`).
- [x] 5.5 Run `pnpm typecheck`, `pnpm lint`, `pnpm test`; mark feature tasks complete in `tasks.md`.

## Implementation details

See techspec.md: component overview entries for `terms.tsx` and `document-content.tsx`, "Data flow", key decisions ("key-remount + Reanimated FadeIn", "Local useState over a zustand store"), and "Testing approach". Reanimated `entering` in Jest is handled by the existing mock setup — assert content, not animation (known risk).

## Success criteria

- Navigating from the Settings "Termos e privacidade" row lands on the screen with the "Termos de uso" tab active and all 8 sections rendered (PRD success criteria).
- Tapping "Privacidade" fades to the 6 privacy sections with scroll reset to top; segmented control stays fixed.
- Screen renders fully offline with no network request, identical for anonymous and authenticated users.
- Full test suite, typecheck, and lint pass.

## Task tests

- [x] Unit tests: covered by component tests from tasks 2.0–4.0.
- [x] Integration tests: `terms-screen.test.tsx` — opens on "Termos de uso" with 8 sections; tapping "Privacidade" swaps to 6 sections and updates `accessibilityState.selected`; footer present on both tabs.
- [x] E2E tests: `e2e/terms.test.js` — launch fresh, skip onboarding, Settings → "Termos e privacidade"; assert default tab content; tap "Privacidade" and assert privacy content; close returns to Settings.

## Relevant files

- `src/features/terms/components/document-content.tsx` (new)
- `src/app/terms.tsx` (stub replaced)
- `__tests__/terms-screen.test.tsx`, `e2e/terms.test.js` (new)
- `src/app/help.tsx` (route template), `e2e/settings.test.js` (E2E skeleton)
- `jest.setup.js`, `__mocks__/` (shared mock infrastructure)
- `src/features/settings/settings-content.ts` (entry-point validation, no change)
