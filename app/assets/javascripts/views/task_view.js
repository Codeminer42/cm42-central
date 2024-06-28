import FormView from './form_view';
import taskTemplate from 'templates/task.ejs';

const TaskView = FormView.extend({
  template: taskTemplate,

  tagName: 'div',

  className: 'task',

  events: {
    'click a.delete-task': 'removeTask',
    'change input': 'updateTask',
  },

  render: function () {
    var div = this.make('div');

    $(div).append(this.checkBox('done'));
    $(div).append(this.template({ task: this.model }));
    this.$el.html(div);

    return this;
  },

  removeTask: function () {
    this.model.destroy();
    this.$el.remove();
    return false;
  },

  updateTask: function () {
    var done = this.$el.find('input').is(':checked');
    this.model.set('done', done);
    this.model.save(null);
  },
});

export default TaskView;
