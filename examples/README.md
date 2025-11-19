# @kitiumai/lint - ESLint Configuration Examples

This directory contains ready-to-use ESLint configuration examples for different
project types. Choose the one that matches your project setup.

## Available Templates

### Vanilla JavaScript & TypeScript

- **`vanilla-javascript.eslint.config.js`** - Pure JavaScript projects
  - Use this for: Plain JavaScript modules, utilities, or libraries
  - Includes: Base ESLint rules

- **`vanilla-typescript.eslint.config.js`** - Pure TypeScript projects
  - Use this for: TypeScript-only applications without frameworks
  - Includes: Base ESLint + TypeScript strict rules

### Backend Applications

- **`node-app-javascript.eslint.config.js`** - Node.js backend (JavaScript)
  - Use this for: Express, Fastify, or other Node.js backends in JavaScript
  - Includes: Base + Node.js + Console logging allowance

- **`node-app.eslint.config.js`** - Node.js backend (TypeScript)
  - Use this for: Express, Fastify, or other Node.js backends in TypeScript
  - Includes: Base + TypeScript + Node.js + Console logging allowance

### Frontend Applications

- **`react-app-javascript.eslint.config.js`** - React application (JavaScript)
  - Use this for: React projects without TypeScript
  - Includes: Base + React rules

- **`react-app.eslint.config.js`** - React application (TypeScript)
  - Use this for: React projects with TypeScript
  - Includes: Base + TypeScript + React rules

- **`nextjs.eslint.config.js`** - Next.js application
  - Use this for: Next.js 13+ projects with TypeScript
  - Includes: Base + TypeScript + React + Next.js + Jest + Testing Library

- **`vue.eslint.config.js`** - Vue.js application
  - Use this for: Vue 3 projects with TypeScript
  - Includes: Base + TypeScript + Vue rules

### Specialized Projects

- **`graphql-api.eslint.config.js`** - GraphQL API server
  - Use this for: GraphQL servers built with Node.js + TypeScript
  - Includes: Base + TypeScript + Node.js + GraphQL rules

### Monorepo Setup

- **`monorepo.eslint.config.js`** - Monorepo with multiple applications
  - Use this for: Managing multiple apps/packages in a single repository
  - Includes: Preconfigured rules for web, mobile, backend, and utility packages

## How to Use

1. Copy the appropriate config file to your project root as `eslint.config.js`

   ```bash
   cp vanilla-typescript.eslint.config.js /path/to/your/project/eslint.config.js
   ```

2. Run ESLint to verify it works

   ```bash
   npm run lint
   ```

3. Customize the rules in the `project-overrides` section if needed

## Import Reference

All templates import from `@kitiumai/lint/eslint`. Available exports:

```javascript
import {
  baseConfig, // Base ESLint rules
  typeScriptConfig, // TypeScript strict rules
  reactConfig, // React best practices
  nodeConfig, // Node.js environment
  vueConfig, // Vue.js rules
  nextjsConfig, // Next.js specific rules
  jestConfig, // Jest testing rules
  testingLibraryConfig, // Testing Library rules
  graphqlConfig, // GraphQL rules
  securityConfig, // Security rules
  angularConfig, // Angular rules
  svelteConfig, // Svelte rules
} from '@kitiumai/lint/eslint';
```

## Common Customizations

### Disable Type Checking

If you want faster linting, you can disable TypeScript type checking:

```javascript
import { baseConfig, typeScriptConfig } from '@kitiumai/lint/eslint';

export default [
  baseConfig,
  {
    ...typeScriptConfig,
    rules: {
      ...typeScriptConfig.rules,
      '@typescript-eslint/no-unsafe-*': 'off', // Disable type-aware rules
    },
  },
];
```

### Allow More Console Logs

For development environments:

```javascript
{
  name: 'development-rules',
  files: ['src/**/*.js'],
  rules: {
    'no-console': 'off', // Allow all console methods
  },
}
```

### Stricter Rules for Libraries

For published packages:

```javascript
{
  name: 'library-rules',
  files: ['src/**/*.ts'],
  rules: {
    '@typescript-eslint/explicit-member-accessibility': 'error',
    '@typescript-eslint/no-explicit-any': 'error',
    'no-console': 'error',
  },
}
```

## Ignoring Files

The ignores block (at the beginning of config array) uses ESLint v9 syntax:

```javascript
export default [
  {
    ignores: ['node_modules/', 'dist/', '.next/', '.env', '*.log'],
  },
  // ... rest of config
];
```

Note: The deprecated `.eslintignore` file is no longer needed with ESLint v9.

## Running ESLint

```bash
# Check for linting errors
npm run lint

# Fix auto-fixable errors
npm run lint:fix

# Format with Prettier
npm run format
```

## Troubleshooting

### "Unexpected array" error

Make sure you're using ESLint v9.0.0 or higher and that your `eslint.config.js`
exports an array (not an object).

### Missing plugin errors

Some configs require optional dependencies. Install them as needed:

```bash
npm install --save-dev @next/eslint-plugin-next  # For Next.js
npm install --save-dev eslint-plugin-vue         # For Vue
npm install --save-dev eslint-plugin-angular     # For Angular
```

### TypeScript errors

Ensure your project has TypeScript installed and a valid `tsconfig.json`:

```bash
npm install --save-dev typescript
```

## More Information

- [ESLint Documentation](https://eslint.org/docs/)
- [@kitiumai/lint GitHub](https://github.com/kitium-ai/lint)
- [ESLint v9 Migration Guide](https://eslint.org/docs/latest/use/migrate-to-9.0.0)
