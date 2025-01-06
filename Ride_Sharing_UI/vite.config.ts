import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    host: true
  },
  resolve: {
    alias: {
      // This handles modules that expect Node.js globals
      global: {}
    }
  },
  define: {
    // This adds missing globals that some modules expect
    global: 'window'
  }
})
