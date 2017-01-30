import './libs';
import ProjectsIndexController from './controllers/projects/IndexController';
import TagGroupsController from './controllers/tag_groups/TagGroupsController';
import { start as ProjectsShowController } from './central'

const routes = {
  'projects.index': ProjectsIndexController,
  'projects.show': ProjectsShowController,
  'projects.edit': TagGroupsController,
  'tag_groups.new': TagGroupsController,
  'tag_groups.edit': TagGroupsController
};

const page = $('body').data('page');

if(routes[page]) {
  $(routes[page]);
}

