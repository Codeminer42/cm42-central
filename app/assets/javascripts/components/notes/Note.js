import React from 'react';

class Note extends React.Component {
  constructor(props) {
    super(props);
    this._handleDelete = this._handleDelete.bind(this);
  }

  _handleDelete() {
    const { note, handleDelete } = this.props;
    handleDelete(note);
  }

  parseNote(note) {
    return ({
      __html: window.md.makeHtml(note.escape('note'))
    });
  }

  renderDelete() {
    return (
      <span>
        - <span
            onClick={this._handleDelete}
            title={I18n.t('delete')}
            className='delete-btn delete-note'
          >
          { I18n.t('delete') }
        </span>
      </span>
    );
  }

  render() {
    const { note, disabled } = this.props;
    return (
      <div className="note">
        <div dangerouslySetInnerHTML={this.parseNote(note)}></div>
        <div className="note_meta">
          <span className="user"> { note.get('user_name') } </span> -
          <span className="created_at"> { note.get('created_at') } </span>
          { !disabled && this.renderDelete() }
        </div>
      </div>
    );
  }
}

export default Note;
