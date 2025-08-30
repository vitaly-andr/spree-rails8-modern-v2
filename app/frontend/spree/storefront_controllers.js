// Spree Storefront Stimulus Controllers
// This file registers all Stimulus controllers used by Spree Storefront

console.log('🎮 Loading Spree Storefront controllers...')

// Import external libraries
import { Alert, Toggle } from 'tailwindcss-stimulus-components'

// Wait for Stimulus to be available
function waitForStimulus() {
  return new Promise((resolve) => {
    if (window.Stimulus) {
      resolve(window.Stimulus)
    } else {
      // Check every 10ms until Stimulus is available
      const interval = setInterval(() => {
        if (window.Stimulus) {
          clearInterval(interval)
          resolve(window.Stimulus)
        }
      }, 10)
    }
  })
}

// Register controllers when Stimulus is ready
waitForStimulus().then(async (application) => {
  let loadedCount = 0

  // Register external components
  application.register('alert', Alert)
  application.register('toggle', Toggle)
  console.log('✅ Registered external components: alert, toggle')

  // Test the new alias configuration
  console.log('🔍 Testing new path.resolve() alias configuration...')
  
  // Try import.meta.glob with the corrected alias
  const storefrontControllers = import.meta.glob('spree/storefront/controllers/*.js', { eager: true })
  console.log('📁 Found storefront controllers with new alias:', Object.keys(storefrontControllers))

  if (Object.keys(storefrontControllers).length > 0) {
    console.log('✅ Alias working! Found controllers:', Object.keys(storefrontControllers))
    
    // Controller name mappings
    const controllerMappings = {
      'header_controller.js': 'header',
      'toggle_menu_controller.js': 'toggle-menu',
      'slideover_controller.js': ['slideover', 'slideover-account'],
      'cart_controller.js': 'cart',
      'product_form_controller.js': 'product-form',
      'quantity_picker_controller.js': 'quantity-picker',
      'carousel_controller.js': 'carousel',
      'modal_controller.js': 'modal',
      'dropdown_controller.js': 'dropdown',
      'search_suggestions_controller.js': 'search-suggestions',
      'wished_item_controller.js': 'wished-item',
      'account_nav_controller.js': 'account-nav',
      'accordion_controller.js': 'accordion',
      'card_validation_controller.js': 'card-validation',
      'checkout_address_book_controller.js': 'checkout-address-book',
      'checkout_delivery_controller.js': 'checkout-delivery',
      'checkout_promotions_controller.js': 'checkout-promotions',
      'checkout_summary_controller.js': 'checkout-summary',
      'clear_input_controller.js': 'clear-input',
      'copy_input_controller.js': 'copy-input',
      'infinite_scroll_controller.js': 'infinite-scroll',
      'lightbox_controller.js': 'lightbox',
      'mobile_nav_controller.js': 'mobile-nav',
      'no_ui_slider_controller.js': 'no-ui-slider',
      'pdp_desktop_gallery_controller.js': 'pdp-desktop-gallery',
      'plp_variant_picker_controller.js': 'plp-variant-picker',
      'prefetch_lazy_controller.js': 'prefetch-lazy',
      'searchable_list_controller.js': 'searchable-list',
      'sticky_button_controller.js': 'sticky-button',
      'turbo_stream_form_controller.js': 'turbo-stream-form',
    }

    // Register all found controllers
    for (const [path, module] of Object.entries(storefrontControllers)) {
      const filename = path.split('/').pop()
      const controllerNames = controllerMappings[filename]
      
      if (controllerNames) {
        const names = Array.isArray(controllerNames) ? controllerNames : [controllerNames]
        
        for (const name of names) {
          try {
            application.register(name, module.default)
            console.log(`✅ Registered ${name} controller`)
            loadedCount++
          } catch (error) {
            console.warn(`⚠️ Could not register controller: ${name}`, error)
          }
        }
      }
    }
  } else {
    console.log('⚠️ Glob still not working, trying manual import test...')
    
    // Test manual import with new alias
    try {
      const { default: HeaderController } = await import('spree/storefront/controllers/header_controller.js')
      console.log('✅ Manual import successful with new alias!')
      
      // Register critical controllers manually
      const criticalControllers = [
        { name: 'header', module: HeaderController },
      ]
      
      // Try importing more controllers
      try {
        const { default: SlideoverController } = await import('spree/storefront/controllers/slideover_controller.js')
        criticalControllers.push({ name: 'slideover', module: SlideoverController })
        criticalControllers.push({ name: 'slideover-account', module: SlideoverController })
      } catch (e) { console.warn('Could not import slideover controller:', e) }
      
      try {
        const { default: CartController } = await import('spree/storefront/controllers/cart_controller.js')
        criticalControllers.push({ name: 'cart', module: CartController })
      } catch (e) { console.warn('Could not import cart controller:', e) }
      
      try {
        const { default: ModalController } = await import('spree/storefront/controllers/modal_controller.js')
        criticalControllers.push({ name: 'modal', module: ModalController })
      } catch (e) { console.warn('Could not import modal controller:', e) }
      
      // Register all successfully imported controllers
      for (const { name, module } of criticalControllers) {
        try {
          application.register(name, module)
          console.log(`✅ Manually registered ${name} controller`)
          loadedCount++
        } catch (error) {
          console.warn(`⚠️ Could not register controller: ${name}`, error)
        }
      }
      
    } catch (error) {
      console.error('❌ Manual import still failed:', error)
      console.log('💡 Consider using symlink or copying files approach')
    }
  }

  // Final summary
  if (loadedCount > 0) {
    console.log(`✅ Successfully loaded ${loadedCount} Spree controllers`)
  } else {
    console.warn(`⚠️ No Spree controllers loaded - alias configuration needs adjustment`)
  }
})
