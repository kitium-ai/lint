/**
 * Utility for lazily loading optional ESLint plugins without hard failures.
 */
const pluginCache = new Map();

export async function loadOptionalPlugin(packageName) {
  if (pluginCache.has(packageName)) {
    return pluginCache.get(packageName);
  }

  let result = { plugin: null, available: false };

  try {
    const pluginModule = await import(packageName).catch(() => null);
    if (pluginModule) {
      result = {
        plugin: pluginModule.default ?? pluginModule,
        available: true,
      };
    }
  } catch {
    // Optional plugin, so ignore load errors.
  }

  pluginCache.set(packageName, result);
  return result;
}
