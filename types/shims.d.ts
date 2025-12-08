declare module '@kitiumai/config/vitest.config.base.js';

declare module 'vitest/config' {
  export * from 'vitest';
  // Minimal stub to satisfy config typing without pulling full vitest types
  export function defineConfig<T = Record<string, unknown>>(config: T): T;
}
