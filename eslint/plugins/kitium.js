/**
 * Kitium Custom ESLint Rules
 * Ported from the original component lint definitions to be reusable across repos.
 */

function toPascalCase(value) {
  return value
    .replace(/[-_]+/g, ' ')
    .replace(/\s+(\w)/g, (_, c) => c.toUpperCase())
    .replace(/^\w/, (c) => c.toUpperCase())
    .replace(/\s/g, '');
}

const componentNamingRule = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Enforce Kt prefix on component class exports',
      category: 'Naming Conventions',
      recommended: true,
    },
    schema: [],
  },
  create(context) {
    return {
      ExportNamedDeclaration(node) {
        const declaration = node.declaration;
        if (!declaration || declaration.type !== 'ClassDeclaration' || !declaration.id) {
          return;
        }

        const className = declaration.id.name;

        if (!className.endsWith('Web') && !className.endsWith('Mobile')) {
          return;
        }

        if (!className.startsWith('Kt')) {
          context.report({
            node: declaration.id,
            message: `Component class "${className}" must start with "Kt" prefix. Use "Kt${className}" instead.`,
          });
        }
      },
    };
  },
};

const propsNamingRule = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Enforce Kt{Component}Props naming pattern for props interfaces',
      category: 'Naming Conventions',
      recommended: true,
    },
    schema: [],
  },
  create(context) {
    function validateName(node) {
      const name = node.id.name;
      if (!name.includes('Props')) {
        return;
      }

      if (!name.startsWith('Kt')) {
        context.report({
          node: node.id,
          message: `Props interface "${name}" must follow pattern "Kt{Component}Props". Rename to "Kt${name.replace(/^(I|_)/, '')}"`,
        });
      }

      if (!name.endsWith('Props')) {
        context.report({
          node: node.id,
          message: `Props interface "${name}" must end with "Props". Use "${name.replace(/Props.*$/, 'Props')}" instead.`,
        });
      }
    }

    return {
      TSTypeAliasDeclaration: validateName,
      TSInterfaceDeclaration: validateName,
    };
  },
};

const eventNamingRule = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Enforce Kt{Component}{Event}Event naming pattern for event interfaces',
      category: 'Naming Conventions',
      recommended: true,
    },
    schema: [],
  },
  create(context) {
    function validateName(node) {
      const name = node.id.name;
      if (!name.includes('Event')) {
        return;
      }

      if (!name.startsWith('Kt')) {
        context.report({
          node: node.id,
          message: `Event interface "${name}" must follow pattern "Kt{Component}{Event}Event". Rename to "Kt${name.replace(/^(I|_)/, '')}"`,
        });
      }

      if (!name.endsWith('Event')) {
        context.report({
          node: node.id,
          message: `Event interface "${name}" must end with "Event". Use "${name.replace(/Event.*$/, 'Event')}" instead.`,
        });
      }
    }

    return {
      TSInterfaceDeclaration: validateName,
      TSTypeAliasDeclaration: validateName,
    };
  },
};

const extendsBasePropertiesRule = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Enforce BaseProps extension for component props interfaces',
      category: 'Best Practices',
      recommended: true,
    },
    schema: [],
  },
  create(context) {
    return {
      TSInterfaceDeclaration(node) {
        const name = node.id.name;

        if (!name.startsWith('Kt') || !name.endsWith('Props')) {
          return;
        }

        const extendsNodes = node.extends || [];

        if (name.endsWith('WebProps') || name.endsWith('MobileProps')) {
          const extendsKtProperties = extendsNodes.some(
            (extension) =>
              extension.expression &&
              extension.expression.type === 'Identifier' &&
              extension.expression.name.startsWith('Kt')
          );
          if (extendsKtProperties) {
            return;
          }
        }

        const extendsBaseProperties = extendsNodes.some((extension) => {
          if (!extension.expression) {
            return false;
          }
          if (extension.expression.type === 'Identifier') {
            return (
              extension.expression.name === 'BaseProps' ||
              extension.expression.name.startsWith('Kt')
            );
          }
          return false;
        });

        if (!extendsBaseProperties) {
          context.report({
            node: node.id,
            message: `Props interface "${name}" should extend BaseProps or another Kt*Props interface to ensure consistency.`,
          });
        }
      },
    };
  },
};

