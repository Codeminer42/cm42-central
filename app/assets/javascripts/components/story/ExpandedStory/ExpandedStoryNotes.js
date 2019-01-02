import React from 'react';
import PropTypes from 'prop-types';
import Markdown from '../../Markdown';

class ExpandedStoryNotes extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      value: ''
    }

    this.handleChange = this.handleChange.bind(this);
    this.handleSave = this.handleSave.bind(this);
  }

  handleChange(event) {
    this.setState({ value: event.target.value })
  }

  handleSave() {
    const { onCreate } = this.props;

    onCreate(this.state.value);
    this.setState({ value: '' });
  }

  notesForm() {
    return (
      <div>
        <textarea
          className="form-control input-sm create-note-text"
          value={this.state.value}
          onChange={(event) => this.handleChange(event)}
        />

        <div className='create-note-button'>
          <input
            type='button'
            value={I18n.t('add note')}
            onClick={() => this.handleSave()}
          />
        </div>
      </div>
    );
  };

  render() {
    const { story, onDelete } = this.props;

    return (
      <div className="Story__section">
        <div className="Story__section-title">
          {I18n.translate('story.notes')}
        </div>
        <div className="Story__section__notes">
          <NotesList
            onDelete={(noteId) => onDelete(noteId)}
            notes={story.notes}
          />

          { this.notesForm() }
        </div>
      </div>
    );
  };
};

const NotesList = ({ notes, onDelete }) => (
  <div>
    {
      notes.map(note => (
        <Note
          key={note.id}
          note={note}
          onDelete={() => onDelete(note.id)}
        />
      ))
    }
  </div>
);

const Note = ({ note, onDelete }) => (
  <div className='markdown-wrapper'>
    <Markdown source={note.note} />

    <div className='markdown-wrapper__text-right'>
      {`${note.userName} - ${note.createdAt} `}
      <span
        className='delete-note-button'
        onClick={onDelete}
      >
        {I18n.t('delete')}
      </span>
    </div>
  </div>
);

ExpandedStoryNotes.propTypes = {
  story: PropTypes.object.isRequired,
  onCreate: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired
};

export default ExpandedStoryNotes;
