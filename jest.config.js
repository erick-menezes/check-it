/** @type {import('jest').Config} */
module.exports = {
  preset: 'jest-expo',
  // Detox E2E specs run via `detox test` with e2e/jest.config.js, not here.
  testPathIgnorePatterns: ['/node_modules/', '/e2e/'],
  setupFiles: ['<rootDir>/jest.setup.js'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@react-native-async-storage/async-storage$':
      '@react-native-async-storage/async-storage/jest/async-storage-mock',
    '^react-native-reanimated$':
      '<rootDir>/__mocks__/react-native-reanimated.js',
    '^react-native-gesture-handler/ReanimatedSwipeable$':
      '<rootDir>/__mocks__/reanimated-swipeable.js',
  },
  transformIgnorePatterns: [
    'node_modules/(?!(?:.pnpm/[^/]+/node_modules/)?((jest-)?react-native|@react-native(-community)?|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation|@react-navigation/.*|nativewind|react-native-css-interop|react-native-reanimated|react-native-worklets|react-native-gesture-handler|@rn-primitives/.*))',
  ],
};
