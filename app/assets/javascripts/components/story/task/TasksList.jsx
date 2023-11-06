import React, { Fragment } from 'react';
import Task from './Task';
import PropTypes from 'prop-types';
import TaskPropTypes from '../../shapes/task';

const TasksList = ({ tasks, onDelete, onToggle, disabled }) => (
  <Fragment>
    {tasks.map(task => (
      <Task
        key={task.id}
        task={task}
        onDelete={() => onDelete(task.id)}
        onToggle={() => onToggle(task, { done: !task.done })}
        disabled={disabled}
      />
    ))}
  </Fragment>
);

TasksList.propTypes = {
  tasks: PropTypes.arrayOf(TaskPropTypes.isRequired),
  onDelete: PropTypes.func.isRequired,
  onToggle: PropTypes.func.isRequired,
  disabled: PropTypes.bool.isRequired,
};

export default TasksList;
