/**
 * Custom Shareable Configurations
 * Pre-built configuration presets for specific project patterns
 * Combines multiple ESLint configs for common use cases
 */

import eslintConfigPrettier from 'eslint-config-prettier';

import base from '../eslint/base.js';
import graphql from '../eslint/graphql.js';
import jest from '../eslint/jest.js';
import kitium from '../eslint/kitium.js';
import nextjs from '../eslint/nextjs.js';
import node from '../eslint/node.js';
import react from '../eslint/react.js';
import security from '../eslint/security.js';
import testingLibrary from '../eslint/testing-library.js';
import typescript from '../eslint/typescript.js';
import vue from '../eslint/vue.js';

/**
 * Full-stack application with React and Node.js
 * Includes: Base, TypeScript, React, Jest, Testing Library, Security
 */
export const fullstack = [
  base,
  typescript,
  react,
  node,
  jest,
  testingLibrary,
  security,
  eslintConfigPrettier,
];

/**
 * Full-stack strict: adds Kitium UI/component standards for shared libraries
 */
export const fullstack_strict = [
  base,
  typescript,
  react,
  node,
  jest,
  testingLibrary,
  security,
  kitium,
  eslintConfigPrettier,
];

/**
 * React Single Page Application (SPA)
 * Includes: Base, TypeScript, React, Jest, Testing Library
 */
export const react_spa = [base, typescript, react, jest, testingLibrary, eslintConfigPrettier];

/**
 * React with Next.js Framework
 * Includes: Base, TypeScript, React, Next.js, Jest, Testing Library, Security
 */
export const nextjs_app = [
  base,
  typescript,
  react,
  nextjs,
  jest,
  testingLibrary,
  security,
  eslintConfigPrettier,
];

/**
 * Node.js Backend API
 * Includes: Base, TypeScript, Node, Jest, Security
 */
export const node_api = [base, typescript, node, jest, security, eslintConfigPrettier];

/**
 * GraphQL API Server
 * Includes: Base, TypeScript, Node, GraphQL, Jest, Security
 */
export const graphql_api = [base, typescript, node, graphql, jest, security, eslintConfigPrettier];

/**
 * Vue.js Single Page Application
 * Includes: Base, TypeScript, Vue, Jest
 */
export const vue_spa = [base, typescript, vue, jest, eslintConfigPrettier];

/**
 * Monorepo with multiple packages
 * Includes: Base, TypeScript, Jest, Security
 */
export const monorepo = [base, typescript, jest, security, eslintConfigPrettier];

/**
 * Library/Package development
 * Includes: Base, TypeScript, Jest, Security
 */
export const library = [
  base,
  typescript,
  jest,
  security,
  {
    name: 'kitium/library-overrides',
    rules: {
      '@typescript-eslint/explicit-module-boundary-types': 'error',
    },
  },
  eslintConfigPrettier,
];

/**
 * Minimal configuration (JS only, no TypeScript)
 * Includes: Base only
 */
export const minimal = [base, eslintConfigPrettier];

/**
 * Everything enabled (all rules)
 * Includes: All configurations
 */
export const all = [
  base,
  typescript,
  react,
  node,
  jest,
  testingLibrary,
  graphql,
  vue,
  nextjs,
  security,
  eslintConfigPrettier,
];

export default {
  fullstack,
  fullstack_strict,
  react_spa,
  nextjs_app,
  node_api,
  graphql_api,
  vue_spa,
  monorepo,
  library,
  minimal,
  all,
};
