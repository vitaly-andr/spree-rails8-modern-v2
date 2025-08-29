import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["button", "spinner"]
  static values = { 
    productId: String,
    productName: String,
    productPrice: String
  }

  connect() {
    // Initialize component state
    this.isInWishlist = false
    this.isAddingToCart = false
    
    // Add component-specific CSS class for styling isolation
    this.element.classList.add(`product-card-${this.productIdValue || 'default'}`)
    
    console.log(`✅ Product card connected: ${this.productNameValue || 'Unknown Product'}`)
  }

  disconnect() {
    // Cleanup any running timers or event listeners
    if (this.addToCartTimeout) {
      clearTimeout(this.addToCartTimeout)
    }
    
    console.log(`🔌 Product card disconnected: ${this.productNameValue || 'Unknown Product'}`)
  }

  // Quick View Modal
  quickView(event) {
    event.preventDefault()
    event.stopPropagation()
    
    console.log(`👁️ Quick view requested for: ${this.productNameValue}`)
    
    // Animate button feedback
    const button = event.currentTarget
    this.animateButtonPress(button)
    
    // TODO: Implement quick view modal
    // For now, just show an alert
    setTimeout(() => {
      alert(`Quick view for: ${this.productNameValue}\nPrice: ${this.productPriceValue}\n\nQuick view modal will be implemented later.`)
    }, 200)
  }

  // Wishlist Toggle
  toggleWishlist(event) {
    event.preventDefault()
    event.stopPropagation()
    
    const button = event.currentTarget
    const heartIcon = button.querySelector('.icon-heart')
    
    this.isInWishlist = !this.isInWishlist
    
    // Animate heart icon
    this.animateButtonPress(button)
    
    // Update heart icon state
    if (this.isInWishlist) {
      heartIcon.style.fill = 'currentColor'
      heartIcon.style.color = '#ef4444' // red-500
      console.log(`❤️ Added to wishlist: ${this.productNameValue}`)
    } else {
      heartIcon.style.fill = 'none'
      heartIcon.style.color = ''
      console.log(`💔 Removed from wishlist: ${this.productNameValue}`)
    }
    
    // Show feedback message
    this.showToast(
      this.isInWishlist 
        ? `Added "${this.productNameValue}" to wishlist` 
        : `Removed "${this.productNameValue}" from wishlist`,
      this.isInWishlist ? 'success' : 'info'
    )
  }

  // Add to Cart
  async addToCart(event) {
    event.preventDefault()
    
    if (this.isAddingToCart) return
    
    const button = event.currentTarget
    const btnText = button.querySelector('.btn-text')
    const btnSpinner = button.querySelector('.btn-loading-spinner')
    
    this.isAddingToCart = true
    
    // Show loading state
    btnText.style.opacity = '0'
    btnSpinner.style.display = 'flex'
    button.disabled = true
    
    console.log(`🛒 Adding to cart: ${this.productNameValue}`)
    
    try {
      // Simulate API call
      await this.simulateAddToCart()
      
      // Success state
      btnText.textContent = 'Added!'
      btnText.style.opacity = '1'
      btnSpinner.style.display = 'none'
      
      this.showToast(`"${this.productNameValue}" added to cart!`, 'success')
      
      // Reset button after 2 seconds
      this.addToCartTimeout = setTimeout(() => {
        btnText.textContent = 'Add to Cart'
        button.disabled = false
        this.isAddingToCart = false
      }, 2000)
      
    } catch (error) {
      console.error('❌ Failed to add to cart:', error)
      
      // Error state
      btnText.textContent = 'Try Again'
      btnText.style.opacity = '1'
      btnSpinner.style.display = 'none'
      
      this.showToast(`Failed to add "${this.productNameValue}" to cart`, 'error')
      
      // Reset button after 3 seconds
      this.addToCartTimeout = setTimeout(() => {
        btnText.textContent = 'Add to Cart'
        button.disabled = false
        this.isAddingToCart = false
      }, 3000)
    }
  }

  // Helper Methods
  animateButtonPress(button) {
    button.style.transform = 'scale(0.95)'
    setTimeout(() => {
      button.style.transform = ''
    }, 150)
  }

  async simulateAddToCart() {
    // Simulate network delay
    const delay = 800 + Math.random() * 1200 // 0.8-2s
    
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // 90% success rate for demo
        if (Math.random() > 0.1) {
          resolve({ success: true })
        } else {
          reject(new Error('Network error'))
        }
      }, delay)
    })
  }

  showToast(message, type = 'info') {
    // Create toast element
    const toast = document.createElement('div')
    toast.className = `fixed bottom-4 right-4 z-50 px-4 py-3 rounded-md shadow-lg transition-all duration-300 transform translate-y-full ${this.getToastClasses(type)}`
    toast.textContent = message
    
    document.body.appendChild(toast)
    
    // Animate in
    requestAnimationFrame(() => {
      toast.style.transform = 'translateY(0)'
    })
    
    // Auto remove after 3 seconds
    setTimeout(() => {
      toast.style.transform = 'translateY(full)'
      setTimeout(() => {
        document.body.removeChild(toast)
      }, 300)
    }, 3000)
  }

  getToastClasses(type) {
    switch (type) {
      case 'success':
        return 'bg-green-500 text-white'
      case 'error':
        return 'bg-red-500 text-white'
      case 'info':
      default:
        return 'bg-blue-500 text-white'
    }
  }
}

