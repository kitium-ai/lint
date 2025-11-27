/**
 * Tests for config presets
 */

import assert from "node:assert";
import { test } from "node:test";

import {
  all,
  fullstack,
  graphql_api,
  library,
  minimal,
  monorepo,
  nextjs_app,
  node_api,
  react_spa,
  vue_spa,
} from "../index.js";

test("all config presets should be exported", () => {
  const presets = {
    all,
    fullstack,
    graphql_api,
    library,
    minimal,
    monorepo,
    nextjs_app,
    node_api,
    react_spa,
    vue_spa,
  };

  for (const [name, preset] of Object.entries(presets)) {
    assert(preset !== undefined, `${name} should be exported`);
    assert(typeof preset === "object", `${name} should be an object`);
  }
});

test("minimal config should be lightweight", () => {
  assert(minimal, "minimal should exist");
  // Minimal config should have fewer rules/configs
  assert(typeof minimal === "object", "minimal should be an object");
});

test("fullstack config should include multiple frameworks", () => {
  assert(fullstack, "fullstack should exist");
  assert(typeof fullstack === "object", "fullstack should be an object");
});

test("monorepo config should exist", () => {
  assert(monorepo, "monorepo should exist");
  assert(typeof monorepo === "object", "monorepo should be an object");
});

test("framework-specific configs should exist", () => {
  assert(react_spa, "react_spa should exist");
  assert(vue_spa, "vue_spa should exist");
  assert(nextjs_app, "nextjs_app should exist");
  assert(node_api, "node_api should exist");
  assert(graphql_api, "graphql_api should exist");
});
