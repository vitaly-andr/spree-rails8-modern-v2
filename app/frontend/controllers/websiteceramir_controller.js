import { Controller } from "@hotwired/stimulus"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

export default class extends Controller {
  connect() {
    console.log("WebSite Ceramir page controller connected")
    this.setupStaggerAnimations()
  }

  disconnect() {
    // Cleanup ScrollTrigger instances
    ScrollTrigger.getAll().forEach(trigger => trigger.kill())
  }

  setupStaggerAnimations() {
    // Анимация для всех li элементов с stagger эффектом
    const listItems = this.element.querySelectorAll('li')
    
    if (listItems.length > 0) {
      gsap.set(listItems, { 
        opacity: 0, 
        x: -20 
      })
      
      // Группируем li по секциям для отдельного stagger в каждой
      const sections = this.element.querySelectorAll('[data-scroll-section]')
      
      sections.forEach(section => {
        const sectionListItems = section.querySelectorAll('li')
        
        if (sectionListItems.length > 0) {
          ScrollTrigger.create({
            trigger: section,
            start: "top 80%",
            onEnter: () => {
              gsap.to(sectionListItems, {
                opacity: 1,
                x: 0,
                duration: 0.5,
                stagger: 0.1, // Stagger delay
                ease: "power2.out"
              })
            }
          })
        }
      })
    }

    // Анимация для карточек
    const cards = this.element.querySelectorAll('.bg-white.rounded-lg.shadow-md')
    
    if (cards.length > 0) {
      gsap.set(cards, { 
        opacity: 0, 
        y: 40,
        scale: 0.95
      })
      
      ScrollTrigger.create({
        trigger: cards[0].parentElement,
        start: "top 85%",
        onEnter: () => {
          gsap.to(cards, {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.6,
            stagger: 0.15, // Stagger для карточек
            ease: "back.out(1.7)"
          })
        }
      })
    }

    // Анимация для заголовков секций
    const sectionHeadings = this.element.querySelectorAll('[data-scroll-section] h2, [data-scroll-section] h3')
    
    if (sectionHeadings.length > 0) {
      gsap.set(sectionHeadings, { 
        opacity: 0, 
        y: 30 
      })
      
      sectionHeadings.forEach(heading => {
        ScrollTrigger.create({
          trigger: heading.closest('[data-scroll-section]'),
          start: "top 75%",
          onEnter: () => {
            gsap.to(heading, {
              opacity: 1,
              y: 0,
              duration: 0.7,
              ease: "power3.out"
            })
          }
        })
      })
    }

    // Анимация для градиентных блоков
    const gradientBlocks = this.element.querySelectorAll('.bg-gradient-to-r')
    
    if (gradientBlocks.length > 0) {
      gsap.set(gradientBlocks, { 
        opacity: 0,
        scale: 0.9
      })
      
      gradientBlocks.forEach(block => {
        ScrollTrigger.create({
          trigger: block,
          start: "top 70%",
          onEnter: () => {
            gsap.to(block, {
              opacity: 1,
              scale: 1,
              duration: 0.8,
              ease: "power2.out"
            })
          }
        })
      })
    }
  }
}
