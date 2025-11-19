/**
 * Example Prettier Configuration
 * Uses @kitium-ai/lint prettier configuration as a base
 */

import { prettierConfig } from '@kitium-ai/lint';

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
