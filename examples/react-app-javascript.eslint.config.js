/**
 * Example ESLint Configuration for React Application (JavaScript)
 * Use this as a template for React (without TypeScript) applications
 */

import { baseConfig, reactConfig } from '@kitiumai/lint/eslint';

export default [
  {
    ignores: ['node_modules/', 'dist/', 'build/', '.next/', '.env', '.env.local', 'coverage/'],
  },
  ...baseConfig,
  ...reactConfig,
  {
    name: 'project-overrides',
    files: ['src/**/*.{js,jsx}'],
    rules: {
      // Add project-specific rule overrides here
      'react/prop-types': 'warn', // Useful for JS projects without TypeScript
    },
  },
];
