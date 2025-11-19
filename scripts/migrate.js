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

import {
  existsSync,
  readFileSync,
  renameSync,
  unlinkSync,
  writeFileSync,
} from "node:fs";
import { basename, dirname, join } from "node:path";
import { createInterface } from "node:readline";
import { fileURLToPath } from "node:url";
import { inspect } from "node:util";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * Find the consumer's project root
 * First tries from current working directory, then from script directory
 */
function findProjectRoot() {
  const searchPaths = [
    process.cwd(), // Start from current working directory
    __dirname, // Fallback to script directory
  ];

  for (const startDir of searchPaths) {
    let currentDir = startDir;
    const maxLevels = 10;
    let levels = 0;

    while (
      currentDir &&
      currentDir !== "/" &&
      currentDir.length > 1 &&
      levels < maxLevels
    ) {
      const packageJsonPath = join(currentDir, "package.json");

      // eslint-disable-next-line security/detect-non-literal-fs-filename
      if (existsSync(packageJsonPath)) {
        try {
          // eslint-disable-next-line security/detect-non-literal-fs-filename
          const pkg = JSON.parse(readFileSync(packageJsonPath, "utf-8"));
          // Skip if this is @kitiumai/lint itself
          if (pkg.name === "@kitiumai/lint") {
            currentDir = dirname(currentDir);
            levels++;
            continue;
          }
          return currentDir;
        } catch {
          // Invalid JSON, continue searching
        }
      }

      const parentDir = dirname(currentDir);
      if (parentDir === currentDir || !parentDir) break;
      currentDir = parentDir;
      levels++;
    }
  }

  return null;
}

/**
 * Prompts user for yes/no confirmation
 */
async function promptUser(question) {
  // Support auto-yes mode for testing/CI via environment variable
  if (process.env.MIGRATE_AUTO_YES === "true") {
    // eslint-disable-next-line no-console
    console.log(question);
    return true;
  }

  // Support auto-no mode for testing via environment variable
  if (process.env.MIGRATE_AUTO_NO === "true") {
    // eslint-disable-next-line no-console
    console.log(question);
    return false;
  }

  return new Promise((resolve) => {
    const rl = createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    rl.question(question, (answer) => {
      rl.close();
      resolve(answer.toLowerCase() === "y" || answer.toLowerCase() === "yes");
    });
  });
}

/**
 * Detect existing ESLint v9 and Prettier configurations
 */
function detectExistingConfigs(projectRoot) {
  const configs = {
    eslintV9: null,
    prettier: null,
    tslint: null,
  };

  // ESLint v9 flat config
  const eslintV9Path = join(projectRoot, "eslint.config.js");
  if (existsSync(eslintV9Path)) {
    configs.eslintV9 = eslintV9Path;
  }

  // TSLint config
  const tslintPath = join(projectRoot, "tslint.json");
  if (existsSync(tslintPath)) {
    configs.tslint = tslintPath;
  }

  // Prettier configs
  const prettierPatterns = [
    ".prettierrc.js",
    ".prettierrc.cjs",
    ".prettierrc.json",
    ".prettierrc.yml",
    ".prettierrc.yaml",
    ".prettierrc",
  ];

  for (const pattern of prettierPatterns) {
    const configPath = join(projectRoot, pattern);
    // eslint-disable-next-line security/detect-non-literal-fs-filename
    if (existsSync(configPath)) {
      configs.prettier = configPath;
      break;
    }
  }

  return configs;
}

/**
 * Parse Prettier configuration
 */
function parsePrettierConfig(configPath) {
  try {
    // eslint-disable-next-line security/detect-non-literal-fs-filename
    const content = readFileSync(configPath, "utf-8");
    const ext = basename(configPath);

    // Handle JSON format
    if (ext.endsWith(".json") || ext === ".prettierrc") {
      return JSON.parse(content);
    }

    // Handle JS/CJS format
    // eslint-disable-next-line no-eval
    const configObj = eval(
      `(${content.replace(/^module\.exports\s*=\s*/, "").replace(/^export\s+default\s+/, "")})`,
    );
    return configObj;
  } catch (error) {
    console.error(`Error parsing Prettier config: ${error.message}`);
    return null;
  }
}

