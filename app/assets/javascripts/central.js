var Project = require('models/project');
var User = require('models/user');

var ProjectView = require('views/project_view');
var ProjectSearchView = require('views/project_search_view');
var ProjectVelocityView = require('views/project_velocity_view');

require('./global_listeners');
var firstTimeTour = require('./tour');

var Central = module.exports = {
  start: function() {
    $('[data-project]').each(function() {
      var data = $(this).data();
      data.project.current_flow = data.currentFlow;
      data.project.default_flow = data.defaultFlow;

      var project  = new Project(data.project);
      var view     = new ProjectView({ model: project, el: $('#project-stories') });
      var search   = new ProjectSearchView({ model: project, el: $('#form_search') });
      var velocity = new ProjectVelocityView({ model: project, el: $('#velocity') });

      project.users.reset(data.users);
      project.current_user = new User(data.currentUser);

      view.velocityView = velocity;
      view.searchView   = search;
      view.scaleToViewport();

      $(window).resize(view.scaleToViewport);

      setInterval(function() {
        project.fetch();
      }, 10 * 1000); // every 10 seconds

      window.projectView = view;
    });

    setTimeout(firstTimeTour.start, 200);
  }
};
