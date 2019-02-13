import columnTemplate from '../templates/column.ejs';
import activityTemplate from '../templates/activity.ejs';

const HistoryView = Backbone.View.extend({
  template: columnTemplate,
  activityTemplate: activityTemplate,

  initialize: function() {
    _.bindAll(this, 'addActivities', 'connectionError');

    this.$el.html(this.template({
      id: 'history',
      className: 'activity_column',
      name: I18n.t('projects.show.history')
    }));
    this.$el.addClass('history_column');
    this.$column = this.$('#history');
    this.$loadingSpin = this.$('.loading-spin');
  },

  events: {
    'change:currentStory': 'handleStoryChange',
    'click a.toggle-column': 'toggle'
  },

  toggle: function() {
    this.$el.toggle();
    this.stopListening(this.currentStory, 'sync');
  },

  handleStoryChange: function(event) {
    event.stopPropagation();
    this.setHistoryTitle(event)
    this.fetchActivities(event)
  },

  addActivities: function(activities) {
    this.$column.html('');
    activities.models.map((item) => this.addActivity(item.attributes));

    this.$loadingSpin.hide();
    this.$el.show();
  },

  addActivity: function(activity) {
    this.$column.append(this.activityTemplate({
      action: activity.action,
      changes: activity.subject_changes,
      date: activity.date,
      user: this.options.users.get(activity.user_id).get('name')
    }));
  },

  setStory: function(newStory) {
    if (this.isCurrentStory(newStory)) {
      if (this.currentStory) {
        this.stopListening(this.currentStory, 'sync');
      }

      this.currentStory = newStory;
      this.$loadingSpin.show();
      this.listenTo(this.currentStory, 'sync', this.fetchActivities);
    }
    this.$el.trigger('change:currentStory');
  },

  isCurrentStory: function(story) {
    return (!this.currentStory || story.get('id') !== this.currentStory.get('id'))
  },

  fetchActivities: function() {
    this.currentStory.history.fetch({
      success: this.addActivities,
      error: this.connectionError
    });
  },

  connectionError: function(res) {
    this.$loadingSpin.hide();
  },

  setHistoryTitle: function() {
    const $header = this.$el.find('.toggle-title');
    let title     = this.currentStory.get('title');

    title = this.ellipses(title);
    $header.text(`${I18n.t('projects.show.history')} '${title}'`);
  },

  ellipses: function(str, maxlen = 32, suspension = '...') {
    return str.length > maxlen
      ? str.substring(0, maxlen) + suspension
      : str;
  }
});

export default HistoryView;
