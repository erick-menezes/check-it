// Global test setup
require('react-native-gesture-handler/jestSetup');

const { webcrypto } = require('node:crypto');

if (!globalThis.crypto) {
  globalThis.crypto = webcrypto;
}
