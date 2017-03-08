var Activity = require('models/activity');

module.exports = Backbone.Collection.extend({
  model: Activity,

  comparator: function(activity) {
    return -new Date(activity.attributes.updated_at).getTime();
  },

  url: function() {
    return this.story.url() + '/activities';
  }
});
