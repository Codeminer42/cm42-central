import React from 'react';
import PropTypes from 'prop-types';
import ExpandedStoryHistoryLocation from './ExpandedStoryHistoryLocation';
import ExpandedStoryControls from './ExpandedStoryControls';
import ExpandedStoryEstimate from './ExpandedStoryEstimate';
import ExpandedStoryType from './ExpandedStoryType';

const ExpandedStory = (props) => {
  const { story, onToggle } = props;

  return (
    <div className="Story Story--expanded">
      <ExpandedStoryControls onCancel={onToggle} />
      <ExpandedStoryHistoryLocation story={story} />
      <div className="Story__inline-block">
        <ExpandedStoryEstimate story={story} />
        <ExpandedStoryType story={story} />
      </div>
    </div>
  );
};

ExpandedStory.propTypes = {
  story: PropTypes.object.isRequired
};

export default ExpandedStory;
