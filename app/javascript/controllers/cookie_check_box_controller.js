import { Controller } from "@hotwired/stimulus"
import useActions from "stimulus-use-actions"
import Cookies from "js-cookie"

export default class extends Controller {
  connect() {
    useActions(this, {
      element: "change->change",
    })
  }

  change(event) {
    const key = this.element.id
    const value = this.getValue()
    Cookies.set(key, value, { expires: 3650 }) // ten year expiration
  }

  getValue() {
    if(this.element.hasAttribute("value")) {
      if(this.element.checked) {
        return this.element.value
      } else {
        return ""
      }
    } else {
      return this.element.checked.toString()
    }
  }
}
