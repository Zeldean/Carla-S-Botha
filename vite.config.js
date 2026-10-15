import { reactRouter } from '@react-router/dev/vite'
import { defineConfig } from 'vite'
import content from './scripts/content/vite-plugin.js'

// https://vite.dev/config/
export default defineConfig({
  plugins: [content(), reactRouter()],
})
