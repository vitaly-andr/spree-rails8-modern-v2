import '@hotwired/turbo-rails'
import { Application } from '@hotwired/stimulus'

// Импортируем основной CSS с Tailwind и Spree стилями
import '../application.css'

// Импортируем CSS gem'а
import '../stylesheets/storefront_page_builder.css'
let application

if (typeof window.Stimulus === "undefined") {
  application = Application.start()
  application.debug = false
  window.Stimulus = application
} else {
  application = window.Stimulus
}

import { Alert, Toggle } from 'tailwindcss-stimulus-components'
application.register('alert', Alert)
application.register('toggle', Toggle)


// We need to preload the carousel controller, otherwise it causes a huge layout shift when it's loaded.
import CarouselController from '../controllers/spree/storefront/carousel_controller'
application.register('carousel', CarouselController)

// Автоматически импортируем ВСЕ контроллеры из storefront
const storefrontControllers = import.meta.glob('../controllers/spree/storefront/*_controller.js', { eager: true })

// Автоматически импортируем ВСЕ контроллеры из core  
const coreControllers = import.meta.glob('../controllers/spree/core/*_controller.js', { eager: true })

// Регистрируем все контроллеры автоматически
Object.entries(storefrontControllers).forEach(([path, module]) => {
  const name = path.split('/').pop().replace('_controller.js', '').replace(/_/g, '-')
  application.register(name, module.default)
})

Object.entries(coreControllers).forEach(([path, module]) => {
  const name = path.split('/').pop().replace('_controller.js', '').replace(/_/g, '-')
  application.register(name, module.default)
})

// СПЕЦИАЛЬНЫЕ ALIAS'Ы - НУЖНЫ для Spree!
// Spree использует slideover-account в HTML, но у нас контроллер называется slideover
application.register('slideover-account', storefrontControllers['../controllers/spree/storefront/slideover_controller.js'].default)


const scrollToOverlay = (overlay) => {
  const { top, left } = overlay.getBoundingClientRect()

  window.scroll({
    behavior: 'smooth',
    top: window.scrollY + top - window.innerHeight / 2 + overlay.offsetHeight / 2,
    left: left + window.scrollX
  })
}

// page builder UI
const toggleHighlightEditorOverlay = (query) => {
  const overlay = document.querySelector(query)

  if (overlay) {
    if (overlay.classList.contains('editor-overlay-hover')) {
      overlay.classList.remove('editor-overlay-hover')
    } else {
      overlay.classList.add('editor-overlay-hover')

      scrollToOverlay(overlay)
    }
  }
}


const makeOverlayActive = (id) => {
  const overlay = document.querySelector(`.editor-overlay[data-editor-id="${id}"]`)

  document.querySelectorAll('.editor-overlay-active').forEach((el) => {
    el.classList.remove('editor-overlay-active')
  })

  if (overlay) {
    overlay.classList.add('editor-overlay-active')
    scrollToOverlay(overlay)
  }
}

const toggleHighlightElement = (id) => {
  toggleHighlightEditorOverlay(`.editor-overlay[data-editor-id="${id}"]`)
}

window.scrollToOverlay = scrollToOverlay
window.toggleHighlightElement = toggleHighlightElement
window.makeOverlayActive = makeOverlayActive

document.addEventListener('turbo:submit-start', () => {
  Turbo.navigator.delegate.adapter.progressBar.setValue(0)
  Turbo.navigator.delegate.adapter.progressBar.show()
})

document.addEventListener('turbo:submit-end', () => {
  Turbo.navigator.delegate.adapter.progressBar.setValue(100)
  Turbo.navigator.delegate.adapter.progressBar.hide()
})

function replaceCsrfMetaTags() {
  const csrfMetaTagsTemplate = document.querySelector('template#csrf_meta_tags')
  if (!csrfMetaTagsTemplate) return

  const csrfMetaTags = csrfMetaTagsTemplate.content.cloneNode(true)

  document.head.querySelectorAll('meta[name="csrf-token"]').forEach((tag) => tag.remove())
  document.head.querySelectorAll('meta[name="csrf-param"]').forEach((tag) => tag.remove())

  document.head.appendChild(csrfMetaTags)
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', replaceCsrfMetaTags)
} else {
  replaceCsrfMetaTags()
}
