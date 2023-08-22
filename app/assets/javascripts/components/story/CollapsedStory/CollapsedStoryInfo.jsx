import React from 'react';
import CollapsedStoryTitle from './CollapsedStoryTitle';
import CollapsedStoryLabels from './CollapsedStoryLabels';
import StoryPropTypes from '../../shapes/story';
import PropTypes from 'prop-types';

const CollapsedStoryInfo = ({ story, onLabelClick }) => (
  <div className="Story__info">
    <CollapsedStoryLabels story={story} onLabelClick={onLabelClick} />
    <CollapsedStoryTitle story={story} />
  </div>
);

CollapsedStoryInfo.propTypes = {
  story: StoryPropTypes,
  onLabelClick: PropTypes.func.isRequired
};

export default CollapsedStoryInfo;
