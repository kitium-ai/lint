/**
 * ESLint configuration for @kitiumai/lint package itself
 * Uses the package's own configurations
 */
import { eslintBaseConfig, eslintNodeConfig, eslintTypeScriptConfig } from './index.js';

export default [
  ...eslintBaseConfig,
  ...eslintTypeScriptConfig,
  ...eslintNodeConfig,
  {
    ignores: ['node_modules/**', 'dist/**', 'coverage/**', '*.min.js', 'examples/**'],
  },
];
