# Feature: Settings ("Ajustes")

**Route:** `/(tabs)/settings` · **Entry:** `src/app/(tabs)/settings.tsx`

## What it means

The second tab: a predictable home for app-wide preferences and "about"
content. It is deliberately **small**, because the app is anonymous and local —
there is nothing to sync and no account to manage.

Exactly two sections:

- **NOTIFICAÇÕES** — the "Alertas de orçamento" toggle. This is a real,
  functioning preference: it gates whether `budget-alerts.ts` emits budget
  notifications. Persisted under `checkit:settings`.
- **SOBRE** — rows defined as data in `settings-content.ts`: "Central de ajuda"
  → `/help`, "Termos e privacidade" → `/terms`, and a version row reading
  `expo-constants`.

## Explicitly out of scope

Google sign-in / sync were deferred by product decision. Do not add an account
row. **No placeholder or "Em breve" rows** — the whole point of this screen's
spec was removing dead ends.

## Adding a row

Extend `SETTINGS_ABOUT_ROWS` (a discriminated union on `kind`:
`navigation | version`) rather than hand-writing JSX in the screen. A new kind
means a new branch in the section renderer.

## Tests

`__tests__/settings-screen.test.tsx`, `settings-store.test.ts`,
`settings-content.test.ts`, `navigation-row.test.tsx`,
`notification-row.test.tsx`, `version-row.test.tsx`, `e2e/settings.test.js`.
