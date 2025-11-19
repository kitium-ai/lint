#!/usr/bin/env node

/**
 * Post-install script for @kitiumai/lint
 * Interactive setup to configure ESLint, TSLint, and Prettier
 * Stores user preferences and creates appropriate config files
 * Supports both ESLint v8 and v9 with automatic version detection
 */

import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { createInterface } from "node:readline";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const SETUP_CONFIG_FILE = ".kitium-lint-setup.json";

/**
 * Validates Node.js version compatibility
 */
function validateEnvironment() {
  const nodeVersion = process.version;
  const majorVersion = parseInt(nodeVersion.slice(1).split(".")[0]);

  if (majorVersion < 18) {
    // eslint-disable-next-line no-console
    console.warn(
      `⚠️  Warning: Node.js ${nodeVersion} detected. @kitiumai/lint requires Node.js ≥18.0.0`,
    );
  }

  // Check if running in npm install context
  if (!process.env.npm_lifecycle_event) {
    // eslint-disable-next-line no-console
    console.warn(
      "⚠️  Not running in npm install context. This is normal if running manually.",
    );
  }
}

/**
 * Detects installed ESLint version
 * @returns {string} - Either "v9" or "v8" or null if not found
 */
function detectEslintVersion(projectRoot) {
  try {
    const packageJsonPath = join(projectRoot, "package.json");
    // eslint-disable-next-line security/detect-non-literal-fs-filename
    if (!existsSync(packageJsonPath)) {
      return null;
    }

    // eslint-disable-next-line security/detect-non-literal-fs-filename
    const packageJson = JSON.parse(readFileSync(packageJsonPath, "utf-8"));
    const eslintVersion =
      packageJson.devDependencies?.eslint ||
      packageJson.dependencies?.eslint ||
      packageJson.peerDependencies?.eslint;

    if (!eslintVersion) {
      return null;
    }

    // Parse version to determine major version
    const majorVersion = parseInt(eslintVersion.split(".")[0].replace(/[^0-9]/g, ""));
    return majorVersion === 9 ? "v9" : majorVersion === 8 ? "v8" : null;
  } catch {
    return null;
  }
}

/**
 * Find the consumer's project root
 * First tries from current working directory, then from script directory
 */
