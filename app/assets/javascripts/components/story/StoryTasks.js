import React from 'react';
import Task from 'components/tasks/Task';

const renderTasks = ({ handleUpdate, handleDelete, tasks }) =>
  tasks.map((task) =>
    <Task
      task={task}
      handleDelete={handleDelete}
      handleUpdate={handleUpdate}
      key={task.get('id')}
    />
  );

const StoryTasks = (props) =>
  <div className="form-group">
    <label htmlFor="tasks">{ I18n.t('story.tasks') }</label>
    <div className="tasklist checkbox">
      { renderTasks(props) }
    </div>
  </div>

export default StoryTasks;
