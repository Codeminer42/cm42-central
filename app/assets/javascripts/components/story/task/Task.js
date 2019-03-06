import React from 'react';
import PropTypes from 'prop-types';
import { taskPropTypesShape } from '../../../models/beta/task';

const Task = ({ task, onDelete, onToggle }) => (
  <div className="Story__task">
    <label>
      <input
        type='checkbox'
        defaultChecked={task.done}
        onClick={onToggle}
      />
      {task.name}
    </label>
    <span
      title={I18n.t('delete')}
      className='delete-btn'
      onClick={onDelete}
    >
      { I18n.t('delete') }
    </span>
  </div>
);

Task.propTypes = {
  task: taskPropTypesShape.isRequired,
  onToggle: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired
};

export default Task;
