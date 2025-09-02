// Spree JavaScript entrypoint for Vite
// This file handles all Spree-specific JavaScript functionality

console.log('🛒 Spree Commerce JavaScript loaded via Vite')


// Import Hotwire libraries (required by Spree)
import * as Turbo from '@hotwired/turbo'
import { Application } from '@hotwired/stimulus'

// Start Turbo
Turbo.start()

// Initialize Stimulus application
const application = Application.start()

// Make Stimulus application globally available for Spree
window.Stimulus = application

// Import Spree vendor libraries
import '../spree/vendor_libraries.js'

// Import Spree Storefront controllers
// This will register all controllers automatically
import '../spree/storefront_controllers.js'

// Import Spree Admin controllers (if needed)
// import SpreeAdminControllers from '../spree/admin_controllers.js'

console.log('✅ Spree JavaScript initialization complete')
