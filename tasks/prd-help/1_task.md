# Task 1.0: Data layer — static content, types, and accordion hook

## Overview

Build the foundation every component consumes: the typed `readonly` static
data module holding all verbatim PT-BR FAQ copy, its domain types, and the
`useHelpAccordion` hook that owns the single-open / collapsible accordion state.
No UI, no network, no store — pure data and state logic, each independently
unit-tested before any component is built.

<skills>
### Skills compliance

- **execute-task** — implement following the loaded rules/skills and Context7 docs.
- **.claude/rules/code-standards.md** — English identifiers (PT-BR only in copy
  strings), verb-first names (`toggleSection`), constants for magic values,
  early returns, functions ≤50 lines / files ≤300 lines.
- **.claude/rules/typescript-standards.md** — `strict` mode, `interface` for
  shapes, union `type` for `HelpSectionId` (no enum), explicit return types on
  exports, `readonly` data, named imports, no `any` / non-null assertions.
- **.claude/rules/react-native-standards.md** — `use`-prefixed hook holding
  local state; `@testing-library/react-native` for the hook test.
</skills>

<requirements>
- `HELP_SECTIONS` MUST contain exactly three sections in order: Listas, Limites,
  Gastos (PRD 2.1).
- Item counts and verbatim PT-BR copy MUST match PRD §4 exactly (3 / 2 / 2),
  including the nested quotes.
- Leading icons reuse `lucide-react-native` glyphs already in the dependency set
  (e.g. `ListChecks`, `Wallet`, `Receipt`/`TrendingUp`).
- `useHelpAccordion` MUST initialize with the first section (`listas`) open
  (PRD 2.5), enforce single-open (PRD 2.3), and collapse to none when the open
  section is toggled again.
- Types follow the interfaces defined in techspec.md (`FaqItem`, `HelpSection`,
  `HelpAccordion`, `HelpSectionId`).
</requirements>

## Subtasks

- [x] 1.1 Define domain types and `HelpSectionId` union (techspec "Main interfaces").
- [x] 1.2 Implement `src/features/help/help-content.ts` with `HELP_SECTIONS` and the
  verbatim PT-BR copy from PRD §4, mirroring the `onboarding-steps.ts` pattern.
- [x] 1.3 Implement `src/features/help/use-help-accordion.ts` (single-open /
  collapsible state) per techspec.
- [x] 1.4 Write unit tests for both modules.

## Implementation details

See `techspec.md` → "Implementation design → Main interfaces" and "Data models"
for the exact interfaces and the `HelpSectionId` union. The static-data and hook
patterns mirror `src/features/onboarding/onboarding-steps.ts`. Build order items
1–2 of techspec "Development sequencing".

## Success criteria

- All three sections present in the correct order with the exact item counts.
- Copy snapshot test passes against PRD §4 verbatim strings (guards copy drift).
- Hook opens Listas by default, enforces single-open, and collapses to none on
  re-toggle.
- `tsc` passes under `strict`; no `any` / non-null assertions.

## Task tests

- [x] Unit tests — `__tests__/help-content.test.ts` (three sections in order;
  exact 3 / 2 / 2 counts; verbatim PT-BR strings per PRD §4).
- [x] Unit tests — `__tests__/use-help-accordion.test.ts` (Listas open by default;
  selecting another section closes the previous and opens the new; toggling the
  open section collapses to none).
- [ ] Integration tests — n/a (covered in Task 3.0).
- [ ] E2E tests — n/a (covered in Task 3.0).

## Relevant files

- `src/features/help/help-content.ts` (new)
- `src/features/help/use-help-accordion.ts` (new)
- `src/features/onboarding/onboarding-steps.ts` (pattern reference)
- `__tests__/help-content.test.ts`, `__tests__/use-help-accordion.test.ts` (new)
