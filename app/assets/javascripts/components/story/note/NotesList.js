import React, { Fragment } from 'react';
import Note from './Note';
import PropTypes from 'prop-types';
import { notePropTypesShape } from '../../../models/beta/note';

const NotesList = ({ notes, onDelete }) => (
  <Fragment>
    {
      notes.map(note => (
        <Note
          key={note.id}
          note={note}
          onDelete={() => onDelete(note.id)}
        />
      ))
    }
  </Fragment>
);

NotesList.propTypes = {
  notes: PropTypes.arrayOf(notePropTypesShape.isRequired),
  onDelete: PropTypes.func.isRequired
};

export default NotesList;
