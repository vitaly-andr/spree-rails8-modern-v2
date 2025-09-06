import { Controller } from "@hotwired/stimulus"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

// Registers the plugin with GSAP
gsap.registerPlugin(ScrollTrigger)

export default class extends Controller {
  static targets = ["container", "brand", "cart", "menuButton", "hamburgerIcon", "line1", "line2", "line3", "mobileMenu", "overlay"]

  // Переменные для управления mobile menu layout
  originalParent = null
  originalNextSibling = null  
  originalScrollY = 0
  locomotiveContainer = null

  connect() {
    this.mobileMenuOpen = false // Track menu state reliably
    this.initializeNavbar()
    this.setupScrollAnimations()
    this.setupHoverAnimations()
    
    // ✅ ДОБАВЛЯЕМ ДИАГНОСТИКУ ПО КЛАВИШЕ
    window.addEventListener('keydown', (e) => {
        if (e.key === 'D' && e.ctrlKey) {  // Ctrl+D
            e.preventDefault()
            this.diagnoseScrollManual()
        }
    })
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
        
        // ✅ ИСПРАВЛЕНИЕ: НЕ АНИМИРУЕМ NAVBAR КОГДА MOBILE MENU ОТКРЫТО
        if (this.mobileMenuOpen) {
          return // Пропускаем анимацию если mobile menu открыто
        }
        
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
    
    if (!this.hasMobileMenuTarget) {
      console.warn("❌ Mobile menu target not found")
      return
    }
    
    if (this.menuButtonTarget.disabled) return
    
    if (this.mobileMenuOpen) {
      this.closeMobileMenu()
    } else {
      this.openMobileMenu()
    }
  }

  openMobileMenu() {
    if (this.mobileMenuOpen) return
    
    this.mobileMenuOpen = true
    
    this.setupMobileMenuLayout()
    
    // ✅ ИСПРАВЛЕНИЕ: СБРАСЫВАЕМ ПОЗИЦИЮ NAVBAR
    gsap.set(this.containerTarget, {
      y: 0,
      opacity: 1
    })
    
    // СОЗДАЕМ STACKING CONTEXT для navbar
    this.containerTarget.style.transform = 'translateZ(0)'
    
    // ОСТАНАВЛИВАЕМ КАРУСЕЛЬ
    this.pauseCarousels()
    
    // Отключаем кнопку на короткое время
    this.menuButtonTarget.disabled = true
    this.menuButtonTarget.style.pointerEvents = 'none'
    
    setTimeout(() => {
      this.menuButtonTarget.disabled = false
      this.menuButtonTarget.style.pointerEvents = 'auto'
    }, 1000)

    // Animate hamburger to X and then hide completely
    this.animateHamburgerToX()

    // Show overlay with increased opacity
    if (this.hasOverlayTarget) {
      gsap.to(this.overlayTarget, {
        opacity: 0.6,
        visibility: "visible",
        duration: 0.3,
        ease: "power2.out"
      })
    }

    // УБИРАЕМ КОНФЛИКТ: удаляем Tailwind класс и используем только GSAP
    if (this.hasMobileMenuTarget) {
      this.mobileMenuTarget.classList.remove('-translate-x-full')
      
      gsap.to(this.mobileMenuTarget, {
        x: "0%",
        duration: 0.4,
        ease: "power3.out",
        onComplete: () => {
        }
      })

      // Animate menu items with beautiful stagger effect
      this.animateMenuItemsIn()
    }
  }

