import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      '/api': {
        target: 'https://hopebridge-1.onrender.com',
        changeOrigin: true,
      },
      '/bdapi': {
        target: 'https://bdapis.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/bdapi/, '/api')
      }
    }
  },
  preview: {
    port: process.env.PORT || 5173,
    host: '0.0.0.0',
    allowedHosts: [
      'hopebridge-kxqs.onrender.com',
      'localhost',
      '*.onrender.com'  // This will allow all onrender.com subdomains
    ]
  }
})