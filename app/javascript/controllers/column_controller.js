import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  focusNewStoryTitleField() {
    window.setTimeout(() => {
      const titleFieldTarget = this.element.querySelector(".new-story input[name$='[title]']")
      titleFieldTarget.focus()
    }, 100)
  }
}
