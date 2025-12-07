/**
 * Shared utilities for @kitiumai/lint scripts
 */

import { existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { createInterface } from 'node:readline';

import { log } from '@kitiumai/scripts/utils';

/**
 * Find the consumer's project root directory by searching for package.json
 * First tries from current working directory, then from script directory
 */
export function findProjectRoot(scriptDirectory) {
  const searchPaths = [
    process.cwd(), // Start from current working directory (where npm install was run)
    scriptDirectory, // Fallback to script directory
  ];

  for (const startDirectory of searchPaths) {
    let currentDirectory = startDirectory;
    let levels = 0;
    const maxLevels = 10;

    while (
      currentDirectory &&
      currentDirectory !== '/' &&
      currentDirectory.length > 1 &&
      levels < maxLevels
    ) {
      const packageJsonPath = join(currentDirectory, 'package.json');

      // eslint-disable-next-line security/detect-non-literal-fs-filename
      if (existsSync(packageJsonPath)) {
        // eslint-disable-next-line max-depth
        try {
          // eslint-disable-next-line security/detect-non-literal-fs-filename
          const package_ = JSON.parse(readFileSync(packageJsonPath, 'utf-8'));
          // eslint-disable-next-line max-depth
          if (package_.name === '@kitiumai/lint') {
            currentDirectory = dirname(currentDirectory);
            levels++;
            continue;
          }
          return currentDirectory;
        } catch {
          // Invalid JSON, continue searching
        }
      }

      const parentDirectory = dirname(currentDirectory);
      if (parentDirectory === currentDirectory || !parentDirectory) {
        break;
      }
      currentDirectory = parentDirectory;
      levels++;
    }
  }

  return null;
}

/**
 * Prompts user for yes/no confirmation
 * Supports environment variables for non-interactive mode
 */
export async function promptYesNo(question, defaultAnswer = true) {
  // Support non-interactive mode via env vars for testing
  const setupESLint = process.env.SETUP_ESLINT;
  const setupTSLint = process.env.SETUP_TSLINT;
  const setupPrettier = process.env.SETUP_PRETTIER;

  if (typeof setupESLint !== 'undefined' && question.includes('ESLint')) {
    log('info', `${question} [${setupESLint}]`);
    return setupESLint === 'true';
  }
  if (typeof setupTSLint !== 'undefined' && question.includes('TSLint')) {
    log('info', `${question} [${setupTSLint}]`);
    return setupTSLint === 'true';
  }
  if (typeof setupPrettier !== 'undefined' && question.includes('Prettier')) {
    log('info', `${question} [${setupPrettier}]`);
    return setupPrettier === 'true';
  }

  return new Promise((resolve) => {
    const rl = createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    const defaultText = defaultAnswer ? '[Y/n]' : '[y/N]';
    rl.question(`${question} ${defaultText}: `, (answer) => {
      rl.close();
      const result =
        answer === ''
          ? defaultAnswer
          : answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes';
      resolve(result);
    });
  });
}

/**
 * Prompts user for choice selection
 * Supports environment variables for non-interactive mode
 */
export async function promptChoice(question, choices, defaultIndex = 0) {
  const setupProjectType = process.env.SETUP_PROJECT_TYPE;

  if (setupProjectType !== undefined) {
    const index = choices.findIndex((c) => c.toLowerCase() === setupProjectType.toLowerCase());
    if (index >= 0) {
      log('info', `\n${question}`);
      choices.forEach((choice, index_) => {
        const marker = index_ === index ? '>' : ' ';
        log('info', `  ${marker} ${index_ + 1}. ${choice}`);
      });
      return index;
    }
  }

  return new Promise((resolve) => {
    const rl = createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    log('info', `\n${question}`);
    choices.forEach((choice, index) => {
      const marker = index === defaultIndex ? '>' : ' ';
      log('info', `  ${marker} ${index + 1}. ${choice}`);
    });

    rl.question(`Select option (1-${choices.length}) [${defaultIndex + 1}]: `, (answer) => {
      rl.close();
      const selected = answer === '' ? defaultIndex : parseInt(answer) - 1;
      resolve(selected >= 0 && selected < choices.length ? selected : defaultIndex);
    });
  });
}
