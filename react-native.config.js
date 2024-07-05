module.exports = {
  dependencies: {
    'react-native-vector-icons': {
      platforms: {
        ios: null,
      },
    },
  },
  assets: ['./src/assets/fonts'],
  presets: ['module:metro-react-native-babel-preset'],
  env: {
    production: {
      plugins: ['react-native-paper/babel'],
    },
  },
};