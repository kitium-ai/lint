/**
 * Tests for Kitium customization helpers
 */

import assert from "node:assert";
import { test } from "node:test";

import {
  createKitiumConfig,
  createKitiumPlugin,
  eslintKitiumConfig,
} from "../index.js";

test("createKitiumPlugin merges additional rules and configs", () => {
  const customRule = {
    meta: {
      type: "suggestion",
      docs: { description: "Custom rule", recommended: false },
      schema: [],
    },
    create() {
      return {};
    },
  };

  const plugin = createKitiumPlugin({
    additionalRules: {
      "custom-rule": customRule,
    },
    recommendedRules: {
      "kitium/custom-rule": "error",
    },
  });

  assert(plugin.rules["custom-rule"], "should include custom rule");
  assert.strictEqual(
    plugin.configs.recommended.rules["kitium/custom-rule"],
    "error",
    "should merge recommended rule overrides",
  );
});

test("createKitiumConfig merges extra rules, plugins, and overrides", () => {
  const config = createKitiumConfig({
    additionalRules: {
      "kitium/custom-rule": "warn",
    },
    additionalPlugins: {
      customPlugin: { rules: {}, configs: {} },
    },
    overrides: [
      {
        name: "custom-override",
        rules: {
          "no-console": "off",
        },
      },
    ],
  });

  const kitiumEntry = config.find((entry) => entry.plugins?.kitium);
  assert(kitiumEntry, "should include kitium entry");
  assert.strictEqual(
    kitiumEntry.rules["kitium/custom-rule"],
    "warn",
    "should merge custom rules into kitium block",
  );
  assert(
    kitiumEntry.plugins.customPlugin,
    "should register additional plugins on kitium block",
  );

  assert.strictEqual(
    config.length,
    eslintKitiumConfig.length + 1,
    "should append overrides",
  );
  assert.strictEqual(
    config[config.length - 1].name,
    "custom-override",
    "should append custom overrides at the end",
  );
});
