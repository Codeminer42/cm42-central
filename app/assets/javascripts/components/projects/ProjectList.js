import React from 'react';
import ProjectCard from 'components/projects/ProjectCard';

export default class ProjectList extends React.Component {
  cards() {
    const { user, projects, joined } = this.props;

    return projects.map((project) => {
      return <ProjectCard key={ project.get('id') } project={ project } user={ user } joined={ joined } />
    });
  }

  render() {
    const { projects, title } = this.props

    return(
      <div>
        <div className="col-md-12 project-list-title">
          <h4><i className="mi md-20 heading-icon">view_module</i> { title } | { projects.length }</h4>
        </div>
        { this.cards() }
      </div>
    );
  }
}
