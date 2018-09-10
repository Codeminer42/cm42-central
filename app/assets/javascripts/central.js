var Project = require('models/project');
var User = require('models/user');
var TabNotification = require('mixins/tab_notification');

var ProjectView = require('views/project_view');
var ProjectSearchView = require('views/project_search_view');
var ProjectVelocityView = require('views/project_velocity_view');

import TourController from 'controllers/tour/TourController';
import { subscribeToProjectChanges } from './pusherSockets';

require('./global_listeners');

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
      var title = document.title;

      project.users.reset(data.users);
      project.current_user = new User(data.currentUser);

      view.velocityView = velocity;
      view.searchView   = search;
      view.scaleToViewport();

      project.on('change', () => {
        TabNotification.changeTitle(title, document.hidden);
      });

      document.addEventListener('visibilitychange', () => {
        if(!document.hidden)
        TabNotification.changeTitle(title, document.hidden);
      });

      $(window).resize(view.scaleToViewport);

      subscribeToProjectChanges(project, () => {
        project.fetch();
      });

      window.projectView = view;
    });

    setTimeout(() => {
      const tourController = new TourController();
      tourController.initialize();
    }, 200);
  }
};
