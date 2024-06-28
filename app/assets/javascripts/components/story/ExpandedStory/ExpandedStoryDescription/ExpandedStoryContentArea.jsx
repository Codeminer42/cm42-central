import React from 'react';
import ExpandedStoryDescriptionContent from './ExpandedStoryDescriptionContent';
import PropTypes from 'prop-types';

const ExpandedStoryContentArea = ({ onClick, description }) => (
  <div
    onClick={onClick}
    className="story-description-content"
    data-id="story-description"
  >
    <ExpandedStoryDescriptionContent
      data-id="description-content"
      description={description}
    />
  </div>
);

ExpandedStoryContentArea.propTypes = {
  onClick: PropTypes.func.isRequired,
  description: PropTypes.string,
};

ExpandedStoryContentArea.defaultProps = {
  description: '',
};

export default ExpandedStoryContentArea;
