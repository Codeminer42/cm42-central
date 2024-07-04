import { Controller } from "@hotwired/stimulus"
import useActions from "stimulus-use-actions"

export default class extends Controller {
  connect() {
    useActions(this, {
      element: "change",
    })
  }

  change() {
    if(this.element.checked) {
      this.element.scrollIntoView(true)
    }
  }
}


