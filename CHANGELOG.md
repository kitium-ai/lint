# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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
