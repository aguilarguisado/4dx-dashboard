import { FlatCompat } from '@eslint/eslintrc';
import eslint from '@eslint/js';
import eslintConfigPrettier from 'eslint-config-prettier';
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
				groups: ['index', ['sibling', 'parent'], 'internal', ['external', 'builtin']],
				pathGroups: [
					{
						pattern: '@/**',
						group: 'internal',
					},
				],
				pathGroupsExcludedImportTypes: ['internal'],
				'newlines-between': 'always',
				alphabetize: {
					order: 'asc',
					caseInsensitive: true,
				},
			},
		],
	},
};

const boundariesConfig = {
	extends: ['plugin:boundaries/strict'],
	plugins: ['boundaries'],
	settings: {
		'boundaries/elements': [
			{
				type: 'test',
				pattern: ['__tests__/**'],
			},
			{
				type: 'lib',
				pattern: ['lib/**'],
			},
			{
				type: 'data',
				pattern: ['data/**'],
			},
			{
				type: 'di',
				pattern: ['di/**'],
			},
			{
				type: 'domain',
				pattern: ['domain/**', 'lib/inversify/**'],
			},
			{
				type: 'infrastructure',
				pattern: ['infrastructure/**'],
			},
			{
				type: 'presentation',
				pattern: ['presentation/**'],
			},
			{
				type: 'root',
				pattern: ['src/index.ts', 'src/env.d.ts'],
				mode: 'full',
			},
		],
		'boundaries/include': ['src/**/*.*'],
	},
	rules: {
		'boundaries/no-ignored': [0],
		'boundaries/no-private': [0, {}],
		'boundaries/element-types': [
			2,
			{
				// Allow or disallow any dependency by default
				default: 'disallow',
				// Define a custom message for this rule
				message: '${file.type} is not allowed to import ${dependency.type}',
				rules: [
					{
						from: 'test',
						allow: ['*'],
					},
					{
						from: 'root',
						allow: ['*'],
					},
					{
						from: 'lib',
						allow: ['*'],
					},
					{
						from: 'data',
						allow: ['*'],
					},
					{
						from: 'di',
						allow: ['lib', 'test', 'data', 'di', 'domain', 'infrastructure'],
					},
					{
						from: 'domain',
						allow: ['domain', 'test'],
					},
					{
						from: 'infrastructure',
						allow: ['lib', 'test', 'domain', 'infrastructure'],
					},
					{
						from: 'presentation',
						allow: ['domain', 'test', 'presentation'],
					},
				],
			},
		],
	},
};

export default tseslint.config(
	eslint.configs.recommended,
	// Google's style guide with some additional rules
	...compat.config({
		extends: ['google'],
	}),
	...tseslint.configs.strict,
	// Import rules
	...compat.config(importConfig),
	// Boundaries configuration
	...compat.config(boundariesConfig),
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
			'new-cap': 0,
			'max-len': ['error', { code: 120 }],
			'require-jsdoc': 0,
			'max-depth': 'error',
			'max-nested-callbacks': 'error',
			complexity: 'error',
			'object-curly-spacing': ['error', 'always'],
			'@typescript-eslint/consistent-type-definitions': ['error', 'type'],
			'@typescript-eslint/explicit-function-return-type': 'off',
			'no-throw-literal': 'off',
			'@typescript-eslint/no-throw-literal': 'error',
			// this is for sorting WITHIN an import
			'sort-imports': ['error', { ignoreCase: true, ignoreDeclarationSort: true }],
		},
	},
	eslintConfigPrettier,
);
