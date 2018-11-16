import React from 'react';
import PropTypes from 'prop-types';
import CollapsedStory from './CollapsedStory';

const StoryItem = ({ story }) => (
  <div className='Story--collapsed' >
    <CollapsedStory story={story} />
  </div>
);

StoryItem.propTypes = {
  story: PropTypes.object.isRequired
};

export default StoryItem;
