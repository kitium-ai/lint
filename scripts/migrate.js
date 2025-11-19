#!/usr/bin/env node

/**
 * Migration Script for @kitiumai/lint
 * Migrates existing ESLint (v8 & v9) and Prettier configurations
 * Preserves custom rules while adopting @kitiumai/lint as base
 *
 * Usage:
 *   npx @kitiumai/lint migrate
 *   node scripts/migrate.js
 */

import { existsSync, readFileSync, writeFileSync, renameSync } from "node:fs";
import { dirname, join, basename } from "node:path";
import { fileURLToPath } from "node:url";
import { createInterface } from "node:readline";
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

    while (currentDir && currentDir !== "/" && currentDir.length > 1 && levels < maxLevels) {
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
 * Detect existing ESLint and Prettier configurations
 */
function detectExistingConfigs(projectRoot) {
  const configs = {
    eslintV8: null,
    eslintV9: null,
    prettier: null,
  };

  // ESLint v9 flat config (takes precedence)
  const eslintV9Path = join(projectRoot, "eslint.config.js");
  if (existsSync(eslintV9Path)) {
    configs.eslintV9 = eslintV9Path;
  }

  // ESLint v8 configs
  const eslintV8Patterns = [
    ".eslintrc.js",
    ".eslintrc.cjs",
    ".eslintrc.json",
    ".eslintrc.yml",
    ".eslintrc.yaml",
    ".eslintrc",
  ];

  for (const pattern of eslintV8Patterns) {
    const configPath = join(projectRoot, pattern);
    // eslint-disable-next-line security/detect-non-literal-fs-filename
    if (existsSync(configPath)) {
      configs.eslintV8 = configPath;
      break;
    }
  }

  // Prettier configs
  const prettierPatterns = [".prettierrc.js", ".prettierrc.cjs", ".prettierrc.json", ".prettierrc.yml", ".prettierrc.yaml", ".prettierrc"];

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
 * Parse ESLint v8 configuration
 */
function parseEslintV8Config(configPath) {
  try {
    // eslint-disable-next-line security/detect-non-literal-fs-filename
    const content = readFileSync(configPath, "utf-8");
    const ext = basename(configPath);

    // Handle JSON format
    if (ext.endsWith(".json") || ext === ".eslintrc") {
      return JSON.parse(content);
    }

    // Handle JS/CJS format - extract export default or module.exports
    let configObj;
    // eslint-disable-next-line no-eval
    configObj = eval(`(${content.replace(/^module\.exports\s*=\s*/, "").replace(/^export\s+default\s+/, "")})`);
    return configObj;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(`Error parsing ESLint v8 config: ${error.message}`);
    return null;
  }
}

/**
 * Extract custom rules from ESLint v8 config
 */
function extractEslintV8CustomRules(config) {
  if (!config) return { rules: {}, overrides: [] };

  const customRules = {
    rules: config.rules || {},
    overrides: config.overrides || [],
    env: config.env,
    parserOptions: config.parserOptions,
    settings: config.settings,
  };

  // Remove undefined values
  Object.keys(customRules).forEach((key) => {
    if (customRules[key] === undefined) {
      delete customRules[key];
    }
  });

  return customRules;
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
    let configObj;
    // eslint-disable-next-line no-eval
    configObj = eval(`(${content.replace(/^module\.exports\s*=\s*/, "").replace(/^export\s+default\s+/, "")})`);
    return configObj;
  } catch (error) {
    // eslint-disable-next-line no-console
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
 * Create migrated ESLint config (flat config format)
 */
function createMigratedEslintConfig(customRules, projectType = "node") {
  const configMap = {
    react: "eslintReactConfig, eslintTypeScriptConfig",
    node: "eslintNodeConfig, eslintTypeScriptConfig",
    nextjs: "eslintNextJsConfig, eslintTypeScriptConfig",
    vue: "eslintVueConfig, eslintTypeScriptConfig",
  };

  const imports = configMap[projectType] || configMap.node;

  let configContent = `/**
 * ESLint Configuration - Migrated to @kitiumai/lint
 *
 * This configuration has been migrated from your existing ESLint setup.
 * Your custom rules have been preserved and layered on top of @kitiumai/lint base configs.
 *
 * To further customize, modify the 'migrated-custom-rules' config object below.
 * Supported base configs: ${Object.keys(configMap).join(", ")}
 */

import { ${imports} } from '@kitiumai/lint';

export default [
  ${imports.split(",").map((s) => s.trim()).join(",\n  ")},
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

import { prettierConfig } from '@kitiumai/lint';

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
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-").slice(0, -5);
    const backupPath = `${filePath}.backup.${timestamp}`;
    // eslint-disable-next-line security/detect-non-literal-fs-filename
    renameSync(filePath, backupPath);
    // eslint-disable-next-line no-console
    console.log(`✓ Backed up original config: ${basename(backupPath)}`);
    return backupPath;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(`⚠️  Failed to backup ${basename(filePath)}: ${error.message}`);
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
    // eslint-disable-next-line no-console
    console.error("❌ Could not find project root (package.json)");
    process.exit(1);
  }

  // eslint-disable-next-line no-console
  console.log("\n🔄 @kitiumai/lint Migration Tool\n");

  const configs = detectExistingConfigs(projectRoot);

  if (!configs.eslintV8 && !configs.eslintV9 && !configs.prettier) {
    // eslint-disable-next-line no-console
    console.log("ℹ️  No existing ESLint or Prettier configurations found.");
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
  if (configs.eslintV8) {
    // eslint-disable-next-line no-console
    console.log(`  ✓ ESLint v8: ${basename(configs.eslintV8)}`);
  }
  if (configs.prettier) {
    // eslint-disable-next-line no-console
    console.log(`  ✓ Prettier: ${basename(configs.prettier)}\n`);
  }

  // Prompt for migration
  const proceedESLint = configs.eslintV8 || configs.eslintV9
    ? await promptUser("Migrate ESLint configuration? (y/n): ")
    : false;

  const proceedPrettier = configs.prettier
    ? await promptUser("Migrate Prettier configuration? (y/n): ")
    : false;

  if (!proceedESLint && !proceedPrettier) {
    // eslint-disable-next-line no-console
    console.log("\n📝 Migration skipped.\n");
    return;
  }

  // eslint-disable-next-line no-console
  console.log("\n⏳ Migrating configurations...\n");

  // Migrate ESLint
  if (proceedESLint) {
    let eslintConfig = null;
    const configPath = configs.eslintV9 || configs.eslintV8;

    if (configs.eslintV9) {
      // eslint-disable-next-line no-console
      console.log("📦 Processing ESLint v9 (flat config)...");
      // For v9, we'll just update it to add our configs
      eslintConfig = { rules: {}, overrides: [] };
      // eslint-disable-next-line no-console
      console.log("   ⚠️  Please manually review and merge your flat config rules.");
    } else {
      // eslint-disable-next-line no-console
      console.log("📦 Processing ESLint v8 config...");
      const parsedConfig = parseEslintV8Config(configPath);
      eslintConfig = extractEslintV8CustomRules(parsedConfig);
    }

    const projectType = detectProjectType(projectRoot, eslintConfig);
    const migratedESLint = createMigratedEslintConfig(eslintConfig, projectType);

    // Backup original
    const backupPath = backupConfigFile(configPath);

    // Write migrated config
    const newConfigPath = join(projectRoot, "eslint.config.js");
    // eslint-disable-next-line security/detect-non-literal-fs-filename
    writeFileSync(newConfigPath, migratedESLint, "utf-8");
    // eslint-disable-next-line no-console
    console.log("✓ Created eslint.config.js\n");
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
  console.log("  3. The original configs are backed up with .backup timestamps\n");
}

// Run migration
main().catch((error) => {
  // eslint-disable-next-line no-console
  console.error(`❌ Migration error: ${error.message}\n`);
  process.exit(1);
});
