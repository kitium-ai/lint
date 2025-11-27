/**
 * Tests for package exports
 */

import assert from "node:assert";
import { test } from "node:test";

import * as lintPackage from "../index.js";

test("should export all ESLint configurations", () => {
  const expectedExports = [
    "eslintBaseConfig",
    "eslintGraphQLConfig",
    "eslintJestConfig",
    "eslintKitiumConfig",
    "eslintNextjsConfig",
    "eslintNodeConfig",
    "eslintReactConfig",
    "eslintSecurityConfig",
    "eslintTestingLibraryConfig",
    "eslintTypeScriptConfig",
    "eslintVueConfig",
  ];

  for (const exportName of expectedExports) {
    assert(exportName in lintPackage, `should export ${exportName}`);
  }
});

test("should export prettierConfig", () => {
  assert("prettierConfig" in lintPackage, "should export prettierConfig");
  assert(
    typeof lintPackage.prettierConfig === "object",
    "prettierConfig should be an object",
  );
});

test("should export config presets", () => {
  const expectedPresets = [
    "all",
    "fullstack",
    "graphql_api",
    "library",
    "minimal",
    "monorepo",
    "nextjs_app",
    "node_api",
    "react_spa",
    "vue_spa",
  ];

  for (const presetName of expectedPresets) {
    assert(presetName in lintPackage, `should export ${presetName} preset`);
  }
});

test("should export huskyConfig", () => {
  assert("huskyConfig" in lintPackage, "should export huskyConfig");
});

test("all exports should be defined", () => {
  const exports = Object.keys(lintPackage);
  assert(exports.length > 0, "should have exports");
  for (const exportName of exports) {
    assert(
      lintPackage[exportName] !== undefined,
      `${exportName} should be defined`,
    );
  }
});
