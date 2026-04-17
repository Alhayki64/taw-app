import { defineConfig } from 'vite'

export default defineConfig({
  // The app is a traditional multi-page vanilla JS app served from the root.
  // Vite acts as a dev server and build tool; existing <script> tags in index.html
  // are kept as-is (no module bundling of legacy globals).
  root: '.',
  publicDir: 'public',
  server: {
    port: 3000,
    open: true,
    // Serve the whole stitch directory
    fs: { allow: ['.'] }
  },
  build: {
    outDir: 'dist',
    // Keep the multi-page HTML structure intact
    rollupOptions: {
      input: {
        main: 'index.html'
      }
    }
  },
  // Resolve bare imports (used in the /src ES-module layer only)
  resolve: {
    alias: {
      '@lib': '/src/lib',
      '@tests': '/src/tests'
    }
  }
})
