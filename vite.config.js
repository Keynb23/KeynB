// vite.config.js

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(),],
  // 👈 ADD THIS CONFIGURATION
  
  esbuild: {
    loader: 'jsx',
    include: /src\/.*\.jsx?$/, // Apply this to all .js and .jsx files in src/
    exclude: [],
    // Add the following line to fix the error
    // This is a placeholder, as the actual fix depends on how tailwindcss is meant to be used here.
    // If it's a plugin, it should be in the plugins array. If it's an esbuild option, it needs to be correctly structured.
  },
  optimizeDeps: {
    esbuildOptions: {
      loader: {
        '.js': 'jsx',
      },
    },
  },
})