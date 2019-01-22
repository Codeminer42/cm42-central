import React from 'react';
import PropTypes from 'prop-types';

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
  task: PropTypes.shape({
    id: PropTypes.number,
    done: PropTypes.bool,
    name: PropTypes.string
  }),
  onToggle: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired
};

export default Task;
