import { Controller } from "@hotwired/stimulus"
import LocomotiveScroll from "locomotive-scroll"

export default class extends Controller {
  async connect() {
    console.log("Locomotive Scroll v5 connected")
    try {
      await this.initializeLocomotiveScroll()
    } catch (error) {
      console.error("Failed to initialize Locomotive Scroll:", error)
    }
  }

  disconnect() {
    // Cleanup event listeners
    if (this.scrollListener) {
      window.removeEventListener('scroll', this.scrollListener)
    }
    if (this.resizeListener) {
      window.removeEventListener('resize', this.resizeListener)
    }
    
    // Cleanup locomotive scroll
    if (this.locomotiveScroll) {
      this.locomotiveScroll.destroy()
    }
  }

  async initializeLocomotiveScroll() {
    try {
      // Initialize Locomotive Scroll v5 - new API
      this.locomotiveScroll = new LocomotiveScroll({
        el: this.element,
        smooth: true,
        multiplier: 1,
        touchMultiplier: 2
      })

      // Store listeners for proper cleanup
      this.scrollListener = () => {
        if (window.ScrollTrigger) {
          window.ScrollTrigger.update()
        }
      }

      this.resizeListener = () => {
        if (this.locomotiveScroll && typeof this.locomotiveScroll.update === 'function') {
          this.locomotiveScroll.update()
        }
      }

      // V5 API - use modern approach with native scroll events
      window.addEventListener('scroll', this.scrollListener)
      window.addEventListener('resize', this.resizeListener)

      // Initial update
      setTimeout(() => {
        if (this.locomotiveScroll && typeof this.locomotiveScroll.update === 'function') {
          this.locomotiveScroll.update()
        }
      }, 100)

      console.log("Locomotive Scroll v5 initialized successfully")
    } catch (error) {
      console.error("Error initializing Locomotive Scroll v5:", error)
      // Fallback to native scroll behavior
      console.log("Falling back to native scroll behavior")
    }
  }

  // Method to scroll to element
  scrollTo(target, options = {}) {
    if (this.locomotiveScroll && typeof this.locomotiveScroll.scrollTo === 'function') {
      this.locomotiveScroll.scrollTo(target, options)
    } else {
      // Fallback to native scrollTo
      if (typeof target === 'string') {
        const element = document.querySelector(target)
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', ...options })
        }
      }
    }
  }

  // Method to update locomotive scroll
  update() {
    if (this.locomotiveScroll && typeof this.locomotiveScroll.update === 'function') {
      this.locomotiveScroll.update()
    }
  }
}
