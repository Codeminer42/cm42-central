import React, { useState } from 'react';
import ProjectOptionInfo from './ProjectOptionInfo';

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
    >
      {
        showInfo && <ProjectOptionInfo description={description} />
      }
      { children }
    </li>
  )
}

export default ProjectOption;
