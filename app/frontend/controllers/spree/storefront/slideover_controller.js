import { Controller } from '@hotwired/stimulus'
import { lockScroll, unlockScroll } from '../../../helpers/spree/core/scroll_lock'

export default class extends Controller {
  static targets = ['overlay', 'menu']
  static values = { open: Boolean }
  static classes = ['invisible', 'visible']

  connect() {
    console.log('🔌 Slideover controller connected to:', this.element)
    console.log('🔌 Controller identifier:', this.identifier)
    
    // Регистрируем Turbo Stream действия
    Turbo.StreamActions[`${this.identifier}:open`] = this.remoteOpen(this)
    
    // Устанавливаем начальное состояние
    this.element.setAttribute('aria-hidden', !this.openValue)
    
    // Если overlay изначально скрыт, убеждаемся что он hidden
    if (!this.openValue && this.hasOverlayTarget) {
      this.overlayTarget.classList.add('hidden')
    }
  }

  disconnect() {
    console.log('🔌 Slideover controller disconnected')
    delete Turbo.StreamActions[`${this.identifier}:open`]
    unlockScroll() // Убеждаемся что скролл разблокирован при удалении контроллера
  }

  // Основные методы
  toggle() {
    console.log('🔄 Toggle called, current openValue:', this.openValue)
    this.openValue = !this.openValue
  }

  open() {
    console.log('🚪 Open called')
    this.openValue = true
  }

  close() {
    console.log('🚪 Close called')
    this.openValue = false
  }

  hide(event) {
    console.log('👻 Hide called, event:', event)
    
    // КРИТИЧЕСКИ ВАЖНО: Проверяем, что клик был ВНЕ slideover'а
    if (event && this.openValue) {
      // Если клик был внутри overlay или menu - НЕ закрываем
      if (this.hasOverlayTarget && this.overlayTarget.contains(event.target)) {
        console.log('🚫 Click inside overlay - not hiding')
        return
      }
      
      if (this.hasMenuTarget && this.menuTarget.contains(event.target)) {
        console.log('🚫 Click inside menu - not hiding')
        return
      }
      
      // Если клик был на кнопке toggle - НЕ закрываем (toggle сам управляет)
      const toggleButtons = this.element.querySelectorAll(`[data-action*="${this.identifier}#toggle"]`)
      for (const button of toggleButtons) {
        if (button.contains(event.target)) {
          console.log('🚫 Click on toggle button - not hiding')
          return
        }
      }
    }
    
    console.log('✅ Valid hide - closing slideover')
    this.close()
  }

  // Обработчик изменения состояния
  openValueChanged() {
    console.log('📊 openValue changed to:', this.openValue)
    if (this.openValue) {
      this._show()
    } else {
      this._hide()
    }
  }

  // Turbo Stream поддержка
  remoteOpen(controller) {
    return function () {
      console.log('📡 Remote open called for target:', this.target)
      if (this.target === controller.overlayTarget?.id) {
        controller.openValue = true
      }
    }
  }

  // Приватные методы
  _show() {
    console.log('👁️ _show called')
    
    if (!this.hasOverlayTarget || !this.hasMenuTarget) {
      console.warn('⚠️ Missing required targets for slideover')
      return
    }

    const headerController = this.application.getControllerForElementAndIdentifier(this.element, 'header')
    headerController?.freeze()

    // Показываем overlay
    this.overlayTarget.classList.remove('hidden')
    
    // Применяем visible классы
    this._applyClasses(this.visibleClasses, this.invisibleClasses)
    
    // Блокируем скролл и отправляем событие
    lockScroll()
    this.element.setAttribute('aria-hidden', 'false')
    window.dispatchEvent(new Event('slideover:open'))
    
    console.log('✅ Slideover shown')
  }

  _hide() {
    console.log('🙈 _hide called')
    
    if (!this.hasOverlayTarget || !this.hasMenuTarget) {
      return
    }

    const headerController = this.application.getControllerForElementAndIdentifier(this.element, 'header')
    headerController?.unfreeze()

    // Применяем invisible классы
    this._applyClasses(this.invisibleClasses, this.visibleClasses)
    
    // Скрываем overlay после анимации
    setTimeout(() => {
      if (!this.openValue && this.hasOverlayTarget) {
        this.overlayTarget.classList.add('hidden')
      }
    }, 300) // Время должно соответствовать CSS transition
    
    // Разблокируем скролл
    unlockScroll()
    this.element.setAttribute('aria-hidden', 'true')
    
    console.log('✅ Slideover hidden')
  }

  _applyClasses(addClasses, removeClasses) {
    if (!this.hasOverlayTarget || !this.hasMenuTarget) {
      return
    }

    // КРИТИЧЕСКИ ВАЖНО: Разделяем классы по запятой!
    const addClassList = addClasses.flatMap(cls => cls.split(','))
    const removeClassList = removeClasses.flatMap(cls => cls.split(','))

    console.log('🎨 Parsed classes - add:', addClassList, 'remove:', removeClassList)

    // Применяем классы к overlay
    this.overlayTarget.classList.remove(...removeClassList)
    this.overlayTarget.classList.add(...addClassList)
    
    // Применяем классы к menu
    this.menuTarget.classList.remove(...removeClassList)
    this.menuTarget.classList.add(...addClassList)
    
    console.log('🎨 Applied classes to overlay and menu')
  }
}
