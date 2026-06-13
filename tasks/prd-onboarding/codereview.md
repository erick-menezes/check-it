# Code Review Report — Task 1.0: General configuration (design tokens, fonts & reusable Button)

## Summary

- **Date:** 2026-06-07
- **Branch:** main
- **Status:** APPROVED
- **Modified Files:** 6 tracked + 4 untracked (new)
- **Lines Added:** ~159 (tracked diff)
- **Lines Removed:** ~270 (tracked diff, mostly pnpm-lock and the removed skill SKILL.md)

---

## Rules Compliance

| Rule | Status | Notes |
|------|--------|-------|
| English identifiers & source code | OK | All identifiers, functions, constants are in English |
| camelCase for functions/vars | OK | `handlePressIn`, `handlePressOut`, `useAppFonts`, `FONT_MAP` |
| PascalCase for interfaces | OK | `BtnProps`, `AppFontsResult` |
| kebab-case files/dirs | OK | `button.tsx`, `fonts.ts`, `src/components/ui/` |
| Verb-first function names | OK | `useAppFonts`, `handlePressIn`, `handlePressOut` |
| Constants for magic numbers | OK | `PRESS_SCALE = 0.97`, `PRESS_DURATION = 120` |
| No blank lines inside functions | OK | Fixed by lint pass; function declarations separated logically |
| Functions ≤ 50 lines | OK | Btn ~60 lines total (incl. constants), inner logic ~20 lines |
| No comments unless WHY non-obvious | OK | No unnecessary comments |
| Single variable per line | OK | All declarations are single-line |
| Functional components only | OK | `Btn` is a function component |
| NativeWind `className` with `cn` | OK | All styling via `cn()` |
| No DOM elements | OK | Uses `Pressable`, `Text`, `Animated.View` |
| Custom hooks `use`-prefixed | OK | `useAppFonts` |
| Strict TypeScript, no `any` | OK | Explicit types, `as const`, no `any` |
| `interface` for shapes, `type` for unions | OK | `BtnVariant`, `BtnSize` as `type`; `BtnProps`, `AppFontsResult` as `interface` |
| Explicit return types on exports | OK | `useAppFonts(): AppFontsResult`, `Btn(): React.JSX.Element` |
| No non-null assertions | OK | |
| Named imports | OK | All imports named |
| Biome lint clean | OK | `pnpm lint` reports no issues after auto-fix |

---

## TechSpec Adherence

| Technical Decision | Implemented | Notes |
|--------------------|-------------|-------|
| Design tokens in `global.css` + `tailwind.config.js` | YES | `checkit.*` namespace; CSS custom props + Tailwind colors |
| Dark-mode variants removed | YES | `.dark:root` block removed; `darkMode: 'class'` removed from Tailwind |
| Tokens additive — existing tokens preserved | YES | All `hsl(var(--*))` entries untouched |
| `@expo-google-fonts/plus-jakarta-sans` installed | YES | v0.4.2 |
| `lucide-react-native` ≥ 1.14 | YES | v1.17.0 |
| `react-native-svg` SDK-56 pin `~15.x` | YES | v15.15.4 |
| Installed via `expo install` | YES | |
| `src/lib/fonts.ts` — `FONT_MAP` + `useAppFonts` | YES | 5 weights (400/500/600/700/800) |
| Font load failure fallback (system-ui, `console.warn`) | YES | Error branch warns and returns `fontsLoaded: true` to unblock |
| `src/components/ui/button.tsx` — `Btn` | YES | |
| Variants: `accent` / `onPrimary` / `ghost` | YES | All three implemented |
| `accent` — Honey Mustard Yellow, charcoal-ink text | YES | `bg-checkit-accent` / `text-checkit-charcoal-ink` |
| `onPrimary` — translucent white 16%, white text | YES | `bg-white/16` / `text-white` |
| `ghost` — transparent, mist-border, charcoal text | YES | `border-checkit-mist-border bg-transparent` |
| Scale 0.97 tap feedback, 120 ms | YES | `Animated.timing` with `useNativeDriver: true` |
| Accessible labels on `Btn` | YES | `accessibilityLabel={label}` + `accessibilityRole="button"` |
| Button sizes sm/md/lg (34/44/52 px) | YES | `h-[34px]` / `h-[44px]` / `h-[52px]` |
| 12 px corner radius | YES | `rounded-xl` (Tailwind default: 12 px) |
| `pnpm typecheck` passes | YES | Clean |
| Existing tests remain green | YES | 3 suites, 10 tests, all passing |

