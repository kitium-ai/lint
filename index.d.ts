declare module '@kitiumai/lint' {
  // Core ESLint configs (arrays of flat config objects)
  export const eslintBaseConfig: any;
  export const eslintReactConfig: any;
  export const eslintNodeConfig: any;
  export const eslintTypeScriptConfig: any;
  export const eslintJestConfig: any;
  export const eslintTestingLibraryConfig: any;
  export const eslintGraphQLConfig: any;
  export const eslintVueConfig: any;
  export const eslintNextjsConfig: any;
  export const eslintAngularConfig: any;
  export const eslintSvelteConfig: any;
  export const eslintSecurityConfig: any;
  export const eslintKitiumConfig: any;

  // Prettier and presets
  export const prettierConfig: any;
  export const configs: { [name: string]: any };

  // Helpers
  export function createKitiumConfig(...args: any[]): any;
  export function createKitiumPlugin(...args: any[]): any;

  export default configs;
}

// Common subpath modules
declare module '@kitiumai/lint/eslint/base' {
  const base: any;
  export default base;
}

declare module '@kitiumai/lint/eslint/react' {
  const react: any;
  export default react;
}

declare module '@kitiumai/lint/eslint/node' {
  const node: any;
  export default node;
}

declare module '@kitiumai/lint/eslint/typescript' {
  const ts: any;
  export default ts;
}

declare module '@kitiumai/lint/prettier' {
  const prettier: any;
  export default prettier;
}

declare module '@kitiumai/lint/tsconfig/base' {
  const cfg: any;
  export default cfg;
}

declare module '@kitiumai/lint/tsconfig/react' {
  const cfg: any;
  export default cfg;
}

declare module '@kitiumai/lint/tsconfig/node' {
  const cfg: any;
  export default cfg;
}

declare module '@kitiumai/lint/jest' {
  const jest: any;
  export default jest;
}

declare module '@kitiumai/lint/husky' {
  const h: any;
  export default h;
}

declare module '@kitiumai/lint/commitlint' {
  const cl: any;
  export default cl;
}

declare module '@kitiumai/lint/configs' {
  const presets: { [k: string]: any };
  export default presets;
}
