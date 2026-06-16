# Expo HAS CHANGED

Read the exact versioned docs at https://docs.expo.dev/versions/v56.0.0/ before writing any code.

# Tests: share reusable mocks, do not duplicate them

Mocks needed by more than one test (e.g. `expo-glass-effect`, `expo-router`,
`react-native-safe-area-context`) live in `test-utils/mocks.tsx`. Reference them
from `jest.mock` factories with `require` (so Jest hoisting still works), and do
not re-declare the same mock inline in each test. Only add a mock to a test if
that test actually exercises the mocked module.

```typescript
jest.mock('expo-router', () =>
  require('../test-utils/mocks').createExpoRouterMock(),
);
```
