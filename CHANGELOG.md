# Changelog

## [v2.0.1] - 2025-11-30

### Added

added index.d.ts and config bumped patch

## [v2.0.0] - 2025-11-27

### Added

- Import discipline: deterministic ordering via `simple-import-sort`, cycle detection, and guards against deep relative imports plus module boundary guidance.
- Promise and logging safety: stricter `eslint-plugin-promise` coverage and `no-console` posture to push teams toward structured loggers.
- Performance correctness: Unicorn best-practice set (`prefer-query-selector`, `no-await-in-loop`, `throw-new-error`, etc.).
- Security depth: enabled `no-unsanitized/*` by default and added buffer/eval protections to the security preset.
- Accessibility upgrades: tighter React a11y defaults and optional Vue accessibility plugin integration.
- Testing rigor: expanded Jest (`require-top-level-describe`, nested describe limits) and Testing Library (`prefer-presence-queries`, async safeguards) rules.
- Formatting guardrails: lint-level enforcement against stray Prettier or `.editorconfig` files to preserve the shared formatter baseline.
- Architecture boundaries: filename casing standards, banned deep relative imports, and baseline module layering rules.
- Automation templates: Husky hooks run `pnpm lint:fix`, `pnpm format:fix`, `lint-staged`, and `pnpm verify`; added GitHub Actions workflow example using `pnpm verify`.
- Strict preset: `configs.fullstack_strict` layers Kitium UI standards atop the full-stack bundle for teams that want maximum guardrails.

## [1.3.4] - 2025-11-24

### Changed

- Bumped shared tooling dependencies to pull in latest automation suites:
  - `@kitiumai/scripts` → `^0.2.1` (security/DX/release helpers, interactive token prompts)
  - `@kitiumai/config` → `^0.1.2` (new org-wide git hygiene configs)
- Added `pnpm verify` script (runs lint + format check + tests) for CI parity.
- `postinstall.js` / `migrate.js` now run `ensureSharedConfigs` to audit consumers automatically.
- README documents the verify workflow and optional peer dependency matrix.

## [1.3.3] - 2025-11-22

### Added

- **@kitiumai/scripts Integration**: Added `@kitiumai/scripts` as a dependency and integrated its utilities
  - Updated `postinstall.js` to use `log`, `readJson`, `writeJson` utilities from `@kitiumai/scripts/utils`
  - Updated `migrate.js` to use standardized logging utilities
  - Improved code consistency and maintainability across scripts

- **Package Template Scripts**: Added missing scripts from `@kitiumai/config/package.template.json`
  - `changeset`: Changeset management with ensure-changeset
  - `version`: Version bumping via changesets
  - `publish:set-token`, `publish:setup`, `publish:check`, `publish:login`: NPM authentication helpers
  - `publish:package`, `publish:package:token`, `publish:package:otp`: Publishing scripts
  - `publish:dry-run`, `publish:dry-run:token`: Dry-run publishing
  - `release`: Release workflow script

### Fixed

- **Deprecated Dependencies**: Fixed deprecated subdependencies
  - `lodash.get@4.4.2`: Added pnpm override to replace with `lodash@^4.17.21`
  - `subscriptions-transport-ws@0.9.19`: Documented as known transitive dependency from `eslint-plugin-graphql`
  - Added `fix-deprecated-deps` script integration from `@kitiumai/scripts`

- **Peer Dependency Conflicts**: Resolved ESLint 9 and GraphQL 16 peer dependency warnings
  - Updated `eslint-plugin-react-hooks` from `^4.6.0` to `^5.0.0` (ESLint 9 compatible)
  - Added `pnpm.peerDependencyRules` to allow GraphQL 16 and ESLint 9 at package level
  - Suppressed peer dependency warnings while maintaining functionality

- **TypeScript Build Script**: Fixed build script for JavaScript-only package
  - Changed from `tsc -p tsconfig/base.json` to no-op message
  - Prevents TypeScript compilation errors when no `.ts` files exist
  - Package correctly identifies as JavaScript-only

### Changed

