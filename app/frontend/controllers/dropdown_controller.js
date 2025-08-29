import { Controller } from "@hotwired/stimulus"
import { gsap } from "gsap"

export default class extends Controller {
  static targets = ["container", "trigger", "menu", "icon", "line"]

  connect() {
    console.log("Dropdown connected")
    this.isOpen = false
    this.setupEventListeners()
    this.initializeDropdown()
  }

  disconnect() {
    document.removeEventListener('click', this.handleClickOutside.bind(this))
  }

  initializeDropdown() {
    // Set initial state
    gsap.set(this.menuTarget, {
      opacity: 0,
      visibility: "hidden",
      scale: 0.95,
      transformOrigin: "top left",
      zIndex: 99999 // Намного выше всех элементов
    })
  }

  setupEventListeners() {
    // Close dropdown when clicking outside
    document.addEventListener('click', this.handleClickOutside.bind(this))
    
    // Handle hover events for desktop
    this.containerTarget.addEventListener('mouseenter', () => {
      if (window.innerWidth >= 1024) { // lg breakpoint
        this.open()
      }
    })

    this.containerTarget.addEventListener('mouseleave', (e) => {
      if (window.innerWidth >= 1024) { // lg breakpoint
        console.log('🖱️ Mouse leaving container, related target:', e.relatedTarget)
        // Небольшая задержка чтобы проверить, не вошла ли мышка в dropdown
        setTimeout(() => {
          // Проверяем, действительно ли мышка вышла из всего dropdown области
          if (!this.containerTarget.matches(':hover') && !this.menuTarget.matches(':hover')) {
            console.log('✅ Confirmed mouse left dropdown area, closing')
            this.close()
          } else {
            console.log('❌ Mouse still in dropdown area, keeping open')
          }
        }, 50) // 50ms задержка
      }
    })

    // Hover animation for trigger
    this.triggerTarget.addEventListener('mouseenter', () => {
      this.animateHover(true)
    })

    this.triggerTarget.addEventListener('mouseleave', () => {
      if (!this.isOpen) {
        this.animateHover(false)
      }
    })
  }

  toggle() {
    if (this.isOpen) {
      this.close()
    } else {
      this.open()
    }
  }

  open() {
    if (this.isOpen) return
    
    this.isOpen = true
    
    // Animate icon rotation
    gsap.to(this.iconTarget, {
      rotation: 180,
      duration: 0.3,
      ease: "power2.out"
    })

    // Animate underline
    this.animateHover(true)

    // Animate dropdown menu
    gsap.to(this.menuTarget, {
      opacity: 1,
      visibility: "visible",
      scale: 1,
      zIndex: 99999, // Намного выше всех элементов
      duration: 0.3,
      ease: "back.out(1.7)"
    })

    // Animate dropdown items
    const menuItems = this.menuTarget.querySelectorAll('.navbar-link-item')
    if (menuItems.length > 0) {
      gsap.fromTo(menuItems,
        {
          y: -10,
          opacity: 0
        },
        {
          y: 0,
          opacity: 1,
          duration: 0.2,
          stagger: 0.05,
          delay: 0.1,
          ease: "power2.out"
        }
      )
    }
  }

  close() {
    if (!this.isOpen) return
    
    console.log('🔽 Closing dropdown')
    this.isOpen = false

    // Animate icon rotation back
    gsap.to(this.iconTarget, {
      rotation: 0,
      duration: 0.3,
      ease: "power2.out"
    })

    // Всегда сбрасываем underline при закрытии - убираем проблемную проверку
    this.animateHover(false)

    // Animate dropdown menu
    gsap.to(this.menuTarget, {
      opacity: 0,
      visibility: "hidden",
      scale: 0.95,
      duration: 0.2,
      ease: "power2.inOut"
    })
  }

  animateHover(isHovered) {
    if (!this.hasLineTarget) return

    gsap.to(this.lineTarget, {
      width: isHovered ? '100%' : '0%',
      duration: 0.3,
      ease: "power2.out"
    })
  }

  handleClickOutside(event) {
    if (!this.containerTarget.contains(event.target)) {
      this.close()
    }
  }

  // Handle menu item clicks
  selectItem(event) {
    const item = event.currentTarget
    const text = item.textContent.trim()
    
    // Optional: Update trigger text
    // this.triggerTarget.querySelector('.footer-link').textContent = text
    
    // Add selection animation
    gsap.to(item, {
      backgroundColor: '#f3f4f6',
      duration: 0.1,
      yoyo: true,
      repeat: 1,
      ease: "power2.inOut"
    })

    // Close dropdown after selection
    setTimeout(() => {
      this.close()
    }, 150)
  }
}