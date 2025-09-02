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
      // Добавляем алиасы для всех Spree зависимостей
      '@rails/request.js': resolve(__dirname, './app/frontend/spree/gem/@rails--request.js.js'),
      '@hotwired/stimulus': resolve(__dirname, './node_modules/@hotwired/stimulus'),
      '@hotwired/turbo': resolve(__dirname, './node_modules/@hotwired/turbo'),
      '@kanety/stimulus-accordion': resolve(__dirname, './node_modules/@kanety/stimulus-accordion'),
      '@stimulus-components/carousel': resolve(__dirname, './node_modules/@stimulus-components/carousel'),
      '@stimulus-components/read-more': resolve(__dirname, './node_modules/@stimulus-components/read-more'),
      '@stimulus-components/scroll-to': resolve(__dirname, './node_modules/@stimulus-components/scroll-to'),
      'swiper/bundle': resolve(__dirname, './node_modules/swiper/swiper-bundle.mjs'),
      'photoswipe': resolve(__dirname, './node_modules/photoswipe'),
      // Меняем алиас - указываем напрямую на файл из node_modules
      'photoswipe/lightbox.js': resolve(__dirname, './node_modules/photoswipe/lightbox.js'),
      'photoswipe/lightbox': resolve(__dirname, './node_modules/photoswipe/lightbox.js'),
      'nouislider': resolve(__dirname, './node_modules/nouislider'),
      'card-validator': resolve(__dirname, './node_modules/card-validator'),
      'credit-card-type': resolve(__dirname, './node_modules/credit-card-type'),
      'headroom.js': resolve(__dirname, './node_modules/headroom.js'),
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