/**
 * Vue.js Configuration for ESLint
 * Linting rules for Vue.js 3 components and single-file components (SFC)
 * Enforces Vue best practices, accessibility, and component patterns
 *
 * NOTE: This configuration requires the optional package:
 * - eslint-plugin-vue
 *
 * Install with: npm install eslint-plugin-vue
 */

let vuePlugin;
let hasVuePlugin = false;

// Try to load optional Vue plugin
try {
  const mod = await import("eslint-plugin-vue").catch(() => null);
  if (mod) {
    vuePlugin = mod.default;
    hasVuePlugin = true;
  }
} catch (_error) {
  // eslint-plugin-vue is not installed - this is optional
}

const createVueConfig = () => {
  const baseConfig = {
    files: ["**/*.vue", "**/*.vue.js", "**/*.vue.ts"],
    languageOptions: {
      parserOptions: {
        parser: "@typescript-eslint/parser",
        ecmaVersion: "latest",
        sourceType: "module",
      },
    },
    rules: {},
  };

  if (hasVuePlugin) {
    return {
      ...baseConfig,
      plugins: {
        vue: vuePlugin,
      },
      rules: {
        // Vue specific rules
        "vue/multi-word-component-names": "warn",
        "vue/require-default-prop": "warn",
        "vue/require-explicit-emits": "error",
        "vue/no-setup-props-destructure": "error",
        "vue/no-mutating-props": "error",
        "vue/no-use-v-if-with-v-for": "error",
        "vue/order-in-components": "warn",
        "vue/this-in-template": ["error", "never"],

        // Component best practices
        "vue/prefer-template": "warn",
        "vue/html-indent": ["error", 2],
        "vue/max-attributes-per-line": ["warn", { singleline: 3, multiline: 1 }],
        "vue/no-empty-component-block": "warn",
        "vue/component-definition-name-casing": ["error", "PascalCase"],

        // Lifecycle hooks
        "vue/no-lifecycle-after-await": "error",
        "vue/use-v-on-exact": "warn",

        // Accessibility
        "vue/click-events-have-key-events": "warn",
        "vue/no-static-inline-styles": "warn",

        // Performance and security
        "vue/no-v-html": "warn",
        "vue/require-name-at-root": "warn",

        // Script setup composition API
        "vue/script-setup-uses-vars": "error",
      },
    };
  }

  return baseConfig;
};

export default createVueConfig();
