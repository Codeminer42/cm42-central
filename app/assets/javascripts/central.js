import Project from './models/project';
import User from './models/user';
import TabNotification from './mixins/tab_notification';
import ProjectView from './views/project_view';
import ProjectSearchView from './views/project_search_view';
import ProjectVelocityView from './views/project_velocity_view';
import Cookies from 'js-cookie';

import TourController from 'controllers/tour/TourController';
import { subscribeToProjectChanges } from './pusherSockets';

import './global_listeners';

const Central = () => {
  $('[data-project]').each(function () {
    var data = $(this).data();
    data.project.current_flow = data.currentFlow;
    data.project.default_flow = data.defaultFlow;
    data.project.hidden_columns = JSON.parse(Cookies.get("hidden_columns") || "[]")

    var project = new Project(data.project);
    var view = new ProjectView({ model: project, el: $('#project-stories') });
    var search = new ProjectSearchView({
      model: project,
      el: $('#form_search'),
    });
    var velocity = new ProjectVelocityView({
      model: project,
      el: $('#velocity'),
    });
    var title = document.title;

    project.users.reset(data.users);
    project.current_user = new User(data.currentUser);

    view.velocityView = velocity;
    view.searchView = search;
    view.scaleToViewport();

    project.on('change', () => {
      TabNotification.changeTitle(title, document.hidden);
    });

    document.addEventListener('visibilitychange', () => {
      if (!document.hidden) TabNotification.changeTitle(title, document.hidden);
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
};

export default Central;
