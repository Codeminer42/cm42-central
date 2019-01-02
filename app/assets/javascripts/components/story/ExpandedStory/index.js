import React from 'react';
import PropTypes from 'prop-types';
import ExpandedStoryHistoryLocation from './ExpandedStoryHistoryLocation';
import ExpandedStoryControls from './ExpandedStoryControls';
import ExpandedStoryEstimate from './ExpandedStoryEstimate';
import ExpandedStoryType from './ExpandedStoryType';
import ExpandedStoryDescription from './ExpandedStoryDescription';
import ExpandedStoryNotes from './ExpandedStoryNotes';
import { editStory, updateStory } from '../../../actions/story';
import { deleteNote, createNote } from '../../../actions/note';
import { connect } from 'react-redux';

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
    deleteNote,
    createNote
  }
)(ExpandedStory);
