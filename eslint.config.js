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
      '@typescript-eslint/no-unused-vars': 'warn',
      'react-hooks/exhaustive-deps': 'warn',
      'react-hooks/set-state-in-effect': 'warn',
      'react-refresh/only-export-components': 'warn',
      'sonarjs/cognitive-complexity': 'warn',
      'sonarjs/no-nested-conditional': 'warn',
      'sonarjs/no-nested-functions': 'warn',
      'sonarjs/todo-tag': 'warn',
      'sonarjs/no-unused-collection': 'warn',
      'sonarjs/super-linear-regex': 'warn',
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
    /* Diagramas interactivos JSXGraph: Math.random() usado exclusivamente para
       generar IDs únicos de tableros interactivos no criptográficos.
       Revisado y aceptado como falso positivo. */
    files: [
      'src/boundary/components/diagrams/**/*.tsx',
      'src/shared/diagrams/**/*.tsx',
      'Matematika/src/shared/diagrams/**/*.tsx'
    ],
    rules: {
      'sonarjs/pseudo-random': 'off'
    }
  },
])
