import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import content from './scripts/content/vite-plugin.js'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), content()],
})
