import { Controller } from "@hotwired/stimulus"
import useActions from "stimulus-use-actions"
import Tribute from "tributejs"

export default class extends Controller {
  static values = {
    users: Array,
  }

  static targets = [
    "field",
  ]

  initialize() {
    this.tribute = new Tribute({
      values: [],
      menuItemTemplate: item => {
        return `<b>${item.original.key}</b> ${item.original.value}`
      },
    })
  }

  connect() {
    const values = this.usersValue.map(([name, username]) => {
      return { key: name, value: username }
    })
    this.tribute.collection[0].values = values
  }

  fieldTargetConnected(target) {
    this.tribute.attach(target)
  }
}
