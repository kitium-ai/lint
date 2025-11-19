/**
 * Vue.js ESLint Configuration Example
 * Setup for a Vue 3 project with TypeScript and Testing Library
 */

import {
  baseConfig,
  typeScriptConfig,
  vueConfig,
  jestConfig,
  securityConfig,
} from '@kitiumai/lint/eslint';

export default [
  {
    ignores: [
      'dist/',
      'node_modules/',
      '.git/',
      'coverage/',
      'build/',
      '.env',
      '.env.local',
      '*.log',
    ],
  },
  ...baseConfig,
  ...typeScriptConfig,
  ...vueConfig,
  ...securityConfig,
  {
    files: ['**/*.test.{js,ts,jsx,tsx}'],
    ...jestConfig,
  },
  {
    name: 'vue-specific-rules',
    files: ['**/*.vue'],
    rules: {
      'vue/multi-word-component-names': 'warn',
      'vue/require-explicit-emits': 'warn',
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    },
  },
  {
    name: 'vue-template-rules',
    files: ['src/**/*.vue'],
    rules: {
      'vue/html-indent': ['error', 2],
      'vue/max-attributes-per-line': ['warn', { singleline: 3, multiline: 1 }],
    },
  },
];
