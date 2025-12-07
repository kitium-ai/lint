/**
 * Tests for Kitium custom ESLint plugin
 */

import assert from 'node:assert';
import { test } from 'node:test';

import kitiumPlugin from '../eslint/plugins/kitium.js';

test('kitiumPlugin should export rules and configs', () => {
  assert(kitiumPlugin.rules, 'should have rules');
  assert(kitiumPlugin.configs, 'should have configs');
  assert(typeof kitiumPlugin.rules === 'object', 'rules should be an object');
  assert(typeof kitiumPlugin.configs === 'object', 'configs should be an object');
});

test('kitiumPlugin should have all required rules', () => {
  const requiredRules = [
    'component-naming',
    'props-naming',
    'event-naming',
    'extends-base-props',
    'extends-base-component',
    'required-type-exports',
    'shared-config-dependency',
    'lint-config-extends-kitium',
  ];

  for (const ruleName of requiredRules) {
    assert(kitiumPlugin.rules[ruleName], `should have ${ruleName} rule`);
    assert(
      typeof kitiumPlugin.rules[ruleName].create === 'function',
      `${ruleName} rule should have create function`
    );
  }
});

test('kitiumPlugin should have recommended config', () => {
  assert(kitiumPlugin.configs.recommended, 'should have recommended config');
  assert(kitiumPlugin.configs.recommended.rules, 'recommended config should have rules');
});

test('component-naming rule should have correct structure', () => {
  const rule = kitiumPlugin.rules['component-naming'];
  assert(rule, 'should have component-naming rule');
  assert(rule.meta, 'rule should have meta');
  assert(rule.meta.type === 'suggestion', 'should be a suggestion rule');
  assert(rule.meta.docs, 'should have docs');
  assert(rule.create, 'should have create function');
  assert(typeof rule.create === 'function', 'create should be a function');
});

test('props-naming rule should have correct structure', () => {
  const rule = kitiumPlugin.rules['props-naming'];
  assert(rule, 'should have props-naming rule');
  assert(rule.meta, 'rule should have meta');
  assert(rule.meta.docs, 'should have docs');
  assert(rule.create, 'should have create function');
  assert(typeof rule.create === 'function', 'create should be a function');
});

test('event-naming rule should have correct structure', () => {
  const rule = kitiumPlugin.rules['event-naming'];
  assert(rule, 'should have event-naming rule');
  assert(rule.meta, 'rule should have meta');
  assert(rule.meta.docs, 'should have docs');
  assert(rule.create, 'should have create function');
  assert(typeof rule.create === 'function', 'create should be a function');
});

test('all rules should have create function', () => {
  for (const [ruleName, rule] of Object.entries(kitiumPlugin.rules)) {
    assert(rule.create, `${ruleName} should have create function`);
    assert(typeof rule.create === 'function', `${ruleName} create should be a function`);
    assert(rule.meta, `${ruleName} should have meta`);
    assert(rule.meta.docs, `${ruleName} should have docs`);
  }
});
