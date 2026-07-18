import React from 'react';
import ProjectCollection from 'collections/project_collection';
import User from 'models/user';
import ProjectSearch from './ProjectSearch';

const ProjectSearchPage = ({
  currentUser,
  projectsJoined = [],
  projectsUnjoined = [],
}) => {
  const projects = {
    joined: new ProjectCollection(projectsJoined),
    unjoined: new ProjectCollection(projectsUnjoined),
  };

  return <ProjectSearch projects={projects} user={new User(currentUser)} />;
};

export default ProjectSearchPage;
