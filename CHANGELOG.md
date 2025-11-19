# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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
