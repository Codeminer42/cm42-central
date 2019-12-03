import React, { useState } from 'react';
import SideBarButtonInfo from './SideBarButtonInfo';
import PropTypes from 'prop-types';

const SideBarButton = ({
  children,
  description,
  onClick
}) => {
  const [showInfo, setShowInfo] = useState(false);

  return (
    <li
      onMouseOver={() => setShowInfo(true)}
      onMouseOut={() => setShowInfo(false)}
      className="SideBar__link"
      onClick={onClick}
      data-id="side-bar-button"
    >
      {
        showInfo && <SideBarButtonInfo data-id="button-info" description={description} />
      }
      { children }
    </li>
  )
}

SideBarButton.propTypes = {
  children: PropTypes.node.isRequired,
  description: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired
}

export default SideBarButton;
