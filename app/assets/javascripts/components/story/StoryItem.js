import React from 'react';
import classname from 'classnames';
import PropTypes from 'prop-types';
import CollapsedStory from './CollapsedStory';

const StoryItem = ({ story }) => (
  <CollapsedStory story={story} />
);

StoryItem.propTypes = {
  story: PropTypes.object.isRequired
};

export default StoryItem;
