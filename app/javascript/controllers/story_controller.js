import { Controller } from "@hotwired/stimulus"
import useActions from "stimulus-use-actions"

export default class extends Controller {
  static targets = [
    "checkbox",
    "permanent",
    "form",
    "note",
    "attachment",
    "submitButton",
  ]

  connect() {
    useActions(this, {
      formTarget: [
        "turbo:submit-end->clearNoteForm",
        "direct-upload:start->disableSubmitButtons",
        "direct-upload:end->enableSubmitButtons",
      ],
    })
  }

  clearNoteForm() {
    this.noteTarget.value = ''
    this.attachmentTarget.value = []
  }

  open(event) {
    if(event.target.closest(".state-actions")) return
    this.checkboxTarget.checked = true
    this.permanentTargets.forEach(e => e.setAttribute("data-turbo-permanent", "true"))
  }

  close(event) {
    this.checkboxTarget.checked = false
    this.permanentTargets.forEach(e => e.removeAttribute("data-turbo-permanent"))
  }

  disableSubmitButtons() {
    this.submitButtonTargets.forEach(e => e.disabled = true)
  }

  enableSubmitButtons() {
    this.submitButtonTargets.forEach(e => e.disabled = false)
  }
}
