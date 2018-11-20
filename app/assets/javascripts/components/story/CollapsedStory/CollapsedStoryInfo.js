import React from 'react';
import PropTypes from 'prop-types';
import CollapsedStoryTitle from './CollapsedStoryTitle'
import CollapsedStoryLabels from './CollapsedStoryLabels'

const CollapsedStoryInfo = ({ story }) => (
  <div className="Story__info">
    <CollapsedStoryLabels story={story} />
    <CollapsedStoryTitle story={story} />
  </div>
);

CollapsedStoryInfo.propTypes = {
  story: PropTypes.object.isRequired
};

export default CollapsedStoryInfo;
