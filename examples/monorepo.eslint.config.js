/**
 * Example ESLint Configuration for Monorepo
 * Use this as a template for managing multiple applications and packages
 */

import {
  eslintBaseConfig,
  eslintReactConfig,
  eslintNodeConfig,
  eslintTypeScriptConfig,
} from '@kitium-ai/lint';

export default [
  // Frontend Web Application
  {
    name: 'web-app',
    files: ['apps/web/src/**/*.{ts,tsx}'],
    extends: [...eslintReactConfig, ...eslintTypeScriptConfig],
  },

  // Mobile/Desktop App (React Native/Electron)
  {
    name: 'mobile-app',
    files: ['apps/mobile/src/**/*.{ts,tsx}'],
    extends: [...eslintReactConfig, ...eslintTypeScriptConfig],
  },

  // Backend API Server
  {
    name: 'api-server',
    files: ['apps/api/src/**/*.ts'],
    extends: [...eslintNodeConfig, ...eslintTypeScriptConfig],
    rules: {
      'no-console': ['warn', { allow: ['warn', 'error'] }],
    },
  },

  // Shared Component Library
  {
    name: 'component-library',
    files: ['packages/components/src/**/*.{ts,tsx}'],
    extends: [...eslintReactConfig, ...eslintTypeScriptConfig],
    rules: {
      'react/prop-types': 'error', // Enforce prop-types for library
    },
  },

  // Shared Utilities Package
  {
    name: 'utilities',
    files: ['packages/utils/src/**/*.ts'],
    extends: [...eslintBaseConfig, ...eslintTypeScriptConfig],
  },

  // Test Files
  {
    name: 'test-files',
    files: ['**/*.{test,spec}.{ts,tsx}'],
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
