/* eslint no-multi-assign: "off" */
const SharedModelMethods = require('mixins/shared_model_methods');

const Note = module.exports = Backbone.Model.extend({
  defaults: {
    name: 'note',
    isReadOnly: false,
  },

  name: 'note',

  i18nScope: 'activerecord.attributes.note',

  isReadonly: false,

  sync(method, model, options) {
    if (model.isReadonly) {
      return true;
    }
    return Backbone.sync(method, model, options);
  },

});

_.defaults(Note.prototype, SharedModelMethods);
