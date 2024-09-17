import React from 'react';
import PropTypes from 'prop-types';

const SideBarButtonInfo = ({ description }) => (
  <span
    data-id="project-option-info"
    data-testid="sidebar-button-description"
    className="SideBar__info"
  >
    {description}
  </span>
);

SideBarButtonInfo.propTypes = {
  description: PropTypes.string.isRequired,
};

export default SideBarButtonInfo;
