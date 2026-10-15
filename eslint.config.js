import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{js,jsx}'],
    extends: [
      js.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    rules: {
      // React Router route modules export these alongside the component.
      'react-refresh/only-export-components': [
        'warn',
        { allowExportNames: ['meta', 'links', 'Layout', 'ErrorBoundary', 'HydrateFallback'] },
      ],
    },
    languageOptions: {
      globals: globals.browser,
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
  },
  {
    // Build-time Node code (content pipeline, Vite and React Router config).
    files: ['scripts/**/*.js', 'vite.config.js', 'react-router.config.js'],
    languageOptions: { globals: globals.node },
  },
])
