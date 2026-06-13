# Task 2.0: Static content module `terms-content.ts`

## Overview

Create `src/features/terms/terms-content.ts` holding all static screen content as readonly typed constants: the two tab definitions, the last-updated label, both summary cards, the 8 Terms of Use sections, and the 6 Privacy sections — verbatim PT-BR copy from the design handoff (`screens.jsx` lines 1671–1790).

<skills>
### Skills compliance

- `execute-task` — drives the implementation of this task from the techspec.
- `execute-review` — code review of the diff after completion.
</skills>

<requirements>
- Data models and exported constants exactly as defined in techspec.md "Data models" (`TermsTabId`, `DocumentSummary`, `TermsSection`, `PrivacySection`; `TERMS_TABS`, `LAST_UPDATED_LABEL`, `TERMS_SUMMARY`, `PRIVACY_SUMMARY`, `TERMS_SECTIONS`, `PRIVACY_SECTIONS`).
- Copy is verbatim PT-BR from the handoff (PRD 4.2, 5.2); footer copy follows the PRD where it conflicts with the handoff ("Nosso time responde assim que possível." — techspec key decisions).
- Section order and counts exactly per PRD: 8 terms sections (PRD 4.1), 6 privacy sections (PRD 5.1), "Termos de uso" tab first (PRD 2.1/2.2).
- Lucide icon mapping per techspec (verify exact exports against installed `lucide-react-native@1.17` — known risk).
- Follows `help-content.ts` as the pattern for static content modules.
</requirements>

## Subtasks

- [x] 2.1 Define the types and constants per the techspec data models.
- [x] 2.2 Transcribe the verbatim PT-BR copy for all sections, summaries, and labels.
- [x] 2.3 Map and verify lucide icons (FileText, ShieldCheck, History, Inbox, ChartColumn, Users, Lock, CircleCheck, Eye, Mail).
- [x] 2.4 Write `__tests__/terms-content.test.ts`.

## Implementation details

See techspec.md: "Data models", icon-mapping paragraph, and key decision "Static TS constants over JSON/CMS/remote fetch". Content source: design handoff bundle referenced in the techspec executive summary.

## Success criteria

- Exactly 8 terms sections and 6 privacy sections, in PRD order, with verbatim titles and body copy.
- Module is pure data: no React, no I/O, fully tree-shakeable readonly constants.
- `pnpm typecheck` passes with strict mode (no `any`/assertions).

## Task tests

- [x] Unit tests: `terms-content.test.ts` — section counts and order, verbatim titles, last-updated label, tab order ("Termos de uso" first and default id).
- [ ] Integration tests: not applicable (pure data).
- [ ] E2E tests: not applicable.

## Relevant files

- `src/features/terms/terms-content.ts` (new)
- `__tests__/terms-content.test.ts` (new)
- `src/features/help/help-content.ts` (pattern reference)
- `tasks/prd-terms-privacy/prd.md` sections 3–6 (copy requirements)
