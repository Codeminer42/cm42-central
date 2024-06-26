import { Controller } from "@hotwired/stimulus"
import useActions from "stimulus-use-actions"

export default class extends Controller {
  connect() {
    useActions(this, {
      element: "click->close",
    })
  }

  close() {
    document.getElementById("q").value = ''
    const urlWithoutQueryString = window.location.origin + window.location.pathname
    window.history.pushState({}, "", urlWithoutQueryString)
  }
}

