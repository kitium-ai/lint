/**
 * ESLint Base Configuration
 * Shared configuration applicable to all JavaScript/TypeScript projects
 * Provides core rules for code quality and security
 */

export default [
  {
    name: 'kitium/base',
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        console: 'readonly',
        process: 'readonly',
        Buffer: 'readonly',
        URL: 'readonly',
      },
    },
    rules: {
      // Best Practices
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'no-debugger': 'error',
      'no-eval': 'error',
      'no-implied-eval': 'error',
      'no-new-func': 'error',
      'no-unused-expressions': 'error',
      'no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
        },
      ],
      'prefer-const': 'error',
      'no-var': 'error',
      eqeqeq: ['error', 'always', { null: 'ignore' }],
      'no-irregular-whitespace': 'error',
      'no-trailing-spaces': 'error',
      semi: ['error', 'always'],
      'comma-dangle': ['error', 'always-multiline'],
      'object-shorthand': ['error', 'always'],
      'quote-props': ['error', 'as-needed'],
      'prefer-template': 'error',
      'no-param-reassign': 'error',
      'consistent-return': 'error',

      // Code Complexity & Maintainability (Best Practices Standard)
      complexity: ['warn', 10],
      'max-depth': ['warn', 3],
      'max-lines-per-function': ['warn', { max: 50, skipBlankLines: true, skipComments: true }],
      'max-statements': ['warn', 20],
      'no-nested-ternary': 'error',
      'no-bitwise': 'warn',
      'prefer-exponentiation-operator': 'warn',

      // Security
      'no-with': 'error',
      'no-delete-var': 'error',
      'no-shadow': ['error', { builtinGlobals: false }],
      'no-undefined': 'error',
      'no-multi-spaces': 'error',
      'key-spacing': 'error',
      'space-in-parens': ['error', 'never'],
      'array-bracket-spacing': ['error', 'never'],
      'object-curly-spacing': ['error', 'always'],
      'no-multiple-empty-lines': ['error', { max: 2, maxBOF: 0, maxEOF: 0 }],
      'keyword-spacing': 'error',
      'space-before-function-paren': [
        'error',
        { anonymous: 'always', named: 'never', asyncArrow: 'always' },
      ],
      'arrow-spacing': 'error',
      'no-mixed-spaces-and-tabs': 'error',
      indent: ['error', 2, { SwitchCase: 1, offsetTernaryExpressions: true }],
    },
  },
];
