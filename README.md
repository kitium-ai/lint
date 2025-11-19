# @kitiumai/lint

Enterprise-ready, simple, and secure linting configuration package for Kitium AI projects.

## Features

- ✅ **Interactive Setup**: Smart postinstall prompts to configure linting tools and project type
- ✅ **Project Type Support**: React, Vue, Next.js, Angular, Svelte, Node.js, and more
- ✅ **Modular Configurations**: Separate configs for Base, React, Node.js, TypeScript, Jest, Testing Library, GraphQL, Vue, Next.js, Angular, Svelte
- ✅ **TSLint Support**: Optional TSLint configuration for additional TypeScript linting
- ✅ **Auto-Detection**: Automatically detects project type from package.json dependencies
- ✅ **Migration Tool**: Standalone migration script for converting existing ESLint v8/v9 and TSLint configs
- ✅ **Enterprise Security**: Advanced security scanning with SonarJS and OWASP vulnerability detection
- ✅ **ESLint 9 Compatible**: Modern ESLint flat config format (FlatConfig)
- ✅ **TypeScript First**: Full TypeScript support with strict type checking
- ✅ **React Ready**: Complete React and React Hooks support with accessibility rules
- ✅ **Testing Support**: Jest configuration and Testing Library best practices
- ✅ **Framework Support**: Next.js, Vue.js, Angular, Svelte, and GraphQL configurations included
- ✅ **Kitium UI Standards**: Optional Kitium UI component naming & typing enforcement
- ✅ **Git Hooks Integration**: Pre-built Husky setup for automated code quality checks
- ✅ **Code Formatting**: Opinionated Prettier configuration included
- ✅ **Shareable Presets**: Pre-built configurations for common project patterns
- ✅ **Easy to Use**: Simple, composable configurations for any project type
- ✅ **Zero Configuration**: Works out of the box, no complex setup needed

## Installation

```bash
npm install --save-dev @kitiumai/lint

# or
yarn add --dev @kitiumai/lint

# or
pnpm add --save-dev @kitiumai/lint
```

## Quick Start

### For React + TypeScript Applications

Create `eslint.config.js`:

```javascript
import { eslintReactConfig, eslintTypeScriptConfig } from "@kitiumai/lint";

export default [...eslintReactConfig, ...eslintTypeScriptConfig];
```

Create `tsconfig.json`:

```json
{
  "extends": "@kitiumai/lint/tsconfig/react",
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
import { eslintNodeConfig, eslintTypeScriptConfig } from "@kitiumai/lint";

export default [...eslintNodeConfig, ...eslintTypeScriptConfig];
```

Create `tsconfig.json`:

```json
{
  "extends": "@kitiumai/lint/tsconfig/node"
}
```

### For Vanilla JavaScript

Create `eslint.config.js`:

```javascript
import { eslintBaseConfig } from "@kitiumai/lint";

export default [...eslintBaseConfig];
```

## Interactive Setup (Automatic)

When you install `@kitiumai/lint`, the postinstall script prompts you with interactive questions:

```
🎯 @kitiumai/lint Setup

Let's configure which tools you'd like to use for linting and formatting.

Use ESLint for JavaScript/TypeScript linting? [Y/n]:
Use TSLint for additional TypeScript linting? [y/N]:
Use Prettier for code formatting? [Y/n]:

Select your project type:
  > 1. Node.js
    2. React
    3. Next.js
    4. Vue
    5. Angular
    6. Svelte
```

Based on your selections, the script automatically:
- Creates `eslint.config.js` with appropriate base configuration
- Creates `tslint.json` (if selected)
- Creates `.prettierrc.js` (if selected)
- Creates `.eslintignore` and `.prettierignore`
- Adds npm scripts to `package.json` (only for selected tools)
- Saves your choices in `.kitium-lint-setup.json` for future runs

### Automatic Project Detection

The setup automatically detects your project type based on dependencies:
- **React** if `react` is found
- **Next.js** if `next` is found (has priority over React)
- **Vue** if `vue` is found
- **Angular** if `@angular/core` is found
- **Svelte** if `svelte` is found
- **Node.js** (default)

## Migration from Existing Configs

Have an existing ESLint or TSLint setup? Use the migration tool:

```bash
npm run migrate
```

