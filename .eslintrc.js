module.exports = {
  env: {
    node: true,
    browser: true,
    es2021: true,
  },
  extends: ['eslint:recommended', 'plugin:react/recommended'],
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 12,
    sourceType: 'module',
  },
  plugins: ['react'],
  rules: {
    'react/prop-types': 0,
    'react/react-in-jsx-scope': 'off',
    'react/no-unknown-property': [
      2,
      {
        ignore: ['jsx'],
      },
    ],
  },
  settings: { 'import/core-modules': ['styled-jsx/css'], react: { version: 'detect' } },
}
