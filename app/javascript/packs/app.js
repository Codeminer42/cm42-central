import 'libs';
import ProjectsIndexController from 'controllers/projects/IndexController';
import TagGroupsController from 'controllers/tag_groups/TagGroupsController';
import { start as ProjectsShowController } from 'central';
import BetaShowProjectBoardController from 'controllers/beta/project_boards/ShowController';

const routes = {
  'projects.index': ProjectsIndexController,
  'projects.show': ProjectsShowController,
  'projects.edit': TagGroupsController,
  'tag_groups.new': TagGroupsController,
  'tag_groups.edit': TagGroupsController,
  'beta/projects.show': BetaShowProjectBoardController,
};

const page = $('body').data('page');

if (routes[page]) {
  $(routes[page]);
}
