/**
 * ESLint configuration for @kitiumai/lint package itself
 * Ensures this package adheres to the same rules we ship to consumers,
 * while relaxing internal-only patterns (e.g., relative imports in config files).
 */

import {
  eslintBaseConfig,
  eslintNodeConfig,
  eslintTypeScriptConfig,
} from "./index.js";

export default [
  ...eslintBaseConfig,
  ...eslintTypeScriptConfig,
  ...eslintNodeConfig,
  {
    languageOptions: {
      globals: {
        console: "readonly",
        process: "readonly",
        __dirname: "readonly",
        __filename: "readonly",
      },
    },
  },
  {
    files: ["**/*"],
    rules: {
      "no-restricted-imports": "off",
      "@typescript-eslint/naming-convention": "off",
      "@typescript-eslint/explicit-function-return-type": "off",
      "@typescript-eslint/no-unused-vars": "off",
      "@typescript-eslint/no-require-imports": "off",
    },
  },
  {
    files: ["scripts/**/*.js"],
    rules: {
      eqeqeq: "off",
      "max-statements": "off",
    },
  },
  {
    ignores: [
      "node_modules/**",
      "dist/**",
      "coverage/**",
      "*.min.js",
      "examples/**",
    ],
  },
];