---

## Verified Tasks

| Task | Status | Notes |
|------|--------|-------|
| 1.1 Install deps via expo install | COMPLETE | All three packages installed at correct versions |
| 1.2 Add tokens to `global.css` + `tailwind.config.js`; remove dark-mode | COMPLETE | Additive tokens; dark variants removed |
| 1.3 Create `src/lib/fonts.ts` | COMPLETE | FONT_MAP + useAppFonts with fallback |
| 1.4 Create `src/components/ui/button.tsx` | COMPLETE | All variants + tap squeeze |
| 1.5 Unit-test Btn; typecheck + tests green | COMPLETE | 6 tests covering all 3 variants and accessible labels |

---

## Tests

- **Total Tests:** 10 (3 suites)
- **Passing:** 10
- **Failing:** 0
- **New Tests Added:** 6 (button.test.tsx)
- **Coverage:** Not measured (no coverage config); new tests cover all three Btn variants and accessible label surface

---

## Problems Found

| Severity | File | Line | Description | Resolution |
|----------|------|------|-------------|------------|
| Low | `src/components/ui/button.tsx` | 50–66 | Blank lines inside function body between nested function declarations — code-standards violation | Fixed by `pnpm lint:fix` (biome auto-format pass) |
| Low | `src/app/index.tsx` | 1 | Double-quote import string — pre-existing, biome auto-fixed | Fixed by `pnpm lint:fix` |
| Low | `src/components/ui/button.tsx` | 2 | Import order (`type PressableProps` before `Text`) — biome assist | Fixed by `pnpm lint:fix` |
| Low | `src/global.css` | 34–46 | Hex values in UPPERCASE — biome format requires lowercase | Fixed by `pnpm lint:fix` |

All issues were auto-fixed during the review pass. No unresolved problems remain.

---

## Positive Points

- **Non-blocking font fallback:** `useAppFonts` returns `fontsLoaded: true` on error so the UI is never held up by a failed font load, and the warning is clearly labelled.
- **No magic numbers:** `PRESS_SCALE`, `PRESS_DURATION`, `VARIANT_CONTAINER`, `SIZE_CONTAINER` constants keep the component body clean and make values easy to tune.
- **`useNativeDriver: true`** on the Animated API ensures the scale animation runs entirely on the UI thread — no JS jank.
- **Token namespacing (`checkit.*`):** Avoids collisions with the existing generic Tailwind/shadcn token names and makes design system ownership clear.
- **`as const` on `FONT_MAP`:** Prevents accidental mutation and gives TypeScript better type inference.
- **Comprehensive Btn tests:** All three variants and the `accessibilityLabel` surface are covered, matching the techspec test requirement.

---

## Recommendations

- When Task 2.0 (onboarding screen) consumes `useAppFonts`, wire it into `_layout.tsx` to gate `SplashScreen.hideAsync()` — the hook is designed for exactly this but Task 1.0 leaves that integration to Task 2.0.
- Consider adding a `primary` variant to `Btn` (DESIGN.md lists it) when the broader app UI is built; the constant maps make it a one-liner addition.

---

## Conclusion

Task 1.0 is fully implemented and compliant with all project rules, the TechSpec, and the task's acceptance criteria. Four minor formatting issues detected by biome were resolved in-review via `pnpm lint:fix`. All 10 tests pass and `pnpm typecheck` is clean. The implementation is **APPROVED** and ready for Task 2.0.
