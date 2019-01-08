import React from 'react';
import PropTypes from 'prop-types';
import ExpandedStoryHistoryLocation from './ExpandedStoryHistoryLocation';
import ExpandedStoryControls from './ExpandedStoryControls';
import ExpandedStoryEstimate from './ExpandedStoryEstimate';
import ExpandedStoryType from './ExpandedStoryType';
import ExpandedStoryDescription from './ExpandedStoryDescription';
import ExpandedStoryNotes from './ExpandedStoryNotes';
import ExpandedStoryState from './ExpandedStoryState';
import ExpandedStoryTitle from './ExpandedStoryTitle';
import { deleteNote, createNote } from '../../../actions/note';
import { editStory, updateStory, deleteStory } from '../../../actions/story';
import { connect } from 'react-redux';
import * as Story from '../../../models/beta/story';

export const ExpandedStory = ({
  story,
  onToggle,
  editStory,
  updateStory,
  project,
  deleteNote,
  createNote
}) => {

  return (
    <div className="Story Story--expanded">
      <ExpandedStoryControls
        onCancel={onToggle}
        onSave={() => updateStory(story, project.id)}
        onDelete={() => deleteStory(story.id, project.id)}
        readOnly={Story.isAccepted(story)}
      />
      <ExpandedStoryHistoryLocation story={story} />

      <ExpandedStoryTitle
        story={story}
        onEdit={(newTitle) => editStory(story.id, { title: newTitle })}
      />

      <div className="Story__flex">
        <ExpandedStoryEstimate story={story}
          onEdit={(newAttributes) => editStory(story.id, newAttributes)}
        />

        <ExpandedStoryType story={story}
          onEdit={(newAttributes) => editStory(story.id, newAttributes)}
        />
      </div>

      <ExpandedStoryState
        story={story}
        onEdit={(newAttributes) => editStory(story.id, newAttributes)}
      />

      <ExpandedStoryDescription
        story={story}
        onEdit={(newAttributes) => editStory(story.id, newAttributes)}
      />

      <ExpandedStoryNotes
        story={story}
        projectId={project.id}
        onDelete={(noteId) => deleteNote(project.id, story.id, noteId)}
        onCreate={(note) => createNote(project.id, story.id, { note })}
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
    deleteStory,
    deleteNote,
    createNote
  }
)(ExpandedStory);