function findConsumerPackageJson() {
  const searchPaths = [
    process.cwd(), // Start from current working directory (where npm install was run)
    __dirname, // Fallback to script directory
  ];

  for (const startDir of searchPaths) {
    let currentDir = startDir;
    let levels = 0;
    const maxLevels = 10;

    while (
      currentDir &&
      currentDir !== "/" &&
      currentDir.length > 1 &&
      levels < maxLevels
    ) {
      // eslint-disable-next-line security/detect-non-literal-fs-filename
      const packageJsonPath = join(currentDir, "package.json");

      // eslint-disable-next-line security/detect-non-literal-fs-filename
      if (existsSync(packageJsonPath)) {
        try {
          // eslint-disable-next-line security/detect-non-literal-fs-filename
          const pkg = JSON.parse(readFileSync(packageJsonPath, "utf-8"));
          if (pkg.name === "@kitiumai/lint") {
            currentDir = dirname(currentDir);
            levels++;
            continue;
          }
          return packageJsonPath;
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
 * Supports environment variables for non-interactive mode
 */
async function promptYesNo(question, defaultAnswer = true) {
  // Support non-interactive mode via env vars for testing
  const setupESLint = process.env.SETUP_ESLINT;
  const setupTSLint = process.env.SETUP_TSLINT;
  const setupPrettier = process.env.SETUP_PRETTIER;

  if (typeof setupESLint !== "undefined" && question.includes("ESLint")) {
    // eslint-disable-next-line no-console
    console.log(`${question} [${setupESLint}]`);
    return setupESLint === "true";
  }
  if (typeof setupTSLint !== "undefined" && question.includes("TSLint")) {
    // eslint-disable-next-line no-console
    console.log(`${question} [${setupTSLint}]`);
    return setupTSLint === "true";
  }
  if (typeof setupPrettier !== "undefined" && question.includes("Prettier")) {
    // eslint-disable-next-line no-console
    console.log(`${question} [${setupPrettier}]`);
    return setupPrettier === "true";
  }

  return new Promise((resolve) => {
    const rl = createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    const defaultText = defaultAnswer ? "[Y/n]" : "[y/N]";
    rl.question(`${question} ${defaultText}: `, (answer) => {
      rl.close();
      if (answer === "") {
        resolve(defaultAnswer);
      } else {
        resolve(answer.toLowerCase() === "y" || answer.toLowerCase() === "yes");
      }
    });
  });
}

/**
 * Prompts user for choice selection
 * Supports environment variables for non-interactive mode
 */
async function promptChoice(question, choices, defaultIndex = 0) {
  const setupProjectType = process.env.SETUP_PROJECT_TYPE;

  // eslint-disable-next-line no-undefined
  if (setupProjectType !== undefined) {
    const index = choices.findIndex(
      (c) => c.toLowerCase() === setupProjectType.toLowerCase(),
    );
    // eslint-disable-next-line no-console
    console.log(`\n${question}`);
    choices.forEach((choice, idx) => {
      const marker = idx === (index >= 0 ? index : defaultIndex) ? ">" : " ";
      // eslint-disable-next-line no-console
      console.log(`  ${marker} ${idx + 1}. ${choice}`);
    });
    return index >= 0 ? index : defaultIndex;
  }

  return new Promise((resolve) => {
    const rl = createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    // eslint-disable-next-line no-console
    console.log(`\n${question}`);
    choices.forEach((choice, index) => {
      const marker = index === defaultIndex ? ">" : " ";
      // eslint-disable-next-line no-console
      console.log(`  ${marker} ${index + 1}. ${choice}`);
    });

    rl.question(
      `Select option (1-${choices.length}) [${defaultIndex + 1}]: `,
      (answer) => {
        rl.close();
        const selected = answer === "" ? defaultIndex : parseInt(answer) - 1;
        resolve(
          selected >= 0 && selected < choices.length ? selected : defaultIndex,
        );
      },
    );
  });
}

/**
 * Load or create setup configuration
 */
function loadOrCreateSetupConfig(projectRoot) {
  const configPath = join(projectRoot, SETUP_CONFIG_FILE);

  // eslint-disable-next-line security/detect-non-literal-fs-filename
  if (existsSync(configPath)) {
    try {
      // eslint-disable-next-line security/detect-non-literal-fs-filename
      return JSON.parse(readFileSync(configPath, "utf-8"));
    } catch {
      // Return default if file is invalid
    }
  }

  return null;
}

/**
 * Save setup configuration
 */
function saveSetupConfig(projectRoot, config) {
  const configPath = join(projectRoot, SETUP_CONFIG_FILE);
  // eslint-disable-next-line security/detect-non-literal-fs-filename
  writeFileSync(configPath, JSON.stringify(config, null, 2), "utf-8");
}

/**
 * Interactive setup prompts
 */
async function interactiveSetup(projectRoot) {
  // eslint-disable-next-line no-console
  console.log("\n🎯 @kitiumai/lint Setup\n");
  // eslint-disable-next-line no-console
  console.log(
    "Let's configure which tools you'd like to use for linting and formatting.\n",
  );

  // Ask about ESLint
  const useESLint = await promptYesNo(
    "Use ESLint for JavaScript/TypeScript linting?",
    true,
  );

  // Ask about TSLint
  const useTSLint = await promptYesNo(
    "Use TSLint for additional TypeScript linting?",
    false,
  );

  // Ask about Prettier
  const usePrettier = await promptYesNo(
    "Use Prettier for code formatting?",
    true,
  );

  // Ask about project type (only if ESLint is selected)
  let projectType = "node";
  if (useESLint) {
    const projectTypes = [
      "Node.js",
      "React",
      "Next.js",
      "Vue",
      "Angular",
      "Svelte",
    ];
    const selectedIndex = await promptChoice(
      "\nSelect your project type:",
      projectTypes,
      0,
    );
    projectType = projectTypes[selectedIndex].toLowerCase();
  }

  const config = {
    eslint: useESLint,
    tslint: useTSLint,
    prettier: usePrettier,
    projectType,
    createdAt: new Date().toISOString(),
  };

  saveSetupConfig(projectRoot, config);
  return config;
}

/**
 * Update package.json with selected scripts
 */
async function updatePackageJson(packageJsonPath, config) {
  try {
    // eslint-disable-next-line security/detect-non-literal-fs-filename
    const packageJsonContent = readFileSync(packageJsonPath, "utf-8");
    const packageJson = JSON.parse(packageJsonContent);

    if (!packageJson.scripts) {
      packageJson.scripts = {};
    }

    const scriptsToAdd = {};
    let updated = false;

    // Add ESLint scripts if selected
    if (config.eslint) {
      scriptsToAdd.lint = "eslint .";
      scriptsToAdd["lint:fix"] = "eslint . --fix";
    }

    // Add TSLint scripts if selected
    if (config.tslint) {
      scriptsToAdd["lint:tslint"] =
        "tslint -c tslint.json --project tsconfig.json '**/*.ts'";
      scriptsToAdd["lint:tslint:fix"] =
        "tslint -c tslint.json --project tsconfig.json --fix '**/*.ts'";
    }

    // Add Prettier scripts if selected
    if (config.prettier) {
      scriptsToAdd.format = "prettier --write .";
      scriptsToAdd["format:check"] = "prettier --check .";
    }

    // Check for existing scripts and ask about replacement
    const existingScripts = Object.keys(scriptsToAdd).filter(
      (script) => packageJson.scripts[script],
    );

    let shouldReplace = true;
    if (existingScripts.length > 0) {
      // eslint-disable-next-line no-console
      console.log("\n⚠️  Found existing scripts in your package.json:");
      existingScripts.forEach((script) => {
        // eslint-disable-next-line no-console
        console.log(`   "${script}": "${packageJson.scripts[script]}"`);
      });

      shouldReplace = await promptYesNo(
        "\nReplace them with @kitiumai/lint scripts?",
        true,
      );
    }

    // Add or update scripts
    for (const [scriptName, scriptValue] of Object.entries(scriptsToAdd)) {
      if (!packageJson.scripts[scriptName]) {
        packageJson.scripts[scriptName] = scriptValue;
        updated = true;
        // eslint-disable-next-line no-console
        console.log(`✓ Added "${scriptName}" script`);
      } else if (
        packageJson.scripts[scriptName] !== scriptValue &&
        shouldReplace
      ) {
        packageJson.scripts[scriptName] = scriptValue;
        updated = true;
        // eslint-disable-next-line no-console
        console.log(`✓ Updated "${scriptName}" script`);
      }
    }

    if (updated) {
      const updatedContent = `${JSON.stringify(packageJson, null, 2)}\n`;
      // eslint-disable-next-line security/detect-non-literal-fs-filename
      writeFileSync(packageJsonPath, updatedContent, "utf-8");
      // eslint-disable-next-line no-console
      console.log("\n✨ Updated package.json with selected scripts\n");
    }

    return updated;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(`Error updating package.json: ${error.message}`);
    return false;
  }
}

/**
 * Shows troubleshooting guide for common issues
 */
function showTroubleshootingGuide() {
  // eslint-disable-next-line no-console
  console.log(`
📋 Troubleshooting Guide
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

If the postinstall script doesn't create config files, try:

1. **Check if npm scripts are disabled:**
   npm config get ignore-scripts
   npm config set ignore-scripts false

2. **Verify ESLint installation:**
   npm list eslint

3. **Run setup manually:**
   node node_modules/@kitiumai/lint/scripts/postinstall.js

4. **Check Node.js version (≥18.0.0 required):**
   node --version

5. **For pnpm users:**
   pnpm install
   pnpm exec node node_modules/@kitiumai/lint/scripts/postinstall.js

6. **For yarn users:**
   yarn install
   yarn node node_modules/@kitiumai/lint/scripts/postinstall.js

Need help? https://github.com/kitium-ai/lint/issues
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
`);
}

/**
 * Create ESLint v9 config (flat config format)
 */
function createEslintV9Config(projectRoot, projectType) {
  const eslintConfigPath = join(projectRoot, "eslint.config.js");

  // eslint-disable-next-line security/detect-non-literal-fs-filename
  if (existsSync(eslintConfigPath)) {
    // eslint-disable-next-line no-console
    console.log("✓ ESLint v9 configuration already exists");
    return;
  }

  const configMap = {
    "node.js": "eslintNodeConfig, eslintTypeScriptConfig",
    react: "eslintReactConfig, eslintTypeScriptConfig",
    "next.js": "eslintNextJsConfig, eslintTypeScriptConfig",
    vue: "eslintVueConfig, eslintTypeScriptConfig",
    angular: "eslintAngularConfig, eslintTypeScriptConfig",
    svelte: "eslintSvelteConfig, eslintTypeScriptConfig",
  };

  const imports = configMap[projectType] || configMap["node.js"];

  const eslintConfigContent = `/**
 * ESLint Configuration (v9 - Flat Config)
 * Uses @kitiumai/lint as the base configuration
 */

import { ${imports} } from '@kitiumai/lint';

export default [
  ${imports
    .split(",")
    .map((s) => s.trim())
    .join(",\n  ")},
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
    writeFileSync(eslintConfigPath, eslintConfigContent, "utf-8");
    // eslint-disable-next-line no-console
    console.log("✓ Created eslint.config.js (ESLint v9 flat config)");
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(`Failed to create eslint.config.js: ${error.message}`);
  }
}

/**
 * Create ESLint v8 config (traditional .eslintrc.json format)
 */
function createEslintV8Config(projectRoot, projectType) {
  const eslintrcPath = join(projectRoot, ".eslintrc.json");

  // eslint-disable-next-line security/detect-non-literal-fs-filename
  if (existsSync(eslintrcPath)) {
    // eslint-disable-next-line no-console
    console.log("✓ ESLint v8 configuration already exists");
    return;
  }

  const configMap = {
    "node.js": ["@kitiumai/lint/eslint/node", "@kitiumai/lint/eslint/typescript"],
    react: ["@kitiumai/lint/eslint/react", "@kitiumai/lint/eslint/typescript"],
    "next.js": ["@kitiumai/lint/eslint/nextjs", "@kitiumai/lint/eslint/typescript"],
    vue: ["@kitiumai/lint/eslint/vue", "@kitiumai/lint/eslint/typescript"],
    angular: ["@kitiumai/lint/eslint/angular", "@kitiumai/lint/eslint/typescript"],
    svelte: ["@kitiumai/lint/eslint/svelte", "@kitiumai/lint/eslint/typescript"],
  };

  const extends_ = configMap[projectType] || configMap["node.js"];

  const eslintrcConfig = {
    extends: extends_,
    rules: {
      // Add your project-specific rule overrides here
    },
  };

  try {
    // eslint-disable-next-line security/detect-non-literal-fs-filename
    writeFileSync(
      eslintrcPath,
      JSON.stringify(eslintrcConfig, null, 2),
      "utf-8",
    );
    // eslint-disable-next-line no-console
    console.log("✓ Created .eslintrc.json (ESLint v8 traditional config)");
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(`Failed to create .eslintrc.json: ${error.message}`);
  }
}

/**
 * Create ESLint config based on detected version
 */
function createEslintConfig(projectRoot, projectType) {
  const eslintVersion = detectEslintVersion(projectRoot);

  if (eslintVersion === "v9") {
    createEslintV9Config(projectRoot, projectType);
  } else if (eslintVersion === "v8") {
    createEslintV8Config(projectRoot, projectType);
  } else {
    // Fallback to v9 if we can't detect
    // eslint-disable-next-line no-console
    console.log(
      "⚠️  Could not detect ESLint version. Creating v9 config (flat config format)...",
    );
    createEslintV9Config(projectRoot, projectType);
  }
}

/**
 * Create TSLint config
 */
function createTslintConfig(projectRoot) {
  const tslintConfigPath = join(projectRoot, "tslint.json");

  // eslint-disable-next-line security/detect-non-literal-fs-filename
  if (existsSync(tslintConfigPath)) {
    // eslint-disable-next-line no-console
    console.log("✓ TSLint configuration already exists");
    return;
  }

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
    },
    exclude: ["node_modules", "dist", "build", ".next"],
  };

  try {
    // eslint-disable-next-line security/detect-non-literal-fs-filename
    writeFileSync(
      tslintConfigPath,
      JSON.stringify(tslintConfig, null, 2),
      "utf-8",
    );
    // eslint-disable-next-line no-console
    console.log("✓ Created tslint.json");
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(`Failed to create tslint.json: ${error.message}`);
  }
}

/**
 * Create Prettier config
 */
function createPrettierConfig(projectRoot) {
  const prettierConfigPath = join(projectRoot, ".prettierrc.js");
  const prettierIgnorePath = join(projectRoot, ".prettierignore");

  // eslint-disable-next-line security/detect-non-literal-fs-filename
  if (existsSync(prettierConfigPath)) {
    // eslint-disable-next-line no-console
    console.log("✓ Prettier configuration already exists");
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
      writeFileSync(prettierConfigPath, prettierConfigContent, "utf-8");
      // eslint-disable-next-line no-console
      console.log("✓ Created .prettierrc.js");
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(`Failed to create .prettierrc.js: ${error.message}`);
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
      writeFileSync(prettierIgnorePath, prettierIgnoreContent, "utf-8");
      // eslint-disable-next-line no-console
      console.log("✓ Created .prettierignore");
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(`Failed to create .prettierignore: ${error.message}`);
    }
  } else {
    // eslint-disable-next-line no-console
    console.log("✓ .prettierignore already exists");
  }
}

/**
 * Create ESLint ignore file
 */
function createEslintIgnore(projectRoot) {
  const eslintIgnorePath = join(projectRoot, ".eslintignore");

  // eslint-disable-next-line security/detect-non-literal-fs-filename
  if (existsSync(eslintIgnorePath)) {
    // eslint-disable-next-line no-console
    console.log("✓ .eslintignore already exists");
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
    writeFileSync(eslintIgnorePath, eslintIgnoreContent, "utf-8");
    // eslint-disable-next-line no-console
    console.log("✓ Created .eslintignore");
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(`Failed to create .eslintignore: ${error.message}`);
  }
}

/**
 * Main execution function
 */
async function main() {
  // Validate environment first
  validateEnvironment();

  const consumerPackageJson = findConsumerPackageJson();

  if (!consumerPackageJson) {
    // Silently fail - normal for npm install of package itself
    return;
  }

  const projectRoot = dirname(consumerPackageJson);

  // Check if setup is already done
  let config = loadOrCreateSetupConfig(projectRoot);
  const isNewSetup = !config;

  if (isNewSetup) {
    // eslint-disable-next-line no-console
    console.log("\n🚀 @kitiumai/lint - Initial Setup\n");
    config = await interactiveSetup(projectRoot);
    // eslint-disable-next-line no-console
    console.log("\n📝 Creating configuration files...\n");
  } else {
    // eslint-disable-next-line no-console
    console.log("\n🚀 @kitiumai/lint - Setup Already Configured\n");
    // eslint-disable-next-line no-console
    console.log(`ESLint: ${config.eslint ? "✓" : "✗"}`);
    // eslint-disable-next-line no-console
    console.log(`TSLint: ${config.tslint ? "✓" : "✗"}`);
    // eslint-disable-next-line no-console
    console.log(`Prettier: ${config.prettier ? "✓" : "✗"}`);
    // eslint-disable-next-line no-console
    console.log(`Project Type: ${config.projectType}\n`);
  }

  // Update package.json with selected scripts
  await updatePackageJson(consumerPackageJson, config);

  // Create configuration files based on selections
  if (config.eslint) {
    // eslint-disable-next-line no-console
    console.log(
      "📋 Detecting ESLint version for optimal configuration...",
    );
    createEslintConfig(projectRoot, config.projectType);
    createEslintIgnore(projectRoot);
  }

  if (config.tslint) {
    createTslintConfig(projectRoot);
  }

  if (config.prettier) {
    createPrettierConfig(projectRoot);
  }

  if (!isNewSetup) {
    // eslint-disable-next-line no-console
    console.log(
      "\n✨ @kitiumai/lint is ready to use with your existing configuration.\n",
    );
  } else {
    // eslint-disable-next-line no-console
    console.log("\n✨ @kitiumai/lint setup complete!\n");
    // eslint-disable-next-line no-console
    console.log("Quick start:");
    if (config.eslint) {
      // eslint-disable-next-line no-console
      console.log("  npm run lint       - Check for linting issues");
      // eslint-disable-next-line no-console
      console.log("  npm run lint:fix   - Auto-fix linting issues");
    }
    if (config.tslint) {
      // eslint-disable-next-line no-console
      console.log("  npm run lint:tslint    - Check TypeScript linting issues");
    }
    if (config.prettier) {
      // eslint-disable-next-line no-console
      console.log("  npm run format     - Format your code");
      // eslint-disable-next-line no-console
      console.log("  npm run format:check   - Check code formatting\n");
    }
  }
}

// Run setup
main().catch((error) => {
  // eslint-disable-next-line no-console
  console.error(`\n❌ Setup error: ${error.message}\n`);
  showTroubleshootingGuide();
  process.exitCode = 1;
});