- **Dependency Updates**:
  - `@kitiumai/config`: Updated to `^0.1.1` (from `^0.2.0`)
  - `@kitiumai/scripts`: Added `^0.1.0` as new dependency
  - `eslint-plugin-react-hooks`: Updated to `^5.0.0` for ESLint 9 support

- **Script Improvements**:
  - Standardized logging across all scripts using `@kitiumai/scripts/utils`
  - Improved async/await handling in configuration file operations
  - Better error messages and user feedback

### Compatibility

- ✅ ESLint 9.39.1 (verified with eslint-plugin-react-hooks v5.0.0)
- ✅ GraphQL 16.x (with peer dependency rules)
- ✅ @kitiumai/scripts 0.1.0
- ✅ @kitiumai/config 0.1.1

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.3.2] - 2025-11-21

### Fixed

- removed postinstall and updated to setup:lint script

## [1.3.1] - 2025-11-20

### Fixed

- **Naming Convention Format**: Fixed `@typescript-eslint/naming-convention` configuration
  - Changed enum member format from `UPPER_SNAKE_CASE` to `UPPER_CASE` (valid format name)
  - Removed non-existent `explicit-function-return-types` rule (not available in @typescript-eslint 8.x)
  - Removed invalid `importBinding` selector (not supported in 8.x)
  - Updated default selector to allow both `camelCase` and `PascalCase` for imports and object properties
  - Added `objectLiteralProperty` selector to allow flexible naming for object properties
  - Updated TypeScript config and documentation examples

## [1.3.0] - 2025-11-20

### Added

- **51 New ESLint Rules**: Comprehensive rule set aligned with industry standards (Airbnb, Google, Netflix, Microsoft)
  - **7 Code Quality Rules** (Base Config):
    - `complexity`: Limit cyclomatic complexity to 10
    - `max-depth`: Restrict nesting to 3 levels
    - `max-lines-per-function`: Functions under 50 lines (with blank line/comment exceptions)
    - `max-statements`: Max 20 statements per function
    - `no-nested-ternary`: Enforce clarity over conciseness
    - `no-bitwise`: Warn on bitwise operations
    - `prefer-exponentiation-operator`: Modern `**` syntax for exponentiation

  - **35+ TypeScript Rules** (TypeScript Config):
    - **Naming Conventions**: camelCase variables, PascalCase types, UPPER_SNAKE_CASE enums, boolean prefix enforcement (is/has/can/should/will/did)
    - **Async/Promise Safety**: await-thenable, no-floating-promises, no-misused-promises, only-throw-error
    - **Type Checking**: no-explicit-any (warn), no-inferrable-types, prefer-nullish-coalescing, prefer-optional-chain
    - **Explicit Return Types**: Function return types with allowances for expressions and typed functions

  - **7 Jest Rules** (Jest Config):
    - `jest/no-commented-out-tests`: Warn on commented tests
    - `jest/no-duplicate-hooks`: Error on duplicate hooks
    - `jest/prefer-hooks-in-order`: Warn on hooks not in order
    - `jest/prefer-lowercase-title`: Enforce lowercase test titles (except describe)
    - `jest/prefer-equality-matcher`: Use `toBe` over `toEqual` for primitives
    - `jest/prefer-each`: Prefer parametrized tests
    - `jest/no-test-return-statement`: Error on return statements in tests (changed from warn)

  - **3 Import Rules** (Node Config):
    - `import/no-cycle`: Detect circular dependencies (warn)
    - `import/no-self-import`: Error on self-imports
    - `import/consistent-type-specifier-style`: Enforce top-level type imports

- **Industry Standards Documentation**: Added comprehensive "Industry Standards Compliance" section to README
  - 100% alignment with Airbnb, Google, Netflix, and Microsoft standards
  - Detailed explanations of each rule category and rationale
  - Code examples showing best practices

### Fixed

- **ESLint Config Generation**: Fixed postinstall.js and migrate.js to generate correct ESLint v9 flat config format
  - Corrected spread operator usage: `...baseConfig` for arrays, direct inclusion for objects (`securityConfig`)
  - Updated import paths from `@kitiumai/lint` to `@kitiumai/lint/eslint`
  - Fixed module export names (eslintNodeConfig → nodeConfig, etc.)

