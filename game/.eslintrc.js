module.exports = {
  env: {
    browser: true,
    node: true,
    es6: true,
  },
  extends: ['plugin:prettier/recommended'],
  plugins: ['prettier'],
  rules: {
    'prettier/prettier': 'error',
    'comma-dangle': ['error', 'only-multiline'],
    'no-param-reassign': [2, { props: false }],
  },
  parser: '@babel/eslint-parser',
  parserOptions: {
    sourceType: 'module',
  },
};
