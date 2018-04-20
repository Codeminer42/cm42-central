const Task = require('models/task');

module.exports = Backbone.Collection.extend({
  model: Task,

  url() {
    return `${this.story.url()}/tasks`;
  },

  saved() {
    return this.reject(task => task.isNew());
  },
});
