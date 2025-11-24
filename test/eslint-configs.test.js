/**
 * Tests for ESLint configurations
 */

import assert from 'node:assert';
import { test } from 'node:test';

import {
  eslintBaseConfig,
  eslintGraphQLConfig,
  eslintJestConfig,
  eslintKitiumConfig,
  eslintNextjsConfig,
  eslintNodeConfig,
  eslintReactConfig,
  eslintSecurityConfig,
  eslintTestingLibraryConfig,
  eslintTypeScriptConfig,
  eslintVueConfig,
} from '../index.js';

test('eslintBaseConfig should export an array', () => {
  assert(Array.isArray(eslintBaseConfig), 'baseConfig should be an array');
  assert(eslintBaseConfig.length > 0, 'baseConfig should not be empty');
});

test('eslintBaseConfig should have correct structure', () => {
  const configWithRules = eslintBaseConfig.find((config) => Boolean(config.rules));
  assert(configWithRules, 'should include a config object with rules');

  const configWithLanguageOptions = eslintBaseConfig.find((config) =>
    Boolean(config.languageOptions)
  );
  assert(configWithLanguageOptions, 'should include language options');
});

test('eslintReactConfig should export an array', () => {
  assert(Array.isArray(eslintReactConfig), 'reactConfig should be an array');
  assert(eslintReactConfig.length > 0, 'reactConfig should not be empty');
});

test('eslintReactConfig should have React-specific rules', () => {
  const config = eslintReactConfig.find((c) => c.name === 'kitium/react');
  assert(config, 'should have react config');
  assert(config.plugins?.react, 'should have react plugin');
  assert(config.plugins?.['react-hooks'], 'should have react-hooks plugin');
  assert(config.plugins?.['jsx-a11y'], 'should have jsx-a11y plugin');
  assert(config.rules?.['react/display-name'], 'should have react rules');
});

test('eslintNodeConfig should export an array', () => {
  assert(Array.isArray(eslintNodeConfig), 'nodeConfig should be an array');
  assert(eslintNodeConfig.length > 0, 'nodeConfig should not be empty');
});

test('eslintNodeConfig should have Node.js-specific globals', () => {
  const config = eslintNodeConfig.find((c) => c.name === 'kitium/node');
  assert(config, 'should have node config');
  assert(config.languageOptions?.globals?.__dirname === 'readonly', 'should have __dirname global');
  assert(config.languageOptions?.globals?.require === 'readonly', 'should have require global');
  assert(config.plugins?.security, 'should have security plugin');
});

test('eslintTypeScriptConfig should export an array', () => {
  assert(Array.isArray(eslintTypeScriptConfig), 'typeScriptConfig should be an array');
  assert(eslintTypeScriptConfig.length > 0, 'typeScriptConfig should not be empty');
});

test('eslintTypeScriptConfig should have TypeScript parser', () => {
  const config = eslintTypeScriptConfig.find((c) => c.name === 'kitium/typescript');
  assert(config, 'should have typescript config');
  assert(config.languageOptions?.parser, 'should have TypeScript parser configured');
  assert(config.plugins?.['@typescript-eslint'], 'should have @typescript-eslint plugin');
  assert(config.rules?.['@typescript-eslint/no-explicit-any'], 'should have TypeScript rules');
});

test('eslintJestConfig should export an object', () => {
  assert(typeof eslintJestConfig === 'object', 'jestConfig should be an object');
  assert(eslintJestConfig.files, 'should have files pattern');
  assert(eslintJestConfig.plugins?.jest, 'should have jest plugin');
});

test('eslintJestConfig should have Jest globals', () => {
  assert(
    eslintJestConfig.languageOptions?.globals?.describe === 'readonly',
    'should have describe global'
  );
  assert(eslintJestConfig.languageOptions?.globals?.it === 'readonly', 'should have it global');
  assert(
    eslintJestConfig.languageOptions?.globals?.expect === 'readonly',
    'should have expect global'
  );
});

test('eslintTestingLibraryConfig should export an object', () => {
  assert(
    typeof eslintTestingLibraryConfig === 'object',
    'testingLibraryConfig should be an object'
  );
  assert(
    eslintTestingLibraryConfig.plugins?.['testing-library'],
    'should have testing-library plugin'
  );
});

test('eslintGraphQLConfig should export an object', () => {
  assert(typeof eslintGraphQLConfig === 'object', 'graphqlConfig should be an object');
  assert(eslintGraphQLConfig.plugins?.graphql, 'should have graphql plugin');
});

test('eslintVueConfig should export an object', () => {
  assert(typeof eslintVueConfig === 'object', 'vueConfig should be an object');
  assert(eslintVueConfig.plugins?.vue, 'should have vue plugin');
});

test('eslintNextjsConfig should export an object', () => {
  assert(typeof eslintNextjsConfig === 'object', 'nextjsConfig should be an object');
  assert(eslintNextjsConfig.plugins?.['@next/next'], 'should have @next/next plugin');
});

test('eslintSecurityConfig should export an object', () => {
  assert(typeof eslintSecurityConfig === 'object', 'securityConfig should be an object');
  assert(eslintSecurityConfig.plugins?.security, 'should have security plugin');
  assert(eslintSecurityConfig.plugins?.sonarjs, 'should have sonarjs plugin');
});

test('eslintKitiumConfig should export an array', () => {
  assert(Array.isArray(eslintKitiumConfig), 'kitiumConfig should be an array');
  assert(eslintKitiumConfig.length > 0, 'kitiumConfig should not be empty');
});

test('eslintKitiumConfig should have Kitium plugin', () => {
  const config = eslintKitiumConfig.find((c) => c.name === 'kitium/component-standards');
  assert(config, 'should have kitium config');
  assert(config.plugins?.kitium, 'should have kitium plugin');
  assert(config.rules?.['kitium/component-naming'], 'should have kitium rules');
});
