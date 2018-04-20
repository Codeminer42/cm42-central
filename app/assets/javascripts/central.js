/* eslint no-unused-vars:"off" */
/* eslint no-multi-assign:"off" */
/* eslint func-names:"off" */
/* eslint prefer-destructuring:"off" */
import TourController from 'controllers/tour/TourController';

const Project = require('models/project');
const User = require('models/user');
const TabNotification = require('mixins/tab_notification');

const ProjectView = require('views/project_view');
const ProjectSearchView = require('views/project_search_view');
const ProjectVelocityView = require('views/project_velocity_view');

require('./global_listeners');

const Central = module.exports = {
  start() {
    $('[data-project]').each(function () {
      const data = $(this).data();
      data.project.current_flow = data.currentFlow;
      data.project.default_flow = data.defaultFlow;

      const project = new Project(data.project);
      const view = new ProjectView({ model: project, el: $('#project-stories') });
      const search = new ProjectSearchView({ model: project, el: $('#form_search') });
      const velocity = new ProjectVelocityView({ model: project, el: $('#velocity') });
      const title = document.title;

      project.users.reset(data.users);
      project.current_user = new User(data.currentUser);

      view.velocityView = velocity;
      view.searchView = search;
      view.scaleToViewport();

      project.on('change', () => {
        TabNotification.changeTitle(title, document.hidden);
      });

      document.addEventListener('visibilitychange', () => {
        if (!document.hidden) { TabNotification.changeTitle(title, document.hidden); }
      });

      $(window).resize(view.scaleToViewport);

      setInterval(() => {
        project.fetch();
      }, 10 * 1000); // every 10 seconds

      window.projectView = view;
    });

    setTimeout(() => {
      const tourController = new TourController();
      tourController.initialize();
    }, 200);
  },
};
