import React from 'react';

const ProjectCard = ({ project, joined, user }) => {
  return (
    <div className="col-md-6">
      <div className="panel panel-default card project-item animated scale-in">
        <PanelHeading project={project} joined={joined} user={user} />
        <PanelBody project={project} joined={joined} />
        <CardLink project={project} joined={joined} />
      </div>
    </div>
  );
};

export default ProjectCard;

const Tag = ({ project }) => {
  if (!project.get('tag_name')) {
    return null;
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
};

const UsersAvatar = ({ project }) => {
  return project.get('users_avatar').map(avatar_url => (
    <li key={avatar_url} className="member">
      <img src={avatar_url} alt="User avatar" className="identicon" />
    </li>
  ));
};

const PanelHeading = ({ project, joined, user }) => {
  const decodeHTML = html => {
    const textArea = document.createElement('textarea');
    textArea.innerHTML = html;
    return textArea.value;
  };

  const projectName = () => decodeHTML(project.get('name'));

  if (joined) {
    return (
      <div className="panel-heading card-heading">
        <div className="project-card-header-container">
          <a
            href={project.get('path_to').project}
            className="card-title project-title"
          >
            {projectName()}
          </a>
          <Tag project={project} />
        </div>
        <div className="icons pull-right">
          <a
            href={project.get('path_to').project_reports}
            className="unstyled-link"
            data-toggle="tooltip"
            data-placement="top"
            data-title={I18n.t('reports')}
            data-testid="report-icon-anchor"
          >
            <i className="mi md-20 heading-icon">insert_chart</i>
          </a>

          <a
            href={project.get('path_to').project_users}
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
                  href={project.get('path_to').project_settings}
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
                  href={`${project.get('path_to').project_unjoin}${user.id}`}
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
      <span className="card-title">{projectName()}</span>
    </div>
  );
};

const PanelBody = ({ project, joined }) => {
  if (joined) {
    return (
      <div className="panel-body">
        <div className="col-md-12 members">
          <ul className="member-list">
            <UsersAvatar project={project} />
          </ul>
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
};

const CardLink = ({ project, joined }) => {
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
      href={project.get('path_to').project_join}
      className="card-footer panel-footer"
    >
      {I18n.t('projects.join')}
    </a>
  );
};
