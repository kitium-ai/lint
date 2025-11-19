/**
 * Integration tests for ESLint configurations
 * Note: These tests validate config structure rather than actual ESLint execution
 * since ESLint 8 uses a different config format than the flat config used here
 */

import assert from "node:assert";
import { test } from "node:test";

import {
  eslintBaseConfig,
  eslintReactConfig,
  eslintTypeScriptConfig,
} from "../index.js";

test("eslintBaseConfig should have valid structure", () => {
  assert(Array.isArray(eslintBaseConfig), "should be an array");
  assert(eslintBaseConfig.length > 0, "should not be empty");

  const config = eslintBaseConfig[0];
  assert(config.name, "should have a name");
  assert(config.rules, "should have rules");
  assert(typeof config.rules === "object", "rules should be an object");
});

test("eslintBaseConfig should have common rules", () => {
  const config = eslintBaseConfig[0];
  assert(config.rules["no-var"], "should have no-var rule");
  assert(config.rules["prefer-const"], "should have prefer-const rule");
  assert(config.rules["no-console"], "should have no-console rule");
});

test("eslintReactConfig should have React-specific structure", () => {
  assert(Array.isArray(eslintReactConfig), "should be an array");
  assert(eslintReactConfig.length > 0, "should not be empty");

  const reactConfig = eslintReactConfig.find((c) => c.name === "kitium/react");
  assert(reactConfig, "should have react config");
  assert(reactConfig.plugins, "should have plugins");
  assert(reactConfig.plugins.react, "should have react plugin");
  assert(reactConfig.rules["react/display-name"], "should have react rules");
});

test("eslintTypeScriptConfig should have TypeScript-specific structure", () => {
  assert(Array.isArray(eslintTypeScriptConfig), "should be an array");
  assert(eslintTypeScriptConfig.length > 0, "should not be empty");

  const tsConfig = eslintTypeScriptConfig.find(
    (c) => c.name === "kitium/typescript",
  );
  assert(tsConfig, "should have typescript config");
  assert(tsConfig.languageOptions, "should have languageOptions");
  assert(tsConfig.languageOptions.parser, "should have parser");
  assert(
    tsConfig.rules["@typescript-eslint/no-explicit-any"],
    "should have TypeScript rules",
  );
});

test("configurations should have valid structure", () => {
  const configs = [eslintBaseConfig, eslintReactConfig, eslintTypeScriptConfig];

  for (const config of configs) {
    assert(Array.isArray(config), "should be an array");
    assert(config.length > 0, "should not be empty");

    for (const item of config) {
      assert(typeof item === "object", "config item should be an object");
      if (item.name) {
        assert(typeof item.name === "string", "name should be a string");
      }
      if (item.rules) {
        assert(typeof item.rules === "object", "rules should be an object");
      }
    }
  }
});