  closeMobileMenu() {
    if (!this.mobileMenuOpen) return
    
    this.mobileMenuOpen = false
    
    // 🔍 ОЧИЩАЕМ ДЕТЕКТИВА
    if (this.scrollObserver) {
        this.scrollObserver.disconnect()
        this.scrollObserver = null
    }
    
    // УБИРАЕМ STACKING CONTEXT
    this.containerTarget.style.transform = ''
    
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
          
          // 🔓 ВОССТАНАВЛИВАЕМ LAYOUT ПОСЛЕ АНИМАЦИИ
          this.restoreMobileMenuLayout()
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

  setupMobileMenuLayout() {
    const body = document.body
    this.locomotiveContainer = document.querySelector('[data-scroll-container]')
    
    // Сохраняем текущую позицию скролла
    this.originalScrollY = window.scrollY
    
    // ✅ ДИАГНОСТИКА СКРОЛЛА - добавьте это ПЕРЕД блокировкой
    this.diagnoseScroll()
    
    // ✅ ДОБАВЛЯЕМ ДИАГНОСТИКУ ПО КЛИКУ НА MOBILE MENU
    if (this.mobileMenuTarget) {
        // Убираем старый listener если есть
        this.mobileMenuTarget.removeEventListener('click', this.boundDiagnose)
        
        // Добавляем новый
        this.boundDiagnose = () => {
            setTimeout(() => this.diagnoseScroll(), 100) // Задержка для dropdown анимации
        }
        this.mobileMenuTarget.addEventListener('click', this.boundDiagnose)
    }
    
    // Блокируем скролл страницы
    body.style.overflow = 'hidden'
    
    // Блокируем locomotive container  
    if (this.locomotiveContainer) {
        this.locomotiveContainer.style.overflow = 'hidden'
        this.locomotiveContainer.style.position = 'fixed'
        this.locomotiveContainer.style.height = '100vh'
        
        // ✅ ФИКСИРУЕМ MOBILE MENU НА ВСЮ ВЫСОТУ VIEWPORT
        this.mobileMenuTarget.style.height = '100vh'
        this.mobileMenuTarget.style.overflow = 'visible'
        
        // ✅ MOBILE CONTENT СКРОЛЛИТСЯ ВНУТРИ
        const mobileContent = this.mobileMenuTarget.querySelector('.mobile-content')
        if (mobileContent) {
            mobileContent.style.height = 'calc(100vh - 100px)'
            mobileContent.style.overflowY = 'auto'
            mobileContent.style.overflow = 'auto'
            mobileContent.style.pointerEvents = 'auto'
            mobileContent.style.touchAction = 'pan-y'
            mobileContent.style.webkitOverflowScrolling = 'touch'
            
            // ✅ ИСПРАВЛЯЕМ СКРОЛЛ МЫШКОЙ (блокируем Locomotive)
            mobileContent.addEventListener('wheel', (e) => {
                e.preventDefault() // Блокируем Locomotive Scroll
                mobileContent.scrollTop += e.deltaY // Скроллим вручную
            })
            
            // ✅ ИСПРАВЛЯЕМ TOUCH СКРОЛЛ ДЛЯ МОБИЛЬНЫХ
            let touchStartY = 0
            mobileContent.addEventListener('touchstart', (e) => {
                touchStartY = e.touches[0].clientY
            })
            
            mobileContent.addEventListener('touchmove', (e) => {
                const touchY = e.touches[0].clientY
                const deltaY = touchStartY - touchY
                mobileContent.scrollTop += deltaY
                touchStartY = touchY
                e.preventDefault() // Блокируем системный скролл
            })
            
            // ✅ ТЕСТ СКРОЛЛА ВРУЧНУЮ
            mobileContent.addEventListener('wheel', (e) => {
                console.log("🖱️ Wheel event detected:", e.deltaY)
                
                // ✅ ПРИНУДИТЕЛЬНО СКРОЛЛИМ ПРОГРАММНО
                e.preventDefault() // Блокируем обычный скролл
                mobileContent.scrollTop += e.deltaY // Скроллим вручную
                console.log("📜 Scroll position:", mobileContent.scrollTop)
            })
            
            mobileContent.addEventListener('touchstart', (e) => {
                console.log("👆 Touch start detected")
            })
            
            // ✅ ДЕТЕКТИВ: КТО МЕНЯЕТ OVERFLOW?
            const observer = new MutationObserver((mutations) => {
                mutations.forEach((mutation) => {
                    if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
                        const currentOverflow = mobileContent.style.overflow
                        if (currentOverflow !== 'auto') {
                            console.error("🚨 FOUND THE CULPRIT!")
                            console.error("📍 Overflow changed to:", currentOverflow)
                            console.error("📍 Stack trace:")
                            console.trace()
                            
                            // Немедленно исправляем
                            mobileContent.style.overflow = 'auto'
                            mobileContent.style.overflowY = 'auto'
                        }
                    }
                })
            })
            
            observer.observe(mobileContent, {
                attributes: true,
                attributeFilter: ['style']
            })
            
            // Сохраняем для очистки
            this.scrollObserver = observer
            
            // ✅ ИСПРАВЛЯЕМ ВСЕ РОДИТЕЛЕЙ С OVERFLOW: HIDDEN
            let parent = mobileContent.parentElement
            let level = 0
            while (parent && level < 10) {
                const styles = window.getComputedStyle(parent)
                if (styles.overflow === 'hidden') {
                    parent.style.overflow = 'visible'
                    console.log(`🔧 Fixed overflow for parent ${level}: ${parent.className}`)
                }
                parent = parent.parentElement
                level++
            }
        }
    }
    
    // ✅ ДИАГНОСТИКА СКРОЛЛА - и ПОСЛЕ блокировки
    setTimeout(() => this.diagnoseScroll(), 100)
}

// ✅ ДОБАВЬТЕ ЭТОТ МЕТОД:
diagnoseScroll() {
    console.log("🔍 === SCROLL DIAGNOSIS ===")
    
    const mobileMenu = this.mobileMenuTarget
    const mobileContent = mobileMenu?.querySelector('.mobile-content')
    
    if (mobileMenu) {
        const menuStyles = window.getComputedStyle(mobileMenu)
        console.log("📱 Mobile Menu:")
        console.log("  - scrollHeight:", mobileMenu.scrollHeight, "vs clientHeight:", mobileMenu.clientHeight)
        console.log("  - overflow:", menuStyles.overflow)
        console.log("  - position:", menuStyles.position)
        console.log("  - height:", menuStyles.height)
        console.log("  - maxHeight:", menuStyles.maxHeight)
    }
    
    if (mobileContent) {
        const contentStyles = window.getComputedStyle(mobileContent)
        console.log("📄 Mobile Content:")
        console.log("  - scrollHeight:", mobileContent.scrollHeight, "vs clientHeight:", mobileContent.clientHeight)
        console.log("  - overflow:", contentStyles.overflow, contentStyles.overflowY)
        console.log("  - height:", contentStyles.height)
        console.log("  - maxHeight:", contentStyles.maxHeight)
        
        // Проверяем родителей
        let parent = mobileContent.parentElement
        let level = 0
        while (parent && level < 5) {
            const parentStyles = window.getComputedStyle(parent)
            console.log(`📦 Parent ${level} (${parent.className}):`)
            console.log(`  - overflow: ${parentStyles.overflow}`)
            console.log(`  - position: ${parentStyles.position}`)
            console.log(`  - height: ${parentStyles.height}`)
            parent = parent.parentElement
            level++
        }
    }
    
    console.log("🔍 === END DIAGNOSIS ===")
}

diagnoseScrollManual() {
    if (this.mobileMenuOpen) {
        this.diagnoseScroll()
    }
}

restoreMobileMenuLayout() {
    
    const body = document.body
    
    // Разблокируем скролл страницы
    body.style.overflow = ''
    
    // ❌ ЗАКОММЕНТИРУЙТЕ И ЭТОТ БЛОК:
    /*
    // Восстанавливаем locomotive container
    if (this.locomotiveContainer) {
        this.locomotiveContainer.style.overflow = ''
        this.locomotiveContainer.style.position = ''
        this.locomotiveContainer.style.height = ''
    }
    */
    
    // Восстанавливаем позицию скролла
    if (this.originalScrollY) {
        window.scrollTo(0, this.originalScrollY)
    }
    
    // Возвращаем mobile menu в исходное место (с задержкой)
    setTimeout(() => {
        if (this.originalParent && this.mobileMenuTarget) {
            // Сбрасываем принудительные стили
            this.mobileMenuTarget.style.position = ''
            this.mobileMenuTarget.style.top = ''
            this.mobileMenuTarget.style.left = ''
            this.mobileMenuTarget.style.zIndex = ''
            this.mobileMenuTarget.style.width = ''
            this.mobileMenuTarget.style.height = ''
            this.mobileMenuTarget.style.background = ''
            
            // Возвращаем в DOM
            if (this.originalNextSibling) {
                this.originalParent.insertBefore(this.mobileMenuTarget, this.originalNextSibling)
            } else {
                this.originalParent.appendChild(this.mobileMenuTarget)
            }
            
        }
        
        // Сбрасываем переменные
        this.originalParent = null
        this.originalNextSibling = null
        this.originalScrollY = 0
        this.locomotiveContainer = null
        
    }, 100) // Небольшая задержка для завершения анимации
    
}
}