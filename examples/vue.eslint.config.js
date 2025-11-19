/**
 * Vue.js ESLint Configuration Example
 * Setup for a Vue 3 project with TypeScript and Testing Library
 */

import {
  eslintBaseConfig,
  eslintTypeScriptConfig,
  eslintVueConfig,
  eslintJestConfig,
  eslintSecurityConfig,
} from '@kitium-ai/lint';

export default [
  eslintBaseConfig,
  eslintTypeScriptConfig,
  eslintVueConfig,
  {
    files: ['**/*.test.{js,ts,jsx,tsx}'],
    ...eslintJestConfig,
  },
  eslintSecurityConfig,
  {
    // Vue-specific project overrides
    files: ['**/*.vue'],
    rules: {
      'vue/multi-word-component-names': 'warn',
      'vue/require-explicit-emits': 'warn',
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_' },
      ],
    },
  },
  {
    // Template files
    files: ['src/**/*.vue'],
    rules: {
      'vue/html-indent': ['error', 2],
      'vue/max-attributes-per-line': ['warn', { singleline: 3, multiline: 1 }],
    },
  },
  {
    // Ignore patterns
    ignores: [
      'dist',
      'node_modules',
      '.git',
      'coverage',
      'build',
    ],
  },
];
