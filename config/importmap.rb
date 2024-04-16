pin "application"
pin "@rails/ujs", to: "https://ga.jspm.io/npm:@rails/ujs@7.1.3-2/app/assets/javascripts/rails-ujs.esm.js"
pin "@hotwired/turbo-rails", to: "turbo.min.js"
pin "@hotwired/stimulus", to: "stimulus.min.js"
pin "@hotwired/stimulus-loading", to: "stimulus-loading.js"
pin "stimulus-use-actions", to: "https://ga.jspm.io/npm:stimulus-use-actions@0.1.0/index.js"
pin_all_from "app/javascript/controllers", under: "controllers"

pin "sortablejs", to: "https://ga.jspm.io/npm:sortablejs@1.15.2/modular/sortable.esm.js"
pin "rails-request-json", to: "https://ga.jspm.io/npm:rails-request-json@0.1.3/index.js"
pin "@rails/request.js", to: "https://ga.jspm.io/npm:@rails/request.js@0.0.6/src/index.js"
