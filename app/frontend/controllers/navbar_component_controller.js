import { Controller } from "@hotwired/stimulus"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

// Registers the plugin with GSAP
gsap.registerPlugin(ScrollTrigger)

export default class extends Controller {
  static targets = ["container", "brand", "cart", "menuButton", "hamburgerIcon", "line1", "line2", "line3", "mobileMenu", "overlay"]

  connect() {
    console.log("Navbar Component connected")
    this.mobileMenuOpen = false // Track menu state reliably
    this.initializeNavbar()
    this.setupScrollAnimations()
    this.setupHoverAnimations()
  }

  disconnect() {
    // Cleanup GSAP animations
    ScrollTrigger.getAll().forEach(trigger => trigger.kill())
  }

  initializeNavbar() {
    // Initial state setup
    gsap.set(this.containerTarget, {
      y: 0,
      opacity: 1
    })

    // Set initial mobile menu state - slide menu from left
    if (this.hasMobileMenuTarget) {
      gsap.set(this.mobileMenuTarget, {
        x: "-100%"
      })
    }
    
    // Set initial overlay state
    if (this.hasOverlayTarget) {
      gsap.set(this.overlayTarget, {
        opacity: 0,
        visibility: "hidden"
      })
    }

    // Set initial hamburger icon lines state
    if (this.hasLine1Target && this.hasLine2Target && this.hasLine3Target) {
      gsap.set([this.line1Target, this.line2Target, this.line3Target], {
        transformOrigin: "center center"
      })
    }
  }

  setupScrollAnimations() {
    // Navbar scroll behavior - hide on scroll down, show on scroll up
    let lastScrollY = 0
    
    ScrollTrigger.create({
      trigger: "body",
      start: "top top",
      end: "bottom bottom",
      onUpdate: (self) => {
        const currentScrollY = self.scroll()
        
        if (currentScrollY > lastScrollY && currentScrollY > 100) {
          // Scrolling down - hide navbar
          gsap.to(this.containerTarget, {
            y: -100,
            opacity: 0.95,
            duration: 0.3,
            ease: "power2.out"
          })
        } else if (currentScrollY < lastScrollY) {
          // Scrolling up - show navbar
          gsap.to(this.containerTarget, {
            y: 0,
            opacity: 1,
            duration: 0.3,
            ease: "power2.out"
          })
        }
        
        lastScrollY = currentScrollY
      }
    })

    // Navbar background opacity on scroll
    ScrollTrigger.create({
      trigger: "body",
      start: "top top",
      end: "bottom bottom",
      onUpdate: (self) => {
        const progress = Math.min(self.scroll() / 100, 1)
        gsap.to(this.containerTarget.parentElement, {
          backgroundColor: `rgba(243, 244, 246, ${0.8 + (0.2 * progress)})`,
          backdropFilter: `blur(${progress * 10}px)`,
          duration: 0.1
        })
      }
    })
  }

  setupHoverAnimations() {
    // Logo hover animation
    this.brandTarget.addEventListener('mouseenter', () => {
      gsap.to(this.brandTarget, {
        scale: 1.05,
        duration: 0.3,
        ease: "power2.out"
      })
    })

    this.brandTarget.addEventListener('mouseleave', () => {
      gsap.to(this.brandTarget, {
        scale: 1,
        duration: 0.3,
        ease: "power2.out"
      })
    })

    // Cart hover animation
    if (this.hasCartTarget) {
      this.cartTarget.addEventListener('mouseenter', () => {
        gsap.to(this.cartTarget, {
          scale: 1.1,
          rotation: 5,
          duration: 0.3,
          ease: "back.out(1.7)"
        })
      })

      this.cartTarget.addEventListener('mouseleave', () => {
        gsap.to(this.cartTarget, {
          scale: 1,
          rotation: 0,
          duration: 0.3,
          ease: "back.out(1.7)"
        })
      })
    }

    // Nav links underline animation - возвращаем JS анимацию
    const navLinks = this.element.querySelectorAll('.navbar-link-item, .nav-dropdown-toggle, .collapsible-trigger')
    navLinks.forEach(link => {
      const underline = link.querySelector('.nav-line')
      if (underline) {
        link.addEventListener('mouseenter', () => {
          gsap.to(underline, {
            width: '100%',
            duration: 0.3,
            ease: "power2.out"
          })
        })

        link.addEventListener('mouseleave', () => {
          gsap.to(underline, {
            width: '0%',
            duration: 0.3,
            ease: "power2.out"
          })
        })
      }
    })
  }

