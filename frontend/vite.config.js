import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  // base is '/' for localhost. Set back to '/ML-Project-CV-Analysis/' for GitHub Pages deploy.
  base: '/',
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
