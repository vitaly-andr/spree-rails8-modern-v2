// Spree Storefront Stimulus Controllers
// This file registers all Stimulus controllers used by Spree Storefront

console.log('🎮 Loading Spree Storefront controllers...')

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
waitForStimulus().then(application => {
  // Import Spree controllers
  import('./controllers/slideover_controller.js').then(module => {
    application.register('slideover-account', module.default)
    console.log('✅ Registered slideover-account controller')
  })

  console.log('✅ Loaded Spree Storefront controllers')
})
