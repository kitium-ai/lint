/**
 * Example ESLint Configuration for React Application
 * Use this as a template for React + TypeScript applications
 */

import { eslintReactConfig, eslintTypeScriptConfig } from '@kitium-ai/lint';

export default [
  ...eslintReactConfig,
  ...eslintTypeScriptConfig,
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
