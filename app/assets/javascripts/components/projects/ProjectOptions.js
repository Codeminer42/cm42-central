import React from 'react';
import ProjectOption from './ProjectOption';

const ProjectOptions = () =>
  <div className="ProjectBoard__options">
    <ul>
      <ProjectOption description={I18n.t('revert_tooltip')}>
        <i class="fas fa-redo-alt ProjectOption__icon"></i>
      </ProjectOption>
    </ul>
  </div>

export default ProjectOptions;
