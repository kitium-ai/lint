# Framework Selection & Plugin Dependencies Map

This document outlines which ESLint plugins are installed and used for each framework/preset selection in the `@kitiumai/lint` package.

## Core Dependencies (Always Installed)

These are shared dependencies required across most configurations:

| Plugin                             | Version | Purpose                           | Used By                                          |
| ---------------------------------- | ------- | --------------------------------- | ------------------------------------------------ |
| `@typescript-eslint/eslint-plugin` | ^8.0.0  | TypeScript linting rules          | TypeScript, React, Vue, Next.js, Angular, Svelte |
| `@typescript-eslint/parser`        | ^8.0.0  | TypeScript parser for ESLint      | TypeScript, React, Vue, Next.js, Angular, Svelte |
| `eslint-config-prettier`           | ^9.1.0  | Disables conflicting ESLint rules | All configs                                      |
| `eslint-plugin-import`             | ^2.30.0 | Import/export linting             | Node.js, Security                                |
| `eslint-plugin-security`           | ^3.0.0  | Security vulnerability detection  | Node.js, Security                                |
| `eslint-plugin-simple-import-sort` | ^12.0.0 | Import sorting                    | Node.js                                          |
| `eslint-plugin-sonarjs`            | ^1.0.0  | Code quality & security           | Security                                         |
| `eslint-plugin-n`                  | ^17.0.0 | Node.js specific rules            | Security                                         |
| `eslint-plugin-no-unsanitized`     | ^4.1.0  | XSS prevention                    | Security                                         |
| `prettier`                         | ^3.4.0  | Code formatter                    | All configs                                      |
| `husky`                            | ^9.0.0  | Git hooks manager                 | All configs                                      |

## Framework-Specific Dependencies

### 1. **Vanilla TypeScript / JavaScript**

```
Configuration: eslint/base.js + eslint/typescript.js
```

**Required Plugins:**

- ✅ @typescript-eslint/eslint-plugin
- ✅ @typescript-eslint/parser

**Optional Plugins:** None

**Usage:**

```javascript
import { eslintBaseConfig, eslintTypeScriptConfig } from '@kitiumai/lint';
// or for presets:
import { minimal } from '@kitiumai/lint/configs';
```

---

### 2. **React / React with TypeScript**

```
Configuration: eslint/base.js + eslint/typescript.js + eslint/react.js
```

**Required Plugins:**

- ✅ @typescript-eslint/eslint-plugin
- ✅ @typescript-eslint/parser
- 📦 eslint-plugin-react
- 📦 eslint-plugin-react-hooks
- 📦 eslint-plugin-jsx-a11y

**Optional Plugins:**

- 📦 eslint-plugin-jest (if using Jest for testing)
- 📦 eslint-plugin-testing-library (if using React Testing Library)

**Usage:**

```javascript
import { eslintReactConfig } from '@kitiumai/lint';
// or for presets:
import { react_spa } from '@kitiumai/lint/configs';
```

---

### 3. **React with Testing (Jest & Testing Library)**

```
Configuration: React Config + eslint/jest.js + eslint/testing-library.js
```

**Required Plugins:**

- ✅ All React plugins (see above)
- 📦 eslint-plugin-jest
- 📦 eslint-plugin-testing-library

**Optional Plugins:** None for this combination

**Usage:**

```javascript
import { eslintReactConfig, eslintJestConfig, eslintTestingLibraryConfig } from '@kitiumai/lint';
```

---

### 4. **Node.js / Backend API**

```
Configuration: eslint/base.js + eslint/typescript.js + eslint/node.js
```

**Required Plugins:**

- ✅ @typescript-eslint/eslint-plugin
- ✅ @typescript-eslint/parser
- ✅ eslint-plugin-import
- ✅ eslint-plugin-simple-import-sort
- ✅ eslint-plugin-security

**Optional Plugins:**

