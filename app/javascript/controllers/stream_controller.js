import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = [
    "stream",
    "dialog",
  ]

  connect() {
    this.observer = new MutationObserver(() => this.checkStreamConnected())
    this.observer.observe(this.streamTarget, { attributes: true })
    window.setTimeout(() => this.checkStreamConnected(), 5000)
  }

  checkStreamConnected() {
    const connected = this.streamTarget.hasAttribute("connected")
    this.dialogTarget.open = !connected
  }

  disconnect() {
    this.observer.disconnect()
  }
}

