import React from "react";
import ReactDOM from "react-dom";
import User from "models/user";
import ProjectSearch from "components/projects/ProjectSearch";
import ProjectCollection from "collections/project_collection";

export default () => {
  const user = new User($("#projects-search").data("current_user"));

  const projects = {
    joined: new ProjectCollection(
      $("#projects-search").data("projects_joined")
    ),
    unjoined: new ProjectCollection(
      $("#projects-search").data("projects_unjoined")
    ),
  };

  ReactDOM.render(
    <ProjectSearch projects={projects} user={user} />,
    document.getElementById("projects-search")
  );
};
