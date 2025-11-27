/**
 * ESLint React Configuration
 * Configuration for React applications
 * Includes React best practices and hooks rules
 *
 * NOTE: This configuration requires the following optional packages:
 * - eslint-plugin-react
 * - eslint-plugin-react-hooks
 * - eslint-plugin-jsx-a11y
 *
 * Install with: npm install eslint-plugin-react eslint-plugin-react-hooks eslint-plugin-jsx-a11y
 */

import baseConfig from './base.js';

let reactPlugin;
let reactHooksPlugin;
let jsxA11yPlugin;
let hasReactPlugins = false;

// Try to load optional React plugins
try {
  const mod1 = await import('eslint-plugin-react').catch(() => null);
  const mod2 = await import('eslint-plugin-react-hooks').catch(() => null);
  const mod3 = await import('eslint-plugin-jsx-a11y').catch(() => null);

  if (mod1 && mod2 && mod3) {
    reactPlugin = mod1.default;
    reactHooksPlugin = mod2.default;
    jsxA11yPlugin = mod3.default;
    hasReactPlugins = true;
  }
} catch (_error) {
  // React plugins not installed - this is optional
}

// eslint-disable-next-line max-lines-per-function
const createReactConfig = () => {
  const baseReactConfig = {
    name: 'kitium/react',
    files: ['**/*.{jsx,tsx}'],
    languageOptions: {
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    rules: {},
  };

  if (hasReactPlugins) {
    return [
      ...baseConfig,
      {
        ...baseReactConfig,
        plugins: {
          react: reactPlugin,
          'react-hooks': reactHooksPlugin,
          'jsx-a11y': jsxA11yPlugin,
        },
        settings: {
          react: {
            version: 'detect',
          },
        },
        rules: {
          // React specific rules
          'react/boolean-prop-naming': ['error', { validateNested: true }],
          'react/button-has-type': 'error',
          'react/default-props-match-prop-types': 'error',
          'react/destructuring-assignment': ['error', 'always'],
          'react/display-name': 'warn',
          'react/forbid-component-props': ['error', { forbid: ['className'] }],
          'react/forbid-dom-props': ['error', { forbid: ['className'] }],
          'react/forbid-prop-types': ['error', { forbid: ['any', 'array', 'object'] }],
          'react/forbid-foreign-prop-types': 'warn',
          'react/function-component-definition': [
            'error',
            {
              namedComponents: 'function-declaration',
              unnamedComponents: 'arrow-function',
            },
          ],
          'react/hook-use-state': 'error',
          'react/iframe-missing-sandbox': 'error',
          'react/no-access-state-in-setstate': 'error',
          'react/no-adjacent-inline-elements': 'error',
          'react/no-array-index-key': 'warn',
          'react/no-children-prop': 'error',
          'react/no-danger': 'warn',
          'react/no-danger-with-children': 'error',
          'react/no-deprecated': 'error',
          'react/no-did-mount-set-state': 'error',
          'react/no-did-update-set-state': 'error',
          'react/no-direct-mutation-state': 'error',
          'react/no-find-dom-node': 'error',
          'react/no-invalid-html-attribute': 'error',
          'react/no-is-mounted': 'error',
          'react/no-multi-comp': 'error',
          'react/no-render-return-value': 'error',
          'react/no-set-state': 'off',
          'react/no-string-refs': 'error',
          'react/no-this-in-sfc': 'error',
          'react/no-unescaped-entities': 'error',
          'react/no-unstable-nested-components': ['error', { allowAsProps: false }],
          'react/no-unused-class-component-methods': 'error',
          'react/no-unused-prop-types': 'error',
          'react/no-unused-state': 'error',
          'react/prefer-es6-class': ['error', 'always'],
          'react/prefer-read-only-props': 'warn',
          'react/prefer-stateless-function': 'error',
          'react/prop-types': 'error',
          'react/react-in-jsx-scope': 'off',
          'react/require-default-props': 'error',
          'react/require-optimization': 'off',
          'react/require-render-return': 'error',
          'react/self-closing-comp': 'error',
          'react/sort-comp': 'error',
          'react/sort-prop-types': 'error',
          'react/state-in-constructor': ['error', 'always'],
          'react/static-property-placement': ['error', 'static public field'],
          'react/void-dom-elements-no-children': 'error',
          'react/jsx-no-leaked-render': ['warn', { validStrategies: ['ternary', 'coerce'] }],

          // React Hooks
          'react-hooks/rules-of-hooks': 'error',
          'react-hooks/exhaustive-deps': 'warn',

          // JSX A11y
          'jsx-a11y/anchor-has-content': 'error',
          'jsx-a11y/anchor-is-valid': 'error',
          'jsx-a11y/aria-activedescendant-has-tabindex': 'error',
          'jsx-a11y/aria-props': 'error',
          'jsx-a11y/aria-proptypes': 'error',
          'jsx-a11y/aria-role': 'error',
          'jsx-a11y/aria-unsupported-elements': 'error',
          'jsx-a11y/alt-text': 'error',
          'jsx-a11y/click-events-have-key-events': 'error',
          'jsx-a11y/heading-has-content': 'error',
          'jsx-a11y/html-has-lang': 'error',
          'jsx-a11y/iframe-has-title': 'error',
          'jsx-a11y/img-redundant-alt': 'error',
          'jsx-a11y/interactive-supports-focus': 'error',
          'jsx-a11y/label-has-associated-control': 'error',
          'jsx-a11y/media-has-caption': 'error',
          'jsx-a11y/mouse-events-have-key-events': 'error',
          'jsx-a11y/no-access-key': 'error',
          'jsx-a11y/no-autofocus': 'error',
          'jsx-a11y/no-distracting-elements': 'error',
          'jsx-a11y/no-interactive-element-to-noninteractive-role': 'error',
          'jsx-a11y/no-noninteractive-element-interactions': 'error',
          'jsx-a11y/no-noninteractive-element-to-interactive-role': 'error',
          'jsx-a11y/no-noninteractive-tabindex': 'error',
          'jsx-a11y/no-redundant-roles': 'error',
          'jsx-a11y/no-static-element-interactions': 'error',
          'jsx-a11y/no-aria-hidden-on-focusable': 'error',
          'jsx-a11y/prefer-tag-over-role': 'warn',
          'jsx-a11y/tabindex-no-positive': 'error',
          'jsx-a11y/role-has-required-aria-props': 'error',
          'jsx-a11y/role-supports-aria-props': 'error',
          'jsx-a11y/scope': 'error',
        },
      },
    ];
  }

  // Return minimal config when plugins not available
  return [...baseConfig, baseReactConfig];
};

export default createReactConfig();
