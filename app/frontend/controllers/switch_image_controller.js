import { Controller } from "@hotwired/stimulus"

// rails-way: Turbo Frame image switcher (имитация замены картинки)
export default class extends Controller {
  static targets = ["image"]
  static values = {
    pic1: String,
    pic2: String
  }

  swap(event) {
    event.preventDefault()
    const img = this.imageTarget
    const current = img.getAttribute("src")
    
    if (current === this.pic1Value) {
      img.setAttribute("src", this.pic2Value)
    } else {
      img.setAttribute("src", this.pic1Value)
    }
  }
}