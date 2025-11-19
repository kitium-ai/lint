/**
 * Example ESLint Configuration for Node.js Backend Application
 * Use this as a template for Express, Fastify, or other Node.js backends
 */

import { eslintNodeConfig, eslintTypeScriptConfig } from '@kitiumai/lint';

export default [
  ...eslintNodeConfig,
  ...eslintTypeScriptConfig,
  {
    name: 'project-overrides',
    files: ['src/**/*.ts'],
    rules: {
      // Allow console logging for backend applications
      'no-console': ['warn', { allow: ['log', 'warn', 'error', 'info'] }],
      // Backend specific overrides
      'security/detect-object-injection': 'off',
    },
  },
  {
    name: 'test-files',
    files: ['**/*.test.ts', '**/*.spec.ts', 'tests/**/*.ts'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unused-vars': 'off',
    },
  },
];
