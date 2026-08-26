const path = require('path');

module.exports = {
  project: {
    ios: {},
    android: {},
  },
  assets: ['./assets/fonts'],
  dependencies: {
    '@fullstory/guides-and-surveys-react-native': {
      root: path.resolve(__dirname, '..'),
    },
  },
};
