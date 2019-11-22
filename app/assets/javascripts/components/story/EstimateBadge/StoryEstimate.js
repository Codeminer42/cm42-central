import React from 'react';
import PropTypes from 'prop-types';

const StoryEstimate = ({ estimate }) =>
  <span className='Story__estimated-value'>{ estimate }</span>

StoryEstimate.propTypes = {
  estimate: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
};

StoryEstimate.defaultProp = {
  estimate: '-',
};

export default StoryEstimate;
