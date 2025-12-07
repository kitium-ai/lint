#!/usr/bin/env node

/**
 * Post-install script for @kitiumai/lint
 * Interactive setup to configure ESLint v9, TSLint, and Prettier
 * Stores user preferences and creates appropriate config files
 */

import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { ensureSharedConfigs } from '@kitiumai/scripts/dx';
import { log, pathExists, readJson, writeJson } from '@kitiumai/scripts/utils';

import { detectExistingConfigs, removeDeprecatedEslintIgnore } from './shared/config-files.js';
import { buildEslintPreset, normalizeProjectType } from './shared/eslint-presets.js';
import { findProjectRoot, promptChoice, promptYesNo } from './utils.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const SETUP_CONFIG_FILE = '.kitium-lint-setup.json';
const SECURITY_DEFAULT_PROJECTS = new Set(['react', 'nextjs', 'vanilla-js', 'vanilla-ts']);

/**
 * Validates Node.js version compatibility
 */
function validateEnvironment() {
  const nodeVersion = process.version;
  const majorVersion = parseInt(nodeVersion.slice(1).split('.')[0]);

  if (majorVersion < 18) {
    log('warn', `Node.js ${nodeVersion} detected. @kitiumai/lint requires Node.js ≥18.0.0`);
  }

  // Check if running in npm install context
  if (!process.env.npm_lifecycle_event) {
    log('warn', 'Not running in npm install context. This is normal if running manually.');
  }
}

/**
 * Load or create setup configuration
 */
async function loadOrCreateSetupConfig(projectRoot) {
  const configPath = join(projectRoot, SETUP_CONFIG_FILE);

  if (await pathExists(configPath)) {
    try {
      return await readJson(configPath);
    } catch {
      // Return default if file is invalid
    }
  }

  return null;
}

/**
 * Save setup configuration
 */
async function saveSetupConfig(projectRoot, config) {
  const configPath = join(projectRoot, SETUP_CONFIG_FILE);
  await writeJson(configPath, config);
}

/**
 * Shows troubleshooting guide for common issues
 */
function showTroubleshootingGuide() {
  log(
    'info',
    `
📋 Troubleshooting Guide
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

If the postinstall script doesn't create config files, try:

1. **Run setup using the npm script (recommended):**
   npm run setup:lint

2. **Check if npm scripts are disabled:**
   npm config get ignore-scripts
   npm config set ignore-scripts false

3. **Verify ESLint installation:**
   npm list eslint

4. **Run postinstall script directly:**
   node node_modules/@kitiumai/lint/scripts/postinstall.js

5. **Check Node.js version (≥18.0.0 required):**
   node --version

6. **For pnpm users:**
   pnpm install
   pnpm exec npm run setup:lint

7. **For yarn users:**
   yarn install
   yarn setup:lint

Need help? https://github.com/kitium-ai/lint/issues
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
`
  );
}

async function auditSharedConfigAdoption(projectRoot) {
  try {
    const results = await ensureSharedConfigs({
      root: projectRoot,
      requireTsconfig: false,
      requireEslint: true,
    });
    if (results.length === 0) {
      log('success', 'Shared config audit passed: project consumes @kitiumai/config presets.');
      return;
    }
    log('warn', 'Shared config audit detected issues:');
    results.forEach((result) => {
      log('warn', `  • ${result.packageDir}`);
      result.issues.forEach((issue) => log('info', `    - ${issue}`));
    });
    log(
      'info',
      'Install @kitiumai/config and extend the shared tsconfig/eslint presets to stay aligned with org standards.'
    );
  } catch (error) {
    log('warn', `Could not run shared config audit: ${error.message}`);
  }
}

/**
 * Create ESLint v9 config (flat config format)
 */
// eslint-disable-next-line max-lines-per-function
function createEslintV9Config(projectRoot, projectType) {
  const eslintConfigPath = join(projectRoot, 'eslint.config.js');

  // eslint-disable-next-line security/detect-non-literal-fs-filename
  if (existsSync(eslintConfigPath)) {
    log('success', 'ESLint v9 configuration already exists');
    return;
  }

  const normalizedProjectType = normalizeProjectType(projectType);
  const includeSecurity = SECURITY_DEFAULT_PROJECTS.has(normalizedProjectType);
  const preset = buildEslintPreset(normalizedProjectType, {
    includeSecurity,
  });
  const imports = preset.imports.join(', ');
  const configs = preset.layers.join(',\n  ');

  const eslintConfigContent = `/**
 * ESLint Configuration (v9 - Flat Config)
 * Uses @kitiumai/lint as the base configuration
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
    name: 'project-overrides',
    files: ['**/*.{js,jsx,ts,tsx}'],
    rules: {
      // Add your project-specific rule overrides here
    },
  },
];
`;

  try {
    // eslint-disable-next-line security/detect-non-literal-fs-filename
    writeFileSync(eslintConfigPath, eslintConfigContent, 'utf-8');
    log('success', 'Created eslint.config.js (ESLint v9 flat config)');
  } catch (error) {
    log('error', `Failed to create eslint.config.js: ${error.message}`);
  }
}

