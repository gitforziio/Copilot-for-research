/* eslint-disable quotes */

// eslint-disable-next-line no-undef
module.exports = {
  'env': {
    'browser': true,
    'es2021': true
  },
  'extends': [
    'eslint:recommended',
    'plugin:react/recommended'
  ],
  'overrides': [
  ],
  'parserOptions': {
    'ecmaVersion': 'latest',
    'sourceType': 'module'
  },
  'plugins': [
    'react'
  ],
  'rules': {
    'indent': [
      'error',
      2
    ],
    'linebreak-style': [
      'error',
      'unix'
    ],
    'quotes': [
      'error',
      'single'
    ],
    'semi': [
      'error',
      'always'
    ],
    'complexity': ["warn", {'max':20}],
    'max-depth': ["error", {'max':5}],
    'max-nested-callbacks': ["warn", {'max':5}],
    // 'max-statements': ["warn", { 'max': 20, "ignoreTopLevelFunctions": true }],
    'max-lines-per-function': ["warn", { 'max': 280, 'skipBlankLines': true, 'skipComments': true, }],
    'no-extra-semi': 'off',
    'no-unused-vars': 'off',
    'no-console': 'off',
    'no-extra-boolean-cast': 'off',
    'no-constant-condition': 'off'
  }
};
