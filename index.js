/**
 * @kitium-ai/lint - Main entry point
 * Exports all available configurations for ESLint, Prettier, TypeScript, Jest, and more
 */

// ESLint Configurations
export { default as eslintBaseConfig } from './eslint/base.js';
export { default as eslintReactConfig } from './eslint/react.js';
export { default as eslintNodeConfig } from './eslint/node.js';
export { default as eslintTypeScriptConfig } from './eslint/typescript.js';
export { default as eslintJestConfig } from './eslint/jest.js';
export { default as eslintTestingLibraryConfig } from './eslint/testing-library.js';
export { default as eslintGraphQLConfig } from './eslint/graphql.js';
export { default as eslintVueConfig } from './eslint/vue.js';
export { default as eslintNextjsConfig } from './eslint/nextjs.js';
export { default as eslintSecurityConfig } from './eslint/security.js';

// Prettier Configuration
export { default as prettierConfig } from './prettier/index.js';

// Custom Shareable Configurations
export {
  fullstack,
  react_spa,
  nextjs_app,
  node_api,
  graphql_api,
  vue_spa,
  monorepo,
  library,
  minimal,
  all,
} from './configs/index.js';

// Husky Git Hooks Configuration
export { default as huskyConfig } from './husky/index.js';
