/**
 * Next.js ESLint Configuration Example
 * Complete setup for a Next.js project with TypeScript, React, and security checks
 */

import {
  eslintBaseConfig,
  eslintTypeScriptConfig,
  eslintReactConfig,
  eslintNextjsConfig,
  eslintJestConfig,
  eslintTestingLibraryConfig,
  eslintSecurityConfig,
} from '@kitiumai/lint';

export default [
  eslintBaseConfig,
  eslintTypeScriptConfig,
  eslintReactConfig,
  eslintNextjsConfig,
  {
    files: ['**/*.{test,spec}.{js,ts,jsx,tsx}'],
    ...eslintJestConfig,
  },
  {
    files: ['**/*.test.{jsx,tsx}'],
    ...eslintTestingLibraryConfig,
  },
  eslintSecurityConfig,
  {
    // Project-specific overrides
    files: ['**/*.{js,jsx,ts,tsx}'],
    rules: {
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'react/react-in-jsx-scope': 'off', // Not needed in Next.js with JSX runtime
      '@next/next/no-html-link-for-pages': 'error',
    },
  },
  {
    // Ignore patterns
    ignores: ['.next', 'out', 'dist', 'build', 'node_modules', '.git', '.vscode', '.idea'],
  },
];
