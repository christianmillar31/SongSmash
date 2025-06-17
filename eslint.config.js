const { FlatCompat } = require('@eslint/eslintrc');
const tsPlugin = require('@typescript-eslint/eslint-plugin');
const compat = new FlatCompat();

module.exports = [
  ...compat.extends('@react-native-community'),
  ...tsPlugin.configs['flat/recommended'],
  {
    rules: {
      '@typescript-eslint/func-call-spacing': 'off',
    },
  },
];
