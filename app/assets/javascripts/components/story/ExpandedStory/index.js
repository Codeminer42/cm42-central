import React from 'react';
import PropTypes from 'prop-types';
import ExpandedStoryHistoryLocation from './ExpandedStoryHistoryLocation'

const ExpandedStory = ({ story }) => (
  <div className="Story Story--expanded">
    <ExpandedStoryHistoryLocation story={story} />
  </div>
);

ExpandedStory.propTypes = {
  story: PropTypes.object.isRequired
};

export default ExpandedStory;
