import kitiumPlugin, { configs as kitiumConfigs } from './plugins/kitium.js';

/**
 * Kitium component/style enforcement.
 * Applies custom rules that enforce Kitium component, props, and event conventions.
 */
export default [
  {
    name: 'kitium/component-standards',
    plugins: {
      kitium: kitiumPlugin,
    },
    rules: {
      ...kitiumConfigs.recommended.rules,
    },
  },
];
