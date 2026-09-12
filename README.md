# Check.it

A **shopping list app with budget control**, in React Native / Expo.

The core idea: before the list even exists, the user defines **how much they
intend to spend**. Then, as they check products off at the store, the app shows
the cart total against that limit in real time — warning them at 85% and again
when they blow past it.

Published on Google Play in **closed testing** (alpha track).

## What the app does today

The main flow is:

```
onboarding → home → limit (step 1 of 2) → shop list (step 2 of 2) → summary
```

| Screen        | Route              | What it is                                             |
| ------------- | ------------------ | ------------------------------------------------------ |
| Onboarding    | `/onboarding`      | 3-step intro, shown only once                          |
| Home          | `/(tabs)/home`     | Greeting + create a list / resume the active one       |
| Limit         | `/limit`           | Sets the budget (Nubank-style typing + presets)        |
| Shop list     | `/shop`            | Add, check, edit, search and sort products             |
| Summary       | `/summary`         | Total, spend per category and most expensive items     |
| Notifications | `/notifications`   | Budget alerts generated locally                        |
| Settings      | `/(tabs)/settings` | Alert preference + help, terms and version             |
| Help          | `/help`            | FAQ accordion (Listas · Limites · Gastos)              |
| Terms         | `/terms`           | Terms of use and privacy                               |

**Scope of this release** (worth reading before proposing anything):

- **100% local and anonymous.** No backend, account, login, sync or push.
  Everything lives in AsyncStorage on the device.
- **One active list at a time.** No history, saved lists, monthly goal,
  dashboard or price tracking across trips.

## Stack

| Area                       | Choice                                               | Version                               |
| -------------------------- | ---------------------------------------------------- | ------------------------------------- |
| Base                       | Expo (managed + dev client) · Expo Router            | SDK 56                                |
| UI                         | NativeWind (Tailwind for RN) + react-native-reusables | NativeWind 4.2.x · Tailwind **3.4.x** |
| Animation                  | Reanimated + Gesture Handler                         | 4.3.x · 2.31.x                        |
| State                      | Zustand + AsyncStorage                               | 5.x · 2.2.x                           |
| Icons                      | lucide-react-native                                  | 1.x                                   |
| Font                       | Plus Jakarta Sans (`@expo-google-fonts`)             | —                                     |
| Lint/Format                | Biome                                                | 2.4.x                                 |
| Tests (unit/integration)   | jest-expo + Testing Library                          | jest **29** · RNTL 13                 |
| Tests (E2E)                | Detox + @config-plugins/detox                        | 20.51.x · 11.x                        |

### Important pins (compatibility)

- **Tailwind stays on v3** (`3.4.19`): NativeWind 4 does not support Tailwind v4 yet.
- **Jest stays on v29**: `jest-expo@56` is built for the jest 29 ecosystem.
- Native dependencies follow the version `expo install` picks (aligned with
  SDK 56), not necessarily npm's "latest".

React Compiler is enabled (`experiments.reactCompiler` in `app.json`).

## Prerequisites

- **Node 20+** (22 LTS ideal). Expo SDK 56 does not run on Node 18.
  ```bash
  nvm use 22   # or: nvm install 22
  ```
- **pnpm** (this project uses `node-linker=hoisted`, see `.npmrc`).
- For native builds / E2E: Xcode (iOS) and/or the Android SDK.

## Setup

```bash
pnpm install
pnpm start            # Metro / dev server
pnpm ios              # build + run on the iOS simulator (dev client)
pnpm android          # build + run on the Android emulator (dev client)
```

> The app uses Reanimated/Gesture Handler and a dev client, so it **does not run
> on Expo Go** — use `pnpm ios` / `pnpm android` (or an EAS build).

## Scripts

| Script                                             | What it does                             |
| -------------------------------------------------- | ---------------------------------------- |
| `pnpm start`                                       | Starts Metro                              |
| `pnpm ios` / `pnpm android`                        | Builds and runs the dev client            |
| `pnpm lint` / `pnpm lint:fix`                      | Biome (check / autofix)                   |
| `pnpm format`                                      | Biome formatter                           |
| `pnpm typecheck`                                   | `tsc --noEmit`                            |
| `pnpm test` / `pnpm test:watch`                    | Unit + integration tests (jest)           |
| `pnpm e2e:prebuild`                                | Generates the native projects (`expo prebuild`) |
| `pnpm e2e:build` / `pnpm e2e:test`                 | Detox on iOS (`ios.sim.debug`)            |
| `pnpm e2e:build:android` / `pnpm e2e:test:android` | Detox on Android                          |

## Structure

```
src/
  app/              # routes (Expo Router) — thin screens, composition only
    _layout.tsx     # fonts + store hydration + splash + alerts
    index.tsx       # decides between onboarding and home
    (tabs)/         # home and settings (custom tab bar)
  features/<feature>/
    <domain>.ts     # domain types + pure functions
    <domain>-store.ts # persisted zustand store
    use-*.ts        # hooks
    *-content.ts    # pt-BR copy as data
    components/     # feature-private components
  components/ui/    # shared primitives (button, text, bottom-sheet…)
  lib/              # framework-agnostic helpers (currency, id, theme, fonts)
  global.css        # Tailwind directives + theme CSS vars
__tests__/          # unit and integration tests (outside app/ so the router ignores them)
e2e/                # Detox specs + the E2E jest.config.js
__mocks__/ · test-utils/   # shared mocks
tasks/prd-*/        # PRD + techspec + tasks per feature (point-in-time documents)
```