  toggleMobileMenu() {
    console.log("🔍 Toggle clicked! Current state:", {
      mobileMenuOpen: this.mobileMenuOpen,
      buttonDisabled: this.menuButtonTarget.disabled,
      hasTarget: this.hasMobileMenuTarget
    })
    
    if (!this.hasMobileMenuTarget) {
      console.warn("❌ Mobile menu target not found")
      return
    }
    
    if (this.menuButtonTarget.disabled) {
      console.warn("❌ Button is disabled, ignoring click")
      return
    }
    
    // Use reliable state tracking instead of DOM inspection
    if (this.mobileMenuOpen) {
      console.log("📱 Closing menu...")
      this.closeMobileMenu()
    } else {
      console.log("📱 Opening menu...")
      this.openMobileMenu()
    }
  }

  openMobileMenu() {
    if (this.mobileMenuOpen) return // Prevent double opening
    
    this.mobileMenuOpen = true
    
    console.log("🔄 Opening mobile menu...")
    console.log("📱 Mobile menu element:", this.mobileMenuTarget)
    
    // СОЗДАЕМ STACKING CONTEXT для navbar
    this.containerTarget.style.transform = 'translateZ(0)'
    console.log("🆙 Navbar stacking context created")
    
    // ОСТАНАВЛИВАЕМ КАРУСЕЛЬ
    this.pauseCarousels()
    
    // Отключаем кнопку на короткое время
    this.menuButtonTarget.disabled = true
    this.menuButtonTarget.style.pointerEvents = 'none'
    
    setTimeout(() => {
      this.menuButtonTarget.disabled = false
      this.menuButtonTarget.style.pointerEvents = 'auto'
      console.log("🔓 Button re-enabled after timeout")
    }, 1000) // Разблокируем через 1 секунду в любом случае

    // Animate hamburger to X and then hide completely
    this.animateHamburgerToX()

    // Show overlay with increased opacity
    if (this.hasOverlayTarget) {
      gsap.to(this.overlayTarget, {
        opacity: 0.6, // Увеличили в 2 раза: с 0.3 до 0.6
        visibility: "visible",
        duration: 0.3,
        ease: "power2.out"
      })
    }

    // УБИРАЕМ КОНФЛИКТ: удаляем Tailwind класс и используем только GSAP
    if (this.hasMobileMenuTarget) {
      this.mobileMenuTarget.classList.remove('-translate-x-full')
      
      console.log("📱 Removed Tailwind class, starting GSAP animation")
      
      gsap.to(this.mobileMenuTarget, {
        x: "0%",
        duration: 0.4,
        ease: "power3.out",
        onComplete: () => {
          console.log("✅ Mobile menu animation complete!")
        }
      })

      // Animate menu items with beautiful stagger effect
      this.animateMenuItemsIn()
    }
  }

