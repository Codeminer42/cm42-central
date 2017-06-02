import React from 'react';

class NoteForm extends React.Component {
  constructor() {
    super();
    this.state = { value: '', disabled: false };

    this.handleChange = this.handleChange.bind(this);
    this.handleSave = this.handleSave.bind(this);
  }

  render() {
    const { loading, disabled } = this.state;

    return (
      <div className="note_form clearfix">
        <textarea
          name="note"
          disabled={this.disabled}
          className="form-control note-textarea"
          onChange={this.handleChange}
        />
        <input
          type="button"
          className={`add-note btn btn-default btn-xs ${loading ? 'icons-throbber saving' : ''}`}
          onClick={this.handleSave}
          value={ I18n.t('add note') }
        />
      </div>
    );
  }

  handleChange(ev) {
    const newValue = ev.target.value;
    this.props.note.set({ note: newValue });
    this.setState({ value: ev.target.value });
  }

  handleSave() {
    this.setState({ loading: true, disabled: true });
    this.props.note.save(null, {
      success: () => {
        this.setState({ loading: false, disabled: false });
        window.projectView.model.fetch();
      },
      error: this.handleSaveError
    });
  }

  handleSaveError(model, response) {
    const json = JSON.parse(response.responseText);
    this.setState({ disabled: false, loading: false });
    model.set({errors: json.note.errors});
    window.projectView.noticeSaveError(model);
  }
}

export default NoteForm;
