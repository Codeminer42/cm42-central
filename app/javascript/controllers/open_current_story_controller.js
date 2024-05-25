import { Controller } from "@hotwired/stimulus"
import useActions from "stimulus-use-actions"

export default class extends Controller {
  connect() {
    useActions(this, {
      window: "hashchange->openCurrentStory",
    })
    this.openCurrentStory()
  }

  openCurrentStory(event) {
    const location = event
      ? new URL(event.newURL)
      : window.location
    const selector = `${location.hash}-toggle`
    const toggle = document.querySelector(selector)
    if(toggle) {
      toggle.checked = true
      toggle.scrollIntoView(true)
    }
  }
}

