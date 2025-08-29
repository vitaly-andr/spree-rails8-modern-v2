import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["quantityInput", "mainImage", "wishlistBtn", "heartIcon"]
  static values = { 
    productId: String,
    productName: String,
    productPrice: String,
    isLiked: Boolean
  }

  connect() {
    console.log('🔌 Product Detail controller connecting...')
    console.log('📦 Product values:', {
      id: this.productIdValue,
      name: this.productNameValue,
      price: this.productPriceValue,
      isLiked: this.isLikedValue
    })
    
    // Initialize wishlist state
    this.isInWishlist = this.isLikedValue
    this.updateHeartIcon()
    
    // Listen for media gallery selections
    this.element.addEventListener('media-gallery:select', this.handleMediaSelection.bind(this))
    
    console.log(`✅ Product Detail connected: ${this.productNameValue || 'Unknown Product'}`)
  }

  // Handle media gallery selection
  handleMediaSelection(event) {
    const { url } = event.detail
    console.log('📸 Media selection event received:', url)
    
    // Update main image
    if (this.hasMainImageTarget) {
      this.mainImageTarget.src = url
      console.log('🔄 Main image updated to:', url)
    }
  }

  // Quantity Controls
  increaseQuantity(event) {
    event.preventDefault()
    const input = this.quantityInputTarget
    const currentValue = parseInt(input.value) || 1
    const maxValue = parseInt(input.max) || 99
    
    if (currentValue < maxValue) {
      input.value = currentValue + 1
    }
  }

  decreaseQuantity(event) {
    event.preventDefault()
    const input = this.quantityInputTarget
    const currentValue = parseInt(input.value) || 1
    const minValue = parseInt(input.min) || 1
    
    if (currentValue > minValue) {
      input.value = currentValue - 1
    }
  }

  // Image Selection
  selectImage(event) {
    event.preventDefault()
    const imageUrl = event.currentTarget.dataset.imageUrl
    
    if (this.hasMainImageTarget && imageUrl) {
      this.replaceMainImage(imageUrl)
    }
  }

  replaceMainImage(imageUrl) {
    const mainImage = this.mainImageTarget
    
    // Fade out, change src, fade in
    mainImage.style.opacity = '0.5'
    
    const newImage = new Image()
    newImage.onload = () => {
      mainImage.src = imageUrl
      mainImage.style.opacity = '1'
    }
    newImage.src = imageUrl
  }

  // Wishlist Toggle (same as catalog card)
  toggleWishlist(event) {
    event.preventDefault()
    event.stopPropagation()
    
    this.isInWishlist = !this.isInWishlist
    this.isLikedValue = this.isInWishlist
    
    // Animate button press
    this.animateButtonPress(this.wishlistBtnTarget)
    
    // Update heart icon state
    this.updateHeartIcon()
    
    // Show feedback message
    this.showToast(
      this.isInWishlist 
        ? `Added "${this.productNameValue}" to wishlist` 
        : `Removed "${this.productNameValue}" from wishlist`,
      this.isInWishlist ? 'success' : 'info'
    )
    
    console.log(this.isInWishlist ? `❤️ Added to wishlist: ${this.productNameValue}` : `💔 Removed from wishlist: ${this.productNameValue}`)
  }

  updateHeartIcon() {
    if (this.hasHeartIconTarget) {
      const heartIcon = this.heartIconTarget
      
      if (this.isInWishlist) {
        heartIcon.style.fill = 'currentColor'
        heartIcon.style.color = '#ef4444' // red-500
      } else {
        heartIcon.style.fill = 'none'
        heartIcon.style.color = 'inherit'
      }
    }
  }

  // Purchase Actions
  async addToCart(event) {
    event.preventDefault()
    
    const quantity = parseInt(this.quantityInputTarget?.value) || 1
    
    console.log(`🛒 Adding to cart: ${this.productNameValue} (${quantity}x)`)
    
    // Show feedback
    this.showToast(`Added ${quantity}x "${this.productNameValue}" to cart`, 'success')
  }

  async buyNow(event) {
    event.preventDefault()
    
    const quantity = parseInt(this.quantityInputTarget?.value) || 1
    
    console.log(`💳 Buy now: ${this.productNameValue} (${quantity}x)`)
    
    // Show feedback
    this.showToast(`Proceeding to checkout with ${quantity}x "${this.productNameValue}"`, 'success')
  }

  notifyWhenAvailable(event) {
    event.preventDefault()
    
    console.log(`🔔 Notify when available: ${this.productNameValue}`)
    
    // Show feedback
    this.showToast(`You'll be notified when "${this.productNameValue}" is back in stock`, 'info')
  }

  // Utility methods
  animateButtonPress(button) {
    button.style.transform = 'scale(0.95)'
    
    setTimeout(() => {
      button.style.transform = 'scale(1.05)'
      
      setTimeout(() => {
        button.style.transform = 'scale(1)'
      }, 100)
    }, 100)
  }

  showToast(message, type = 'info') {
    // Create toast element
    const toast = document.createElement('div')
    toast.className = `fixed top-20 right-4 z-50 px-6 py-3 rounded-lg shadow-lg transition-all duration-300 transform translate-x-full`
    
    // Set toast style based on type
    switch (type) {
      case 'success':
        toast.classList.add('bg-green-500', 'text-white')
        break
      case 'error':
        toast.classList.add('bg-red-500', 'text-white')
        break
      case 'info':
      default:
        toast.classList.add('bg-blue-500', 'text-white')
        break
    }
    
    toast.textContent = message
    document.body.appendChild(toast)
    
    // Animate in
    setTimeout(() => {
      toast.classList.remove('translate-x-full')
    }, 100)
    
    // Animate out and remove
    setTimeout(() => {
      toast.classList.add('translate-x-full')
      setTimeout(() => {
        document.body.removeChild(toast)
      }, 300)
    }, 3000)
  }

  // Image modal functionality
  openImageModal(event) {
    event.preventDefault()
    console.log('🖼️ openImageModal called')
    
    // Get image source from clicked element
    const imageElement = event.currentTarget.querySelector('img')
    const imageSrc = imageElement.src
    const imageAlt = imageElement.alt
    
    console.log('🖼️ Opening modal for image:', imageSrc)
    
    // Create modal overlay
    const modalOverlay = document.createElement('div')
    modalOverlay.className = 'image-modal-overlay'
    modalOverlay.innerHTML = `
      <div class="image-modal-backdrop"></div>
      <div class="image-modal-container">
        <img class="image-modal-image" src="${imageSrc}" alt="${imageAlt}" />
      </div>
    `
    
    // Add click listener to backdrop
    const backdrop = modalOverlay.querySelector('.image-modal-backdrop')
    backdrop.addEventListener('click', () => this.closeImageModal())
    
    // Add to document
    document.body.appendChild(modalOverlay)
    document.body.classList.add('modal-open')
    
    // Trigger animation after DOM insertion
    requestAnimationFrame(() => {
      modalOverlay.classList.add('image-modal-open')
    })
    
    // Store reference for cleanup
    this.currentModal = modalOverlay
    
    // Add escape key listener
    this.escapeKeyHandler = (e) => {
      if (e.key === 'Escape') {
        this.closeImageModal()
      }
    }
    document.addEventListener('keydown', this.escapeKeyHandler)
  }

  closeImageModal(event) {
    if (event) event.preventDefault()
    
    if (!this.currentModal) return
    
    // Start close animation
    this.currentModal.classList.remove('image-modal-open')
    this.currentModal.classList.add('image-modal-closing')
    
    // Remove after animation
    setTimeout(() => {
      if (this.currentModal && this.currentModal.parentNode) {
        this.currentModal.parentNode.removeChild(this.currentModal)
      }
      this.currentModal = null
      document.body.classList.remove('modal-open')
    }, 300)
    
    // Remove escape key listener
    if (this.escapeKeyHandler) {
      document.removeEventListener('keydown', this.escapeKeyHandler)
      this.escapeKeyHandler = null
    }
  }

  disconnect() {
    // Cleanup modal if component is disconnected
    if (this.currentModal) {
      this.closeImageModal()
    }
  }
}

