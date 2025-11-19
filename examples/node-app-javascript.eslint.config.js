/**
 * Example ESLint Configuration for Node.js Backend Application (JavaScript)
 * Use this as a template for Express, Fastify, or other Node.js backends in pure JavaScript
 */

import { baseConfig, nodeConfig } from '@kitiumai/lint/eslint';

export default [
  {
    ignores: ['node_modules/', 'dist/', 'build/', '.env', '.env.local', '*.log', 'coverage/'],
  },
  baseConfig,
  nodeConfig,
  {
    name: 'project-overrides',
    files: ['src/**/*.js'],
    rules: {
      // Allow console logging for backend applications
      'no-console': ['warn', { allow: ['log', 'warn', 'error', 'info'] }],
      // Backend specific overrides
      'security/detect-object-injection': 'off',
    },
  },
  {
    name: 'test-files',
    files: ['**/*.test.js', '**/*.spec.js', 'tests/**/*.js'],
    rules: {
      'no-console': 'off',
      'no-undef': 'off', // Jest globals are available
    },
  },
];
