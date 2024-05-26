import { Controller } from "@hotwired/stimulus"
import useActions from "stimulus-use-actions"

export default class extends Controller {
  static targets = [
    "checkbox",
    "permanent",
    "form",
    "comment",
    "attachment",
    "submitButton",
  ]

  connect() {
    useActions(this, {
      formTarget: [
        "turbo:submit-end->clearCommentForm",
        "direct-upload:start->disableSubmitButtons",
        "direct-upload:end->enableSubmitButtons",
      ],
      commentTarget: "keydown->controlEnterSubmits",
    })
  }

  clearCommentForm() {
    this.commentTarget.value = ''
    this.attachmentTarget.value = []
  }

  controlEnterSubmits(event) {
    if(event.ctrlKey && event.key === 'Enter') {
      event.preventDefault()
      this.submitButtonTargets.at(-1).click() // Try to submit the form
    }
  }

  open(event) {
    if(event.target.closest(".state-actions")) return
    this.checkboxTarget.checked = true
    this.permanentTargets.forEach(e => e.setAttribute("data-turbo-permanent", "true"))

    // hacky way to trigger internal textarea's autogrow behavior
    window.dispatchEvent(new Event('resize'))
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
