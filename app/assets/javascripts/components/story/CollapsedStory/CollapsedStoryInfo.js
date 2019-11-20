import React from 'react';
import CollapsedStoryTitle from './CollapsedStoryTitle';
import CollapsedStoryLabels from './CollapsedStoryLabels';
import StoryPropTypes from '../../shapes/story';

const CollapsedStoryInfo = ({ story }) => (
  <div className="Story__info">
    <CollapsedStoryLabels story={story} />
    <CollapsedStoryTitle story={story} />
  </div>
);

CollapsedStoryInfo.propTypes = {
  story: StoryPropTypes
};

export default CollapsedStoryInfo;
