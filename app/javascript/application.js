import Rails from "@rails/ujs"
Rails.start()

import "@hotwired/turbo-rails"
Turbo.session.drive = false

import { Application } from "@hotwired/stimulus"
import { eagerLoadControllersFrom } from "@hotwired/stimulus-loading"
import "bard-file"
import "@github/relative-time-element"

window.Stimulus   = Application.start()
eagerLoadControllersFrom("controllers/?\\w*", window.Stimulus)

import TextareaAutogrow from "stimulus-textarea-autogrow"
window.Stimulus.register("textarea-autogrow", TextareaAutogrow)

