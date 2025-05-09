import React, { useRef } from 'react';
import AsyncForm from 'components/forms/AsyncForm';

const NoteForm = ({ note, onSubmit }) => {
  const inputRef = useRef(null);

  const getFormData = () => ({
    note,
    newValue: inputRef.current.value,
  });

  return (
    <AsyncForm getFormData={getFormData} onSubmit={onSubmit}>
      {({ loading, handleSubmit }) => (
        <div className="note_form clearfix">
          <textarea
            name="note"
            defaultValue=""
            disabled={loading}
            className="form-control note-textarea"
            ref={inputRef}
          />
          <button
            type="submit"
            className={`add-note btn btn-default btn-xs ${loading ? 'icons-throbber saving' : ''}`}
            disabled={loading}
            onClick={handleSubmit}
          >
            {I18n.t('add note')}
          </button>
        </div>
      )}
    </AsyncForm>
  );
};

export default NoteForm;
