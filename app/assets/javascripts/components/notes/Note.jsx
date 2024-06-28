import React, { useMemo } from 'react';
const Note = ({ note, disabled, onDelete }) => {
  const handleDelete = () => {
    onDelete(note);
  };

  const parseNote = useMemo(() => {
    return {
      __html: window.md.makeHtml(note.escape('note')),
    };
  }, [note.note]);

  return (
    <div className="note">
      <div dangerouslySetInnerHTML={parseNote}></div>
      <div className="note_meta">
        <span className="user"> {note.attributes.user_name} </span> -
        <span className="created_at"> {note.attributes.created_at} </span>
        {!disabled && (
          <span>
            -{' '}
            <button
              onClick={handleDelete}
              title={I18n.t('delete')}
              className="delete-btn delete-note"
            >
              {I18n.t('delete')}
            </button>
          </span>
        )}
      </div>
    </div>
  );
};

export default Note;
