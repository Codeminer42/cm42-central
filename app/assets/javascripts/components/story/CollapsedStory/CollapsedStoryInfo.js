import React from 'react';
import CollapsedStoryTitle from './CollapsedStoryTitle';
import CollapsedStoryLabels from './CollapsedStoryLabels';
import StoryPropTypes from '../../shapes/story';
import PropTypes from 'prop-types';

const CollapsedStoryInfo = ({ story, onClickLabel }) => (
  <div className="Story__info">
    <CollapsedStoryLabels story={story} onClickLabel={onClickLabel} />
    <CollapsedStoryTitle story={story} />
  </div>
);

CollapsedStoryInfo.propTypes = {
  story: StoryPropTypes,
  onClickLabel: PropTypes.func.isRequired
};

export default CollapsedStoryInfo;
