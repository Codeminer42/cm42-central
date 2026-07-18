import 'raf/polyfill';
import 'libs';
import 'core-js/shim';
import ReactOnRails from 'react-on-rails/client';
import ProjectsEditController from 'controllers/projects/EditController';
import TagGroupsController from 'controllers/tag_groups/TagGroupsController.jsx';
import ProjectsShowController from 'central';
import BetaShowProjectBoardController from 'controllers/beta/project_boards/ShowController';
import ProjectSearchPage from 'components/projects/ProjectSearchPage';

try {
  ReactOnRails.getComponent('ProjectSearchPage');
} catch {
  ReactOnRails.register({ ProjectSearchPage });
}

const routes = {
  'projects.show': ProjectsShowController,
  'projects.edit': ProjectsEditController,
  'tag_groups.new': TagGroupsController,
  'tag_groups.edit': TagGroupsController,
  'beta/projects.show': BetaShowProjectBoardController,
};

const page = $('body').data('page');

if (routes[page]) {
  $(routes[page]);
}
