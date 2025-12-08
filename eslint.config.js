/**
 * ESLint configuration for @kitiumai/lint package itself
 * Ensures this package adheres to the same rules we ship to consumers,
 * while relaxing internal-only patterns (e.g., relative imports in config files).
 */

import baseConfig from '@kitiumai/config/eslint.config.base.js';

import { eslintBaseConfig, eslintNodeConfig, eslintTypeScriptConfig } from './index.js';

export default [
  ...baseConfig,
  ...eslintBaseConfig,
  ...eslintTypeScriptConfig,
  ...eslintNodeConfig,
  {
    languageOptions: {
      globals: {
        console: 'readonly',
        process: 'readonly',
        __dirname: 'readonly',
        __filename: 'readonly',
      },
    },
  },
  {
    files: ['**/*'],
    rules: {
      'no-restricted-imports': 'off',
      '@typescript-eslint/naming-convention': 'off',
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
      '@typescript-eslint/no-require-imports': 'off',
    },
  },
  {
    files: ['scripts/**/*.js'],
    rules: {
      eqeqeq: 'off',
      'max-statements': 'off',
    },
  },
  {
    files: ['eslint/plugins/**/*.js'],
    rules: {
      'max-lines-per-function': 'off',
      'security/detect-unsafe-regex': 'off',
    },
  },
  {
    files: ['.prettierrc.cjs'],
    rules: {
      'no-restricted-syntax': 'off',
    },
  },
  {
    files: [
      '**/*.config.{js,cjs,ts}',
      '.commitlintrc.js',
      '.prettierrc.cjs',
      '.eslintrc.js',
      'eslint.config.security.js',
      'prettier/index.js',
      'jest/index.js',
      'husky/index.js',
      'configs/index.js',
      'test/**/*.js',
      'eslint/**/*.js',
      'eslint/plugins/**/*.js',
    ],
    rules: {
      'import/no-default-export': 'off',
      'import/no-relative-parent-imports': 'off',
    },
  },
  {
    ignores: ['node_modules/**', 'dist/**', 'coverage/**', '*.min.js', 'examples/**', '*.d.ts'],
  },
];
