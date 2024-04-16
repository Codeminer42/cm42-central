import { Controller } from "@hotwired/stimulus"
import useActions from "stimulus-use-actions"

export default class extends Controller {
  static values = {
    value: String,
  }

  static targets = [
    "field",
    "submit",
  ]

  connect() {
    useActions(this, {
      fieldTarget: "validate",
    })
  }

  validate() {
    const valid = this.fieldTarget.value === this.valueValue
    this.submitTarget.disabled = !valid
  }
}

