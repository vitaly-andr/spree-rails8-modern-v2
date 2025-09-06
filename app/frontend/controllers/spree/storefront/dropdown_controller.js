import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["trigger", "menu", "icon", "line"]
  static values = { open: Boolean }

  connect() {
    console.log("Dropdown controller connected")
    this.openValue = false
  }

  toggle(event) {
    event.preventDefault()
    this.openValue = !this.openValue
  }

  hide(event) {
    if (!this.element.contains(event.target) && this.openValue) {
      this.openValue = false
    }
  }

  openValueChanged() {
    if (this.openValue) {
      this.showMenu()
    } else {
      this.hideMenu()
    }
  }

  showMenu() {
    this.menuTarget.classList.remove('invisible', 'opacity-0', 'scale-95', 'hidden')
    this.menuTarget.classList.add('visible', 'opacity-100', 'scale-100')
    
    if (this.hasIconTarget) {
      this.iconTarget.style.transform = 'rotate(180deg)'
    }
    
    if (this.hasLineTarget) {
      this.lineTarget.style.width = '100%'
    }
  }

  hideMenu() {
    this.menuTarget.classList.add('invisible', 'opacity-0', 'scale-95')
    this.menuTarget.classList.remove('visible', 'opacity-100', 'scale-100')
    
    if (this.hasIconTarget) {
      this.iconTarget.style.transform = 'rotate(0deg)'
    }
    
    if (this.hasLineTarget) {
      this.lineTarget.style.width = '0%'
    }
  }
}
