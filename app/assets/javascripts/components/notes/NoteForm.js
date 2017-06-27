import React from 'react';
import AsyncForm from 'components/forms/AsyncForm';

class NoteForm extends React.Component {
  constructor(props) {
    super(props);
    this._getFormData = this._getFormData.bind(this);
  }

  _getFormData() {
    return {
      note: this.props.note,
      newValue: this.input.value
    };
  }

  render() {
    return (
      <AsyncForm
        getFormData={this._getFormData}
        onSubmit={this.props.onSubmit}
      >
        {
          ({loading, handleSubmit}) => (
            <div className='note_form clearfix'>
              <textarea
                name='note'
                defaultValue=''
                disabled={loading}
                className='form-control note-textarea'
                ref={(input) => { this.input = input }}
              />
              <button
                type='submit'
                className={`add-note btn btn-default btn-xs ${loading ? 'icons-throbber saving' : ''}`}
                disabled={loading}
                onClick={handleSubmit}
              >
                { I18n.t('add note') }
              </button>
            </div>
          )
        }
      </AsyncForm>
    );
  }
}

export default NoteForm;
