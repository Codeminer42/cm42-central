import { Controller } from "@hotwired/stimulus"
import useActions from "stimulus-use-actions"
import Tribute from "tributejs"

export default class extends Controller {
  static values = {
    projectUrl: String,
    users: Array,
    stories: Array,
  }

  static targets = [
    "field",
  ]

  initialize() {
    this.tribute = new Tribute({
      collection: [{
          trigger: '@',
          values: [],
          menuItemTemplate: item => {
            return `<b>${item.original.key}</b> ${item.original.value}`
          },
        },
        {
          trigger: '#',
          values: [],
          menuItemTemplate: item => {
            return `<b>${item.original.key}</b> ${item.original.value}`
          },
          selectTemplate: item => {
            return `${this.projectUrlValue}#story-${item.original.key}`
          },
        },
      ],
    })

    // monkeypatch turbo permanence onto menu
    this.tribute.original_createMenu = this.tribute.createMenu
    this.tribute.createMenu = function(containerClass) {
      const menu = this.original_createMenu(containerClass)
      menu.setAttribute("data-turbo-permanent", "true")
      return menu
    }
  }

  connect() {
    this.tribute.collection[0].values = this.usersValue
    this.tribute.collection[1].values = this.storiesValue
  }

  fieldTargetConnected(target) {
    this.tribute.attach(target)
  }
}
