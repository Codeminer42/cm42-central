/* eslint global-require:"off" */
/* eslint no-undef:"off" */
/* eslint no-unused-vars:"off" */
module.exports = Backbone.View.extend({
  template: require('../templates/column.ejs'),
  activityTemplate: require('../templates/activity.ejs'),

  initialize() {
    _.bindAll(this, 'addActivities', 'connectionError');

    this.$el.html(this.template({
      id: 'history',
      className: 'activity_column',
      name: I18n.t('projects.show.history'),
    }));
    this.$el.addClass('history_column');
    this.$column = this.$('#history');
    this.$loadingSpin = this.$('.loading-spin');
  },

  events: {
    'change:currentStory': 'handleStoryChange',
    'click a.toggle-column': 'toggle',
  },

  toggle() {
    this.$el.toggle();
    this.stopListening(this.currentStory, 'sync');
  },

  handleStoryChange(event) {
    event.stopPropagation();
    this.setHistoryTitle(event);
    this.fetchActivities(event);
  },

  addActivities(activities) {
    this.$column.html('');
    activities.models.map((item) => this.addActivity(item.attributes));

    this.$loadingSpin.hide();
    this.$el.show();
  },

  addActivity(activity) {
    this.$column.append(this.activityTemplate({
      action: activity.action,
      changes: activity.subject_changes,
      date: activity.date,
      user: this.options.users.get(activity.user_id).get('name'),
    }));
  },

  setStory(newStory) {
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

  isCurrentStory(story) {
    return (!this.currentStory || story.get('id') !== this.currentStory.get('id'));
  },

  fetchActivities() {
    this.currentStory.history.fetch({
      success: this.addActivities,
      error: this.connectionError,
    });
  },

  connectionError(res) {
    this.$loadingSpin.hide();
  },

  setHistoryTitle() {
    const $header = this.$el.find('.toggle-title');
    let title = this.currentStory.get('title');

    title = this.ellipses(title);
    $header.text(`${I18n.t('projects.show.history')} '${title}'`);
  },

  ellipses(str, maxlen = 32, suspension = '...') {
    return str.length > maxlen
      ? str.substring(0, maxlen) + suspension
      : str;
  },
});
