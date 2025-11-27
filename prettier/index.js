/**
 * Prettier Configuration
 * Re-export the central monorepo preset to avoid drift.
 */
import sharedConfig from "@kitiumai/config/prettier.config.cjs";

export default {
  ...sharedConfig,
};
