import React, { Component } from 'react';
import TasksList from '../task/TasksList';
import PropTypes from 'prop-types';
import { editingStoryPropTypesShape } from '../../../models/beta/story';
import ExpandedStorySection from './ExpandedStorySection';

class ExpandedStoryTask extends Component {
  constructor(props) {
    super(props);
    this.state = {
      task: ''
    };
    this.onInputChange = this.onInputChange.bind(this);
    this.onHandleSubmit = this.onHandleSubmit.bind(this);
  }

  onInputChange(e) {
    this.setState({
      task: e.target.value
    });
  }

  onHandleSubmit() {
    const { onSave } = this.props;

    const task = this.state.task;
    onSave(task);
    this.setState({
      task: ''
    });
  }

  hasAnEmptyValue() {
    return !this.state.task.trim()
  }

  render() {
    const { story, onToggle, onDelete, disabled } = this.props;

    if (disabled && !story.tasks.length) return null;

    return (
      <ExpandedStorySection
        title={I18n.t('story.tasks')}
        identifier="tasks"
      >
        <div className="list-task" >
          <TasksList
            tasks={story.tasks}
            onDelete={onDelete}
            onToggle={onToggle}
            disabled={disabled}
          />
        </div>

        {
          !disabled && (
            <div className="task-form">
              <input
                value={this.state.task}
                className="form-control input-sm"
                onChange={this.onInputChange}
              />
              <button
                type='submit'
                className='add-task-button'
                onClick={this.onHandleSubmit}
                disabled={this.hasAnEmptyValue()}
              >
                {I18n.t('add task')}
              </button>
            </div>
          )
        }
      </ExpandedStorySection>
    );
  }
};

ExpandedStoryTask.propTypes = {
  story: editingStoryPropTypesShape.isRequired,
  onToggle: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  disabled: PropTypes.bool.isRequired
};

export default ExpandedStoryTask;
