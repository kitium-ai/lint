#!/usr/bin/env node

/**
 * Migration Script for @kitiumai/lint
 * Migrates existing ESLint v9 and Prettier configurations
 * Preserves custom rules while adopting @kitiumai/lint as base
 *
 * Usage:
 *   npx @kitiumai/lint migrate
 *   node scripts/migrate.js
 */

import { readFileSync, renameSync, writeFileSync } from 'node:fs';
import { basename, dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { inspect } from 'node:util';

import { ensureSharedConfigs } from '@kitiumai/scripts/dx';
import { log } from '@kitiumai/scripts/utils';

import { detectExistingConfigs, removeDeprecatedEslintIgnore } from './shared/config-files.js';
import { buildEslintPreset, normalizeProjectType } from './shared/eslint-presets.js';
import { findProjectRoot, promptYesNo } from './utils.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * Parse Prettier configuration
 */
function parsePrettierConfig(configPath) {
  try {
    // eslint-disable-next-line security/detect-non-literal-fs-filename
    const content = readFileSync(configPath, 'utf-8');
    const extension = basename(configPath);

    // Handle JSON format
    if (extension.endsWith('.json') || extension === '.prettierrc') {
      return JSON.parse(content);
    }

    // Handle JS/CJS format

    const configObject = eval(
      `(${content.replace(/^module\.exports\s*=\s*/, '').replace(/^export\s+default\s+/, '')})`
    );
    return configObject;
  } catch (error) {
    log('error', `Error parsing Prettier config: ${error.message}`);
    return null;
  }
}

/**
 * Extract custom settings from Prettier config
 */
function extractPrettierCustomSettings(config) {
  if (!config) {
    return {};
  }

  // Prettier config is mostly custom settings
  // We'll preserve everything except @kitiumai/lint overrides if they exist
  const customSettings = { ...config };
  return customSettings;
}

/**
 * Parse TSLint configuration
 */
function parseTslintConfig(configPath) {
  try {
    // eslint-disable-next-line security/detect-non-literal-fs-filename
    const content = readFileSync(configPath, 'utf-8');
    return JSON.parse(content);
  } catch (error) {
    log('error', `Error parsing TSLint config: ${error.message}`);
    return null;
  }
}

/**
 * Extract custom rules from TSLint config
 */
function extractTslintCustomRules(config) {
  if (!config) {
    return { rules: {} };
  }

  const customRules = {
    rules: config.rules || {},
    extends: config.extends,
    rulesDirectory: config.rulesDirectory,
    exclude: config.exclude,
  };

  // Remove undefined values
  Object.keys(customRules).forEach((key) => {
    if (customRules[key] == null) {
      delete customRules[key];
    }
  });

  return customRules;
}

/**
 * Create migrated TSLint config
 */
function createMigratedTslintConfig(customRules) {
  const tslintConfig = {
    extends: ['tslint:recommended'],
    rules: {
      'no-console': {
        severity: 'warning',
      },
      'object-literal-sort-keys': false,
      'ordered-imports': [
        true,
        {
          'import-sources-order': 'lowercase-last',
          'named-imports-order': 'lowercase-last',
        },
      ],
      // Your existing custom rules have been preserved below
      ...customRules.rules,
    },
    exclude: customRules.exclude || ['node_modules', 'dist', 'build', '.next'],
  };

  // Add custom extends if they exist (but keep our base)
  if (customRules.extends && Array.isArray(customRules.extends)) {
    customRules.extends.forEach((extension) => {
      if (!tslintConfig.extends.includes(extension)) {
        tslintConfig.extends.push(extension);
      }
    });
  }

  return JSON.stringify(tslintConfig, null, 2);
}

/**
 * Create migrated ESLint config (flat config format)
 */
// eslint-disable-next-line max-lines-per-function
function createMigratedEslintConfig(customRules, projectType = 'node') {
  const preset = buildEslintPreset(projectType, { includeSecurity: false });
  const imports = preset.imports.join(', ');
  const configs = preset.layers.join(',\n  ');

  let configContent = `/**
 * ESLint Configuration - Migrated to @kitiumai/lint
 *
 * This configuration has been migrated from your existing ESLint setup.
 * Your custom rules have been preserved and layered on top of @kitiumai/lint base configs.
 *
 * To further customize, modify the 'migrated-custom-rules' config object below.
  * Supported base configs: node, react, nextjs, vue, angular, svelte
 */

import { ${imports} } from '@kitiumai/lint/eslint';

export default [
  {
    ignores: [
      'node_modules/',
      'dist/',
      'build/',
      '.next/',
      'out/',
      '.venv/',
      'venv/',
      '.env',
      '.env.local',
      '.env.*.local',
      '*.log',
      '.DS_Store',
      '.cache',
      '.turbo',
      'coverage/',
    ],
  },
  ${configs},
  {
    name: 'migrated-custom-rules',
    files: ['**/*.{js,jsx,ts,tsx}'],
    rules: {
      // Your existing custom rules have been preserved below
      // Modify these to customize your lint behavior
`;

  if (Object.keys(customRules.rules || {}).length > 0) {
    configContent += Object.entries(customRules.rules)
      .map(([rule, value]) => `      '${rule}': ${inspect(value)},`)
      .join('\n');
  } else {
    configContent += '      // Add your custom rules here\n';
  }

  configContent += `
    },
  },
`;

  // Add overrides if they exist
  if (customRules.overrides && customRules.overrides.length > 0) {
    configContent += `
  // Migrated overrides from your original config
`;
    customRules.overrides.forEach((override, index) => {
      configContent += `
  {
    name: 'migrated-override-${index}',
    files: ${inspect(override.files)},
    rules: {
`;
      if (override.rules) {
        configContent += Object.entries(override.rules)
          .map(([rule, value]) => `      '${rule}': ${inspect(value)},`)
          .join('\n');
      }
      configContent += `
    },
  },
`;
    });
  }

  configContent += `];
`;

  return configContent;
}

/**
 * Create migrated Prettier config
 */
function createMigratedPrettierConfig(customSettings) {
  let configContent = `/**
 * Prettier Configuration - Migrated to @kitiumai/lint
 *
 * This configuration extends @kitiumai/lint prettier config.
 * Your custom settings have been preserved below.
 */

import prettierConfig from '@kitiumai/lint/prettier';

export default {
  ...prettierConfig,
  // Your existing custom Prettier settings
`;

  if (Object.keys(customSettings || {}).length > 0) {
    Object.entries(customSettings).forEach(([key, value]) => {
      configContent += `  ${key}: ${inspect(value)},\n`;
    });
  } else {
    configContent += `  // Add your custom settings here\n`;
  }

  configContent += `};
`;

  return configContent;
}

/**
 * Backup original config file
 */
function backupConfigFile(filePath) {
  try {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
    const backupPath = `${filePath}.backup.${timestamp}`;
    // eslint-disable-next-line security/detect-non-literal-fs-filename
    renameSync(filePath, backupPath);
    log('success', `Backed up original config: ${basename(backupPath)}`);
    return backupPath;
  } catch (error) {
    log('error', `Failed to backup ${basename(filePath)}: ${error.message}`);
    return null;
  }
}

/**
 * Detect project type based on package.json and existing config
 */
// eslint-disable-next-line complexity
function detectProjectType(projectRoot, config) {
  // eslint-disable-next-line security/detect-non-literal-fs-filename
  const packageContent = readFileSync(join(projectRoot, 'package.json'), 'utf-8');
  const package_ = JSON.parse(packageContent);

  // Check dependencies
  if (package_.dependencies?.['@angular/core'] || package_.devDependencies?.['@angular/core']) {
    return normalizeProjectType('angular');
  }

  if (package_.dependencies?.svelte || package_.devDependencies?.svelte) {
    return normalizeProjectType('svelte');
  }

  if (package_.dependencies?.react || package_.devDependencies?.react) {
    if (package_.dependencies?.next || package_.devDependencies?.next) {
      return normalizeProjectType('nextjs');
    }
    return normalizeProjectType('react');
  }

  if (package_.dependencies?.vue || package_.devDependencies?.vue) {
    return normalizeProjectType('vue');
  }

  // Check extends in old config
  if (config?.extends) {
    const extendsString = String(config.extends).toLowerCase();
    if (extendsString.includes('angular')) {
      return normalizeProjectType('angular');
    }
    if (extendsString.includes('svelte')) {
      return normalizeProjectType('svelte');
    }
    if (extendsString.includes('react')) {
      return normalizeProjectType('react');
    }
    if (extendsString.includes('next')) {
      return normalizeProjectType('nextjs');
    }
    if (extendsString.includes('vue')) {
      return normalizeProjectType('vue');
    }
  }

  return normalizeProjectType('node');
}

/**
 * Main migration function
 */
// eslint-disable-next-line max-lines-per-function, complexity
async function main() {
  const projectRoot = findProjectRoot(__dirname);

  if (!projectRoot) {
    throw new Error('Could not find project root (package.json)');
  }

  log('info', '\n🔄 @kitiumai/lint Migration Tool\n');

  const configs = detectExistingConfigs(projectRoot);

  if (!configs.eslintV9 && !configs.prettier && !configs.tslint) {
    log('info', 'ℹ️  No existing ESLint v9, TSLint, or Prettier configurations found.');
    log('info', '   Run the postinstall setup to create fresh configurations.\n');
    return;
  }

  log('info', 'Found existing configurations:');
  if (configs.eslintV9) {
    log('info', `  ✓ ESLint v9 (flat config): ${basename(configs.eslintV9)}`);
  }
  if (configs.tslint) {
    log('info', `  ✓ TSLint: ${basename(configs.tslint)}`);
  }
  if (configs.prettier) {
    log('info', `  ✓ Prettier: ${basename(configs.prettier)}\n`);
  }

  // Prompt for migration
  const proceedESLint = configs.eslintV9
    ? await promptYesNo('Migrate ESLint v9 configuration?', true)
    : false;

  const proceedTSLint = configs.tslint
    ? await promptYesNo('Migrate TSLint configuration?', true)
    : false;

  const proceedPrettier = configs.prettier
    ? await promptYesNo('Migrate Prettier configuration?', true)
    : false;

  if (!proceedESLint && !proceedTSLint && !proceedPrettier) {
    log('info', '\n📝 Migration skipped.\n');
    return;
  }

  log('info', '\n⏳ Migrating configurations...\n');

  // Migrate ESLint
  if (proceedESLint) {
    log('info', '📦 Processing ESLint v9 (flat config)...');
    removeDeprecatedEslintIgnore(projectRoot);
    const configPath = configs.eslintV9;
    const eslintConfig = { rules: {}, overrides: [] };

    const projectType = detectProjectType(projectRoot, eslintConfig);
    const migratedESLint = createMigratedEslintConfig(eslintConfig, projectType);

    // Backup original
    backupConfigFile(configPath);

    // Write migrated config
    const newConfigPath = join(projectRoot, 'eslint.config.js');
    // eslint-disable-next-line security/detect-non-literal-fs-filename
    writeFileSync(newConfigPath, migratedESLint, 'utf-8');
    log('success', 'Created eslint.config.js\n');
  }

  // Migrate TSLint
  if (proceedTSLint) {
    log('info', '📦 Processing TSLint config...');
    const parsedTslint = parseTslintConfig(configs.tslint);
    const customRules = extractTslintCustomRules(parsedTslint);

    const migratedTslint = createMigratedTslintConfig(customRules);

    // Backup original
    backupConfigFile(configs.tslint);

    // Write migrated config
    const newConfigPath = join(projectRoot, 'tslint.json');
    // eslint-disable-next-line security/detect-non-literal-fs-filename
    writeFileSync(newConfigPath, migratedTslint, 'utf-8');
    log('success', 'Created tslint.json\n');
  }

  // Migrate Prettier
  if (proceedPrettier) {
    log('info', '📦 Processing Prettier config...');
    const parsedPrettier = parsePrettierConfig(configs.prettier);
    const customSettings = extractPrettierCustomSettings(parsedPrettier);

    const migratedPrettier = createMigratedPrettierConfig(customSettings);

    // Backup original
    backupConfigFile(configs.prettier);

    // Write migrated config
    const newConfigPath = join(projectRoot, '.prettierrc.js');
    // eslint-disable-next-line security/detect-non-literal-fs-filename
    writeFileSync(newConfigPath, migratedPrettier, 'utf-8');
    log('success', 'Created .prettierrc.js\n');
  }

  log('success', '✨ Migration complete!\n');
  log('info', 'Next steps:');
  log('info', '  1. Review the migrated configs');
  log('info', '  2. Test your project: npm run lint');
  log('info', '  3. The original configs are backed up with .backup timestamps\n');

  try {
    const auditResults = await ensureSharedConfigs({
      root: projectRoot,
      requireTsconfig: false,
      requireEslint: true,
    });
    if (auditResults.length === 0) {
      log('success', 'Shared config audit passed post-migration.');
    } else {
      log('warn', 'Shared config audit detected remaining issues:');
      auditResults.forEach((result) => {
        log('warn', `  • ${result.packageDir}`);
        result.issues.forEach((issue) => log('info', `    - ${issue}`));
      });
    }
  } catch (error) {
    log('warn', `Shared config audit skipped: ${error.message}`);
  }
}

/**
 * Detailed error handler for migration with diagnostics
 */
// eslint-disable-next-line max-lines-per-function, complexity
function handleMigrationError(error) {
  console.error(`\n${'━'.repeat(70)}`);

  console.error('❌ MIGRATION ERROR');

  console.error(`${'━'.repeat(70)}\n`);

  console.error(`Error: ${error.message}\n`);

  // Categorize error and provide specific guidance
  const errorMessage = error.message.toLowerCase();
  const errorStack = error.stack || '';

  console.error('📋 Diagnostic Information:');

  console.error(`  • Node.js version: ${process.version}`);

  console.error(`  • Current directory: ${process.cwd()}`);

  console.error(`  • npm lifecycle event: ${process.env.npm_lifecycle_event || 'none'}\n`);

  // Specific error handling
  if (errorMessage.includes('eacces') || errorMessage.includes('permission denied')) {
    console.error('🔒 Permission Issue Detected:\n');

    console.error('  The migration script cannot write to the current directory.\n');

    console.error('  Try these solutions:\n');

    console.error('  1. Check directory permissions:');

    console.error('     ls -la . | head\n');

    console.error('  2. Fix ownership if needed:');

    console.error('     sudo chown -R $USER:$USER .\n');

    console.error('  3. Try from a different directory with write access\n');
  } else if (errorMessage.includes('enoent') || errorMessage.includes('no such file')) {
    console.error('📁 Configuration File Not Found:\n');

    console.error('  The migration script cannot find your config file.\n');

    console.error('  Common causes:\n');

    console.error('  • Config file was deleted or moved');

    console.error('  • Running from wrong directory\n');

    console.error('  Try these solutions:\n');

    console.error('  1. List available configs:');

    console.error('     ls -la .eslintrc* .prettierrc* tslint.json\n');

    console.error('  2. Run migration from the correct directory:');

    console.error('     cd /path/to/your/project && npm run migrate\n');
  } else if (
    errorMessage.includes('json') ||
    errorMessage.includes('parse') ||
    errorMessage.includes('syntax')
  ) {
    console.error('📝 Configuration Parse Error:\n');

    console.error('  Invalid syntax or format in your config file.\n');

    console.error('  Common causes:\n');

    console.error('  • Malformed JSON (missing quotes, commas, etc.)');

    console.error('  • Invalid JavaScript syntax\n');

    console.error('  Try these solutions:\n');

    console.error('  1. Validate JSON config:');

    console.error('     cat .eslintrc.json | python -m json.tool\n');

    console.error('  2. Check for syntax errors:');

    console.error('     node -c .eslintrc.js (if using JS format)\n');

    console.error('  3. Fix config file manually before migration\n');
  } else if (errorMessage.includes('eval') || errorMessage.includes('expression')) {
    console.error('⚙️  Configuration Parsing Error:\n');

    console.error('  Could not evaluate your config file.\n');

    console.error('  Try these solutions:\n');

    console.error('  1. Ensure your config is valid JavaScript:');

    console.error('     node -c eslint.config.js\n');

    console.error('  2. Check for relative imports that need absolute paths\n');

    console.error('  3. Remove any non-JSON properties if using JSON format\n');
  } else if (errorMessage.includes('no project') || errorMessage.includes('not find')) {
    console.error('🔍 Project Not Found:\n');

    console.error('  The migration script could not locate a project.\n');

    console.error('  Requirements:\n');

    console.error('  • Requires a package.json file in the directory tree\n');

    console.error('  Try these solutions:\n');

    console.error('  1. Verify package.json exists:');

    console.error('     ls -la package.json\n');

    console.error('  2. Create one if missing:');

    console.error('     npm init -y\n');
  }

  console.error('💡 Migration Tips:');

  console.error('  • Backup your configs before migration:');

  console.error('    cp .eslintrc.json .eslintrc.json.backup\n');

  console.error('  • Run migration in non-interactive mode:');

  console.error('    MIGRATE_AUTO_YES=true npm run migrate\n');

  console.error('  • Test after migration:');

  console.error('    npm run lint -- --debug\n');

  console.error('📚 Additional Resources:');

  console.error('  • Full error stack:');

  console.error(`    ${errorStack.split('\n').slice(0, 3).join('\n    ')}\n`);

  console.error('  • Report an issue:');

  console.error('    https://github.com/kitium-ai/lint/issues\n');

  console.error('  • Documentation:');

  console.error('    https://github.com/kitium-ai/lint#migration-from-existing-configs\n');

  console.error(`${'━'.repeat(70)}\n`);
}

// Run migration
(async () => {
  try {
    await main();
  } catch (error) {
    handleMigrationError(error);
    process.exitCode = 1;
  }
})();
