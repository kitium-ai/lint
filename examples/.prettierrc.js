/**
 * Example Prettier Configuration
 * Uses @kitiumai/lint prettier configuration as a base
 */

import { prettierConfig } from '@kitiumai/lint';

export default {
  ...prettierConfig,
  // Add project-specific overrides here
  // Example: Different line width for markdown
  overrides: [
    ...prettierConfig.overrides,
    {
      files: '*.md',
      options: {
        printWidth: 80,
        proseWrap: 'always',
      },
    },
  ],
};
