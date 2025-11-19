/**
 * Next.js ESLint Configuration Example
 * Complete setup for a Next.js project with TypeScript, React, and security checks
 */

import {
  baseConfig,
  typeScriptConfig,
  reactConfig,
  nextjsConfig,
  jestConfig,
  testingLibraryConfig,
  securityConfig,
} from '@kitiumai/lint/eslint';

export default [
  {
    ignores: [
      '.next/',
      'out/',
      'dist/',
      'build/',
      'node_modules/',
      '.git/',
      '.vscode/',
      '.idea/',
      '.env',
      '.env.local',
      '*.log',
      'coverage/',
    ],
  },
  baseConfig,
  typeScriptConfig,
  reactConfig,
  nextjsConfig,
  securityConfig,
  {
    files: ['**/*.{test,spec}.{js,ts,jsx,tsx}'],
    ...jestConfig,
  },
  {
    files: ['**/*.test.{jsx,tsx}'],
    ...testingLibraryConfig,
  },
  {
    name: 'project-overrides',
    files: ['**/*.{js,jsx,ts,tsx}'],
    rules: {
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'react/react-in-jsx-scope': 'off', // Not needed in Next.js with JSX runtime
      '@next/next/no-html-link-for-pages': 'error',
    },
  },
];
