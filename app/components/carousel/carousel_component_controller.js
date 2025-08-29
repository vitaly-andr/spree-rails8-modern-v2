import { Controller } from "@hotwired/stimulus"
import { gsap } from "gsap"
import { DotLottie } from '@lottiefiles/dotlottie-web'
import swipeRightAnimation from '~/assets/swipe-right.lottie?url'

export default class extends Controller {
  static targets = ["content", "prevButton", "nextButton", "dot", "lottieCanvas"]
  static values = { 
    id: String,
    currentSlide: { type: Number, default: 1 },
    totalSlides: { type: Number, default: 3 },
    autoplay: { type: Boolean, default: true },
    autoplayDelay: { type: Number, default: 3000 }
  }

  connect() {
    if (typeof gsap === 'undefined') {
      console.error("❌ GSAP is not loaded!")
      return
    }
    
    this.setupInitialState()
    this.updateDots()
    this.initTouchDetection()
    this.initLottieAnimation()
    this.initAutoplay()
    this.initTouchEvents()
    
    const textElement = this.element.querySelector('[data-w-id="fce5574a-10a8-1f48-f756-24bc6ea2a3ec"]')
    
    gsap.to(this.element, {
      opacity: 1,
      duration: 0.5,
      ease: "power2.out"
    })
    
    if (textElement) {
      gsap.to(textElement, {
        opacity: 1,
        transform: "translate3d(0px, 0px, 0px) scale3d(1, 1, 1) rotateX(0deg) rotateY(0deg) rotateZ(0deg) skew(0deg, 0deg)",
        duration: 0.6,
        ease: "power2.out",
        delay: 0.8
      })
    }
  }

  disconnect() {
    this.stopAutoplay()
    this.cleanupTouchEvents()
    
    // Очищаем таймер взаимодействия пользователя
    if (this.userInteractionTimer) {
      clearTimeout(this.userInteractionTimer)
    }
    
    // Очищаем обработчик движения мыши
    if (this.handleMouseMove) {
      this.element.removeEventListener('mousemove', this.handleMouseMove)
    }
    
    if (this.lottieAnimation) {
      this.lottieAnimation.destroy()
    }
  }

  initTouchDetection() {
    this.isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0
  }

  initLottieAnimation() {
    if (!this.hasLottieCanvasTarget) {
      return
    }

    try {
      this.lottieAnimation = new DotLottie({
        canvas: this.lottieCanvasTarget,
        src: swipeRightAnimation,
        autoplay: false,
        loop: true
      })
      
      this.lottieAnimation.addEventListener('error', (error) => {
        console.error("❌ Lottie animation error:", error)
      })
      
    } catch (error) {
      console.error("❌ Failed to load Lottie animation:", error)
    }
  }

  showLottieHint() {
    if (!this.lottieAnimation) {
      return
    }
    
    const container = this.lottieCanvasTarget.parentElement
    container.style.display = 'block'
    container.style.opacity = '1'
    
    this.lottieAnimation.stop()
    this.lottieAnimation.play()
  }

  hideLottieHint() {
    if (this.hasLottieCanvasTarget) {
      const container = this.lottieCanvasTarget.parentElement
      container.style.opacity = '0'
    }
  }

  cleanupLottieTimers() {
    if (this.lottieShowTimer) {
      clearTimeout(this.lottieShowTimer)
      this.lottieShowTimer = null
    }
  }

  initTouchEvents() {
    this.touchStartX = 0
    this.touchEndX = 0
    this.touchStartY = 0
    this.touchEndY = 0
    this.minSwipeDistance = 50
    this.isSwiping = false
    
    this.handleTouchStart = this.handleTouchStart.bind(this)
    this.handleTouchMove = this.handleTouchMove.bind(this)
    this.handleTouchEnd = this.handleTouchEnd.bind(this)
    
    this.element.addEventListener('touchstart', this.handleTouchStart, { passive: false })
    this.element.addEventListener('touchmove', this.handleTouchMove, { passive: false })
    this.element.addEventListener('touchend', this.handleTouchEnd, { passive: true })
  }

  cleanupTouchEvents() {
    if (this.handleTouchStart) {
      this.element.removeEventListener('touchstart', this.handleTouchStart)
      this.element.removeEventListener('touchmove', this.handleTouchMove)
      this.element.removeEventListener('touchend', this.handleTouchEnd)
    }
  }

  handleTouchStart(event) {
    this.touchStartX = event.touches[0].clientX
    this.touchStartY = event.touches[0].clientY
    this.isSwiping = false
    this.handleUserInteraction()
    this.hideLottieHint()
  }

  handleTouchMove(event) {
    const deltaX = Math.abs(event.touches[0].clientX - this.touchStartX)
    const deltaY = Math.abs(event.touches[0].clientY - this.touchStartY)
    
    if (deltaX > deltaY && deltaX > 10) {
      this.isSwiping = true
      event.preventDefault()
    }
  }

