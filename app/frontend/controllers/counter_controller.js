import { Controller } from "@hotwired/stimulus"

// rails-way: Простой счётчик для тестовой кнопки
export default class extends Controller {
  static targets = ['value']

  increment() {
    let value = parseInt(this.valueTarget.textContent, 10) || 0
    this.valueTarget.textContent = value + 1
  }
}
