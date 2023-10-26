import React, { useState } from 'react';
import PropTypes from 'prop-types';
import NotesList from '../note/NotesList';
import { editingStoryPropTypesShape } from '../../../models/beta/story';
import ExpandedStorySection from './ExpandedStorySection';

const ExpandedStoryNotes = ({ story, onCreate, onDelete, disabled }) => {
  const [value, setValue] = useState('');

  const handleChange = (event) => {
    setValue(event.target.value);
  };

  const handleSave = () => {
    onCreate(value);
    setValue('');
  };

  const hasAnEmptyValue = () => {
    return !value.trim();
  };

  const notesForm = () => (
    <>
      <textarea
        className="form-control input-sm create-note-text"
        value={value}
        onChange={handleChange}
      />

      <div className='create-note-button'>
        <input
          type='button'
          value={I18n.t('add note')}
          onClick={handleSave}
          disabled={hasAnEmptyValue()}
        />
      </div>
    </>
  );

  if(disabled && !story.notes.length) return null;

  return (
    <ExpandedStorySection
      title={I18n.t('story.notes')}
      identifier="notes"
    >
      <NotesList
        notes={story.notes}
        onDelete={onDelete}
        disabled={disabled}
      />

      {!disabled && notesForm()}
    </ExpandedStorySection>
  );
};

ExpandedStoryNotes.propTypes = {
  story: editingStoryPropTypesShape.isRequired,
  onCreate: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  disabled: PropTypes.bool.isRequired
};

export default ExpandedStoryNotes;