- 📦 eslint-plugin-jest (if using Jest for testing)

**Usage:**

```javascript
import { eslintNodeConfig } from '@kitiumai/lint';
// or for presets:
import { node_api } from '@kitiumai/lint/configs';
```

---

### 5. **GraphQL API Server**

```
Configuration: Node Config + eslint/graphql.js
```

**Required Plugins:**

- ✅ All Node.js plugins (see above)
- 📦 eslint-plugin-graphql (⚠️ OPTIONAL - only if using GraphQL)

**Optional Plugins:**

- 📦 eslint-plugin-jest (if using Jest for testing)

**Usage:**

```javascript
import { eslintGraphQLConfig } from '@kitiumai/lint';
// or for presets:
import { graphql_api } from '@kitiumai/lint/configs';
```

**Important:** Install `eslint-plugin-graphql` separately if using GraphQL:

```bash
npm install eslint-plugin-graphql
```

---

### 6. **Vue.js / Vue SPA**

```
Configuration: eslint/base.js + eslint/typescript.js + eslint/vue.js
```

**Required Plugins:**

- ✅ @typescript-eslint/eslint-plugin
- ✅ @typescript-eslint/parser
- 📦 eslint-plugin-vue

**Optional Plugins:**

- 📦 eslint-plugin-jest (if using Jest for testing)

**Usage:**

```javascript
import { eslintVueConfig } from '@kitiumai/lint';
// or for presets:
import { vue_spa } from '@kitiumai/lint/configs';
```

---

### 7. **Next.js / Next.js App**

```
Configuration: React Config + eslint/nextjs.js
```

**Required Plugins:**

- ✅ All React plugins (see React section)
- 📦 @next/eslint-plugin-next

**Optional Plugins:**

- 📦 eslint-plugin-jest (if using Jest for testing)
- 📦 eslint-plugin-testing-library (if using React Testing Library)

**Usage:**

```javascript
import { eslintNextjsConfig } from '@kitiumai/lint';
// or for presets:
import { nextjs_app } from '@kitiumai/lint/configs';
```

---

### 8. **Angular**

```
Configuration: eslint/angular.js
```

**Required Plugins:**

- ✅ @typescript-eslint/eslint-plugin
- ✅ @typescript-eslint/parser
- ⚠️ @angular-eslint/\* (not included in this package - add separately if needed)

**Optional Plugins:**

- 📦 eslint-plugin-jest (if using Jest for testing)

**Usage:**

```javascript
import { eslintAngularConfig } from '@kitiumai/lint';
```

**Note:** Angular projects need to install their own ESLint plugins:

```bash
npm install @angular-eslint/eslint-plugin @angular-eslint/eslint-plugin-template
```

---

### 9. **Svelte**

```
Configuration: eslint/svelte.js
```

**Required Plugins:**

- ✅ @typescript-eslint/eslint-plugin
- ✅ @typescript-eslint/parser
- ⚠️ eslint-plugin-svelte (not included in this package - add separately)

**Optional Plugins:**

- 📦 eslint-plugin-jest (if using Jest for testing)

**Usage:**

```javascript
import { eslintSvelteConfig } from '@kitiumai/lint';
```

**Note:** Svelte projects need to install their own ESLint plugins:

```bash
npm install eslint-plugin-svelte
```

---

### 10. **Security (Enhanced)**

```
Configuration: eslint/security.js
```

**Required Plugins:**

- ✅ eslint-plugin-security
- ✅ eslint-plugin-sonarjs
- ✅ eslint-plugin-n
- ✅ eslint-plugin-no-unsanitized

**Optional Plugins:** None for core security

**Usage:**

```javascript
import { eslintSecurityConfig } from '@kitiumai/lint';
```

---

### 11. **Monorepo / Library**

```
Configuration: eslint/base.js + eslint/typescript.js + eslint/jest.js
```

**Required Plugins:**

