import React from 'react';
import PropTypes from 'prop-types';

const estimateRule = (estimate) => estimate > 0 ? estimate : '-';

const CollapsedStoryEstimate = ({ estimate }) => (
  <span className='Story__estimated'>{estimateRule(estimate)}</span>
);

CollapsedStoryEstimate.propTypes = {
  estimate: PropTypes.number,
};

CollapsedStoryEstimate.defaultProp = {
  estimate: '-',
};

export default CollapsedStoryEstimate;
