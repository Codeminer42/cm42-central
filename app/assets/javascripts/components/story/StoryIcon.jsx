import React from 'react';
import PropTypes from 'prop-types';
import _ from 'underscore';

const iconRules = {
  feature: { icon: 'start', className: 'star' },
  bug: { icon: 'bug_report', className: 'bug' },
  chore: { icon: 'settings', className: 'dark' },
  release: { icon: 'bookmark', className: 'bookmark' },
};

const iconRuleFor = _.propertyOf(iconRules);

const iconRule = storyType => iconRuleFor([storyType, 'icon']);

const classIconRule = storyType => iconRuleFor([storyType, 'className']);

const CollapsedStoryIcon = ({ storyType }) => (
  <span className="Story__icon">
    <i className={`mi md-${classIconRule(storyType)} md-16`}>
      {iconRule(storyType)}
    </i>
  </span>
);

CollapsedStoryIcon.propTypes = {
  storyType: PropTypes.string.isRequired,
};

export default CollapsedStoryIcon;
