/**
 * @kitiumai/lint - Main entry point
 * Exports all available configurations for ESLint, Prettier, TypeScript, Jest, and more
 */

// ESLint Configurations
export { default as eslintAngularConfig } from './eslint/angular.js';
export { default as eslintBaseConfig } from './eslint/base.js';
export { default as eslintGraphQLConfig } from './eslint/graphql.js';
export { default as eslintJestConfig } from './eslint/jest.js';
export { default as eslintKitiumConfig } from './eslint/kitium.js';
export { createKitiumConfig } from './eslint/kitium-config.js';
export { default as eslintNextjsConfig } from './eslint/nextjs.js';
export { default as eslintNodeConfig } from './eslint/node.js';
export { createKitiumPlugin } from './eslint/plugins/kitium.js';
export { default as eslintReactConfig } from './eslint/react.js';
export { default as eslintSecurityConfig } from './eslint/security.js';
export { default as eslintSvelteConfig } from './eslint/svelte.js';
export { default as eslintTestingLibraryConfig } from './eslint/testing-library.js';
export { default as eslintTypeScriptConfig } from './eslint/typescript.js';
export { default as eslintVueConfig } from './eslint/vue.js';

// Prettier Configuration
export { default as prettierConfig } from './prettier/index.js';

// Custom Shareable Configurations
export {
  all,
  fullstack,
  graphql_api,
  library,
  minimal,
  monorepo,
  nextjs_app,
  node_api,
  react_spa,
  vue_spa,
} from './configs/index.js';

// Husky Git Hooks Configuration
export { default as huskyConfig } from './husky/index.js';

// Commitlint Configuration
export { default as commitlintConfig } from './.commitlintrc.js';
