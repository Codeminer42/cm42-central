import React, { useState } from 'react';
import ProjectOptionInfo from './ProjectOptionInfo';
import PropTypes from 'prop-types';

const ProjectOption = ({
  children,
  description,
  onClick
}) => {
  const [showInfo, setShowInfo] = useState(false);

  return (
    <li
      onMouseOver={() => setShowInfo(true)}
      onMouseOut={() => setShowInfo(false)}
      className="ProjectOption"
      onClick={onClick}
      data-id="project-option"
    >
      {
        showInfo && <ProjectOptionInfo description={description} />
      }
      { children }
    </li>
  )
}

ProjectOption.propTypes = {
  children: PropTypes.node.isRequired,
  description: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired
}

export default ProjectOption;
