import React from 'react';
import AsyncForm from 'components/forms/AsyncForm';

class TaskForm extends React.Component {
  constructor(props) {
    super(props);
    this._getFormData = this._getFormData.bind(this);
  }

  _getFormData() {
    return {
      task: this.props.task,
      taskName: this.input.value
    };
  }

  render() {
    return (
      <AsyncForm
        getFormData={this._getFormData}
        onSubmit={this.props.onSubmit}
      >
        {
          ({loading, handleSubmit}) => (
            <div className='task_form clearfix'>
              <input
                name='task'
                defaultValue=''
                disabled={loading}
                className='form-control input-sm input-task'
                ref={(input) => { this.input = input }}
              />
              <button
                type='submit'
                className={`add-task btn btn-default btn-xs ${loading ? 'icons-throbber saving' : ''}`}
                disabled={loading}
                onClick={handleSubmit}
              >
                { I18n.t('add task') }
              </button>
            </div>
          )
        }
      </AsyncForm>
    );
  }
}

export default TaskForm;
