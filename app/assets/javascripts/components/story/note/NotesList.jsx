import React, { Fragment } from 'react';
import Note from './Note';
import PropTypes from 'prop-types';
import NotePropTypes from '../../shapes/note';

const NotesList = ({ notes, onDelete, disabled }) => (
  <Fragment>
    {notes.map(note => (
      <Note
        key={note.id}
        note={note}
        onDelete={() => onDelete(note.id)}
        disabled={disabled}
      />
    ))}
  </Fragment>
);

NotesList.propTypes = {
  notes: PropTypes.arrayOf(NotePropTypes.isRequired),
  onDelete: PropTypes.func.isRequired,
  disabled: PropTypes.bool.isRequired,
};

export default NotesList;
