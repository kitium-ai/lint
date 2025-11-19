/**
 * Example ESLint Configuration for Monorepo
 * Use this as a template for managing multiple applications and packages
 */

import {
  baseConfig,
  reactConfig,
  nodeConfig,
  typeScriptConfig,
  jestConfig,
} from '@kitiumai/lint/eslint';

export default [
  // Global ignores
  {
    ignores: [
      'node_modules/',
      'dist/',
      'build/',
      '.next/',
      'coverage/',
      '.git/',
      '.turbo/',
      '.env',
      '.env.local',
      '*.log',
    ],
  },

  // Base config for all files
  baseConfig,
  typeScriptConfig,

  // Frontend Web Application
  {
    name: 'web-app',
    files: ['apps/web/src/**/*.{ts,tsx}'],
    ...reactConfig,
  },

  // Mobile/Desktop App (React Native/Electron)
  {
    name: 'mobile-app',
    files: ['apps/mobile/src/**/*.{ts,tsx}'],
    ...reactConfig,
  },

  // Backend API Server
  {
    name: 'api-server',
    files: ['apps/api/src/**/*.ts'],
    ...nodeConfig,
    rules: {
      'no-console': ['warn', { allow: ['warn', 'error'] }],
    },
  },

  // Shared Component Library
  {
    name: 'component-library',
    files: ['packages/components/src/**/*.{ts,tsx}'],
    ...reactConfig,
    rules: {
      'react/prop-types': 'error', // Enforce prop-types for library
    },
  },

  // Shared Utilities Package
  {
    name: 'utilities',
    files: ['packages/utils/src/**/*.ts'],
  },

  // Test Files
  {
    name: 'test-files',
    files: ['**/*.{test,spec}.{ts,tsx}'],
    ...jestConfig,
    rules: {
      '@typescript-eslint/no-explicit-any': 'warn',
      'no-console': 'off',
    },
  },

  // Config Files
  {
    name: 'config-files',
    files: ['*.config.{js,ts}', '.eslintrc.js', 'vite.config.ts'],
    rules: {
      '@typescript-eslint/no-require-imports': 'off',
      'import/no-unresolved': 'off',
    },
  },
];
