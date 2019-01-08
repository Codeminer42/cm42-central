import React from 'react';
import Markdown from '../../Markdown';
import PropTypes from 'prop-types';

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

Note.propTypes = {
  note: PropTypes.object.isRequired,
  onDelete: PropTypes.func.isRequired
};

export default Note;
