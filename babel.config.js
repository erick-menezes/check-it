module.exports = (api) => {
  api.cache(true);
  return {
    // babel-preset-expo (SDK 56) automatically configures the
    // react-native-worklets/reanimated Babel plugin when the package
    // is installed, so it does not need to be added here manually.
    presets: [
      ['babel-preset-expo', { jsxImportSource: 'nativewind' }],
      'nativewind/babel',
    ],
  };
};
