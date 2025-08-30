import { defineConfig } from 'vite'
import RubyPlugin from 'vite-plugin-ruby'
import { resolve } from 'path'

export default defineConfig({
  plugins: [
    RubyPlugin(),
  ],
  resolve: {
    alias: {
      // Symlink'и к gem контроллерам и helpers (создаются через rake задачу)
      'spree/storefront/controllers': resolve(__dirname, './app/frontend/spree/gem/storefront_controllers'),
      'spree/core/controllers': resolve(__dirname, './app/frontend/spree/gem/core_controllers'),
      'spree/core/helpers': resolve(__dirname, './app/frontend/spree/gem/core_helpers'),
      'tailwindcss-stimulus-components': resolve(__dirname, './app/frontend/spree/gem/tailwindcss-stimulus-components.js'),
    },
    extensions: ['.js', '.ts', '.jsx', '.tsx', '.json']
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