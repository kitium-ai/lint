/**
 * ESLint Base Configuration
 * Composes the shared @kitiumai/config preset plus KitiumAI-specific refinements.
 */
import sharedBaseConfig from '@kitiumai/config/eslint.config.base.js';

const kitiumEnhancements = {
  name: 'kitium/base-enhancements',
  rules: {
    // Code Complexity & Maintainability
    complexity: ['warn', 10],
    'max-depth': ['warn', 3],
    'max-lines-per-function': ['warn', { max: 50, skipBlankLines: true, skipComments: true }],
    'max-statements': ['warn', 20],
    'no-nested-ternary': 'error',
    'no-bitwise': 'warn',
    'prefer-exponentiation-operator': 'warn',

    // Formatting / consistency additions that aren't covered upstream
    'no-multiple-empty-lines': ['error', { max: 2, maxBOF: 0, maxEOF: 0 }],
    'space-in-parens': ['error', 'never'],
    'array-bracket-spacing': ['error', 'never'],
    'object-curly-spacing': ['error', 'always'],
    'space-before-function-paren': [
      'error',
      { anonymous: 'always', named: 'never', asyncArrow: 'always' },
    ],
    indent: ['error', 2, { SwitchCase: 1, offsetTernaryExpressions: true }],
  },
};

export default [...sharedBaseConfig, kitiumEnhancements];
