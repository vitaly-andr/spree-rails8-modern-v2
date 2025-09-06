import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  connect() {
    // Убираем логи для production
    this.checkGSAPAvailability()
  }

  async checkGSAPAvailability() {
    // Способ 1: Глобальная переменная
    if (window.gsap && window.ScrollTrigger) {
      this.initAnimations(window.gsap, window.ScrollTrigger)
      return
    }
    
    // Способ 2: Динамический импорт
    try {
      const [gsapModule, scrollTriggerModule] = await Promise.all([
        import('gsap'),
        import('gsap/ScrollTrigger')
      ])
      
      const gsap = gsapModule.gsap || gsapModule.default
      const ScrollTrigger = scrollTriggerModule.ScrollTrigger || scrollTriggerModule.default
      
      if (gsap && ScrollTrigger) {
        gsap.registerPlugin(ScrollTrigger)
        this.initAnimations(gsap, ScrollTrigger)
        return
      }
    } catch (error) {
      console.warn("GSAP unavailable, using CSS fallback")
    }
    
    // Fallback к CSS анимациям
    this.setupCSSFallback()
  }

  initAnimations(gsap, ScrollTrigger) {
    
    // Простая проверочная анимация
    const testElement = this.element.querySelector('h1')
    if (testElement) {
      gsap.from(testElement, {
        opacity: 0,
        y: 20,
        duration: 1,
        ease: "power2.out"
      })
    }
    
    // Остальные анимации...
    this.setupStaggerAnimations(gsap, ScrollTrigger)
  }

  setupStaggerAnimations(gsap, ScrollTrigger) {
    
    // Анимация для всех li элементов с реверсивным эффектом
    const listItems = this.element.querySelectorAll('li')
    
    if (listItems.length > 0) {
      // Устанавливаем начальное состояние
      gsap.set(listItems, { 
        opacity: 0, 
        x: -30 
      })
      
      // Группируем li по секциям для отдельного stagger в каждой
      const sections = this.element.querySelectorAll('[data-scroll-section]')
      
      sections.forEach((section, sectionIndex) => {
        const sectionListItems = section.querySelectorAll('li')
        
        if (sectionListItems.length > 0) {
          
          ScrollTrigger.create({
            trigger: section,
            start: "top 80%",
            end: "bottom 20%",
            
            onEnter: () => {
              gsap.to(sectionListItems, {
                opacity: 1,
                x: 0,
                duration: 0.5,
                stagger: 0.1,
                ease: "power2.out"
              })
            },
            
            onLeave: () => {
              gsap.to(sectionListItems, {
                opacity: 0,
                x: -30,
                duration: 0.3,
                stagger: 0.05,
                ease: "power2.in"
              })
            },
            
            onEnterBack: () => {
              gsap.to(sectionListItems, {
                opacity: 1,
                x: 0,
                duration: 0.5,
                stagger: 0.1,
                ease: "power2.out"
              })
            },
            
            onLeaveBack: () => {
              gsap.to(sectionListItems, {
                opacity: 0,
                x: -30,
                duration: 0.3,
                stagger: 0.05,
                ease: "power2.in"
              })
            }
          })
        }
      })
    }

    // Анимация для карточек с реверсивным эффектом
    const cards = this.element.querySelectorAll('.bg-white.rounded-lg, .bg-red-50.rounded-lg, .bg-green-50.rounded-lg, .bg-blue-50.rounded-lg, .bg-purple-50.rounded-lg, .bg-orange-50.rounded-lg, .bg-yellow-50.rounded-lg')
    
    if (cards.length > 0) {
      // Устанавливаем начальное состояние
      gsap.set(cards, { 
        opacity: 0, 
        y: 50,
        scale: 0.95
      })
      
      cards.forEach((card, index) => {
        ScrollTrigger.create({
          trigger: card,
          start: "top 85%",
          end: "bottom 15%",
          
          onEnter: () => {
            gsap.to(card, {
              opacity: 1,
              y: 0,
              scale: 1,
              duration: 0.6,
              delay: (index % 2) * 0.15, // Stagger для карточек в каждом ряду
              ease: "back.out(1.7)"
            })
          },
          
          onLeave: () => {
            gsap.to(card, {
              opacity: 0,
              y: -30,
              scale: 0.95,
              duration: 0.4,
              ease: "power2.in"
            })
          },
          
          onEnterBack: () => {
            gsap.to(card, {
              opacity: 1,
              y: 0,
              scale: 1,
              duration: 0.6,
              delay: (index % 2) * 0.15,
              ease: "back.out(1.7)"
            })
          },
          
          onLeaveBack: () => {
            gsap.to(card, {
              opacity: 0,
              y: 50,
              scale: 0.95,
              duration: 0.4,
              ease: "power2.in"
            })
          }
        })
      })
    }

    // Анимация для заголовков секций с реверсивным эффектом
    const sectionHeadings = this.element.querySelectorAll('[data-scroll-section] h2, [data-scroll-section] h3')
    
    if (sectionHeadings.length > 0) {
      // Устанавливаем начальное состояние
      gsap.set(sectionHeadings, { 
        opacity: 0, 
        y: 40 
      })
      
      sectionHeadings.forEach((heading, index) => {
        ScrollTrigger.create({
          trigger: heading.closest('[data-scroll-section]'),
          start: "top 75%",
          end: "bottom 25%",
          
          onEnter: () => {
            gsap.to(heading, {
              opacity: 1,
              y: 0,
              duration: 0.7,
              ease: "power3.out"
            })
          },
          
          onLeave: () => {
            gsap.to(heading, {
              opacity: 0,
              y: -20,
              duration: 0.4,
              ease: "power2.in"
            })
          },
          
          onEnterBack: () => {
            gsap.to(heading, {
              opacity: 1,
              y: 0,
              duration: 0.7,
              ease: "power3.out"
            })
          },
          
          onLeaveBack: () => {
            gsap.to(heading, {
              opacity: 0,
              y: 40,
              duration: 0.4,
              ease: "power2.in"
            })
          }
        })
      })
    }

    // Анимация для градиентных блоков с реверсивным эффектом
    const gradientBlocks = this.element.querySelectorAll('.bg-gradient-to-r')
    
    if (gradientBlocks.length > 0) {
      // Устанавливаем начальное состояние
      gsap.set(gradientBlocks, { 
        opacity: 0,
        scale: 0.9,
        rotationY: -5
      })
      
      gradientBlocks.forEach((block, index) => {
        ScrollTrigger.create({
          trigger: block,
          start: "top 70%",
          end: "bottom 30%",
          
          onEnter: () => {
            gsap.to(block, {
              opacity: 1,
              scale: 1,
              rotationY: 0,
              duration: 0.8,
              ease: "power2.out"
            })
          },
          
          onLeave: () => {
            gsap.to(block, {
              opacity: 0,
              scale: 1.1,
              rotationY: 5,
              duration: 0.5,
              ease: "power2.in"
            })
          },
          
          onEnterBack: () => {
            gsap.to(block, {
              opacity: 1,
              scale: 1,
              rotationY: 0,
              duration: 0.8,
              ease: "power2.out"
            })
          },
          
          onLeaveBack: () => {
            gsap.to(block, {
              opacity: 0,
              scale: 0.9,
              rotationY: -5,
              duration: 0.5,
              ease: "power2.in"
            })
          }
        })
      })
    }
  }

  setupCSSFallback() {
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1'
          entry.target.style.transform = 'translateX(0)'
        } else {
          entry.target.style.opacity = '0'
          entry.target.style.transform = 'translateX(-20px)'
        }
      })
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -20% 0px'
    })

    const items = this.element.querySelectorAll('li, .bg-white.rounded-lg, .bg-red-50.rounded-lg, .bg-green-50.rounded-lg, .bg-blue-50.rounded-lg, .bg-purple-50.rounded-lg, .bg-orange-50.rounded-lg')
    
    items.forEach((item) => {
      item.style.opacity = '0'
      item.style.transform = 'translateX(-20px)'
      item.style.transition = 'all 0.5s ease-out'
      observer.observe(item)
    })
  }

  disconnect() {
    if (window.ScrollTrigger) {
      window.ScrollTrigger.getAll().forEach(trigger => trigger.kill())
    }
  }
}