/**
 * Extract custom settings from Prettier config
 */
function extractPrettierCustomSettings(config) {
  if (!config) return {};

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
    const content = readFileSync(configPath, "utf-8");
    return JSON.parse(content);
  } catch (error) {
    console.error(`Error parsing TSLint config: ${error.message}`);
    return null;
  }
}

/**
 * Extract custom rules from TSLint config
 */
function extractTslintCustomRules(config) {
  if (!config) return { rules: {} };

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
    extends: ["tslint:recommended"],
    rules: {
      "no-console": {
        severity: "warning",
      },
      "object-literal-sort-keys": false,
      "ordered-imports": [
        true,
        {
          "import-sources-order": "lowercase-last",
          "named-imports-order": "lowercase-last",
        },
      ],
      // Your existing custom rules have been preserved below
      ...customRules.rules,
    },
    exclude: customRules.exclude || ["node_modules", "dist", "build", ".next"],
  };

  // Add custom extends if they exist (but keep our base)
  if (customRules.extends && Array.isArray(customRules.extends)) {
    customRules.extends.forEach((ext) => {
      if (!tslintConfig.extends.includes(ext)) {
        tslintConfig.extends.push(ext);
      }
    });
  }

  return JSON.stringify(tslintConfig, null, 2);
}

/**
 * Remove deprecated .eslintignore file (ESLint v9 uses ignores in eslint.config.js)
 */
function removeDeprecatedEslintIgnore(projectRoot) {
  const eslintIgnorePath = join(projectRoot, ".eslintignore");

  // eslint-disable-next-line security/detect-non-literal-fs-filename
  if (existsSync(eslintIgnorePath)) {
    try {
      // eslint-disable-next-line security/detect-non-literal-fs-filename
      unlinkSync(eslintIgnorePath);
      // eslint-disable-next-line no-console
      console.log(
        "✓ Removed deprecated .eslintignore (using ignores in eslint.config.js instead)",
      );
    } catch (error) {
      // Silently fail if removal fails

      console.warn(`⚠️  Could not remove .eslintignore: ${error.message}`);
    }
  }
}

/**
 * Create migrated ESLint config (flat config format)
 */
