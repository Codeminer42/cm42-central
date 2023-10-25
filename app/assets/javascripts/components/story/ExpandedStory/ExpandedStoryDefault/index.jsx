import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { addLabel, removeLabel } from '../../../../actions/labels';
import { deleteNote, createNote } from '../../../../actions/note';
import { setLoadingStory, storyFailure } from '../../../../actions/story';
import { editingStoryPropTypesShape, isNew } from '../../../../models/beta/story';
import ProjectPropTypes from '../../../shapes/project';
import { createTask, deleteTask, toggleTask } from '../../../../actions/task';
import ExpandedStoryHistoryLocation from '../ExpandedStoryHistoryLocation';
import ExpandedStoryEstimate from '../ExpandedStoryEstimate';
import ExpandedStoryType from '../ExpandedStoryType';
import ExpandedStoryDescription from '../ExpandedStoryDescription';
import ExpandedStoryNotes from '../ExpandedStoryNotes';
import ExpandedStoryState from '../ExpandedStoryState';
import ExpandedStoryTitle from '../ExpandedStoryTitle';
import ExpandedStoryLabels from '../ExpandedStoryLabels';
import ExpandedStoryTask from '../ExpandedStoryTask';
import ExpandedStoryRequestedBy from '../ExpandedStoryRequestedBy';
import ExpandedStoryOwnedBy from '../ExpandedStoryOwnedBy';

export const ExpandedStoryDefault = ({
  titleRef,
  story, users, project,
  onEdit, onClone, showHistory,
  disabled, addLabel, removeLabel,
  createNote, deleteNote,
  createTask, deleteTask, toggleTask,
  setLoadingStory, storyFailure,
}) =>
  <Fragment>
    {
      !isNew(story)
        ? <ExpandedStoryHistoryLocation
            story={story}
            onClone={() => onClone(story._editing)}
            showHistory={() => showHistory(story.id)}
          />
        : null
    }

    <ExpandedStoryTitle
      story={story}
      titleRef={titleRef}
      onEdit={(title) => onEdit({ title })}
      disabled={disabled}
    />

    <div className="Story__flex">
      <ExpandedStoryEstimate
        story={story}
        onEdit={(estimate) => onEdit({ estimate })}
        project={project}
        disabled={disabled}
      />

      <ExpandedStoryType
        story={story}
        onEdit={(storyType) => onEdit({ storyType })}
        disabled={disabled}
      />
    </div>

    <ExpandedStoryState
      story={story}
      onEdit={(state) => onEdit({ state })}
      disabled={disabled}
    />

    <ExpandedStoryRequestedBy
      story={story}
      users={users}
      onEdit={(requestedById) => onEdit({ requestedById })}
      disabled={disabled}
    />

    <ExpandedStoryOwnedBy
      story={story}
      users={users}
      onEdit={(ownedById) => onEdit({ ownedById })}
      disabled={disabled}
    />

    <ExpandedStoryLabels
      onAddLabel={(label) => addLabel(story.id, label)}
      story={story}
      projectLabels={project.labels}
      onRemoveLabel={(labelName) => removeLabel(story.id, labelName)}
      onEdit={(labels) => onEdit({ labels })}
      disabled={disabled}
    />

    <ExpandedStoryDescription
      story={story}
      onEdit={(description) => onEdit({ description })}
      disabled={disabled}
      users={users}
    />

    {
      !isNew(story) ?
        <Fragment>
          <ExpandedStoryTask
            story={story}
            onToggle={(task, status) => toggleTask(project.id, story, task, status)}
            onDelete={(taskId) => deleteTask(project.id, story.id, taskId)}
            onSave={(task) => createTask(project.id, story.id, task)}
            disabled={disabled}
          />

          <ExpandedStoryNotes
            story={story}
            projectId={project.id}
            onDelete={(noteId) => deleteNote(project.id, story.id, noteId)}
            onCreate={(note) => createNote(project.id, story.id, { note })}
            disabled={disabled}
          />
        </Fragment>
        : null
    }
  </Fragment>

ExpandedStoryDefault.propTypes = {
  story: editingStoryPropTypesShape.isRequired,
  users: PropTypes.array.isRequired,
  project: ProjectPropTypes.isRequired,
  onEdit: PropTypes.func.isRequired,
  addLabel: PropTypes.func.isRequired,
  removeLabel: PropTypes.func.isRequired,
  createNote: PropTypes.func.isRequired,
  deleteNote: PropTypes.func.isRequired,
  createTask: PropTypes.func.isRequired,
  toggleTask: PropTypes.func.isRequired,
  deleteTask: PropTypes.func.isRequired,
  setLoadingStory: PropTypes.func.isRequired,
  storyFailure: PropTypes.func.isRequired,
  onClone: PropTypes.func.isRequired,
  showHistory: PropTypes.func.isRequired,
  disabled: PropTypes.bool.isRequired
};

const mapStateToProps = ({ users }) => ({ users });

const mapDispatchToProps = {
  addLabel, removeLabel,
  createNote, deleteNote,
  createTask, toggleTask, deleteTask,
  setLoadingStory, storyFailure,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ExpandedStoryDefault);
