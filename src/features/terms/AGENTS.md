# Feature: Terms & Privacy ("Termos e privacidade")

**Route:** `/terms` · **Entry:** `src/app/terms.tsx`

## What it means

The legal screen, reached from Settings. It exists for two reasons: store
compliance, and trust — a user handing an app their shopping and spending habits
wants to know where that goes. Written in plain, friendly pt-BR ("Sem letras
miúdas"), readable offline, no external webpage.

Two documents behind a segmented control: **Termos de uso** and **Privacidade**.

## How it works

- `terms-content.ts` — both documents as arrays of titled sections, plus the
  `TERMS_TABS` definitions. All copy changes happen here.
- `components/document-content/` switches between the two section lists;
  `components/document-section.tsx` renders one section.
- `components/contact-footer.tsx` → the same `openSupportEmail()` helper.

## Invariants

- **The privacy copy must stay true to the local-only build.** It was
  deliberately rewritten to say the app collects nothing and stores everything
  on-device (`6e5ea17 docs(terms): align privacy copy with local-only build`).
  The moment anything leaves the device — analytics, sync, an account — this
  file and `docs/privacy-policy.html` (the Play Console URL) both have to
  change.
- `docs/privacy-policy.html` is the public copy served for the Play listing;
  keep it in sync with the in-app text.

## Tests

`__tests__/segmented-control.test.tsx`, `contact-footer.test.tsx`,
`e2e/terms.test.js`.
