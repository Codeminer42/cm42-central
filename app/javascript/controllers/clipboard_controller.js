import shorthand from "stimulus-shorthand"
import { Controller } from "@hotwired/stimulus"
import useActions from "stimulus-use-actions"

shorthand({ controller: "clipboard", value: "text" })
export default class extends Controller {
  static values = {
    text: String,
  }

  connect() {
    useActions(this, {
      element: "copy",
    })
  }

  async copy() {
    await navigator.clipboard.writeText(this.textValue)
  }
}

