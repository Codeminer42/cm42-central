import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  focusNewStoryTitleField() {
    const titleFieldTarget = this.element.querySelector(".new-story input[name$='[title]']")
    window.setTimeout(() => titleFieldTarget.focus(), 10)
  }
}
