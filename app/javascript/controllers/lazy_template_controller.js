import { Controller } from "@hotwired/stimulus"
import respondToVisibility from "lib/respond_to_visibility"

export default class extends Controller {
  connect() {
    respondToVisibility(this.element, visible => {
      if(visible) this.render()
    })
  }

  render() {
    this.element.outerHTML = this.element.innerHTML
  }
}

