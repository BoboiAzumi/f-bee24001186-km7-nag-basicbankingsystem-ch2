import globals from 'globals';


/** @type {import('eslint').Linter.Config[]} */
export default [
  {files: ['**/*.js'], languageOptions: {sourceType: 'commonjs'}},
  {languageOptions: { globals: globals.browser }},
  {
    rules: {
      //semi: ['error', 'always'],
      quotes: ['error', 'single', { avoidEscape: true }],
      //'jsx-quotes': ['error', 'prefer-single'],
      //'linebreak-style': ['error', 'unix'],
      //'no-undef': 'off',
      'no-console': 'error'//,
      //'comma-dangle': ['error', 'never'],
      //'no-unused-vars': [
      //  'warn',
      //  { args: 'all', argsIgnorePattern: '^_', varsIgnorePattern: '^_' }
      //],
      //'no-sparse-arrays': 'off',
      //'no-unused-expressions': 'error',
      //'no-constant-binary-expression': 'error'
    }
  }
];