The migration script:
- **Detects existing configs** (ESLint v8/v9, TSLint, Prettier)
- **Preserves custom rules** while adopting @kitiumai/lint as base
- **Backs up originals** with timestamps (e.g., `.eslintrc.backup.2025-11-19T15-33-27`)
- **Prompts for confirmation** (opt-in, non-destructive)
- **Supports non-interactive mode** via environment variables:
  ```bash
  MIGRATE_AUTO_YES=true npm run migrate  # Auto-migrate all
  MIGRATE_AUTO_NO=true npm run migrate   # Skip all migrations
  ```

### Migration Example

**Before** - ESLint v8 config:
```json
{
  "extends": "airbnb",
  "rules": {
    "no-console": "warn",
    "react/prop-types": "off"
  }
}
```

**After** - Migrated to ESLint v9 flat config:
```javascript
import { eslintReactConfig, eslintTypeScriptConfig } from '@kitiumai/lint';

export default [
  ...eslintReactConfig,
  ...eslintTypeScriptConfig,
  {
    name: 'migrated-custom-rules',
    files: ['**/*.{js,jsx,ts,tsx}'],
    rules: {
      'no-console': 'warn',           // ✓ Preserved
      'react/prop-types': 'off'       // ✓ Preserved
    },
  },
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

#### `eslintJestConfig`

Jest testing configuration for unit and integration tests.

**Includes:**

- Jest-specific globals and rules
- Test lifecycle best practices
- Snapshot testing guidelines
- Assertion validation

**Files:** `**/*.test.{js,ts,jsx,tsx}`, `**/*.spec.{js,ts,jsx,tsx}`

#### `eslintTestingLibraryConfig`

React Testing Library configuration for component testing best practices.

**Includes:**

- Accessibility-first query recommendations
- Implementation detail avoidance
- Async/await handling in tests
- User interaction patterns

**Files:** `**/*.test.{jsx,tsx}`, `**/*.spec.{jsx,tsx}`

#### `eslintGraphQLConfig`

GraphQL schema and query validation.

**Includes:**

- GraphQL query validation
- Schema compliance checking
- Field existence validation
- Deprecation warnings

**Files:** `**/*.graphql`, `**/*.gql`

#### `eslintVueConfig`

Vue.js 3 Single File Component (SFC) configuration.

**Includes:**

- Vue component best practices
- Script setup composition API support
- Template accessibility rules
- Vue lifecycle validation

**Files:** `**/*.vue`

#### `eslintNextjsConfig`

Next.js framework-specific configuration.

**Includes:**

- Image optimization rules
- Link component usage
- Performance best practices
- Font and script optimization

**Extends:** Base configuration

#### `eslintKitiumConfig`

Kitium component enforcement aimed at shared design-system packages.

**Includes:**

- Kt\* component class naming requirements (`KtButtonWeb`, etc.)
- Props/Event interface naming conventions
- BaseProps/BaseComponent inheritance enforcement
- Required type exports for `*.types.ts` files

**When to use:** component libraries or apps that must follow Kitium UI patterns.

#### `eslintAngularConfig`

Angular framework-specific configuration with TypeScript support.

**Includes:**

- Directive selector conventions (attribute, camelCase prefix)
- Component selector conventions (element, kebab-case prefix)
- Lifecycle method validation
- TypeScript member ordering and accessibility rules
- Angular best practices and patterns

**Files:** `**/*.ts` (Angular components and services)

**Example:**
```javascript
import { eslintAngularConfig, eslintTypeScriptConfig } from "@kitiumai/lint";

