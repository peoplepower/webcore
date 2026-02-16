// @ts-check

import eslint from '@eslint/js';
import { defineConfig } from 'eslint/config';
import tseslint from 'typescript-eslint';
import eslintConfigPrettier from 'eslint-config-prettier';

export default defineConfig({
  files: ['src/**/*.ts', 'tests/**/*.ts'],
  ignores: ['dist/', 'node_modules/'],
  extends: [
    eslint.configs.recommended,
    tseslint.configs.recommended,
    eslintConfigPrettier,
  ],
  rules: {
    // Allow to call Object.prototype methods directly on objects
    'no-prototype-builtins': 'off',
    // Disabled: TypeScript compiler handles this better than ESLint
    'no-undef': 'off',
    // Allow @ts-ignore — used throughout the codebase
    '@typescript-eslint/ban-ts-comment': 'off',
    // Allow explicit `any` — common in SDK/API code
    '@typescript-eslint/no-explicit-any': 'off',
    // Allow empty interfaces extending a base (API response pattern)
    '@typescript-eslint/no-empty-object-type': 'off',
    // Allow `const me = this` pattern used throughout the codebase
    '@typescript-eslint/no-this-alias': 'off',
    // Allow `Function` type in utility code
    '@typescript-eslint/no-unsafe-function-type': 'off',
    // Allow `Object` type in API response models
    '@typescript-eslint/no-wrapper-object-types': 'off',
    // Disallow unused vars
    "no-unused-vars": 'off',
    "@typescript-eslint/no-unused-vars": ['error', { argsIgnorePattern: '^_' }],
    // Imports in type annotations
    '@typescript-eslint/consistent-type-imports': ['error', { prefer: 'no-type-imports' }],
  },
});
