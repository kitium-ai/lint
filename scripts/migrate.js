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

import { existsSync, readFileSync, renameSync, writeFileSync } from "node:fs";
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
 * Detect existing ESLint and Prettier configurations
 */
function detectExistingConfigs(projectRoot) {
  const configs = {
    eslintV8: null,
    eslintV9: null,
    prettier: null,
    tslint: null,
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
    // eslint-disable-next-line no-eval
    const configObj = eval(
      `(${content.replace(/^module\.exports\s*=\s*/, "").replace(/^export\s+default\s+/, "")})`,
    );
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
    // eslint-disable-next-line eqeqeq
    if (customRules[key] == null) {
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
    // eslint-disable-next-line no-eval
    const configObj = eval(
      `(${content.replace(/^module\.exports\s*=\s*/, "").replace(/^export\s+default\s+/, "")})`,
    );
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
 * Parse TSLint configuration
 */
function parseTslintConfig(configPath) {
  try {
    // eslint-disable-next-line security/detect-non-literal-fs-filename
    const content = readFileSync(configPath, "utf-8");
    return JSON.parse(content);
  } catch (error) {
    // eslint-disable-next-line no-console
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
    // eslint-disable-next-line eqeqeq
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
  ${imports
    .split(",")
    .map((s) => s.trim())
    .join(",\n  ")},
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
    // eslint-disable-next-line no-console
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

  if (
    !configs.eslintV8 &&
    !configs.eslintV9 &&
    !configs.prettier &&
    !configs.tslint
  ) {
    // eslint-disable-next-line no-console
    console.log(
      "ℹ️  No existing ESLint, TSLint, or Prettier configurations found.",
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
  if (configs.eslintV8) {
    // eslint-disable-next-line no-console
    console.log(`  ✓ ESLint v8: ${basename(configs.eslintV8)}`);
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
  const proceedESLint =
    configs.eslintV8 || configs.eslintV9
      ? await promptUser("Migrate ESLint configuration? (y/n): ")
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
    let eslintConfig = null;
    const configPath = configs.eslintV9 || configs.eslintV8;

    if (configs.eslintV9) {
      // eslint-disable-next-line no-console
      console.log("📦 Processing ESLint v9 (flat config)...");
      // For v9, we'll just update it to add our configs
      eslintConfig = { rules: {}, overrides: [] };
      // eslint-disable-next-line no-console
      console.log(
        "   ⚠️  Please manually review and merge your flat config rules.",
      );
    } else {
      // eslint-disable-next-line no-console
      console.log("📦 Processing ESLint v8 config...");
      const parsedConfig = parseEslintV8Config(configPath);
      eslintConfig = extractEslintV8CustomRules(parsedConfig);
    }

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
  // eslint-disable-next-line no-console
  console.error(`\n${"━".repeat(70)}`);
  // eslint-disable-next-line no-console
  console.error("❌ MIGRATION ERROR");
  // eslint-disable-next-line no-console
  console.error(`${"━".repeat(70)}\n`);

  // eslint-disable-next-line no-console
  console.error(`Error: ${error.message}\n`);

  // Categorize error and provide specific guidance
  const errorMsg = error.message.toLowerCase();
  const errorStack = error.stack || "";

  // eslint-disable-next-line no-console
  console.error("📋 Diagnostic Information:");
  // eslint-disable-next-line no-console
  console.error(`  • Node.js version: ${process.version}`);
  // eslint-disable-next-line no-console
  console.error(`  • Current directory: ${process.cwd()}`);
  // eslint-disable-next-line no-console
  console.error(
    `  • npm lifecycle event: ${process.env.npm_lifecycle_event || "none"}\n`,
  );

  // Specific error handling
  if (errorMsg.includes("eacces") || errorMsg.includes("permission denied")) {
    // eslint-disable-next-line no-console
    console.error("🔒 Permission Issue Detected:\n");
    // eslint-disable-next-line no-console
    console.error(
      "  The migration script cannot write to the current directory.\n",
    );
    // eslint-disable-next-line no-console
    console.error("  Try these solutions:\n");
    // eslint-disable-next-line no-console
    console.error("  1. Check directory permissions:");
    // eslint-disable-next-line no-console
    console.error("     ls -la . | head\n");
    // eslint-disable-next-line no-console
    console.error("  2. Fix ownership if needed:");
    // eslint-disable-next-line no-console
    console.error("     sudo chown -R $USER:$USER .\n");
    // eslint-disable-next-line no-console
    console.error("  3. Try from a different directory with write access\n");
  } else if (errorMsg.includes("enoent") || errorMsg.includes("no such file")) {
    // eslint-disable-next-line no-console
    console.error("📁 Configuration File Not Found:\n");
    // eslint-disable-next-line no-console
    console.error("  The migration script cannot find your config file.\n");
    // eslint-disable-next-line no-console
    console.error("  Common causes:\n");
    // eslint-disable-next-line no-console
    console.error("  • Config file was deleted or moved");
    // eslint-disable-next-line no-console
    console.error("  • Running from wrong directory\n");
    // eslint-disable-next-line no-console
    console.error("  Try these solutions:\n");
    // eslint-disable-next-line no-console
    console.error("  1. List available configs:");
    // eslint-disable-next-line no-console
    console.error("     ls -la .eslintrc* .prettierrc* tslint.json\n");
    // eslint-disable-next-line no-console
    console.error("  2. Run migration from the correct directory:");
    // eslint-disable-next-line no-console
    console.error("     cd /path/to/your/project && npm run migrate\n");
  } else if (
    errorMsg.includes("json") ||
    errorMsg.includes("parse") ||
    errorMsg.includes("syntax")
  ) {
    // eslint-disable-next-line no-console
    console.error("📝 Configuration Parse Error:\n");
    // eslint-disable-next-line no-console
    console.error("  Invalid syntax or format in your config file.\n");
    // eslint-disable-next-line no-console
    console.error("  Common causes:\n");
    // eslint-disable-next-line no-console
    console.error("  • Malformed JSON (missing quotes, commas, etc.)");
    // eslint-disable-next-line no-console
    console.error("  • Invalid JavaScript syntax\n");
    // eslint-disable-next-line no-console
    console.error("  Try these solutions:\n");
    // eslint-disable-next-line no-console
    console.error("  1. Validate JSON config:");
    // eslint-disable-next-line no-console
    console.error("     cat .eslintrc.json | python -m json.tool\n");
    // eslint-disable-next-line no-console
    console.error("  2. Check for syntax errors:");
    // eslint-disable-next-line no-console
    console.error("     node -c .eslintrc.js (if using JS format)\n");
    // eslint-disable-next-line no-console
    console.error("  3. Fix config file manually before migration\n");
  } else if (errorMsg.includes("eval") || errorMsg.includes("expression")) {
    // eslint-disable-next-line no-console
    console.error("⚙️  Configuration Parsing Error:\n");
    // eslint-disable-next-line no-console
    console.error("  Could not evaluate your config file.\n");
    // eslint-disable-next-line no-console
    console.error("  Try these solutions:\n");
    // eslint-disable-next-line no-console
    console.error("  1. Ensure your config is valid JavaScript:");
    // eslint-disable-next-line no-console
    console.error("     node -c eslint.config.js\n");
    // eslint-disable-next-line no-console
    console.error("  2. Check for relative imports that need absolute paths\n");
    // eslint-disable-next-line no-console
    console.error("  3. Remove any non-JSON properties if using JSON format\n");
  } else if (errorMsg.includes("no project") || errorMsg.includes("not find")) {
    // eslint-disable-next-line no-console
    console.error("🔍 Project Not Found:\n");
    // eslint-disable-next-line no-console
    console.error("  The migration script could not locate a project.\n");
    // eslint-disable-next-line no-console
    console.error("  Requirements:\n");
    // eslint-disable-next-line no-console
    console.error("  • Requires a package.json file in the directory tree\n");
    // eslint-disable-next-line no-console
    console.error("  Try these solutions:\n");
    // eslint-disable-next-line no-console
    console.error("  1. Verify package.json exists:");
    // eslint-disable-next-line no-console
    console.error("     ls -la package.json\n");
    // eslint-disable-next-line no-console
    console.error("  2. Create one if missing:");
    // eslint-disable-next-line no-console
    console.error("     npm init -y\n");
  }

  // eslint-disable-next-line no-console
  console.error("💡 Migration Tips:");
  // eslint-disable-next-line no-console
  console.error("  • Backup your configs before migration:");
  // eslint-disable-next-line no-console
  console.error("    cp .eslintrc.json .eslintrc.json.backup\n");
  // eslint-disable-next-line no-console
  console.error("  • Run migration in non-interactive mode:");
  // eslint-disable-next-line no-console
  console.error("    MIGRATE_AUTO_YES=true npm run migrate\n");
  // eslint-disable-next-line no-console
  console.error("  • Test after migration:");
  // eslint-disable-next-line no-console
  console.error("    npm run lint -- --debug\n");

  // eslint-disable-next-line no-console
  console.error("📚 Additional Resources:");
  // eslint-disable-next-line no-console
  console.error("  • Full error stack:");
  // eslint-disable-next-line no-console
  console.error(`    ${errorStack.split("\n").slice(0, 3).join("\n    ")}\n`);
  // eslint-disable-next-line no-console
  console.error("  • Report an issue:");
  // eslint-disable-next-line no-console
  console.error("    https://github.com/kitium-ai/lint/issues\n");
  // eslint-disable-next-line no-console
  console.error("  • Documentation:");
  // eslint-disable-next-line no-console
  console.error(
    "    https://github.com/kitium-ai/lint#migration-from-existing-configs\n",
  );
  // eslint-disable-next-line no-console
  console.error(`${"━".repeat(70)}\n`);
}

// Run migration
main().catch((error) => {
  handleMigrationError(error);
  process.exitCode = 1;
});
