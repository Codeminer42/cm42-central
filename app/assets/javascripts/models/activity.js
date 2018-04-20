/* eslint no-multi-assign:"off" */
/* eslint no-undef:"off" */
/* eslint func-names:"off" */
/* eslint no-param-reassign:"off" */
const SharedModelMethods = require('mixins/shared_model_methods');

const Activity = module.exports = Backbone.Model.extend({
  defaults: {
    name: 'activity',
    date: '',
    action: '',
    subject_changes: '',
  },

  name: 'activity',

  i18nScope: 'activerecord.attributes.',

  timestampFormat: 'd mmm yyyy',

  initialize(args) {
    const data = args.activity;

    this.i18nScope += data.subject_type.toLowerCase();
    this.set({
      date: new Date(data.updated_at).format(this.timestampFormat),
      action: this.humanActionName(data.action),
      subject_changes: this.parseChanges(data.subject_changes),
    });
  },

  humanActionName(action) {
    return I18n.t(action, { scope: 'activity.actions' });
  },

  parseChanges(changes) {
    return _.map(changes, function (value, key) {
      if (key === 'documents_attributes') key = 'documents';
      return {
        attribute: this.humanAttributeName(key),
        oldValue: value[0],
        newValue: value[1],
      };
    }, this);
  },
});

_.defaults(Activity.prototype, SharedModelMethods);
