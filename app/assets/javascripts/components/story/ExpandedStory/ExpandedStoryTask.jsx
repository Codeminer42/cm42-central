import React, { useState } from 'react';
import TasksList from '../task/TasksList';
import PropTypes from 'prop-types';
import { editingStoryPropTypesShape } from '../../../models/beta/story';
import ExpandedStorySection from './ExpandedStorySection';

const ExpandedStoryTask = ({ story, onToggle, onDelete, onSave, disabled }) => {
  const [task, setTask] = useState('');

  const onInputChange = (e) => {
    setTask(e.target.value);
  };

  const onHandleSubmit = () => {
    onSave(task);
    setTask('');
  };

  const hasAnEmptyValue = () => {
    return !task.trim();
  };

  if (disabled && !story.tasks.length) return null;

  return (
    <ExpandedStorySection title={I18n.t('story.tasks')} identifier="tasks">
      <div className="list-task">
        <TasksList tasks={story.tasks} onDelete={onDelete} onToggle={onToggle} disabled={disabled} />
      </div>

      {!disabled && (
        <div className="task-form">
          <input value={task} className="form-control input-sm" onChange={onInputChange} />
          <button
            type="submit"
            className="add-task-button"
            onClick={onHandleSubmit}
            disabled={hasAnEmptyValue()}
          >
            {I18n.t('add task')}
          </button>
        </div>
      )}
    </ExpandedStorySection>
  );
};

ExpandedStoryTask.propTypes = {
  story: editingStoryPropTypesShape.isRequired,
  onToggle: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  disabled: PropTypes.bool.isRequired,
};

export default ExpandedStoryTask;
