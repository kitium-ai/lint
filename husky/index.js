/**
 * Husky Git Hooks Configuration
 * Setup and configuration for pre-commit and pre-push hooks
 * Ensures code quality before commits and prevents issues in CI/CD
 */

const config = {
  /**
   * Pre-commit hook configuration
   * Runs linting and formatting checks on staged files
   */
  hooks: {
    "pre-commit": "pnpm lint:fix && pnpm format:fix && lint-staged",
    "pre-push": "pnpm verify",
  },

  /**
   * Lint-staged configuration
   * Runs specific linters on staged files
   */
  "lint-staged": {
    "*.{js,jsx,ts,tsx,mjs,cjs}": ["eslint --fix", "prettier --write"],
    "*.{json,yml,yaml,md,mdx}": ["prettier --write"],
    "*.vue": ["eslint --fix", "prettier --write"],
    "*.graphql": ["eslint --fix", "prettier --write"],
  },

  /**
   * Commit message validation
   * Ensures conventional commits format
   */
  commitMessage: {
    types: [
      "feat",
      "fix",
      "docs",
      "style",
      "refactor",
      "perf",
      "test",
      "chore",
      "ci",
      "revert",
    ],
    scopes: [
      "eslint",
      "prettier",
      "tsconfig",
      "jest",
      "testing-library",
      "graphql",
      "vue",
      "nextjs",
      "security",
      "husky",
    ],
  },
};

export default config;
