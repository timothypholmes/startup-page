import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import vitePluginString from 'vite-plugin-string'
import postcss from './postcss.config.js'


// https://vitejs.dev/config/
export default defineConfig({
  base: "https://timothypholmes.github.io/startup-page/",
  plugins: [
    react(), 
    vitePluginString()
  ],
  css: {
    postcss,
  },
  build: {
    chunkSizeWarningLimit: 1600,
  }
})
