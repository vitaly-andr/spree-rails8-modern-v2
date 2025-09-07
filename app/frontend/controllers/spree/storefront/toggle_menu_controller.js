import { Controller } from '@hotwired/stimulus'
import { lockScroll, unlockScroll } from '../../../helpers/spree/core/scroll_lock'

export default class ToggleMenu extends Controller {
  static targets = ['toggleable', 'content', 'button']
  static values = ['open']

  connect() {
    super.connect()
  }

  hide(e) {
    if (this.openValue) {
      super.hide(e)
      this.buttonTarget.classList.remove('menu-open')
    }
  }

  toggle(e) {
    this.contentTarget.style.paddingBottom = `${this.contentTarget.offsetTop}px`
    super.toggle(e)
    if (this.openValue) {
      this.buttonTarget.classList.add('menu-open')
      setTimeout(() => {
        lockScroll()
      }, 0)
    } else {
      this.buttonTarget.classList.remove('menu-open')
      unlockScroll()
    }
  }
}
