// Spree vendor libraries
// This file imports all JavaScript libraries that Spree depends on

console.log('📚 Loading Spree vendor libraries...')

// Rails request library for AJAX calls (required by Spree controllers)
import '@rails/request.js'

// Core libraries that Spree uses
import 'swiper/bundle'
import 'photoswipe'
import 'nouislider'

// Credit card validation libraries
import 'card-validator'
import 'credit-card-type'

// Headroom.js for header behavior
import 'headroom.js'

// Stimulus components that Spree uses
import '@stimulus-components/carousel'
import '@stimulus-components/read-more'
import '@stimulus-components/scroll-to'

// Kanety accordion component
import '@kanety/stimulus-accordion'

console.log('✅ Spree vendor libraries loaded')
