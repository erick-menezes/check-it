# Check.it — agent guide

Root context for any agent working in this repo. Feature-level context lives in
`src/features/<feature>/AGENTS.md` — read the one closest to the files you are
touching, in addition to this file.

---

## 1. What the product is

**Check.it** is a Brazilian-Portuguese mobile app (iOS + Android, Expo) for
**grocery shopping lists with per-list budget control**.

The central loop is:

```
onboarding → home → limit (passo 1 de 2) → shop list (passo 2 de 2) → summary
```

1. The user defines **how much they intend to spend** (a limit, in BRL) *before*
   the list exists.
2. They add products, then check them off while shopping.
3. The cart total of **checked** items is compared against that limit in real
   time, and the app warns them at 85% and when they blow past it.

The differentiator versus a notes app is precisely the budget: every screen is
built to keep "quanto já está no carrinho vs. quanto eu podia gastar" in front
of the user.

**Audience:** pt-BR speaker doing supermarket runs on a phone. All UI copy is
Brazilian Portuguese; all code and docs are English.

**Current release shape — read this before proposing work:**

- **100% local and anonymous.** No backend, no account, no auth, no sync, no
  push notifications. Everything lives in AsyncStorage on the device.
- **One active list at a time.** There is no list history, no saved/past lists,
  no monthly goal, no dashboard, no price tracking across trips.
- Published on Google Play in **closed testing** (alpha track) via EAS.

Anything the PRDs in `tasks/` describe as a future/auth-gated feature (history,
goals, collaboration, price changes) is **deliberately absent**. Some of it
still appears as static UI — e.g. the notification type catalog has
`priceChange` and `collaboration` entries that nothing currently emits.

---

## 2. Domain vocabulary

Use these names in code; they are the ones the codebase already uses.

| Term | Meaning |
| --- | --- |
| **Active list** (`ActiveList`) | The single shopping list the user is working on. Persisted; survives restarts. `null` when none exists. |
| **Limit** (`limitInCents`) | The budget the user committed to when creating the list. Immutable after creation. |
| **Total** (`totalInCents`) | Sum of the **checked** items' line totals — "no carrinho". Recomputed on every mutation. |
| **List total** (`getListTotalInCents`) | Sum of **all** items, checked or not. Used by the Summary screen. |
| **Line total** | `unitPriceInCents × quantity`, or `0` when the item has no price. |
| **Budget status** | `onTrack` (< 85%) · `warning` (≥ 85%) · `overBudget` (> 100%). |
| **Category** | One of `grocery · produce · butcher · hygiene · cleaning · drinks · other`, or `null` ("Sem categoria"). Each has a label, hex color and Lucide icon in `CATEGORY_META`. |
| **Notification** | An in-app, locally generated event card. Not an OS push notification. |

**Money is always integer cents** (`*InCents`). Never store or pass floats.
Format at the edge with `formatBRL` / `formatBRLAmount` (`src/lib/currency.ts`).

---

## 3. Stack

| Area | Choice |
| --- | --- |
| Runtime | Expo SDK **56** (managed + dev client), React Native 0.85, React 19.2 |
| Routing | **Expo Router** (file-based, `typedRoutes: true`) + `expo-router/ui` for the custom tab bar |
| Styling | **NativeWind 4** (Tailwind **3.4.x** — NativeWind 4 does not support Tailwind 4) |
| State | **Zustand 5** + `persist` middleware over AsyncStorage |
| Animation | Reanimated 4 + Gesture Handler 2 |
| Icons | `lucide-react-native` |
| Lint/format | **Biome 2.4** (not ESLint/Prettier) |
| Unit/integration tests | `jest-expo` (jest **29**) + React Native Testing Library 13 |
| E2E | **Detox 20** (`e2e/`, own jest config) |
| Package manager | **pnpm** (`node-linker=hoisted`, see `.npmrc`) |
| Build/deploy | EAS Build + EAS Submit → Google Play alpha |

React Compiler is enabled (`experiments.reactCompiler`). `android/` and `ios/`
are CNG-generated and gitignored.

**Expo 56 changed a lot** — read the versioned docs at
<https://docs.expo.dev/versions/v56.0.0/> before writing Expo code, rather than
relying on memory of older SDKs.

### Commands

```bash
pnpm start          # Metro
pnpm ios | android  # build + run the dev client (Expo Go will NOT work)
pnpm lint           # biome check .
pnpm typecheck      # tsc --noEmit
pnpm test           # jest (unit + integration)
pnpm e2e:build && pnpm e2e:test        # Detox iOS
```

Node 20+ (22 LTS ideal), managed with **nvm** only.

---

## 4. Architecture