- ✅ @typescript-eslint/eslint-plugin
- ✅ @typescript-eslint/parser
- 📦 eslint-plugin-jest

**Optional Plugins:** None

**Usage:**

```javascript
import { eslintBaseConfig, eslintTypeScriptConfig, eslintJestConfig } from '@kitiumai/lint';
// or for presets:
import { library, monorepo } from '@kitiumai/lint/configs';
```

---

### 12. **Full-Stack (React + Node)**

```
Configuration: React Config + Node Config + Testing Config
```

**Required Plugins:**

- ✅ All React plugins (see React section)
- ✅ All Node.js plugins (see Node.js section)
- 📦 eslint-plugin-jest
- 📦 eslint-plugin-testing-library

**Optional Plugins:** None for core full-stack

**Usage:**

```javascript
import { fullstack } from '@kitiumai/lint/configs';
```

---

## Dependency Status Summary

### Current Hard Dependencies

- @typescript-eslint/eslint-plugin ✅
- @typescript-eslint/parser ✅
- eslint-config-prettier ✅
- eslint-plugin-import ✅
- eslint-plugin-jest ✅
- eslint-plugin-jsx-a11y ✅
- eslint-plugin-react ✅
- eslint-plugin-react-hooks ✅
- eslint-plugin-security ✅
- eslint-plugin-simple-import-sort ✅
- eslint-plugin-testing-library ✅
- eslint-plugin-vue ✅
- @next/eslint-plugin-next ✅
- eslint-plugin-sonarjs ✅
- eslint-plugin-n ✅
- eslint-plugin-no-unsanitized ✅
- prettier ✅
- husky ✅

### Optional Dependencies

- eslint-plugin-graphql (only needed for GraphQL projects) 📦

## Recommended Installation Patterns

### Minimal Setup (Vanilla TS/JS Only)

```bash
npm install @kitiumai/lint --save-dev
# No additional plugins needed
```

### React App

```bash
npm install @kitiumai/lint --save-dev
# All React plugins automatically included
```

### React with Testing

```bash
npm install @kitiumai/lint --save-dev
# All plugins included, testing configs ready to use
```

### Node.js / GraphQL API

```bash
npm install @kitiumai/lint --save-dev
# For GraphQL specifically:
npm install eslint-plugin-graphql --save-dev
```

### Vue.js

```bash
npm install @kitiumai/lint --save-dev
# All Vue plugins automatically included
```

### Full-Stack

```bash
npm install @kitiumai/lint --save-dev
# All plugins for React, Node.js, and testing included
```

## Configuration Examples

### Using in .eslintrc.js (ESLint 9+)

```javascript
import {
  fullstack,
  react_spa,
  node_api,
  graphql_api,
  library,
  minimal,
} from '@kitiumai/lint/configs';

export default [
  // Use presets
  ...react_spa,

  // Or mix and match individual configs
  // import { eslintReactConfig, eslintJestConfig } from '@kitiumai/lint';
  // ...eslintReactConfig,
  // eslintJestConfig,
];
```

### Single Framework Selection

```javascript
// Vanilla TypeScript
import { eslintBaseConfig, eslintTypeScriptConfig } from '@kitiumai/lint';
export default [
  ...eslintBaseConfig,
  ...eslintTypeScriptConfig,
];

// React SPA
import { react_spa } from '@kitiumai/lint/configs';
export default react_spa;

// Node.js Backend
import { node_api } from '@kitiumai/lint/configs';
export default node_api;

// GraphQL API
import { graphql_api } from '@kitiumai/lint/configs';
export default graphql_api;
```

---

## Notes

- **TypeScript is peer-optional** but highly recommended for modern development
- **Framework-specific plugins** are included but only loaded when you import their configs
- **GraphQL plugin is optional** since not all Node.js projects use GraphQL
- The package follows **ESLint 9+ FlatConfig format**
- Each preset combines multiple configs to provide a complete linting setup for specific use cases
