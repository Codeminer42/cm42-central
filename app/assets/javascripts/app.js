import './libs';
import ProjectsIndexController from './controllers/projects/IndexController';
import { start as ProjectsShowController } from './central'

const routes = {
  'projects.index': ProjectsIndexController,
  'projects.show': ProjectsShowController
};

const page = $('body').data('page');

if(routes[page]) {
  $(routes[page]);
}
