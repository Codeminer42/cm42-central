import React from 'react';
import PropTypes from 'prop-types';
import { estimateRule } from 'rules/story';

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
