import { defineConfig } from 'vite'
import RubyPlugin from 'vite-plugin-ruby'

export default defineConfig({
  plugins: [
    RubyPlugin(),
  ],
  resolve: {
    alias: {
      'spree': '/app/frontend/spree'
    }
  },
  build: {
    rollupOptions: {
      input: {
        application: './app/frontend/entrypoints/application.js',
        spree: './app/frontend/entrypoints/spree.js'
      }
    }
  },
  server: {
    watch: {
      ignored: [
        '**/doc/**',      // игнорировать документацию
        '**/tmp/**',
        '**/log/**',
        '**/node_modules/**',
        '**/public/**',
        '**/storage/**',
        '**/*.md',        // игнорировать markdown
      ],
    },
    host: 'localhost', // <--- важно!
    port: 3036,
    hmr: {
      host: 'localhost', // <--- важно!
      port: 3036,
    },
  },
})