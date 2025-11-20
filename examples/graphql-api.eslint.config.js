/**
 * GraphQL API ESLint Configuration Example
 * Setup for a GraphQL server with Node.js and TypeScript
 */

import {
  baseConfig,
  typeScriptConfig,
  nodeConfig,
  graphqlConfig,
  jestConfig,
  securityConfig,
} from '@kitiumai/lint/eslint';

export default [
  {
    ignores: [
      'dist/',
      'build/',
      'node_modules/',
      '.git/',
      'coverage/',
      'schema.graphql',
      'generated/',
      '.env',
      '.env.local',
      '*.log',
    ],
  },
  ...baseConfig,
  ...typeScriptConfig,
  ...nodeConfig,
  ...graphqlConfig,
  securityConfig,
  {
    files: ['**/*.test.{ts,js}'],
    ...jestConfig,
  },
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
    name: 'server-code-rules',
    files: ['src/**/*.ts', 'src/**/*.js'],
    rules: {
      'no-console': ['warn', { allow: ['warn', 'error', 'info'] }],
      'node/no-unpublished-import': 'warn',
    },
  },
];
