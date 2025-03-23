module.exports = function(api) {
  api.cache(true);
  return {
      presets: ['babel-preset-expo'],
      plugins: [
          [
              'module-resolver',
              {
                  root: ['.'],
                  extensions: ['.ios.js', '.android.js', '.js', '.ts', '.tsx', '.json'],
                  alias: {
                      '@features': './src/features/',
                      '@navigator': './src/navigator/',
                      '@screens': './src/screens/',
                      '@components': './components/',  // Changed from '/components/'
                      '@utils': './utils/',         // Changed from '/utils/'
                      '@services':'./services/',
                      '@assets':'./assets/'
                  }
              }
          ],
          'react-native-reanimated/plugin', // ✅ Must be the LAST plugin
          '@babel/plugin-proposal-export-namespace-from'
      ]
  };
};
