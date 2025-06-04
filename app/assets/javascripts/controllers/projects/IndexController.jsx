import React from 'react';
import User from 'models/user';
import ProjectSearch from 'components/projects/ProjectSearch';
import ProjectCollection from 'collections/project_collection';
import { createRoot } from 'react-dom/client';

export default () => {
  const user = new User($('#projects-search').data('current_user'));

  const projects = {
    joined: new ProjectCollection(
      $('#projects-search').data('projects_joined')
    ),
    unjoined: new ProjectCollection(
      $('#projects-search').data('projects_unjoined')
    ),
  };

  const container = document.getElementById('projects-search');
  const indexRoot = createRoot(container);

  indexRoot.render(<ProjectSearch projects={projects} user={user} />);
};