export default [
  ...eslintAngularConfig,
  ...eslintTypeScriptConfig,
];
```

#### `eslintSvelteConfig`

Svelte framework-specific configuration with TypeScript support.

**Includes:**

- Svelte component best practices
- Block language configuration (TypeScript, SCSS)
- Template validation and linting
- Shorthand and directive usage rules
- Component structure enforcement

**Files:** `**/*.svelte` (Svelte components)

**Example:**
```javascript
import { eslintSvelteConfig, eslintTypeScriptConfig } from "@kitiumai/lint";

export default [
  ...eslintSvelteConfig,
  ...eslintTypeScriptConfig,
];
```

#### `eslintSecurityConfig`

Enhanced security scanning with advanced vulnerability detection.

**Includes:**

- OWASP Top 10 checks
- Code injection prevention
- SonarJS quality analysis
- Node.js security patterns
- XSS prevention (no-unsanitized)
- Cryptography best practices

**Note:** Recommended for all production applications

### Prettier Configuration

```javascript
import { prettierConfig } from "@kitiumai/lint";

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

- `@kitiumai/lint/tsconfig/base` - Base TypeScript configuration
- `@kitiumai/lint/tsconfig/react` - React + TypeScript configuration
- `@kitiumai/lint/tsconfig/node` - Node.js + TypeScript configuration

## Full Configuration Examples

### Example 1: React + TypeScript + Tailwind

```javascript
// eslint.config.js
import { eslintReactConfig, eslintTypeScriptConfig } from "@kitiumai/lint";
import tailwind from "eslint-plugin-tailwindcss";

export default [
  ...eslintReactConfig,
  ...eslintTypeScriptConfig,
  {
    files: ["**/*.{jsx,tsx}"],
    plugins: { tailwindcss: tailwind },
    rules: {
      "tailwindcss/classnames-order": "warn",
      "tailwindcss/no-custom-classname": "warn",
    },
  },
];
```

### Example 2: Node.js + Express

```javascript
// eslint.config.js
import { eslintNodeConfig, eslintTypeScriptConfig } from "@kitiumai/lint";

export default [
  ...eslintNodeConfig,
  ...eslintTypeScriptConfig,
  {
    files: ["src/**/*.ts"],
    rules: {
      "no-console": ["warn", { allow: ["warn", "error", "info"] }],
    },
  },
];
```

### Example 3: Monorepo Setup

```javascript
// eslint.config.js
import {
  eslintBaseConfig,
  eslintReactConfig,
  eslintNodeConfig,
  eslintTypeScriptConfig,
} from "@kitiumai/lint";
import { prettierConfig } from "@kitiumai/lint";

export default [
  // Frontend apps
  {
    files: ["apps/web/**/*.{js,jsx,ts,tsx}"],
    extends: [...eslintReactConfig, ...eslintTypeScriptConfig],
  },
  // Backend services
  {
    files: ["apps/api/**/*.ts"],
    extends: [...eslintNodeConfig, ...eslintTypeScriptConfig],
  },
  // Shared utilities
  {
    files: ["packages/shared/**/*.ts"],
    extends: [...eslintBaseConfig, ...eslintTypeScriptConfig],
  },
];
```

## Custom Rules Override

You can override any rules from the package configurations:

```javascript
import { eslintReactConfig, eslintTypeScriptConfig } from "@kitiumai/lint";

export default [
  ...eslintReactConfig,
  ...eslintTypeScriptConfig,
  {
    name: "my-custom-rules",
    files: ["src/**/*.{ts,tsx}"],
    rules: {
      "@typescript-eslint/no-explicit-any": "warn", // Override to warning
      "react/prop-types": "off", // Disable rule
    },
  },
];
```

## Extending Kitium Rules and Plugins

Need to enforce additional Kitium-specific conventions or register your own rules? Use the helper utilities exported by the package.

### `createKitiumConfig`

Programmatically extend the Kitium ESLint config with additional rules, plugins, or overrides:

```javascript
import { createKitiumConfig, eslintTypeScriptConfig } from "@kitiumai/lint";
import tailwindcss from "eslint-plugin-tailwindcss";

export default [
  ...createKitiumConfig({
    additionalRules: {
      "kitium/custom-rule": "warn",
    },
    additionalPlugins: {
      tailwindcss,
    },
    overrides: [
      {
        name: "kitium-tailwind",
        files: ["packages/ui/**/*.{ts,tsx}"],
        rules: {
          "tailwindcss/no-custom-classname": "warn",
        },
      },
    ],
  }),
  ...eslintTypeScriptConfig,
];
```

### `createKitiumPlugin`

Merge your own custom rules into the Kitium ESLint plugin without rewriting it:

```javascript
import { createKitiumPlugin } from "@kitiumai/lint";

const customRule = {
  meta: { type: "suggestion", docs: { description: "Require design tokens" } },
  create(context) {
    return {
      Literal(node) {
        if (typeof node.value === "string" && node.value.includes("#")) {
          context.report({
            node,
            message: "Use design token variables instead of hex colors.",
          });
        }
      },
    };
  },
};

