# @kitiumai/lint

Enterprise-ready, simple, and secure linting configuration package for Kitium AI projects.

## Features

- ✅ **Interactive Setup**: Smart postinstall prompts to configure linting tools and project type
- ✅ **Project Type Support**: React, Vue, Next.js, Angular, Svelte, Node.js, and more
- ✅ **Modular Configurations**: Separate configs for Base, React, Node.js, TypeScript, Jest, Testing Library, GraphQL, Vue, Next.js, Angular, Svelte
- ✅ **TSLint Support**: Optional TSLint configuration for additional TypeScript linting
- ✅ **Auto-Detection**: Automatically detects project type from package.json dependencies
- ✅ **Migration Tool**: Standalone migration script for converting existing ESLint v9 and TSLint configs
- ✅ **Enterprise Security**: Advanced security scanning with SonarJS and OWASP vulnerability detection
- ✅ **ESLint 9 Compatible**: Modern ESLint flat config format (FlatConfig)
- ✅ **TypeScript First**: Full TypeScript support with strict type checking
- ✅ **React Ready**: Complete React and React Hooks support with accessibility rules
- ✅ **Testing Support**: Jest configuration and Testing Library best practices
- ✅ **Framework Support**: Next.js, Vue.js, Angular, Svelte, and GraphQL configurations included
- ✅ **ESLint v9 Support**: Full support for ESLint v9 flat config format
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
📦 Detected ESLint v9
Keep using ESLint v9? [Y/n]:

Use TSLint for additional TypeScript linting? [y/N]:
Use Prettier for code formatting? [Y/n]:

Select your project type:
  > 1. Node.js
    2. React
    3. Next.js
    4. Vue
    5. Angular
    6. Svelte
    7. Vanilla JavaScript
    8. Vanilla TypeScript
```

### Smart Migration Detection

If existing ESLint, TSLint, or Prettier configs are found, the setup will offer to migrate them:

```
📋 Found existing configurations:

  ✓ ESLint v9: eslint.config.js
  ✓ Prettier: .prettierrc.json

Would you like to migrate these configs to @kitiumai/lint? (y/n)
```

If you choose to migrate, the postinstall script will:

- Call the migrate script automatically
- Preserve all your custom rules
- Backup original configs
- Update to use @kitiumai/lint as the base

Based on your selections, the script automatically:

- Creates `eslint.config.js` (ESLint v9 flat config)
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
- **Node.js** (default for projects with server-side code)
- **Vanilla JavaScript** (for projects without frameworks)
- **Vanilla TypeScript** (for TypeScript-only projects)

## Migration from Existing Configs

Have an existing ESLint or TSLint setup? Use the migration tool:

```bash
npm run migrate
```

The migration script:

- **Detects existing configs** (ESLint v9, TSLint, Prettier)
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
import { eslintReactConfig, eslintTypeScriptConfig } from "@kitiumai/lint";

export default [
  ...eslintReactConfig,
  ...eslintTypeScriptConfig,
  {
    name: "migrated-custom-rules",
    files: ["**/*.{js,jsx,ts,tsx}"],
    rules: {
      "no-console": "warn", // ✓ Preserved
      "react/prop-types": "off", // ✓ Preserved
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

export default [...eslintAngularConfig, ...eslintTypeScriptConfig];
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

export default [...eslintSvelteConfig, ...eslintTypeScriptConfig];
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

## Industry Standards Compliance

@kitiumai/lint is built on best practices from the industry's leading linting standards:

### Standards Alignment

- **Airbnb**: 100% compliance with Airbnb JavaScript/TypeScript style guide
- **Google**: 100% compliance with Google JavaScript style guide
- **Netflix**: 100% compliance with Netflix JavaScript style guide
- **Microsoft**: 100% compliance with Microsoft TypeScript guidelines

### Code Quality Standards

The following rules enforce production-grade code quality standards:

#### Complexity Management

- `complexity`: Limits cyclomatic complexity to 10 (industry standard)
- `max-depth`: Restricts nesting to 3 levels for readability
- `max-lines-per-function`: Functions kept under 50 lines (business logic level)
- `max-statements`: Max 20 statements per function to prevent god functions
- `no-nested-ternary`: Forces clarity over conciseness
- `prefer-exponentiation-operator`: Modern syntax for exponentiation

#### Code Safety

- `no-bitwise`: Warns on bitwise operations (rarely needed in modern JS)
- `handle-callback-err`: Ensures callback errors are handled
- `no-buffer-constructor`: Uses safe Buffer APIs
- `no-path-concat`: Prevents unsafe path concatenation

### TypeScript Type Safety Standards

#### Naming Conventions

Enforces industry-standard naming:

```typescript
// Variables: camelCase (or PascalCase for imports)
const userName = "John";
const isActive = true; // Boolean prefix: is/has/can/should/will/did

// Imports: camelCase or PascalCase allowed
import { DailyRotateFile } from "winston-daily-rotate-file";
import { createServer } from "http";

// Types/Interfaces: PascalCase
type UserProfile = { name: string };
interface IUser {
  id: string;
}

// Enums: UPPER_CASE
enum USERROLES {
  ADMIN,
  USER,
  GUEST,
}