/**
 * Create TSLint config
 */
function createTslintConfig(projectRoot) {
  const tslintConfigPath = join(projectRoot, 'tslint.json');

  // eslint-disable-next-line security/detect-non-literal-fs-filename
  if (existsSync(tslintConfigPath)) {
    log('success', 'TSLint configuration already exists');
    return;
  }

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
    },
    exclude: ['node_modules', 'dist', 'build', '.next'],
  };

  try {
    // eslint-disable-next-line security/detect-non-literal-fs-filename
    writeFileSync(tslintConfigPath, JSON.stringify(tslintConfig, null, 2), 'utf-8');
    log('success', 'Created tslint.json');
  } catch (error) {
    log('error', `Failed to create tslint.json: ${error.message}`);
  }
}

/**
 * Create Prettier config
 */
function createPrettierConfig(projectRoot) {
  const prettierConfigPath = join(projectRoot, '.prettierrc.js');
  const prettierIgnorePath = join(projectRoot, '.prettierignore');

  // eslint-disable-next-line security/detect-non-literal-fs-filename
  if (existsSync(prettierConfigPath)) {
    log('success', 'Prettier configuration already exists');
  } else {
    const prettierConfigContent = `/**
 * Prettier Configuration
 * Uses @kitiumai/lint prettier configuration as a base
 */

import { prettierConfig } from '@kitiumai/lint';

export default {
  ...prettierConfig,
  // Add project-specific overrides here
};
`;

    try {
      // eslint-disable-next-line security/detect-non-literal-fs-filename
      writeFileSync(prettierConfigPath, prettierConfigContent, 'utf-8');
      log('success', 'Created .prettierrc.js');
    } catch (error) {
      log('error', `Failed to create .prettierrc.js: ${error.message}`);
    }
  }

  // eslint-disable-next-line security/detect-non-literal-fs-filename
  if (!existsSync(prettierIgnorePath)) {
    const prettierIgnoreContent = `node_modules
dist
build
.next
out
.venv
venv
.env
.env.local
.env.*.local
*.log
.DS_Store
.cache
.turbo
`;

    try {
      // eslint-disable-next-line security/detect-non-literal-fs-filename
      writeFileSync(prettierIgnorePath, prettierIgnoreContent, 'utf-8');
      log('success', 'Created .prettierignore');
    } catch (error) {
      log('error', `Failed to create .prettierignore: ${error.message}`);
    }
  } else {
    log('success', '.prettierignore already exists');
  }
}

/**
 * Create Commitlint config
 */
function createCommitlintConfig(projectRoot) {
  const commitlintConfigPath = join(projectRoot, '.commitlintrc.js');

  // eslint-disable-next-line security/detect-non-literal-fs-filename
  if (existsSync(commitlintConfigPath)) {
    log('success', 'Commitlint configuration already exists');
    return;
  }

  const commitlintConfigContent = `/**
 * Commitlint Configuration
 * Enforces conventional commit format for consistent commit messages
 */

export default {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      [
        'feat',
        'fix',
        'docs',
        'style',
        'refactor',
        'perf',
        'test',
        'chore',
        'ci',
        'revert',
        'build',
        'security',
      ],
    ],
    'scope-case': [2, 'always', 'lower-case'],
    'subject-case': [2, 'always', 'lower-case'],
    'subject-empty': [2, 'never'],
    'subject-full-stop': [2, 'never', '.'],
    'header-max-length': [2, 'always', 100],
  },
};
`;

  try {
    // eslint-disable-next-line security/detect-non-literal-fs-filename
    writeFileSync(commitlintConfigPath, commitlintConfigContent, 'utf-8');
    log('success', 'Created .commitlintrc.js');
  } catch (error) {
    log('error', `Failed to create .commitlintrc.js: ${error.message}`);
  }
}

