import js from '@eslint/js';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import tseslint from 'typescript-eslint';

const globals = {
  console: 'readonly',
  document: 'readonly',
  fetch: 'readonly',
  HTMLElement: 'readonly',
  KeyboardEvent: 'readonly',
  process: 'readonly',
  React: 'readonly',
  setTimeout: 'readonly',
  window: 'readonly',
};

export default [
  {
    ignores: [
      'node_modules',
      '**/dist/**',
      'coverage',
      'apps/web/public/component-index.json',
      'apps/mcp-server/data/component-index.json',
    ],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals,
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      'react-refresh/only-export-components': 'off',
    },
  },
  {
    files: ['**/*.stories.tsx'],
    rules: {
      'react-refresh/only-export-components': 'off',
    },
  },
];
