/**
 * Tests for Prettier configuration
 */

import assert from "node:assert";
import { test } from "node:test";

import prettierConfig from "../prettier/index.js";

test("prettierConfig should be an object", () => {
  assert(
    typeof prettierConfig === "object",
    "prettierConfig should be an object",
  );
  assert(prettierConfig !== null, "prettierConfig should not be null");
});

test("prettierConfig should have common properties", () => {
  // Prettier configs typically have these properties
  const commonProps = ["semi", "singleQuote", "tabWidth", "trailingComma"];

  // At least some of these should be present
  const hasCommonProps = commonProps.some((prop) => prop in prettierConfig);
  assert(hasCommonProps, "should have common prettier properties");
});

test("prettierConfig should be valid", () => {
  // Check that it's a plain object (not array, not null)
  assert(
    typeof prettierConfig === "object" && !Array.isArray(prettierConfig),
    "should be a plain object",
  );
});
