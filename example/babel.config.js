const path = require('path');
const { getConfig } = require('react-native-builder-bob/babel-config');
const pkg = require('../package.json');

const root = path.resolve(__dirname, '..');

module.exports = function (api) {
  api.cache(true);

  const isWeb = api.caller((caller) => caller && caller.platform === 'web');
  return getConfig(
    {
      presets: ['babel-preset-expo'],
      plugins: isWeb ? [] : ['@fullstory/react-native'],
    },
    { root, pkg }
  );
};
