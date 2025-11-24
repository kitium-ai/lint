/**
 * Enhanced Security Configuration for ESLint
 * Builds on the shared @kitiumai/config security preset and layers on
 * SonarJS + Node hardening rules to match enterprise expectations.
 */
import sharedSecurityConfig from '@kitiumai/config/eslint.config.security.js';
import nodePlugin from 'eslint-plugin-n';
import noUnsanitizedPlugin from 'eslint-plugin-no-unsanitized';
import sonarjsPlugin from 'eslint-plugin-sonarjs';

const upstreamSecurity =
  sharedSecurityConfig.find((config) => config.name === 'kitiumai/security-hardening') ??
  sharedSecurityConfig.at(-1) ??
  {};

export default {
  ...upstreamSecurity,
  files: upstreamSecurity.files ?? ['**/*.{js,jsx,ts,tsx,mjs,cjs}'],
  plugins: {
    ...(upstreamSecurity.plugins ?? {}),
    sonarjs: sonarjsPlugin,
    node: nodePlugin,
    'no-unsanitized': noUnsanitizedPlugin,
  },
  rules: {
    ...(upstreamSecurity.rules ?? {}),
    // SonarJS - Code quality and security
    'sonarjs/no-duplicate-string': 'warn',
    'sonarjs/no-duplicated-branches': 'warn',
    'sonarjs/no-identical-expressions': 'error',
    'sonarjs/no-inverted-boolean-check': 'warn',
    'sonarjs/no-nested-template-literals': 'warn',
    'sonarjs/no-redundant-boolean': 'warn',
    'sonarjs/no-same-line-conditional': 'warn',
    'sonarjs/prefer-object-literal': 'warn',
    'sonarjs/prefer-single-boolean-return': 'warn',
    'sonarjs/cognitive-complexity': ['warn', 15],
    'sonarjs/max-switch-cases': ['warn', 40],

    // Node.js security
    'node/handle-callback-err': 'warn',
    'node/no-new-require': 'error',
    'node/no-path-concat': 'error',
    'node/no-deprecated-api': 'warn',

    // No unsanitized - XSS prevention (left off by default, opt-in)
    'no-unsanitized/method': 'off',
    'no-unsanitized/property': 'off',

    // Additional safeguards
    'no-script-url': 'error',
    'require-await': 'warn',
    'no-promise-executor-return': 'error',
  },
};