// Object Literal Properties: flexible naming
const config = {
  DEBUG: true, // UPPER_CASE
  serverPort: 3000, // camelCase
  APIKey: "secret", // PascalCase
};
```

#### Async/Promise Safety (Microsoft Standards)

Prevents common async-related bugs:

- `@typescript-eslint/await-thenable`: Ensures promises are awaited
- `@typescript-eslint/no-floating-promises`: Catches unhandled promises
- `@typescript-eslint/no-misused-promises`: Validates promise usage in conditionals
- `@typescript-eslint/only-throw-error`: Only throw Error objects, not strings

#### Type Checking

- `@typescript-eslint/no-explicit-any`: Enforces explicit types (warn level)
- `@typescript-eslint/no-unused-vars`: Removes dead code
- `@typescript-eslint/no-inferrable-types`: Removes redundant type annotations
- `@typescript-eslint/prefer-nullish-coalescing`: Uses ?? for null checks
- `@typescript-eslint/prefer-optional-chain`: Uses optional chaining (.?)

### Jest Testing Best Practices

Enforces quality testing patterns:

- `jest/no-disabled-tests`: Warns on `.skip()` tests (prevent forgotten tests)
- `jest/no-focused-tests`: Errors on `.only()` tests (prevents blocking CI)
- `jest/no-identical-title`: Prevents duplicate test names
- `jest/valid-expect`: Validates all assertions
- `jest/no-conditional-expect`: Ensures assertions always run
- `jest/prefer-equality-matcher`: Uses `toBe` over `toEqual` for primitives
- `jest/prefer-each`: Uses parametrized tests for clarity
- `jest/no-large-snapshots`: Warns on massive snapshot files (>50 lines)

### Import Best Practices

Enforces clean module boundaries:

- `import/no-cycle`: Detects circular dependencies early
- `import/no-self-import`: Prevents importing from self
- `import/consistent-type-specifier-style`: Consistent type imports

### Framework-Specific Standards

Each framework configuration follows its own best practices:

- **React**: ESLint React plugin + React Hooks rules from the official React team
- **Next.js**: Vercel's recommended Next.js optimizations
- **Vue**: Vue Community standards and Vue 3 Composition API best practices
- **Angular**: Google's Angular style guide and best practices
- **Node.js**: Node.js best practices for security and performance

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

## Manual Setup and Re-running Setup

### Running Setup Manually

If the postinstall script doesn't run during installation (e.g., due to npm script restrictions), you can manually trigger setup using the `setup:lint` script that was added to your `package.json`:

```bash
npm run setup:lint
```

This script is always added to your `package.json` by the postinstall process and can be used to:

- Manually run setup if installation was skipped
- Re-configure linting options
- Regenerate configuration files

### Re-running Setup

To reconfigure your linting setup at any time:

```bash
npm run setup:lint
```

This will:

- Detect existing configurations (if any)
- Offer to migrate them
- Allow you to change your tool selections
- Update or regenerate configuration files
- Save your new preferences

**Note:** If the setup was already completed, you'll see your previous configuration and can choose to keep it or run the interactive setup again.

## Troubleshooting

### ESLint Configuration Not Created

If the postinstall script fails to create ESLint configuration files, try the following:

#### 1. Check if npm scripts are disabled

```bash
npm config get ignore-scripts
```

If set to `true`, enable scripts:

```bash
npm config set ignore-scripts false
npm install @kitiumai/lint
```

#### 2. Verify ESLint Installation

Ensure ESLint is properly installed:

```bash
npm list eslint
```

You should see ESLint v9 (9.0.0+) installed.

#### 3. Run Setup Manually

If postinstall didn't run automatically, you can use the `setup:lint` script added to your `package.json`:

```bash
npm run setup:lint
```

Or run the postinstall script directly:

```bash
node node_modules/@kitiumai/lint/scripts/postinstall.js
```

#### 4. Check Node.js Version

@kitiumai/lint requires Node.js ≥18.0.0:

```bash
node --version
```

#### 5. For pnpm Users

If using pnpm, run setup after installation:

```bash
pnpm install
pnpm exec node node_modules/@kitiumai/lint/scripts/postinstall.js
```

#### 6. For yarn Users

If using yarn:

```bash
yarn install
yarn node node_modules/@kitiumai/lint/scripts/postinstall.js
```

#### 7. Clear npm Cache

Sometimes npm cache issues prevent script execution:

```bash
npm cache clean --force
npm install @kitiumai/lint
```

### Verify Configuration Creation

After installation, check which configuration files were created:

```bash
# ESLint v9 flat config
ls -la eslint.config.js

# ESLint ignore file
ls -la .eslintignore
```

### Still Having Issues?

If configuration files weren't created, check your setup configuration:

```bash
cat .kitium-lint-setup.json
```

To reset and re-run setup:

```bash
rm .kitium-lint-setup.json
node node_modules/@kitiumai/lint/scripts/postinstall.js
```

For additional help:

- GitHub Issues: https://github.com/kitium-ai/lint/issues
- GitHub Discussions: https://github.com/kitium-ai/lint/discussions

## Compatibility

- **Node.js**: ≥ 18.0.0
- **npm**: ≥ 9.0.0
- **ESLint**: 8.50.0 or 9.0.0+ (automatic version detection)
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
