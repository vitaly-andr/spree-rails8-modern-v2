import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  connect() {
    console.log("🔌 WebSite Ceramir controller connecting...")
    console.log("📊 Environment check:")
    console.log("- window.gsap:", typeof window.gsap)
    console.log("- window.ScrollTrigger:", typeof window.ScrollTrigger)
    console.log("- document.readyState:", document.readyState)
    
    // Проверяем разными способами
    this.checkGSAPAvailability()
  }

  async checkGSAPAvailability() {
    console.log("🔍 Checking GSAP availability...")
    
    // Способ 1: Глобальная переменная
    if (window.gsap && window.ScrollTrigger) {
      console.log("✅ GSAP available globally")
      this.initAnimations(window.gsap, window.ScrollTrigger)
      return
    }
    
    // Способ 2: Динамический импорт
    try {
      console.log("🔄 Trying dynamic import...")
      const [gsapModule, scrollTriggerModule] = await Promise.all([
        import('gsap'),
        import('gsap/ScrollTrigger')
      ])
      
      const gsap = gsapModule.gsap || gsapModule.default
      const ScrollTrigger = scrollTriggerModule.ScrollTrigger || scrollTriggerModule.default
      
      if (gsap && ScrollTrigger) {
        console.log("✅ GSAP loaded via dynamic import")
        gsap.registerPlugin(ScrollTrigger)
        this.initAnimations(gsap, ScrollTrigger)
        return
      }
    } catch (error) {
      console.warn("❌ Dynamic import failed:", error)
    }
    
    // Способ 3: Проверяем через timeout (возможно GSAP загружается позже)
    console.log("⏱️ Waiting for GSAP to load...")
    let attempts = 0
    const checkInterval = setInterval(() => {
      attempts++
      
      if (window.gsap && window.ScrollTrigger) {
        console.log(`✅ GSAP found after ${attempts} attempts`)
        clearInterval(checkInterval)
        this.initAnimations(window.gsap, window.ScrollTrigger)
      } else if (attempts >= 10) {
        console.warn("❌ GSAP not found after 10 attempts, using CSS fallback")
        clearInterval(checkInterval)
        this.setupCSSFallback()
      } else {
        console.log(`⏳ Attempt ${attempts}: Still waiting for GSAP...`)
      }
    }, 300) // Проверяем каждые 300ms
  }

  initAnimations(gsap, ScrollTrigger) {
    console.log("🎬 Initializing animations with GSAP")
    
    // Простая проверочная анимация
    const testElement = this.element.querySelector('h1')
    if (testElement) {
      gsap.from(testElement, {
        opacity: 0,
        y: 20,
        duration: 1,
        ease: "power2.out"
      })
      console.log("✨ Test animation applied to h1")
    }
    
    // Остальные анимации...
    this.setupStaggerAnimations(gsap, ScrollTrigger)
  }

  setupStaggerAnimations(gsap, ScrollTrigger) {
    console.log("🎬 Setting up stagger animations...")
    
    // Анимация для всех li элементов с реверсивным эффектом
    const listItems = this.element.querySelectorAll('li')
    console.log(`📝 Found ${listItems.length} list items`)
    
    if (listItems.length > 0) {
      // Устанавливаем начальное состояние
      gsap.set(listItems, { 
        opacity: 0, 
        x: -30 
      })
      
      // Группируем li по секциям для отдельного stagger в каждой
      const sections = this.element.querySelectorAll('[data-scroll-section]')
      console.log(`📄 Found ${sections.length} sections`)
      
      sections.forEach((section, sectionIndex) => {
        const sectionListItems = section.querySelectorAll('li')
        
        if (sectionListItems.length > 0) {
          console.log(`📄 Section ${sectionIndex}: ${sectionListItems.length} items`)
          
          ScrollTrigger.create({
            trigger: section,
            start: "top 80%",
            end: "bottom 20%",
            
            onEnter: () => {
              console.log(`✨ Animating IN section ${sectionIndex}`)
              gsap.to(sectionListItems, {
                opacity: 1,
                x: 0,
                duration: 0.5,
                stagger: 0.1,
                ease: "power2.out"
              })
            },
            
            onLeave: () => {
              console.log(`🌫️ Animating OUT section ${sectionIndex}`)
              gsap.to(sectionListItems, {
                opacity: 0,
                x: -30,
                duration: 0.3,
                stagger: 0.05,
                ease: "power2.in"
              })
            },
            
            onEnterBack: () => {
              console.log(`🔄 Animating BACK IN section ${sectionIndex}`)
              gsap.to(sectionListItems, {
                opacity: 1,
                x: 0,
                duration: 0.5,
                stagger: 0.1,
                ease: "power2.out"
              })
            },
            
            onLeaveBack: () => {
              console.log(`🔙 Animating BACK OUT section ${sectionIndex}`)
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
    console.log(`🃏 Found ${cards.length} cards`)
    
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
            console.log(`🃏 Card ${index} entering viewport`)
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
            console.log(`🌫️ Card ${index} leaving viewport`)
            gsap.to(card, {
              opacity: 0,
              y: -30,
              scale: 0.95,
              duration: 0.4,
              ease: "power2.in"
            })
          },
          
          onEnterBack: () => {
            console.log(`🔄 Card ${index} entering back`)
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
            console.log(`🔙 Card ${index} leaving back`)
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
    console.log(`📝 Found ${sectionHeadings.length} section headings`)
    
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
            console.log(`📝 Heading ${index} animating in`)
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
    console.log(`🌈 Found ${gradientBlocks.length} gradient blocks`)
    
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
            console.log(`🌈 Gradient block ${index} animating in`)
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

    console.log("🎯 All animations setup complete!")
  }

  setupCSSFallback() {
    console.log("🎨 Using CSS animations fallback")
    
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
