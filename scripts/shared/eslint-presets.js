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
    imports: ['baseConfig', 'nodeConfig', 'typeScriptConfig', 'eslintConfigPrettier'],
    layers: ['...baseConfig', '...nodeConfig', '...typeScriptConfig', 'eslintConfigPrettier'],
  },
  react: {
    imports: ['baseConfig', 'reactConfig', 'typeScriptConfig', 'eslintConfigPrettier'],
    layers: ['...baseConfig', '...reactConfig', '...typeScriptConfig', 'eslintConfigPrettier'],
    securityPosition: 'before_prettier',
  },
  nextjs: {
    imports: [
      'baseConfig',
      'reactConfig',
      'nextjsConfig',
      'typeScriptConfig',
      'jestConfig',
      'testingLibraryConfig',
      'eslintConfigPrettier',
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
      'eslintConfigPrettier',
    ],
    securityPosition: 'before_typescript',
  },
  vue: {
    imports: ['baseConfig', 'vueConfig', 'typeScriptConfig', 'jestConfig', 'eslintConfigPrettier'],
    layers: [
      '...baseConfig',
      '...vueConfig',
      '...typeScriptConfig',
      `{
    files: ['**/*.test.{js,ts,jsx,tsx}'],
    ...jestConfig,
  }`,
      'eslintConfigPrettier',
    ],
  },
  angular: {
    imports: ['baseConfig', 'angularConfig', 'typeScriptConfig', 'eslintConfigPrettier'],
    layers: ['...baseConfig', '...angularConfig', '...typeScriptConfig', 'eslintConfigPrettier'],
  },
  svelte: {
    imports: ['baseConfig', 'svelteConfig', 'typeScriptConfig', 'eslintConfigPrettier'],
    layers: ['...baseConfig', '...svelteConfig', '...typeScriptConfig', 'eslintConfigPrettier'],
  },
  'vanilla-js': {
    imports: ['baseConfig', 'eslintConfigPrettier'],
    layers: ['...baseConfig', 'eslintConfigPrettier'],
    securityPosition: 'before_prettier',
  },
  'vanilla-ts': {
    imports: ['baseConfig', 'typeScriptConfig', 'eslintConfigPrettier'],
    layers: ['...baseConfig', '...typeScriptConfig', 'eslintConfigPrettier'],
    securityPosition: 'before_prettier',
  },
};

function insertSecurityLayer(layers, position) {
  if (!position) {
    return [...layers];
  }

  // Handle specific positions
  if (position === 'before_prettier') {
    const copy = [...layers];
    const prettierIndex = copy.indexOf('eslintConfigPrettier');
    const insertIndex = prettierIndex === -1 ? copy.length : prettierIndex;
    copy.splice(insertIndex, 0, 'securityConfig');
    return copy;
  }

  if (position === 'before_typescript') {
    const copy = [...layers];
    const tsIndex = copy.findIndex((layer) => layer.includes('typeScriptConfig'));
    const insertIndex = tsIndex === -1 ? copy.length : tsIndex;
    copy.splice(insertIndex, 0, 'securityConfig');
    return copy;
  }

  if (position === 'append') {
    return [...layers, 'securityConfig'];
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

  // Ensure eslintConfigPrettier is imported if used (it's in the definition already, but double check)
  if (!imports.includes('eslintConfigPrettier')) {
    imports.push('eslintConfigPrettier');
  }

  return { imports, layers };
}
