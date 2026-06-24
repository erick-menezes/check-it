const DETOX_CONFIG_PLUGIN = '@config-plugins/detox';

module.exports = ({ config }) => {
  const shouldEnableDetox = process.env.E2E_BUILD === '1';
  if (!shouldEnableDetox) return config;
  return {
    ...config,
    plugins: [...(config.plugins ?? []), DETOX_CONFIG_PLUGIN],
  };
};
