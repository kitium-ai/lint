#!/usr/bin/env node

/**
 * Post-install script for @kitiumai/lint
 * Automatically adds lint and prettier scripts to the consumer's package.json
 * and creates necessary configuration files
 */

import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { createInterface } from "node:readline";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Find the consumer's package.json
// When installed, the script runs from node_modules/@kitiumai/lint/scripts/
// We need to go up to find the consumer's package.json at the project root
function findConsumerPackageJson() {
  // Start from scripts/ directory
  let currentDir = __dirname;
  let levels = 0;
  const maxLevels = 10;

  // Go up: scripts/ -> lint/ -> @kitiumai/ -> node_modules/ -> project root
  // Or: scripts/ -> lint/ -> node_modules/ -> project root (scoped packages)
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
        // If this is the lint package itself, continue searching up
        if (pkg.name === "@kitiumai/lint") {
          currentDir = dirname(currentDir);
          levels++;
          continue;
        }
        // Found consumer's package.json
        return packageJsonPath;
      } catch {
        // Invalid JSON, continue searching
      }
    }

    const parentDir = dirname(currentDir);
    // Stop if we've reached the filesystem root or can't go further
    if (parentDir === currentDir || !parentDir) break;
    currentDir = parentDir;
    levels++;
  }

  return null;
}

/**
 * Prompts user for yes/no confirmation
 */
