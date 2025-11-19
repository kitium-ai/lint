/**
 * Testing Library Configuration for ESLint
 * Rules for React Testing Library best practices
 * Prevents common mistakes in component tests and ensures maintainability
 */

import testingLibraryPlugin from "eslint-plugin-testing-library";

export default {
  files: [
    "**/*.test.{jsx,tsx}",
    "**/*.spec.{jsx,tsx}",
    "**/tests/**/*.{jsx,tsx}",
    "**/__tests__/**/*.{jsx,tsx}",
  ],
  plugins: {
    "testing-library": testingLibraryPlugin,
  },
  rules: {
    // Accessibility and best practices
    "testing-library/prefer-screen-queries": "warn",
    "testing-library/prefer-query-by-role": "warn",
    "testing-library/no-node-access": "warn",
    "testing-library/no-container": "warn",

    // Avoid implementation details
    "testing-library/no-render-in-setup": "error",
    "testing-library/no-wait-for-empty-dom": "error",
    "testing-library/no-wait-for-multiple-assertions": "warn",

    // Async handling
    "testing-library/no-wait-for-side-effects": "warn",
    "testing-library/await-async-query": "error",
    "testing-library/await-async-utils": "error",
    "testing-library/await-fire-event": "warn",

    // User interaction best practices
    "testing-library/prefer-user-event": "warn",
    "testing-library/prefer-explicit-assert": "warn",

    // Cleanup and rendering
    "testing-library/no-unnecessary-act": "warn",

    // Debug methods
    "testing-library/no-debug": "warn",

    // Empty callbacks
    "testing-library/no-unnecessary-act": "warn",
  },
};
