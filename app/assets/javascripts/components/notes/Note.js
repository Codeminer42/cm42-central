import React from 'react';

const Note = ({ note, disabled, handleDelete }) => {

  const _handleDelete = () => {
    handleDelete(note)
  }

  const parseNote = () => {
    return ({
      __html: window.md.makeHtml(note.escape('note'))
    });
  }
  return (
    <div className='note'>
      <div dangerouslySetInnerHTML={parseNote(note)}></div>
      <div className='note_meta'>
        <span className='user'> { note.attributes.user_name } </span> -
        <span className='created_at'> { note.attributes.created_at } </span>
        {!disabled && <span>
          - <span
            onClick={_handleDelete}
            title={I18n.t('delete')}
            className='delete-btn delete-note'
            data-testid='delete-btn'
          >
            {I18n.t('delete')}
          </span>
        </span>}
      </div>
    </div>
  );
}

export default Note;
