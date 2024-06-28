import React from 'react';
import Note from 'components/notes/Note';

const renderNotes = ({ notes, disabled, onDelete }) =>
  notes.map(note => (
    <Note
      note={note}
      disabled={disabled}
      onDelete={onDelete}
      key={note.get('id')}
    />
  ));

const StoryNotes = props => (
  <div className="form-group">
    <label htmlFor="note">{I18n.t('story.notes')}</label>
    <div className="notelist">{renderNotes(props)}</div>
  </div>
);

export default StoryNotes;
