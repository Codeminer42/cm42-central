import { Controller } from "@hotwired/stimulus"
import useActions from "stimulus-use-actions"

export default class extends Controller {
  connect() {
    useActions(this, {
      element: "click->toggle",
    })
  }

  toggle() {
    const dialog = document.getElementById(this.element.getAttribute("for"))
    if(dialog.open) {
      dialog.close()
    } else {
      if(dialog.hasAttribute("modal")) {
        dialog.showModal()
      } else {
        dialog.show()
      }
    }
  }
}

