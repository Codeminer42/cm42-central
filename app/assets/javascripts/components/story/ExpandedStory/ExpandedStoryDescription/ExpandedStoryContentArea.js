import React from 'react';
import ExpandedStoryDescriptionContent from './ExpandedStoryDescriptionContent';
import ExpandedStoryDescriptionEditButton from './ExpandedStoryDescriptionEditButton';
import PropTypes from 'prop-types';

const ExpandedStoryContentArea = ({ onClick, description }) =>
  <div onClick={onClick} className='story-description-content' data-id="story-description">
  {
    description
      ? <ExpandedStoryDescriptionContent description={description} />
      : <ExpandedStoryDescriptionEditButton />
  }
  </div>

ExpandedStoryContentArea.defaultProps = {
  description: ''
};

ExpandedStoryContentArea.propTypes = {
  onClick: PropTypes.func.isRequired,
  description: PropTypes.string.isRequired
};

export default ExpandedStoryContentArea;
