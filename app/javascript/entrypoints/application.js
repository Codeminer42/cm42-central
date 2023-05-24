import "raf/polyfill";
import "libs";
import "core-js/shim";
import ProjectsIndexController from "controllers/projects/IndexController";
import ProjectsEditController from "controllers/projects/EditController";
import TagGroupsController from "controllers/tag_groups/TagGroupsController.jsx";
import ProjectsShowController from "central";
import BetaShowProjectBoardController from "controllers/beta/project_boards/ShowController";

const routes = {
  "projects.index": ProjectsIndexController,
  "projects.show": ProjectsShowController,
  "projects.edit": ProjectsEditController,
  "tag_groups.new": TagGroupsController,
  "tag_groups.edit": TagGroupsController,
  "beta/projects.show": BetaShowProjectBoardController,
};

const page = $("body").data("page");

if (routes[page]) {
  $(routes[page]);
}
