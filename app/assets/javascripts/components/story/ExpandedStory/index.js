import React from 'react';
import PropTypes from 'prop-types';
import ExpandedStoryHistoryLocation from './ExpandedStoryHistoryLocation';
import ExpandedStoryControls from './ExpandedStoryControls';
import ExpandedStoryEstimate from './ExpandedStoryEstimate';
import ExpandedStoryType from './ExpandedStoryType';
import { editStory } from '../../../actions/story';
import { connect } from 'react-redux';

const ExpandedStory = (props) => {
  const { story, onToggle, editStory } = props;

  return (
    <div className="Story Story--expanded">
      <ExpandedStoryControls onCancel={onToggle} />
      <ExpandedStoryHistoryLocation story={story} />
      <div className="Story__inline-block">
        <ExpandedStoryEstimate story={story}
          onEdit={(newAttributes) => editStory(story.id, newAttributes)}
        />
        
        <ExpandedStoryType story={story}
          onEdit={(newAttributes) => editStory(story.id, newAttributes)}
        />
      </div>
    </div>
  );
};

ExpandedStory.propTypes = {
  story: PropTypes.object.isRequired
};

export default connect(
  null,
  { editStory }
)(ExpandedStory);
