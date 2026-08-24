import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import sonarjs from 'eslint-plugin-sonarjs'
import tseslint from 'typescript-eslint'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores([
    'dist',
    '.auxiliary',
    'lean/.lake',
    'lean/.lake/**',
    '.agents/skills/**/examples',
    '.agents/skills/**/examples/**',
    'Matematika/.agents/skills/**/examples',
    'Matematika/.agents/skills/**/examples/**',
  ]),
  {
    linterOptions: {
      reportUnusedDisableDirectives: 'off',
    },
  },
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
      sonarjs.configs.recommended,
    ],
    languageOptions: {
      globals: globals.browser,
    },
    rules: {
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unused-vars': ['warn', { 'argsIgnorePattern': '^_' }],
      'react-hooks/exhaustive-deps': 'warn',
      'react-hooks/set-state-in-effect': 'off',
      'react-refresh/only-export-components': 'off',
      'sonarjs/cognitive-complexity': 'off',
      'sonarjs/no-nested-conditional': 'off',
      'sonarjs/no-nested-functions': 'off',
      'sonarjs/todo-tag': 'warn',
      'sonarjs/no-unused-collection': 'warn',
      'sonarjs/super-linear-regex': 'off',
      'sonarjs/no-unenclosed-multiline-block': 'warn',
      'sonarjs/no-useless-react-setstate': 'warn',
      'sonarjs/no-floating-point-equality': 'warn',
      'sonarjs/no-trivial-assertions': 'warn',
      'sonarjs/no-os-command-from-path': 'warn',
      'sonarjs/no-ignored-exceptions': 'warn',
      'sonarjs/unused-import': 'warn'
    }
  },
  {
    /* Pruebas, scripts y contenido de diagramas interactivos (JSXGraph, mocks, datos) */
    files: [
      'content/**/*.{ts,tsx}',
      'content_archive/**/*.{ts,tsx}',
      'tests/**/*.{ts,tsx}',
      'scripts/**/*.{ts,tsx}',
      'src/diagrams/**/*.{ts,tsx}'
    ],
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      'sonarjs/pseudo-random': 'off',
      'sonarjs/void-use': 'off',
      'no-empty': 'off'
    }
  },
])
