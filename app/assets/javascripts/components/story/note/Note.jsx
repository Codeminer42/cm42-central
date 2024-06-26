import React from 'react';
import Markdown from '../../Markdown';
import PropTypes from 'prop-types';
import NotePropTypes from '../../shapes/note';

const Note = ({ note, onDelete, disabled }) => (
  <div className="markdown-wrapper">
    <Markdown source={note.note} />

    <div className="markdown-wrapper__text-right">
      {`${note.userName} - ${note.createdAt} `}
      {!disabled && (
        <span
          className="delete-note-button"
          onClick={onDelete}
          children={I18n.t('delete')}
        />
      )}
    </div>
  </div>
);

Note.propTypes = {
  note: NotePropTypes.isRequired,
  onDelete: PropTypes.func.isRequired,
  disabled: PropTypes.bool.isRequired,
};

export default Note;
