/**
 * ESLint Configuration for Svelte Applications
 * Includes Svelte-specific linting rules and TypeScript support
 */

export default [
  {
    name: "svelte-base",
    files: ["**/*.svelte"],
    languageOptions: {
      parserOptions: {
        parser: "@typescript-eslint/parser",
        ecmaVersion: 2020,
        sourceType: "module",
        extraFileExtensions: [".svelte"],
      },
    },
    rules: {
      // Svelte-specific best practices
      "svelte/block-lang": [
        "warn",
        {
          script: "ts",
          style: "scss",
        },
      ],
      "svelte/no-at-debug-tags": "warn",
      "svelte/no-at-html-tags": "error",
      "svelte/valid-compile": "warn",
      "svelte/no-unused-svelte-ignore": "warn",
      "svelte/system": "error",
      "svelte/no-inner-declarations": "error",

      // Code style
      "svelte/indent": [
        "warn",
        {
          indent: 2,
          ignoredNodes: [],
          switchCase: 1,
        },
      ],
      "svelte/shorthand": [
        "warn",
        {
          attribute: true,
          boolean: "always",
          eventHandler: true,
          directive: true,
        },
      ],
      "svelte/prefer-style-directive": "warn",
    },
  },
  {
    name: "svelte-scripts",
    files: ["**/*.svelte"],
    languageOptions: {
      parser: "@typescript-eslint/parser",
      parserOptions: {
        ecmaVersion: 2020,
        sourceType: "module",
        project: ["tsconfig.json", "tsconfig.*.json"],
      },
    },
    rules: {
      // TypeScript rules for Svelte scripts
      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          argsIgnorePattern: "^_",
        },
      ],
    },
  },
];
