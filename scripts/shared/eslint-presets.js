/**
 * Declarative descriptions of ESLint preset stacks used by our CLIs.
 * Both migrate.js and postinstall.js rely on these to stay in sync.
 */

const TYPE_ALIASES = {
  'node.js': 'node',
  node: 'node',
  nodejs: 'node',
  react: 'react',
  'react.js': 'react',
  next: 'nextjs',
  'next.js': 'nextjs',
  nextjs: 'nextjs',
  vue: 'vue',
  'vue.js': 'vue',
  angular: 'angular',
  svelte: 'svelte',
  'vanilla javascript': 'vanilla-js',
  'vanilla js': 'vanilla-js',
  'vanilla typescript': 'vanilla-ts',
  'vanilla ts': 'vanilla-ts',
};

const PRESET_DEFINITIONS = {
  node: {
    imports: ['baseConfig', 'nodeConfig', 'typeScriptConfig'],
    layers: ['...baseConfig', '...nodeConfig', '...typeScriptConfig'],
  },
  react: {
    imports: ['baseConfig', 'reactConfig', 'typeScriptConfig'],
    layers: ['...baseConfig', '...reactConfig', '...typeScriptConfig'],
    securityPosition: 'append',
  },
  nextjs: {
    imports: [
      'baseConfig',
      'reactConfig',
      'nextjsConfig',
      'typeScriptConfig',
      'jestConfig',
      'testingLibraryConfig',
    ],
    layers: [
      '...baseConfig',
      '...reactConfig',
      '...nextjsConfig',
      '...typeScriptConfig',
      `{
    files: ['**/*.{test,spec}.{js,ts,jsx,tsx}'],
    ...jestConfig,
  }`,
      `{
    files: ['**/*.test.{jsx,tsx}'],
    ...testingLibraryConfig,
  }`,
    ],
    securityPosition: 'before_typescript',
  },
  vue: {
    imports: ['baseConfig', 'vueConfig', 'typeScriptConfig', 'jestConfig'],
    layers: [
      '...baseConfig',
      '...vueConfig',
      '...typeScriptConfig',
      `{
    files: ['**/*.test.{js,ts,jsx,tsx}'],
    ...jestConfig,
  }`,
    ],
  },
  angular: {
    imports: ['baseConfig', 'angularConfig', 'typeScriptConfig'],
    layers: ['...baseConfig', '...angularConfig', '...typeScriptConfig'],
  },
  svelte: {
    imports: ['baseConfig', 'svelteConfig', 'typeScriptConfig'],
    layers: ['...baseConfig', '...svelteConfig', '...typeScriptConfig'],
  },
  'vanilla-js': {
    imports: ['baseConfig'],
    layers: ['...baseConfig'],
    securityPosition: 'append',
  },
  'vanilla-ts': {
    imports: ['baseConfig', 'typeScriptConfig'],
    layers: ['...baseConfig', '...typeScriptConfig'],
    securityPosition: 'append',
  },
};

function insertSecurityLayer(layers, position) {
  if (!position) {
    return [...layers];
  }

  if (position === 'append') {
    return [...layers, 'securityConfig'];
  }

  if (position === 'before_typescript') {
    const copy = [...layers];
    const tsIndex = copy.findIndex((layer) => layer.includes('typeScriptConfig'));
    const insertIndex = tsIndex === -1 ? copy.length : tsIndex;
    copy.splice(insertIndex, 0, 'securityConfig');
    return copy;
  }

  if (typeof position === 'number') {
    const copy = [...layers];
    copy.splice(position, 0, 'securityConfig');
    return copy;
  }

  return [...layers];
}

export function normalizeProjectType(projectType = '') {
  const key = projectType.trim().toLowerCase();
  return TYPE_ALIASES[key] ?? key ?? 'node';
}

export function buildEslintPreset(projectType, { includeSecurity = false } = {}) {
  const normalized = normalizeProjectType(projectType);
  const definition = PRESET_DEFINITIONS[normalized] ?? PRESET_DEFINITIONS.node;
  const imports = [...definition.imports];

  const layers =
    includeSecurity && definition.securityPosition
      ? insertSecurityLayer(definition.layers, definition.securityPosition)
      : [...definition.layers];

  if (includeSecurity && definition.securityPosition && !imports.includes('securityConfig')) {
    imports.push('securityConfig');
  }

  return { imports, layers };
}
