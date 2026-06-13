# Task 3.0: Limit screen assembly at `/limit`

## Overview

Replace the stub at the existing `/limit` route with the real screen: full-green chrome, the input core from task 2.0, the confirm flow through the persisted active-list store, and navigation wiring. This is where the stub import disappears and the end-to-end "create a list" entry flow becomes real.

<skills>
### Skills compliance

- `execute-task` — drives the implementation flow for this task
- `execute-review` — code review after the task is finalized
- `create-github-commit` — Conventional Commits when committing the deliverable
</skills>

<requirements>
- `src/app/limit.tsx` stops rendering `StubScreen`; route path unchanged so the Home CTA keeps working (FR 17)
- Chrome per handoff: full-bleed Herbal Leaf Green `SafeAreaView`, white X close top-left (padded ≥44 px hit area), kicker "PASSO 1 DE 2", title "Qual será o seu valor limite?", helper "Te alertamos se a compra ultrapassar esse valor." — all copy pt-BR exactly per FR 18
- `Stack.Screen` options: `animation: 'slide_from_right'`, `animationDuration: 320`; light status-bar content
- CTA: shared `Button` accent variant, full-width, arrow-right icon, anchored via `KeyboardAvoidingView` (`behavior: 'padding'` on iOS), disabled while `cents === 0` (FR 11)
- X → `router.back()`, discarding input, no store writes, no confirmation prompt (FR 16)
- Confirm → `createActiveList(cents)` → `useActiveListStore.setActiveList` → `router.replace('/shop')` (FR 12/13/14)
- Known risk watch: iOS `autoFocus` + push-transition jank — if visible on device, defer focus until interactions complete (techspec "Known risks")
</requirements>

## Subtasks

- [x] 3.1 Assemble the screen in `src/app/limit.tsx` (chrome + `CurrencyHero` + `PresetPills` + helper + CTA)
- [x] 3.2 Wire navigation: `router.back()` on X, `router.replace('/shop')` on confirm
- [x] 3.3 Wire persistence: `createActiveList` + `setActiveList` on confirm
- [x] 3.4 New `__tests__/limit-screen.test.tsx` (screen-level)

## Implementation details

See techspec.md → "Modified components" (`src/app/limit.tsx`), "Data flow", "Integration points" and "Key decisions" (`router.replace`, `KeyboardAvoidingView` built-ins only). Budget-alerts subscription is a verified no-op on creation — no guard needed.

## Success criteria

- All copy matches FR 18 verbatim; CTA disabled at R$ 0,00 and enabled after typing or preset
- X calls `router.back()` without touching the store; confirm calls `setActiveList` with the chosen limit then `router.replace('/shop')`
- Home reflects the new active list with no extra wiring (store subscription already in place)
- Visual fidelity to DESIGN.md/handoff (gutters, type scale, pill treatment, CTA state); accessibility labels/roles on X, hero, pills and CTA; disabled CTA exposes its state
- Full Jest suite passes; no TypeScript errors
- `__tests__/home-tabs-integration.test.tsx` still green (route unchanged)

## Task tests

- [x] Unit tests: `__tests__/limit-screen.test.tsx` (new) with established mocks only (`expo-router`, safe-area-context, AsyncStorage)
- [x] Integration tests: confirm path asserts store write + navigation together in `limit-screen.test.tsx`
- [x] E2E tests: not applicable (covered by task 4.0)

## Relevant files

- `src/app/limit.tsx` (modified — stub → real screen)
- `__tests__/limit-screen.test.tsx` (new)
- `src/features/limit/*` (from task 2.0), `src/features/home/active-list.ts`, `src/components/ui/button.tsx` (from task 1.0)
- `src/features/home/active-list-store.ts`, `src/app/shop.tsx`, `src/features/home/components/create-list-cta.tsx`, `src/features/notifications/budget-alerts.ts` (referenced, unchanged)
