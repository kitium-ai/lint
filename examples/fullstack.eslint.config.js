/**
 * Full-Stack Application ESLint Configuration Example
 * Uses the pre-built 'fullstack' shareable configuration
 * Includes all necessary rules for a complete React + Node.js application
 */

import { fullstack } from '@kitiumai/lint/configs';

export default [
  ...fullstack,
  {
    // Project-specific overrides and customizations
    files: ['**/*.{js,jsx,ts,tsx}'],
    rules: {
      // Adjust severity levels as needed for your project
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'react/prop-types': 'off', // Disabled if using TypeScript

      // Performance settings
      'react/no-unescaped-entities': 'warn',
    },
  },
  {
    // Test-specific rules
    files: ['**/*.test.{js,ts,jsx,tsx}', '**/*.spec.{js,ts,jsx,tsx}'],
    rules: {
      'jest/expect-expect': 'warn',
      '@typescript-eslint/no-explicit-any': 'off',
    },
  },
  {
    // Ignore patterns for the entire project
    ignores: [
      'node_modules',
      'dist',
      'build',
      '.next',
      'coverage',
      '.git',
      '.vscode',
      '.idea',
      '**/*.min.js',
      'public',
    ],
  },
];

/**
 * Usage:
 * 1. Install @kitiumai/lint package
 * 2. Copy this file as your eslint.config.js
 * 3. Run: npm run lint
 *
 * The 'fullstack' preset includes:
 * - Base ESLint rules
 * - TypeScript strict checking
 * - React best practices
 * - Node.js backend rules
 * - Jest testing rules
 * - Testing Library best practices
 * - Enhanced security rules
 */
