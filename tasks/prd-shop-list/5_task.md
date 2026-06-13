# Task 5.0: Receipt scanning (camera + OCR + parser)

## Overview

Make receipt scanning functional: live `CameraView` preview inside the Receipt sheet, the camera permission flow, on-device OCR via `@react-native-ml-kit/text-recognition`, the pure cupom-fiscal `receipt-parser`, and the scan state machine with in-progress, success (items-added count) and error-with-retry feedback. Extracted lines land in the list as regular uncategorized items via `addItems`.

<skills>
### Skills compliance

- `execute-task` — implementation workflow for this task.
- `design-md` — `DESIGN.md` is the styling authority (Receipt sheet layout, feedback states).
- `execute-review` — code review after implementation.
- `create-github-commit` — Conventional Commits for the resulting changes.
</skills>

<requirements>
- `expo-camera` and `@react-native-ml-kit/text-recognition` added as dependencies; `app.json` gains camera plugin/permission config with pt-BR `NSCameraUsageDescription`; `expo prebuild` required (existing `e2e:prebuild` covers it).
- The Receipt sheet keeps the handoff layout (title, helper copy, preview area, full-width CTA) with the camera feed replacing the dashed placeholder; backdrop dismisses without changes; opens from both the empty state CTA and the action-row shortcut.
- Permission requested on first use via `useCameraPermissions`; denied state renders an in-sheet explanation with a `Linking.openSettings()` path — never a dead end.
- Capture via `takePictureAsync` only after `onCameraReady`; `CameraView` mounts only while the sheet is fully open (Android Modal surface quirk); photos go to app cache and are deleted after recognition — never stored or uploaded.
- `parseReceiptLines` is pure: pt-BR decimal commas, `UN/KG/LT/PC` tokens, `x` separator, keyword fences excluding header (CNPJ, address) and footer (TOTAL, dinheiro, troco) lines; fractional quantities round up with unit price preserved; only confident name + price lines return; empty result = "nothing recognized".
- `use-receipt-scan` drives the discriminated union `idle → capturing → processing → success(count) | error`; OCR throw or empty parse → `error` with retry, nothing touches the store; structured `console.warn('Receipt scan failed:', reason)` on failure.
- Each extracted line becomes an item (extracted name, quantity, unit price, no category, unchecked) persisted like any mutation; the user sees the number of items added.
</requirements>

## Subtasks

- [x] 5.1 Add dependencies and `app.json` camera config; run prebuild for dev clients.
- [x] 5.2 Create `src/features/shop/receipt-parser.ts` (`parseReceiptLines`).
- [x] 5.3 Create `src/features/shop/use-receipt-scan.ts` (state machine orchestrating permission, capture, OCR, parser, `addItems`).
- [x] 5.4 Create `src/features/shop/components/receipt-sheet.tsx` (CameraView preview, capture CTA, processing/success/error/permission-denied states); wire to empty state and action row.
- [x] 5.5 Add `__mocks__/` for `expo-camera` and `@react-native-ml-kit/text-recognition`.
- [x] 5.6 Unit tests — parser: fixture-driven on real cupom text (well-formed lines, weighed items, noise lines, total/footer exclusion, garbage input → empty result).
- [x] 5.7 Unit tests — hook and sheet: `use-receipt-scan` success/OCR failure/empty parse/permission denied; sheet state rendering and backdrop dismissal.
- [x] 5.8 Integration tests: successful scan appends items to the store and updates totals/Home card; failed scan leaves the store untouched.

## Implementation details

See techspec.md — "Integration points" (camera, OCR, parser contract), "Known risks" (OCR quality, format variance, Modal camera quirks) and PRD feature 6. `addItems` comes from task 1.0; the sheet primitive from task 2.0.

## Success criteria

- A legible cupom photo populates the list with names, quantities and prices without manual typing.
- A failed scan never corrupts the list: clear error, retry path, store untouched (PRD edge case).
- Scanning works offline end-to-end (on-device recognizer); the rest of the screen never depends on the scan.
- Every outcome is user-visible: processing state, items-added count, or error + retry.

## Task tests

- [x] Unit tests (parser fixtures, scan hook, sheet states)
- [x] Integration tests (scan → store append; failure → no-op)
- [ ] E2E tests — UI-only flow covered in task 6.0 (capture/OCR/parse correctness stays in Jest, per agreed decision)

## Relevant files

- `src/features/shop/receipt-parser.ts`, `use-receipt-scan.ts`, `components/receipt-sheet.tsx` (new)
- `package.json`, `app.json`
- `__mocks__/` (camera + OCR mocks, new)
- `src/features/shop/components/empty-state.tsx`, `action-row.tsx` (wiring)
- `__tests__/receipt-parser.test.ts`, `__tests__/use-receipt-scan.test.ts`, `__tests__/receipt-sheet.test.tsx` (new)
