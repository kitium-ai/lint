/**
 * Example ESLint Configuration for Node.js Backend Application
 * Use this as a template for Express, Fastify, or other Node.js backends
 */

import { baseConfig, nodeConfig, typeScriptConfig } from '@kitiumai/lint/eslint';

export default [
  {
    ignores: ['node_modules/', 'dist/', 'build/', '.env', '.env.local', '*.log', 'coverage/'],
  },
  baseConfig,
  nodeConfig,
  typeScriptConfig,
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
