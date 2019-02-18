import React from 'react';
import PropTypes from 'prop-types';
import NotesList from '../note/NotesList';

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
      <div>
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
      </div>
    );
  }

  render() {
    const { story, onDelete } = this.props;

    return (
      <div className="Story__section">
        <div className="Story__section-title">
          {I18n.translate('story.notes')}
        </div>
        <div className="Story__section__notes">
          <NotesList
            onDelete={onDelete}
            notes={story.notes}
          />

          { this.notesForm() }
        </div>
      </div>
    );
  }
};

ExpandedStoryNotes.propTypes = {
  story: PropTypes.object.isRequired,
  onCreate: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired
};

export default ExpandedStoryNotes;
