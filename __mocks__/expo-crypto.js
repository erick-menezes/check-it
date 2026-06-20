const { webcrypto } = require('node:crypto');

module.exports = {
  randomUUID: () => webcrypto.randomUUID(),
};