/**
 * Create ESLint ignore file
 */
function createEslintIgnore(projectRoot) {
  const eslintIgnorePath = join(projectRoot, '.eslintignore');

  // eslint-disable-next-line security/detect-non-literal-fs-filename
  if (existsSync(eslintIgnorePath)) {
    log('success', '.eslintignore already exists');
    return;
  }

  const eslintIgnoreContent = `node_modules
dist
build
.next
out
.venv
venv
.env
.env.local
.env.*.local
*.log
.DS_Store
.cache
.turbo
coverage
`;

  try {
    // eslint-disable-next-line security/detect-non-literal-fs-filename
    writeFileSync(eslintIgnorePath, eslintIgnoreContent, 'utf-8');
    log('success', 'Created .eslintignore');
  } catch (error) {
    log('error', `Failed to create .eslintignore: ${error.message}`);
  }
}

/**
 * Update package.json with selected scripts
 */
// eslint-disable-next-line max-lines-per-function, complexity
async function updatePackageJson(packageJsonPath, config) {
  try {
    // eslint-disable-next-line security/detect-non-literal-fs-filename
    const packageJsonContent = readFileSync(packageJsonPath, 'utf-8');
    const packageJson = JSON.parse(packageJsonContent);

    if (!packageJson.scripts) {
      packageJson.scripts = {};
    }

    const scriptsToAdd = {};
    let updated = false;

    // Always add setup:lint script for manual setup re-runs
    scriptsToAdd['setup:lint'] = 'node node_modules/@kitiumai/lint/scripts/postinstall.js';

    // Add ESLint scripts if selected
    if (config.eslint) {
      scriptsToAdd.lint = 'eslint .';
      scriptsToAdd['lint:fix'] = 'eslint . --fix';
    }

    // Add TSLint scripts if selected
    if (config.tslint) {
      scriptsToAdd['lint:tslint'] = "tslint -c tslint.json --project tsconfig.json '**/*.ts'";
      scriptsToAdd['lint:tslint:fix'] =
        "tslint -c tslint.json --project tsconfig.json --fix '**/*.ts'";
    }

    // Add Prettier scripts if selected
    if (config.prettier) {
      scriptsToAdd.format = 'prettier --write .';
      scriptsToAdd['format:check'] = 'prettier --check .';
    }

    // Check for existing scripts and ask about replacement (but not for setup:lint)
    const existingScripts = Object.keys(scriptsToAdd)
      .filter((script) => script !== 'setup:lint')
      .filter((script) => packageJson.scripts[script]);

    let shouldReplace = true;
    if (existingScripts.length > 0) {
      log('warn', '\n⚠️  Found existing scripts in your package.json:');
      existingScripts.forEach((script) => {
        log('info', `   "${script}": "${packageJson.scripts[script]}"`);
      });

      shouldReplace = await promptYesNo('\nReplace them with @kitiumai/lint scripts?', true);
    }

    // Add or update scripts
    for (const [scriptName, scriptValue] of Object.entries(scriptsToAdd)) {
      if (!packageJson.scripts[scriptName]) {
        packageJson.scripts[scriptName] = scriptValue;
        updated = true;
        log('success', `Added "${scriptName}" script`);
      } else if (packageJson.scripts[scriptName] !== scriptValue && shouldReplace) {
        packageJson.scripts[scriptName] = scriptValue;
        updated = true;
        log('success', `Updated "${scriptName}" script`);
      }
    }

    if (updated) {
      const updatedContent = `${JSON.stringify(packageJson, null, 2)}\n`;
      // eslint-disable-next-line security/detect-non-literal-fs-filename
      writeFileSync(packageJsonPath, updatedContent, 'utf-8');
      log('success', '\n✨ Updated package.json with selected scripts\n');
    }

    return updated;
  } catch (error) {
    log('error', `Error updating package.json: ${error.message}`);
    return false;
  }
}

/**
 * Interactive setup prompts
 */