const extendsBaseComponentRule = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Enforce BaseComponent extension for web component classes',
      category: 'Best Practices',
      recommended: true,
    },
    schema: [],
  },
  create(context) {
    return {
      // eslint-disable-next-line complexity
      ClassDeclaration(node) {
        if (!node.id) {
          return;
        }
        const className = node.id.name;

        if (!className.startsWith('Kt')) {
          return;
        }
        if (!className.endsWith('Web') && !className.endsWith('Mobile')) {
          return;
        }

        const superClass = node.superClass;
        if (!superClass) {
          context.report({
            node: node.id,
            message: `Component class "${className}" should extend BaseComponent to ensure consistency and access to base utilities.`,
          });
          return;
        }

        const extendsBaseComponent =
          (superClass.type === 'Identifier' && superClass.name === 'BaseComponent') ||
          (superClass.type === 'MemberExpression' &&
            superClass.object &&
            superClass.object.type === 'Identifier' &&
            superClass.object.name === 'BaseComponent');

        if (!extendsBaseComponent) {
          context.report({
            node: node.id,
            message: `Component class "${className}" should extend BaseComponent to ensure consistency and access to base utilities.`,
          });
        }
      },
    };
  },
};

const requiredTypeExportsRule = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Enforce required type exports for component types files',
      category: 'Best Practices',
      recommended: 'warn',
    },
    schema: [],
  },
  create(context) {
    const filename = context.getFilename().replace(/\\/g, '/');
    if (!filename.endsWith('.types.ts')) {
      return {};
    }

    const exports = new Set();

    return {
      ExportNamedDeclaration(node) {
        if (node.declaration) {
          const { declaration } = node;
          if (
            (declaration.type === 'TSInterfaceDeclaration' ||
              declaration.type === 'TSTypeAliasDeclaration') &&
            declaration.id
          ) {
            exports.add(declaration.id.name);
          }
        }

        if (node.specifiers) {
          node.specifiers.forEach((spec) => {
            if (spec.exported && spec.exported.name) {
              exports.add(spec.exported.name);
            }
          });
        }
      },

      'Program:exit'() {
        const match = filename.match(/\/([\w-]+)\.types\.ts$/i);
        if (!match) {
          return;
        }

        const componentName = toPascalCase(match[1]);
        const requiredExports = [`Kt${componentName}Props`, `Kt${componentName}State`];

        requiredExports.forEach((requiredExport) => {
          if (!exports.has(requiredExport)) {
            context.report({
              loc: { line: 1, column: 0 },
              message: `Component types file should export "${requiredExport}" interface. See DEVELOPMENT_GUIDE.md for required exports.`,
            });
          }
        });
      },
    };
  },
};

export const rules = {
  'component-naming': componentNamingRule,
  'props-naming': propsNamingRule,
  'event-naming': eventNamingRule,
  'extends-base-props': extendsBasePropertiesRule,
  'extends-base-component': extendsBaseComponentRule,
  'required-type-exports': requiredTypeExportsRule,
};

export const configs = {
  recommended: {
    rules: {
      'kitium/component-naming': 'error',
      'kitium/props-naming': 'error',
      'kitium/event-naming': 'error',
      'kitium/extends-base-props': 'warn',
      'kitium/extends-base-component': 'warn',
      'kitium/required-type-exports': 'warn',
    },
  },
};

const kitiumPlugin = {
  rules,
  configs,
};

export function createKitiumPlugin({
  additionalRules = {},
  additionalConfigs = {},
  recommendedRules = {},
} = {}) {
  const mergedRules = {
    ...rules,
    ...additionalRules,
  };

  const baseRecommended = configs.recommended ?? {};
  const additionalRecommended = additionalConfigs.recommended ?? {};

  const mergedRecommended = {
    ...baseRecommended,
    ...additionalRecommended,
    rules: {
      ...(baseRecommended.rules ?? {}),
      ...(additionalRecommended.rules ?? {}),
      ...recommendedRules,
    },
  };

  const mergedConfigs = {
    ...configs,
    ...additionalConfigs,
    recommended: mergedRecommended,
  };

  return {
    rules: mergedRules,
    configs: mergedConfigs,
  };
}

export default kitiumPlugin;
