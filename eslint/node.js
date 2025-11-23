/**
 * ESLint Node.js Configuration
 * Configuration for Node.js applications and backend services
 * Includes security best practices and Node-specific rules
 */

import importPlugin from 'eslint-plugin-import';
import securityPlugin from 'eslint-plugin-security';
import simpleImportSortPlugin from 'eslint-plugin-simple-import-sort';

import baseConfig from './base.js';

export default [
  ...baseConfig,
  {
    name: 'kitium/node',
    files: ['**/*.js', '**/*.mjs', '**/*.cjs'],
    languageOptions: {
      globals: {
        // Node.js globals
        __dirname: 'readonly',
        __filename: 'readonly',
        exports: 'writable',
        global: 'readonly',
        module: 'writable',
        require: 'readonly',
        setImmediate: 'readonly',
        setInterval: 'readonly',
        setTimeout: 'readonly',
        clearImmediate: 'readonly',
        clearInterval: 'readonly',
        clearTimeout: 'readonly',
      },
    },
    plugins: {
      'simple-import-sort': simpleImportSortPlugin,
      import: importPlugin,
      security: securityPlugin,
    },
    rules: {
      // Node.js specific
      'no-process-exit': 'warn',
      'no-sync': 'warn',
      'no-path-concat': 'error',
      'handle-callback-err': 'error',
      'no-buffer-constructor': 'error',

      // Import sorting
      'simple-import-sort/imports': 'error',
      'simple-import-sort/exports': 'error',
      'import/first': 'error',
      'import/newline-after-import': 'error',
      'import/no-duplicates': 'error',
      'import/no-unresolved': 'off',
      'import/order': 'off', // Handled by simple-import-sort

      // Import Best Practices (Google Standards)
      'import/no-cycle': ['warn', { maxDepth: Infinity }],
      'import/no-self-import': 'error',
      'import/consistent-type-specifier-style': ['error', 'prefer-top-level'],

      // Security
      'security/detect-buffer-noassert': 'warn',
      'security/detect-child-process': 'warn',
      'security/detect-disable-mustache-escape': 'warn',
      'security/detect-no-csrf-before-method-override': 'warn',
      'security/detect-non-literal-fs-filename': 'warn',
      'security/detect-non-literal-regexp': 'warn',
      'security/detect-object-injection': 'off',
      'security/detect-possible-timing-attacks': 'warn',
      'security/detect-unsafe-regex': 'warn',
    },
  },
];
