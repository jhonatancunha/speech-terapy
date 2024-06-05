module.exports = {
  root: true,
  extends: ['eslint:recommended', '@react-native-community'],
  plugins: ['react', 'react-native', '@typescript-eslint', 'prettier', 'react-refresh'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    tsconfigRootDir: __dirname,
    ecmaFeatures: {
      jsx: true,
    },
  },
  globals: {
    JSX: true,
    NodeJS: true,
  },
  rules: {
    'no-undef': 'warn',
    'react-native/no-single-element-style-arrays': 'error',
    'react/jsx-no-undef': 'warn',
    'no-console': ['warn', { allow: ['error', 'info'] }],
    'no-param-reassign': 'warn',
    'prettier/prettier': ['error'],
    'import/no-named-as-default': 'off',
    'import/no-named-as-default-member': 'off',
    '@typescript-eslint/no-explicit-any': 'warn',
    '@typescript-eslint/explicit-function-return-type': 'warn',
    '@typescript-eslint/explicit-module-boundary-types': 'warn',
    'react/jsx-no-leaked-render': ['error', { validStrategies: ['ternary'] }],
    'react-refresh/only-export-components': 'warn',
    'arrow-body-style': 'warn',
  },
  settings: {
    'import/ignore': ['node_modules/react-native/index\\.js$'],
  },
};
