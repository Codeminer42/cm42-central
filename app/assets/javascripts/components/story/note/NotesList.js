import React, { Fragment } from 'react';
import Note from './Note';
import PropTypes from 'prop-types';
import { notePropTypesShape } from '../../../models/beta/note';

const NotesList = ({ notes, onDelete, disabled }) => (
  <Fragment>
    {
      notes.map(note => (
        <Note
          key={note.id}
          note={note}
          onDelete={() => onDelete(note.id)}
          disabled={disabled}
        />
      ))
    }
  </Fragment>
);

NotesList.propTypes = {
  notes: PropTypes.arrayOf(notePropTypesShape.isRequired),
  onDelete: PropTypes.func.isRequired,
  disabled: PropTypes.bool.isRequired
};

export default NotesList;
