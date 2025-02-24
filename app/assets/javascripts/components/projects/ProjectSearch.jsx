import React, { Fragment, useState } from 'react';
import Project from 'models/project';
import ProjectList from 'components/projects/ProjectList';

const ProjectSearch = ({ user, projects }) => {
  const [projectsSearch, setProjectsSearch] = useState('');
  const [projectsFilter, setProjectsFilter] = useState('');
  const [visibleProjects, setVisibleProjects] = useState({
    joined: {
      title: I18n.t('projects.mine'),
      projects: projects.joined.notArchived(),
      joined: true,
    },
    unjoined: {
      title: I18n.t('projects.not_member_of'),
      projects: projects.unjoined.notArchived(),
      joined: false,
    },
  });

  const filterProjects = (projects, searchValue, filterValue) => {
    const projectsFiltered = projects.nameContains(searchValue);
    if (filterValue === 'archived') {
      return projectsFiltered.archived();
    } else if (filterValue === 'not_archived') {
      return projectsFiltered.notArchived();
    }
    return projectsFiltered;
  };

  const handleSearch = (searchValue, filterValue) => {
    setVisibleProjects({
      joined: {
        title: I18n.t('projects.mine'),
        projects: filterProjects(projects.joined, searchValue, filterValue),
        joined: true,
      },
      unjoined: {
        title: I18n.t('projects.not_member_of'),
        projects: filterProjects(projects.unjoined, searchValue, filterValue),
        joined: false,
      },
    });
  };

  const filterOptions = () => {
    return Project.filters.map(filter => (
      <option key={filter} value={filter}>
        {I18n.t(filter)}
      </option>
    ));
  };

  const renderProjectList = list => {
    if (list.projects.length > 0) {
      return (
        <ProjectList
          title={list.title}
          projects={list.projects}
          user={user}
          joined={list.joined}
        />
      );
    }
  };

  return (
    <Fragment>
      <div className="search-projects">
        <div className="form-group col-md-12">
          <div className="input-group">
            <div className="input-group-addon">
              <i className="mi md-20 heading-icon">search</i>
            </div>
            <input
              id="projects_search"
              className="form-control"
              onChange={e => {
                setProjectsSearch(e.target.value);
                handleSearch(e.target.value, projectsFilter);
              }}
              value={projectsSearch}
              placeholder="Search projects"
            />
            <div className="input-group-addon">
              <select
                id="project_type"
                className="unstyled-input"
                data-testid="select-project-filter"
                onChange={e => {
                  setProjectsFilter(e.target.value);
                  handleSearch(projectsSearch, e.target.value);
                }}
                value={projectsFilter}
              >
                {filterOptions()}
              </select>
            </div>
          </div>
        </div>
      </div>
      {renderProjectList(visibleProjects.joined)}
      {renderProjectList(visibleProjects.unjoined)}
    </Fragment>
  );
};

export default ProjectSearch;
