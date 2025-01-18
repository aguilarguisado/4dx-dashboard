import { FlatCompat } from '@eslint/eslintrc';
import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';

const compat = new FlatCompat({
  baseDirectory: import.meta.url,
});

const importConfig = {
  plugins: ['import'],
  settings: {
    'import/resolver': {
      typescript: {
        alwaysTryTypes: true,
      },
    },
  },
  rules: {
    'import/no-cycle': 'error',
    // this is for sorting imports
    'import/order': [
      'error',
      {
        'groups': [
          'index',
          ['sibling', 'parent'],
          'internal',
          ['external', 'builtin'],
        ],
        'pathGroups': [
          {
            pattern: '@/**',
            group: 'internal',
          },
        ],
        'pathGroupsExcludedImportTypes': ['internal'],
        'newlines-between': 'always',
        'alphabetize': {
          order: 'asc',
          caseInsensitive: true,
        },
      },
    ],
  },
};

export default tseslint.config(
    eslint.configs.recommended,
    ...compat.config({
      extends: ['google'],
    }),
    ...tseslint.configs.strict,
    // Import rules
    ...compat.config(importConfig),
    {
      languageOptions: {
        ecmaVersion: 'latest',
        parserOptions: {
          tsconfigRootDir: import.meta.dirname,
          project: './tsconfig.json',
        },
      },
      rules: {
        'no-console': 2,
        'max-len': ['error', { 'code': 120 }],
        'require-jsdoc': 0,
        'max-depth': 'error',
        'max-nested-callbacks': 'error',
        'complexity': 'error',
        'object-curly-spacing': ['error', 'always'],
        '@typescript-eslint/consistent-type-definitions': ['error', 'type'],
        '@typescript-eslint/explicit-function-return-type': 'off',
        'no-throw-literal': 'off',
        '@typescript-eslint/no-throw-literal': 'error',
        'no-restricted-imports': [
          'error',
          {
            patterns: ['@/features/*/*'],
          },
        ],
        // this is for sorting WITHIN an import
        'sort-imports': ['error', { ignoreCase: true, ignoreDeclarationSort: true }],
      },
    },
);
