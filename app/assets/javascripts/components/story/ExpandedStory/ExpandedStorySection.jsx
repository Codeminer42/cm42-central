import React from 'react';
import PropTypes from 'prop-types';

const ExpandedStorySection = ({ title, children, identifier = 'content' }) => (
  <div className="Story__section">
    <div className="Story__section-title">{title}</div>
    <div className={`Story__section__${identifier}`}>{children}</div>
  </div>
);

ExpandedStorySection.propTypes = {
  title: PropTypes.string.isRequired,
  identifier: PropTypes.string,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired,
};

export default ExpandedStorySection;
