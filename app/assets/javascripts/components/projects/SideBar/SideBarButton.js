import React, { useState } from 'react';
import SideBarButtonInfo from './SideBarButtonInfo';
import PropTypes from 'prop-types';
import classname from 'classnames';

const SideBarButton = ({
  children,
  description,
  onClick,
  toggled
}) => {
  const [showInfo, setShowInfo] = useState(false);

  const classes = classname(
    'SideBar__link',
    {
      'SideBar__link--is-toggled': toggled
    }
  );

  return (
    <li
      onMouseOver={() => setShowInfo(true)}
      onMouseOut={() => setShowInfo(false)}
      className={classes}
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
  onClick: PropTypes.func.isRequired,
  toggled: PropTypes.bool.isRequired
}

export default SideBarButton;
