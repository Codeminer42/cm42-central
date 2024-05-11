import { Controller } from "@hotwired/stimulus"
import Sortable from 'sortablejs';
import { put } from "rails-request-json"

export default class extends Controller {
  static values = {
    positioningColumn: String,
  }

  connect() {
    this.sortable = Sortable.create(this.element, {
      group: "name",
      draggable: ".story",
      filter: ".accepted, .story:has(.toggle-story:checked)",
      preventOnFilter: false,
      dataIdAttr: "data-id",
      onSort: e => this.onSort(e),
      onMove: e => this.onMove(e),
    })
  }

  onMove(event) {
    if(event.related.classList.contains("accepted")) {
      return false
    }
  }

  onSort(event) {
    const story = event.item
    if(event.to !== this.element) return

    const url = `${window.location.pathname}/stories/${story.dataset.id}`

    let position = {}
    const previous = this.findPreviousStory(story)
    const next = this.findNextStory(story)
    if(previous) {
      position = { after: previous.dataset.id }
    } else if(next) {
      position = { before: next.dataset.id }
    } else {
      position = ""
    }

    let state = story.dataset.state
    if(event.to !== event.from) {
      const isChillyBin = this.positioningColumnValue === "#chilly_bin"
      state = isChillyBin ? "unscheduled" : "unstarted"
    }

    put(url, { story: {
      state: state,
      positioning_column: this.positioningColumnValue,
      position: position,
    })
  }

  findPreviousStory(story) {
    return this.findAdjacentStory(story, "previousElementSibling")
  }

  findNextStory(story) {
    return this.findAdjacentStory(story, "nextElementSibling")
  }

  findAdjacentStory(story, getter) {
    let el = story, cl
    while(el = el[getter]) {
      cl = el.classList
      if(cl.contains("story")
        && cl.contains("closed")
        && !cl.contains("accepted")
      ) {
        return el
      }
    }
  }
}

      // sort: true,  // sorting inside list
      // delay: 0, // time in milliseconds to define when the sorting should start
      // delayOnTouchOnly: false, // only delay if user is using touch
      // touchStartThreshold: 0, // px, how many pixels the point should move before cancelling a delayed drag event
      // disabled: false, // Disables the sortable if set to true.
      // store: null,  // @see Store
      // animation: 150,  // ms, animation speed moving items when sorting, `0` — without animation
      // easing: "cubic-bezier(1, 0, 0, 1)", // Easing for animation. Defaults to null. See https://easings.net/ for examples.
      // handle: ".my-handle",  // Drag handle selector within list items
      // preventOnFilter: true, // Call `event.preventDefault()` when triggered `filter`

      // ghostClass: "sortable-ghost",  // Class name for the drop placeholder
      // chosenClass: "sortable-chosen",  // Class name for the chosen item
      // dragClass: "sortable-drag",  // Class name for the dragging item

      // swapThreshold: 1, // Threshold of the swap zone
      // invertSwap: false, // Will always use inverted swap zone if set to true
      // invertedSwapThreshold: 1, // Threshold of the inverted swap zone (will be set to swapThreshold value by default)
      // direction: 'horizontal', // Direction of Sortable (will be detected automatically if not given)

      // forceFallback: false,  // ignore the HTML5 DnD behaviour and force the fallback to kick in

      // fallbackClass: "sortable-fallback",  // Class name for the cloned DOM Element when using forceFallback
      // fallbackOnBody: false,  // Appends the cloned DOM Element into the Document's Body
      // fallbackTolerance: 0, // Specify in pixels how far the mouse should move before it's considered as a drag.

      // dragoverBubble: false,
      // removeCloneOnHide: true, // Remove the clone element when it is not showing, rather than just hiding it
      // emptyInsertThreshold: 5, // px, distance mouse must be from empty sortable to insert drag element into it


      // setData: function (/** DataTransfer */dataTransfer, /** HTMLElement*/dragEl) {
      //   dataTransfer.setData('Text', dragEl.textContent); // `dataTransfer` object of HTML5 DragEvent
      // },

      // // Element is chosen
      // onChoose: function (/**Event*/evt) {
      //   evt.oldIndex;  // element index within parent
      // },

      // // Element is unchosen
      // onUnchoose: function(/**Event*/evt) {
      //   // same properties as onEnd
      // },

      // // Element dragging started
      // onStart: function (/**Event*/evt) {
      //   evt.oldIndex;  // element index within parent
      // },

      // // Element dragging ended
      // onEnd: function (/**Event*/evt) {
      //   var itemEl = evt.item;  // dragged HTMLElement
      //   evt.to;    // target list
      //   evt.from;  // previous list
      //   evt.oldIndex;  // element's old index within old parent
      //   evt.newIndex;  // element's new index within new parent
      //   evt.oldDraggableIndex; // element's old index within old parent, only counting draggable elements
      //   evt.newDraggableIndex; // element's new index within new parent, only counting draggable elements
      //   evt.clone // the clone element
      //   evt.pullMode;  // when item is in another sortable: `"clone"` if cloning, `true` if moving
      // },

      // // Element is dropped into the list from another list
      // onAdd: function (/**Event*/evt) {
      //   // same properties as onEnd
      // },

      // // Changed sorting within list
      // onUpdate: function (/**Event*/evt) {
      //   // same properties as onEnd
      // },

      // // Element is removed from the list into another list
      // onRemove: function (/**Event*/evt) {
      //   // same properties as onEnd
      // },

      // // Attempt to drag a filtered element
      // onFilter: function (/**Event*/evt) {
      //   var itemEl = evt.item;  // HTMLElement receiving the `mousedown|tapstart` event.
      // },

      // // Event when you move an item in the list or between lists
      // onMove: function (/**Event*/evt, /**Event*/originalEvent) {
      //   // Example: https://jsbin.com/nawahef/edit?js,output
      //   evt.dragged; // dragged HTMLElement
      //   evt.draggedRect; // DOMRect {left, top, right, bottom}
      //   evt.related; // HTMLElement on which have guided
      //   evt.relatedRect; // DOMRect
      //   evt.willInsertAfter; // Boolean that is true if Sortable will insert drag element after target by default
      //   originalEvent.clientY; // mouse position
      //   // return false; — for cancel
      //   // return -1; — insert before target
      //   // return 1; — insert after target
      //   // return true; — keep default insertion point based on the direction
      //   // return void; — keep default insertion point based on the direction
      // },

      // // Called when creating a clone of element
      // onClone: function (/**Event*/evt) {
      //   var origEl = evt.item;
      //   var cloneEl = evt.clone;
      // },

      // // Called when dragging element changes position
      // onChange: function(/**Event*/evt) {
      //   evt.newIndex // most likely why this event is used is to get the dragging element's current index
      //   // same properties as onEnd
      // },

