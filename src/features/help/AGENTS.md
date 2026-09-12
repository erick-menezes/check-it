# Feature: Help / FAQ ("Central de ajuda")

**Route:** `/help` · **Entry:** `src/app/help.tsx`

## What it means

Self-service answers, so a confused user does not have to email support or drop
the app. Reached from the help action in the Home header and from Settings →
"Central de ajuda". Available to everyone; it is purely informational and has no
state beyond which accordion section is open.

Three thematic accordion sections: **Listas**, **Limites**, **Gastos**
(`HELP_SECTIONS` in `help-content.ts`). It closes with a "Não achou sua dúvida?"
block pointing at the support email.

## How it works

- `help-content.ts` — all copy as data. **This is documentation of shipped
  behavior**: it was corrected once already (`a3eb97a docs(copy): correct FAQ
  and privacy to match shipped features`) because it promised things the app
  does not do. When you change product behavior, check whether an FAQ answer
  now lies.
- `use-help-accordion.ts` — single-open accordion; the first section starts
  open, tapping the open one closes it.
- `components/support-block.tsx` → `openSupportEmail()` (`src/lib/`), a
  `mailto:` to `contact@erickmenezesdev.com`.

## Tests

`__tests__/help-screen.test.tsx`, `help-content.test.ts`,
`use-help-accordion.test.ts`, `faq-section.test.tsx`, `faq-tile.test.tsx`,
`help-header.test.tsx`, `support-block.test.tsx`, `e2e/help.test.js`.
