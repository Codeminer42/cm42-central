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

// To see this message, add the following to the `<head>` section in your
// views/layouts/application.html.erb
//
//    <%= vite_client_tag %>
//    <%= vite_javascript_tag 'application' %>
console.log("Vite ⚡️ Rails");

// If using a TypeScript entrypoint file:
//     <%= vite_typescript_tag 'application' %>
//
// If you want to use .jsx or .tsx, add the extension:
//     <%= vite_javascript_tag 'application.jsx' %>

console.log(
  "Visit the guide for more information: ",
  "https://vite-ruby.netlify.app/guide/rails"
);

// Example: Load Rails libraries in Vite.
//
// import * as Turbo from '@hotwired/turbo'
// Turbo.start()
//
// import ActiveStorage from '@rails/activestorage'
// ActiveStorage.start()
//
// // Import all channels.
// const channels = import.meta.globEager('./**/*_channel.js')

// Example: Import a stylesheet in app/frontend/index.css
// import '~/index.css'
