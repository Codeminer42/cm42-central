import React from 'react';
import Task from './Task'
import PropTypes from 'prop-types';
import { taskPropTypesShape } from '../../../models/beta/task';

const TasksList = ({ tasks, onDelete, onToggle }) => (
  <div>
    {
      tasks.map((task) => (
        <Task
          key={task.id}
          task={task}
          onDelete={() => onDelete(task.id)}
          onToggle={() => onToggle(task, { done: !task.done })}
        />
      ))
    }
  </div>
)

TasksList.propTypes = {
  tasks: PropTypes.arrayOf(taskPropTypesShape.isRequired),
  onDelete: PropTypes.func.isRequired,
  onToggle: PropTypes.func.isRequired
};

export default TasksList;
