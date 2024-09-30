import React from 'react';

export default class ProjectCard extends React.Component {
  decodeHTML(html) {
    const txt = document.createElement('textarea');
    txt.innerHTML = html;
    return txt.value;
  }

  renderTag(project) {
    if (!project.get('tag_name')) {
      return;
    }

    const style = {
      backgroundColor: project.get('tag_bg_color'),
      color: project.get('tag_fore_color'),
    };

    return (
      <small className="card-tag" style={style}>
        {project.get('tag_name')}
      </small>
    );
  }

  projectName() {
    return this.decodeHTML(this.props.project.get('name'));
  }

  panelHeading() {
    const { project, joined } = this.props;

    if (joined) {
      return (
        <div className="panel-heading card-heading">
          <div className="project-card-header-container">
            <a
              href={project.get('path_to').project}
              className="card-title project-title"
            >
              {this.projectName()}
            </a>
            {this.renderTag(project)}
          </div>
          <div className="icons pull-right">
            <a
              href={project.get('path_to').projectReports}
              className="unstyled-link"
              data-toggle="tooltip"
              data-placement="top"
              data-title={I18n.t('reports')}
              data-testid="report-icon-anchor"
            >
              <i className="mi md-20 heading-icon">insert_chart</i>
            </a>

            <a
              href={project.get('path_to').projectUsers}
              className="unstyled-link"
              data-toggle="tooltip"
              data-placement="top"
              data-testid="user-icon-anchor"
            >
              <i className="mi md-20 heading-icon">group</i>
            </a>

            <span className="dropdown">
              <a
                className="unstyled-link"
                type="button"
                data-toggle="dropdown"
                aria-haspopup="true"
                aria-expanded="false"
                data-testid="settings-icon-anchor"
              >
                <i className="mi md-20 heading-icon">settings</i>
              </a>

              <ul
                className="dropdown-menu dropdown-menu-right"
                aria-labelledby="dLabel"
              >
                <li className="dropdown-header">{I18n.t('options')}</li>

                <li>
                  <a
                    href={project.get('path_to').projectSettings}
                    data-toggle="tooltip"
                    data-placement="top"
                    data-title={I18n.t('settings')}
                  >
                    {I18n.t('settings')}
                  </a>
                </li>

                <li className="divider"></li>

                <li>
                  <a
                    href={`${project.get('path_to').projectUnjoin}${
                      this.props.user.id
                    }`}
                    data-method="delete"
                  >
                    {I18n.t('projects.unjoin')}
                  </a>
                </li>
              </ul>
            </span>
          </div>
        </div>
      );
    }

    return (
      <div className="panel-heading card-heading">
        <span className="card-title">{this.projectName()}</span>
      </div>
    );
  }

  panelBody() {
    const { project, joined } = this.props;

    if (joined) {
      return (
        <div className="panel-body">
          <div className="col-md-12 members">
            <ul className="member-list">{this.renderUsersAvatar()}</ul>
          </div>
        </div>
      );
    }

    if (!joined && project.get('archived_at')) {
      return (
        <div className="panel-body">
          <span className="col-md-12 text-center">
            {I18n.t('projects.unable_to_join')}
          </span>
        </div>
      );
    }

    return (
      <div className="panel-body">
        <span className="col-md-12 text-center">
          {I18n.t('projects.to_view_more_join')}
        </span>
      </div>
    );
  }

  renderUsersAvatar() {
    const { project, joined } = this.props;

    if (joined) {
      return project.get('users_avatar').map(avatar_url => (
        <li key={avatar_url} className="member">
          <img src={avatar_url} alt="User avatar" className="identicon" />
        </li>
      ));
    }
  }

  cardLink() {
    const { project, joined } = this.props;

    if (project.get('archived_at')) {
      return (
        <span className="card-footer panel-footer">
          {I18n.t('archived_at')} {project.get('archived_at')}
        </span>
      );
    }

    if (joined) {
      return (
        <a
          href={project.get('path_to').project}
          className="card-footer panel-footer"
        >
          {I18n.t('projects.select')}
        </a>
      );
    }

    return (
      <a
        href={project.get('path_to').projectJoin}
        className="card-footer panel-footer"
      >
        {I18n.t('projects.join')}
      </a>
    );
  }

  render() {
    return (
      <div className="col-md-6">
        <div className="panel panel-default card project-item animated scale-in">
          {this.panelHeading()}
          {this.panelBody()}
          {this.cardLink()}
        </div>
      </div>
    );
  }
}
