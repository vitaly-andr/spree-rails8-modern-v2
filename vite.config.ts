import { defineConfig } from 'vite'
import RubyPlugin from 'vite-plugin-ruby'

export default defineConfig({
  plugins: [
    RubyPlugin(),
  ],
  build: {
    rollupOptions: {
      input: {
        application: './app/javascript/application.js',
        spree_storefront: './app/javascript/spree_storefront.js'
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