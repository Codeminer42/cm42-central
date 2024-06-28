import Activity from '../models/activity';

const ActivityCollection = Backbone.Collection.extend({
  model: Activity,

  comparator: function (activity) {
    return -new Date(activity.attributes.updated_at).getTime();
  },

  url: function () {
    return this.story.url() + '/activities';
  },
});

export default ActivityCollection;
