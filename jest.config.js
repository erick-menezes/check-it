/** @type {import('jest').Config} */
module.exports = {
  preset: 'jest-expo',
  // Detox E2E specs run via `detox test` with e2e/jest.config.js, not here.
  testPathIgnorePatterns: ['/node_modules/', '/e2e/'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  transformIgnorePatterns: [
    'node_modules/(?!(?:.pnpm/[^/]+/node_modules/)?((jest-)?react-native|@react-native(-community)?|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation|@react-navigation/.*|nativewind|react-native-css-interop|react-native-reanimated|react-native-worklets|react-native-gesture-handler|@rn-primitives/.*))',
  ],
};
