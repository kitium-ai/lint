/**
 * GraphQL Configuration for ESLint
 * Linting rules for GraphQL queries, mutations, and schema definitions
 * Ensures type safety and best practices in GraphQL operations
 *
 * NOTE: This configuration is optional and only works if eslint-plugin-graphql is installed.
 * To use GraphQL linting, install it with: npm install eslint-plugin-graphql
 */

import { loadOptionalPlugin } from './utils/load-optional-plugin.js';

const { plugin: graphqlPlugin, available: hasGraphQLPlugin } =
  await loadOptionalPlugin('eslint-plugin-graphql');

// Create the configuration
const graphqlConfig = hasGraphQLPlugin
  ? {
      files: [
        '**/*.graphql',
        '**/*.gql',
        '**/graphql/**/*.ts',
        '**/graphql/**/*.tsx',
        '**/graphql/**/*.js',
        '**/graphql/**/*.jsx',
      ],
      plugins: {
        graphql: graphqlPlugin,
      },
      rules: {
        // Schema validation and field checking
        'graphql/no-schema-description-decorator': 'off',
        'graphql/template-strings': [
          'error',
          {
            env: 'apollo',
            schemaString: 'schema { query: Query mutation: Mutation }',
            tagName: 'gql',
          },
        ],

        // Best practices
        'graphql/no-deprecated-fields': 'warn',
        'graphql/named-operations': 'warn',
        'graphql/required-fields': 'off',
        'graphql/no-fragment-cycles': 'error',
      },
    }
  : {
      // Minimal config when plugin is not available - won't apply any rules
      files: [
        '**/*.graphql',
        '**/*.gql',
        '**/graphql/**/*.ts',
        '**/graphql/**/*.tsx',
        '**/graphql/**/*.js',
        '**/graphql/**/*.jsx',
      ],
      rules: {},
    };

export default graphqlConfig;
