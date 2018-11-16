import React from 'react';
import classname from 'classnames';
import PropTypes from 'prop-types';
import CollapsedStory from './CollapsedStory/CollapsedStory';

const StoryItem = ({ story }) => (
  <div className='Story--collapsed' >
    <CollapsedStory story={story} />
  </div>
);

StoryItem.propTypes = {
  story: PropTypes.object.isRequired
};

export default StoryItem;
