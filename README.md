# @kitium-ai/lint

Enterprise-ready, simple, and secure linting configuration package for Kitium AI projects.

## Features

- ✅ **Modular Configurations**: Separate configs for Base, React, Node.js, and TypeScript
- ✅ **Enterprise Security**: Built-in security best practices and vulnerability detection
- ✅ **ESLint 9 Compatible**: Modern ESLint flat config format (FlatConfig)
- ✅ **TypeScript First**: Full TypeScript support with strict type checking
- ✅ **React Ready**: Complete React and React Hooks support with accessibility rules
- ✅ **Code Formatting**: Opinionated Prettier configuration included
- ✅ **Easy to Use**: Simple, composable configurations for any project type
- ✅ **Zero Configuration**: Works out of the box, no complex setup needed

## Installation

```bash
npm install --save-dev @kitium-ai/lint

# or
yarn add --dev @kitium-ai/lint

# or
pnpm add --save-dev @kitium-ai/lint
```

## Quick Start

### For React + TypeScript Applications

Create `eslint.config.js`:

```javascript
import { eslintReactConfig, eslintTypeScriptConfig } from '@kitium-ai/lint';

export default [
  ...eslintReactConfig,
  ...eslintTypeScriptConfig,
];
```

Create `tsconfig.json`:

```json
{
  "extends": "@kitium-ai/lint/tsconfig/react",
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    }
  }
}
```

### For Node.js Backend

Create `eslint.config.js`:

```javascript
import { eslintNodeConfig, eslintTypeScriptConfig } from '@kitium-ai/lint';

export default [
  ...eslintNodeConfig,
  ...eslintTypeScriptConfig,
];
```

Create `tsconfig.json`:

```json
{
  "extends": "@kitium-ai/lint/tsconfig/node"
}
```

### For Vanilla JavaScript

Create `eslint.config.js`:

```javascript
import { eslintBaseConfig } from '@kitium-ai/lint';

export default [
  ...eslintBaseConfig,
];
```

## Configuration Modules

### ESLint Configurations

#### `eslintBaseConfig`
Core JavaScript/TypeScript linting rules applicable to all projects.

**Includes:**
- Code quality rules
- Best practices
- Variable management
- Formatting standards

#### `eslintReactConfig`
React-specific configuration with React hooks and accessibility rules.

**Includes:**
- React best practices
- React Hooks exhaustive deps checking
- JSX accessibility (a11y) rules
- Component pattern enforcement

**Note:** Extends `baseConfig`

#### `eslintNodeConfig`
Node.js backend configuration with security scanning.

**Includes:**
- Node.js-specific globals and rules
- Import sorting (simple-import-sort)
- Security vulnerability detection
- Best practices for server-side code

**Note:** Extends `baseConfig`

#### `eslintTypeScriptConfig`
Strict TypeScript configuration with comprehensive type checking.

**Includes:**
- Strict type checking rules
- TypeScript best practices
- Type safety enforcement
- Async/await validation

**Note:** Extends `baseConfig`

### Prettier Configuration

```javascript
import { prettierConfig } from '@kitium-ai/lint';

export default prettierConfig;
```

**Configuration:**
- Print width: 100 characters
- Tab width: 2 spaces
- Single quotes for JavaScript/TypeScript
- Trailing commas for all multiline arrays/objects
- Automatic formatting for all supported file types

### TypeScript Configurations

Available via `extends` in your `tsconfig.json`:

- `@kitium-ai/lint/tsconfig/base` - Base TypeScript configuration
- `@kitium-ai/lint/tsconfig/react` - React + TypeScript configuration
- `@kitium-ai/lint/tsconfig/node` - Node.js + TypeScript configuration

## Full Configuration Examples

### Example 1: React + TypeScript + Tailwind

```javascript
// eslint.config.js
import { eslintReactConfig, eslintTypeScriptConfig } from '@kitium-ai/lint';
import tailwind from 'eslint-plugin-tailwindcss';

export default [
  ...eslintReactConfig,
  ...eslintTypeScriptConfig,
  {
    files: ['**/*.{jsx,tsx}'],
    plugins: { tailwindcss: tailwind },
    rules: {
      'tailwindcss/classnames-order': 'warn',
      'tailwindcss/no-custom-classname': 'warn',
    },
  },
];
```

