import React from 'react';
import Project from 'models/project';
import ProjectList from 'components/projects/ProjectList';

export default class ProjectSearch extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: props.user,
      visibleProjects: {
        joined: {
          title: I18n.t('projects.mine'),
          projects: this.props.projects.joined.notArchived(),
          joined: true
        },
        unjoined: {
          title: I18n.t('projects.not_member_of'),
          projects: this.props.projects.unjoined.notArchived(),
          joined: false
        }
      }
    };
    this.handleSearch = this.handleSearch.bind(this);
  }

  filterProjects(projects, searchValue, filterValue) {
    const projectsFiltered = projects.nameContains(searchValue);

    if (filterValue == 'archived') {
      return projectsFiltered.archived();
    } else if (filterValue == 'not_archived') {
      return projectsFiltered.notArchived();
    }

    return projectsFiltered;
  }

  handleSearch() {
    const projectsSearch = this.refs.projectsSearch.value;
    const projectsFilter = this.refs.projectsFilter.value;
    this.setState({
      visibleProjects: {
        joined: {
          title: I18n.t('projects.mine'),
          projects: this.filterProjects(this.props.projects.joined, projectsSearch, projectsFilter),
          joined: true
        },
        unjoined: {
          title: I18n.t('projects.not_member_of'),
          projects: this.filterProjects(this.props.projects.unjoined, projectsSearch, projectsFilter),
          joined: false
        }
      }
    });
  }

  filterOptions() {
    return Project.filters.map((filter) => {
      return(<option key={ filter } value={ filter }>{ I18n.t(filter) }</option>);
    });
  }

  renderProjectList(list) {
    if (list.projects.length > 0) {
      return(
        <ProjectList
          title={ list.title }
          projects={ list.projects }
          user={ this.state.user }
          joined={ list.joined }
        />
      );
    }
  }

  render() {
    return(
      <div>
        <div className="search-projects">
          <div className="form-group col-md-12">
            <div className="input-group">
              <div className="input-group-addon"><i className="mi md-20 heading-icon">search</i></div>
              <input
                id="projects_search"
                className="form-control"
                onChange={this.handleSearch}
                ref="projectsSearch"
                placeholder="Search projects"
              />

              <div className="input-group-addon">
                <select
                  id="project_type"
                  className="unstyled-input"
                  onChange={this.handleSearch}
                  ref="projectsFilter"
                >
                  { this.filterOptions() }
                </select>
              </div>
            </div>
          </div>
        </div>
        { this.renderProjectList(this.state.visibleProjects.joined) }
        { this.renderProjectList(this.state.visibleProjects.unjoined) }
      </div>
    );
  }
};
