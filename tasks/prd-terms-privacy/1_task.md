# Task 1.0: Shared foundations — promote support-email helper and extend Button

## Overview

Two small shared-code changes that unblock the Terms contact footer: move `open-support-email.ts` from `src/features/help/` to `src/lib/` (avoiding a terms → help cross-feature import), and extend `src/components/ui/button.tsx` with a `soft` variant (Linen Cream fill, Charcoal Ink label) and a leading-icon slot per DESIGN.md.

<skills>
### Skills compliance

- `execute-task` — drives the implementation of this task from the techspec.
- `execute-review` — code review of the diff after completion.
</skills>

<requirements>
- `openSupportEmail` / `SUPPORT_EMAIL` keep their exact contract; only the module location changes (techspec "Main interfaces").
- `SupportBlock` (help) imports from the new `src/lib/open-support-email` path; existing help tests' mock targets updated in the same change so the suite stays green.
- `Button` gains a `soft` variant and a leading-icon slot without breaking the existing `accent | onPrimary | ghost` variants or trailing-arrow behavior.
- If extending the `Button` icon API proves invasive, fall back to a bespoke `Pressable` inside `ContactFooter` (decide here, preferring the `Button` extension — techspec component list, `button.tsx` entry).
</requirements>

## Subtasks

- [x] 1.1 Move `open-support-email.ts` to `src/lib/` unchanged; update the `SupportBlock` import.
- [x] 1.2 Update help test mock paths (`support-block`, any other test mocking the old module path).
- [x] 1.3 Add the `soft` variant and leading-icon slot to `Button` per DESIGN.md tokens.
- [x] 1.4 Extend `button.test.tsx` to cover the new variant and icon slot.
- [x] 1.5 Run `pnpm typecheck`, `pnpm lint`, `pnpm test` — full suite green.

## Implementation details

See techspec.md: "Main interfaces" (`open-support-email.ts` contract), component overview entries for `src/lib/open-support-email.ts` and `src/components/ui/button.tsx`, and "Known risks" (moving the helper touches passing help tests).

## Success criteria

- No file imports from `src/features/help/open-support-email` anymore.
- `Button variant="soft"` renders Linen Cream fill with Charcoal Ink label and an optional leading icon.
- Entire existing test suite passes with no behavior change for help.

## Task tests

- [x] Unit tests: updated `button.test.tsx` (soft variant, leading icon); existing help/support-block tests pass against the new module path.
- [x] Integration tests: not applicable (no screen-level change).
- [x] E2E tests: not applicable.

## Relevant files

- `src/features/help/open-support-email.ts` → `src/lib/open-support-email.ts`
- `src/features/help/components/support-block.tsx`
- `src/components/ui/button.tsx`
- `__tests__/button.test.tsx`, `__tests__/support-block.test.tsx`