export default [
  {
    name: "kitium-with-custom",
    plugins: {
      kitium: createKitiumPlugin({
        additionalRules: {
          "design-tokens": customRule,
        },
        recommendedRules: {
          "kitium/design-tokens": "error",
        },
      }),
    },
    rules: {
      "kitium/design-tokens": "error",
    },
  },
];
```

These helpers keep the default Kitium behavior intact while giving you an ergonomic way to layer project-specific lints on top.

## Shareable Configurations

Pre-built configuration presets for common project patterns. Use these to quickly set up linting for your project:

### Quick Presets

```javascript
// Use a preset
import {
  fullstack,
  react_spa,
  nextjs_app,
  node_api,
  graphql_api,
  vue_spa,
} from "@kitiumai/lint/configs";

export default [...fullstack]; // for full-stack apps
```

Available presets:

- **`fullstack`** - React + Node.js + TypeScript + Jest + Testing Library + Security
- **`react_spa`** - React Single Page Application with TypeScript
- **`nextjs_app`** - Next.js application with all features
- **`node_api`** - Node.js API server with security
- **`graphql_api`** - GraphQL server with Node.js and security
- **`vue_spa`** - Vue.js 3 application
- **`monorepo`** - Monorepo with multiple packages
- **`library`** - Library/package development
- **`minimal`** - Minimal JavaScript configuration
- **`all`** - All configurations enabled (for advanced users)

### Example: Using Presets

```javascript
// eslint.config.js
import { nextjs_app } from "@kitiumai/lint/configs";

export default [
  ...nextjs_app,
  {
    // Project-specific overrides
    files: ["src/**/*.ts"],
    rules: {
      "no-console": ["warn", { allow: ["error"] }],
    },
  },
];
```

## Jest Configuration

Use the included Jest configurations:

```javascript
// jest.config.js
import { reactConfig } from "@kitiumai/lint/jest";

export default {
  ...reactConfig,
  // Project-specific overrides
  collectCoverageFrom: ["src/**/*.{ts,tsx}", "!src/**/*.d.ts"],
};
```

Available Jest presets:

- **`baseConfig`** - Basic Node.js testing
- **`reactConfig`** - React component testing with jsdom
- **`reactNativeConfig`** - React Native testing
- **`nextjsConfig`** - Next.js application testing

## Git Hooks with Husky

Set up automated code quality checks with Husky:

```bash
# Install dependencies
npm install --save-dev husky lint-staged

# Initialize husky
npx husky install

# Create pre-commit hook
npx husky add .husky/pre-commit 'npx lint-staged'

# Create pre-push hook
npx husky add .husky/pre-push 'npm run lint && npm test'
```

Add lint-staged configuration to `package.json`:

```json
{
  "lint-staged": {
    "*.{js,jsx,ts,tsx}": ["eslint --fix", "prettier --write"],
    "*.{json,md}": ["prettier --write"]
  }
}
```

For detailed setup, see the [Husky documentation](https://typicode.github.io/husky/).

## Security Features

The `eslintSecurityConfig` includes comprehensive security scanning:

### OWASP Top 10 Protection

- **Code Injection Prevention**: Rules against eval, Function constructor, and dynamic code
- **Cross-Site Scripting (XSS)**: Using eslint-plugin-no-unsanitized
- **Insecure Deserialization**: JSON parsing validation
- **Broken Authentication**: Type-safe credential handling with TypeScript

### Advanced Scanning

- **SonarJS Analysis**: Code quality and security hotspots
- **Node.js Specific**: Buffer safety, child process warnings, path handling
- **Static Analysis**: Detects potential vulnerabilities at lint time
- **Regex Security**: Detection of unsafe regular expressions (ReDoS)
- **Cryptography**: Warnings for weak random number generation

### Type Safety

- **Strict TypeScript**: Prevents many common security issues at compile time
- **No Implicit Any**: Enforces explicit type annotations
- **Exhaustive Checks**: Ensures all cases are handled

Use the security config on all production projects:

```javascript
import { eslintSecurityConfig } from "@kitiumai/lint";

export default [
  // ... other configs
  eslintSecurityConfig,
];
```

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
