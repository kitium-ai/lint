/**
 * ESLint Base Configuration
 * Composes the shared @kitiumai/config preset plus KitiumAI-specific refinements.
 */
import sharedBaseConfig from '@kitiumai/config/eslint.config.base.js';
import boundariesPlugin from 'eslint-plugin-boundaries';
import importPlugin from 'eslint-plugin-import';
import promisePlugin from 'eslint-plugin-promise';
import simpleImportSortPlugin from 'eslint-plugin-simple-import-sort';
import unicornPlugin from 'eslint-plugin-unicorn';

const noopParser = {
  parse: (text) => ({
    type: 'Program',
    body: [],
    sourceType: 'module',
    comments: [],
    tokens: [],
    range: [0, text.length],
    loc: {
      start: { line: 1, column: 0 },
      end: { line: 1, column: text.length },
    },
  }),
};

const kitiumEnhancements = {
  name: 'kitium/base-enhancements',
  plugins: {
    boundaries: boundariesPlugin,
    import: importPlugin,
    promise: promisePlugin,
    'simple-import-sort': simpleImportSortPlugin,
    unicorn: unicornPlugin,
  },
  settings: {
    'boundaries/elements': [
      { type: 'app', pattern: 'src/app/**' },
      { type: 'feature', pattern: 'src/features/**' },
      { type: 'shared', pattern: 'src/shared/**' },
    ],
    'boundaries/alias': {
      '@app': 'src/app',
      '@features': 'src/features',
      '@shared': 'src/shared',
    },
  },
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

    // Import hygiene & layering
    'simple-import-sort/imports': 'error',
    'simple-import-sort/exports': 'error',
    'import/order': [
      'error',
      {
        groups: ['builtin', 'external', 'internal', ['parent', 'sibling', 'index'], 'object', 'type'],
        pathGroups: [
          { pattern: '@{app,features,shared}/**', group: 'internal', position: 'before' },
          { pattern: '@/**', group: 'internal', position: 'before' },
        ],
        pathGroupsExcludedImportTypes: ['builtin'],
        alphabetize: { order: 'asc', caseInsensitive: true },
        'newlines-between': 'always',
      },
    ],
    'import/newline-after-import': 'error',
    'import/no-duplicates': 'error',
    'import/no-relative-packages': 'error',
    'import/no-relative-parent-imports': 'warn',
    'import/no-default-export': 'warn',
    'import/no-cycle': ['warn', { maxDepth: Infinity }],
    'no-restricted-imports': [
      'warn',
      {
        patterns: ['../../*', '../../../*'],
        message: 'Prefer module aliases over deep relative imports for maintainability.',
      },
    ],

    // Error handling & logging discipline
    'no-console': [
      'error',
      { allow: ['warn', 'error', 'info'] },
    ],
    'promise/always-return': 'warn',
    'promise/catch-or-return': 'warn',
    'promise/no-nesting': 'warn',
    'promise/no-return-wrap': 'warn',
    'promise/param-names': 'warn',
    'promise/prefer-await-to-callbacks': 'warn',
    'promise/prefer-await-to-then': 'warn',

    // Performance and correctness (Unicorn essentials)
    'unicorn/no-array-callback-reference': 'warn',
    'unicorn/no-await-in-loop': 'warn',
    'unicorn/no-useless-undefined': 'error',
    'unicorn/prefer-node-protocol': 'warn',
    'unicorn/prefer-query-selector': 'warn',
    'unicorn/prefer-structured-clone': 'warn',
    'unicorn/prevent-abbreviations': [
      'warn',
      {
        allowList: { props: true, args: true },
      },
    ],
    'unicorn/throw-new-error': 'error',

    // File & API boundaries
    'unicorn/filename-case': [
      'warn',
      {
        cases: {
          camelCase: true,
          pascalCase: true,
          kebabCase: true,
        },
        ignore: ['README.md', 'CHANGELOG.md'],
      },
    ],
    'boundaries/element-types': [
      'warn',
      {
        default: 'allow',
        rules: [
          { from: ['app'], allow: ['shared', 'feature'] },
          { from: ['feature'], allow: ['shared'] },
          { from: ['shared'], allow: ['shared'] },
        ],
        message:
          'Cross-layer imports should go through shared abstractions. Update aliases or move code to shared.',
      },
    ],
  },
};

const formattingGuardrails = {
  name: 'kitium/formatting-guardrails',
  files: [
    '**/.prettierrc',
    '**/.prettierrc.*',
    '**/prettier.config.*',
  ],
  languageOptions: {
    parser: noopParser,
  },
  rules: {
    'no-restricted-syntax': [
      'error',
      {
        selector: 'Program',
        message:
          'Use the shared @kitiumai/config Prettier + EditorConfig defaults. Remove project-local formatting configs.',
      },
    ],
  },
};

const editorConfigGuardrails = {
  name: 'kitium/editorconfig-guardrails',
  files: ['**/.editorconfig'],
  languageOptions: {
    parser: noopParser,
  },
  rules: {
    'no-restricted-syntax': [
      'error',
      {
        selector: 'Program',
        message:
          'Centralize EditorConfig in @kitiumai/config; remove repository-specific .editorconfig files.',
      },
    ],
  },
};

export default [...sharedBaseConfig, kitiumEnhancements, formattingGuardrails, editorConfigGuardrails];
