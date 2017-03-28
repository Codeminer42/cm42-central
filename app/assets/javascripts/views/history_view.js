module.exports = Backbone.View.extend({
  template: require('../templates/column.ejs'),
  activityTemplate: require('../templates/activity.ejs'),

  initialize: function() {
    _.bindAll(this, 'addActivities', 'connectionError');

    this.currentStory = {};

    this.$el.html(this.template({id: 'history', name: I18n.t('projects.show.history')}));
    this.$loadingSpin = $('.loading-spin');
  },

  addActivities: function(activities, a, b) {
    this.$el.html('');
    this.trigger('change:currentStory', this.currentStory);

    _.each(activities.models, function(item) {
      this.addActivity(item.attributes);
    }, this);

    this.$loadingSpin.hide();
    this.$el.show();
  },

  addActivity: function(activity) {
    this.$el.append(this.activityTemplate({
      action: activity.action,
      changes: activity.subject_changes,
      date: activity.date,
      user: this.options.users.get(activity.user_id).attributes.name
    }));
  },

  setStory: function(story) {
    this.$loadingSpin.show();
    this.currentStory = story.attributes;

    story.history.fetch({success: this.addActivities, error: this.connectionError});
  },

  connectionError: function(res) {
    this.$loadingSpin.hide();
  }
});
