import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import LocomotiveScroll from 'locomotive-scroll'

// Регистрируем плагины GSAP
gsap.registerPlugin(ScrollTrigger)

// Переменная для Locomotive Scroll
let locoScroll

// Инициализация Locomotive Scroll v5
function initLocomotiveScroll() {
  // Новый API Locomotive Scroll v5 - больше не нужен data-scroll-container
  locoScroll = new LocomotiveScroll({
    lenisOptions: {
      lerp: 0.1,
      duration: 1.2,
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
      normalizeWheel: true,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
    }
  })
  
  // Активируем smooth scroll
  if (locoScroll && locoScroll.start) {
    locoScroll.start()
  }
  
  console.log('Locomotive Scroll initialized:', locoScroll)
}

// Функция для анимации fadeInUp
function initFadeInUpAnimations() {
  gsap.set('.js-animation.fadeInUp', { 
    y: 50, 
    opacity: 0 
  })
  
  ScrollTrigger.batch('.js-animation.fadeInUp', {
    onEnter: (elements) => {
      gsap.to(elements, {
        y: 0,
        opacity: 1,
        duration: 0.8,
        ease: 'power2.out',
        stagger: 0.1
      })
    },
    onLeave: (elements) => {
      gsap.to(elements, {
        y: 50,
        opacity: 0,
        duration: 0.6,
        ease: 'power2.in',
        stagger: 0.05
      })
    },
    onEnterBack: (elements) => {
      gsap.to(elements, {
        y: 0,
        opacity: 1,
        duration: 0.8,
        ease: 'power2.out',
        stagger: 0.1
      })
    },
    onLeaveBack: (elements) => {
      gsap.to(elements, {
        y: 50,
        opacity: 0,
        duration: 0.6,
        ease: 'power2.in',
        stagger: 0.05
      })
    },
    start: 'top 90%',
    end: 'bottom 10%'
  })
}

// Функция для анимации fadeIn
function initFadeInAnimations() {
  gsap.set('.js-animation.fadeIn', { 
    opacity: 0 
  })
  
  ScrollTrigger.batch('.js-animation.fadeIn', {
    onEnter: (elements) => {
      gsap.to(elements, {
        opacity: 1,
        duration: 1,
        ease: 'power2.out',
        stagger: 0.15
      })
    },
    onLeave: (elements) => {
      gsap.to(elements, {
        opacity: 0,
        duration: 0.8,
        ease: 'power2.in',
        stagger: 0.1
      })
    },
    onEnterBack: (elements) => {
      gsap.to(elements, {
        opacity: 1,
        duration: 1,
        ease: 'power2.out',
        stagger: 0.15
      })
    },
    onLeaveBack: (elements) => {
      gsap.to(elements, {
        opacity: 0,
        duration: 0.8,
        ease: 'power2.in',
        stagger: 0.1
      })
    },
    start: 'top 85%',
    end: 'bottom 15%'
  })
}

// Функция для анимации fadeInLeft
function initFadeInLeftAnimations() {
  gsap.set('.js-animation.fadeInLeft', { 
    x: -100, 
    opacity: 0 
  })
  
  ScrollTrigger.batch('.js-animation.fadeInLeft', {
    onEnter: (elements) => {
      gsap.to(elements, {
        x: 0,
        opacity: 1,
        duration: 1,
        ease: 'power2.out'
      })
    },
    onLeave: (elements) => {
      gsap.to(elements, {
        x: -100,
        opacity: 0,
        duration: 0.8,
        ease: 'power2.in'
      })
    },
    onEnterBack: (elements) => {
      gsap.to(elements, {
        x: 0,
        opacity: 1,
        duration: 1,
        ease: 'power2.out'
      })
    },
    onLeaveBack: (elements) => {
      gsap.to(elements, {
        x: -100,
        opacity: 0,
        duration: 0.8,
        ease: 'power2.in'
      })
    },
    start: 'top 80%',
    end: 'bottom 20%'
  })
}

