import React from 'react';
import ProjectCard from 'components/projects/ProjectCard';

const ProjectList = ({ user, projects, joined, title }) => {
  return (
    <>
      <div className="col-md-12 project-list-title">
        <h4>
          <i className="mi md-20 heading-icon" data-testid="view-module-title">
            view_module
          </i>{' '}
          {title} | {projects.length}
        </h4>
      </div>
      {projects.map(project => (
        <ProjectCard
          key={project.get('slug')}
          project={project}
          user={user}
          joined={joined}
        />
      ))}
    </>
  );
};

export default ProjectList;