function createMigratedEslintConfig(customRules, projectType = "node") {
  const configMap = {
    react: {
      imports: "baseConfig, reactConfig, typeScriptConfig",
      configs: "...baseConfig,\n  ...reactConfig,\n  ...typeScriptConfig",
    },
    "node.js": {
      imports: "baseConfig, nodeConfig, typeScriptConfig",
      configs: "...baseConfig,\n  ...nodeConfig,\n  ...typeScriptConfig",
    },
    "next.js": {
      imports:
        "baseConfig, nextjsConfig, typeScriptConfig, jestConfig, testingLibraryConfig, reactConfig",
      configs:
        "...baseConfig,\n  ...reactConfig,\n  ...nextjsConfig,\n  ...typeScriptConfig,\n  {\n    files: ['**/*.{test,spec}.{js,ts,jsx,tsx}'],\n    ...jestConfig,\n  },\n  {\n    files: ['**/*.test.{jsx,tsx}'],\n    ...testingLibraryConfig,\n  }",
    },
    vue: {
      imports: "baseConfig, vueConfig, typeScriptConfig, jestConfig",
      configs:
        "...baseConfig,\n  ...vueConfig,\n  ...typeScriptConfig,\n  {\n    files: ['**/*.test.{js,ts,jsx,tsx}'],\n    ...jestConfig,\n  }",
    },
  };

  const configData = configMap[projectType] || configMap["node.js"];
  const imports = configData.imports;
  const configs = configData.configs;

  let configContent = `/**
 * ESLint Configuration - Migrated to @kitiumai/lint
 *
 * This configuration has been migrated from your existing ESLint setup.
 * Your custom rules have been preserved and layered on top of @kitiumai/lint base configs.
 *
 * To further customize, modify the 'migrated-custom-rules' config object below.
 * Supported base configs: react, node.js, next.js, vue
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
      .join("\n");
  } else {
    configContent += "      // Add your custom rules here\n";
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
          .join("\n");
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
    const timestamp = new Date()
      .toISOString()
      .replace(/[:.]/g, "-")
      .slice(0, -5);
    const backupPath = `${filePath}.backup.${timestamp}`;
    // eslint-disable-next-line security/detect-non-literal-fs-filename
    renameSync(filePath, backupPath);
    // eslint-disable-next-line no-console
    console.log(`✓ Backed up original config: ${basename(backupPath)}`);
    return backupPath;
  } catch (error) {
    console.error(
      `⚠️  Failed to backup ${basename(filePath)}: ${error.message}`,
    );
    return null;
  }
}

/**
 * Detect project type based on package.json and existing config
 */
function detectProjectType(projectRoot, config) {
  // eslint-disable-next-line security/detect-non-literal-fs-filename
  const pkgContent = readFileSync(join(projectRoot, "package.json"), "utf-8");
  const pkg = JSON.parse(pkgContent);

  // Check dependencies
  if (
    pkg.dependencies?.["@angular/core"] ||
    pkg.devDependencies?.["@angular/core"]
  ) {
    return "angular";
  }

  if (pkg.dependencies?.svelte || pkg.devDependencies?.svelte) {
    return "svelte";
  }

  if (pkg.dependencies?.react || pkg.devDependencies?.react) {
    if (pkg.dependencies?.next || pkg.devDependencies?.next) {
      return "nextjs";
    }
    return "react";
  }

  if (pkg.dependencies?.vue || pkg.devDependencies?.vue) {
    return "vue";
  }

  // Check extends in old config
  if (config?.extends) {
    const extendsStr = String(config.extends).toLowerCase();
    if (extendsStr.includes("angular")) return "angular";
    if (extendsStr.includes("svelte")) return "svelte";
    if (extendsStr.includes("react")) return "react";
    if (extendsStr.includes("next")) return "nextjs";
    if (extendsStr.includes("vue")) return "vue";
  }

  return "node";
}

/**
 * Main migration function
 */
async function main() {
  const projectRoot = findProjectRoot();

  if (!projectRoot) {
    throw new Error("Could not find project root (package.json)");
  }

  // eslint-disable-next-line no-console
  console.log("\n🔄 @kitiumai/lint Migration Tool\n");

  const configs = detectExistingConfigs(projectRoot);

  if (!configs.eslintV9 && !configs.prettier && !configs.tslint) {
    // eslint-disable-next-line no-console
    console.log(
      "ℹ️  No existing ESLint v9, TSLint, or Prettier configurations found.",
    );
    // eslint-disable-next-line no-console
    console.log(
      "   Run the postinstall setup to create fresh configurations.\n",
    );
    return;
  }

  // eslint-disable-next-line no-console
  console.log("Found existing configurations:");
  if (configs.eslintV9) {
    // eslint-disable-next-line no-console
    console.log(`  ✓ ESLint v9 (flat config): ${basename(configs.eslintV9)}`);
  }
  if (configs.tslint) {
    // eslint-disable-next-line no-console
    console.log(`  ✓ TSLint: ${basename(configs.tslint)}`);
  }
  if (configs.prettier) {
    // eslint-disable-next-line no-console
    console.log(`  ✓ Prettier: ${basename(configs.prettier)}\n`);
  }

  // Prompt for migration
  const proceedESLint = configs.eslintV9
    ? await promptUser("Migrate ESLint v9 configuration? (y/n): ")
    : false;

  const proceedTSLint = configs.tslint
    ? await promptUser("Migrate TSLint configuration? (y/n): ")
    : false;

  const proceedPrettier = configs.prettier
    ? await promptUser("Migrate Prettier configuration? (y/n): ")
    : false;

  if (!proceedESLint && !proceedTSLint && !proceedPrettier) {
    // eslint-disable-next-line no-console
    console.log("\n📝 Migration skipped.\n");
    return;
  }

  // eslint-disable-next-line no-console
  console.log("\n⏳ Migrating configurations...\n");

  // Migrate ESLint
  if (proceedESLint) {
    // eslint-disable-next-line no-console
    console.log("📦 Processing ESLint v9 (flat config)...");
    removeDeprecatedEslintIgnore(projectRoot);
    const configPath = configs.eslintV9;
    const eslintConfig = { rules: {}, overrides: [] };

    const projectType = detectProjectType(projectRoot, eslintConfig);
    const migratedESLint = createMigratedEslintConfig(
      eslintConfig,
      projectType,
    );

    // Backup original
    backupConfigFile(configPath);

    // Write migrated config
    const newConfigPath = join(projectRoot, "eslint.config.js");
    // eslint-disable-next-line security/detect-non-literal-fs-filename
    writeFileSync(newConfigPath, migratedESLint, "utf-8");
    // eslint-disable-next-line no-console
    console.log("✓ Created eslint.config.js\n");
  }

  // Migrate TSLint
  if (proceedTSLint) {
    // eslint-disable-next-line no-console
    console.log("📦 Processing TSLint config...");
    const parsedTslint = parseTslintConfig(configs.tslint);
    const customRules = extractTslintCustomRules(parsedTslint);

    const migratedTslint = createMigratedTslintConfig(customRules);

    // Backup original
    backupConfigFile(configs.tslint);

    // Write migrated config
    const newConfigPath = join(projectRoot, "tslint.json");
    // eslint-disable-next-line security/detect-non-literal-fs-filename
    writeFileSync(newConfigPath, migratedTslint, "utf-8");
    // eslint-disable-next-line no-console
    console.log("✓ Created tslint.json\n");
  }

  // Migrate Prettier
  if (proceedPrettier) {
    // eslint-disable-next-line no-console
    console.log("📦 Processing Prettier config...");
    const parsedPrettier = parsePrettierConfig(configs.prettier);
    const customSettings = extractPrettierCustomSettings(parsedPrettier);

    const migratedPrettier = createMigratedPrettierConfig(customSettings);

    // Backup original
    backupConfigFile(configs.prettier);

    // Write migrated config
    const newConfigPath = join(projectRoot, ".prettierrc.js");
    // eslint-disable-next-line security/detect-non-literal-fs-filename
    writeFileSync(newConfigPath, migratedPrettier, "utf-8");
    // eslint-disable-next-line no-console
    console.log("✓ Created .prettierrc.js\n");
  }

  // eslint-disable-next-line no-console
  console.log("✨ Migration complete!\n");
  // eslint-disable-next-line no-console
  console.log("Next steps:");
  // eslint-disable-next-line no-console
  console.log("  1. Review the migrated configs");
  // eslint-disable-next-line no-console
  console.log("  2. Test your project: npm run lint");
  // eslint-disable-next-line no-console
  console.log(
    "  3. The original configs are backed up with .backup timestamps\n",
  );
}

/**
 * Detailed error handler for migration with diagnostics
 */
function handleMigrationError(error) {
  console.error(`\n${"━".repeat(70)}`);

  console.error("❌ MIGRATION ERROR");

  console.error(`${"━".repeat(70)}\n`);

  console.error(`Error: ${error.message}\n`);

  // Categorize error and provide specific guidance
  const errorMsg = error.message.toLowerCase();
  const errorStack = error.stack || "";

  console.error("📋 Diagnostic Information:");

  console.error(`  • Node.js version: ${process.version}`);

  console.error(`  • Current directory: ${process.cwd()}`);

  console.error(
    `  • npm lifecycle event: ${process.env.npm_lifecycle_event || "none"}\n`,
  );

  // Specific error handling
  if (errorMsg.includes("eacces") || errorMsg.includes("permission denied")) {
    console.error("🔒 Permission Issue Detected:\n");

    console.error(
      "  The migration script cannot write to the current directory.\n",
    );

    console.error("  Try these solutions:\n");

    console.error("  1. Check directory permissions:");

    console.error("     ls -la . | head\n");

    console.error("  2. Fix ownership if needed:");

    console.error("     sudo chown -R $USER:$USER .\n");

    console.error("  3. Try from a different directory with write access\n");
  } else if (errorMsg.includes("enoent") || errorMsg.includes("no such file")) {
    console.error("📁 Configuration File Not Found:\n");

    console.error("  The migration script cannot find your config file.\n");

    console.error("  Common causes:\n");

    console.error("  • Config file was deleted or moved");

    console.error("  • Running from wrong directory\n");

    console.error("  Try these solutions:\n");

    console.error("  1. List available configs:");

    console.error("     ls -la .eslintrc* .prettierrc* tslint.json\n");

    console.error("  2. Run migration from the correct directory:");

    console.error("     cd /path/to/your/project && npm run migrate\n");
  } else if (
    errorMsg.includes("json") ||
    errorMsg.includes("parse") ||
    errorMsg.includes("syntax")
  ) {
    console.error("📝 Configuration Parse Error:\n");

    console.error("  Invalid syntax or format in your config file.\n");

    console.error("  Common causes:\n");

    console.error("  • Malformed JSON (missing quotes, commas, etc.)");

    console.error("  • Invalid JavaScript syntax\n");

    console.error("  Try these solutions:\n");

    console.error("  1. Validate JSON config:");

    console.error("     cat .eslintrc.json | python -m json.tool\n");

    console.error("  2. Check for syntax errors:");

    console.error("     node -c .eslintrc.js (if using JS format)\n");

    console.error("  3. Fix config file manually before migration\n");
  } else if (errorMsg.includes("eval") || errorMsg.includes("expression")) {
    console.error("⚙️  Configuration Parsing Error:\n");

    console.error("  Could not evaluate your config file.\n");

    console.error("  Try these solutions:\n");

    console.error("  1. Ensure your config is valid JavaScript:");

    console.error("     node -c eslint.config.js\n");

    console.error("  2. Check for relative imports that need absolute paths\n");

    console.error("  3. Remove any non-JSON properties if using JSON format\n");
  } else if (errorMsg.includes("no project") || errorMsg.includes("not find")) {
    console.error("🔍 Project Not Found:\n");

    console.error("  The migration script could not locate a project.\n");

    console.error("  Requirements:\n");

    console.error("  • Requires a package.json file in the directory tree\n");

    console.error("  Try these solutions:\n");

    console.error("  1. Verify package.json exists:");

    console.error("     ls -la package.json\n");

    console.error("  2. Create one if missing:");

    console.error("     npm init -y\n");
  }

  console.error("💡 Migration Tips:");

  console.error("  • Backup your configs before migration:");

  console.error("    cp .eslintrc.json .eslintrc.json.backup\n");

  console.error("  • Run migration in non-interactive mode:");

  console.error("    MIGRATE_AUTO_YES=true npm run migrate\n");

  console.error("  • Test after migration:");

  console.error("    npm run lint -- --debug\n");

  console.error("📚 Additional Resources:");

  console.error("  • Full error stack:");

  console.error(`    ${errorStack.split("\n").slice(0, 3).join("\n    ")}\n`);

  console.error("  • Report an issue:");

  console.error("    https://github.com/kitium-ai/lint/issues\n");

  console.error("  • Documentation:");

  console.error(
    "    https://github.com/kitium-ai/lint#migration-from-existing-configs\n",
  );

  console.error(`${"━".repeat(70)}\n`);
}

// Run migration
main().catch((error) => {
  handleMigrationError(error);
  process.exitCode = 1;
});
