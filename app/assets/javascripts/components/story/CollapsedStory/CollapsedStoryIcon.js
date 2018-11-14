import React from 'react';
import PropTypes from 'prop-types';
import { iconRule, classIconRule } from 'rules/story';

const CollapsedStoryIcon = ({ storyType }) => (
  <span className='Story__icon'>
    <i className={`mi md-${classIconRule(storyType)} md-16`}>{iconRule(storyType)}</i>
  </span>
);

CollapsedStoryIcon.propTypes = {
  storyType: PropTypes.string.isRequired,
};

export default CollapsedStoryIcon;
