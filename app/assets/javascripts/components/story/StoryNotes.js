import React from 'react';
import Note from 'components/notes/Note';
import NoteForm from 'components/notes/NoteForm'

class StoryNotes extends React.Component {
  constructor() {
    super();

    this.renderNotes = this.renderNotes.bind(this);
    this.renderStoryNotes = this.renderStoryNotes.bind(this);
  }

  render() {
    return this.props.isNew ? null : this.renderStoryNotes();
  }

  renderStoryNotes() {
    const { notes, disabled } = this.props;
    return (
      <div className="form-group">
        <label htmlFor="notes"> { I18n.t('story.notes') } </label>
        <div className="notelist">
          { this.renderNotes() }
        </div>
        { !disabled && <NoteForm note={notes.last()} /> }
      </div>
    );
  }

  renderNotes() {
    const { notes, disabled, handleDelete } = this.props;
    const noteList = (disabled) ? notes : notes.slice(0, -1);
    return noteList.map((note, i) =>
      <Note
        note={note}
        disabled={disabled}
        handleDelete={handleDelete}
        key={i}
      />
    );
  }

  componentWillMount() {
    const { notes, disabled, isNew } = this.props;
    if (disabled || isNew) return;

    const lastNote = notes.last();
    if (lastNote && lastNote.isNew()) return;

    notes.add({});
  }
}

export default StoryNotes;
