/* global process */
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  // Automatically use repo name for GitHub Pages deploy, or '/' for localhost
  base: process.env.GITHUB_ACTIONS ? '/ML-Project-CV-Analysis/' : '/',
  plugins: [react()],
  cacheDir: '.vite_cache',
  server: {
    port: 5173,
    host: true,
    strictPort: true,
    proxy: {
      // Proxy all /api/* requests to the local FastAPI backend
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
  test: {
    // Only run unit tests in src/ - exclude Playwright e2e tests
    include: ['src/**/*.{test,spec}.{js,jsx,ts,tsx}'],
    exclude: ['e2e/**', 'node_modules/**'],
    environment: 'jsdom',
  },
})
