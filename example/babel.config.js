const path = require('path');
const { getConfig } = require('react-native-builder-bob/babel-config');
const pkg = require('../package.json');

const root = path.resolve(__dirname, '..');

module.exports = function (api) {
  const isWeb = api.caller((caller) => caller && caller.platform === 'web');
  api.cache.using(() => isWeb);

  return getConfig(
    {
      presets: [['babel-preset-expo', { unstable_transformImportMeta: true }]],
      plugins: isWeb
        ? []
        : ['@fullstory/react-native', 'react-native-worklets/plugin'],
    },
    { root, pkg }
  );
};
