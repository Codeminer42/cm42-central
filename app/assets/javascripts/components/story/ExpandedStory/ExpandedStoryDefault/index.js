import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { addLabel, removeLabel } from '../../../../actions/labels';
import { deleteNote, createNote } from '../../../../actions/note';
import { addAttachment, removeAttachment } from '../../../../actions/attachment';
import { setLoadingStory, storyFailure } from '../../../../actions/story';
import { editingStoryPropTypesShape } from '../../../../models/beta/story';
import { projectPropTypesShape } from '../../../../models/beta/project';
import { createTask, deleteTask, toggleTask } from '../../../../actions/task';
import ExpandedStoryHistoryLocation from '../ExpandedStoryHistoryLocation';
import ExpandedStoryEstimate from '../ExpandedStoryEstimate';
import ExpandedStoryType from '../ExpandedStoryType';
import ExpandedStoryDescription from '../ExpandedStoryDescription';
import ExpandedStoryNotes from '../ExpandedStoryNotes';
import ExpandedStoryState from '../ExpandedStoryState';
import ExpandedStoryTitle from '../ExpandedStoryTitle';
import ExpandedStoryLabels from '../ExpandedStoryLabels';
import ExpandedStoryAttachments from '../ExpandedStoryAttachments';
import ExpandedStoryTask from '../ExpandedStoryTask';
import ExpandedStoryRequestedBy from '../ExpandedStoryRequestedBy';
import ExpandedStoryOwnedBy from '../ExpandedStoryOwnedBy';

export const ExpandedStoryDefault = ({
  titleRef,
  story, users, project,
  onEdit, isNew,
  addLabel, removeLabel,
  createNote, deleteNote,
  createTask, deleteTask, toggleTask,
  setLoadingStory, storyFailure,
  addAttachment, removeAttachment
}) =>
  <Fragment>
    {
      !isNew
        ? <ExpandedStoryHistoryLocation story={story} />
        : null
    }

    <ExpandedStoryTitle
      story={story}
      titleRef={titleRef}
      onEdit={(title) => onEdit({ title })}
    />

    <div className="Story__flex">
      <ExpandedStoryEstimate story={story}
        onEdit={(estimate) => onEdit({ estimate })}
        project={project}
      />

      <ExpandedStoryType story={story}
        onEdit={(storyType) => onEdit({ storyType })}
      />
    </div>

    <ExpandedStoryState
      story={story}
      onEdit={(state) => onEdit({ state })}
    />

    <ExpandedStoryRequestedBy
      story={story}
      users={users}
      onEdit={(requestedById) => onEdit({ requestedById })}
    />

    <ExpandedStoryOwnedBy
      story={story}
      users={users}
      onEdit={(ownedById) => onEdit({ ownedById })}
    />

    <ExpandedStoryLabels
      onAddLabel={(label) => addLabel(story.id, label)}
      story={story}
      projectLabels={project.labels}
      onRemoveLabel={(labelName) => removeLabel(story.id, labelName)}
      onEdit={(labels) => onEdit({ labels })}
    />

    <ExpandedStoryDescription
      story={story}
      onEdit={(description) => onEdit({ description })}
    />

    {
      !isNew ?
        <Fragment>
          <ExpandedStoryTask
            story={story}
            onToggle={(task, status) => toggleTask(project.id, story, task, status)}
            onDelete={(taskId) => deleteTask(project.id, story.id, taskId)}
            onSave={(task) => createTask(project.id, story.id, task)}
          />

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
        </Fragment>
        : null
    }
  </Fragment>

ExpandedStoryDefault.propTypes = {
  story: editingStoryPropTypesShape.isRequired,
  users: PropTypes.array.isRequired,
  project: projectPropTypesShape.isRequired,
  isNew: PropTypes.bool.isRequired,
  onEdit: PropTypes.func.isRequired,
  addLabel: PropTypes.func.isRequired,
  removeLabel: PropTypes.func.isRequired,
  createNote: PropTypes.func.isRequired,
  deleteNote: PropTypes.func.isRequired,
  createTask: PropTypes.func.isRequired,
  toggleTask: PropTypes.func.isRequired,
  deleteTask: PropTypes.func.isRequired,
  addAttachment: PropTypes.func.isRequired,
  removeAttachment: PropTypes.func.isRequired,
  setLoadingStory: PropTypes.func.isRequired,
  storyFailure: PropTypes.func.isRequired,
};

const mapStateToProps = ({ users }) => ({ users });

const mapDispatchToProps = {
  addLabel, removeLabel,
  createNote, deleteNote,
  createTask, toggleTask, deleteTask,
  addAttachment, removeAttachment,
  setLoadingStory, storyFailure,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ExpandedStoryDefault);