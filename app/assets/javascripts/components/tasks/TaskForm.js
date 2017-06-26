import React from 'react';

class TaskForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = { loading: false, value: '' };

    this._handleSubmit = this._handleSubmit.bind(this);
    this._handleChange = this._handleChange.bind(this);
  }

  _handleSubmit(ev) {
    ev.preventDefault();
    this.setState({ loading: true });
    this.props.onSubmit({
      task: this.props.task,
      taskName: this.state.value
    }).catch(() =>
      this.setState({ loading: false })
    );
  }

  _handleChange(ev) {
    this.setState({ value: ev.target.value });
  }

  render() {
    const { loading, value } = this.state;
    return (
      <div className='task_form clearfix'>
        <input
          name='task'
          value={value}
          disabled={loading}
          className='form-control input-sm input-task'
          onChange={this._handleChange}
          ref={(input) => { this.input = input }}
        />
        <button
          type='submit'
          className={`add-task btn btn-default btn-xs ${loading ? 'icons-throbber saving' : ''}`}
          disabled={loading}
          onClick={this._handleSubmit}
        >
          { I18n.t('add task') }
        </button>
      </div>
    );
  }
}

export default TaskForm;