  closeMobileMenu() {
    if (!this.mobileMenuOpen) return // Prevent double closing
    
    this.mobileMenuOpen = false
    
    console.log("🔄 Closing mobile menu...")
    
    // УБИРАЕМ STACKING CONTEXT
    this.containerTarget.style.transform = ''
    console.log("⬇️ Navbar stacking context removed")
    
    // ВОЗОБНОВЛЯЕМ КАРУСЕЛЬ
    this.resumeCarousels()
    
    // Включаем кнопку обратно
    this.menuButtonTarget.disabled = false
    this.menuButtonTarget.style.pointerEvents = 'auto'

    // Animate X back to hamburger and show
    this.animateXToHamburger()

    // Hide overlay
    if (this.hasOverlayTarget) {
      gsap.to(this.overlayTarget, {
        opacity: 0,
        visibility: "hidden",
        duration: 0.3,
        ease: "power2.inOut"
      })
    }

    // Slide out mobile sidebar to left
    if (this.hasMobileMenuTarget) {
      gsap.to(this.mobileMenuTarget, {
        x: "-100%",
        duration: 0.4,
        ease: "power3.inOut",
        onComplete: () => {
          // ВОЗВРАЩАЕМ Tailwind класс после анимации
          this.mobileMenuTarget.classList.add('-translate-x-full')
          console.log("✅ Mobile menu closed, Tailwind class restored")
        }
      })

      // Close all collapsible sections in sidebar
      const sidebarController = this.application.getControllerForElementAndIdentifier(
        this.mobileMenuTarget, 
        'sidebar-menu'
      )
      if (sidebarController && typeof sidebarController.handleMobileMenuClose === 'function') {
        sidebarController.handleMobileMenuClose()
      }
    }
  }

  animateHamburgerToX() {
    if (this.hasLine1Target && this.hasLine2Target && this.hasLine3Target) {
      // Timeline for smooth hamburger to X animation
      const tl = gsap.timeline()
      
      tl.to(this.line1Target, {
        rotation: 45,
        y: 7,
        duration: 0.3,
        ease: "power2.out"
      })
      .to(this.line2Target, {
        opacity: 0,
        duration: 0.2,
        ease: "power2.out"
      }, "-=0.2")
      .to(this.line3Target, {
        rotation: -45,
        y: -7,
        duration: 0.3,
        ease: "power2.out"
      }, "-=0.3")
      
      // После формирования X полностью скрываем весь гамбургер
      .to(this.hamburgerIconTarget, {
        opacity: 0,
        scale: 0.8,
        duration: 0.2,
        ease: "power2.out"
      })
    }
  }

  animateXToHamburger() {
    if (this.hasLine1Target && this.hasLine2Target && this.hasLine3Target) {
      // Сначала показываем гамбургер обратно
      const tl = gsap.timeline()
      
      tl.to(this.hamburgerIconTarget, {
        opacity: 1,
        scale: 1,
        duration: 0.2,
        ease: "power2.out"
      })
      
      // Затем анимируем X обратно в гамбургер
      .to(this.line1Target, {
        rotation: 0,
        y: 0,
        duration: 0.3,
        ease: "power2.out"
      })
      .to(this.line3Target, {
        rotation: 0,
        y: 0,
        duration: 0.3,
        ease: "power2.out"
      }, "-=0.3")
      .to(this.line2Target, {
        opacity: 1,
        duration: 0.2,
        ease: "power2.out"
      }, "-=0.1")
    }
  }

  animateMenuItemsIn() {
    // Находим все основные пункты меню в правильном порядке появления
    const allMenuItems = this.mobileMenuTarget.querySelectorAll('.mobile-nav-item')
    
    // Reset initial state для всех элементов
    gsap.set(allMenuItems, {
      x: -80,
      opacity: 0
    })

    // Очень мягкая и элегантная анимация
    gsap.to(allMenuItems, {
      x: 0,
      opacity: 1,
      duration: 0.8,
      stagger: 0.1,
      ease: "back.out(0.3)" // Очень мягкий back easing вместо bounce
    })
  }

  // Close mobile menu when clicking outside
  handleClickOutside(event) {
    if (!this.element.contains(event.target)) {
      this.closeMobileMenu()
    }
  }

  // Методы для управления каруселями - убираем display костыль
  pauseCarousels() {
    // Пока убираем
  }

  resumeCarousels() {
    // Пока убираем
  }
}