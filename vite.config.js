import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import vitePluginString from 'vite-plugin-string'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), vitePluginString()]
})