Logic lives in `src/features/`; the screens in `src/app/` only wire stores to
components and handle navigation. The domain (`active-list.ts`, `list-item.ts`)
is pure and immutable — the store is the only mutable layer.

### Documentation for AI agents

- `AGENTS.md` (root): what the product is, domain vocabulary, architecture and
  conventions.
- `src/features/<feature>/AGENTS.md`: each feature's intent and invariants.
- `DESIGN.md`: the design system (palette, type scale, motion).
- `.claude/rules/*.md`: coding standards enforced in review.

`CLAUDE.md` points to `AGENTS.md`, so it covers Claude Code and any tool that
follows the agents.md standard.

## UI: adding components (react-native-reusables)

The project is set up as a shadcn-style registry. To add a component (it lands
in `src/components/ui/`):

```bash
npx @react-native-reusables/cli@latest add button
```

Styling goes through Tailwind (NativeWind) classes directly on RN components:
`<View className="flex-1 items-center bg-background" />`. Brand colors are
`checkit-*` tokens (`bg-checkit-primary`, `text-checkit-danger`, …) defined in
`tailwind.config.js`.

## Typography (Plus Jakarta Sans)

The app enforces its own font even when the user has set a system-wide font.
Two practical rules:

- **Never import** `Text`**/**`TextInput` **from** `react-native` — import them
  from `@/components/ui/text`. A Biome rule (`noRestrictedImports`) breaks the
  lint if you forget.
- `font-medium`/`semibold`/`bold`/`extrabold` are **family** utilities, not
  weights (Tailwind's default `fontWeight` is disabled on purpose — otherwise
  Android looks for a bold variant that does not exist and falls back to the
  system font).

There is also a native safety net (the `expo-font` plugin in `app.json` +
`plugins/with-android-default-font.js`) for text rendered by native libraries —
changes there require a **native rebuild**, a JS reload is not enough.

## State + persistence (Zustand + AsyncStorage)

Four persisted stores, all in the same shape:

| Store                   | Key                     | Holds                                   |
| ----------------------- | ----------------------- | --------------------------------------- |
| `useActiveListStore`    | `checkit:active-list`   | the active list (v1, migrated from v0)  |
| `useOnboardingStore`    | `checkit:onboarding`    | `hasSeenOnboarding`                     |
| `useSettingsStore`      | `checkit:settings`      | `budgetAlertsEnabled`                   |
| `useNotificationsStore` | `checkit:notifications` | notifications + the budget latch        |

Every store exposes `hasHydrated` (set in `onRehydrateStorage`). `_layout.tsx`
renders `null` until the fonts have loaded **and** all four stores have
hydrated, and only then hides the splash. A new store must follow this pattern
and join that gate — otherwise the app flashes default state on launch.

When changing the shape of anything persisted, bump `version` and write a
`migrate` (reference: `active-list-store.ts`).

## Animation

Reanimated + Gesture Handler are already installed and `GestureHandlerRootView`
wraps the app in `src/app/_layout.tsx`. `babel-preset-expo` (SDK 56) configures
the worklets plugin automatically — do **not** add `react-native-worklets/plugin`
to Babel by hand.

## Tests

```bash
pnpm test          # jest (unit + integration)
```

Mocks used by more than one test live in `test-utils/mocks.tsx` and are
referenced from `jest.mock` factories with `require` (because of Jest hoisting)
— do not duplicate a mock inline in each file.

`testID`s are kebab-case and stable (`shop-screen`, `tab-home`,
`summary-back`): the Detox specs depend on them, so renaming one breaks `e2e/`.

## E2E (Detox)

Detox needs a native build (it does not run on Expo Go). iOS flow:

```bash
# prerequisite (once): brew tap wix/brew && brew install applesimutils
pnpm e2e:prebuild          # generates ios/ (and runs pod install)
pnpm e2e:build             # detox build (ios.sim.debug)
pnpm e2e:test              # detox test (ios.sim.debug)
```

Adjust the device in `.detoxrc.js` (`devices.simulator.device.type`) to an
installed simulator (`xcrun simctl list devices`) and `avdName` to an existing
AVD. The `ios/` and `android/` directories are generated on demand and are in
`.gitignore` (managed / CNG workflow).

## Deploy / Publishing (EAS + Play Console)

The app is published on Google Play in **closed testing** (the `alpha` track).
Configuration lives in `eas.json` (the `production` profile, with
`autoIncrement` + `appVersionSource: remote`).

### Shipping a new release (Android)

```bash
# 1. Commit everything (EAS Build uses the committed git state)
git status            # the tree has to be clean

# 2. Build the AAB in the cloud (autoIncrement bumps versionCode by itself)
eas build --platform android --profile production

# 3. Send it to the closed-testing track (alpha) automatically
#    --latest is required in non-interactive mode (picks the last build)
eas submit --platform android --profile production --latest
```

`versionName` comes from `version` in `app.json`; `versionCode` is managed
remotely by EAS (`appVersionSource: remote`). Bump `version` in `app.json` when
you want to change the displayed version name.

### `eas submit` credential

`eas submit` authenticates against the Play Developer API with a Google Cloud
**service account** key. The path is in `eas.json` →
`submit.production.android.serviceAccountKeyPath`:

```
./google-play-service-account.json   # project root, IGNORED by git
```

- The file is **never** committed (`.gitignore` covers the exact name).
- The service account needs the **"Release apps to testing tracks"** permission
  in the Play Console (Users and permissions).
- On another machine, download the key from Google Cloud and put it at that path.

The store listing assets (512 icon, feature graphic, screenshots) are in
`store-assets/`, and the public privacy policy in `docs/privacy-policy.html`.
