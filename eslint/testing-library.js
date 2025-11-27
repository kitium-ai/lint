/**
 * Testing Library Configuration for ESLint
 * Rules for React Testing Library best practices
 * Prevents common mistakes in component tests and ensures maintainability
 *
 * NOTE: This configuration requires the optional package:
 * - eslint-plugin-testing-library
 *
 * Install with: npm install eslint-plugin-testing-library
 */

let testingLibraryPlugin;
let hasTestingLibraryPlugin = false;

// Try to load optional Testing Library plugin
try {
  const module_ = await import("eslint-plugin-testing-library").catch(
    () => null,
  );
  if (module_) {
    testingLibraryPlugin = module_.default;
    hasTestingLibraryPlugin = true;
  }
} catch (_error) {
  // eslint-plugin-testing-library is not installed - this is optional
}

const createTestingLibraryConfig = () => {
  const baseConfig = {
    files: [
      "**/*.test.{jsx,tsx}",
      "**/*.spec.{jsx,tsx}",
      "**/tests/**/*.{jsx,tsx}",
      "**/__tests__/**/*.{jsx,tsx}",
    ],
    rules: {},
  };

  if (hasTestingLibraryPlugin) {
    return {
      ...baseConfig,
      plugins: {
        "testing-library": testingLibraryPlugin,
      },
      rules: {
        // Accessibility and best practices
        "testing-library/prefer-screen-queries": "warn",
        "testing-library/prefer-query-by-role": "warn",
        "testing-library/no-node-access": "warn",
        "testing-library/no-container": "warn",
        "testing-library/prefer-presence-queries": "warn",
        "testing-library/prefer-find-by": "warn",

        // Avoid implementation details
        "testing-library/no-render-in-setup": "error",
        "testing-library/no-wait-for-empty-dom": "error",
        "testing-library/no-wait-for-multiple-assertions": "warn",
        "testing-library/render-result-naming-convention": "warn",
        "testing-library/no-promise-in-fire-event": "error",
        "testing-library/no-await-sync-query": "error",
        "testing-library/no-await-sync-events": "error",

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
      },
    };
  }

  return baseConfig;
};

export default createTestingLibraryConfig();
