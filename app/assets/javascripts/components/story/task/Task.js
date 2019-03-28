import React from 'react';
import PropTypes from 'prop-types';
import { taskPropTypesShape } from '../../../models/beta/task';

const Task = ({ task, onDelete, onToggle, disabled }) => (
  <div className="task">
    <label>
      <input
        type='checkbox'
        defaultChecked={task.done}
        onClick={onToggle}
        disabled={disabled}
      />
      {task.name}
    </label>
    {
      !disabled &&
        <span
          title={I18n.t('delete')}
          className='delete-btn'
          onClick={onDelete}
        >
          { I18n.t('delete') }
        </span>
    }
  </div>
);

Task.propTypes = {
  task: taskPropTypesShape.isRequired,
  onToggle: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  disabled: PropTypes.bool.isRequired
};

export default Task;
