import React from 'react';
import CollapsedStoryTitle from './CollapsedStoryTitle';
import CollapsedStoryLabels from './CollapsedStoryLabels';
import { storyPropTypesShape } from '../../../models/beta/story';

const CollapsedStoryInfo = ({ story }) => (
  <div className="Story__info">
    <CollapsedStoryLabels story={story} />
    <CollapsedStoryTitle story={story} />
  </div>
);

CollapsedStoryInfo.propTypes = {
  story: storyPropTypesShape
};

export default CollapsedStoryInfo;
