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
import ExpandedStoryLabels from './ExpandedStoryLabels';
import ExpandedStoryAttachments from './ExpandedStoryAttachments';
import ExpandedStoryTask from './ExpandedStoryTask';
import ExpandedStoryRequestedBy from './ExpandedStoryRequestedBy';
import ExpandedStoryOwnedBy from './ExpandedStoryOwnedBy';
import { editStory, updateStory, deleteStory, setLoadingStory, storyFailure } from '../../../actions/story';
import { createTask, deleteTask, toggleTask } from '../../../actions/task';
import { deleteNote, createNote } from '../../../actions/note';
import { addLabel, removeLabel } from '../../../actions/labels';
import { addAttachment, removeAttachment } from '../../../actions/attachment';
import { connect } from 'react-redux';
import * as Story from '../../../models/beta/story';

export const ExpandedStory = ({
  story,
  onToggle,
  editStory,
  updateStory,
  storyFailure,
  deleteStory,
  project,
  createTask,
  deleteTask,
  toggleTask,
  users,
  deleteNote,
  createNote,
  addLabel,
  removeLabel,
  setLoadingStory,
  addAttachment,
  removeAttachment
}) => {
  const loading = story._editing.loading ? "Story__enable-loading" : "";

  return (
    <div className={`Story Story--expanded ${loading}`} >
      <div className="Story__loading"></div>
      <ExpandedStoryControls
        onCancel={onToggle}
        isDirty={story._editing._isDirty}
        onSave={() => updateStory(story, project.id)}
        onDelete={() => deleteStory(story.id, project.id)}
        readOnly={Story.isAccepted(story)}
      />
      {
        !story.isNew ?
          <ExpandedStoryHistoryLocation story={story} />
          : null
      }
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
      <div>
        <ExpandedStoryRequestedBy
          story={story}
          users={users}
          onEdit={(userId) => editStory(story.id, { requestedById: userId })}
        />

        <ExpandedStoryOwnedBy
          story={story}
          users={users}
          onEdit={(userId) => editStory(story.id, { ownedById: userId })}
        />
      </div>
      <ExpandedStoryState
        story={story}
        onEdit={(newAttributes) => editStory(story.id, newAttributes)}
      />

      <ExpandedStoryLabels
        onAddLabel={(label) => addLabel(story.id, label)}
        story={story}
        projectLabels={project.labels}
        onRemoveLabel={(labelName) => removeLabel(story.id, labelName)}
        onEdit={(value) => editStory(story.id, { labels: value })}
      />

      <ExpandedStoryDescription
        story={story}
        onEdit={(newAttributes) => editStory(story.id, newAttributes)}
      />

      {
        !story.isNew ?
          <div>
            <ExpandedStoryAttachments
              story={story}
              onFailure={(error) => storyFailure(story.id, error)}
              startLoading={() => setLoadingStory(story.id)}
              onAdd={(attachment) => addAttachment(story.id, project.id, attachment)}
              onDelete={(documentId) => removeAttachment(story.id, documentId)}
            />

            <ExpandedStoryNotes
              story={story}
              projectId={project.id}
              onDelete={(noteId) => deleteNote(project.id, story.id, noteId)}
              onCreate={(note) => createNote(project.id, story.id, { note })}
            />

            <ExpandedStoryTask
              story={story}
              onToggle={(task, status) => toggleTask(project.id, story, task, status)}
              onDelete={(taskId) => deleteTask(project.id, story.id, taskId)}
              onSave={(task) => createTask(project.id, story.id, task)}
            />
          </div>
          : null
      }
    </div >
  );
};

ExpandedStory.propTypes = {
  story: PropTypes.object.isRequired
};

const mapStateToProps = ({ project, users }) => ({ project, users });

export default connect(
  mapStateToProps,
  {
    editStory,
    updateStory,
    storyFailure,
    createTask,
    deleteTask,
    toggleTask,
    deleteStory,
    deleteNote,
    createNote,
    addLabel,
    removeLabel,
    setLoadingStory,
    addAttachment,
    removeAttachment
  }
)(ExpandedStory);
