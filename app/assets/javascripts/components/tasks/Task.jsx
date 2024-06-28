import React from 'react';
import Checkbox from 'components/forms/Checkbox';

class Task extends React.Component {
  constructor(props) {
    super(props);
    this.state = { done: props.task.get('done') };

    this._handleChange = this._handleChange.bind(this);
    this._handleDelete = this._handleDelete.bind(this);
  }

  _handleChange(event) {
    event.stopPropagation();
    const { handleUpdate, task } = this.props;
    handleUpdate({ task, done: event.target.checked });
  }

  _handleDelete() {
    const { handleDelete, task } = this.props;
    handleDelete(task);
  }

  renderDelete() {
    return (
      <span
        onClick={this._handleDelete}
        title={I18n.t('delete')}
        className="delete-btn"
        key={this.props.task.get('id')}
      >
        {I18n.t('delete')}
      </span>
    );
  }

  render() {
    const { task, disabled } = this.props;
    return (
      <div className="task">
        <Checkbox
          name="done"
          disabled={disabled}
          onChange={this._handleChange}
          checked={task.get('done')}
          label={[task.get('name'), !disabled && this.renderDelete()]}
        />
      </div>
    );
  }
}

export default Task;
