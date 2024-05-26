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
    const value = this.element.checked.toString()
    Cookies.set(key, value, { expires: 3650 }) // ten year expiration
  }
}