// Функция для анимации fadeInRight
function initFadeInRightAnimations() {
  gsap.set('.js-animation.fadeInRight', { 
    x: 100, 
    opacity: 0 
  })
  
  ScrollTrigger.batch('.js-animation.fadeInRight', {
    onEnter: (elements) => {
      gsap.to(elements, {
        x: 0,
        opacity: 1,
        duration: 1,
        ease: 'power2.out',
        stagger: 0.2
      })
    },
    onLeave: (elements) => {
      gsap.to(elements, {
        x: 100,
        opacity: 0,
        duration: 0.8,
        ease: 'power2.in',
        stagger: 0.1
      })
    },
    onEnterBack: (elements) => {
      gsap.to(elements, {
        x: 0,
        opacity: 1,
        duration: 1,
        ease: 'power2.out',
        stagger: 0.2
      })
    },
    onLeaveBack: (elements) => {
      gsap.to(elements, {
        x: 100,
        opacity: 0,
        duration: 0.8,
        ease: 'power2.in',
        stagger: 0.1
      })
    },
    start: 'top 80%',
    end: 'bottom 20%'
  })
}

// Функция для анимации pulse
function initPulseAnimations() {
  ScrollTrigger.batch('.js-animation.pulse', {
    onEnter: (elements) => {
      elements.forEach(element => {
        gsap.to(element, {
          scale: 1.05,
          duration: 0.3,
          ease: 'power2.out',
          yoyo: true,
          repeat: 1
        })
        
        // Добавляем постоянную анимацию пульса
        gsap.to(element, {
          scale: 1.02,
          duration: 2,
          ease: 'power2.inOut',
          yoyo: true,
          repeat: -1,
          delay: 0.6
        })
      })
    },
    start: 'top 80%'
  })
}

// Функция для карусели
function initCarousel() {
  const carousel = document.querySelector('.js-carousel')
  if (!carousel) return
  
  const slides = carousel.querySelectorAll('.js-slide')
  const leftArrow = carousel.querySelector('.carousel-arrow-left')
  const rightArrow = carousel.querySelector('.carousel-arrow-right')
  
  if (slides.length === 0) return
  
  let currentSlide = 0
  const totalSlides = slides.length
  
  // Скрываем все слайды кроме первого
  gsap.set(slides, { opacity: 0 })
  gsap.set(slides[0], { opacity: 1 })
  
  function showSlide(index) {
    gsap.to(slides[currentSlide], {
      opacity: 0,
      duration: 0.5,
      ease: 'power2.inOut'
    })
    
    gsap.to(slides[index], {
      opacity: 1,
      duration: 0.5,
      ease: 'power2.inOut',
      delay: 0.2
    })
    
    currentSlide = index
  }
  
  function nextSlide() {
    const nextIndex = (currentSlide + 1) % totalSlides
    showSlide(nextIndex)
  }
  
  function prevSlide() {
    const prevIndex = (currentSlide - 1 + totalSlides) % totalSlides
    showSlide(prevIndex)
  }
  
  // Добавляем обработчики событий для стрелок
  if (leftArrow) leftArrow.addEventListener('click', prevSlide)
  if (rightArrow) rightArrow.addEventListener('click', nextSlide)
  
  // Автопрокрутка карусели
  const autoPlay = setInterval(nextSlide, 4000)
  
  // Останавливаем автопрокрутку при наведении
  carousel.addEventListener('mouseenter', () => clearInterval(autoPlay))
}

// Функция инициализации всех анимаций
function initCeramirAnimations() {
  // Проверяем, что мы на странице Ceramir
  if (window.location.pathname !== '/ceramir') return
  
  // Очищаем старые анимации ScrollTrigger
  ScrollTrigger.getAll().forEach(trigger => trigger.kill())
  
  // Сначала инициализируем Locomotive Scroll
  initLocomotiveScroll()
  
  // Ждем немного для полной загрузки
  setTimeout(() => {
    initFadeInUpAnimations()
    initFadeInAnimations()
    initFadeInLeftAnimations()
    initFadeInRightAnimations()
    initPulseAnimations()
    initCarousel()
    
    // Обновляем ScrollTrigger после инициализации
    ScrollTrigger.refresh()
  }, 100)
}

// Инициализация при полной загрузке страницы
document.addEventListener('DOMContentLoaded', initCeramirAnimations)

// Инициализация при переходах через Turbo
document.addEventListener('turbo:load', initCeramirAnimations)
document.addEventListener('turbo:render', initCeramirAnimations)

// Обновление при изменении размера окна
window.addEventListener('resize', () => {
  // В Locomotive Scroll v5 нет метода resize, используем только update если он есть
  if (locoScroll && locoScroll.lenis && locoScroll.lenis.resize) {
    locoScroll.lenis.resize()
  }
  ScrollTrigger.refresh()
})

// Экспортируем для возможного использования
export { locoScroll, ScrollTrigger, gsap }