// eslint-disable-next-line max-lines-per-function
async function interactiveSetup(projectRoot) {
  log('info', '\n🎯 @kitiumai/lint Setup\n');
  log('info', "Let's configure which tools you'd like to use for linting and formatting.\n");

  // Detect existing configs
  const existingConfigs = detectExistingConfigs(projectRoot);
  const hasExistingConfigs =
    existingConfigs.eslintV9 || existingConfigs.prettier || existingConfigs.tslint;

  // If existing configs found, offer migration
  if (hasExistingConfigs) {
    log('info', '📋 Found existing configurations:\n');
    if (existingConfigs.eslintV9) {
      log('info', `  ✓ ESLint v9: ${existingConfigs.eslintV9.split('/').pop()}`);
    }
    if (existingConfigs.prettier) {
      log('info', `  ✓ Prettier: ${existingConfigs.prettier.split('/').pop()}`);
    }
    if (existingConfigs.tslint) {
      log('info', `  ✓ TSLint: ${existingConfigs.tslint.split('/').pop()}\n`);
    }

    const useMigration = await promptYesNo(
      '\nWould you like to migrate these configs to @kitiumai/lint? (y/n)',
      true
    );

    if (useMigration) {
      log('info', '\n🚀 Running migration...\n');
      // Dynamic import to avoid circular dependencies

      const { execSync } = await import('node:child_process');
      try {
        execSync('node node_modules/@kitiumai/lint/scripts/migrate.js', {
          cwd: projectRoot,
          stdio: 'inherit',
        });
        log('success', '\n✨ Migration complete!\n');
        // Return empty config - migration handles everything
        return null;
      } catch {
        log('warn', '\n⚠️  Migration skipped. Running fresh setup instead.\n');
      }
    }
  }

  // Ask about ESLint
  const useESLint = await promptYesNo('Use ESLint v9 for JavaScript/TypeScript linting?', true);

  // Ask about TSLint
  const useTSLint = await promptYesNo('Use TSLint for additional TypeScript linting?', false);

  // Ask about Prettier
  const usePrettier = await promptYesNo('Use Prettier for code formatting?', true);

  // Ask about Commitlint
  const useCommitlint = await promptYesNo('Use Commitlint for conventional commit messages?', true);

  // Ask about project type (only if ESLint is selected)
  let projectType = 'node';
  if (useESLint) {
    const projectTypes = [
      'Node.js',
      'React',
      'Next.js',
      'Vue',
      'Angular',
      'Svelte',
      'Vanilla JavaScript',
      'Vanilla TypeScript',
    ];
    const selectedIndex = await promptChoice('\nSelect your project type:', projectTypes, 0);
    projectType = projectTypes[selectedIndex].toLowerCase();
  }

  const config = {
    eslint: useESLint,
    tslint: useTSLint,
    prettier: usePrettier,
    commitlint: useCommitlint,
    projectType,
    createdAt: new Date().toISOString(),
  };

  await saveSetupConfig(projectRoot, config);
  return config;
}

/**
 * Main execution function
 */
// eslint-disable-next-line max-lines-per-function, complexity
async function main() {
  // Validate environment first
  validateEnvironment();

  const projectRoot = findProjectRoot(__dirname);

  if (!projectRoot) {
    // Silently fail - normal for npm install of package itself
    return;
  }

  // Check if setup is already done
  let config = await loadOrCreateSetupConfig(projectRoot);
  const isNewSetup = !config;

  if (isNewSetup) {
    log('info', '\n🚀 @kitiumai/lint - Initial Setup\n');
    config = await interactiveSetup(projectRoot);
    // If migration was run, config will be null
    if (!config) {
      // Migration handled everything, we're done
      return;
    }
    log('info', '\n📝 Creating configuration files...\n');
  } else {
    log('info', '\n🚀 @kitiumai/lint - Setup Already Configured\n');
    log('info', `ESLint v9: ${config.eslint ? '✓' : '✗'}`);
    log('info', `TSLint: ${config.tslint ? '✓' : '✗'}`);
    log('info', `Prettier: ${config.prettier ? '✓' : '✗'}`);
    log('info', `Commitlint: ${config.commitlint ? '✓' : '✗'}`);
    log('info', `Project Type: ${config.projectType}\n`);
  }

  // Update package.json with selected scripts
  await updatePackageJson(join(projectRoot, 'package.json'), config);

  // Create configuration files based on selections
  if (config.eslint) {
    log('info', '📋 Creating ESLint v9 configuration...');
    removeDeprecatedEslintIgnore(projectRoot);
    createEslintV9Config(projectRoot, config.projectType);
    createEslintIgnore(projectRoot);
  }

  if (config.tslint) {
    createTslintConfig(projectRoot);
  }

  if (config.prettier) {
    createPrettierConfig(projectRoot);
  }

  if (config.commitlint) {
    createCommitlintConfig(projectRoot);
  }

  await auditSharedConfigAdoption(projectRoot);

  if (!isNewSetup) {
    log('success', '\n✨ @kitiumai/lint is ready to use with your existing configuration.\n');
  } else {
    log('success', '\n✨ @kitiumai/lint setup complete!\n');
    log('info', 'Quick start:');
    if (config.eslint) {
      log('info', '  npm run lint       - Check for linting issues');
      log('info', '  npm run lint:fix   - Auto-fix linting issues');
    }
    if (config.tslint) {
      log('info', '  npm run lint:tslint    - Check TypeScript linting issues');
    }
    if (config.prettier) {
      log('info', '  npm run format     - Format your code');
      log('info', '  npm run format:check   - Check code formatting\n');
    }
  }
}

