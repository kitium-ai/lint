/**
 * Next.js Configuration for ESLint
 * Linting rules for Next.js applications
 * Enforces Next.js best practices, performance, and security patterns
 */

export default {
  files: ['**/*.{js,jsx,ts,tsx}'],
  plugins: {
    '@next/next': require('@next/eslint-plugin-next'),
  },
  rules: {
    // Core Next.js rules
    '@next/next/no-img-element': 'warn',
    '@next/next/no-html-link-for-pages': 'error',
    '@next/next/no-unwanted-polyfillio': 'warn',

    // Performance
    '@next/next/no-sync-scripts': 'error',
    '@next/next/no-document-import-in-page': 'error',
    '@next/next/no-page-custom-font': 'warn',

    // Image optimization
    '@next/next/no-img-element': 'error',

    // CSS and styling
    '@next/next/inline-script-id': 'error',

    // Font optimization
    '@next/next/google-font-display': 'warn',
    '@next/next/google-font-preconnect': 'warn',

    // Script optimization
    '@next/next/next-script-for-ga': 'warn',
  },
};
