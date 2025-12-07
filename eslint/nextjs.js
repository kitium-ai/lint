/**
 * Next.js Configuration for ESLint
 * Linting rules for Next.js applications
 * Enforces Next.js best practices, performance, and security patterns
 *
 * NOTE: This configuration requires the optional package:
 * - @next/eslint-plugin-next
 *
 * Install with: npm install @next/eslint-plugin-next
 */

import { loadOptionalPlugin } from './utils/load-optional-plugin.js';

const { plugin: nextPlugin, available: hasNextPlugin } = await loadOptionalPlugin(
  '@next/eslint-plugin-next'
);

const createNextjsConfig = () => {
  const baseConfig = {
    files: ['**/*.{js,jsx,ts,tsx}'],
    rules: {},
  };

  if (hasNextPlugin) {
    return {
      ...baseConfig,
      plugins: {
        '@next/next': nextPlugin,
      },
      rules: {
        // Core Next.js rules
        '@next/next/no-img-element': 'error',
        '@next/next/no-html-link-for-pages': 'error',
        '@next/next/no-unwanted-polyfillio': 'warn',

        // Performance
        '@next/next/no-sync-scripts': 'error',
        '@next/next/no-document-import-in-page': 'error',
        '@next/next/no-page-custom-font': 'warn',

        // CSS and styling
        '@next/next/inline-script-id': 'error',

        // Font optimization
        '@next/next/google-font-display': 'warn',
        '@next/next/google-font-preconnect': 'warn',

        // Script optimization
        '@next/next/next-script-for-ga': 'warn',
      },
    };
  }

  return baseConfig;
};

export default createNextjsConfig();
