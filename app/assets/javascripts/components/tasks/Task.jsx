import React from 'react';
import Checkbox from 'components/forms/Checkbox';

const Task = ({ task, handleUpdate, handleDelete, disabled }) => {
  const handleChange = event => {
    event.stopPropagation();
    handleUpdate({ task, done: event.target.checked });
  };

  const handleDeleteClick = () => handleDelete(task);

  const renderDelete = () => (
    <span
      onClick={() => handleDelete(task)}
      title={I18n.t('delete')}
      className="delete-btn"
      key={task.get('id')}
    >
      {I18n.t('delete')}
    </span>
  );

  return (
    <div className="task">
      <Checkbox
        name="done"
        disabled={disabled}
        onChange={handleChange}
        checked={task.get('done')}
        label={[task.get('name'), !disabled && renderDelete()]}
      />
    </div>
  );
};

export default Task;
