import React from 'react';

class NoteForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = { loading: false };

    this._handleSubmit = this._handleSubmit.bind(this);
  }

  _handleSubmit(event) {
    event.preventDefault();
    this.setState({ loading: true });
    this.props.onSubmit({
      note: this.props.note,
      newValue: this.input.value
    }).catch(() =>
      this.setState({ loading: false })
    );
  }

  render() {
    const { loading } = this.state;
    return (
      <div className='note_form clearfix'>
        <textarea
          name='note'
          disabled={loading}
          className='form-control note-textarea'
          ref={(input) => { this.input = input }}
        />
        <input
          type='submit'
          className={`add-note btn btn-default btn-xs ${loading ? 'icons-throbber saving' : ''}`}
          disabled={loading}
          onClick={this._handleSubmit}
          value={ I18n.t('add note') }
        />
      </div>
    );
  }
}

export default NoteForm;
