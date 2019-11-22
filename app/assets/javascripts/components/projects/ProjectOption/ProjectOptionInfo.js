import React from 'react';
import PropTypes from 'prop-types';

const ProjectOptionInfo = ({
  description
}) =>
  <span className="ProjectOption__info">
    { description }
  </span>

ProjectOptionInfo.propTypes = {
  description: PropTypes.string.isRequired
}

export default ProjectOptionInfo;
