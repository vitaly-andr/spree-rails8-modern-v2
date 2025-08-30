import { Slideover } from 'tailwindcss-stimulus-components'
import { lockScroll, unlockScroll } from '../core/helpers/scroll_lock'
export default class extends Slideover {
  static targets = ['overlay', 'menu']
  connect() {
    Turbo.StreamActions[`${this.identifier}:open`] = this.remoteOpen(this)
    super.connect()
  }

  disconnect() {
    super.disconnect()
    delete Turbo.StreamActions[`${this.identifier}:open`]
  }

  remoteOpen(controller) {
    return function () {
      if (this.target === controller.overlayTarget.id) {
        controller.openValue = true
      }
    }
  }

  toggle() {
    this.openValue = !this.openValue
  }

  show() {
    this.openValue = true
  }

  hide() {
    this.openValue = false
  }

  _show() {
    const headerController = this.application.getControllerForElementAndIdentifier(this.element, 'header')
    headerController?.freeze() // If there is a header controller, freeze it, so it doesn't move when the slideover opens

    super._show()

    // Don't scroll the background when slideover is open
    lockScroll()

    window.dispatchEvent(new Event('slideover:open'))
  }

  _hide() {
    const headerController = this.application.getControllerForElementAndIdentifier(this.element, 'header')
    headerController?.unfreeze()

    super._hide()
    // Restore the background scroll
    unlockScroll()
  }
}