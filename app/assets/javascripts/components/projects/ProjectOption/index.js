import React, { useState } from 'react';
import ProjectOptionInfo from './ProjectOptionInfo';

const ProjectOption = ({
  children,
  description
}) => {
  const [showInfo, setShowInfo] = useState(false);

  return (
    <li
      onMouseOver={() => setShowInfo(true)}
      onMouseOut={() => setShowInfo(false)}
      className="ProjectOption"
    >
      {
        showInfo && <ProjectOptionInfo description={description} />
      }
      { children }
    </li>
  )
}

export default ProjectOption;
