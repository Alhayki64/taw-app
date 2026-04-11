import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    // Use jsdom to simulate a browser environment for DOM-touching tests
    environment: 'jsdom',
    globals: true,
    include: ['src/tests/**/*.test.js'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      include: ['src/lib/**/*.js'],
      exclude: ['src/lib/supabaseClient.js'] // network-dependent, mocked separately
    }
  },
  resolve: {
    alias: {
      '@lib': '/src/lib',
      '@tests': '/src/tests'
    }
  }
})
