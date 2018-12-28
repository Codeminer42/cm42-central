import React from 'react';
import PropTypes from 'prop-types';
import Markdown from '../../Markdown';
import { deleteNote } from '../../../actions/note';
import { connect } from 'react-redux';

class ExpandedStoryNotes extends React.Component {
  render() {
    const { story, projectId, deleteNote } = this.props;
    return (
      <div className="Story__section">
        <div className="Story__section-title">
          {I18n.translate('story.notes')}
        </div>

        <NotesList
          onDelete={(noteId) => deleteNote(projectId, story.id, noteId)}
          notes={story.notes}
        />
      </div>
    );
  }
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
    <Markdown source={note.note || ''} />

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
  story: PropTypes.object.isRequired
};

export default connect(
  null,
  { deleteNote }
)(ExpandedStoryNotes);
