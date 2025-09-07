import { defineConfig } from 'vite'
import RubyPlugin from 'vite-plugin-ruby'

export default defineConfig({
  plugins: [RubyPlugin()],
  resolve: {
    alias: {
      '@': './app/javascript',
      'spree': './app/javascript/spree'
    }
  },
  build: {
    rollupOptions: {
      input: {
        'spree-storefront': './app/javascript/spree/storefront/application.js'
      }
    }
  }
})
