import React from 'react';
import PropTypes from 'prop-types';

const estimateRule = (estimate) => estimate || '-';

const CollapsedStoryEstimate = ({ estimate }) => (
  <span className='Story__estimated-value'>{estimateRule(estimate)}</span>
);

CollapsedStoryEstimate.propTypes = {
  estimate: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
};

CollapsedStoryEstimate.defaultProp = {
  estimate: '-',
};

export default CollapsedStoryEstimate;
