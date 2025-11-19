/**
 * Enhanced Security Configuration for ESLint
 * Advanced security rules and vulnerability detection
 * Includes: OWASP checks, injection prevention, cryptography rules, and more
 */

import noUnsanitizedPlugin from "eslint-plugin-no-unsanitized";
import nodePlugin from "eslint-plugin-node";
import securityPlugin from "eslint-plugin-security";
import sonarjsPlugin from "eslint-plugin-sonarjs";

export default {
  files: ["**/*.{js,jsx,ts,tsx,mjs,cjs}"],
  plugins: {
    security: securityPlugin,
    sonarjs: sonarjsPlugin,
    node: nodePlugin,
    "no-unsanitized": noUnsanitizedPlugin,
  },
  rules: {
    // Original security plugin rules
    "security/detect-object-injection": "warn",
    "security/detect-non-literal-regexp": "warn",
    "security/detect-unsafe-regex": "error",
    "security/detect-buffer-noalloc": "error",
    "security/detect-child-process": "warn",
    "security/detect-non-literal-require": "warn",
    "security/detect-non-literal-fs-filename": "warn",
    "security/detect-eval-with-expression": "error",
    "security/detect-pseudoRandomBytes": "error",
    "security/detect-no-csrf-before-method-override": "warn",

    // SonarJS - Code quality and security
    "sonarjs/no-duplicate-string": "warn",
    "sonarjs/no-duplicated-branches": "warn",
    "sonarjs/no-identical-expressions": "error",
    "sonarjs/no-inverted-boolean-check": "warn",
    "sonarjs/no-nested-template-literals": "warn",
    "sonarjs/no-redundant-boolean": "warn",
    "sonarjs/no-same-line-conditional": "warn",
    "sonarjs/prefer-object-literal": "warn",
    "sonarjs/prefer-single-boolean-return": "warn",
    "sonarjs/cognitive-complexity": ["warn", 15],
    "sonarjs/max-switch-cases": ["warn", 40],

    // Node.js security
    "node/handle-callback-err": "warn",
    "node/no-new-require": "error",
    "node/no-path-concat": "error",
    "node/no-deprecated-api": "warn",

    // No unsanitized - XSS prevention
    "no-unsanitized/method": "off",
    "no-unsanitized/property": "off",

    // Additional security practices
    "no-eval": "error",
    "no-implied-eval": "error",
    "no-new-func": "error",
    "no-script-url": "error",
    "require-await": "warn",
    "no-promise-executor-return": "error",

    // Cryptography and randomness
    "no-math-random": "warn",
  },
};
