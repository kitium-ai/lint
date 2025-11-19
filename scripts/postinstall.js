#!/usr/bin/env node

/**
 * Post-install script for @kitiumai/lint
 * Automatically adds lint and prettier scripts to the consumer's package.json
 */

import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

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

function updatePackageJson(packageJsonPath) {
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

    // Add or update scripts only if they don't exist or are different
    for (const [scriptName, scriptValue] of Object.entries(scriptsToAdd)) {
      if (!packageJson.scripts[scriptName]) {
        packageJson.scripts[scriptName] = scriptValue;
        updated = true;
        // eslint-disable-next-line no-console
        console.log(`✓ Added "${scriptName}" script to package.json`);
      } else if (packageJson.scripts[scriptName] !== scriptValue) {
        // Only update if it's a default eslint/prettier command
        const currentScript = packageJson.scripts[scriptName];
        if (
          (scriptName.startsWith("lint") &&
            currentScript.startsWith("eslint")) ||
          (scriptName.startsWith("format") &&
            currentScript.startsWith("prettier"))
        ) {
          packageJson.scripts[scriptName] = scriptValue;
          updated = true;
          // eslint-disable-next-line no-console
          console.log(`✓ Updated "${scriptName}" script in package.json`);
        }
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
    }

    return updated;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(`Error updating package.json: ${error.message}`);
    return false;
  }
}

// Main execution
const consumerPackageJson = findConsumerPackageJson();

if (consumerPackageJson) {
  updatePackageJson(consumerPackageJson);
} else {
  // Silently fail if we can't find consumer package.json
  // This is normal when installing the package itself or in some edge cases
}
