/**
 * GraphQL API ESLint Configuration Example
 * Setup for a GraphQL server with Node.js and TypeScript
 */

import {
  eslintBaseConfig,
  eslintTypeScriptConfig,
  eslintNodeConfig,
  eslintGraphQLConfig,
  eslintJestConfig,
  eslintSecurityConfig,
} from '@kitium-ai/lint';

export default [
  eslintBaseConfig,
  eslintTypeScriptConfig,
  eslintNodeConfig,
  eslintGraphQLConfig,
  {
    files: ['**/*.test.{ts,js}'],
    ...eslintJestConfig,
  },
  eslintSecurityConfig,
  {
    // GraphQL-specific overrides
    files: ['**/*.{graphql,gql}', 'src/**/*.graphql.ts'],
    rules: {
      'graphql/template-strings': [
        'error',
        {
          env: 'apollo',
          tagName: 'gql',
        },
      ],
    },
  },
  {
    // Server code rules
    files: ['src/**/*.ts', 'src/**/*.js'],
    rules: {
      'no-console': ['warn', { allow: ['warn', 'error', 'info'] }],
      'node/no-unpublished-import': 'warn',
    },
  },
  {
    // Ignore patterns
    ignores: [
      'dist',
      'build',
      'node_modules',
      '.git',
      'coverage',
      'schema.graphql',
      'generated',
    ],
  },
];
