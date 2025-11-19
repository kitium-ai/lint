/**
 * Example ESLint Configuration for React Application
 * Use this as a template for React + TypeScript applications
 */

import { baseConfig, reactConfig, typeScriptConfig } from '@kitiumai/lint/eslint';

export default [
  {
    ignores: ['node_modules/', 'dist/', 'build/', '.next/', '.env', '.env.local', 'coverage/'],
  },
  baseConfig,
  reactConfig,
  typeScriptConfig,
  {
    name: 'project-overrides',
    files: ['src/**/*.{ts,tsx}'],
    rules: {
      // Add project-specific rule overrides here
      // Example: disable prop-types if using TypeScript
      'react/prop-types': 'off',
    },
  },
];
