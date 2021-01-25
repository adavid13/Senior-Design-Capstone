module.exports = {
  env: {
    browser: true,
    node: true,
    es6: true,
    mocha: true
  },
  extends: ['eslint:recommended'],
  rules: {
    'comma-dangle': ['error', 'only-multiline'],
    'no-dupe-class-members': 'off',
    'no-param-reassign': [2, { props: false }],
    'max-len': ['error', { code: 250, ignoreUrls: true }],
    'no-unused-vars': ['error', { vars: 'all', args: 'none', ignoreRestSiblings: false }],
    'semi': ['error', 'always'],
  },
  parser: '@babel/eslint-parser',
  parserOptions: {
    sourceType: 'module',
  },
};
