import { Controller } from "@hotwired/stimulus"
import useActions from "stimulus-use-actions"

export default class extends Controller {
  connect() {
    this.element.style.display = "block" // force visibility detection for <template>
    respondToVisibility(this.element, visible => {
      if(visible) this.render()
    })
  }

  render() {
    this.element.outerHTML = this.element.innerHTML
  }
}

function respondToVisibility(element, callback) {
  new IntersectionObserver(entries => {
    entries.forEach(entry => callback(entry.intersectionRatio > 0))
  }).observe(element)
}

