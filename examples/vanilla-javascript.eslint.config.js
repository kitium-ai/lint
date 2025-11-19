/**
 * Example ESLint Configuration for Vanilla JavaScript Projects
 * Use this as a template for pure JavaScript projects without TypeScript
 */

import { baseConfig } from '@kitiumai/lint/eslint';

export default [
  {
    ignores: [
      'node_modules/',
      'dist/',
      'build/',
      '.next/',
      'out/',
      '.venv/',
      'venv/',
      '.env',
      '.env.local',
      '.env.*.local',
      '*.log',
      '.DS_Store',
      '.cache',
      '.turbo',
      'coverage/',
    ],
  },
  ...baseConfig,
  {
    name: 'project-overrides',
    files: ['**/*.js'],
    rules: {
      // Add your project-specific rule overrides here
    },
  },
];
