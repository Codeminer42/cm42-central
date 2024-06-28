import React from 'react';
import PropTypes from 'prop-types';
import TaskPropTypes from '../../shapes/task';

const Task = ({ task, onDelete, onToggle, disabled }) => (
  <div className="task">
    <label>
      <input
        type="checkbox"
        defaultChecked={task.done}
        onClick={onToggle}
        disabled={disabled}
      />
      {task.name}
    </label>
    {!disabled && (
      <span
        title={I18n.t('delete')}
        className="delete-btn"
        onClick={onDelete}
        children={I18n.t('delete')}
      />
    )}
  </div>
);

Task.propTypes = {
  task: TaskPropTypes.isRequired,
  onToggle: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  disabled: PropTypes.bool.isRequired,
};

export default Task;
