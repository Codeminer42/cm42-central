import "@hotwired/turbo-rails"

import { Application } from "@hotwired/stimulus"
import { eagerLoadControllersFrom } from "@hotwired/stimulus-loading"

window.Stimulus   = Application.start()
eagerLoadControllersFrom("controllers/?\\w*", window.Stimulus)