/**
 * Detailed error handler with diagnostics and troubleshooting
 */
// eslint-disable-next-line max-lines-per-function, complexity
function handleSetupError(error) {
  console.error(`\n${'━'.repeat(70)}`);

  console.error('❌ SETUP ERROR');

  console.error(`${'━'.repeat(70)}\n`);

  console.error(`Error: ${error.message}\n`);

  // Categorize error and provide specific guidance
  const errorMessage = error.message.toLowerCase();
  const errorStack = error.stack || '';

  console.error('📋 Diagnostic Information:');

  console.error(`  • Node.js version: ${process.version}`);

  console.error(`  • npm version: ${process.env.npm_version || 'unknown'}`);

  console.error(`  • Current directory: ${process.cwd()}`);

  console.error(`  • npm lifecycle event: ${process.env.npm_lifecycle_event || 'none'}\n`);

  // Specific error handling
  if (errorMessage.includes('eacces') || errorMessage.includes('permission denied')) {
    console.error('🔒 Permission Issue Detected:\n');

    console.error('  This usually means @kitiumai/lint cannot write to the current directory.\n');

    console.error('  Try these solutions:\n');

    console.error('  1. Run with sudo (not recommended):');

    console.error('     sudo npm install @kitiumai/lint\n');

    console.error('  2. Fix npm permissions:');

    console.error('     mkdir ~/.npm-global');

    console.error("     npm config set prefix '~/.npm-global'\n");

    console.error('  3. Check directory ownership:');

    console.error('     ls -la package.json\n');
  } else if (errorMessage.includes('enoent') || errorMessage.includes('no such file')) {
    console.error('📁 File Not Found:\n');

    console.error('  A required file is missing. This might happen if:\n');

    console.error("  • package.json doesn't exist in the current directory");

    console.error('  • Running from the wrong directory\n');

    console.error('  Try these solutions:\n');

    console.error('  1. Verify package.json exists:');

    console.error('     ls -la package.json\n');

    console.error('  2. Run from the correct directory:');

    console.error('     cd /path/to/your/project\n');
  } else if (errorMessage.includes('json') || errorMessage.includes('parse')) {
    console.error('📝 Configuration Parse Error:\n');

    console.error('  Invalid JSON or configuration syntax detected.\n');

    console.error('  Try these solutions:\n');

    console.error('  1. Validate package.json:');

    console.error('     npm ls (checks for syntax errors)\n');

    console.error('  2. Reset setup configuration:');

    console.error('     rm .kitium-lint-setup.json\n');
  } else if (errorMessage.includes('timeout') || errorMessage.includes('timed out')) {
    console.error('⏱️  Timeout Error:\n');

    console.error('  The setup took too long to complete.\n');

    console.error('  Try these solutions:\n');

    console.error('  1. Run setup manually:');

    console.error('     node node_modules/@kitiumai/lint/scripts/postinstall.js\n');

    console.error('  2. Check your internet connection\n');

    console.error('  3. Clear npm cache:');

    console.error('     npm cache clean --force\n');
  }

  // Show general troubleshooting guide
  showTroubleshootingGuide();

  console.error('📚 Additional Resources:');

  console.error('  • Full error stack:');

  console.error(`    ${errorStack.split('\n').slice(0, 3).join('\n    ')}\n`);

  console.error('  • Report an issue:');

  console.error('    https://github.com/kitium-ai/lint/issues\n');

  console.error('  • Documentation:');

  console.error('    https://github.com/kitium-ai/lint#troubleshooting\n');

  console.error(`${'━'.repeat(70)}\n`);
}

// Run setup
(async () => {
  try {
    await main();
  } catch (error) {
    handleSetupError(error);
    process.exitCode = 1;
  }
})();
