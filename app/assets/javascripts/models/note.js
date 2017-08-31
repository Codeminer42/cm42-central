var SharedModelMethods = require('mixins/shared_model_methods');

var Note = module.exports = Backbone.Model.extend({
  defaults: {
    name: 'note',
    isReadOnly: false,
  },

  name: 'note',

  i18nScope: 'activerecord.attributes.note',

  isReadonly: false,

  sync: function(method, model, options) {
    if( model.isReadonly ) {
      return true;
    }
    return Backbone.sync(method, model, options);
  }

});

_.defaults(Note.prototype, SharedModelMethods);
