import React from 'react';

export default class ProjectCard extends React.Component {
  panelHeading() {
    const { project, joined } = this.props;

    if (joined) {
      return(
        <div className="panel-heading">
          <a href={ project.get('path_to').project } className="card-title">{ project.get('name') }</a>

          <div className="icons pull-right">
            <a href={ project.get('path_to').projectReports }
              className="unstyled-link"
              data-toggle="tooltip"
              data-placement="top"
              data-title={ I18n.t('reports') }
            >
              <i className="mi md-20 heading-icon">insert_chart</i>
            </a>

            <a href={ project.get('path_to').projectUsers }
              className="unstyled-link"
              data-toggle="tooltip"
              data-placement="top"
            >
              <i className="mi md-20 heading-icon">group</i>
            </a>

            <span className="dropdown">
              <a className="unstyled-link"
                type="button"
                data-toggle="dropdown"
                aria-haspopup="true"
                aria-expanded="false"
              >
                <i className="mi md-20 heading-icon">settings</i>
              </a>

              <ul className="dropdown-menu dropdown-menu-right" aria-labelledby="dLabel">
                <li className="dropdown-header">
                  { I18n.t('options') }
                </li>

                <li>
                  <a href={ project.get('path_to').projectSettings }
                    data-toggle="tooltip"
                    data-placement="top"
                    data-title={ I18n.t('settings') }
                  >
                    { I18n.t('settings') }
                  </a>
                </li>

                <li className="divider"></li>

                <li>
                  <a href={`${project.get('path_to').projectUnjoin}${this.props.user.id}`} data-method="delete">
                    { I18n.t('projects.unjoin') }
                  </a>
                </li>
              </ul>
            </span>
          </div>
        </div>
      );
    }

    return(
      <div className="panel-heading">
        <span href={ project.get('path_to').project } className="card-title">{ project.get('name') }</span>
      </div>
    );
  }

  panelBody() {
    const { project, joined } = this.props;

    if (joined) {
      return(
        <div className="panel-body">
          <div className="col-md-6 col-xs-6 counter">
            <span className="counter-description">{ I18n.t('velocity') }</span>
            <span className="counter-value">{ project.get('velocity') }</span>
          </div>

          <div className="col-md-6 col-xs-6 counter">
            <span className="counter-description">{ I18n.t('volatility') }</span>
            <span className="counter-value">{ project.get('volatility') }</span>
          </div>

          <div className="col-md-12 members">
            <ul className="member-list">
              { this.renderUsersAvatar() }
            </ul>
          </div>
        </div>
      );
    }

    if (!joined && project.get('archived_at')) {
      return(
        <div className="panel-body">
          <span className="col-md-12 text-center">{ I18n.t('projects.unable_to_join') }</span>
        </div>
      );
    }

    return(
      <div className="panel-body">
        <span className="col-md-12 text-center">{ I18n.t('projects.to_view_more_join') }</span>
      </div>
    );
  }

  renderUsersAvatar() {
    const { project, joined } = this.props;

    if (joined) {
      return project.get('users_avatar').map((avatar_url) =>
        <li className="member"><img src={ avatar_url } alt="User avatar" className="identicon" /></li>
      );
    }
  }

  cardLink() {
    const { project, joined } = this.props;

    if (project.get('archived_at')) {
      return(<span className="card-footer panel-footer">{I18n.t('archived_at')} {project.get('archived_at')}</span>);
    }

    if (joined) {
      return (<a href={ project.get('path_to').project } className="card-footer panel-footer">{ I18n.t('projects.select') }</a>);
    }

    return(<a href={ project.get('path_to').projectJoin } className="card-footer panel-footer">{ I18n.t('projects.join') }</a>);
  }

  render() {
    return (
      <div className="col-md-6 project-item">
        <div className="panel panel-default card animated scale-in">
          { this.panelHeading() }
          { this.panelBody() }
          { this.cardLink() }
        </div>
      </div>
    );
  }
}
