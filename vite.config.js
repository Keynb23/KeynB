// vite.config.js

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // 👈 ADD THIS CONFIGURATION
  esbuild: {
    loader: 'jsx',
    include: /src\/.*\.jsx?$/, // Apply this to all .js and .jsx files in src/
    exclude: [],
  },
  optimizeDeps: {
    esbuildOptions: {
      loader: {
        '.js': 'jsx',
      },
    },
  },
})