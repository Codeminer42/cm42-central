const Activity = require('models/activity');

module.exports = Backbone.Collection.extend({
  model: Activity,

  comparator(activity) {
    return -new Date(activity.attributes.updated_at).getTime();
  },

  url() {
    return `${this.story.url()}/activities`;
  },
});
