import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = [
    "checkbox",
  ]

  open(event) {
    if(event.target.closest(".state-actions")) return
    this.checkboxTarget.checked = true
  }

  close(event) {
    this.checkboxTarget.checked = false
  }
}
