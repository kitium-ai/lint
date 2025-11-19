/**
 * Jest Configuration for ESLint
 * Linting rules and configuration for Jest test files
 * Supports: Node.js, React components, and other test environments
 */

import jestPlugin from "eslint-plugin-jest";

export default {
  files: [
    "**/*.test.js",
    "**/*.test.ts",
    "**/*.test.jsx",
    "**/*.test.tsx",
    "**/*.spec.js",
    "**/*.spec.ts",
    "**/*.spec.jsx",
    "**/*.spec.tsx",
    "**/tests/**/*.js",
    "**/tests/**/*.ts",
    "**/tests/**/*.jsx",
    "**/tests/**/*.tsx",
  ],
  languageOptions: {
    globals: {
      describe: "readonly",
      it: "readonly",
      test: "readonly",
      expect: "readonly",
      beforeEach: "readonly",
      afterEach: "readonly",
      beforeAll: "readonly",
      afterAll: "readonly",
      jest: "readonly",
    },
  },
  plugins: {
    jest: jestPlugin,
  },
  rules: {
    // Jest plugin rules
    "jest/no-disabled-tests": "warn",
    "jest/no-focused-tests": "error",
    "jest/no-identical-title": "error",
    "jest/prefer-to-be": "warn",
    "jest/prefer-to-have-length": "warn",
    "jest/valid-expect": "error",
    "jest/valid-expect-in-promise": "error",
    "jest/expect-expect": "warn",
    "jest/no-conditional-expect": "error",
    "jest/no-test-return-statement": "warn",
    "jest/prefer-spy-on": "warn",
    "jest/prefer-strict-equal": "warn",
    "jest/no-large-snapshots": ["warn", { maxSize: 50 }],
    "jest/no-test-prefixes": "error",
    "jest/prefer-mock-promise-shorthand": "warn",
    "jest/no-untyped-mock-factory": "warn",

    // Disable rules that interfere with tests
    "no-unused-vars": "off",
    "@typescript-eslint/no-unused-vars": "off",
    "no-undef": "off",
    "prefer-const": "warn",

    // Allow testing assertions in test files
    "no-throw-literal": "warn",
  },
};