- **Deprecated ESLint Rules**: Removed non-existent rules from security.js
  - Removed: `security/detect-buffer-noalloc`, `security/detect-child-process`, `security/detect-pseudoRandomBytes`
  - Removed non-existent rule: `no-math-random`
  - All remaining security rules verified with eslint-plugin-security v3.0.0

- **Automatic Deprecation Cleanup**: Added `removeDeprecatedEslintIgnore()` function to postinstall.js
  - Automatically removes deprecated `.eslintignore` file on project setup
  - ESLint v9 uses flat config exclusions instead

- **Node.js Modules Sync**: Updated `logger/node_modules/@kitiumai/lint/eslint/security.js` to match source
  - Keeps installed package in sync with source changes
  - Prevents desync issues during development

- **Example Configurations**: Updated all 10+ example files to use correct spread operator patterns
  - vanilla-typescript.eslint.config.js
  - vanilla-javascript.eslint.config.js
  - node-app.eslint.config.js and .cjs variant
  - react-app.eslint.config.js and .cjs variant
  - nextjs.eslint.config.js
  - vue.eslint.config.js
  - graphql-api.eslint.config.js
  - monorepo.eslint.config.js

- **Logger Project**: Fixed eslint.config.js to use correct imports and spread operators

- **Design Tokens Project**:
  - Fixed eslint.config.js to use correct imports and spread operators
  - Replaced `console.warn()` statements with `ConsoleLogger` from @kitiumai/logger for structured logging

### Changed

- **ESLint v9 Compatibility**: Full validation of all rules against ESLint v9 flat config format
- **Rule Severity Levels**: Standardized rule severity to production-ready levels
  - Errors for critical issues (type safety, security, testing correctness)
  - Warnings for best practices (complexity, style preference, performance)

### Documentation

- Added comprehensive "Industry Standards Compliance" section to README.md
  - Standards alignment (Airbnb, Google, Netflix, Microsoft)
  - Code Quality Standards with examples
  - TypeScript Type Safety Standards with naming conventions
  - Jest Testing Best Practices
  - Import Best Practices
  - Framework-Specific Standards

### Compatibility

- ✅ ESLint 9.39.1 (flat config format)
- ✅ @typescript-eslint 8.x
- ✅ eslint-plugin-jest (optional)
- ✅ eslint-plugin-security v3.0.0
- ✅ eslint-plugin-react-hooks ^4.6.0
- ✅ All other peer dependencies verified

## [1.2.7] - 2025-11-19

### Fixed

- **TypeScript Config Compatibility**: Simplified TypeScript ESLint configuration for @typescript-eslint v8.x compatibility
  - Removed rules that don't exist in v8.x (ban-types, explicit-function-return-types, type-annotation-spacing, etc.)
  - Kept only rules verified to work in v8.47.0 and newer versions
  - Enabled type information with `project: true` for rules that require type checking
  - Package now works out of the box with @typescript-eslint v8.x
- **Plugin Import Fix**: Changed `eslint-plugin-node` import to `eslint-plugin-n` in security.js (updated package name)

## [1.2.6] - 2025-11-19

### Fixed

- graphql peer dependency fixed

## [1.2.4] - 2025-11-19

### Fixed

- **Dependency Fix**: Fixed `eslint-plugin-react-hooks` version constraint from `^4.7.0` to `^4.6.0` to use available versions
- **GraphQL Optional**: Moved `graphql` and `eslint-plugin-graphql` from hard dependencies to optional peer dependencies
  - GraphQL configuration is now only required when using the GraphQL ESLint config
  - Users without GraphQL projects no longer need to install these packages
  - Users can still use the GraphQL config by explicitly installing `graphql` and `eslint-plugin-graphql`

## [1.2.0] - 2025-11-19

### Added