```
src/
  app/                    # Expo Router routes — thin screens, composition only
    _layout.tsx           # fonts + store hydration gate + splash + budget tracking
    index.tsx             # decider: onboarding vs. home
    (tabs)/               # home, settings (custom bottom tab bar)
    limit · shop · summary · notifications · help · terms   # stack screens
  features/<feature>/     # the real code, one folder per feature
    <domain>.ts           # pure domain functions + types
    <domain>-store.ts     # zustand store (persisted)
    use-*.ts              # hooks
    *-content.ts          # static pt-BR copy as data
    components/           # feature-private components
  components/ui/          # cross-feature primitives (button, text, bottom-sheet…)
  lib/                    # framework-agnostic helpers (currency, id, theme, fonts)
```

**Screens are thin.** A file in `src/app/` wires stores to feature components
and handles navigation; logic belongs in `src/features/`.

**Domain logic is pure.** `active-list.ts` and `list-item.ts` are pure,
`readonly`, immutable-update functions with no React and no storage. The store
is the only mutable layer, and it re-derives totals through `recomputeTotals`
after every mutation.

**Cross-feature dependencies are allowed but directional.** Other features
import the active list from `@/features/home/*` (it is the shared aggregate);
the shop feature owns the item-level model (`@/features/shop/list-item`).

### State and persistence

Four persisted Zustand stores, all following the same shape:

| Store | Key | Holds |
| --- | --- | --- |
| `useActiveListStore` | `checkit:active-list` | the single active list (v1, has a migration from v0) |
| `useOnboardingStore` | `checkit:onboarding` | `hasSeenOnboarding` |
| `useSettingsStore` | `checkit:settings` | `budgetAlertsEnabled` |
| `useNotificationsStore` | `checkit:notifications` | notifications + the budget-threshold latch |

Every store exposes **`hasHydrated`**, set in `onRehydrateStorage`. The root
layout renders `null` until fonts are loaded *and* all four stores have
hydrated, then hides the splash screen. **Any new persisted store must follow
this pattern and be added to the gate in `src/app/_layout.tsx`** — otherwise the
app flashes default state on cold start.

Bump `version` and write a `migrate` function whenever a persisted shape
changes; `active-list-store.ts` has the reference implementation.

---

## 5. Conventions that will trip you up

- **Never import `Text` / `TextInput` from `react-native`.** Import them from
  `@/components/ui/text`. A Biome `noRestrictedImports` rule enforces this.
  Reason: the app forces Plus Jakarta Sans over a device-forced font, and the
  wrapper injects `font-sans` only when the caller supplied no font utility.
- **`font-medium`/`semibold`/`bold`/`extrabold` are font-*family* utilities**,
  not weights. `theme.fontWeight` is deliberately emptied in
  `tailwind.config.js` so those classes do not also emit `fontWeight`, which on
  Android makes the OS hunt for a bold variant, fail, and fall back to the
  system font. There is also a native safety net: the `expo-font` plugin in
  `app.json` plus `plugins/with-android-default-font.js`. Font changes need a
  **native rebuild**, not a JS reload.
- **Brand colors are `checkit-*` Tailwind tokens** (`bg-checkit-primary`,
  `text-checkit-danger`, …) defined in `tailwind.config.js`. Category colors
  additionally exist as hex in `CATEGORY_META` for SVG/icon props.
- **Shared test mocks live in `test-utils/mocks.tsx`.** Reference them from
  `jest.mock` factories with `require` (hoisting), never re-declare a mock
  inline. Only mock what the test actually exercises.
- **Code standards** (`.claude/rules/code-standards.md`, plus
  `typescript-standards.md` and `react-native-standards.md`) are enforced in
  review: English identifiers, kebab-case filenames, verbs for functions, named
  constants instead of magic numbers, early returns over nesting, no blank lines
  inside function bodies, no flag parameters, comments only when the code cannot
  speak for itself.
- **Test IDs** are kebab-case and stable (`shop-screen`, `tab-home`,
  `summary-back`); Detox specs depend on them, so renaming one is a breaking
  change to `e2e/`.

---

## 6. Where knowledge lives

| File | What it is |
| --- | --- |
| `AGENTS.md` (this file) | Product + architecture context for agents |
| `src/features/*/AGENTS.md` | Per-feature context: intent, state, invariants |
| `DESIGN.md` | The design system (palette, type scale, motion, per-screen specs) — the source of truth for anything visual |
| `README.md` | Human setup, scripts, EAS/Play release runbook |
| `tasks/prd-*/` | Historical PRD + techspec + task breakdown per feature. **Point-in-time documents — the code supersedes them** |
| `.claude/rules/*.md` | Coding standards enforced in review |
| `CLAUDE.md` | Claude Code entry point; imports this file |
