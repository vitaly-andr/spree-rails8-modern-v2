import { Controller } from "@hotwired/stimulus"
import { gsap } from "gsap"

export default class extends Controller {
  static targets = [
    "demosIcon", "demosContent", 
    "pagesIcon", "pagesContent"
  ]

  connect() {
    console.log("Sidebar Menu connected")
    this.setupInitialState()
  }

  setupInitialState() {
    // Set initial state for all collapsible sections
    this.demosContentTarget.classList.add('hidden')
    this.pagesContentTarget.classList.add('hidden')
    
    // Set initial arrow rotation
    gsap.set([this.demosIconTarget, this.pagesIconTarget], {
      rotation: 0
    })
  }

  toggleSection(event) {
    const sectionParam = event.params.section
    const iconTarget = this[`${sectionParam}IconTarget`]
    const contentTarget = this[`${sectionParam}ContentTarget`]
    
    if (!iconTarget || !contentTarget) {
      console.warn(`Section "${sectionParam}" targets not found`)
      return
    }

    const isOpen = !contentTarget.classList.contains('hidden')
    
    if (isOpen) {
      this.closeSection(iconTarget, contentTarget)
    } else {
      this.openSection(iconTarget, contentTarget)
    }
  }

  openSection(iconTarget, contentTarget) {
    // Блокируем скролл на mobile-content во время анимации
    const mobileContent = this.element.querySelector('.mobile-content')
    if (mobileContent) {
      mobileContent.style.overflow = 'hidden'
    }

    // Rotate arrow to point down with smooth easing
    gsap.to(iconTarget, {
      rotation: 90,
      duration: 0.4,
      ease: "back.out(1.2)"
    })

    // Show content and prepare for animation
    contentTarget.classList.remove('hidden')
    contentTarget.style.overflow = 'hidden'
    contentTarget.style.height = '0px'
    
    // Измеряем естественную высоту
    const tempHeight = contentTarget.scrollHeight
    
    // Анимируем высоту
    gsap.to(contentTarget, {
      height: `${tempHeight}px`,
      duration: 0.4,
      ease: "power3.out",
      onComplete: () => {
        // После завершения анимации восстанавливаем нормальное состояние
        contentTarget.style.height = 'auto'
        contentTarget.style.overflow = 'visible'
        if (mobileContent) {
          mobileContent.style.overflow = 'auto'
        }
      }
    })

    // Анимируем opacity отдельно
    gsap.fromTo(contentTarget, 
      { opacity: 0 },
      { 
        opacity: 1, 
        duration: 0.3,
        delay: 0.1,
        ease: "power2.out"
      }
    )

    // Animate links with stagger
    const links = contentTarget.querySelectorAll('a')
    gsap.fromTo(links,
      {
        x: -30,
        opacity: 0,
        scale: 0.9
      },
      {
        x: 0,
        opacity: 1,
        scale: 1,
        duration: 0.3,
        stagger: 0.06,
        delay: 0.2,
        ease: "back.out(1.2)"
      }
    )
  }

  closeSection(iconTarget, contentTarget) {
    // Блокируем скролл на mobile-content во время анимации
    const mobileContent = this.element.querySelector('.mobile-content')
    if (mobileContent) {
      mobileContent.style.overflow = 'hidden'
    }

    // Rotate arrow back to right
    gsap.to(iconTarget, {
      rotation: 0,
      duration: 0.3,
      ease: "power2.inOut"
    })

    // Фиксируем текущую высоту для плавного закрытия
    const currentHeight = contentTarget.offsetHeight
    contentTarget.style.height = `${currentHeight}px`
    contentTarget.style.overflow = 'hidden'

    // Сначала скрываем ссылки
    const links = contentTarget.querySelectorAll('a')
    gsap.to(links, {
      x: -20,
      opacity: 0,
      scale: 0.9,
      duration: 0.2,
      stagger: 0.02,
      ease: "power2.in"
    })

    // Затем схлопываем контейнер
    gsap.to(contentTarget, {
      height: 0,
      opacity: 0,
      duration: 0.3,
      delay: 0.1,
      ease: "power2.inOut",
      onComplete: () => {
        contentTarget.classList.add('hidden')
        
        // Полностью сбрасываем состояние
        contentTarget.style.height = ''
        contentTarget.style.overflow = ''
        contentTarget.style.opacity = ''
        
        // Восстанавливаем скролл
        if (mobileContent) {
          mobileContent.style.overflow = 'auto'
        }
        
        // Reset links
        gsap.set(links, {
          x: 0,
          opacity: 1,
          scale: 1
        })
      }
    })
  }

  // Close all sections (useful when closing mobile menu)
  closeAllSections() {
    const sections = ['demos', 'pages']
    
    sections.forEach(section => {
      const iconTarget = this[`${section}IconTarget`]
      const contentTarget = this[`${section}ContentTarget`]
      
      if (iconTarget && contentTarget && !contentTarget.classList.contains('hidden')) {
        this.closeSection(iconTarget, contentTarget)
      }
    })
  }

  // Method to handle mobile menu closing - called from navbar controller
  handleMobileMenuClose() {
    // Add small delay to let mobile menu animation start first
    setTimeout(() => {
      this.closeAllSections()
    }, 100)
  }
}
