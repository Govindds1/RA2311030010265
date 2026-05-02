import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    strictPort: true,
    proxy: {
      // This tells Vite to intercept any request starting with /evaluation-service
      '/evaluation-service': {
        target: 'http://20.207.122.201',
        changeOrigin: true,
      }
    }
  }
})