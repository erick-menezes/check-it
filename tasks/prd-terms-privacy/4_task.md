# Task 4.0: Terms feature components

## Overview

Build the three presentational feature components under `src/features/terms/components/`: `TermsHeader` (minimal header with close affordance and subtitle), `DocumentSection` (one section row, numbered-tile or icon-tile mode), and `ContactFooter` (dashed support block calling `openSupportEmail`).

<skills>
### Skills compliance

- `execute-task` — drives the implementation of this task from the techspec.
- `execute-review` — code review of the diff after completion.
</skills>

<requirements>
- `TermsHeader`: mirrors `HelpHeader` (white background, hairline Mist Border bottom, close → `router.back()` with `canGoBack()` fallback to home), plus the subtitle (PRD 1.1–1.4); title 22 px / 700, subtitle 13 px muted.
- `DocumentSection`: 28 px leading tile (8 px radius, Linen Cream, Mist Border) holding the section number (terms) or 14 px icon (privacy); 14 px / 700 Charcoal Ink title; 13 px Slate Ink body at ~1.55 line height; 20 px bottom margin. One component, number vs. icon discriminated by props — no flag parameters (techspec rules compliance).
- `ContactFooter`: dashed Mist Border block (14 px radius, center-aligned), title "Ficou com alguma dúvida?", line "Nosso time responde assim que possível.", small soft `Button` with envelope icon and label "Falar com o suporte" calling `openSupportEmail()` from `src/lib/` (PRD 6.1–6.3).
- Close affordance and support button operable by screen readers with meaningful PT-BR labels and ≥44 px targets (PRD accessibility).
</requirements>

## Subtasks

- [x] 4.1 Implement `terms-header.tsx` and `__tests__/terms-header.test.tsx`.
- [x] 4.2 Implement `document-section.tsx` and `__tests__/document-section.test.tsx`.
- [x] 4.3 Implement `contact-footer.tsx` and `__tests__/contact-footer.test.tsx`.

## Implementation details

See techspec.md component overview entries for `terms-header.tsx`, `document-section.tsx`, `contact-footer.tsx`; templates: `src/features/help/components/help-header.tsx` and `support-block.tsx`.

## Success criteria

- Header close behavior matches `HelpHeader` semantics exactly (back when possible, replace to home otherwise).
- The same `DocumentSection` renders both a terms row (number 1–8) and a privacy row (icon) from props.
- Pressing the support button invokes `openSupportEmail` exactly once.

## Task tests

- [x] Unit tests: `terms-header.test.tsx` (title, subtitle, close a11y label, back/fallback navigation with mocked `expo-router`); `document-section.test.tsx` (numbered-tile vs icon-tile modes); `contact-footer.test.tsx` (copy, button label/a11y, calls mocked `openSupportEmail`).
- [x] Integration tests: covered by `terms-screen.test.tsx` (task 5.0).
- [x] E2E tests: not applicable at component level.

## Relevant files

- `src/features/terms/components/terms-header.tsx`, `document-section.tsx`, `contact-footer.tsx` (new)
- `__tests__/terms-header.test.tsx`, `__tests__/document-section.test.tsx`, `__tests__/contact-footer.test.tsx` (new)
- `src/features/help/components/help-header.tsx`, `support-block.tsx` (templates)
- `src/lib/open-support-email.ts`, `src/components/ui/button.tsx` (from task 1.0)
- `src/features/terms/terms-content.ts` (from task 2.0)
