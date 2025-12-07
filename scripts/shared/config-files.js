/**
 * Shared helpers for inspecting and mutating consumer config files.
 */
import { existsSync, unlinkSync } from 'node:fs';
import { join } from 'node:path';

const PRETTIER_PATTERNS = [
  '.prettierrc.js',
  '.prettierrc.cjs',
  '.prettierrc.json',
  '.prettierrc.yml',
  '.prettierrc.yaml',
  '.prettierrc',
];

/**
 * Locate existing configuration files in a consumer project.
 */
export function detectExistingConfigs(projectRoot) {
  const configs = {
    eslintV9: null,
    prettier: null,
    tslint: null,
  };

  const eslintV9Path = join(projectRoot, 'eslint.config.js');
  // eslint-disable-next-line security/detect-non-literal-fs-filename
  if (existsSync(eslintV9Path)) {
    configs.eslintV9 = eslintV9Path;
  }

  for (const pattern of PRETTIER_PATTERNS) {
    const configPath = join(projectRoot, pattern);
    // eslint-disable-next-line security/detect-non-literal-fs-filename
    if (existsSync(configPath)) {
      configs.prettier = configPath;
      break;
    }
  }

  const tslintPath = join(projectRoot, 'tslint.json');
  // eslint-disable-next-line security/detect-non-literal-fs-filename
  if (existsSync(tslintPath)) {
    configs.tslint = tslintPath;
  }

  return configs;
}

/**
 * Remove legacy .eslintignore files so the flat config owns ignore patterns.
 */
export function removeDeprecatedEslintIgnore(projectRoot) {
  const eslintIgnorePath = join(projectRoot, '.eslintignore');
  // eslint-disable-next-line security/detect-non-literal-fs-filename
  if (!existsSync(eslintIgnorePath)) {
    return;
  }

  try {
    // eslint-disable-next-line security/detect-non-literal-fs-filename
    unlinkSync(eslintIgnorePath);
  } catch {
    // Ignore cleanup errors; consumers can remove manually if needed.
  }
}
