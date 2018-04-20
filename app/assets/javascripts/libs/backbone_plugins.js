/* eslint func-names:"off" */
/* eslint prefer-rest-params:"off" */
require('vendor/backbone.rails');

Backbone.View = (function (View) {
  return View.extend({
    constructor(options) {
      this.options = options || {};
      View.apply(this, arguments);
    },
    make(tagName, attributes, content) {
      const el = document.createElement(tagName);
      if (attributes) $(el).attr(attributes);
      if (content) $(el).html(content);
      return el;
    },
  });
}(Backbone.View));
