/**
 * ESLint Configuration for Angular Applications
 * Includes Angular-specific linting rules and TypeScript support
 */

export default [
  {
    name: 'angular-base',
    files: ['**/*.ts'],
    languageOptions: {
      parserOptions: {
        ecmaVersion: 2020,
        sourceType: 'module',
        project: ['tsconfig.json', 'tsconfig.*.json'],
      },
    },
    rules: {
      // Angular-specific best practices
      '@angular-eslint/directive-selector': [
        'error',
        {
          type: 'attribute',
          prefix: 'app',
          style: 'camelCase',
        },
      ],
      '@angular-eslint/component-selector': [
        'error',
        {
          type: 'element',
          prefix: 'app',
          style: 'kebab-case',
        },
      ],
      '@angular-eslint/no-empty-lifecycle-method': 'warn',
      '@angular-eslint/no-host-metadata-property': 'warn',
      '@angular-eslint/use-lifecycle-interface': 'warn',
      '@angular-eslint/use-pipe-transform-interface': 'warn',

      // TypeScript rules for Angular
      '@typescript-eslint/explicit-member-accessibility': [
        'warn',
        {
          accessibility: 'explicit',
          overrides: {
            constructors: 'no-public',
          },
        },
      ],
      '@typescript-eslint/member-ordering': [
        'warn',
        {
          default: [
            'public-static-field',
            'protected-static-field',
            'private-static-field',
            'public-instance-field',
            'protected-instance-field',
            'private-instance-field',
            'constructor',
            'public-static-method',
            'protected-static-method',
            'private-static-method',
            'public-instance-method',
            'protected-instance-method',
            'private-instance-method',
          ],
        },
      ],
    },
  },
  {
    name: 'angular-templates',
    files: ['**/*.component.html'],
    rules: {
      // Template-specific rules can be added here
    },
  },
];
