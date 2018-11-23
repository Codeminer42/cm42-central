import React from 'react';
import PropTypes from 'prop-types';
import CollapsedStory from './CollapsedStory';
import ExpandedStory from './ExpandedStory'

const StoryItem = ({ story }) => (
  <div className='story-container'>
    <CollapsedStory story={story} />
  </div>
);

StoryItem.propTypes = {
  story: PropTypes.object.isRequired
};

export default StoryItem;
