import { defineConfig } from 'vite'
import RubyPlugin from 'vite-plugin-ruby'
import { resolve } from 'path'

export default defineConfig({
  plugins: [
    RubyPlugin(),
  ],
  resolve: {
    alias: {
      // Только основные aliases
      'spree': resolve(__dirname, './vendor/gems/spree_storefront/app/javascript/spree'),
      'card-validator': resolve(__dirname, './node_modules/card-validator'),
      'credit-card-type': resolve(__dirname, './node_modules/credit-card-type'),
      'headroom.js': resolve(__dirname, './node_modules/headroom.js'),
    },
    extensions: ['.js', '.ts', '.jsx', '.tsx', '.json']
  },
  build: {
    cssCodeSplit: true,
    rollupOptions: {
      input: {
        application: './app/frontend/entrypoints/application.js',
        spreeStorefront: './app/frontend/entrypoints/spreeStorefront.js'  // ← БЕЗ ДЕФИСА
      }
    }
  },
  server: {
    watch: {
      ignored: [
        '**/doc/**',
        '**/tmp/**',
        '**/log/**',
        '**/node_modules/**',
        '**/public/**',
        '**/storage/**',
        '**/*.md',
      ],
    },
    host: 'localhost',
    port: 3036,
    hmr: {
      host: 'localhost',
      port: 3036,
    },
  },
})