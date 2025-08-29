// Media Gallery Component Controller

import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["item"]
  static values = { autoReplace: Boolean }

  connect() {
    this.selectedIndex = 0
    this.updateActiveItem()
  }

  selectMedia(event) {
    const item = event.currentTarget
    const mediaUrl = item.dataset.mediaUrl
    const mediaIndex = parseInt(item.dataset.mediaIndex)
    
    // Update selected index
    this.selectedIndex = mediaIndex
    this.updateActiveItem()
    
    // Dispatch custom event for parent components to listen to
    const mediaSelectEvent = new CustomEvent('media-gallery:select', {
      detail: {
        url: mediaUrl,
        index: mediaIndex,
        element: item
      },
      bubbles: true
    })
    
    this.element.dispatchEvent(mediaSelectEvent)
    
    // If auto-replace is enabled, try to update main image
    if (this.autoReplaceValue) {
      this.replaceMainImage(mediaUrl)
    }
  }

  updateActiveItem() {
    this.itemTargets.forEach((item, index) => {
      if (index === this.selectedIndex) {
        item.classList.add('active')
      } else {
        item.classList.remove('active')
      }
    })
  }

  replaceMainImage(imageUrl) {
    // Look for main product image in parent component
    const mainImage = document.querySelector('[data-target="product-detail.mainImage"]') ||
                     document.querySelector('.image-main-product') ||
                     document.querySelector('.main-product-image')
    
    if (mainImage && mainImage.tagName === 'IMG') {
      // Fade out, change src, fade in
      mainImage.style.opacity = '0.5'
      
      const newImage = new Image()
      newImage.onload = () => {
        mainImage.src = imageUrl
        mainImage.style.opacity = '1'
      }
      newImage.src = imageUrl
    }
  }

  // Public method to programmatically select media item
  selectByIndex(index) {
    if (index >= 0 && index < this.itemTargets.length) {
      const item = this.itemTargets[index]
      item.click()
    }
  }

  // Public method to get current selection
  getCurrentSelection() {
    return {
      index: this.selectedIndex,
      element: this.itemTargets[this.selectedIndex]
    }
  }
}

