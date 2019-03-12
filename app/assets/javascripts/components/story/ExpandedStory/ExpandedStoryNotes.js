import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import NotesList from '../note/NotesList';
import { editingStoryPropTypesShape } from '../../../models/beta/story';
import ExpandedStorySection from './ExpandedStorySection';

class ExpandedStoryNotes extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      value: ''
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSave = this.handleSave.bind(this);
  };

  handleChange(event) {
    this.setState({ value: event.target.value })
  }

  handleSave() {
    const { onCreate } = this.props;

    onCreate(this.state.value);
    this.setState({ value: '' });
  }

  hasAnEmptyValue() {
    return !this.state.value.trim()
  }

  notesForm() {
    return (
      <Fragment>
        <textarea
          className="form-control input-sm create-note-text"
          value={this.state.value}
          onChange={this.handleChange}
        />

        <div className='create-note-button'>
          <input
            type='button'
            value={I18n.t('add note')}
            onClick={this.handleSave}
            disabled={this.hasAnEmptyValue()}
          />
        </div>
      </Fragment>
    );
  }

  render() {
    const { story, onDelete } = this.props;

    return (
      <ExpandedStorySection
        title={I18n.t('story.notes')}
        identifier="notes"
      >
        <NotesList
          onDelete={onDelete}
          notes={story.notes}
        />

        {this.notesForm()}
      </ExpandedStorySection>
    );
  }
};

ExpandedStoryNotes.propTypes = {
  story: editingStoryPropTypesShape.isRequired,
  onCreate: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired
};

export default ExpandedStoryNotes;
