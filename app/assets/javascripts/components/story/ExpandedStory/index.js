import React from 'react';
import PropTypes from 'prop-types';
import ExpandedStoryHistoryLocation from './ExpandedStoryHistoryLocation';
import ExpandedStoryControls from './ExpandedStoryControls';
import ExpandedStoryEstimate from './ExpandedStoryEstimate';
import ExpandedStoryType from './ExpandedStoryType';
import ExpandedStoryDescription from './ExpandedStoryDescription';
import { editStory, updateStory, deleteStory } from '../../../actions/story';
import { connect } from 'react-redux';
import * as Story from '../../../models/beta/story';

export const ExpandedStory = ({ story, onToggle, editStory, updateStory, project, deleteStory }) => {
  return (
    <div className="Story Story--expanded">
      <ExpandedStoryControls
        onCancel={onToggle}
        onSave={() => updateStory(story, project.id)}
        onDelete={() => deleteStory(story.id, project.id)}
        readOnly={Story.isAccepted(story)}
      />

      <ExpandedStoryHistoryLocation story={story} />
      <div className="Story__flex">
        <ExpandedStoryEstimate story={story}
          onEdit={(newAttributes) => editStory(story.id, newAttributes)}
        />

        <ExpandedStoryType story={story}
          onEdit={(newAttributes) => editStory(story.id, newAttributes)}
        />
      </div>

      <ExpandedStoryDescription
        story={story}
        onEdit={(newAttributes) => editStory(story.id, newAttributes)}
      />
    </div>
  );
};

ExpandedStory.propTypes = {
  story: PropTypes.object.isRequired
};

const mapStateToProps = ({ project }) => ({ project });

export default connect(
  mapStateToProps,
  {
    editStory,
    updateStory,
    deleteStory
  }
)(ExpandedStory);
