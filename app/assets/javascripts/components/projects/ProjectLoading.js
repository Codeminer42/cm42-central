import React from 'react';

const ProjectLoading = () => 
  <div className="ProjectBoard-loading">
    <div className="ProjectBoard-loading__content">
      <div className="ProjectBoard-loading__spinner">
        <i className="fas fa-circle-notch fa-spin"></i>
      </div>
      <h2 className="ProjectBoard-loading__text">{I18n.t('loading')}</h2>
    </div>
  </div>

export default ProjectLoading;
