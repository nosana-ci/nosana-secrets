module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
    es6: true
  },
  parserOptions: {
    ecmaVersion: 2020
  },
  extends: [
  ],
  plugins: [
  ],
  // add your custom rules here
  rules: {
    'no-console': 'off',
    'arrow-body-style': ['error', 'as-needed'],
    'class-methods-use-this': 2,
    'linebreak-style': 2,
    semi: [2, 'always'],
    quotes: [2, 'single'],
    'max-len': [
      'error',
      {
        code: 120,
        ignoreUrls: true,
        ignoreComments: true,
        ignoreStrings: true,
        ignoreTemplateLiterals: true
      }
    ],
    'new-cap': [
      2,
      {
        capIsNew: false,
        newIsCap: true
      }
    ],
    'no-param-reassign': 'off',
    'no-shadow': 2,
    'no-tabs': 2,
    'no-underscore-dangle': 2
  }
};
