/**
 * Helpers for extending Kitium ESLint configuration
 */

import kitiumConfig from './kitium.js';
import { warnIfDisablingCriticalRules } from './utils/critical-rules.js';

/**
 * Create a Kitium ESLint configuration with additional rules, plugins, or overrides.
 * @param {Object} options
 * @param {Record<string, any>} options.additionalRules - Custom rule overrides to merge
 * @param {Record<string, any>} options.additionalPlugins - Extra plugins to register
 * @param {Array<object>} options.overrides - Additional config objects to append
 * @param {Array<object>} options.baseConfig - Alternative base config to extend from
 * @returns {Array<object>} ESLint flat config array
 */
export function createKitiumConfig({
  additionalRules = {},
  additionalPlugins = {},
  overrides = [],
  baseConfig = kitiumConfig,
} = {}) {
  warnIfDisablingCriticalRules(additionalRules, 'createKitiumConfig additionalRules');

  const baseArray = Array.isArray(baseConfig) ? baseConfig : [baseConfig];

  const extendedBase = baseArray.map((config) => {
    if (!config || typeof config !== 'object') {
      return config;
    }

    if (config.plugins && config.plugins.kitium) {
      return {
        ...config,
        plugins: {
          ...config.plugins,
          ...additionalPlugins,
        },
        rules: {
          ...(config.rules ?? {}),
          ...additionalRules,
        },
      };
    }

    return { ...config };
  });

  return [...extendedBase, ...overrides];
}
