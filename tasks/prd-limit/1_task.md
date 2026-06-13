# Task 1.0: Foundations: `formatBRLAmount`, `createActiveList` and `Button` disabled support

## Overview

Land the pure, dependency-free building blocks the Limit screen consumes: the prefix-free pt-BR currency formatter, the `ActiveList` factory, and first-class `disabled` support on the shared `Button`. Everything in later tasks renders, persists or confirms through these APIs.

<skills>
### Skills compliance

- `execute-task` — drives the implementation flow for this task
- `execute-review` — code review after the task is finalized
- `create-github-commit` — Conventional Commits when committing the deliverable
</skills>

<requirements>
- `formatBRLAmount(cents)` in `src/lib/currency.ts` returns the pt-BR number without the `R$` prefix (thousands `.`, cents `,`), up to `"9.999.999,99"`; existing `formatBRL` stays untouched as the single-string formatter (FR 6)
- `createActiveList(limitInCents, now?)` in `src/features/home/active-list.ts` builds a conformant `ActiveList`: `crypto.randomUUID()` id, `"Lista de DD/MM"` name from `now`, `itemCount: 0`, `totalInCents: 0`, ISO `createdAt`, the given `limitInCents`; no throwing, no clamping (FR 12)
- Store key, persistence shape and version unchanged — no migration (FR 15)
- `Button` gains `disabled`: pass-through to `Pressable`, `accessibilityState={{ disabled }}`, reduced-opacity container, press-scale suppression while disabled (FR 11, accessibility)
- Rules compliance per techspec.md "Rules compliance" (code/typescript/react-native standards)
</requirements>

## Subtasks

- [x] 1.1 Add `formatBRLAmount` to `src/lib/currency.ts` with explicit return type
- [x] 1.2 Add `createActiveList` factory to `src/features/home/active-list.ts` (injectable `now` for deterministic tests)
- [x] 1.3 Add `disabled` handling to `src/components/ui/button.tsx`
- [x] 1.4 Extend `__tests__/currency.test.ts` and `__tests__/active-list.test.ts` (unit)
- [x] 1.5 Extend `__tests__/button.test.tsx` (unit)
- [x] 1.6 Extend `__tests__/active-list-store.test.ts` with the persisted round-trip (integration)

## Implementation details

See techspec.md → "Main interfaces", "Data models" and the `button.tsx` entry under "Modified components". No new entities, no network, no new mock infrastructure (stub `globalThis.crypto.randomUUID` where determinism matters).

## Success criteria

- `formatBRLAmount`: `0` → `"0,00"`, `1500` → `"15,00"`, thousands grouping correct, 9-digit max renders `"9.999.999,99"`
- `createActiveList` output conforms to the existing `ActiveList` shape with zeroed totals, date-based name from injected `now`, unique ids across calls
- `setActiveList(createActiveList(n))` round-trips through the persisted store: survives rehydration and replaces a pre-existing active list (FR 12/13/15)
- Disabled `Button` blocks `onPress`, exposes `accessibilityState.disabled` and is visually distinct by more than color alone
- Full Jest suite passes; no TypeScript errors

## Task tests

- [x] Unit tests: `__tests__/currency.test.ts`, `__tests__/active-list.test.ts`, `__tests__/button.test.tsx` (extended)
- [x] Integration tests: `__tests__/active-list-store.test.ts` (extended)
- [x] E2E tests: not applicable (covered by task 4.0)

## Relevant files

- `src/lib/currency.ts` (modified)
- `src/features/home/active-list.ts` (modified)
- `src/components/ui/button.tsx` (modified)
- `__tests__/currency.test.ts`, `__tests__/active-list.test.ts`, `__tests__/button.test.tsx`, `__tests__/active-list-store.test.ts` (extended)
- `src/features/home/active-list-store.ts` (referenced, unchanged)
