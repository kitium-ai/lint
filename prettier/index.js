/**
 * Prettier Configuration
 * Enterprise-ready code formatting configuration
 * Opinionated, consistent formatting across all project types
 */

export default {
  // Spacing
  printWidth: 100,
  tabWidth: 2,
  useTabs: false,
  semi: true,
  singleQuote: true,
  quoteProps: "as-needed",
  jsxSingleQuote: false,
  trailingComma: "all",
  bracketSpacing: true,
  bracketSameLine: false,
  arrowParens: "always",
  requirePragma: false,
  insertPragma: false,
  proseWrap: "preserve",

  // HTML
  htmlWhitespaceSensitivity: "css",

  // Vue
  vueIndentScriptAndStyle: false,

  // Embedded
  embeddedLanguageFormatting: "auto",

  // Markdown
  markdownObjectCurlyNewline: true,

  // Plugins
  plugins: [],

  // Overrides for specific file types
  overrides: [
    {
      files: "*.json",
      options: {
        parser: "json",
      },
    },
    {
      files: "*.yaml",
      options: {
        parser: "yaml",
      },
    },
    {
      files: "*.md",
      options: {
        parser: "markdown",
        proseWrap: "always",
      },
    },
    {
      files: "*.mdx",
      options: {
        parser: "mdx",
      },
    },
  ],
};