  handleTouchEnd(event) {
    this.touchEndX = event.changedTouches[0].clientX
    this.touchEndY = event.changedTouches[0].clientY
    
    const deltaX = this.touchEndX - this.touchStartX
    const deltaY = Math.abs(this.touchEndY - this.touchStartY)
    
    if (this.isSwiping && Math.abs(deltaX) > this.minSwipeDistance && Math.abs(deltaX) > deltaY) {
      if (deltaX > 0) {
        this.nextSlide()
      } else {
        this.previousSlide()
      }
    }
    // Убираем setTimeout - автопрокрутка возобновится через handleUserInteraction
    
    this.isSwiping = false
  }

  setupInitialState() {
    this.contentTargets.forEach((slide, index) => {
      gsap.set(slide, {
        position: "absolute",
        top: "50%",
        left: "50%",
        xPercent: -50,
        yPercent: -50
      })
      
      this.animateSlideToPosition(slide, index, this.currentSlideValue, false)
    })
  }

  initAutoplay() {
    if (!this.autoplayValue) {
      return
    }
    
    this.startAutoplay()
    
    // Убираем обработчики mouseenter/mouseleave для непрерывной автопрокрутки
    // Автопрокрутка будет останавливаться только при активном взаимодействии
    this.initUserInteractionDetection()
  }

  initUserInteractionDetection() {
    // Отслеживаем активные взаимодействия пользователя
    const interactionEvents = ['click', 'keydown', 'wheel']
    
    interactionEvents.forEach(eventType => {
      this.element.addEventListener(eventType, () => {
        this.handleUserInteraction()
      })
    })
    
    // Отслеживаем движение мыши с дебаунсингом
    this.handleMouseMove = this.debounce(() => {
      this.handleUserInteraction()
    }, 100)
    
    this.element.addEventListener('mousemove', this.handleMouseMove)
  }

  debounce(func, wait) {
    let timeout
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout)
        func(...args)
      }
      clearTimeout(timeout)
      timeout = setTimeout(later, wait)
    }
  }

  handleUserInteraction() {
    // Временно останавливаем автопрокрутку при активном взаимодействии
    this.stopAutoplay()
    
    // Возобновляем через 3 секунды бездействия
    if (this.userInteractionTimer) {
      clearTimeout(this.userInteractionTimer)
    }
    
    this.userInteractionTimer = setTimeout(() => {
      this.startAutoplay()
    }, 3000)
  }

  startAutoplay() {
    if (!this.autoplayValue) return
    
    this.stopAutoplay()
    
    this.autoplayTimer = setInterval(() => {
      this.nextSlide()
    }, this.autoplayDelayValue)
  }

  stopAutoplay() {
    if (this.autoplayTimer) {
      clearInterval(this.autoplayTimer)
      this.autoplayTimer = null
    }
    this.hideLottieHint()
  }

  nextSlide() {
    this.showLottieHint()
    
    setTimeout(() => {
      this.hideLottieHint()
      this.doSlideChange()
    }, 1000)
  }

  doSlideChange() {
    this.currentSlideValue = (this.currentSlideValue - 1 + this.totalSlidesValue) % this.totalSlidesValue
    this.animateToSlide()
  }

  previousSlide() {
    this.handleUserInteraction()
    this.currentSlideValue = (this.currentSlideValue + 1) % this.totalSlidesValue
    this.animateToSlide()
  }

  goToSlide(event) {
    const slideIndex = parseInt(event.currentTarget.dataset.slideIndex)
    this.handleUserInteraction()
    this.currentSlideValue = slideIndex
    this.animateToSlide()
  }

  animateToSlide() {
    this.contentTargets.forEach((slide, index) => {
      this.animateSlideToPosition(slide, index, this.currentSlideValue, false)
    })
    this.updateDots()
  }

  getVisibleSlidesWindow() {
    const center = this.currentSlideValue
    const left = (center - 1 + this.totalSlidesValue) % this.totalSlidesValue
    const right = (center + 1) % this.totalSlidesValue
    return { left, center, right }
  }

  animateSlideToPosition(slide, slideIndex, currentSlide, animate = true) {
    let x, scale, opacity, zIndex
    
    const relativePosition = (slideIndex - currentSlide + this.totalSlidesValue) % this.totalSlidesValue
    
    if (relativePosition === 0) {
      x = 0; scale = 1; opacity = 1; zIndex = 3
    } else if (relativePosition === 1) {
      x = 600; scale = 0.7; opacity = 0.4; zIndex = 2
    } else if (relativePosition === this.totalSlidesValue - 1) {
      x = -600; scale = 0.8; opacity = 0.4; zIndex = 1
    } else {
      x = 2000; scale = 0; opacity = 0; zIndex = 0
    }

    if (animate) {
      gsap.to(slide, {
        duration: 0.3,
        x: x,
        scale: scale,
        opacity: opacity,
        zIndex: zIndex,
        ease: "power2.inOut"
      })
    } else {
      gsap.set(slide, {
        x: x,
        scale: scale,
        opacity: opacity,
        zIndex: zIndex
      })
    }
  }

  updateDots() {
    this.dotTargets.forEach((dot, index) => {
      if (index === this.currentSlideValue) {
        dot.classList.add('active')
      } else {
        dot.classList.remove('active')
      }
    })
  }
}

