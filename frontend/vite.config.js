/* global process */
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  // GitHub Actions CI: use repo-scoped base for GitHub Pages
  // Netlify / localhost: use root '/'
  base: (process.env.GITHUB_ACTIONS && !process.env.NETLIFY) ? '/ML-Project-CV-Analysis/' : '/',
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