- **Interactive Setup System**: Smart postinstall prompts for tool and project type selection
  - Prompts for ESLint, TSLint, and Prettier configuration
  - Project type selection (Node.js, React, Next.js, Vue, Angular, Svelte)
  - Automatic project type detection from package.json dependencies
  - Configuration storage in `.kitium-lint-setup.json`
  - Re-runs on subsequent installs show saved configuration

- **Angular Support**: New `eslintAngularConfig` for Angular framework
  - Directive and component selector conventions
  - Lifecycle method validation
  - TypeScript member ordering and accessibility rules
  - Full Angular best practices enforcement

- **Svelte Support**: New `eslintSvelteConfig` for Svelte framework
  - Svelte component best practices
  - Block language configuration (TypeScript, SCSS)
  - Template validation and directive usage rules
  - Component structure enforcement

- **TSLint Support**: Optional TSLint configuration alongside ESLint
  - Creates `tslint.json` when selected during setup
  - Includes recommended TSLint rules and best practices
  - Works alongside ESLint for comprehensive TypeScript linting

- **Migration Tool**: Standalone migration script for existing configurations
  - Detects ESLint v8/v9 and TSLint configurations
  - Detects Prettier configurations
  - Preserves custom rules while adopting @kitiumai/lint as base
  - Creates automatic backups with timestamps
  - Optional prompts for each config (non-destructive)
  - Non-interactive mode support via environment variables

- **Conditional Configuration**: Smart file creation based on user selections
  - Creates only selected config files
  - Generates only selected npm scripts
  - Adds `.eslintignore` and `.prettierignore` when needed
  - Respects existing configurations

- **Auto-Detection for Existing Projects**: Migration script detects project type
  - Detects Angular from `@angular/core` dependency
  - Detects Svelte from `svelte` dependency
  - Detects React, Next.js, Vue, Node.js from dependencies
  - Selects appropriate base config automatically

### Changed

- Enhanced `package.json` scripts generation to be conditional
- Updated ESLint config exports to include Angular and Svelte
- Improved project type detection logic in migration script

### Documentation

- Added comprehensive guide for interactive setup
- Added migration tool usage examples
- Added Angular and Svelte configuration documentation
- Added examples for all supported frameworks

## [1.1.0] - 2024-11-19

### Added

- `createKitiumPlugin` helper to merge custom rules into the Kitium ESLint plugin.
- `createKitiumConfig` helper to append extra rules/plugins/overrides to the Kitium configuration.
- Documentation and examples showing how to extend Kitium lint behavior.
- Tests covering the new customization APIs.

## [1.0.0] - 2024-11-19

### Added

- Kitium custom ESLint plugin and config (`eslintKitiumConfig`) for enforcing component naming, prop/event typing, and required exports.
- Documentation updates describing the new configuration and when to enable it.
- Initial release of @kitiumai/lint package
- ESLint base configuration with core JavaScript/TypeScript rules
- ESLint React configuration with hooks and accessibility rules
- ESLint Node.js configuration with security scanning
- ESLint TypeScript configuration with strict type checking
- Prettier code formatting configuration
- TypeScript configurations for Base, React, and Node.js projects
- Comprehensive documentation and examples
- npm scripts for linting, formatting, and type checking
- Security-focused rules and best practices
- Support for flat ESLint config format
- Module exports for flexible configuration composition
- Full React/JSX support with a11y rules
- TypeScript strict mode enabled by default
- Simple import sorting rules for clean imports
- Comprehensive documentation with usage examples

### Features

- ✅ Modular and composable configurations
- ✅ Enterprise-grade security rules
- ✅ Type safety with TypeScript strict mode
- ✅ React and React Hooks support
- ✅ Accessibility (a11y) compliance
- ✅ Code formatting with Prettier
- ✅ Zero-configuration setup
- ✅ Full IDE integration support
- ✅ Monorepo compatible
- Jest configuration for unit testing
- Testing Library rules for React component tests
- GraphQL configuration
- Vue.js configuration support
- Next.js specific configuration
- Additional security plugins and rules
- Git hooks setup (husky integration)
- Custom shareable configurations for specific patterns
