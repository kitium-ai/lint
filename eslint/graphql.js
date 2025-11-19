/**
 * GraphQL Configuration for ESLint
 * Linting rules for GraphQL queries, mutations, and schema definitions
 * Ensures type safety and best practices in GraphQL operations
 */

import graphqlPlugin from "eslint-plugin-graphql";

export default {
  files: [
    "**/*.graphql",
    "**/*.gql",
    "**/graphql/**/*.ts",
    "**/graphql/**/*.tsx",
    "**/graphql/**/*.js",
    "**/graphql/**/*.jsx",
  ],
  plugins: {
    graphql: graphqlPlugin,
  },
  rules: {
    // Schema validation and field checking
    "graphql/no-schema-description-decorator": "off",
    "graphql/template-strings": [
      "error",
      {
        env: "apollo",
        schemaString: "schema { query: Query mutation: Mutation }",
        tagName: "gql",
      },
    ],

    // Best practices
    "graphql/no-deprecated-fields": "warn",
    "graphql/named-operations": "warn",
    "graphql/required-fields": "off",
    "graphql/no-fragment-cycles": "error",
  },
};