async function promptUser(question) {
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
 * Update package.json with lint and prettier scripts
 * Prompts user if existing scripts need to be replaced
 */
async function updatePackageJson(packageJsonPath) {
  try {
    // eslint-disable-next-line security/detect-non-literal-fs-filename
    const packageJsonContent = readFileSync(packageJsonPath, "utf-8");
    const packageJson = JSON.parse(packageJsonContent);

    // Initialize scripts if it doesn't exist
    if (!packageJson.scripts) {
      packageJson.scripts = {};
    }

    const scriptsToAdd = {
      lint: "eslint .",
      "lint:fix": "eslint . --fix",
      format: "prettier --write .",
      "format:check": "prettier --check .",
    };

    let updated = false;
    const existingScripts = [];

    // Check for existing scripts
    for (const [scriptName, scriptValue] of Object.entries(scriptsToAdd)) {
      if (packageJson.scripts[scriptName] && packageJson.scripts[scriptName] !== scriptValue) {
        existingScripts.push({
          name: scriptName,
          current: packageJson.scripts[scriptName],
          new: scriptValue,
        });
      }
    }

    // Ask user if they want to replace existing scripts
    let shouldReplace = true;
    if (existingScripts.length > 0) {
      // eslint-disable-next-line no-console
      console.log("\n⚠️  Found existing lint/format scripts in your package.json:");
      existingScripts.forEach((script) => {
        // eslint-disable-next-line no-console
        console.log(`   "${script.name}": "${script.current}"`);
      });
      // eslint-disable-next-line no-console
      console.log(
        "\nWould you like to replace them with @kitiumai/lint scripts? (y/n)",
      );

      shouldReplace = await promptUser("Replace scripts? (y/n): ");
    }

    // Add or update scripts
    for (const [scriptName, scriptValue] of Object.entries(scriptsToAdd)) {
      if (!packageJson.scripts[scriptName]) {
        packageJson.scripts[scriptName] = scriptValue;
        updated = true;
        // eslint-disable-next-line no-console
        console.log(`✓ Added "${scriptName}" script to package.json`);
      } else if (
        packageJson.scripts[scriptName] !== scriptValue &&
        shouldReplace
      ) {
        packageJson.scripts[scriptName] = scriptValue;
        updated = true;
        // eslint-disable-next-line no-console
        console.log(`✓ Updated "${scriptName}" script in package.json`);
      }
    }

    if (updated) {
      // Write back with proper formatting
      const updatedContent = `${JSON.stringify(packageJson, null, 2)}\n`;
      // eslint-disable-next-line security/detect-non-literal-fs-filename
      writeFileSync(packageJsonPath, updatedContent, "utf-8");
      // eslint-disable-next-line no-console
      console.log(
        "\n✨ @kitiumai/lint: Added lint and prettier scripts to your package.json",
      );
      // eslint-disable-next-line no-console
      console.log(
        "   You can now run: npm run lint, npm run lint:fix, npm run format\n",
      );
    } else if (existingScripts.length > 0 && !shouldReplace) {
      // eslint-disable-next-line no-console
      console.log(
        "\n📝 Skipped replacing scripts. You can manually update them if needed.\n",
      );
    }

    return updated;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(`Error updating package.json: ${error.message}`);
    return false;
  }
}

/**
 * Creates ESLint configuration file if it doesn't exist
 */
function createEslintConfig(projectRoot) {
  const eslintConfigPath = join(projectRoot, "eslint.config.js");

  // Check if config already exists
  if (existsSync(eslintConfigPath)) {
    // eslint-disable-next-line no-console
    console.log("✓ ESLint configuration already exists (eslint.config.js)");
    return;
  }

  const eslintConfigContent = `/**
 * ESLint Configuration
 * Uses @kitiumai/lint as the base configuration
 * Extend this file to customize lint rules for your project
 */

import { eslintNodeConfig, eslintTypeScriptConfig } from '@kitiumai/lint';

export default [
  ...eslintNodeConfig,
  ...eslintTypeScriptConfig,
  {
    name: 'project-overrides',
    files: ['src/**/*.ts', 'src/**/*.tsx'],
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
    console.log("✓ Created eslint.config.js");
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(`Failed to create eslint.config.js: ${error.message}`);
  }
}

/**
 * Creates Prettier configuration file if it doesn't exist
 */
function createPrettierConfig(projectRoot) {
  const prettierConfigPath = join(projectRoot, ".prettierrc.js");
  const prettierIgnorePath = join(projectRoot, ".prettierignore");

  // Check if prettier config already exists
  if (existsSync(prettierConfigPath)) {
    // eslint-disable-next-line no-console
    console.log("✓ Prettier configuration already exists (.prettierrc.js)");
  } else {
    const prettierConfigContent = `/**
 * Prettier Configuration
 * Uses @kitiumai/lint prettier configuration as a base
 * Extend this file to customize prettier rules for your project
 */

import { prettierConfig } from '@kitiumai/lint';

export default {
  ...prettierConfig,
  // Add project-specific overrides here
  // overrides: [
  //   ...prettierConfig.overrides,
  //   {
  //     files: '*.md',
  //     options: {
  //       printWidth: 80,
  //       proseWrap: 'always',
  //     },
  //   },
  // ],
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

  // Create .prettierignore if it doesn't exist
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
 * Creates .eslintignore file if it doesn't exist
 */
function createEslintIgnore(projectRoot) {
  const eslintIgnorePath = join(projectRoot, ".eslintignore");

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
  const consumerPackageJson = findConsumerPackageJson();

  if (consumerPackageJson) {
    const projectRoot = dirname(consumerPackageJson);

    // eslint-disable-next-line no-console
    console.log("\n🚀 Setting up @kitiumai/lint...\n");

    // Update package.json with scripts
    await updatePackageJson(consumerPackageJson);

    // Create configuration files
    // eslint-disable-next-line no-console
    console.log("📝 Creating configuration files...\n");
    createEslintConfig(projectRoot);
    createPrettierConfig(projectRoot);
    createEslintIgnore(projectRoot);

    // eslint-disable-next-line no-console
    console.log(
      "\n✨ @kitiumai/lint setup complete! You can now use: npm run lint, npm run format\n",
    );
  } else {
    // Silently fail if we can't find consumer package.json
    // This is normal when installing the package itself or in some edge cases
  }
}

// Run main function
main().catch((error) => {
  // eslint-disable-next-line no-console
  console.error(`Setup error: ${error.message}`);
  process.exit(1);
});
