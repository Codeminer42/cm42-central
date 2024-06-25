import { Controller } from "@hotwired/stimulus"
import useActions from "stimulus-use-actions"

export default class extends Controller {
  static targets = [
    "comment",
    "attachment",
    "submitButton",
  ]

  connect() {
    useActions(this, {
      element: [
        "turbo:submit-end->clearCommentForm",
        "direct-upload:start->disableSubmitButtons",
        "direct-upload:end->enableSubmitButtons",
      ],
      commentTarget: "keydown->controlEnterSubmits",
    })
  }

  controlEnterSubmits(event) {
    if(event.ctrlKey && event.key === 'Enter') {
      event.preventDefault()
      this.submitButtonTargets.at(-1).click() // Try to submit the form
    }
  }

  clearCommentForm() {
    this.commentTarget.value = ''
    this.attachmentTarget.value = []
  }

  disableSubmitButtons() {
    this.submitButtonTargets.forEach(e => e.disabled = true)
  }

  enableSubmitButtons() {
    this.submitButtonTargets.forEach(e => e.disabled = false)
  }
}
