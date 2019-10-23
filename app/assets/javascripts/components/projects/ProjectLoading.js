import React from 'react';

const ProjectLoading = () => 
  <div className="ProjectBoard__loading">
    <div className="ProjectBoard__loading__content">
      <div className="ProjectBoard__loading__content__spinner">
        <i class="fas fa-circle-notch fa-spin"></i>
      </div>
      <h2 className="ProjectBoard__loading__content__text">{I18n.t('loading')}</h2>
    </div>
  </div>

export default ProjectLoading;
