import React, { useRef } from 'react';
import AsyncForm from 'components/forms/AsyncForm';

const TaskForm = ({ task, onSubmit }) => {
  const inputRef = useRef(null);

  const getFormData = () => ({
    task,
    taskName: inputRef.current.value,
  });

  return (
    <AsyncForm getFormData={getFormData} onSubmit={onSubmit}>
      {({ loading, handleSubmit }) => (
        <div className="task_form clearfix">
          <input
            name="task"
            defaultValue=""
            disabled={loading}
            className="form-control input-sm input-task"
            ref={inputRef}
          />
          <button
            type="submit"
            className={`add-task btn btn-default btn-xs ${loading ? 'icons-throbber saving' : ''}`}
            disabled={loading}
            onClick={handleSubmit}
          >
            {I18n.t('add task')}
          </button>
        </div>
      )}
    </AsyncForm>
  );
};

export default TaskForm;
