import SharedModelMethods from '../mixins/shared_model_methods';

const Task = Backbone.Model.extend({
  defaults: {
    done: false,
  },

  name: 'task',

  i18nScope: 'activerecord.attributes.task',

  isReadonly: false,

  sync: function (method, model, options) {
    if (model.isReadonly) {
      return true;
    }
    return Backbone.sync(method, model, options);
  },
});

_.defaults(Task.prototype, SharedModelMethods);

export default Task;
