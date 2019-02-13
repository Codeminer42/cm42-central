import ProjectVelocityOverrideView from './project_velocity_override_view';
import projectVelocityTemplate from 'templates/project_velocity.ejs';

const ProjectVelocityView = Backbone.View.extend({

  className: 'velocity',

  initialize: function() {
    _.bindAll(this, 'setFakeClass', 'render');
    this.override_view = new ProjectVelocityOverrideView({model: this.model});
    this.listenTo(this.model, 'change:userVelocity', this.setFakeClass);
    this.listenTo(this.model, 'rebuilt-iterations', this.render);
  },

  events: {
    "click #velocity_value": "editVelocityOverride"
  },

  template: projectVelocityTemplate,

  render: function() {
    this.$el.html(this.template({project: this.model}));
    this.setFakeClass(this.model);
    return this;
  },

  editVelocityOverride: function() {
    this.$el.append(this.override_view.render().el);
  },

  setFakeClass: function(model) {
    if (model.velocityIsFake()) {
      this.$el.addClass('fake');
    } else {
      this.$el.removeClass('fake');
    }
  }
});

export default ProjectVelocityView;