### Example 2: Node.js + Express

```javascript
// eslint.config.js
import { eslintNodeConfig, eslintTypeScriptConfig } from '@kitium-ai/lint';

export default [
  ...eslintNodeConfig,
  ...eslintTypeScriptConfig,
  {
    files: ['src/**/*.ts'],
    rules: {
      'no-console': ['warn', { allow: ['warn', 'error', 'info'] }],
    },
  },
];
```

### Example 3: Monorepo Setup

```javascript
// eslint.config.js
import { eslintBaseConfig, eslintReactConfig, eslintNodeConfig, eslintTypeScriptConfig } from '@kitium-ai/lint';
import { prettierConfig } from '@kitium-ai/lint';

export default [
  // Frontend apps
  {
    files: ['apps/web/**/*.{js,jsx,ts,tsx}'],
    extends: [...eslintReactConfig, ...eslintTypeScriptConfig],
  },
  // Backend services
  {
    files: ['apps/api/**/*.ts'],
    extends: [...eslintNodeConfig, ...eslintTypeScriptConfig],
  },
  // Shared utilities
  {
    files: ['packages/shared/**/*.ts'],
    extends: [...eslintBaseConfig, ...eslintTypeScriptConfig],
  },
];
```

## Custom Rules Override

You can override any rules from the package configurations:

```javascript
import { eslintReactConfig, eslintTypeScriptConfig } from '@kitium-ai/lint';

export default [
  ...eslintReactConfig,
  ...eslintTypeScriptConfig,
  {
    name: 'my-custom-rules',
    files: ['src/**/*.{ts,tsx}'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'warn', // Override to warning
      'react/prop-types': 'off', // Disable rule
    },
  },
];
```

## Security Features

This package includes security-focused configurations:

- **Static Analysis**: Detects potential security vulnerabilities
- **Code Injection Prevention**: Rules against eval and dynamic code execution
- **Buffer Safety**: Warnings for unsafe Buffer operations
- **Child Process Warnings**: Alerts for subprocess spawning
- **Regex Security**: Detection of unsafe regular expressions
- **Type Safety**: Strict TypeScript prevents many security issues

## npm Scripts

Add these scripts to your `package.json`:

```json
{
  "scripts": {
    "lint": "eslint .",
    "lint:fix": "eslint . --fix",
    "format": "prettier --write .",
    "format:check": "prettier --check .",
    "type-check": "tsc --noEmit"
  }
}
```

## IDE Integration

### VS Code

Install the following extensions:
- ESLint (`dbaeumer.vscode-eslint`)
- Prettier (`esbenp.prettier-vscode`)

Create `.vscode/settings.json`:

```json
{
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.formatOnSave": true,
  "[javascript]": {
    "editor.codeActionsOnSave": {
      "source.fixAll.eslint": true
    }
  },
  "[typescript]": {
    "editor.codeActionsOnSave": {
      "source.fixAll.eslint": true
    }
  },
  "[typescriptreact]": {
    "editor.codeActionsOnSave": {
      "source.fixAll.eslint": true
    }
  }
}
```

## Development and Testing

### Run Tests
```bash
npm run test
```

### Run Linting
```bash
npm run lint
npm run lint:fix
```

### Format Code
```bash
npm run format
npm run format:check
```

## Compatibility

- **Node.js**: ≥ 18.0.0
- **npm**: ≥ 9.0.0
- **ESLint**: 8.50.0 or 9.0.0+
- **TypeScript**: 4.8.0 or 5.0.0+ (optional, for TypeScript projects)

## Contributing

Contributions are welcome! Please ensure all changes:
1. Follow the existing code style
2. Include appropriate tests
3. Update documentation
4. Pass linting checks

## License

MIT

## Support

For issues and questions:
- GitHub Issues: https://github.com/kitium-ai/lint/issues
- Discussions: https://github.com/kitium-ai/lint/discussions

## Changelog

See [CHANGELOG.md](./CHANGELOG.md) for version history and breaking changes.
